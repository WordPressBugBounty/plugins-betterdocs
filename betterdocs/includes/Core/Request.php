<?php

namespace WPDeveloper\BetterDocs\Core;

use WPDeveloper\BetterDocs\Utils\Base;

class Request extends Base {
	/**
	 * Flag for already parsed or not
	 *
	 * Specially needed for those who don't update pro yet.
	 * @var boolean
	 */
	protected static $already_parsed = false;

	/**
	 * List of BetterDocs Perma Structure
	 * @var array
	 */
	private $perma_structure = [];

	/**
	 * List of BetterDocs Query Vars Agains Page Structure.
	 * @var array
	 */
	private $query_vars = [];

	/**
	 * List of Query Variables from $wp->query_vars.
	 * @var array
	 */
	private $wp_query_vars = [];

	/**
	 * Rewrite Class Reference of BetterDocs
	 * @var Rewrite
	 */
	protected $rewrite;

	/**
	 * Settings Class Reference of BetterDocs
	 * @var Settings
	 */
	protected $settings;

	public function __construct( Rewrite $rewrite, Settings $settings ) {
		$this->rewrite  = $rewrite;
		$this->settings = $settings;
	}

	public function init() {
		if ( is_admin() ) {
			return;
		}

        $this->perma_structure = [
            'is_docs'          => trim( $this->rewrite->get_base_slug(), '/' ),
            'is_docs_feed'     => trim( $this->rewrite->get_base_slug(), '/' ) . '/%feed%',
            'is_docs_category' => trim( $this->settings->get( 'category_slug', 'docs-category' ), '/' ) . '/%doc_category%',
            'is_docs_tag'      => trim( $this->settings->get( 'tag_slug', 'docs-tag' ), '/' ) . '/%doc_tag%',
            'is_single_docs'   => trim( $this->settings->get( 'permalink_structure', 'docs' ), '/' ) . '/%name%',
            'is_docs_author'   => trim( $this->rewrite->get_base_slug(), '/' ) . '/authors/%author%'
        ];

        $this->query_vars = [
            'is_docs'          => ['post_type'],
            'is_docs_feed'     => ['doc_category'],
            'is_docs_category' => ['doc_category'],
            'is_docs_tag'      => ['doc_tag'],
            'is_single_docs'   => ['name', 'docs', 'post_type'],
            'is_docs_author'   => ['post_type', 'author']
        ];

		add_action( 'parse_request', [ $this, 'parse' ] );

		/**
		 * Hook into pre_get_posts to set up taxonomy queries for category archives
		 */
		add_action( 'pre_get_posts', [ $this, 'setup_taxonomy_query' ], 1 );

		/**
		 * Hook into template_redirect to re-apply taxonomy query flags
		 * This runs after pre_get_posts to ensure the flags stick
		 */
		add_action( 'template_redirect', [ $this, 'reapply_taxonomy_flags' ], 1 );

		/**
		 * Hook into status_header to prevent 404 for valid taxonomy archives
		 */
		add_filter( 'status_header', [ $this, 'prevent_404_status' ], 10, 2 );

		/**
		 * Hook into wp to ensure tax_query is always initialized
		 * This prevents null reference errors from WPML and other plugins
		 */
		add_action( 'wp', [ $this, 'ensure_tax_query_initialized' ], 1 );

		/**
		 * This is for Backward compatibility if pro not updated.
		 */
		add_action( 'parse_request', [ $this, 'backward_compability' ], 11 );

		/**
		 * Make Compatible With Permalink Manager Plugin
		 */
		add_filter( 'permalink_manager_detected_element_id', [ $this, 'provide_compatibility' ], 10, 3 );

		/**
		 * Hook into redirect_canonical to prevent redirects for invalid category-post combinations
		 */
		add_filter( 'redirect_canonical', [ $this, 'prevent_canonical_redirect_for_invalid_docs' ], 10, 2 );

		/**
		 * Hook into template_redirect to validate category-post relationships
		 * Priority 0 to run before WordPress canonical redirect (priority 10)
		 */
		add_action( 'template_redirect', [ $this, 'validate_single_docs_category_redirect' ], 0 );
	}

