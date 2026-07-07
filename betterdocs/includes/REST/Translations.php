<?php

namespace WPDeveloper\BetterDocs\REST;

use WP_REST_Request;
use WPDeveloper\BetterDocs\Core\BaseAPI;
use WPDeveloper\BetterDocs\Utils\Helper;

/**
 * Term translation linking for the React admin (WPML / Polylang).
 *
 * Powers the slide-over "Language / This is a translation of / Translate" panel
 * for the doc_category, doc_tag and knowledge_base taxonomies.
 */
class Translations extends BaseAPI {

	/** Taxonomies the React admins manage. */
	private function allowed_taxonomies() {
		return array_filter(
			[ 'doc_category', 'doc_tag', 'knowledge_base' ],
			'taxonomy_exists'
		);
	}

	public function permission_check(): bool {
		// QA-013: these routes read/write term language meta, so require the
		// doc-term management cap (Editor+) — `edit_docs` is Author-level and
		// let any author rewrite another category's language assignment. Mirrors
		// the `manage_doc_terms` guard used by PostType term operations.
		return current_user_can( 'manage_doc_terms' );
	}

	public function register() {
		$this->get( 'term-translations', [ $this, 'get_term_translations' ] );
		$this->post( 'term-language', [ $this, 'set_term_language' ] );
	}

	/**
	 * Translation group + "this is a translation of" candidates for a term (or for
	 * a target language when creating a new translation).
	 */
	public function get_term_translations( WP_REST_Request $request ) {
		$taxonomy = sanitize_key( (string) $request->get_param( 'taxonomy' ) );
		if ( ! in_array( $taxonomy, $this->allowed_taxonomies(), true ) || ! Helper::is_multilingual_active() ) {
			return rest_ensure_response( [ 'enabled' => false ] );
		}

		$default_lang = Helper::get_default_language();
		$target_lang  = sanitize_text_field( (string) $request->get_param( 'lang' ) );
		$source_lang  = sanitize_text_field( (string) $request->get_param( 'source_lang' ) ) ?: $default_lang;
		$term_id      = absint( $request->get_param( 'term_id' ) );

		$current_lang   = '';
		$translation_of = 0;
		$translations   = [];

		if ( $term_id ) {
			$term = get_term( $term_id, $taxonomy );
			if ( $term && ! is_wp_error( $term ) ) {
				$current_lang = Helper::get_term_language( $term );
				$translations = Helper::get_term_translations( $term );
				if ( ! $target_lang ) {
					$target_lang = $current_lang;
				}
				// The source-language sibling (if this term is already a translation).
				if ( isset( $translations[ $source_lang ]['term_id'] ) ) {
					$translation_of = (int) $translations[ $source_lang ]['term_id'];
				}
			}
		}

		// Candidates only matter when assigning a non-default language.
		$candidates = ( $target_lang && $target_lang !== $default_lang )
			? Helper::get_translation_candidates( $taxonomy, $target_lang, $source_lang )
			: [];

		return rest_ensure_response( [
			'enabled'        => true,
			'default_lang'   => $default_lang,
			'current_lang'   => $current_lang,
			'translation_of' => $translation_of,
			'translations'   => $translations,
			'candidates'     => $candidates,
		] );
	}

	/**
	 * Set a term's language and link it into the chosen translation group.
	 */
	public function set_term_language( WP_REST_Request $request ) {
		$taxonomy = sanitize_key( (string) $request->get_param( 'taxonomy' ) );
		$term_id  = absint( $request->get_param( 'term_id' ) );
		$lang     = sanitize_text_field( (string) $request->get_param( 'lang' ) );
		$source   = absint( $request->get_param( 'translation_of' ) );

		if ( ! in_array( $taxonomy, $this->allowed_taxonomies(), true ) || ! $term_id || ! Helper::is_multilingual_active() ) {
			return rest_ensure_response( [ 'success' => false ] );
		}

		$term = get_term( $term_id, $taxonomy );
		if ( ! $term || is_wp_error( $term ) ) {
			return rest_ensure_response( [ 'success' => false ] );
		}

		Helper::link_term_translation( $term, $lang, $source );

		return rest_ensure_response( [ 'success' => true, 'lang' => $lang ] );
	}
}
