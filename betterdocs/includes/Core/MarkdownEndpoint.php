<?php

namespace WPDeveloper\BetterDocs\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Serve docs as Markdown.
 *
 * AI crawlers and assistants consume plain Markdown far more reliably than
 * themed HTML, and the AI Actions menu needs a stable public address it can hand
 * to ChatGPT or Claude. Every doc is exposed through three permalink-agnostic
 * mechanisms — no rewrite rules, so nothing to flush:
 *
 *   1. A `.md` suffix on any doc URL      — /docs/my-doc.md
 *   2. `Accept: text/markdown` negotiation — same URL, header only
 *   3. An explicit `?format=md` query      — /docs/my-doc/?format=md
 *
 * The `.md` suffix is stripped from REQUEST_URI on `init` (before WordPress
 * routes the request) so the doc resolves normally; the Markdown is then emitted
 * on `template_redirect` at priority 100 — after AiTrafficCollector (priority 1,
 * so bot fetches are still counted) and after BetterDocs Pro's Content
 * Restriction redirects (priorities 10 and 99).
 *
 * @since 4.8.0
 */
class MarkdownEndpoint {
	/** Set when the incoming request URL carried a `.md` suffix. */
	protected $md_suffix = false;

	/** Set once Markdown has actually been emitted for this request. */
	protected $served = false;

	/**
	 * @var Settings
	 */
	protected $settings;

	/**
	 * @var MarkdownRenderer
	 */
	protected $renderer;

	public function __construct( Settings $settings, MarkdownRenderer $renderer ) {
		$this->settings = $settings;
		$this->renderer = $renderer;

		// Strip the `.md` suffix NOW rather than on another `init` callback: this
		// class is constructed from inside Plugin::initialize(), which is itself the
		// `init` priority-0 callback, so a hook added here would never fire — that
		// bucket is already being iterated. Running synchronously still puts us ahead
		// of WP::parse_request(), which is all the strip needs.
		$this->maybe_strip_md_suffix();

		add_action( 'template_redirect', [ $this, 'maybe_serve_markdown' ], 100 );

		// A `.md` URL that we decline to serve must not fall through to a themed HTML
		// page — that would be a 200 duplicate of the canonical doc.
		add_action( 'template_redirect', [ $this, 'maybe_reject_md_suffix' ], 101 );

		// Content negotiation without Vary lets a CDN cache the Markdown under the
		// HTML URL's key (and the reverse). DONOTCACHEPAGE is a WordPress-side
		// constant a CDN never sees, so the header has to be on the HTML response too.
		add_filter( 'wp_headers', [ $this, 'vary_accept' ] );

		// BetterDocs Pro shipped this endpoint before it moved into Free. Free wins by
		// registration order, but an older Pro's enabled() is hardcoded true, so make
		// the new setting govern it as well.
		add_filter( 'betterdocs_md_endpoint_enabled', [ $this, 'filter_enabled' ], 5 );

		// Stop occupying postmeta once the feature is switched off.
		add_action( 'update_option_betterdocs_settings', [ $this, 'maybe_purge' ], 10, 2 );
	}

	/**
	 * Whether Markdown output is switched on for this site.
	 *
	 * @return bool
	 */
	public function enabled() {
		$enabled = (bool) $this->settings->get( 'enable_markdown_endpoint' );

		/**
		 * Toggle the Markdown endpoint.
		 *
		 * Kept from BetterDocs Pro, where this endpoint originally shipped.
		 *
		 * @since 4.8.0
		 *
		 * @param bool $enabled
		 */
		return (bool) apply_filters( 'betterdocs_md_endpoint_enabled', $enabled );
	}

	/**
	 * Make the setting govern an older BetterDocs Pro that still ships its own copy.
	 *
	 * @param bool $enabled
	 * @return bool
	 */
	public function filter_enabled( $enabled ) {
		return $enabled && (bool) $this->settings->get( 'enable_markdown_endpoint' );
	}

	/**
	 * The public Markdown address for a doc.
	 *
	 * Pretty permalinks get the Mintlify-style `.md` suffix. Plain permalinks
	 * (`?docs=slug`) and non-published posts — where wp_force_plain_post_permalink()
	 * makes get_permalink() return a query string — fall back to `?format=md`.
	 *
	 * @param \WP_Post|int|null $post
	 * @param string            $context `endpoint` (YAML front matter, the public
	 *                                   address) | `copy` (clipboard profile)
	 * @return string Empty string when the doc has no Markdown address.
	 */
	public function url( $post = null, $context = 'endpoint' ) {
		$post = get_post( $post );

		if ( ! $post instanceof \WP_Post || 'docs' !== $post->post_type || ! $this->enabled() ) {
			return '';
		}

		$permalink = get_permalink( $post );
		if ( ! $permalink ) {
			return '';
		}

		if ( get_option( 'permalink_structure' ) && 'publish' === $post->post_status ) {
			// untrailingslashit() first: WordPress' default structure ends in "/", so
			// naive concatenation would produce "/docs/my-doc/.md". The suffix goes on
			// the path, ahead of any query string a permalink carries (WPML's
			// language parameter: /docs/my-doc/?lang=fr → /docs/my-doc.md?lang=fr).
			$parts = explode( '?', $permalink, 2 );
			$url   = untrailingslashit( $parts[0] ) . '.md' . ( isset( $parts[1] ) ? '?' . $parts[1] : '' );
		} else {
			$url = add_query_arg( 'format', 'md', $permalink );
		}

		if ( 'copy' === $context ) {
			$url = add_query_arg( 'context', 'copy', $url );
		}

		/**
		 * Filter a doc's Markdown URL.
		 *
		 * @since 4.8.0
		 *
		 * @param string   $url
		 * @param \WP_Post $post
		 * @param string   $context
		 */
		return apply_filters( 'betterdocs_markdown_url', $url, $post, $context );
	}