	public function provide_compatibility( $element_id, $uri_parts, $request_url ) {
		if ( $request_url == $this->settings->get( 'docs_slug' ) ) {
			$element_id = '';
		}
		return $element_id;
	}

	/**
	 * Prevent canonical redirect for invalid docs category-post combinations
	 *
	 * @param string $redirect_url The redirect URL.
	 * @param string $requested_url The requested URL.
	 * @return string|false The redirect URL or false to prevent redirect.
	 */
	public function prevent_canonical_redirect_for_invalid_docs( $redirect_url, $requested_url ) {
		global $wp_query;

		// Only validate if doc_category is in the URL (to prevent wrong category access)
		if ( isset( $wp_query->query_vars['post_type'] ) && $wp_query->query_vars['post_type'] === 'docs' &&
			 isset( $wp_query->query_vars['doc_category'] ) && isset( $wp_query->query_vars['name'] ) ) {

			$doc_category = $wp_query->query_vars['doc_category'];
			$post_name = $wp_query->query_vars['name'];

			// Get the post
			$post = get_page_by_path( $post_name, OBJECT, 'docs' );
			
			if ( ! $post ) {
				return false; // Post doesn't exist, show 404
			}

			// Get post's categories
			$post_categories = wp_get_post_terms( $post->ID, 'doc_category' );
			
			if ( empty( $post_categories ) || is_wp_error( $post_categories ) ) {
				// Post has no categories - only allow if URL is 'uncategorized'
				if ( $doc_category !== 'uncategorized' ) {
					return false;
				}
			} else {
				// Post has categories - check if it belongs to the category in URL
				$category_slugs = wp_list_pluck( $post_categories, 'slug' );
				
				// Handle hierarchical categories: check if any part of the path matches
				$category_parts = explode('/', trim($doc_category, '/'));
				$found_match = false;
				
				foreach ( $category_parts as $cat_slug ) {
					if ( in_array( $cat_slug, $category_slugs ) ) {
						$found_match = true;
						break;
					}
				}
				
				if ( ! $found_match ) {
					return false; // Post doesn't belong to this category, show 404
				}
			}
		}

		return $redirect_url;
	}

	/**
	 * Validate single docs category relationship on template_redirect and force 404 if invalid
	 */
	public function validate_single_docs_category_redirect() {
		global $wp_query;

		// Only validate if doc_category is in the URL
		if ( isset( $wp_query->query_vars['post_type'] ) && $wp_query->query_vars['post_type'] === 'docs' &&
			 isset( $wp_query->query_vars['doc_category'] ) && isset( $wp_query->query_vars['name'] ) ) {

			$doc_category = $wp_query->query_vars['doc_category'];
			$post_name = $wp_query->query_vars['name'];

			// Get the post
			$post = get_page_by_path( $post_name, OBJECT, 'docs' );
			
			if ( ! $post ) {
				$wp_query->set_404();
				status_header( 404 );
				nocache_headers();
				return;
			}

			// Get post's categories
			$post_categories = wp_get_post_terms( $post->ID, 'doc_category' );
			
			if ( empty( $post_categories ) || is_wp_error( $post_categories ) ) {
				// Post has no categories - only allow if URL is 'uncategorized'
				if ( $doc_category !== 'uncategorized' ) {
					$wp_query->set_404();
					status_header( 404 );
					nocache_headers();
					return;
				}
			} else {
				// Post has categories - check if it belongs to the category in URL
				$category_slugs = wp_list_pluck( $post_categories, 'slug' );
				
				// Handle hierarchical categories: check if any part of the path matches
				$category_parts = explode('/', trim($doc_category, '/'));
				$found_match = false;
				
				foreach ( $category_parts as $cat_slug ) {
					if ( in_array( $cat_slug, $category_slugs ) ) {
						$found_match = true;
						break;
					}
				}
				
				if ( ! $found_match ) {
					$wp_query->set_404();
					status_header( 404 );
					nocache_headers();
					return;
				}
			}
		}
	}

