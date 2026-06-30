<?php

namespace WPDeveloper\BetterDocs\Utils;

/**
 * Exit if accessed directly
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Lightweight usage counter for AI features.
 *
 * Each successful AI invocation is recorded in two places:
 *  - a site-wide autoloaded option ({@see self::OPTION_KEY}) holding lifetime totals
 *    per feature (plus an `*_actions` sub-map for features with action variants, e.g.
 *    AI Edit's improve/rewrite/...). This is what the wpinsight collector ships.
 *  - a per-doc post meta ({@see self::META_KEY}) when a valid post id is available, so
 *    on-site reporting can later break usage down per document.
 *
 * Writes are a plain read-modify-write (not atomic) — the same trade-off the existing
 * `betterdocs_analytics` increments make; acceptable for low-stakes usage telemetry.
 *
 * @since 4.5.4
 */
class AIUsage {
	/**
	 * Autoloaded option holding site-wide lifetime totals.
	 */
	const OPTION_KEY = 'betterdocs_ai_usage';

	/**
	 * Per-document usage counts.
	 */
	const META_KEY = '_betterdocs_ai_usage';

	/**
	 * Canonical feature keys. Kept fixed so the wpinsight payload schema is stable —
	 * every key is always present (default 0) even before a feature is ever used.
	 *
	 * @var string[]
	 */
	const FEATURES = [
		'write_with_ai',
		'ai_edit',
		'article_summary',
		'quality_score',
		'glossaries_write_with_ai',
		'faq_write_with_ai',
	];

	/**
	 * Record one successful AI invocation.
	 *
	 * @param string $feature One of {@see self::FEATURES}. Unknown keys are ignored.
	 * @param int    $post_id Document id, or 0 when there is no reliable post (e.g. an
	 *                        unsaved doc or a pre-save glossary/FAQ generation) — the
	 *                        per-doc meta is then skipped, the site-wide total still bumps.
	 * @param string $sub     Optional sub-bucket (e.g. an AI Edit action: improve/rewrite/…).
	 * @return void
	 */
	public static function record( $feature, $post_id = 0, $sub = '' ) {
		if ( ! in_array( $feature, self::FEATURES, true ) ) {
			return;
		}

		// Site-wide aggregate.
		$usage = get_option( self::OPTION_KEY, [] );
		if ( ! is_array( $usage ) ) {
			$usage = [];
		}
		$usage[ $feature ] = (int) ( $usage[ $feature ] ?? 0 ) + 1;

		if ( $sub !== '' ) {
			$sub = sanitize_key( $sub );
			if ( $sub !== '' ) {
				$bucket = $feature . '_actions';
				$usage[ $bucket ][ $sub ] = (int) ( $usage[ $bucket ][ $sub ] ?? 0 ) + 1;
			}
		}

		update_option( self::OPTION_KEY, $usage, true );

		// Per-document breakdown.
		if ( $post_id > 0 ) {
			$meta = get_post_meta( $post_id, self::META_KEY, true );
			if ( ! is_array( $meta ) ) {
				$meta = [];
			}
			$meta[ $feature ] = (int) ( $meta[ $feature ] ?? 0 ) + 1;
			update_post_meta( $post_id, self::META_KEY, $meta );
		}
	}

	/**
	 * Normalised, fixed-schema snapshot for the wpinsight collector. Every feature key
	 * is always present (default 0); the AI Edit action breakdown is included when set.
	 *
	 * @return array<string,int|array<string,int>>
	 */
	public static function snapshot() {
		$usage = get_option( self::OPTION_KEY, [] );
		$usage = is_array( $usage ) ? $usage : [];

		$out = [];
		foreach ( self::FEATURES as $key ) {
			$out[ $key ] = (int) ( $usage[ $key ] ?? 0 );
		}

		if ( ! empty( $usage['ai_edit_actions'] ) && is_array( $usage['ai_edit_actions'] ) ) {
			$out['ai_edit_actions'] = array_map( 'intval', $usage['ai_edit_actions'] );
		}

		return $out;
	}
}
