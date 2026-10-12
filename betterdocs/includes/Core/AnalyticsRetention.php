<?php

namespace WPDeveloper\BetterDocs\Core;

use WPDeveloper\BetterDocs\Utils\Base;

/**
 * Free analytics retention.
 *
 * Free keeps every analytics row forever by default; nothing is purged. A site
 * that wants a rolling window can opt in through the
 * betterdocs_analytics_retention_days filter (number of days, 0 = keep forever),
 * and a daily native-cron purge of the aggregate tables then trims older rows.
 *
 * Earlier versions purged anything older than 12 months on every Free-only
 * install. That schedule is cleared on the next request when no window is set.
 *
 * Pro-safe: when Pro is active the purge is skipped entirely, because Pro
 * manages its own retention (data_retention_days) on top of these tables.
 */
class AnalyticsRetention extends Base {
	const CRON_HOOK = 'betterdocs_analytics_cleanup';

	public function __construct() {
		add_action( 'init', [ $this, 'maybe_schedule_cleanup' ] );
		add_action( self::CRON_HOOK, [ $this, 'run_cleanup' ] );

		if ( defined( 'BETTERDOCS_PLUGIN_FILE' ) ) {
			register_deactivation_hook( BETTERDOCS_PLUGIN_FILE, [ $this, 'clear_cleanup' ] );
		}
	}

	/**
	 * Retention window in days. 0 (the default) keeps everything.
	 *
	 * @return int
	 */
	public function retention_days() {
		return max( 0, (int) apply_filters( 'betterdocs_analytics_retention_days', 0 ) );
	}

	/**
	 * Schedule the daily purge only while a window is set; otherwise make sure
	 * no purge is left scheduled (including the one older versions added).
	 */
	public function maybe_schedule_cleanup() {
		$scheduled = wp_next_scheduled( self::CRON_HOOK );

		if ( betterdocs()->is_pro_active() || $this->retention_days() < 1 ) {
			if ( $scheduled ) {
				$this->clear_cleanup();
			}
			return;
		}

		if ( ! $scheduled ) {
			wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', self::CRON_HOOK );
		}
	}

	public function clear_cleanup() {
		wp_clear_scheduled_hook( self::CRON_HOOK );
	}

	/**
	 * Delete aggregate rows older than the opted-in retention window. No-op when
	 * Pro is active or no window is set.
	 */
	public function run_cleanup() {
		if ( betterdocs()->is_pro_active() ) {
			return;
		}

		$days = $this->retention_days();
		if ( $days < 1 ) {
			return;
		}

		global $wpdb;

		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->prefix}betterdocs_analytics WHERE created_at < DATE_SUB( CURDATE(), INTERVAL %d DAY )",
				$days
			)
		);

		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->prefix}betterdocs_search_log WHERE created_at < DATE_SUB( CURDATE(), INTERVAL %d DAY )",
				$days
			)
		);
	}
}