	/**
	 * Set up taxonomy query for category archives
	 * This ensures WordPress recognizes requests with doc_category or knowledge_base as taxonomy archives
	 *
	 * @param \WP_Query $query The WordPress query object
	 */
	public function setup_taxonomy_query( $query ) {
		if ( is_admin() || ! $query->is_main_query() ) {
			return;
		}

		// Check if this is a doc_category request
		if ( isset( $query->query_vars['doc_category'] ) && ! empty( $query->query_vars['doc_category'] ) ) {
			// If this is already identified as singular, don't override it
			if ( $query->is_singular() || $query->is_singular ) {

				// Ensure it's not marked as 404
				$query->is_404 = false;
				return;
			}
			
			// Check if we have a post ID set (p query var)
			if ( isset( $query->query_vars['p'] ) && $query->query_vars['p'] > 0 ) {
				// Security check: if this is a private post and user can't read private docs, show 404
				$post = get_post( $query->query_vars['p'] );
				if ( $post && $post->post_status === 'private' && ! current_user_can( 'read_private_docs' ) ) {

					$query->is_404 = true;
					$query->is_single = false;
					$query->is_singular = false;
					return;
				}
				
				// Explicitly set this as a single post, not an archive or 404
				$query->is_single = true;
				$query->is_singular = true;
				$query->is_404 = false;
				$query->is_archive = false;
				$query->is_tax = false;
				return;
			}
			
			// Check if we have 'docs' query var (alternative to 'name')
			if ( isset( $query->query_vars['docs'] ) && ! empty( $query->query_vars['docs'] ) ) {
				// Explicitly set this as a single post
				$query->is_single = true;
				$query->is_singular = true;
				$query->is_404 = false;
				$query->is_archive = false;
				$query->is_tax = false;
				return;
			}
			
			// If 'name' is set, check if a post with that name exists
			// This prevents private docs from being incorrectly treated as category archives
			if ( isset( $query->query_vars['name'] ) && ! empty( $query->query_vars['name'] ) ) {
				$post_exists = get_page_by_path( $query->query_vars['name'], OBJECT, 'docs' );

				if ( $post_exists ) {
					// A post exists - this is a single doc request, not a category archive
					// Don't set taxonomy flags
					return;
				}
			}
			
			// Only set taxonomy flags if none of the above conditions are met (pure category archive)
			if ( ( ! isset( $query->query_vars['name'] ) || empty( $query->query_vars['name'] ) ) &&
				 ( ! isset( $query->query_vars['p'] ) || $query->query_vars['p'] <= 0 ) &&
				 ( ! isset( $query->query_vars['docs'] ) || empty( $query->query_vars['docs'] ) ) ) {

				// Set this as a taxonomy query
				$query->is_tax = true;
				$query->is_archive = true;
				$query->is_home = false;
				$query->is_404 = false; // Important: reset 404 flag
				
				// Set the queried object
				$term = get_term_by( 'slug', $query->query_vars['doc_category'], 'doc_category' );
				if ( $term ) {
					$query->queried_object = $term;
					$query->queried_object_id = $term->term_id;
					
					// Set up tax_query using proper WP_Tax_Query class
					if ( ! isset( $query->tax_query ) || ! is_a( $query->tax_query, 'WP_Tax_Query' ) ) {
						$tax_query_args = [
							[
								'taxonomy' => 'doc_category',
								'field' => 'slug',
								'terms' => [ $term->slug ]
							]
						];
						$query->tax_query = new \WP_Tax_Query( $tax_query_args );
						$query->tax_query->queried_terms = [
							'doc_category' => [
								'terms' => [ $term->slug ],
								'field' => 'slug'
							]
						];
					}
				}
			} else {

			}
		}
		
		// Check if this is a knowledge_base request
		if ( isset( $query->query_vars['knowledge_base'] ) && ! empty( $query->query_vars['knowledge_base'] ) ) {
			// If we also have doc_category, this is a knowledge_base_category archive
			// Otherwise, it's just a knowledge_base archive
			if ( ! isset( $query->query_vars['doc_category'] ) ) {
				$query->is_tax = true;
				$query->is_archive = true;
				$query->is_home = false;
				$query->is_404 = false; // Important: reset 404 flag
				
				$term = get_term_by( 'slug', $query->query_vars['knowledge_base'], 'knowledge_base' );
				if ( $term ) {
					$query->queried_object = $term;
					$query->queried_object_id = $term->term_id;
					
					// Set up tax_query using proper WP_Tax_Query class
					if ( ! isset( $query->tax_query ) || ! is_a( $query->tax_query, 'WP_Tax_Query' ) ) {
						$tax_query_args = [
							[
								'taxonomy' => 'knowledge_base',
								'field' => 'slug',
								'terms' => [ $term->slug ]
							]
						];
						$query->tax_query = new \WP_Tax_Query( $tax_query_args );
						$query->tax_query->queried_terms = [
							'knowledge_base' => [
								'terms' => [ $term->slug ],
								'field' => 'slug'
							]
						];
					}
				}
			}
		}

	}

