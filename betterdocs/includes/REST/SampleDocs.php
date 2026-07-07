<?php

namespace WPDeveloper\BetterDocs\REST;

use WP_REST_Request;
use WPDeveloper\BetterDocs\Core\BaseAPI;
use WPDeveloper\BetterDocs\Core\SiteProfiler;
use WPDeveloper\BetterDocs\Core\Settings;
use WPDeveloper\BetterDocs\Dependencies\DI\Container;

/**
 * REST surface for the AI "Generate Sample Docs" feature (Phase 2).
 *
 * Routes (namespace betterdocs/v1):
 *   POST sample-docs/detect    → SiteProfiler profile + locally suggested categories
 *   POST sample-docs/generate  → signs + forwards to the hosted proxy, returns articles
 *   POST sample-docs/insert    → DocBuilder creates the terms/posts (Phase 4)
 *   POST sample-docs/undo      → DocBuilder removes the flagged sample content (Phase 4)
 *
 * @since 4.5.3
 */
class SampleDocs extends BaseAPI {
	/** Hard caps mirrored on the proxy (Phase 0 contract). */
	const MAX_CATEGORIES          = 3;
	const MAX_ARTICLES_PER_CATEGORY = 3;

	/** Default per-category palette/icons (matches the design mockup). */
	const PALETTE = [ '#00B884', '#3B82F6', '#8B5CF6', '#F59E0B', '#0EA5E9', '#EF4444' ];

	/**
	 * @var SiteProfiler
	 */
	protected $profiler;

	public function __construct( Settings $settings, Container $container, SiteProfiler $profiler ) {
		parent::__construct( $settings, $container );
		$this->profiler = $profiler;
	}

	public function permission_check(): bool {
		return current_user_can( 'edit_docs_settings' );
	}

	public function register() {
		$this->post( 'sample-docs/detect', [ $this, 'detect' ] );
		$this->post( 'sample-docs/generate', [ $this, 'generate' ] );
		$this->post( 'sample-docs/insert', [ $this, 'insert' ] );
		$this->post( 'sample-docs/undo', [ $this, 'undo' ] );
	}

	/**
	 * Detection step — returns the site profile and locally-derived suggested
	 * categories (no AI). Feeds the design's "detecting" + "detected profile" screens.
	 */
	public function detect( WP_REST_Request $request ) {
		if ( ! $this->is_enabled() ) {
			return $this->error( 'feature_disabled', __( 'AI sample docs is disabled.', 'betterdocs' ), 403 );
		}

		$content_type = $this->content_type( $request );
		$profile      = $this->profiler->build( (bool) $request->get_param( 'fresh' ) );

		/**
		 * Telemetry: site detection ran.
		 *
		 * @param string $type         Detected site type.
		 * @param string $content_type docs|faq
		 */
		do_action( 'betterdocs_sample_docs_detected', $profile['type'] ?? 'general', $content_type );

		return $this->success(
			[
				'profile'    => $profile,
				'categories' => $this->suggested_categories( $profile, $content_type ),
			]
		);
	}

