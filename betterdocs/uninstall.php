<?php

/**
 * Fired when the plugin is uninstalled (deleted from the Plugins screen).
 *
 * Two levels (#247):
 *
 * - Always: credentials are removed. Saved API keys and tokens must not outlive
 *   the plugin: every secret kept in `betterdocs_settings` (Free's, Pro's and
 *   the add-ons'), the MCP pairing and OAuth tokens, the AI proxy secret, and
 *   the queued HelpScout migration (its batches carry the HelpScout API key in
 *   a request header; on multisite they are network options).
 * - Only when "Delete Data on Uninstall" (`delete_data_on_uninstall`) is on:
 *   the rest of Free's own data. Its settings, options and caches, the
 *   analytics and search tables, its scheduled events, user meta and the
 *   capabilities it added to roles.
 *
 * Docs, FAQs, categories, tags and their meta are content, not plugin data,
 * and are never touched. Pro and the add-ons share the `betterdocs_` prefix
 * for their own options, transients and tables, and keep their settings in
 * `betterdocs_settings` too, so Free removes only names it owns. The settings
 * option goes as a whole only when no other BetterDocs plugin is installed.
 *
 * @link       https://wpdeveloper.com
 * @since      1.0.0
 *
 * @package    BetterDocs
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange, WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- one-time cleanup of the plugin's own options and tables.

/**
 * Setting keys that hold credentials.
 *
 * @return string[]
 */
function betterdocs_uninstall_secret_keys() {
	$keys = [
		'ai_autowrite_api_key',
		'ai_chatbot_api_key',
		'ai_api_key_openai',
		'recaptcha_secret_key',
		'helpscout_api_key',
		'git_access_token',
		'git_webhook_secret',
		'github_client_secret',
		'ga4_api_secret',
		'maxmind_license_key',
		// The AI Chatbot's, registered through filters that don't run while it
		// is inactive.
		'ai_chatbot_chat_api_key_openai',
		'ai_chatbot_chat_api_key_gemini',
		'ai_chatbot_chat_api_key_claude',
		'ai_chatbot_chat_api_key_deepseek',
		'ai_chatbot_chat_api_key_openrouter',
		'ai_chatbot_embed_api_key_openai',
		'ai_chatbot_embed_api_key_gemini',
		'ai_chatbot_embed_api_key_voyage',
		'handoff_slack_webhook_url',
		'handoff_webhook_url',
	];

	// The plugin is not loaded during uninstall; its autoloader still gives
	// the authoritative list (every AI provider key included).
	$autoload = __DIR__ . '/vendor/autoload.php';
	if ( file_exists( $autoload ) ) {
		require_once $autoload;
		if ( class_exists( '\WPDeveloper\BetterDocs\Core\Settings' ) ) {
			try {
				$keys = array_merge( $keys, (array) \WPDeveloper\BetterDocs\Core\Settings::secret_setting_keys() );
			} catch ( \Throwable $e ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- fall back to the list above.
			}
		}
	}

	return array_values( array_unique( array_filter( array_map( 'strval', $keys ) ) ) );
}

/**
 * Whether a setting key names a credential. A safety net for the keys add-ons
 * register through filters, which don't run during uninstall.
 *
 * `max_token` / `min_token` are token limits, not tokens.
 *
 * @param string $key Setting key.
 * @return bool
 */
function betterdocs_uninstall_is_secret_key( $key ) {
	return (bool) preg_match( '/(^|_)(api_key|secret|license_key|webhook_url|password)(_|$)|(^|_)(?<!max_)(?<!min_)token(_|$)/', (string) $key );
}

/**
 * The keys Free owns in `betterdocs_settings`.
 *
 * Free's defaults, less the feature toggles Pro and the AI Chatbot drive (Free
 * only ships their placeholders), plus the keys Free's screens store without a
 * default. Null when Free's defaults can't be read.
 *
 * @return string[]|null
 */
function betterdocs_uninstall_free_setting_keys() {
	$class = '\WPDeveloper\BetterDocs\Core\Settings';
	if ( ! class_exists( $class ) ) {
		return null;
	}

	try {
		// The plugin is not loaded: skip the constructor and its hooks.
		$settings = ( new \ReflectionClass( $class ) )->newInstanceWithoutConstructor();
		$keys     = array_keys( (array) $settings->get_default() );
		$not_free = array_merge(
			array_keys( (array) $settings->pro_settings_default_values() ),
			[ 'popular_keyword_limit', 'enable_glossaries_write_with_ai', 'enable_git_integration', 'enable_ai_chatbot' ]
		);
	} catch ( \Throwable $e ) {
		return null;
	}

	return array_merge(
		array_diff( $keys, $not_free ),
		[ 'dark_mode', 'helpscout_collection_id', 'export_type', 'export_docs', 'export_categories', 'export_glossaries', 'export_kbs', 'file_type', 'import_docs', 'settings_importer', '_locale', '_active_tab', 'is_pro_active' ]
	);
}