	/**
	 * Re-apply taxonomy flags on template_redirect
	 * This ensures the flags stick even if WordPress or other plugins reset them
	 */
	public function reapply_taxonomy_flags() {
		global $wp_query;
		
		// Check if we have doc_category or knowledge_base in query vars
		if ( isset( $wp_query->query_vars['doc_category'] ) && ! empty( $wp_query->query_vars['doc_category'] ) ) {
			// If this is already identified as singular, don't override it
			if ( $wp_query->is_singular() || $wp_query->is_singular ) {

				// Ensure it's not marked as 404
				$wp_query->is_404 = false;
				return;
			}
			
			// Check if we have a post ID set (p query var)
			if ( isset( $wp_query->query_vars['p'] ) && $wp_query->query_vars['p'] > 0 ) {

				
				// Security check: if this is a private post and user can't read private docs, show 404
				$post = get_post( $wp_query->query_vars['p'] );
				if ( $post && $post->post_status === 'private' && ! current_user_can( 'read_private_docs' ) ) {

					$wp_query->is_404 = true;
					$wp_query->is_single = false;
					$wp_query->is_singular = false;
					return;
				}
				
				// Explicitly set this as a single post, not an archive or 404
				$wp_query->is_single = true;
				$wp_query->is_singular = true;
				$wp_query->is_404 = false;
				$wp_query->is_archive = false;
				$wp_query->is_tax = false;
				return;
			}
			
			// Check if we have 'docs' query var (alternative to 'name')
			if ( isset( $wp_query->query_vars['docs'] ) && ! empty( $wp_query->query_vars['docs'] ) ) {

				// Explicitly set this as a single post
				$wp_query->is_single = true;
				$wp_query->is_singular = true;
				$wp_query->is_404 = false;
				$wp_query->is_archive = false;
				$wp_query->is_tax = false;
				return;
			}
			
			// If 'name' is set, check if a post with that name exists
			// This prevents private docs from being incorrectly treated as category archives
			if ( isset( $wp_query->query_vars['name'] ) && ! empty( $wp_query->query_vars['name'] ) ) {
				$post_exists = get_page_by_path( $wp_query->query_vars['name'], OBJECT, 'docs' );

				if ( $post_exists ) {
					// A post exists - this is a single doc request, not a category archive
					// Don't set taxonomy flags

					return;
				}
			}
			
			// Only set taxonomy flags if none of the above conditions are met (pure category archive)
			if ( ( ! isset( $wp_query->query_vars['name'] ) || empty( $wp_query->query_vars['name'] ) ) &&
				 ( ! isset( $wp_query->query_vars['p'] ) || $wp_query->query_vars['p'] <= 0 ) &&
				 ( ! isset( $wp_query->query_vars['docs'] ) || empty( $wp_query->query_vars['docs'] ) ) ) {

				// Re-apply the taxonomy flags
				$wp_query->is_tax = true;
				$wp_query->is_archive = true;
				$wp_query->is_home = false;
				$wp_query->is_404 = false;
				
				// Ensure the queried object is set
				if ( ! isset( $wp_query->queried_object ) || ! $wp_query->queried_object ) {
					$term = get_term_by( 'slug', $wp_query->query_vars['doc_category'], 'doc_category' );
					if ( $term ) {
						$wp_query->queried_object = $term;
						$wp_query->queried_object_id = $term->term_id;
						
						// Set up tax_query using proper WP_Tax_Query class
						if ( ! isset( $wp_query->tax_query ) || ! is_a( $wp_query->tax_query, 'WP_Tax_Query' ) ) {
							$tax_query_args = [
								[
									'taxonomy' => 'doc_category',
									'field' => 'slug',
									'terms' => [ $term->slug ]
								]
							];
							$wp_query->tax_query = new \WP_Tax_Query( $tax_query_args );
							$wp_query->tax_query->queried_terms = [
								'doc_category' => [
									'terms' => [ $term->slug ],
									'field' => 'slug'
								]
							];
						}
					}
				}
			} else {

			}
		}

	}

