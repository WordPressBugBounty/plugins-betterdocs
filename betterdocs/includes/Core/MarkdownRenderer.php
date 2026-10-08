<?php

namespace WPDeveloper\BetterDocs\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

use WPDeveloper\BetterDocs\Utils\Database;

/**
 * Render a doc as Markdown.
 *
 * AI assistants consume plain Markdown far more reliably than themed HTML, so
 * every published doc is convertible to a clean Markdown document. Two output
 * profiles are supported:
 *
 *   - `endpoint` — YAML front matter + `# Title` + body. What `<doc-url>.md`
 *                  serves, and what AI crawlers index.
 *   - `copy`     — `# Title`, blockquoted description, `Source:` line, body.
 *                  What the "Copy page" button puts on the clipboard; no YAML,
 *                  because a human is about to paste this into a chat box.
 *
 * The body is produced by running the real `the_content` filter (so blocks,
 * shortcodes and embeds resolve exactly as they do on the page) and then walking
 * the resulting DOM. A node-removal pass first strips chrome that is meaningless
 * outside a browser — code-snippet toolbars, heading anchor links, glossary
 * tooltips, scripts.
 *
 * @since 4.8.0
 */
class MarkdownRenderer {
	/**
	 * Cached body Markdown (no front matter — that is assembled per context at
	 * request time, so one blob serves both profiles).
	 */
	const META_BODY = '_betterdocs_markdown';

	/** Signature the cached body was generated from. */
	const META_SIG = '_betterdocs_markdown_sig';

	/** Cache namespace for Database::get_cache_version(). */
	const CACHE_NS = 'markdown';

	/**
	 * @var Settings
	 */
	protected $settings;

	/**
	 * @var Database
	 */
	protected $database;

	/**
	 * Re-entrancy guard. `the_content` can be filtered from inside a page that is
	 * already rendering `the_content` (a shortcode placed inside a doc), which
	 * would recurse forever.
	 *
	 * @var bool
	 */
	protected $rendering = false;

	public function __construct( Settings $settings, Database $database ) {
		$this->settings = $settings;
		$this->database = $database;

		// Bust one doc's cache when it is saved. `wp_after_insert_post` — NOT
		// `save_post_docs` — because terms are not written yet at `save_post`, and
		// the front matter carries the category and tags.
		add_action( 'wp_after_insert_post', [ $this, 'flush_post' ], 10, 2 );

		// Term renames and settings changes affect every doc's front matter, so bump
		// the namespace version instead of walking the post table.
		add_action( 'edited_doc_category', [ $this, 'flush_all' ] );
		add_action( 'edited_doc_tag', [ $this, 'flush_all' ] );
		add_action( 'delete_term', [ $this, 'flush_all' ] );
		add_action( 'update_option_betterdocs_settings', [ $this, 'flush_all' ] );
	}

	/**
	 * Whether Markdown may be produced for this doc at all.
	 *
	 * The single gate both the `.md` endpoint and the AI Actions UI consult, so a
	 * doc that cannot be served also never renders a button pointing at it.
	 *
	 * @param \WP_Post|int|null $post
	 * @return bool
	 */
	public function can_read( $post ) {
		$post = get_post( $post );

		if ( ! $post instanceof \WP_Post || 'docs' !== $post->post_type ) {
			return false;
		}

		// Drafts, pending and private docs are readable only by someone who could
		// read them in the admin.
		if ( 'publish' !== $post->post_status && ! current_user_can( 'read_post', $post->ID ) ) {
			return false;
		}

		// Deliberately no `?password=` query-arg escape hatch (unlike REST\Docs):
		// the cookie is already present on a front-end request, and a password in a
		// GET would leak into referrers, server logs and the LLM prompt.
		if ( post_password_required( $post ) ) {
			return false;
		}

		/**
		 * Gate Markdown output for a doc.
		 *
		 * BetterDocs Pro hooks its Content Restriction / Access Control check here so
		 * a restricted doc cannot be exfiltrated through `.md`.
		 *
		 * @since 4.8.0
		 *
		 * @param bool     $can_read
		 * @param \WP_Post $post
		 */
		return (bool) apply_filters( 'betterdocs_markdown_can_read', true, $post );
	}