	/**
	 * Which output profile this request is asking for.
	 *
	 * @return string `endpoint` | `copy`
	 */
	protected function requested_context() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- public read-only GET.
		$context = isset( $_GET['context'] ) ? sanitize_key( wp_unslash( $_GET['context'] ) ) : '';

		return 'copy' === $context ? 'copy' : 'endpoint';
	}

	/**
	 * If the request path ends in `.md`, strip it before WordPress routes the
	 * request and remember that Markdown was asked for.
	 *
	 * Runs regardless of the setting so that a `.md` URL still resolves to
	 * something sensible (a redirect) when the feature is switched off, instead of
	 * hard 404ing links that used to work.
	 */
	public function maybe_strip_md_suffix() {
		if ( empty( $_SERVER['REQUEST_URI'] ) ) {
			return;
		}

		// Front-end reads only — never touch admin or AJAX routing.
		if ( is_admin() || wp_doing_ajax() ) {
			return;
		}
		// HEAD as well as GET: crawlers and link checkers probe with HEAD, and a HEAD
		// that 404s where the GET returns 200 makes the URL look broken to them.
		if ( isset( $_SERVER['REQUEST_METHOD'] ) ) {
			$method = strtoupper( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_METHOD'] ) ) );
			if ( 'GET' !== $method && 'HEAD' !== $method ) {
				return;
			}
		}

		/**
		 * Disable `.md` suffix handling entirely, leaving REQUEST_URI untouched.
		 *
		 * @since 4.8.0
		 *
		 * @param bool $strip
		 */
		if ( ! apply_filters( 'betterdocs_markdown_strip_suffix', true ) ) {
			return;
		}

		$uri   = wp_unslash( $_SERVER['REQUEST_URI'] ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- rewritten below, never echoed.
		$parts = explode( '?', $uri, 2 );
		$path  = $parts[0];
		$query = isset( $parts[1] ) ? '?' . $parts[1] : '';

		$trimmed = rtrim( $path, '/' );
		if ( '.md' !== substr( $trimmed, -3 ) ) {
			return;
		}

		// REST routes are not pages: leave `/wp-json/…/foo.md` to the REST server
		// (and to any plugin routing its own `.md` endpoints there).
		if ( false !== strpos( $trimmed, '/' . rest_get_url_prefix() . '/' ) ) {
			return;
		}

		$this->md_suffix = true;

		$new_path = substr( $trimmed, 0, -3 );
		$new_path = ( '' === $new_path ? '/' : trailingslashit( $new_path ) );

		$_SERVER['REQUEST_URI'] = $new_path . $query;
	}

	/**
	 * Does this request want Markdown?
	 *
	 * @return bool
	 */
	protected function wants_markdown() {
		if ( $this->md_suffix ) {
			return true;
		}
		if ( isset( $_GET['format'] ) && 'md' === strtolower( sanitize_key( wp_unslash( $_GET['format'] ) ) ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- public read-only GET.
			return true;
		}
		if ( isset( $_SERVER['HTTP_ACCEPT'] ) ) {
			$accept = strtolower( sanitize_text_field( wp_unslash( $_SERVER['HTTP_ACCEPT'] ) ) );
			if ( false !== strpos( $accept, 'text/markdown' ) || false !== strpos( $accept, 'text/x-markdown' ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Emit the current doc as Markdown and stop, when it was asked for.
	 */
	public function maybe_serve_markdown() {
		if ( ! $this->enabled() || ! $this->wants_markdown() ) {
			return;
		}
		if ( ! is_singular( 'docs' ) || is_preview() ) {
			return;
		}

		$post = get_queried_object();
		if ( ! $post instanceof \WP_Post || 'docs' !== $post->post_type ) {
			return;
		}

		// Password-protected, unpublished and Pro-restricted docs get an explicit
		// refusal. Falling through to the themed HTML page (what BetterDocs Pro did)
		// would put a full HTML document on the reader's clipboard.
		if ( ! $this->renderer->can_read( $post ) ) {
			$this->served = true;
			$this->refuse();
		}

		$markdown = $this->renderer->render( $post, $this->requested_context() );
		if ( '' === $markdown ) {
			$this->served = true;
			$this->refuse();
		}

		$this->served = true;

		// Other plugins' output buffers would prepend their HTML to a text/markdown
		// body, so drop them before we send anything.
		while ( ob_get_level() > 0 ) {
			ob_end_clean();
		}

		if ( ! defined( 'DONOTCACHEPAGE' ) ) {
			define( 'DONOTCACHEPAGE', true );
		}

		if ( ! headers_sent() ) {
			status_header( 200 );

			/**
			 * Filter the Content-Type sent with Markdown output.
			 *
			 * @since 4.8.0
			 *
			 * @param string $content_type
			 */
			header( 'Content-Type: ' . apply_filters( 'betterdocs_markdown_content_type', 'text/markdown; charset=utf-8' ) );

			// Without this Chrome downloads the response instead of rendering it, so
			// "View as Markdown" would silently become "Download as Markdown".
			header( 'Content-Disposition: inline' );
			header( 'X-Robots-Tag: noindex, nofollow', true );
			header( 'X-Content-Type-Options: nosniff' );
			header( 'X-Frame-Options: DENY' );
			header( "Content-Security-Policy: default-src 'none'" );
			header( 'Link: <' . esc_url_raw( get_permalink( $post ) ) . '>; rel="canonical"', false );
			header( 'Last-Modified: ' . gmdate( 'D, d M Y H:i:s', (int) get_post_modified_time( 'U', true, $post ) ) . ' GMT' );
			// A logged-in reader's copy (or a non-public doc) is theirs alone; only
			// what a visitor would get may sit in a shared cache.
			if ( is_user_logged_in() || 'publish' !== $post->post_status ) {
				header( 'Cache-Control: private, no-store, max-age=0' );
			} else {
				header( 'Cache-Control: public, max-age=0, must-revalidate' );
			}
			header( 'Vary: Accept' );
			// Browser-side LLM fetchers read this cross-origin.
			header( 'Access-Control-Allow-Origin: *' );
		}

		echo $markdown; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- plain-text Markdown body.
		exit;
	}

	/**
	 * A `.md` URL we did not serve must not render the themed HTML page: the suffix
	 * was already stripped, so the theme would happily return 200 for a duplicate of
	 * the canonical URL.
	 */
	public function maybe_reject_md_suffix() {
		if ( ! $this->md_suffix || $this->served ) {
			return;
		}

		global $wp_query;

		// Something earlier (e.g. Pro's content restriction) already answered 404:
		// keep it, rather than redirecting and revealing that the doc exists.
		if ( isset( $wp_query ) && $wp_query->is_404() ) {
			return;
		}

		$queried = get_queried_object();

		if ( $queried instanceof \WP_Post ) {
			$permalink = get_permalink( $queried );
			if ( $permalink ) {
				// 302, not 301: it is answered this way only while Markdown is off
				// (or for a page that has none), and browsers keep a 301 forever.
				wp_safe_redirect( $permalink, 302 );
				exit;
			}
		}

		global $wp_query;
		if ( isset( $wp_query ) ) {
			$wp_query->set_404();
		}
		status_header( 404 );
		nocache_headers();
	}

	/**
	 * Refuse to emit Markdown for a doc the requester may not read.
	 */
	protected function refuse() {
		while ( ob_get_level() > 0 ) {
			ob_end_clean();
		}

		if ( ! headers_sent() ) {
			status_header( 403 );
			nocache_headers();
			header( 'Content-Type: text/plain; charset=utf-8' );
			header( 'X-Robots-Tag: noindex, nofollow', true );
		}

		echo esc_html__( 'This document is not available.', 'betterdocs' );
		exit;
	}

	/**
	 * Tell caches that a doc's HTML response varies by Accept, since the same URL
	 * can return Markdown.
	 *
	 * @param array $headers
	 * @return array
	 */
	public function vary_accept( $headers ) {
		if ( ! $this->enabled() || ! is_array( $headers ) ) {
			return $headers;
		}

		// Only docs negotiate, so only docs should vary. Making every response on the
		// site vary by Accept would cut CDN hit rates for no benefit.
		if ( ! is_singular( 'docs' ) ) {
			return $headers;
		}

		if ( ! isset( $headers['Vary'] ) ) {
			$headers['Vary'] = 'Accept';
		} elseif ( false === stripos( $headers['Vary'], 'accept' ) ) {
			$headers['Vary'] .= ', Accept';
		}

		return $headers;
	}

	/**
	 * Drop every cached Markdown blob when the endpoint is switched off.
	 *
	 * @param mixed $old_value
	 * @param mixed $value
	 */
	public function maybe_purge( $old_value, $value ) {
		$was_on = ! empty( $old_value['enable_markdown_endpoint'] );
		$is_on  = ! empty( $value['enable_markdown_endpoint'] );

		if ( $was_on && ! $is_on ) {
			$this->renderer->purge();
		}
	}
}