	/**
	 * Debug template redirect to see the query state
	 */
	/**
	 * Prevent 404 status for valid taxonomy archives
	 * 
	 * @param string $status_header The HTTP status header
	 * @param int $code The HTTP status code
	 * @return string The modified status header
	 */
	public function prevent_404_status( $status_header, $code ) {
		global $wp_query;
		
		// If this is a 404 but we have doc_category or knowledge_base query vars, change it to 200
		// We check the query vars instead of is_tax because the flags get reset by WordPress
		if ( $code == 404 && (
			(isset($wp_query->query_vars['doc_category']) && ! empty($wp_query->query_vars['doc_category'])) ||
			(isset($wp_query->query_vars['doc_tag']) && ! empty($wp_query->query_vars['doc_tag'])) ||
			(isset($wp_query->query_vars['knowledge_base']) && ! empty($wp_query->query_vars['knowledge_base']) && ! isset($wp_query->query_vars['name']))
		) ) {
			return 'HTTP/1.1 200 OK';
		}
		
		return $status_header;
	}

	/**
	 * Ensure tax_query is always initialized as an object
	 * This prevents null reference errors from WPML and other plugins
	 * Only applies to BetterDocs post type and taxonomies
	 */
	public function ensure_tax_query_initialized() {
		global $wp_query;
		
		// Only apply to BetterDocs-related queries
		$is_betterdocs_query = false;
		
		// Check if this is a docs post type query
		if ( isset( $wp_query->query_vars['post_type'] ) && $wp_query->query_vars['post_type'] === 'docs' ) {
			$is_betterdocs_query = true;
		}
		
		// Check if this is a BetterDocs taxonomy query
		if ( isset( $wp_query->query_vars['doc_category'] ) && ! empty( $wp_query->query_vars['doc_category'] ) ) {
			$is_betterdocs_query = true;
		}
		
		if ( isset( $wp_query->query_vars['doc_tag'] ) && ! empty( $wp_query->query_vars['doc_tag'] ) ) {
			$is_betterdocs_query = true;
		}
		
		if ( isset( $wp_query->query_vars['knowledge_base'] ) && ! empty( $wp_query->query_vars['knowledge_base'] ) ) {
			$is_betterdocs_query = true;
		}
		
		// Check if queried object is a BetterDocs taxonomy term
		if ( isset( $wp_query->queried_object ) && isset( $wp_query->queried_object->taxonomy ) ) {
			if ( in_array( $wp_query->queried_object->taxonomy, [ 'doc_category', 'doc_tag', 'knowledge_base' ] ) ) {
				$is_betterdocs_query = true;
			}
		}
		
		// Only proceed if this is a BetterDocs-related query
		if ( ! $is_betterdocs_query ) {
			return;
		}
		
		// Only initialize if it's not already a proper WP_Tax_Query instance
		if ( ! isset( $wp_query->tax_query ) || ! is_a( $wp_query->tax_query, 'WP_Tax_Query' ) ) {
			// Create a proper WP_Tax_Query instance with empty queries
			$wp_query->tax_query = new \WP_Tax_Query( [] );
			$wp_query->tax_query->queried_terms = [];
		}
		
		// For WPML compatibility: if queried_object is null, set it to an empty object
		// but only if we're actually on a taxonomy page (is_tax is true)
		if ( ! isset( $wp_query->queried_object ) && $wp_query->is_tax ) {
			// Create a minimal WP_Term-like object to prevent errors
			$wp_query->queried_object = new \stdClass();
			$wp_query->queried_object->term_id = 0;
			$wp_query->queried_object->name = '';
			$wp_query->queried_object->slug = '';
			$wp_query->queried_object->term_group = 0;
			$wp_query->queried_object->term_taxonomy_id = 0;
			$wp_query->queried_object->taxonomy = 'doc_category';
			$wp_query->queried_object->description = '';
			$wp_query->queried_object->parent = 0;
			$wp_query->queried_object->count = 0;
			$wp_query->queried_object->filter = 'raw';
		}
	}

