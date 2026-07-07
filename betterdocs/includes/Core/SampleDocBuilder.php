<?php

namespace WPDeveloper\BetterDocs\Core;

use WP_Error;

/**
 * SampleDocBuilder — Phase 4 of the AI "Generate Sample Docs" feature.
 *
 * Turns the proxy's structured response into real BetterDocs content:
 * doc/FAQ categories (terms) + articles (posts), preserving order. Everything
 * created is flagged with the `_betterdocs_sample` meta so it can be removed
 * cleanly via undo().
 *
 * @since 4.5.3
 */
class SampleDocBuilder {
	/** Meta key flagging sample posts and terms we created. */
	const SAMPLE_META = '_betterdocs_sample';

	/**
	 * Post type + taxonomy per content type.
	 *
	 * @var array
	 */
	const MAP = [
		'docs'        => [ 'post_type' => 'docs', 'taxonomy' => 'doc_category' ],
		'faq'         => [ 'post_type' => 'betterdocs_faq', 'taxonomy' => 'betterdocs_faq_category' ],
		'product_faq' => [ 'post_type' => 'betterdocs_faq', 'taxonomy' => 'betterdocs_product_faq_category' ],
	];

	/**
	 * Create terms + posts from the (already sanitized) categories array.
	 *
	 * @param array  $categories   [{ name, description, articles:[{title,content_html,excerpt}] }]
	 * @param string $content_type 'docs' | 'faq'
	 * @return array|WP_Error      Summary on success.
	 */
	public function build( array $categories, $content_type = 'docs' ) {
		$map = $this->map( $content_type );
		if ( null === $map ) {
			return new WP_Error( 'invalid_content_type', __( 'Unknown content type.', 'betterdocs' ) );
		}

		if ( empty( $categories ) ) {
			return new WP_Error( 'no_categories', __( 'No categories to create.', 'betterdocs' ) );
		}

		// Idempotency guard: if sample content for this type already exists (e.g. a
		// duplicate insert call, which the UI prevents but a direct REST call does
		// not), return the existing summary instead of creating duplicate posts.
		// Regeneration is expected to undo() first, which clears these.
		$existing = $this->existing_sample( $map );
		if ( $existing['categories'] > 0 || $existing['articles'] > 0 ) {
			return array_merge( [ 'content_type' => $content_type, 'already_exists' => true ], $existing );
		}

		$created_terms = [];
		$created_posts = [];

		foreach ( $categories as $cat_index => $category ) {
			if ( empty( $category['name'] ) ) {
				continue;
			}

			$term_id = $this->ensure_term( $category, $map['taxonomy'] );
			if ( is_wp_error( $term_id ) || ! $term_id ) {
				continue;
			}
			$created_terms[] = $term_id;

			$articles = isset( $category['articles'] ) && is_array( $category['articles'] ) ? $category['articles'] : [];
			foreach ( array_values( $articles ) as $order => $article ) {
				$title = is_array( $article ) ? ( $article['title'] ?? '' ) : (string) $article;
				if ( '' === trim( $title ) ) {
					continue;
				}

				$content = is_array( $article ) ? ( $article['content_html'] ?? '' ) : '';
				$excerpt = is_array( $article ) ? ( $article['excerpt'] ?? '' ) : '';

				$post_id = wp_insert_post(
					[
						'post_type'    => $map['post_type'],
						'post_title'   => wp_strip_all_tags( $title ),
						'post_content' => $this->html_to_blocks( $content ),
						'post_excerpt' => sanitize_text_field( $excerpt ),
						'post_status'  => 'publish',
						'menu_order'   => $order,
					],
					true
				);

				if ( is_wp_error( $post_id ) ) {
					continue;
				}

				wp_set_object_terms( $post_id, [ (int) $term_id ], $map['taxonomy'] );
				update_post_meta( $post_id, self::SAMPLE_META, 1 );
				$created_posts[] = $post_id;
			}
		}

		/**
		 * Fires after sample content is created (telemetry/integration hook).
		 *
		 * @param array  $created_posts
		 * @param array  $created_terms
		 * @param string $content_type
		 */
		do_action( 'betterdocs_sample_docs_created', $created_posts, $created_terms, $content_type );

		return [
			'content_type' => $content_type,
			'categories'   => count( $created_terms ),
			'articles'     => count( $created_posts ),
			'term_ids'     => $created_terms,
			'post_ids'     => $created_posts,
		];
	}

	/**
	 * Remove exactly the sample content we created for a content type.
	 *
	 * @param string $content_type 'docs' | 'faq'
	 * @return array Counts removed.
	 */
	public function undo( $content_type = 'docs' ) {
		$map = $this->map( $content_type );
		if ( null === $map ) {
			return [ 'categories' => 0, 'articles' => 0 ];
		}

		// 1. Delete flagged posts. Scope by taxonomy as well as post type: General
		// FAQs and Product FAQs share the `betterdocs_faq` post type, so the
		// taxonomy is what keeps "undo" from removing the other scope's samples.
		$posts = get_posts(
			[
				'post_type'      => $map['post_type'],
				'post_status'    => 'any',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'meta_key'       => self::SAMPLE_META, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_value'     => 1, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
				'tax_query'      => [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
					[
						'taxonomy' => $map['taxonomy'],
						'operator' => 'EXISTS',
					],
				],
			]
		);
		foreach ( $posts as $post_id ) {
			wp_delete_post( $post_id, true );
		}

		// 2. Delete flagged terms.
		$terms = get_terms(
			[
				'taxonomy'   => $map['taxonomy'],
				'hide_empty' => false,
				'fields'     => 'ids',
				'meta_key'   => self::SAMPLE_META, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_value' => 1, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
			]
		);
		$term_count = 0;
		if ( ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term_id ) {
				wp_delete_term( $term_id, $map['taxonomy'] );
				$term_count++;
			}
		}