	/**
	 * Full Markdown document for a doc.
	 *
	 * @param \WP_Post|int|null $post
	 * @param string            $context `endpoint` | `copy`
	 * @return string Empty string when the caller is not entitled to the content.
	 */
	public function render( $post, $context = 'endpoint' ) {
		$post = get_post( $post );

		if ( ! $this->can_read( $post ) ) {
			return '';
		}

		$body = $this->body( $post );

		return $this->front_matter( $post, $context, $body ) . $body . "\n";
	}

	/**
	 * Body Markdown only, cached.
	 *
	 * @param \WP_Post $post
	 * @return string
	 */
	public function body( $post ) {
		$signature = $this->signature( $post );
		$cacheable = $this->cacheable( $post );

		if ( $cacheable ) {
			$cached = get_post_meta( $post->ID, self::META_BODY, true );
			if ( is_string( $cached ) && '' !== $cached
				&& $signature === get_post_meta( $post->ID, self::META_SIG, true ) ) {
				return $cached;
			}
		}

		$body = $this->html_to_markdown( $this->content_html( $post ) );

		if ( $cacheable && '' !== $body ) {
			update_post_meta( $post->ID, self::META_BODY, $body );
			update_post_meta( $post->ID, self::META_SIG, $signature );
		}

		return $body;
	}

	/**
	 * Only published, unprotected, non-preview docs are worth persisting. Anything
	 * else is either transient or user-specific.
	 *
	 * The cache is shared by every reader, so it may only hold what an anonymous
	 * visitor would get. A logged-in reader's render can differ — membership
	 * plugins, "logged-in only" blocks and per-user shortcodes run inside
	 * the_content — so it is neither stored (it would be served to guests) nor
	 * read (a guest's render would be served to the member).
	 *
	 * @param \WP_Post $post
	 * @return bool
	 */
	protected function cacheable( $post ) {
		$cacheable = 'publish' === $post->post_status
			&& ! post_password_required( $post )
			&& ! is_preview()
			&& ! is_user_logged_in();

		/**
		 * Whether a doc's rendered Markdown may be stored and reused for other
		 * readers. Return false for content that varies by visitor.
		 *
		 * @since 4.8.0
		 *
		 * @param bool     $cacheable
		 * @param \WP_Post $post
		 */
		return (bool) apply_filters( 'betterdocs_markdown_cacheable', $cacheable, $post );
	}

	/**
	 * @param \WP_Post $post
	 * @return string
	 */
	protected function signature( $post ) {
		return md5(
			implode(
				'|',
				[
					$post->post_content,
					$post->post_title,
					$post->post_modified_gmt,
					defined( 'BETTERDOCS_VERSION' ) ? BETTERDOCS_VERSION : '',
					get_locale(),
					(string) $this->database->get_cache_version( self::CACHE_NS )
				]
			)
		);
	}

	/**
	 * Drop one doc's cached Markdown.
	 *
	 * @param int      $post_id
	 * @param \WP_Post $post
	 */
	public function flush_post( $post_id, $post = null ) {
		if ( $post instanceof \WP_Post && 'docs' !== $post->post_type ) {
			return;
		}
		delete_post_meta( $post_id, self::META_BODY );
		delete_post_meta( $post_id, self::META_SIG );
	}

	/**
	 * Invalidate every doc's cached Markdown by bumping the namespace version.
	 */
	public function flush_all() {
		$this->database->bump_cache_version( self::CACHE_NS );
	}

