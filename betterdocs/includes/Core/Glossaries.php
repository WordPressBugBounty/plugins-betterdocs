<?php

namespace WPDeveloper\BetterDocs\Core;

use WP_Query;
use WP_Error;
use WPDeveloper\BetterDocs\Utils\Base;
use WPDeveloper\BetterDocs\Utils\Helper;

class Glossaries extends Base {
	/**
	 * REST API namespace
	 * @var string
	 */
	private $namespace = 'betterdocs';
	public $post_type  = 'docs';
	public $category   = 'glossaries';

	/**
	 *
	 * Initialize the class and start calling our hooks and filters
	 *
	 * @since    1.0.0
	 *
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'register_post' ] );
		// fires after a new betterdocs_glossaries is created
		add_action( 'created_glossaries', [ $this, 'action_created_betterdocs_glossaries' ], 10, 2 );
		add_action( 'rest_api_init', [ $this, 'register_api_endpoint' ] );
		add_action( 'rest_api_init', [ $this, 'register_glossary_rest_fields' ] );
		add_action( 'rest_glossaries_query', array( $this, 'glossaries_orderby_meta' ), 10, 2 );
		add_action( 'rest_glossaries_query', array( $this, 'disable_language_filtering_for_admin_rest' ), 5, 2 );
		// Ensure meta fields are properly exposed in REST API
		add_filter( 'rest_prepare_glossaries', array( $this, 'add_meta_to_rest_response' ), 10, 3 );
		// Enqueue Scripts
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue' ] );
		// Ensure existing glossaries have proper status
		add_action( 'admin_init', [ $this, 'ensure_glossaries_have_status' ] );
	}

	public function register_post() {
		// Register term meta fields for glossaries taxonomy
		// Force register without duplicate checks to ensure they're properly registered
		register_term_meta(
			$this->category,
			'status',
			[
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'string', // Changed to string to match React expectation
				'default'      => '1',
				'sanitize_callback' => 'sanitize_text_field'
			]
		);

		register_term_meta(
			$this->category,
			'order',
			[
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'string', // Changed to string for consistency
				'default'      => '0',
				'sanitize_callback' => 'sanitize_text_field'
			]
		);

		register_term_meta(
			$this->category,
			'glossary_term_description',
			[
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'string',
				'default'      => '',
				'sanitize_callback' => 'wp_kses_post'
			]
		);
	}

	public function enqueue( $hook ) {
		if ( $hook === 'betterdocs_page_betterdocs-glossaries' ) {
			betterdocs()->assets->enqueue( 'betterdocs-admin-glossaries', 'admin/css/faq.css' );

			betterdocs()->assets->enqueue( 'betterdocs-admin-glossaries', 'admin/js/glossaries.js' );

			// removing emoji support
			remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
			remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );

			betterdocs()->assets->localize(
				'betterdocs-admin-glossaries',
				'betterdocs',
				[
					'dir_url'         => BETTERDOCS_ABSURL,
					'rest_url'        => esc_url_raw( rest_url() ),
					'free_version'    => betterdocs()->version,
					'nonce'           => wp_create_nonce( 'wp_rest' ),
					'current_language' => Helper::get_current_language(),
					'is_multilingual' => Helper::is_multilingual_active()
				]
			);
		}
	}

	public function output() {
		betterdocs()->views->get( 'admin/glossaries' );
	}

	/**
	 * Ensure existing glossaries have proper status meta
	 * This fixes the issue where existing glossaries appear disabled
	 */
	public function ensure_glossaries_have_status() {
		// Run this every time in admin to ensure status is properly set
		// Get all glossaries terms
		$all_terms = get_terms( array(
			'taxonomy' => 'glossaries',
			'hide_empty' => false,
			'suppress_filters' => true // Bypass language filtering
		) );

		if ( ! empty( $all_terms ) && ! is_wp_error( $all_terms ) ) {
			foreach ( $all_terms as $term ) {
				$current_status = get_term_meta( $term->term_id, 'status', true );

				// If status is empty or not set, set it to enabled ('1')
				if ( empty( $current_status ) || $current_status === '' ) {
					update_term_meta( $term->term_id, 'status', '1' );
				}

				// Also ensure order meta exists
				$current_order = get_term_meta( $term->term_id, 'order', true );
				if ( empty( $current_order ) || $current_order === '' ) {
					update_term_meta( $term->term_id, 'order', '0' );
				}
			}
		}
	}