		do_action( 'betterdocs_sample_docs_removed', $content_type );

		return [
			'content_type' => $content_type,
			'categories'   => $term_count,
			'articles'     => count( $posts ),
		];
	}

	/* --------------------------------------------------------------------- */

	/**
	 * Collect the sample content already created for a content type, so build()
	 * stays idempotent against duplicate insert calls.
	 *
	 * @return array { categories, articles, term_ids, post_ids }
	 */
	protected function existing_sample( array $map ) {
		$post_ids = get_posts(
			[
				'post_type'      => $map['post_type'],
				'post_status'    => 'any',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'meta_key'       => self::SAMPLE_META, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_value'     => 1, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
				'tax_query'      => [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
					[
						'taxonomy' => $map['taxonomy'],
						'operator' => 'EXISTS',
					],
				],
			]
		);

		$term_ids = get_terms(
			[
				'taxonomy'   => $map['taxonomy'],
				'hide_empty' => false,
				'fields'     => 'ids',
				'meta_key'   => self::SAMPLE_META, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_value' => 1, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
			]
		);
		$term_ids = is_wp_error( $term_ids ) ? [] : $term_ids;

		return [
			'categories' => count( $term_ids ),
			'articles'   => count( $post_ids ),
			'term_ids'   => array_map( 'intval', $term_ids ),
			'post_ids'   => array_map( 'intval', $post_ids ),
		];
	}

	/**
	 * Create the category term (or reuse an existing one) and flag it if new.
	 *
	 * @return int|WP_Error
	 */
	protected function ensure_term( array $category, $taxonomy ) {
		$name     = sanitize_text_field( $category['name'] );
		$existing = term_exists( $name, $taxonomy );

		if ( $existing && ! empty( $existing['term_id'] ) ) {
			return (int) $existing['term_id'];
		}

		$inserted = wp_insert_term(
			$name,
			$taxonomy,
			[ 'description' => sanitize_text_field( $category['description'] ?? '' ) ]
		);

		if ( is_wp_error( $inserted ) ) {
			return $inserted;
		}

		$term_id = (int) $inserted['term_id'];
		update_term_meta( $term_id, self::SAMPLE_META, 1 );

		// Do NOT flag sample product-FAQ groups as "show on all products". A
		// product FAQ should only appear where the owner explicitly assigns it
		// (by product or category); auto-assigning leaked generated FAQs onto
		// every product page even when nothing was assigned.

		return $term_id;
	}

	/**
	 * Convert the proxy's content HTML into clean Gutenberg block markup.
	 * Each top-level element becomes its matching core block; unknown nodes
	 * fall back to a paragraph. Empty input yields an empty paragraph block.
	 *
	 * @return string
	 */
	protected function html_to_blocks( $html ) {
		$html = trim( (string) $html );
		if ( '' === $html ) {
			return "<!-- wp:paragraph --><p></p><!-- /wp:paragraph -->";
		}

		if ( ! class_exists( '\DOMDocument' ) ) {
			return wp_kses_post( $html );
		}

		$dom = new \DOMDocument();
		libxml_use_internal_errors( true );
		$dom->loadHTML( '<?xml encoding="utf-8"?><div id="bd-root">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		libxml_clear_errors();

		$root = $dom->getElementById( 'bd-root' );
		if ( ! $root ) {
			return wp_kses_post( $html );
		}

		$blocks = '';
		foreach ( $root->childNodes as $node ) {
			$blocks .= $this->node_to_block( $node, $dom );
		}

		return '' !== trim( $blocks ) ? $blocks : wp_kses_post( $html );
	}

	/**
	 * Map a single DOM node to a core block string.
	 *
	 * @return string
	 */
	protected function node_to_block( \DOMNode $node, \DOMDocument $dom ) {
		if ( XML_TEXT_NODE === $node->nodeType ) {
			$text = trim( $node->textContent );
			return '' === $text ? '' : "<!-- wp:paragraph --><p>" . esc_html( $text ) . "</p><!-- /wp:paragraph -->";
		}

		if ( XML_ELEMENT_NODE !== $node->nodeType ) {
			return '';
		}

		$tag  = strtolower( $node->nodeName );
		$html = $dom->saveHTML( $node );

		switch ( $tag ) {
			case 'h1':
			case 'h2':
			case 'h3':
			case 'h4':
			case 'h5':
			case 'h6':
				$level = (int) substr( $tag, 1 );
				return "<!-- wp:heading {\"level\":{$level}} -->{$html}<!-- /wp:heading -->";
			case 'ul':
				return "<!-- wp:list -->{$html}<!-- /wp:list -->";
			case 'ol':
				return "<!-- wp:list {\"ordered\":true} -->{$html}<!-- /wp:list -->";
			case 'blockquote':
				return "<!-- wp:quote -->{$html}<!-- /wp:quote -->";
			case 'pre':
				return "<!-- wp:preformatted -->{$html}<!-- /wp:preformatted -->";
			case 'p':
				return "<!-- wp:paragraph -->{$html}<!-- /wp:paragraph -->";
			default:
				return "<!-- wp:paragraph --><p>" . wp_kses_post( $node->textContent ) . "</p><!-- /wp:paragraph -->";
		}
	}

	/**
	 * @return array|null
	 */
	protected function map( $content_type ) {
		return isset( self::MAP[ $content_type ] ) ? self::MAP[ $content_type ] : null;
	}
}