	/**
	 * Generation step — signs the request and forwards it to the hosted proxy,
	 * which calls OpenAI and returns structured categories + articles.
	 */
	public function generate( WP_REST_Request $request ) {
		if ( ! $this->is_enabled() ) {
			return $this->error( 'feature_disabled', __( 'AI sample docs is disabled.', 'betterdocs' ), 403 );
		}

		$content_type = $this->content_type( $request );
		$profile      = (array) $request->get_param( 'profile' );
		$categories   = $this->sanitize_categories( (array) $request->get_param( 'categories' ), false, $this->max_categories( $content_type ) );

		if ( empty( $profile ) ) {
			$profile = $this->profiler->build();
		}
		if ( empty( $categories ) ) {
			$categories = $this->suggested_categories( $profile, $content_type );
		}

		// Product FAQs are generated deterministically from the store's real
		// WooCommerce settings — accurate, instant, never generic, and with no
		// AI/proxy round-trip.
		if ( 'product_faq' === $content_type ) {
			return $this->success( $this->build_store_faqs( $profile, $content_type, $categories ) );
		}

		$payload = [
			'profile'    => $profile,
			'categories' => $categories,
			'options'    => [
				'content_type'           => $content_type,
				'maxCategories'          => self::MAX_CATEGORIES,
				'maxArticlesPerCategory' => self::MAX_ARTICLES_PER_CATEGORY,
				'locale'                 => isset( $profile['site']['locale'] ) ? $profile['site']['locale'] : get_locale(),
			],
		];

		$response = $this->call_proxy( $payload );

		if ( is_wp_error( $response ) ) {
			$code = $response->get_error_code();

			/**
			 * Telemetry: generation failed (e.g. quota_exceeded, proxy_error).
			 *
			 * @param string $content_type docs|faq
			 * @param string $code         Error code.
			 */
			do_action( 'betterdocs_sample_docs_generation_failed', $content_type, $code );

			// Typed errors the UI maps to the quota / fallback screens.
			$data   = $response->get_error_data();
			$status = is_array( $data ) && isset( $data['status'] ) ? $data['status'] : 502;

			return $this->error( $code, $response->get_error_message(), $status, [ 'fallback' => 'static' ] );
		}

		/**
		 * Telemetry: generation succeeded.
		 *
		 * @param string $content_type docs|faq
		 * @param int    $count        Number of categories returned.
		 */
		do_action( 'betterdocs_sample_docs_generated', $content_type, count( $response['categories'] ) );

		return $this->success(
			[
				'content_type' => $content_type,
				'categories'   => $response['categories'],
				'meta'         => isset( $response['meta'] ) ? $response['meta'] : [],
			]
		);
	}

	/**
	 * Build the deterministic, store-grounded Product FAQ payload from the site's
	 * real WooCommerce settings (payments, shipping, returns/refunds, account). This
	 * is the primary generator for product_faq — accurate, instant, and AI-free.
	 *
	 * @return array { content_type, categories, meta }
	 */
	protected function build_store_faqs( $profile, $content_type, $selected = [] ) {
		$store      = $this->store_faq();
		$categories = $store ? $store->generate( (array) $profile ) : [];
		// Honor the categories the user kept on the profile screen — the generator
		// otherwise always emits the full curated set, so removing a chip had no
		// effect on what got generated (fbs).
		$categories = $this->filter_selected_categories( $categories, (array) $selected );
		$categories = $this->sanitize_categories( $categories, true, $this->max_categories( $content_type ) );

		do_action( 'betterdocs_sample_docs_generated', $content_type, count( $categories ) );

		return [
			'content_type' => $content_type,
			'categories'   => $categories,
			'meta'         => [ 'model' => 'betterdocs-local', 'source' => 'deterministic' ],
		];
	}

	/**
	 * Lazily resolve the deterministic store-FAQ generator.
	 *
	 * @return \WPDeveloper\BetterDocs\Core\StoreFaqContent|null
	 */
	protected function store_faq() {
		$class = 'WPDeveloper\\BetterDocs\\Core\\StoreFaqContent';
		if ( ! class_exists( $class ) ) {
			return null;
		}
		return $this->container->get( $class );
	}

	/**
	 * Insert step — DocBuilder creates the terms/posts. Wired in Phase 4.
	 */
	public function insert( WP_REST_Request $request ) {
		if ( ! $this->is_enabled() ) {
			return $this->error( 'feature_disabled', __( 'AI sample docs is disabled.', 'betterdocs' ), 403 );
		}

		$builder = $this->builder();
		if ( null === $builder ) {
			return $this->error( 'not_implemented', __( 'Inserting sample docs is not available yet.', 'betterdocs' ), 501 );
		}

		$content_type = $this->content_type( $request );
		$categories   = $this->sanitize_categories( (array) $request->get_param( 'categories' ), true, $this->max_categories( $content_type ) );

		$result = $builder->build( $categories, $content_type );

		if ( is_wp_error( $result ) ) {
			return $this->error( $result->get_error_code(), $result->get_error_message(), 400 );
		}

		return $this->success( $result );
	}

	/**
	 * Undo step — remove exactly the sample content we created. Wired in Phase 4.
	 */
	public function undo( WP_REST_Request $request ) {
		if ( ! $this->is_enabled() ) {
			return $this->error( 'feature_disabled', __( 'AI sample docs is disabled.', 'betterdocs' ), 403 );
		}

		$builder = $this->builder();
		if ( null === $builder ) {
			return $this->error( 'not_implemented', __( 'Removing sample docs is not available yet.', 'betterdocs' ), 501 );
		}

		$content_type = $this->content_type( $request );
		return $this->success( $builder->undo( $content_type ) );
	}