	/**
	 * Purge every stored Markdown blob. Called when the endpoint is switched off so
	 * a disabled feature stops occupying postmeta.
	 *
	 * @global \wpdb $wpdb
	 */
	public function purge() {
		global $wpdb;
		$wpdb->delete( $wpdb->postmeta, [ 'meta_key' => self::META_BODY ] ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
		$wpdb->delete( $wpdb->postmeta, [ 'meta_key' => self::META_SIG ] );  // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
	}

	/* ---------------------------------------------------------------------------
	 * Front matter
	 * ------------------------------------------------------------------------- */

	/**
	 * @param \WP_Post $post
	 * @param string   $context
	 * @param string   $body Already-rendered body, used to derive a description.
	 * @return string
	 */
	protected function front_matter( $post, $context, $body ) {
		// get_the_title() runs the `the_title` filters, so an ampersand comes back as
		// `&#038;`. Markdown is not HTML — entities have to be decoded or they show up
		// literally in the model's context.
		$title       = $this->decode( get_the_title( $post ) );
		$permalink   = get_permalink( $post );
		$description = $this->decode( $this->description( $post, $body ) );

		$data = [
			'title'       => $title,
			'description' => $description,
			'url'         => $permalink,
			'updated'     => get_post_modified_time( 'Y-m-d', true, $post ),
			'category'    => $this->category_path( $post ),
			'tags'        => wp_get_post_terms( $post->ID, 'doc_tag', [ 'fields' => 'names' ] )
		];

		if ( is_wp_error( $data['tags'] ) ) {
			$data['tags'] = [];
		}
		$data['tags'] = array_map( [ $this, 'decode' ], $data['tags'] );

		/**
		 * Filter the Markdown front-matter data before it is serialised.
		 *
		 * @since 4.8.0
		 *
		 * @param array    $data
		 * @param \WP_Post $post
		 * @param string   $context `endpoint` | `copy`
		 */
		$data = (array) apply_filters( 'betterdocs_markdown_front_matter', $data, $post, $context );

		if ( 'copy' === $context ) {
			// Human-facing: no YAML, because this is about to be pasted into a chat.
			$out = '# ' . $data['title'] . "\n\n";
			if ( ! empty( $data['description'] ) ) {
				$out .= '> ' . $data['description'] . "\n\n";
			}
			if ( ! empty( $data['url'] ) ) {
				$out .= 'Source: ' . $data['url'] . "\n\n";
			}

			return $out;
		}

		$out = "---\n";
		foreach ( $data as $key => $value ) {
			if ( is_array( $value ) ) {
				if ( empty( $value ) ) {
					continue;
				}
				$out .= $key . ":\n";
				foreach ( $value as $item ) {
					$out .= '  - ' . $this->yaml_scalar( $item ) . "\n";
				}
				continue;
			}
			if ( '' === (string) $value ) {
				continue;
			}
			$out .= $key . ': ' . $this->yaml_scalar( $value ) . "\n";
		}
		$out .= "---\n\n";
		$out .= '# ' . $data['title'] . "\n\n";

		return $out;
	}

	/**
	 * The doc's own excerpt when it has one, otherwise the opening of the body.
	 *
	 * `get_the_excerpt()` is avoided on purpose — it fires the `the_excerpt`
	 * filters, which other plugins use to append read-more markup.
	 *
	 * @param \WP_Post $post
	 * @param string   $body
	 * @return string
	 */
	protected function description( $post, $body ) {
		if ( ! empty( $post->post_excerpt ) ) {
			return trim( wp_strip_all_tags( $post->post_excerpt ) );
		}

		return trim( wp_trim_words( wp_strip_all_tags( $body ), 40, '…' ) );
	}

	/**
	 * Full hierarchical category path, e.g. "Getting Started / Installation".
	 *
	 * @param \WP_Post $post
	 * @return string
	 */
	protected function category_path( $post ) {
		$terms = get_the_terms( $post->ID, 'doc_category' );
		if ( is_wp_error( $terms ) || empty( $terms ) ) {
			return '';
		}

		$term  = $terms[0];
		$names = [ $term->name ];

		foreach ( get_ancestors( $term->term_id, 'doc_category', 'taxonomy' ) as $ancestor_id ) {
			$ancestor = get_term( $ancestor_id, 'doc_category' );
			if ( $ancestor && ! is_wp_error( $ancestor ) ) {
				array_unshift( $names, $ancestor->name );
			}
		}

		return $this->decode( implode( ' / ', $names ) );
	}

	/**
	 * Turn HTML entities back into the characters they stand for.
	 *
	 * @param string $text
	 * @return string
	 */
	protected function decode( $text ) {
		return html_entity_decode( (string) $text, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
	}

	/**
	 * Quote a YAML scalar only when it would otherwise break the mapping.
	 *
	 * @param mixed $value
	 * @return string
	 */
	protected function yaml_scalar( $value ) {
		$value = (string) $value;

		if ( '' === $value ) {
			return '""';
		}
		// Line breaks would end the scalar and start a new key; inside double
		// quotes a backslash starts an escape, so it is escaped first.
		if ( preg_match( '/[:#\-\[\]\{\}&\*!\|>\'"%@`\r\n\t]/', $value ) || preg_match( '/^\s|\s$/', $value ) ) {
			return '"' . str_replace( [ '\\', '"', "\r", "\n", "\t" ], [ '\\\\', '\"', '\r', '\n', '\t' ], $value ) . '"';
		}

		return $value;
	}

	/* ---------------------------------------------------------------------------
	 * the_content pipeline
	 * ------------------------------------------------------------------------- */

	/**
	 * Rendered HTML for a doc, with the filters that only make sense in a browser
	 * temporarily unhooked.
	 *
	 * @param \WP_Post $post
	 * @return string
	 */
	protected function content_html( $post ) {
		if ( $this->rendering ) {
			return '';
		}
		$this->rendering = true;

		global $wp_query;

		$prev_post   = isset( $GLOBALS['post'] ) ? $GLOBALS['post'] : null;
		$prev_inloop = isset( $wp_query->in_the_loop ) ? $wp_query->in_the_loop : false;

		// Dynamic blocks and Pro's glossary wrapper read the global $post, so the
		// loop has to be standing before `the_content` runs.
		$GLOBALS['post'] = $post;
		if ( isset( $wp_query ) ) {
			$wp_query->in_the_loop = true;
		}
		setup_postdata( $post );

		// Presentation-only filters. `do_blocks`, `wpautop`, `do_shortcode` and
		// `WP_Embed::autoembed` all stay — removing autoembed makes do_shortcode
		// delete the bare URL outright instead of leaving it as text.
		$removed = [
			[ 'wptexturize', 10 ],            // smart quotes corrupt CLI and code samples
			[ 'capital_P_dangit', 11 ],       // rewrites "Wordpress" inside code samples
			[ 'wp_filter_content_tags', 12 ], // srcset/sizes/loading/decoding noise
			[ 'convert_smilies', 20 ]         // ":)" becomes <img class="wp-smiley">
		];

		foreach ( $removed as $filter ) {
			remove_filter( 'the_content', $filter[0], $filter[1] );
		}

		try {
			$html = apply_filters( 'the_content', $post->post_content );
		} finally {
			foreach ( $removed as $filter ) {
				add_filter( 'the_content', $filter[0], $filter[1] );
			}

			if ( isset( $wp_query ) ) {
				$wp_query->in_the_loop = $prev_inloop;
			}
			$GLOBALS['post'] = $prev_post;
			wp_reset_postdata();

			$this->rendering = false;
		}

		return (string) $html;
	}

	/* ---------------------------------------------------------------------------
	 * HTML -> Markdown
	 * ------------------------------------------------------------------------- */

	/**
	 * Convert an HTML fragment to Markdown by walking the DOM.
	 *
	 * @param string $html
	 * @return string
	 */
	public function html_to_markdown( $html ) {
		if ( '' === trim( (string) $html ) ) {
			return '';
		}

		// ext-dom is not a declared requirement (see composer.json), and
		// Core\SampleDocBuilder already guards for it. Degrade to plain text rather
		// than fataling on a host without php-xml.
		if ( ! class_exists( '\DOMDocument' ) ) {
			return trim( wp_strip_all_tags( $html ) );
		}

		$dom = new \DOMDocument();
		libxml_use_internal_errors( true );
		$dom->loadHTML(
			'<?xml encoding="utf-8"?><body>' . $html . '</body>',
			LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
		);
		libxml_clear_errors();

		$this->prune( $dom );

		$body = $dom->getElementsByTagName( 'body' )->item( 0 );
		$md   = $body ? $this->children_md( $body ) : wp_strip_all_tags( $html );

		$md = preg_replace( "/[ \t]+\n/", "\n", $md ); // trailing spaces
		$md = preg_replace( "/\n{3,}/", "\n\n", $md ); // collapse blank runs

		return trim( $md );
	}

	/**
	 * Strip browser-only chrome before the walk, and unwrap glossary tooltips so
	 * the defined term survives as plain text.
	 *
	 * @param \DOMDocument $dom
	 */
	protected function prune( $dom ) {
		$xpath = new \DOMXPath( $dom );

		/**
		 * XPath queries for nodes removed before HTML is converted to Markdown.
		 *
		 * @since 4.8.0
		 *
		 * @param string[] $queries
		 */
		$queries = (array) apply_filters(
			'betterdocs_markdown_remove_selectors',
			[
				'//script',
				'//style',
				'//noscript',
				'//svg',
				'//form',
				'//button',
				'//*[@aria-hidden="true"]',
				'//*[' . $this->has_class( 'screen-reader-text' ) . ']',
				'//*[' . $this->has_class( 'betterdocs-sr-only' ) . ']',
				'//*[' . $this->has_class( 'betterdocs-ai-actions' ) . ']',
				'//*[' . $this->has_class( 'betterdocs-code-snippet-header' ) . ']',
				'//*[' . $this->has_class( 'betterdocs-code-snippet-line-numbers' ) . ']',
				// Heading permalink anchors injected by FrontEnd\TemplateTags.
				'//a[' . $this->has_class( 'batterdocs-anchor' ) . ']'
			]
		);

		foreach ( $queries as $query ) {
			$nodes = $xpath->query( $query );
			if ( ! $nodes ) {
				continue;
			}
			foreach ( iterator_to_array( $nodes ) as $node ) {
				if ( $node->parentNode ) {
					$node->parentNode->removeChild( $node );
				}
			}
		}

		// Glossary tooltips are BetterDocs Pro's only `the_content` injector. Keep
		// the term, drop the tooltip markup wrapped around it.
		$tooltips = $xpath->query( '//*[' . $this->has_class( 'glossary-tooltip-container' ) . ']' );
		if ( $tooltips ) {
			foreach ( iterator_to_array( $tooltips ) as $node ) {
				$this->unwrap( $node );
			}
		}
	}

	/**
	 * XPath predicate matching one class name, whitespace-safe.
	 *
	 * @param string $class
	 * @return string
	 */
	protected function has_class( $class ) {
		return 'contains(concat(" ", normalize-space(@class), " "), " ' . $class . ' ")';
	}

	/**
	 * Replace an element with its own child nodes.
	 *
	 * @param \DOMNode $node
	 */
	protected function unwrap( $node ) {
		if ( ! $node->parentNode ) {
			return;
		}
		while ( $node->firstChild ) {
			$node->parentNode->insertBefore( $node->firstChild, $node );
		}
		$node->parentNode->removeChild( $node );
	}

	/**
	 * @param \DOMNode $node
	 * @param bool     $in_code Inside <pre>/<code>, where Markdown is not escaped.
	 * @return string
	 */
	protected function children_md( $node, $in_code = false ) {
		$out = '';
		foreach ( $node->childNodes as $child ) {
			$out .= $this->node_to_md( $child, $in_code );
		}

		return $out;
	}

	/**
	 * @param \DOMNode $node
	 * @param bool     $in_code
	 * @return string
	 */
	protected function node_to_md( $node, $in_code = false ) {
		if ( XML_TEXT_NODE === $node->nodeType ) {
			$text = preg_replace( '/\s+/', ' ', $node->nodeValue );

			return $in_code ? $text : $this->escape( $text );
		}
		if ( XML_ELEMENT_NODE !== $node->nodeType ) {
			return '';
		}

		$tag = strtolower( $node->nodeName );

		// BetterDocs code snippets carry their own toolbar and line-number column;
		// the toolbar is already pruned, so emit just the code with its language.
		if ( 'div' === $tag && $this->node_has_class( $node, 'betterdocs-code-snippet-wrapper' ) ) {
			return $this->fence( $node->textContent, $node->getAttribute( 'data-language' ) );
		}

		$inner = $this->children_md( $node, $in_code );

		switch ( $tag ) {
			case 'h1':
			case 'h2':
			case 'h3':
			case 'h4':
			case 'h5':
			case 'h6':
				return "\n\n" . str_repeat( '#', (int) substr( $tag, 1 ) ) . ' ' . trim( $inner ) . "\n\n";

			case 'p':
				return "\n\n" . trim( $inner ) . "\n\n";

			case 'br':
				return "  \n";

			case 'hr':
				return "\n\n---\n\n";

			case 'strong':
			case 'b':
				return '' === trim( $inner ) ? '' : '**' . trim( $inner ) . '**';

			case 'em':
			case 'i':
				return '' === trim( $inner ) ? '' : '*' . trim( $inner ) . '*';

			case 'del':
			case 's':
			case 'strike':
				return '' === trim( $inner ) ? '' : '~~' . trim( $inner ) . '~~';

			case 'mark':
				return trim( $inner );

			case 'kbd':
			case 'samp':
				return '`' . trim( $node->textContent ) . '`';

			case 'sup':
				return '^' . trim( $inner );

			case 'sub':
				return '~' . trim( $inner );

			case 'a':
				$href = $node->getAttribute( 'href' );
				$text = trim( $inner );
				if ( '' === $href ) {
					return $text;
				}

				return '[' . ( '' === $text ? $href : $text ) . '](' . $href . ')';

			case 'img':
				$src = $node->getAttribute( 'src' );

				return '' === $src ? '' : '![' . $this->escape( $node->getAttribute( 'alt' ) ) . '](' . $src . ')';

			case 'figure':
				return "\n\n" . trim( $inner ) . "\n\n";

			case 'figcaption':
				return '' === trim( $inner ) ? '' : "\n" . trim( $inner ) . "\n";

			case 'iframe':
				$src = $node->getAttribute( 'src' );
				if ( '' === $src ) {
					return '';
				}
				$label = $node->getAttribute( 'title' );

				return "\n\n[" . ( '' === $label ? $src : $this->escape( $label ) ) . '](' . $src . ")\n\n";

			case 'code':
				// Inline code only; fenced blocks are handled by <pre>.
				return '`' . trim( $node->textContent ) . '`';

			case 'pre':
				return $this->fence( $node->textContent, $this->language_of( $node ) );

			case 'blockquote':
				$quote = trim( $this->children_md( $node, $in_code ) );

				return "\n\n" . preg_replace( '/^/m', '> ', $quote ) . "\n\n";

			case 'ul':
				return "\n\n" . $this->list_md( $node, false ) . "\n\n";

			case 'ol':
				return "\n\n" . $this->list_md( $node, true ) . "\n\n";

			case 'table':
				return $this->table_md( $node );

			case 'dl':
				return "\n\n" . trim( $inner ) . "\n\n";

			case 'dt':
				return "\n" . '**' . trim( $inner ) . '**' . "\n";

			case 'dd':
				return ': ' . trim( $inner ) . "\n";

			default:
				return $inner; // unwrap unknown containers (div/span/section/…)
		}
	}

	/**
	 * Escape the Markdown metacharacters that would otherwise reformat prose.
	 *
	 * Intra-word underscores are deliberately left alone: CommonMark does not treat
	 * them as emphasis, so escaping them only makes identifiers like `my_var` uglier
	 * for the model reading them.
	 *
	 * @param string $text
	 * @return string
	 */
	protected function escape( $text ) {
		return preg_replace( '/([\\\\`\*\[\]])/', '\\\\$1', (string) $text );
	}

	/**
	 * @param \DOMNode $node
	 * @param string   $class
	 * @return bool
	 */
	protected function node_has_class( $node, $class ) {
		if ( ! $node instanceof \DOMElement ) {
			return false;
		}

		return in_array( $class, preg_split( '/\s+/', trim( $node->getAttribute( 'class' ) ) ), true );
	}

	/**
	 * Language hint for a fenced block, read from the usual `language-*` class on
	 * the <pre> or its child <code>.
	 *
	 * @param \DOMNode $node
	 * @return string
	 */
	protected function language_of( $node ) {
		$candidates = [ $node ];

		foreach ( $node->childNodes as $child ) {
			if ( XML_ELEMENT_NODE === $child->nodeType && 'code' === strtolower( $child->nodeName ) ) {
				$candidates[] = $child;
			}
		}

		foreach ( $candidates as $candidate ) {
			if ( ! $candidate instanceof \DOMElement ) {
				continue;
			}
			if ( preg_match( '/(?:language|lang|brush:)[-\s]([a-z0-9#+_-]+)/i', $candidate->getAttribute( 'class' ), $m ) ) {
				return strtolower( $m[1] );
			}
		}

		return '';
	}

	/**
	 * @param string $code
	 * @param string $language
	 * @return string
	 */
	protected function fence( $code, $language = '' ) {
		$code = rtrim( ltrim( (string) $code, "\r\n" ) );

		if ( '' === trim( $code ) ) {
			return '';
		}

		// Use a longer fence when the snippet itself contains a triple backtick.
		$fence = preg_match( '/^\s*```/m', $code ) ? '````' : '```';

		return "\n\n" . $fence . $language . "\n" . $code . "\n" . $fence . "\n\n";
	}

	/**
	 * @param \DOMNode $node    The <ul>/<ol> element.
	 * @param bool     $ordered
	 * @return string
	 */
	protected function list_md( $node, $ordered ) {
		$lines = [];
		$index = 1;

		foreach ( $node->childNodes as $li ) {
			if ( XML_ELEMENT_NODE !== $li->nodeType || 'li' !== strtolower( $li->nodeName ) ) {
				continue;
			}

			$marker  = $ordered ? ( $index++ . '. ' ) : '- ';
			$content = trim( $this->children_md( $li ) );

			// Collapse blank lines inside the item so a nested list attaches directly
			// under its parent marker, then indent continuation lines to the marker
			// width (2 for "- ", 3 for "1. ").
			$content = preg_replace( "/\n{2,}/", "\n", $content );
			$content = str_replace( "\n", "\n" . str_repeat( ' ', strlen( $marker ) ), $content );

			$lines[] = $marker . $content;
		}

		return implode( "\n", $lines );
	}

	/**
	 * Convert a <table> to a GFM pipe table. Falls back to unwrapped text when the
	 * table has no rows we can line up.
	 *
	 * @param \DOMNode $node
	 * @return string
	 */
	protected function table_md( $node ) {
		$dom  = $node->ownerDocument;
		$rows = [];

		$tr_nodes = ( new \DOMXPath( $dom ) )->query( './/tr', $node );
		if ( ! $tr_nodes || 0 === $tr_nodes->length ) {
			return "\n\n" . trim( $this->children_md( $node ) ) . "\n\n";
		}

		foreach ( $tr_nodes as $tr ) {
			$cells = [];
			foreach ( $tr->childNodes as $cell ) {
				if ( XML_ELEMENT_NODE !== $cell->nodeType ) {
					continue;
				}
				$name = strtolower( $cell->nodeName );
				if ( 'td' !== $name && 'th' !== $name ) {
					continue;
				}
				// A pipe table cell is a single line; a literal pipe must be escaped.
				$text    = trim( preg_replace( "/\s*\n\s*/", ' ', $this->children_md( $cell ) ) );
				$cells[] = str_replace( '|', '\|', $text );
			}
			if ( $cells ) {
				$rows[] = $cells;
			}
		}

		if ( ! $rows ) {
			return '';
		}

		$columns = max( array_map( 'count', $rows ) );
		$header  = array_shift( $rows );
		$header  = array_pad( $header, $columns, '' );

		$out  = '| ' . implode( ' | ', $header ) . " |\n";
		$out .= '| ' . implode( ' | ', array_fill( 0, $columns, '---' ) ) . " |\n";

		foreach ( $rows as $row ) {
			$out .= '| ' . implode( ' | ', array_pad( $row, $columns, '' ) ) . " |\n";
		}

		return "\n\n" . rtrim( $out ) . "\n\n";
	}
}
