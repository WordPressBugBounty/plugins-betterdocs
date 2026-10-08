<?php

namespace WPDeveloper\BetterDocs\FrontEnd;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Extends WordPress search SQL on `docs` queries to also match docs whose
 * assigned `doc_tag` or `doc_category` term names contain the search term.
 *
 * Also ranks exact and leading title matches first in those searches.
 *
 * The filters are registered globally so they apply to every search query against
 * the `docs` post type — including WP core's `GET /wp/v2/docs?search=...`,
 * BetterDocs' `/betterdocs/v1/search`, and the shortcode/widget AJAX paths.
 */
class SearchExtender {
	public function __construct() {
		add_filter( 'posts_search', [ $this, 'extend_search' ], 20, 2 );
		add_filter( 'posts_search_orderby', [ $this, 'rank_title_matches' ], 20, 2 );
	}

	/**
	 * Inject an OR clause that matches docs whose related taxonomy term names
	 * contain the search term.
	 *
	 * @param string    $search The search SQL clause (already begins with " AND (").
	 * @param \WP_Query $query  The WP_Query instance.
	 * @return string Modified search SQL.
	 */
	public function extend_search( $search, $query ) {
		global $wpdb;

		if ( empty( $search ) || ! $this->is_docs_query( $query ) ) {
			return $search;
		}

		$search_term = isset( $query->query_vars['s'] ) ? (string) $query->query_vars['s'] : '';
		if ( $search_term === '' ) {
			return $search;
		}

		$taxonomies = [ 'doc_tag', 'doc_category' ];
		$like       = '%' . $wpdb->esc_like( $search_term ) . '%';

		$placeholders = implode( ',', array_fill( 0, count( $taxonomies ), '%s' ) );
		$args         = $taxonomies;
		$args[]       = $like;

		// $placeholders is a generated run of %s tokens bound via $args below; all
		// interpolated identifiers are $wpdb core table names, not user input.
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$subquery = $wpdb->prepare(
			"{$wpdb->posts}.ID IN (
				SELECT DISTINCT tr.object_id
				FROM {$wpdb->term_relationships} tr
				INNER JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
				INNER JOIN {$wpdb->terms} t ON tt.term_id = t.term_id
				WHERE tt.taxonomy IN ({$placeholders}) AND t.name LIKE %s
			)",
			$args
		);
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared

		return preg_replace( '/^\s*AND\s*\(/', " AND ({$subquery} OR ", $search, 1 );
	}

	/**
	 * Rank docs whose title is the search term first, then titles that start
	 * with it, ahead of WordPress's own relevance buckets. Equal matches are
	 * listed A to Z instead of by publish date, which sorted the oldest partial
	 * matches above a newer exact match (betterdocs/betterdocs#182).
	 *
	 * Only refines WordPress's relevance ordering: when a query asks for an
	 * explicit orderby, WordPress passes an empty clause and it is left alone.
	 *
	 * @param string    $search_orderby The relevance ORDER BY clause built by WordPress.
	 * @param \WP_Query $query          The WP_Query instance.
	 * @return string Modified ORDER BY clause.
	 */
	public function rank_title_matches( $search_orderby, $query ) {
		global $wpdb;

		if ( empty( $search_orderby ) || ! $this->is_docs_query( $query ) ) {
			return $search_orderby;
		}

		// Match the title the way a visitor typed it: ignore surrounding and
		// repeated whitespace, and a pair of quotes around the whole term.
		$search_term = isset( $query->query_vars['s'] ) ? (string) $query->query_vars['s'] : '';
		$search_term = trim( preg_replace( '/\s+/u', ' ', $search_term ) );
		if ( strlen( $search_term ) > 1 && '"' === $search_term[0] && '"' === substr( $search_term, -1 ) ) {
			$search_term = trim( substr( $search_term, 1, -1 ) );
		}
		if ( $search_term === '' ) {
			return $search_orderby;
		}

		// LIKE without a wildcard is a case-insensitive exact match.
		$title_rank = $wpdb->prepare(
			"(CASE WHEN {$wpdb->posts}.post_title LIKE %s THEN 0 WHEN {$wpdb->posts}.post_title LIKE %s THEN 1 ELSE 2 END)",
			$wpdb->esc_like( $search_term ),
			$wpdb->esc_like( $search_term ) . '%'
		);

		return "{$title_rank}, {$search_orderby}, {$wpdb->posts}.post_title ASC";
	}

	/**
	 * Whether a query searches the `docs` post type.
	 *
	 * @param \WP_Query $query The WP_Query instance.
	 * @return bool
	 */
	private function is_docs_query( $query ) {
		$post_type = isset( $query->query_vars['post_type'] ) ? $query->query_vars['post_type'] : '';

		return is_array( $post_type ) ? in_array( 'docs', $post_type, true ) : 'docs' === $post_type;
	}
}