	/**
	 * Lazily resolve the DocBuilder (added in Phase 4) so this class loads even
	 * before the builder exists.
	 *
	 * @return \WPDeveloper\BetterDocs\Core\SampleDocBuilder|null
	 */
	protected function builder() {
		$class = 'WPDeveloper\\BetterDocs\\Core\\SampleDocBuilder';
		if ( ! class_exists( $class ) ) {
			return null;
		}
		return $this->container->get( $class );
	}

	/* --------------------------------------------------------------------- */
	/* Proxy plumbing                                                         */
	/* --------------------------------------------------------------------- */

	/**
	 * Sign + POST the payload to the hosted proxy, with one retry.
	 *
	 * @return array|\WP_Error Parsed { categories, meta } on success.
	 */
	protected function call_proxy( array $payload ) {
		$url    = $this->proxy_url();
		$secret = $this->proxy_secret();
		$body   = wp_json_encode( $payload );

		$args = [
			'timeout' => 30,
			'headers' => [
				'Content-Type'             => 'application/json',
				'Accept'                   => 'application/json',
				'X-BetterDocs-Site'        => esc_url_raw( home_url() ),
				'X-BetterDocs-License'     => $this->license_key(),
				'X-BetterDocs-Signature'   => hash_hmac( 'sha256', $body, $secret ),
			],
			'body'    => $body,
		];

		$attempts = 0;
		$response = null;
		while ( $attempts < 2 ) {
			$attempts++;
			$response = wp_remote_post( $url, $args );

			// Retry ONLY on a genuine transport failure (no HTTP response). A 5xx may
			// mean the proxy already called OpenAI and spent tokens, so re-POSTing
			// would risk double-billing — treat any received status as final.
			if ( ! is_wp_error( $response ) ) {
				break;
			}
		}

		if ( is_wp_error( $response ) ) {
			return $this->error( 'proxy_unreachable', __( 'Could not reach the BetterDocs AI service. Please try again.', 'betterdocs' ), 502 );
		}

		$status = wp_remote_retrieve_response_code( $response );
		$parsed = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( 429 === $status || ( isset( $parsed['status'] ) && 'quota_exceeded' === $parsed['status'] ) ) {
			return $this->error( 'quota_exceeded', __( 'You have used your free AI generation for this site.', 'betterdocs' ), 429 );
		}

		if ( $status >= 400 || empty( $parsed['categories'] ) || ! is_array( $parsed['categories'] ) ) {
			$message = isset( $parsed['message'] ) ? $parsed['message'] : __( 'The AI service returned an unexpected response.', 'betterdocs' );
			return $this->error( 'proxy_error', $message, 502 );
		}

		// Enforce caps + sanitize defensively on our side too.
		$parsed['categories'] = $this->sanitize_categories( $parsed['categories'], true );

		return $parsed;
	}

	protected function proxy_url() {
		$base = get_option( 'betterdocs_ai_proxy_url', 'https://api.betterdocs.co/ai' );
		/** Filter the hosted proxy base URL. */
		$base = apply_filters( 'betterdocs_ai_proxy_url', $base );
		return trailingslashit( $base ) . 'v1/sample-docs';
	}

	protected function proxy_secret() {
		$secret = get_option( 'betterdocs_ai_proxy_secret', 'betterdocs-local-dev-secret' );
		/** Filter the HMAC shared secret used to sign proxy requests. */
		return apply_filters( 'betterdocs_ai_proxy_secret', $secret );
	}

	protected function license_key() {
		/** Filter the license key sent to the proxy for per-site identity. */
		return apply_filters( 'betterdocs_ai_proxy_license', (string) get_option( 'betterdocs_pro_licenses', '' ) );
	}

	/* --------------------------------------------------------------------- */
	/* Helpers                                                                */
	/* --------------------------------------------------------------------- */

	protected function is_enabled() {
		return (bool) $this->settings->get( 'enable_ai_sample_docs', true );
	}