	/**
	 * Default the taxonomy's terms' order if it's not set.
	 *
	 * @param string $tax_slug The taxonomy's slug.
	 */
	public function action_created_betterdocs_glossaries( $term_id ) {
		$order = $this->get_max_taxonomy_order( 'glossaries' );
		// update_term_meta( $term_id, 'order', $order++ );
		update_term_meta( $term_id, 'status', '1' ); // Set as string
		update_term_meta( $term_id, 'order', '0' ); // Also set order
	}

	/**
	 * Default the taxonomy's terms' order if it's not set.
	 *
	 * @param string $tax_slug The taxonomy's slug.
	 */
	public function default_term_order( $tax_slug ) {
		$terms = get_terms(
			[
				'taxonomy'   => $tax_slug,
				'hide_empty' => false,
			]
		);

		$order = $this->get_max_taxonomy_order( $tax_slug );

		foreach ( $terms as $term ) {
			if ( ! get_term_meta( $term->term_id, 'order', true ) ) {
				update_term_meta( $term->term_id, 'order', $order );
				++$order;
			}
		}
	}

	/**
	 * Get the maximum order for this taxonomy. This will be applied to terms that don't have a tax position.
	 */
	private function get_max_taxonomy_order( $tax_slug ) {
		global $wpdb;

		$max_term_order = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT MAX( CAST( tm.meta_value AS UNSIGNED ) )
				FROM $wpdb->terms t
				JOIN $wpdb->term_taxonomy tt ON t.term_id = tt.term_id AND tt.taxonomy = '%s'
				JOIN $wpdb->termmeta tm ON tm.term_id = t.term_id WHERE tm.meta_key = 'order'",
				$tax_slug
			)
		);

		$max_term_order = is_array( $max_term_order ) ? current( $max_term_order ) : 0;

		return (int) $max_term_order === 0 || empty( $max_term_order ) ? 1 : (int) $max_term_order + 1;
	}

	/**
	 * Re-Order the taxonomies based on the order value.
	 *
	 * @param array $pieces     Array of SQL query clauses.
	 * @param array $taxonomies Array of taxonomy names.
	 * @param array $args       Array of term query args.
	 */
	public function set_tax_order( $pieces, $taxonomies, $args ) {
		foreach ( $taxonomies as $taxonomy ) {
			global $wpdb;

			if ( $taxonomy === 'betterdocs_glossaries' ) {
				$join_statement = " LEFT JOIN $wpdb->termmeta AS term_meta ON t.term_id = term_meta.term_id AND term_meta.meta_key = 'order'";

				if ( ! $this->does_substring_exist( $pieces['join'], $join_statement ) ) {
					$pieces['join'] .= $join_statement;
				}

				$pieces['orderby'] = 'ORDER BY CAST( term_meta.meta_value AS UNSIGNED )';
			}
		}

		return $pieces;
	}

	/**
	 * Order the taxonomies on the front end.
	 */
	public function front_end_order_terms() {
		if ( ! is_admin() ) {
			add_filter( 'terms_clauses', [ $this, 'set_tax_order' ], 10, 3 );
		}
	}

	/**
	 * Check if a substring exists inside a string.
	 *
	 * @param string $string    The main string (haystack) we're searching in.
	 * @param string $substring The substring we're searching for.
	 *
	 * @return bool True if substring exists, else false.
	 */
	protected function does_substring_exist( $string, $substring ) {
		return strstr( $string, $substring ) !== false;
	}

	public function register_api_endpoint() {
		register_rest_route(
			$this->namespace,
			'/glossary/sample_data',
			[
				'methods'             => [ 'POST' ],
				'callback'            => [ $this, 'create_glossary_sample' ],
				'permission_callback' => function () {
					return current_user_can( 'edit_others_posts' );
				}
			]
		);

		register_rest_route(
			$this->namespace,
			'/glossary/posts/(?P<type>\S+)',
			[
				'methods'             => [ 'GET' ],
				'callback'            => [ $this, 'fetch_faq_posts' ],
				'permission_callback' => '__return_true'
			]
		);

		register_rest_route(
			$this->namespace,
			'/glossary/create_glossary',
			[
				'methods'             => [ 'POST' ],
				'callback'            => [ $this, 'create_glossaries' ],
				'permission_callback' => function () {
					return current_user_can( 'edit_others_posts' );
				}
			]
		);

		register_rest_route(
			$this->namespace,
			'/glossary/update_glossary',
			[
				'methods'             => [ 'POST' ],
				'callback'            => [ $this, 'update_glossaries' ],
				'permission_callback' => function () {
					return current_user_can( 'edit_others_posts' );
				}
			]
		);

		register_rest_route(
			$this->namespace,
			'/glossary/delete_glossary',
			[
				'methods'             => [ 'POST' ],
				'callback'            => [ $this, 'delete_glossaries' ],
				'permission_callback' => function () {
					return current_user_can( 'edit_others_posts' );
				}
			]
		);

		register_rest_route(
			$this->namespace,
			'/glossary/glossary_status',
			[
				'methods'             => [ 'POST' ],
				'callback'            => [ $this, 'update_glossary_status' ],
				'permission_callback' => function () {
					return current_user_can( 'edit_others_posts' );
				}
			]
		);

		register_rest_route(
			$this->namespace,
			'/glossary/glossaries_order',
			[
				'methods'             => [ 'POST' ],
				'callback'            => [ $this, 'update_glossaries_order' ],
				'permission_callback' => function () {
					return current_user_can( 'edit_others_posts' );
				}
			]
		);

		register_rest_route(
			$this->namespace,
			'/glossary/update_order_by_glossary',
			[
				'methods'             => [ 'POST' ],
				'callback'            => [ $this, 'update_faq_order_by_glossary' ],
				'permission_callback' => function () {
					return current_user_can( 'edit_others_posts' );
				}
			]
		);

		register_rest_route(
			$this->namespace,
			'/glossary/glossary_search',
			[
				'methods'             => [ 'GET' ],
				'callback'            => [ $this, 'glossary_search' ],
				'permission_callback' => '__return_true',
				'args'                => array(
					'title' => array(
						'type'     => 'string',
						'required' => true
					),
				),
			]
		);

		register_rest_route(
			$this->namespace,
			'/glossary/glossary_count',
			[
				'methods'             => [ 'GET' ],
				'callback'            => [ $this, 'get_glossary_count' ],
				'permission_callback' => function () {
					return current_user_can( 'edit_others_posts' );
				}
			]
		);
		register_rest_route(
			$this->namespace,
			'/glossary/get_glossaries',
			[
				'methods'             => [ 'GET' ],
				'callback'            => [ $this, 'get_glossaries' ],
				'permission_callback' => function () {
					return current_user_can( 'edit_others_posts' );
				}
			]
		);
	}

	public function create_glossary_sample( $params ) {
		$sample_data = json_decode( $params->get_param( 'sample_data' ), true );
		foreach ( $sample_data as $key => $value ) {
			$insert_term = wp_insert_term(
				$key,
				'glossaries'
			);
			if ( $insert_term ) {
				foreach ( $value['posts'] as $key => $value ) {
					$this->insert_betterdocs_faq( $value['post_title'], $value['post_content'], $insert_term['term_id'] );
				}
			}
		}
		return true;
	}

	public function create_glossaries( $params ) {
		$title       = $params->get_param( 'title' );
		$description = $params->get_param( 'description' );
		$slug        = $params->get_param( 'slug' );
		$language    = $params->get_param( 'language' );

		// Create the term
		$new_term = wp_insert_term(
			$title,
			'glossaries',
			[
				'slug' => $slug,
			]
		);

		if ( is_wp_error( $new_term ) ) {
			return ['status' => 'failed', 'data' => $new_term];
		}

		// Set the custom field description
		$term_id = $new_term['term_id'];
		update_term_meta( $term_id, 'glossary_term_description', $description ); //phpcs:ignore inline styles are need for the front-end

		// Set language for multilingual plugins
		if ( $language && Helper::is_multilingual_active() ) {
			// WPML Support
			if ( is_plugin_active( 'sitepress-multilingual-cms/sitepress.php' ) ) {
				global $sitepress;
				if ( $sitepress && method_exists( $sitepress, 'set_element_language_details' ) ) {
					$sitepress->set_element_language_details( $term_id, 'tax_glossaries', null, $language );
				}
			}
			// Polylang Support
			elseif ( function_exists( 'pll_set_term_language' ) ) {
				pll_set_term_language( $term_id, $language );
			}
		}

		$new_term =  $this->glossary_term_in_rest_api_schema($term_id, $description);
		return ['status' => 'success', 'data' => $new_term];
	}

	/**
	 * Form Glossary Term In Rest Api Schema Format
	 *
	 * @param int $term_id
	 * @param string $meta_description
	 * @return array
	 */
	public function glossary_term_in_rest_api_schema( $term_id, $meta_description = '' ) {
		$term 		= get_term_by('id', $term_id, 'glossaries');
		return  [
			'count' 	 				=> $term->count,
			'description' 				=>  $term->description,
			'glossary_term_description' => $meta_description, //get the current description
			'id' 						=> $term->term_id,
			'link' 						=> get_permalink($term->term_id),
			'meta' 						=> [
											'status' => get_term_meta( $term->term_id, 'status', true )
			],
			'name' 						=> $term->name,
			'parent' 					=> $term->parent,
			'slug' 						=> $term->slug,
			'taxonomy' 					=> $term->taxonomy
		];
	}

	public function update_glossaries( $request ) {
		$term_id     = $request->get_param( 'term_id' );
		$title       = $request->get_param( 'title' );
		$description = $request->get_param( 'description' );
		$description = ( $description !== 'undefined' ) ? $description : '';
		$slug        = $request->get_param( 'slug' );
		$language    = $request->get_param( 'language' );

		// Verify that we're updating the correct language version of the term
		if ( $language && Helper::is_multilingual_active() ) {
			$term_language = null;

			// WPML Support
			if ( is_plugin_active( 'sitepress-multilingual-cms/sitepress.php' ) ) {
				global $sitepress;
				if ( $sitepress && method_exists( $sitepress, 'get_element_language_details' ) ) {
					$lang_details = $sitepress->get_element_language_details( $term_id, 'tax_glossaries' );
					$term_language = $lang_details ? $lang_details->language_code : null;
				}
			}
			// Polylang Support
			elseif ( function_exists( 'pll_get_term_language' ) ) {
				$term_language = pll_get_term_language( $term_id );
			}

			// Only update if the term belongs to the current language
			if ( $term_language && $term_language !== $language ) {
				return ['status' => 'failed', 'data' => new \WP_Error( 'wrong_language', 'Cannot update term from different language' )];
			}
		}

		// Check if there's old data in the default description field and transfer it to the custom field
		$old_description = get_term_field( 'description', $term_id, 'glossaries' );
		if ( ! empty( $old_description ) && empty( get_term_meta( $term_id, 'glossary_term_description', true ) ) ) {
			update_term_meta( $term_id, 'glossary_term_description', wp_kses_post( $old_description ) );
			wp_update_term( $term_id, $this->glossaries, [ 'description' => '' ] );
		}

		// Update the term
		$update = wp_update_term(
			$term_id,
			'glossaries',
			[
				'name' => $title,
				'slug' => $slug,
			]
		);

		if ( is_wp_error( $update ) ) {
			return ['status' => 'failed', 'data' => $update];
		} else {
			// Update the custom field description
			update_term_meta( $term_id, 'glossary_term_description', $description );
			return ['status' => 'success', 'data' => $this->glossary_term_in_rest_api_schema($term_id, $description)];
		}
	}

	public function save_glossary_term_meta( $term_id, $tt_id ) {
		// Debug: Log what's happening
		error_log( 'BetterDocs Glossaries: save_glossary_term_meta called for term_id: ' . $term_id );
		error_log( 'BetterDocs Glossaries: $_POST data: ' . print_r( $_POST, true ) );

		if ( isset( $_POST['glossary_term_description'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
			$description = wp_kses_post( wp_unslash( $_POST['glossary_term_description'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
			error_log( 'BetterDocs Glossaries: Saving description: ' . $description );
			update_term_meta( $term_id, 'glossary_term_description', $description );
		} else {
			error_log( 'BetterDocs Glossaries: glossary_term_description not found in $_POST' );
		}
	}

	public function register_glossary_rest_fields() {
		register_rest_field(
			'glossaries',
			'glossary_term_description',
			[
				'get_callback'    => function ( $term ) {
					return get_term_meta( $term['id'], 'glossary_term_description', true );
				},
				'update_callback' => null,
				'schema'          => [
					'description' => __( 'Glossary Term Description', 'betterdocs' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit' ],
				],
			]
		);
	}

	public function delete_glossaries( $params ) {
		$term_id = $params->get_param( 'term_id' );
		$delete  = wp_delete_term( $term_id, 'glossaries' );

		if ( is_wp_error( $delete ) ) {
			return $delete;
		} else {
			return true;
		}
	}


	public function insert_betterdocs_glossaries( $title, $description, $slug = '' ) {
		$insert_term = wp_insert_term(
			$title,
			'glossaries',
			[
				'slug'        => $slug,
				'description' => $description
			]
		);

		if ( is_wp_error( $insert_term ) ) {
			return $insert_term;
		} else {
			return true;
		}
	}

	public function update_glossaries_order( $params ) {
		$glossaries_order = $params->get_param( 'glossaries_order' );
		$glossaries_order = json_decode( $glossaries_order, true );

		foreach ( $glossaries_order as $order_data ) {
			if ( (int) $order_data['current_position'] != (int) $order_data['updated_position'] ) {
				update_term_meta( $order_data['id'], 'order', ( (int) $order_data['updated_position'] ) );
			}
		}
		return true;
	}

	public function insert_betterdocs_faq( $post_title, $post_content, $term_id ) {
		$post = wp_insert_post(
			[
				'post_type'    => 'betterdocs_faq',
				'post_title'   => wp_strip_all_tags( $post_title ),
				'post_content' => $post_content,
				'post_status'  => 'publish'
			]
		);

		if ( $term_id ) {
			$set_terms = wp_set_object_terms( $post, $term_id, 'glossaries' );
			if ( is_wp_error( $set_terms ) ) {
				return $set_terms;
			} else {
				return $this->update_faq_order_on_insert( $term_id, $post );
			}
		} else {
			return $post;
		}
	}

	public function update_faq_order_on_insert( $term_id, $post ) {
		$term_meta = get_term_meta( $term_id, '_betterdocs_faq_order' );
		if ( ! empty( $term_meta ) ) {
			$term_meta_arr = explode( ',', $term_meta[0] );
			if ( ! in_array( $post, $term_meta_arr ) ) {
				array_unshift( $term_meta_arr, $post );
				$docs_ordering_data = filter_var_array( wp_unslash( $term_meta_arr ), FILTER_SANITIZE_NUMBER_INT );
				return update_term_meta( $term_id, '_betterdocs_faq_order', implode( ',', $docs_ordering_data ) );
			}
		} else {
			return update_term_meta( $term_id, '_betterdocs_faq_order', $post );
		}
	}

	/**
	 * Update _betterdocs_faq_order meta when new post created
	 */

	public function update_faq_order_by_glossary( $params ) {
		$term_id = $params->get_param( 'term_id' );
		$posts   = $params->get_param( 'posts' );
		return update_term_meta( $term_id, '_betterdocs_faq_order', $posts );
	}

	public function create_betterdocs_faq( $params ) {
		$post_title   = $params->get_param( 'post_title' );
		$post_content = $params->get_param( 'post_content' );
		$term_id      = $params->get_param( 'term_id' );
		return $this->insert_betterdocs_faq( $post_title, $post_content, $term_id );
	}

	public function update_betterdocs_faq( $params ) {
		$post_id      = $params->get_param( 'post_id' );
		$post_title   = $params->get_param( 'post_title' );
		$post_content = $params->get_param( 'post_content' );
		$status       = $params->get_param( 'status' );
		$term_id      = $params->get_param( 'term_id' );
		if ( $status ) {
			$data = [
				'post_type' => 'betterdocs_faq',
				'ID'        => $post_id,
				'status'    => $status
			];
		} else {
			$data = [
				'post_type'    => 'betterdocs_faq',
				'ID'           => $post_id,
				'post_title'   => $post_title,
				'post_content' => $post_content
			];

			if ( $term_id ) {
				$data['tax_input'] = [
					'betterdocs_glossaries' => $term_id
				];

				$term_meta     = get_term_meta( $term_id, '_betterdocs_faq_order' );
				$term_meta_arr = explode( ',', $term_meta[0] );
				if ( ! in_array( $post_id, $term_meta_arr ) ) {
					array_unshift( $term_meta_arr, $post_id );
					$docs_ordering_data = filter_var_array( wp_unslash( $term_meta_arr ), FILTER_SANITIZE_NUMBER_INT );
					update_term_meta( $term_id, '_betterdocs_faq_order', implode( ',', $docs_ordering_data ) );
				}
			}
		}

		return wp_update_post( $data );
	}

	public function delete_betterdocs_faq( $params ) {
		$post_id = $params->get_param( 'post_id' );
		return wp_delete_post( $post_id );
	}

	public function faq_post_loop( $args ) {
		$posts = [];
		$query = new WP_Query( $args );
		if ( $query->have_posts() ) :
			while ( $query->have_posts() ) :
				$query->the_post();
				$posts[ get_the_ID() ]['title']   = get_the_title();
				$posts[ get_the_ID() ]['content'] = get_the_content();
			endwhile;
		endif;

		return $posts;
	}

	public function update_glossary_status( $params ) {
		$term_id = $params->get_param( 'term_id' );
		$status  = $params->get_param( 'status' );

		// Ensure status is a string ('0' or '1')
		$status = $status ? '1' : '0';

		$result = update_term_meta( $term_id, 'status', $status );

		// Return success response with updated status
		return array(
			'success' => $result !== false,
			'term_id' => $term_id,
			'status' => $status,
			'message' => $result !== false ? 'Status updated successfully' : 'Failed to update status'
		);
	}

	public function fetch_faq_posts( $params ) {
		$faq  = [];
		$type = $params->get_param( 'type' );

		if ( $type == 'category' ) {
			$term_args = [
				'taxonomy'   => 'glossaries',
				'hide_empty' => false,
			];

			// Add language filtering if multilingual plugin is active and we should apply filtering
			$current_language = Helper::get_current_language();
			if ( $current_language && Helper::is_multilingual_active() && Helper::should_apply_language_filtering() ) {
				// For WPML and Polylang, use 'lang' parameter
				if ( is_plugin_active( 'sitepress-multilingual-cms/sitepress.php' ) || function_exists( 'pll_current_language' ) ) {
					$term_args['lang'] = $current_language;
				}
			}

			$taxonomy_objects = get_terms( $term_args );

			if ( $taxonomy_objects && ! is_wp_error( $taxonomy_objects ) ) :
				foreach ( $taxonomy_objects as $term ) :
					$args = [
						'post_type'     => 'betterdocs_faq',
						'post_status'   => 'publish',
						'post_per_page' => -1,
						'tax_query'     => [
							[
								'taxonomy' => 'glossaries',
								'field'    => 'term_id',
								'terms'    => $term->term_id
							]
						]
					];

					$posts = $this->faq_post_loop( $args );

					$faq[ $term->slug ] = [
						(array) $term,
						'posts' => $posts
					];
				endforeach;
			endif;
		} else {
			$args         = [
				'post_type'     => 'betterdocs_faq',
				'post_status'   => 'publish',
				'post_per_page' => -1
			];
			$posts        = $this->faq_post_loop( $args );
			$faq['posts'] = $posts;
		}

		return $faq;
	}


	public function glossary_search( $request ) {

		$title = $request['title'];
		$lang = $request['lang'] ?? null;

		// Perform the taxonomy search
		$taxonomy_args = array(
			'name__like' => $title,
			'taxonomy'   => 'glossaries',
			'hide_empty' => false
		);

		// Add language filtering if multilingual plugin is active
		$language_to_use = $lang ?: Helper::get_current_language();
		if ( $language_to_use && Helper::is_multilingual_active() ) {
			// For WPML and Polylang, use 'lang' parameter
			if ( is_plugin_active( 'sitepress-multilingual-cms/sitepress.php' ) || function_exists( 'pll_current_language' ) ) {
				$taxonomy_args['lang'] = $language_to_use;
			}
		}

		$taxonomies = get_terms( $taxonomy_args );

		if ( ! empty( $taxonomies ) ) {
			$result = array();
			foreach ( $taxonomies as $taxonomy ) {
				$result[] = array(
					'id'          => $taxonomy->term_id,
					'count'       => $taxonomy->count,
					'description' => $taxonomy->description,
					'name'        => $taxonomy->name,
					'slug'        => $taxonomy->slug
					// Add more fields as needed
				);
			}
			// Return the taxonomy data
			return $result;
		} else {
			// Taxonomy not found
			return new WP_Error( 'taxonomy_not_found', 'Taxonomy not found.', array( 'status' => 404 ) );
		}
	}

	public function disable_language_filtering_for_admin_rest( $args, $request ) {
		// Check if this is an admin REST request for glossaries management
		if ( is_user_logged_in() && current_user_can( 'edit_others_posts' ) ) {
			// Check if language parameter is explicitly provided in the request
			$lang_param = $request->get_param( 'lang' );

			if ( $lang_param ) {
				// If language is specified, use it for filtering
				$args['lang'] = $lang_param;
			} else {
				// If no language specified, remove language filtering to show all
				unset( $args['lang'] );
				// Add a temporary filter to bypass language restrictions
				add_filter( 'get_terms', array( $this, 'ensure_all_glossaries_in_admin' ), 10, 3 );
			}
		}

		return $args;
	}

	public function ensure_all_glossaries_in_admin( $terms, $taxonomies, $args ) {
		// Only apply to glossaries taxonomy in admin context
		if ( in_array( 'glossaries', (array) $taxonomies ) && is_user_logged_in() && current_user_can( 'edit_others_posts' ) ) {
			// Remove this filter to prevent infinite loops
			remove_filter( 'get_terms', array( $this, 'ensure_all_glossaries_in_admin' ), 10 );

			// Get all glossaries terms without language filtering
			$all_args = $args;
			unset( $all_args['lang'] );
			$all_args['suppress_filters'] = true; // Bypass all filters including language ones

			$all_terms = get_terms( $all_args );

			// Re-add the filter for future calls
			add_filter( 'get_terms', array( $this, 'ensure_all_glossaries_in_admin' ), 10, 3 );

			return is_wp_error( $all_terms ) ? $terms : $all_terms;
		}

		return $terms;
	}

	/**
	 * Add meta fields to REST API response
	 */
	public function add_meta_to_rest_response( $response, $term, $request ) {
		// Ensure meta fields are properly included
		$meta = get_term_meta( $term->term_id );

		// Format meta data as expected by React component
		$response->data['meta'] = array();

		if ( isset( $meta['status'] ) ) {
			$response->data['meta']['status'] = $meta['status'];
		} else {
			$response->data['meta']['status'] = array( '1' ); // Default to enabled
		}

		if ( isset( $meta['order'] ) ) {
			$response->data['meta']['order'] = $meta['order'];
		} else {
			$response->data['meta']['order'] = array( '0' ); // Default order
		}

		if ( isset( $meta['glossary_term_description'] ) ) {
			$response->data['meta']['glossary_term_description'] = $meta['glossary_term_description'];
		} else {
			$response->data['meta']['glossary_term_description'] = array( '' );
		}

		return $response;
	}

	public function glossaries_orderby_meta( $args, $request ) {
		if ( $args['taxonomy'] === 'glossaries' ) {
			$args['orderby']  = 'meta_value_num';
			$args['meta_key'] = 'status';
		}
		return $args;
	}

	public function get_glossary_count( $request ) {
		$options = get_option( 'store_glossary_count' );
		return rest_ensure_response( $options );
	}
	public function get_glossaries( $request ) {
		$taxo = get_taxonomies(
			array(
				'name' => array(
					'glossaries'
				)
			),
			'objects'
		);

		return rest_ensure_response( $taxo );
	}
}