/**
 * Whether another BetterDocs plugin (Pro, the AI Chatbot, an add-on) is still
 * installed, active or not. Those keep their settings in `betterdocs_settings`.
 *
 * @return bool
 */
function betterdocs_uninstall_other_plugins_installed() {
	if ( ! function_exists( 'get_plugins' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}

	foreach ( array_keys( get_plugins() ) as $basename ) {
		if ( WP_UNINSTALL_PLUGIN !== $basename && 0 === strpos( $basename, 'betterdocs-' ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Delete options whose names match a LIKE pattern.
 *
 * @param string $pattern Already escaped for LIKE.
 */
function betterdocs_uninstall_delete_options_like( $pattern ) {
	global $wpdb;

	$names = $wpdb->get_col( $wpdb->prepare( "SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE %s", $pattern ) );
	foreach ( $names as $name ) {
		delete_option( $name );
	}
}

/**
 * Clean up one site.
 */
function betterdocs_uninstall_site() {
	global $wpdb;

	$settings    = get_option( 'betterdocs_settings' );
	$delete_data = is_array( $settings ) && ! empty( $settings['delete_data_on_uninstall'] );

	// 1. Credentials, always: every secret in the settings, whoever registered
	// it. With the data option on, Free's own settings go too; Pro's and the
	// add-ons' stay while those plugins are installed, and so does the choice
	// itself, so their uninstall can honour it.
	if ( is_array( $settings ) ) {
		$secret_keys = array_flip( betterdocs_uninstall_secret_keys() );
		$kept        = $settings;
		foreach ( array_keys( $kept ) as $key ) {
			if ( isset( $secret_keys[ $key ] ) || betterdocs_uninstall_is_secret_key( $key ) ) {
				unset( $kept[ $key ] );
			}
		}

		if ( $delete_data ) {
			if ( ! betterdocs_uninstall_other_plugins_installed() ) {
				$kept = [];
			} else {
				foreach ( (array) betterdocs_uninstall_free_setting_keys() as $key ) {
					if ( 'delete_data_on_uninstall' !== $key ) {
						unset( $kept[ $key ] );
					}
				}
			}
		}

		if ( empty( $kept ) ) {
			delete_option( 'betterdocs_settings' );
		} elseif ( $kept !== $settings ) {
			update_option( 'betterdocs_settings', $kept );
		}
	}

	delete_option( 'betterdocs_mcp_pairing' );
	delete_option( 'betterdocs_mcp_oauth' );
	delete_option( 'betterdocs_ai_proxy_secret' );

	// The queued HelpScout migration. Its batches are site options, so on
	// multisite they are network-wide and removed below, once per network.
	betterdocs_uninstall_delete_options_like( $wpdb->esc_like( 'wp_betterdocs_helpscout_migration_batch_' ) . '%' );
	delete_option( 'wp_betterdocs_helpscout_migration_status' );
	wp_clear_scheduled_hook( 'wp_betterdocs_helpscout_migration_cron' );

	if ( ! $delete_data ) {
		return;
	}

	// 2. Everything else Free owns, on request.
	$options = [
		'betterdocs_version',
		'betterdocs_db_version',
		'_betterdocs_caps_initialized',
		'_betterdocs_reusable_block_ids',
		'_betterdocs_widget_reusable_block_ids',
		'betterdocs_faq_order',
		'betterdocs_faq_scope_backfilled',
		'betterdocs_glossaries_compat_rewrite',
		'betterdocs_known_roles',
		'betterdocs_migration',
		'betterdocs_helpscout_current_page',
		'betterdocs_helpscout_total_pages',
		'betterdocs_helpscout_migrated_article_ids',
		'betterdocs_scheduled_modified_backfill_done',
		'betterdocs_doc_category_order_backfill_done',
		'betterdocs_search_collation_fixed',
		'betterdocs_search_data',
		'betterdocs_search_data_migration',
		'betterdocs_search_keyword_hash_filled',
		'betterdocs_retired_ai_models_migrated',
		'betterdocs_unlocked_analytics_settings_migrated',
		'betterdocs_ai_proxy_url',
		'betterdocs_ai_usage',
		'betterdocs_usage_counters',
		'dashboard_mode',
		'betterdocs_faq_category_children',
		'betterdocs_product_faq_category_children',
		'betterdocs_notices',
		'wpins_deactivation_reason_betterdocs',
		'wpins_deactivation_details_betterdocs',
	];
	foreach ( $options as $option ) {
		delete_option( $option );
	}

	betterdocs_uninstall_delete_options_like( $wpdb->esc_like( 'betterdocs_mcp_' ) . '%' );
	betterdocs_uninstall_delete_options_like( $wpdb->esc_like( 'bd_cache_v_' ) . '%' );
	betterdocs_uninstall_delete_options_like( $wpdb->esc_like( 'betterdocs_faq_category_children_' ) . '%' );

	// Usage-tracking data (shared with other WPDeveloper plugins: only Free's entries).
	betterdocs_uninstall_delete_options_like( $wpdb->esc_like( 'wpins_betterdocs_' ) . '%' );
	foreach ( [ 'wpins_allow_tracking', 'wpins_block_notice', 'wpins_last_track_time' ] as $option ) {
		$value = get_option( $option );
		if ( is_array( $value ) && array_key_exists( 'betterdocs', $value ) ) {
			unset( $value['betterdocs'] );
			update_option( $option, $value, false );
		}
	}

	// Free's transients only: Pro and the add-ons use the same prefix.
	foreach ( [ 'betterdocs_flush_rewrite_rules', 'betterdocs_maybe_redirect', 'betterdocs_toc_setting', 'betterdocs_helpscout_categories', 'betterdocs_insights_cache', 'betterdocs_remote_templates_v1' ] as $transient ) {
		delete_transient( $transient );
	}
	foreach ( [ 'betterdocs_site_profile_', 'betterdocs_site_content_', 'betterdocs_template_library_', 'betterdocs_mcp_rl_', 'betterdocs_feedback_rl_', 'bd_feedback_rl_' ] as $prefix ) {
		betterdocs_uninstall_delete_options_like( $wpdb->esc_like( '_transient_' . $prefix ) . '%' );
		betterdocs_uninstall_delete_options_like( $wpdb->esc_like( '_transient_timeout_' . $prefix ) . '%' );
	}

	foreach ( [ 'betterdocs_analytics', 'betterdocs_search_keyword', 'betterdocs_search_log' ] as $table ) {
		$wpdb->query( "DROP TABLE IF EXISTS `{$wpdb->prefix}{$table}`" );
	}

	foreach ( [ 'betterdocs_daily_email_reporting', 'betterdocs_weekly_email_reporting', 'betterdocs_monthly_email_reporting' ] as $hook ) {
		wp_clear_scheduled_hook( $hook );
	}

	delete_metadata( 'user', 0, 'betterdocs_introduction_meta', '', true );
	delete_metadata( 'user', 0, 'last_visited_docs_admin_page', '', true );

	// The capabilities Free added to roles (Core\Roles::defaults_capabilities()).
	$caps = [
		'edit_docs', 'edit_others_docs', 'edit_private_docs', 'edit_published_docs', 'read_private_docs',
		'publish_docs', 'delete_docs', 'delete_private_docs', 'delete_published_docs', 'delete_others_docs',
		'manage_doc_terms', 'edit_doc_terms', 'delete_doc_terms',
		'manage_knowledge_base_terms', 'edit_knowledge_base_terms', 'delete_knowledge_base_terms',
		'edit_docs_settings', 'read_docs_analytics', 'read_faq_builder',
	];
	$roles = wp_roles();
	foreach ( array_keys( $roles->roles ) as $role ) {
		foreach ( $caps as $cap ) {
			$roles->remove_cap( $role, $cap );
		}
	}
}

/**
 * The queued HelpScout migration's network options, on multisite.
 *
 * The background process keeps its batches, status and lock with the site-option
 * API, which on multisite writes to the network's `sitemeta`, not to any site's
 * options table. They hold the HelpScout API key, so they always go.
 */
function betterdocs_uninstall_network() {
	global $wpdb;

	$rows = $wpdb->get_results(
		$wpdb->prepare(
			"SELECT site_id, meta_key FROM {$wpdb->sitemeta} WHERE meta_key LIKE %s OR meta_key = %s",
			$wpdb->esc_like( 'wp_betterdocs_helpscout_migration_batch_' ) . '%',
			'wp_betterdocs_helpscout_migration_status'
		)
	);
	foreach ( $rows as $row ) {
		delete_network_option( (int) $row->site_id, $row->meta_key );
	}

	delete_site_transient( 'wp_betterdocs_helpscout_migration_process_lock' );
}

if ( is_multisite() ) {
	foreach ( get_sites( [ 'fields' => 'ids', 'number' => 0 ] ) as $betterdocs_site_id ) {
		switch_to_blog( $betterdocs_site_id );
		betterdocs_uninstall_site();
		restore_current_blog();
	}
	betterdocs_uninstall_network();
} else {
	betterdocs_uninstall_site();
	delete_site_transient( 'wp_betterdocs_helpscout_migration_process_lock' );
}