	protected function content_type( WP_REST_Request $request ) {
		$type = $request->get_param( 'content_type' );
		if ( 'faq' === $type || 'product_faq' === $type ) {
			return $type;
		}
		return 'docs';
	}

	/**
	 * Per-content-type category cap. Product FAQs cover the four store-ops groups
	 * (Payments & Billing, Shipping & Delivery, Returns & Refunds, Orders & Account);
	 * docs and general FAQ keep the default cap.
	 *
	 * @return int
	 */
	protected function max_categories( $content_type ) {
		return 'product_faq' === $content_type ? 4 : self::MAX_CATEGORIES;
	}

	/**
	 * Deterministic, type-aware suggested categories (no AI) for the profile screen.
	 *
	 * @return array
	 */
	protected function suggested_categories( array $profile, $content_type ) {
		$type = isset( $profile['type'] ) ? $profile['type'] : 'general';

		// WooCommerce Product FAQ: the curated store starter set is the single
		// source of truth (StoreFaqContent), so the chips/titles shown here match
		// what the deterministic fallback generates.
		if ( 'product_faq' === $content_type ) {
			$store = $this->store_faq();
			$defs  = $store ? $store->definition() : [];
			$defs  = array_slice( $defs, 0, $this->max_categories( $content_type ) );

			$cats = [];
			foreach ( $defs as $i => $group ) {
				$cats[] = [
					'id'       => sanitize_key( 'sd_' . $i ),
					'name'     => $group['name'],
					'icon'     => isset( $group['icon'] ) ? sanitize_key( $group['icon'] ) : 'help',
					'color'    => self::PALETTE[ $i % count( self::PALETTE ) ],
					'articles' => array_values( (array) $group['questions'] ),
				];
			}

			return $cats;
		}

		if ( 'faq' === $content_type ) {
			// FAQ groups: product-store questions on a WooCommerce/ecommerce
			// site, general site questions otherwise.
			$names = 'ecommerce' === $type
				? [ 'Shipping & Delivery', 'Returns & Refunds', 'Payments & Orders' ]
				: [ 'Getting Started', 'Account & Billing', 'Troubleshooting' ];
		} else {
			// Documentation categories — article-style guides, NOT FAQ groups (no
			// "FAQs" category here; FAQs are a separate content type). The hosted
			// proxy refines these names to fit the specific site and writes real
			// article titles + bodies for each.
			$presets = [
				'ecommerce'         => [ 'Getting Started', 'Shipping & Delivery', 'Product Guides' ],
				'course_lms'        => [ 'Getting Started', 'Course Access', 'Lessons & Content' ],
				'digital_downloads' => [ 'Getting Started', 'Downloads & Licenses', 'Installation' ],
				'membership'        => [ 'Getting Started', 'Membership & Plans', 'Member Benefits' ],
				'community'         => [ 'Getting Started', 'Using the Community', 'Your Profile' ],
				'business_site'     => [ 'Getting Started', 'Our Services', 'How-to Guides' ],
				'general'           => [ 'Getting Started', 'Guides & How-tos', 'Features & Settings' ],
			];
			$names = isset( $presets[ $type ] ) ? $presets[ $type ] : $presets['general'];
		}

		// Never suggest more than the cap, so the preview matches what actually
		// gets generated and inserted.
		$names = array_slice( $names, 0, $this->max_categories( $content_type ) );

		$icons = [ 'book', 'truck', 'help', 'refund' ];

		$cats = [];
		foreach ( $names as $i => $name ) {
			$cats[] = [
				'id'       => sanitize_key( 'sd_' . $i ),
				'name'     => $name,
				'icon'     => $icons[ $i % count( $icons ) ],
				'color'    => self::PALETTE[ $i % count( self::PALETTE ) ],
				'articles' => $this->seed_articles( $name, $content_type ),
			];
		}

		return $cats;
	}

