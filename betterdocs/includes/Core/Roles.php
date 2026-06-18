<?php

namespace WPDeveloper\BetterDocs\Core;

use WPDeveloper\BetterDocs\Utils\Base;
use WPDeveloper\BetterDocs\Utils\Database;

class Roles extends Base {
	/**
	 * Summary of Database
	 * @var Database
	 */
	public $database;

	public function __construct( Database $database ) {
		$this->database = $database;

		$this->assign_admin_capabilities(); //will run when it is called
	}

	/**
	 * Ensure the administrator role always has every BetterDocs capability.
	 *
	 * Capabilities are normally granted on activation via Install::activate() ->
	 * setup(). But when BetterDocs is installed/activated silently by another
	 * plugin (e.g. Essential Addons from its Integrations screen, or BetterDocs
	 * Pro), the activation hook does not fire, so setup() never runs and the
	 * administrator never receives caps like edit_docs, edit_docs_settings or
	 * read_docs_analytics. That hides most of the BetterDocs admin menu (leaving
	 * only Quick Setup, gated by the core `delete_users` cap, and FAQ Builder)
	 * and makes the pages return "Sorry, you are not allowed to access this page."
	 *
	 * This self-heals that on every request: any missing admin cap is added back.
	 * add_cap() is only called for caps the role lacks, so once healed there are
	 * no further DB writes.
	 *
	 * @return void
	 */
	public function assign_admin_capabilities() {
		if ( ! current_user_can( 'administrator' ) ) {
			return;
		}

		$capabilities = $this->defaults_capabilities();
		$admin_caps   = isset( $capabilities['administrator'] ) ? $capabilities['administrator'] : [];

		if ( empty( $admin_caps ) ) {
			return;
		}

		$administrator = get_role( 'administrator' );
		if ( ! $administrator ) {
			return;
		}

		foreach ( $admin_caps as $cap ) {
			if ( ! $administrator->has_cap( $cap ) ) {
				$administrator->add_cap( $cap );
			}
		}
	}

	/**
	 * Assign FAQ Builder Capability To The Admin
	 *
	 * @deprecated Use assign_admin_capabilities() which grants the full admin
	 *             capability set (including read_faq_builder). Kept for backward
	 *             compatibility with any external callers.
	 */
	public function assgin_faq_builder_capability_to_admin() {
		if( current_user_can('administrator') && ! current_user_can('read_faq_builder') ) { // if the current user is admin, and current user does not have faq menu visibility option, then assign the faq menu visibility capability
			$current_user_role = get_role('administrator');
			$current_user_role->add_cap('read_faq_builder');
		}
	}

	/**
	 * Default Roles Capabilities
	 *
	 * @var array
	 */
	public function defaults_capabilities() {
		$default_capabilities = [
			'administrator' => [
				// post type related caps
				'edit_docs',
				'edit_others_docs',
				'edit_private_docs',
				'edit_published_docs',
				'read_private_docs',
				'publish_docs',
				'delete_docs',
				'delete_private_docs',
				'delete_published_docs',
				'delete_others_docs',

				// doc_terms related caps
				'manage_doc_terms',
				'edit_doc_terms',
				'delete_doc_terms',

				// kb terms related caps
				'manage_knowledge_base_terms',
				'edit_knowledge_base_terms',
				'delete_knowledge_base_terms',

				// Settings and Analytics Related caps
				'edit_docs_settings',
				'read_docs_analytics',
				'read_faq_builder'
			],
			'editor'        => [
				// post type related caps
				'edit_docs',
				'edit_others_docs',
				'edit_private_docs',
				'edit_published_docs',
				'read_private_docs',
				'publish_docs',
				'delete_docs',
				'delete_private_docs',
				'delete_published_docs',
				'delete_others_docs',

				// doc_terms related caps
				'manage_doc_terms',
				'edit_doc_terms',
				'delete_doc_terms',

				// kb terms related caps
				'manage_knowledge_base_terms',
				'edit_knowledge_base_terms',
				'delete_knowledge_base_terms'
			],
			'author'        => [
				'edit_docs',
				'edit_published_docs',
				'publish_docs',
				'delete_docs',
				'delete_published_docs'
			],
			'contributor'   => [
				'edit_docs',
				'delete_docs'
			],
			'other'         => [
				// post type related caps
				'edit_docs',
				'delete_docs'
			]
		];

		return apply_filters( 'betterdocs_default_caps', $default_capabilities );
	}

	public function setup( $remove = false ) {
		if ( $this->database->get( '_betterdocs_caps_initialized', false ) && ! $remove ) {
			return;
		}

		global $wp_roles;

		$capabilities = $this->defaults_capabilities();

		if ( $remove ) {
			unset( $capabilities['administrator'] );
		}

		foreach ( $capabilities as $role => $caps ) {
			foreach ( $caps as $cap ) {
				if ( $remove ) {
					$wp_roles->remove_cap( $role, $cap );
					continue;
				}

				$wp_roles->add_cap( $role, $cap );
			}
		}

		$this->database->save( '_betterdocs_caps_initialized', ! $remove );
	}
}
