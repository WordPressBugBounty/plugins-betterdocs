<?php

namespace WPDeveloper\BetterDocs\Utils;

/**
 * Exit if accessed directly
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Counts how often a non-AI feature is actually used, for the Insights payload
 * (docs/insights-tracking.md). AI feature runs have their own recorder,
 * {@see AIUsage}; this one is for everything else — a Markdown copy served, a
 * PDF exported, a transcript emailed.
 *
 * One non-autoloaded option holds every counter as a running total plus a
 * per-day tally for the last 30 days, so the collectors can ship both a total
 * and a recent window without a table:
 *
 *     betterdocs_usage_counters = {
 *         pdf_exports: { total: 41, days: { "2026-10-14": 3, … } },
 *         …
 *     }
 *
 * Pro and the AI Chatbot add-on use the same recorder, so every tier's
 * counters live in one place. Keys are short snake_case feature names.
 *
 * @since 4.9.6
 */
class UsageCounter {
	const OPTION = 'betterdocs_usage_counters';
	const DAYS   = 30;

	/**
	 * {@see self::record_sampled()}: hits buffered in a persistent object cache
	 * before they are written to the option.
	 */
	const FLUSH_EVERY = 20;

	/**
	 * {@see self::record_sampled()}: without a persistent object cache, one hit
	 * in this many is written (weighted by the same factor).
	 */
	const SAMPLE_RATE = 10;

	/**
	 * Add uses of a feature.
	 *
	 * @param string $key   Feature name, e.g. `markdown_views`.
	 * @param int    $count How many uses to add. Default 1.
	 */
	public static function record( $key, $count = 1 ) {
		$key   = sanitize_key( (string) $key );
		$count = max( 0, (int) $count );
		if ( '' === $key || 0 === $count ) {
			return;
		}

		$all   = self::all();
		$entry = isset( $all[ $key ] ) && is_array( $all[ $key ] ) ? $all[ $key ] : [];
		$today = gmdate( 'Y-m-d' );
		$days  = isset( $entry['days'] ) && is_array( $entry['days'] ) ? $entry['days'] : [];

		$days[ $today ] = (int) ( $days[ $today ] ?? 0 ) + $count;

		$all[ $key ] = [
			'total' => (int) ( $entry['total'] ?? 0 ) + $count,
			'days'  => self::prune( $days ),
		];
		update_option( self::OPTION, $all, false );
	}

	/**
	 * Record a use on a hot, anonymous path (e.g. every `.md` fetch) without an
	 * option write per request.
	 *
	 * With a persistent object cache the hits are counted in the cache and
	 * written every FLUSH_EVERY hits (a cache eviction loses at most that many).
	 * Without one, a cache counter would itself be a database write, so one hit
	 * in SAMPLE_RATE is written, weighted by SAMPLE_RATE: the totals become an
	 * estimate, which is all the usage insight needs.
	 *
	 * @since 4.9.6
	 *
	 * @param string $key Feature name, e.g. `markdown_views`.
	 */
	public static function record_sampled( $key ) {
		$key = sanitize_key( (string) $key );
		if ( '' === $key ) {
			return;
		}

		if ( wp_using_ext_object_cache() ) {
			$group   = 'betterdocs_usage';
			$pending = wp_cache_incr( $key, 1, $group );
			if ( false === $pending ) {
				wp_cache_add( $key, 0, $group );
				$pending = wp_cache_incr( $key, 1, $group );
			}
			if ( false === $pending ) {
				// The cache refused the counter: fall back to sampling.
				self::record_one_in( $key, self::SAMPLE_RATE );
				return;
			}
			if ( (int) $pending >= self::FLUSH_EVERY ) {
				wp_cache_decr( $key, (int) $pending, $group );
				self::record( $key, (int) $pending );
			}
			return;
		}

		self::record_one_in( $key, self::SAMPLE_RATE );
	}

	/**
	 * Write one hit in `$rate`, weighted by `$rate`.
	 *
	 * @param string $key
	 * @param int    $rate
	 */
	protected static function record_one_in( $key, $rate ) {
		$rate = max( 1, (int) $rate );
		if ( 1 === wp_rand( 1, $rate ) ) {
			self::record( $key, $rate );
		}
	}

	/**
	 * A counter's running total and its last-7 and last-30-day sums.
	 *
	 * @param string $key
	 * @return array{total:int,last_7d:int,last_30d:int}
	 */
	public static function get( $key ) {
		$all   = self::all();
		$entry = isset( $all[ $key ] ) && is_array( $all[ $key ] ) ? $all[ $key ] : [];
		$days  = isset( $entry['days'] ) && is_array( $entry['days'] ) ? $entry['days'] : [];

		return [
			'total'    => (int) ( $entry['total'] ?? 0 ),
			'last_7d'  => self::sum_since( $days, 7 ),
			'last_30d' => self::sum_since( $days, self::DAYS ),
		];
	}

	protected static function all() {
		$all = get_option( self::OPTION, [] );
		return is_array( $all ) ? $all : [];
	}

	protected static function sum_since( array $days, $window ) {
		$since = gmdate( 'Y-m-d', strtotime( '-' . ( $window - 1 ) . ' days' ) );
		$sum   = 0;
		foreach ( $days as $day => $count ) {
			if ( $day >= $since ) {
				$sum += (int) $count;
			}
		}
		return $sum;
	}

	/** Keep only the last 30 days. */
	protected static function prune( array $days ) {
		$since = gmdate( 'Y-m-d', strtotime( '-' . ( self::DAYS - 1 ) . ' days' ) );
		return array_filter(
			$days,
			function ( $day ) use ( $since ) {
				return $day >= $since;
			},
			ARRAY_FILTER_USE_KEY
		);
	}
}