	/**
	 * Placeholder article/question titles so the profile-step counters render.
	 * The proxy replaces these with real generated content.
	 *
	 * @return array
	 */
	protected function seed_articles( $name, $content_type ) {
		if ( 'faq' === $content_type ) {
			return [
				/* translators: %s: suggested FAQ group / category name. */
				sprintf( __( 'What is %s?', 'betterdocs' ), $name ),
				__( 'Common questions', 'betterdocs' ),
				__( 'Tips & best practices', 'betterdocs' ),
			];
		}

		return [
			/* translators: %s: suggested category name. */
			sprintf( __( '%s — overview', 'betterdocs' ), $name ),
			__( 'Key concepts', 'betterdocs' ),
			__( 'Step-by-step guide', 'betterdocs' ),
		];
	}

	/**
	 * Keep only the generated categories the user left selected on the profile
	 * screen, matched by normalized name. Falls back to the full generated set when
	 * the selection is empty or nothing matches, so we never return zero categories.
	 *
	 * @param array $generated Categories produced by the deterministic generator.
	 * @param array $selected  The user's kept categories (each with a 'name').
	 * @return array
	 */
	protected function filter_selected_categories( array $generated, array $selected ) {
		if ( empty( $selected ) ) {
			return $generated;
		}

		$wanted = [];
		foreach ( $selected as $cat ) {
			if ( is_array( $cat ) && ! empty( $cat['name'] ) ) {
				$wanted[ $this->normalize_category_name( $cat['name'] ) ] = true;
			}
		}
		if ( empty( $wanted ) ) {
			return $generated;
		}

		$filtered = array_values(
			array_filter(
				$generated,
				function ( $group ) use ( $wanted ) {
					return ! empty( $group['name'] ) && isset( $wanted[ $this->normalize_category_name( $group['name'] ) ] );
				}
			)
		);

		return ! empty( $filtered ) ? $filtered : $generated;
	}

	/**
	 * Normalize a category name for loose matching between the user's selection and
	 * the generated set (case/whitespace/tag-insensitive).
	 *
	 * @return string
	 */
	protected function normalize_category_name( $name ) {
		return strtolower( trim( wp_strip_all_tags( (string) $name ) ) );
	}

	/**
	 * Sanitize + cap an incoming categories array (used both for the user's edited
	 * list and the proxy response).
	 *
	 * @param bool $with_content Keep article body HTML (proxy response) vs titles only.
	 * @param int  $max          Category cap (defaults to MAX_CATEGORIES; product_faq uses more).
	 * @return array
	 */
	protected function sanitize_categories( array $categories, $with_content = false, $max = self::MAX_CATEGORIES ) {
		$max   = max( 1, (int) $max );
		$clean = [];
		foreach ( array_slice( $categories, 0, $max ) as $i => $cat ) {
			if ( empty( $cat['name'] ) ) {
				continue;
			}

			$articles = [];
			$raw      = isset( $cat['articles'] ) && is_array( $cat['articles'] ) ? $cat['articles'] : [];
			foreach ( array_slice( $raw, 0, self::MAX_ARTICLES_PER_CATEGORY ) as $article ) {
				if ( is_array( $article ) ) {
					$entry = [
						'title'   => sanitize_text_field( isset( $article['title'] ) ? $article['title'] : '' ),
						'excerpt' => sanitize_text_field( isset( $article['excerpt'] ) ? $article['excerpt'] : '' ),
					];
					if ( $with_content ) {
						$entry['content_html'] = wp_kses_post( isset( $article['content_html'] ) ? $article['content_html'] : '' );
					}
					if ( '' !== $entry['title'] ) {
						$articles[] = $entry;
					}
				} else {
					$title = sanitize_text_field( $article );
					if ( '' !== $title ) {
						$articles[] = $with_content ? [ 'title' => $title, 'content_html' => '', 'excerpt' => '' ] : $title;
					}
				}
			}

			$clean[] = [
				'id'          => sanitize_key( isset( $cat['id'] ) ? $cat['id'] : 'sd_' . $i ),
				'name'        => sanitize_text_field( $cat['name'] ),
				'description' => isset( $cat['description'] ) ? sanitize_text_field( $cat['description'] ) : '',
				'icon'        => isset( $cat['icon'] ) ? sanitize_key( $cat['icon'] ) : 'book',
				'color'       => sanitize_hex_color( isset( $cat['color'] ) ? $cat['color'] : '' ) ?: self::PALETTE[ $i % count( self::PALETTE ) ],
				'articles'    => $articles,
			];
		}

		return $clean;
	}
}