	protected function is_docs( &$query_vars ) {
		if ( ! $this->settings->get( 'builtin_doc_page', true ) ) {
			$query_vars['post_type'] = 'page';
			$query_vars['name']      = trim( $this->rewrite->get_base_slug(), '/' );
		}

		return $query_vars;
	}

	public function is_docs_feed( $query_vars ) {
		global $wp_rewrite;
		return isset( $query_vars['feed'] ) && in_array( $query_vars['feed'], $wp_rewrite->feeds );
	}

    public function is_docs_author( $query_vars ) {
        return isset( $query_vars['author'] ) ? true : false;
    }

    protected function is_single_docs( $query_vars ) {
        // Check for both 'name' and 'docs' query variables
        if ( ! isset( $query_vars['name'] ) && ! isset( $query_vars['docs'] ) ) {
            return false;
        }

		global $wpdb;
		$name = isset( $query_vars['docs'] ) ? $query_vars['docs'] : $query_vars['name'];

		// If doc_category is specified in the URL, validate that the post belongs to that category
	if ( isset( $query_vars['doc_category'] ) ) {
		$doc_category = $query_vars['doc_category'];
		
		// DEBUG: Log the query vars

		
		// If knowledge_base is in query vars but doc_category is empty or just contains the KB slug,
		// skip validation as the pro plugin will handle it
		if ( isset( $query_vars['knowledge_base'] ) && empty( trim( $doc_category, '/' ) ) ) {

			return true;
		}

			// Handle hierarchical category slugs (e.g., parent/child/grandchild)
			$category_parts = explode('/', trim($doc_category, '/'));
			$target_category_slug = end($category_parts); // Get the last part as the target category

			// First, check if the post exists
			$_post_id = (int) $wpdb->get_var(
				$wpdb->prepare(
					"SELECT ID FROM {$wpdb->posts} WHERE post_name = %s AND post_type = %s LIMIT 1",
					esc_sql( $name ),
					'docs'
				)
			);

			// If post exists, validate it belongs to the category in the URL
	if ( $_post_id > 0 ) {
		
		// When hierarchical slugs are enabled, check if post belongs to any category in the path
		$has_category = false;
		
		if ( $this->settings->get( 'enable_category_hierarchy_slugs' ) && count($category_parts) > 1 ) {

			// Check if post belongs to ANY category in the hierarchy path
			// For example, if URL is "update/overview", check for both "update" and "overview"
			$category_slugs_to_check = $category_parts;
			
			foreach ( $category_slugs_to_check as $cat_slug ) {

				$cat_check = $wpdb->get_var(
					$wpdb->prepare(
						"SELECT COUNT(*) FROM {$wpdb->term_relationships} tr
						INNER JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
						INNER JOIN {$wpdb->terms} t ON tt.term_id = t.term_id
						WHERE tr.object_id = %d AND t.slug = %s AND tt.taxonomy = %s",
						$_post_id,
						esc_sql( $cat_slug ),
						'doc_category'
					)
				);
				

				
				if ( $cat_check > 0 ) {
					// If knowledge_base is set, verify the category belongs to that KB
					if ( isset( $query_vars['knowledge_base'] ) ) {

						// Get the term ID for this category slug
						$term = get_term_by( 'slug', $cat_slug, 'doc_category' );
						if ( $term ) {
							$term_kbs = get_term_meta( $term->term_id, 'doc_category_knowledge_base', true );

							// Check if this category belongs to the KB in the URL
							if ( is_array( $term_kbs ) && in_array( $query_vars['knowledge_base'], $term_kbs ) ) {

								$has_category = true;
								break;
							}
						}
					} else {

						// No KB in URL, so any category match is valid
						$has_category = true;
						break;
					}
				}
			}
			} else {
			// Non-hierarchical or single category - check only the target category
			$has_category = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT(*) FROM {$wpdb->term_relationships} tr
					INNER JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
					INNER JOIN {$wpdb->terms} t ON tt.term_id = t.term_id
					WHERE tr.object_id = %d AND t.slug = %s AND tt.taxonomy = %s",
					$_post_id,
					esc_sql( $target_category_slug ),
					'doc_category'
				)
			);
			
			// If knowledge_base is set and category was found, verify it belongs to that KB
			if ( $has_category && isset( $query_vars['knowledge_base'] ) ) {
				$term = get_term_by( 'slug', $target_category_slug, 'doc_category' );
				if ( $term ) {
					$term_kbs = get_term_meta( $term->term_id, 'doc_category_knowledge_base', true );
					// Only valid if category belongs to the KB in the URL
					if ( ! is_array( $term_kbs ) || ! in_array( $query_vars['knowledge_base'], $term_kbs ) ) {
						$has_category = false;
					}
				}
			}
		}

		// Special handling for uncategorized docs
		if ( ! $has_category && $target_category_slug === 'uncategorized' ) {
			// Check if the post has no categories assigned at all
			$category_count = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT(*) FROM {$wpdb->term_relationships} tr
					INNER JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
					WHERE tr.object_id = %d AND tt.taxonomy = %s",
					$_post_id,
					'doc_category'
				)
			);

