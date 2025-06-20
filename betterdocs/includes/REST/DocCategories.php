<?php

namespace WPDeveloper\BetterDocs\REST;

use stdClass;
use WPDeveloper\BetterDocs\Core\BaseAPI;

class DocCategories extends BaseAPI {
	public function permission_check(): bool {
		return true;
		// return current_user_can( 'edit_docs' );
	}

	public function register() {
		$this->get( 'doc-categories', [ $this, 'get_response' ] );
		$this->get( 'doc-categories-kb', [$this, 'doc_categories_kb_response'] );
	}

	public function doc_categories_kb_response( $request ) {
		$mkb = ! empty( $request->get_param( 'knowledge_base' ) ) ? get_term( $request->get_param( 'knowledge_base' ), 'knowledge_base' ) : '';
		$mkb = ! empty( $mkb ) ? $mkb->slug : '';
		$suppress_filters = ! empty( $request->get_param('suppress_filters') ) ? $request->get_param('suppress_filters') : '';

		$terms_query = betterdocs()->query->terms_query(
			[
				'parent'     => 0,
				'hide_empty' => true,
				'taxonomy'   => 'doc_category',
				'orderby'    => 'meta_value_num',
				'meta_key'   => 'doc_category_order',
				'order'      => 'ASC'
			]
		);

		if( ! empty( $suppress_filters ) ) {
			$terms_query['suppress_filters'] = $suppress_filters;
		}

		if ( ! empty( $mkb ) ) {
			$terms_query['meta_query'] = [
				'relation' => 'AND',
				[
					'key'     => 'doc_category_knowledge_base',
					'value'   => $mkb,
					'compare' => 'LIKE'
				]
			];
			$terms_query['order']      = 'ASC';
		}

		$terms = get_terms( $terms_query );

		$terms = $this->convert_terms_to_array_of_std_objects($terms);

		return $terms;
	}

	private function convert_terms_to_array_of_std_objects( $payload ) {
		$terms = [];

		foreach( $payload as $term ) {
			$object = new stdClass();

			$object->term_id = $term->term_id;
			$object->name = $term->name;
			$object->slug = $term->slug;
			$object->term_group = $term->term_group;
			$object->term_taxonomy_id = $term->term_taxonomy_id;
			$object->taxonomy = $term->taxonomy;
			$object->description = $term->description;
			$object->parent = $term->parent;
			$object->count = $term->count;
			$object->filter = $term->filter;
			$object->meta  = $term->meta;

			array_push($terms, $object);
		}

		return $terms;
	}

	public function get_response( $request ) {
		global $wpdb;

		$mkb 	  = $request->get_param( 'knowledge_base' );
		$per_page = $request->get_param( 'per_page' );
		$page     = $request->get_param( 'page' );

		$default_args = [
			'hide_empty' => false,
			'taxonomy'   => 'doc_category',
			'orderby'    => 'meta_value_num',
			'meta_key'   => 'doc_category_order',
			'order'      => 'ASC',
		];

		if( $per_page !=  0 ) {
			$default_args['number'] = $per_page;
		}

		if( $page != 0 ) {
			$default_args['offset'] = ( $page * $per_page ) - $per_page;
		}

		$terms_query = betterdocs()->query->terms_query( $default_args );

		if ( ! empty( $mkb ) ) {
			$terms_query['meta_query'] = [
				'relation' => 'AND',
				[
					'key'     => 'doc_category_knowledge_base',
					'value'   => $mkb,
					'compare' => 'LIKE'
				]
			];
			$terms_query['order']      = 'ASC';
		}

		$terms    = get_terms( $terms_query );
		$response = [];

		foreach ( $terms as $term ) {
			$original_args = [
				'post_type'          => 'docs',
				'posts_per_page'     => '-1',
				'post_status'        => 'any',
				'term_id'            => $term->term_id,
				'term_slug'          => $term->slug,
				'nested_subcategory' => false,
				'orderby'            => 'betterdocs_order'
			];

			if ( ! empty( $mkb ) ) {
				$original_args['multiple_kb'] = true;
				$original_args['kb_slug']     = $mkb;
			}

			$query_args = betterdocs()->query->docs_query_args( $original_args );

			$posts                      = betterdocs()->query->get_posts( $query_args, true );
			$response[ $term->term_id ] = [];

			if ( ! $posts->have_posts() ) {
				wp_reset_query();
			}
			while ( $posts->have_posts() ) :
				$posts->the_post();
				$data = $this->get_doc_data( get_the_ID() );
				array_push( $response[ $term->term_id ], $data );
			endwhile;

			wp_reset_postdata();
			wp_reset_query();
		}

		/**
		 * Uncategories Docs
		 */
		$_post__not_in_query = $wpdb->prepare(
			"SELECT ID as post_id from $wpdb->posts WHERE post_type = %s AND post_status != 'trash' AND post_status != 'auto-draft' AND ID NOT IN ( SELECT object_id as post_id FROM $wpdb->term_relationships WHERE term_taxonomy_id IN ( SELECT term_taxonomy_id FROM $wpdb->term_taxonomy WHERE taxonomy = %s ) )",
			'docs',
			'doc_category'
		);

		$_post__not_in = $wpdb->get_col( $_post__not_in_query ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

		if ( ! empty( $_post__not_in ) ) {
			$uncategorized_docs        = [];
			$_uncategorized_docs_query = new \WP_Query(
				[
					'post_type'   => 'docs',
					'post_status' => 'any',
					'post__in'    => $_post__not_in
				]
			);

			if ( ! $_uncategorized_docs_query->have_posts() ) {
				wp_reset_query();
			}
			while ( $_uncategorized_docs_query->have_posts() ) :
				$_uncategorized_docs_query->the_post();
				$data = $this->get_doc_data( get_the_ID() );
				array_push( $uncategorized_docs, $data );
			endwhile;

			wp_reset_postdata();
			wp_reset_query();

			$response['uncategorized'] = $uncategorized_docs;
		}

		unset($terms_query['offset']);
		unset($terms_query['number']);
		$total_terms = wp_count_terms( $terms_query );

		return [
			'data' 		  => $response,
			'total_terms' => $total_terms
		];
	}

	/**
	 * Get Doc Data Based On Doc ID
	 *
	 * @return void
	 */
	public function get_doc_data( $id ) {
		$post_data = get_post( $id );
		$data      = [
			'author'         => (int) $post_data->post_author,
			'author_info'    => [
				'name'            => get_the_author_meta( 'display_name', $post_data->post_author ),
				'author_nicename' => get_the_author_meta( 'nicename', $post_data->post_author ),
				'author_url'      => get_author_posts_url( $post_data->post_author )
			],
			'unique_id'      => uniqid( 'doc' ),
			'id'             => $post_data->ID,
			'title'          => $post_data->post_title,
			'slug'           => get_post_field( 'post_name', $id ),
			'link'           => get_permalink( $id ),
			'status'         => get_post_status(),
			'date'           => $post_data->post_date,
			'date_gmt'       => $post_data->post_date_gmt,
			'doc_category'   => wp_get_post_terms( $id, 'doc_category', [ 'fields' => 'ids' ] ),
			'doc_tag'        => wp_get_post_terms( $id, 'doc_tag', [ 'fields' => 'ids' ] ),
			'password'       => $post_data->post_password,
			'comment_status' => $post_data->comment_status
		];

		if ( taxonomy_exists( 'knowledge_base' ) ) {
			$data['knowledge_base'] = wp_get_post_terms( $id, 'knowledge_base', [ 'fields' => 'ids' ] );
		}

		return $data;
	}
}