			// If post has no categories, allow it for uncategorized URL
			if ( $category_count == 0 ) {
				$has_category = true;
			}
		}

		// If post doesn't belong to the target category, check if Multiple KB is active
		// In MKB, the same category can exist in multiple KBs, and the doc might belong to it in one KB
		if ( ! $has_category && taxonomy_exists( 'knowledge_base' ) ) {
			// Check if this doc belongs to multiple knowledge bases
			$kb_count = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT(*) FROM {$wpdb->term_relationships} tr
					INNER JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
					WHERE tr.object_id = %d AND tt.taxonomy = %s",
					$_post_id,
					'knowledge_base'
				)
			);
			
			// If doc has multiple KBs, be more lenient - the pro plugin will handle the final validation
			// based on the knowledge_base query var that gets set later
			if ( $kb_count > 1 ) {
				// Allow it to pass - the pro plugin's parse() method will validate the KB context
				$has_category = true;
			}
		}

		// If post doesn't belong to the target category, return false
		if ( ! $has_category ) {

			return false;
		}

		// If hierarchical slugs are enabled and we found a post, validate the full hierarchy
		if ( $this->settings->get( 'enable_category_hierarchy_slugs' ) && count($category_parts) > 1 ) {
			// Get the post's category terms
			$post_categories = wp_get_object_terms( $_post_id, 'doc_category' );

			if ( ! empty( $post_categories ) ) {
				$found_valid_hierarchy = false;

				foreach ( $post_categories as $post_category ) {
					// Build the hierarchy path for this category
					$hierarchy_path = [];
					$current_term = $post_category;

					// Build path from child to parent
					while ( $current_term ) {
						array_unshift( $hierarchy_path, $current_term->slug );
						$current_term = $current_term->parent ? get_term( $current_term->parent, 'doc_category' ) : null;
					}

					// Check if this hierarchy matches the URL structure
					if ( implode('/', $hierarchy_path) === $doc_category ) {
						$found_valid_hierarchy = true;
						break;
					}
				}

				// If no valid hierarchy found, return false (404)
				if ( ! $found_valid_hierarchy ) {
					return false;
				}
			}
		}
	}
		} else {
			// Fallback to original behavior if no category is specified
			$_post_id = (int) $wpdb->get_var(
				$wpdb->prepare(
					"SELECT ID FROM {$wpdb->posts} WHERE post_name = %s AND post_type = %s LIMIT 1",
					esc_sql( $name ),
					'docs'
				)
			);
		}

		// If knowledge_base is set but we haven't validated yet (MKB active),
		// allow it to pass - the pro plugin will handle final validation
		if ( isset( $query_vars['knowledge_base'] ) && ! isset( $query_vars['doc_category'] ) ) {
			return $_post_id > 0;
		}

		return $_post_id > 0;
	}

	protected function is_docs_category( $query_vars ) {
		$result = $this->term_exists( $query_vars, 'doc_category' );
		return $result;
	}

	protected function is_docs_tag( $query_vars ) {
		return $this->term_exists( $query_vars, 'doc_tag' );
	}

	protected function term_exists( $query_vars, $taxonomy ) {
		if ( ! isset( $query_vars[ $taxonomy ] ) ) {
			return false;
		}

		return term_exists( $query_vars[ $taxonomy ], $taxonomy );
	}

	public function set_perma_structure( $structures = [] ) {
		$this->perma_structure = array_merge( $this->perma_structure, $structures );
	}

	public function set_query_vars( $query_vars = [] ) {
		$this->query_vars = array_merge( $this->query_vars, $query_vars );
	}

	public function backward_compability( $wp ) {
		if ( static::$already_parsed ) {
			return;
		}

		$this->permalink_magic( $wp );
	}

	public function parse( $wp ) {
		static::$already_parsed = true;

        $this->perma_structure = apply_filters('docs_rewrite_rules', $this->perma_structure);

        $this->permalink_magic( $wp );
    }

	protected function permalink_magic( $wp ) {
		$this->wp_query_vars = $wp->query_vars;

		if ( ! empty( $this->perma_structure ) ) {
			$_valid = [];

			foreach ( $this->perma_structure as $_type => $structure ) {
				$_perma_vars = $this->is_perma_valid_for( $structure, $wp->request );

                // $_valid = empty( $_valid ) && $_perma_vars ? [ 'type' => $_type, 'query_vars' => $_perma_vars ] : $_valid;
                if ( ( $_perma_vars && method_exists( $this, $_type ) && call_user_func_array( [$this, $_type], [ & $_perma_vars] ) ) ) {

                    // dump( $_type, $_perma_vars );
                    if ( $_type === 'is_single_docs' || $_type == 'is_docs_feed' || $_type == 'is_docs_author' ) {
                        $_perma_vars['post_type'] = 'docs';
                    }
                    $_valid = ['type' => $_type, 'query_vars' => $_perma_vars];
                }
            }

			$type       = isset( $_valid['type'] ) ? $_valid['type'] : '';
			$query_vars = isset( $_valid['query_vars'] ) ? $_valid['query_vars'] : [];

			if ( ! empty( $type ) ) {
				unset( $this->query_vars[ $type ] );
				array_map(
					function ( $_vars ) use ( &$wp ) {
						array_map(
							function ( $_var ) use ( &$wp ) {
								unset( $wp->query_vars[ $_var ] );
							},
							$_vars
						);
					},
					$this->query_vars
				);
			}

            $wp->query_vars = is_array( $query_vars ) ? array_merge( $wp->query_vars, $query_vars ) : $wp->query_vars;
            
            // Fallback
            if ( ! empty( $_valid ) ) {
                unset( $wp->query_vars['attachment'] );
            }
        }
    }

	/**
	 * This method is responsible for checking a structure is valid again a request.
	 *
	 * @param string $structure
	 * @param string $request
	 * @return array|bool
	 */
	private function is_perma_valid_for( $structure, $request ) {
		if ( empty( $structure ) ) {
			return false;
		}

		$_tags                 = explode( '/', trim( $structure, '/' ) );
		$_replace_matched_tags = [];

		$_replace_tags = array_filter(
			$_tags,
			function ( $item ) use ( &$_replace_matched_tags ) {
				$_is_valid = strpos( $item, '%' ) !== false;
				if ( $_is_valid ) {
					$_replace_matched_tags[] = trim( $item, '%' );
				}
				return $_is_valid;
			}
		);

		$_perma_structure = preg_quote( $structure, '/' );
		$_perma_structure = str_replace( $_replace_tags, '([^\/]+)', $_perma_structure );

		preg_match( "/^$_perma_structure$/", $request, $matches );

		if ( empty( $matches ) || ! is_array( $matches ) ) {
			return false;
		}

		if ( count( $matches ) === 1 ) {
			return [ 'post_type' => 'docs' ];
		}

		unset( $matches[0] );

		return array_combine( $_replace_matched_tags, $matches );
	}
}
