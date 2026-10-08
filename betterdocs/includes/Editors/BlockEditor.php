<?php

namespace WPDeveloper\BetterDocs\Editors;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

use WPDeveloper\BetterDocs\Core\AIActions;
use WPDeveloper\BetterDocs\Utils\Helper;
use WPDeveloper\BetterDocs\Editors\BlockEditor\FontLoader;
use WPDeveloper\BetterDocs\Editors\BlockEditor\StyleHandler;
use WPDeveloper\BetterDocs\Editors\BlockEditor\TemplatesController;
use WPDeveloper\BetterDocs\Editors\BlockEditor\Patterns\BasePattern;

class BlockEditor extends BaseEditor {

	public function init() {
		betterdocs()->container->get( TemplatesController::class );

		add_action( 'admin_init', [ $this, 'enqueue' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue' ] );

		$_blocks_category_hook = version_compare( get_bloginfo( 'version' ), '5.8', '>=' ) ? 'block_categories_all' : 'block_categories';
		add_filter( $_blocks_category_hook, [ $this, 'register_category' ], 9, 1 );

		StyleHandler::get_instance();
		FontLoader::get_instance();

		$this->register_blocks();

		add_action( 'init', [ $this, 'pattern_category' ] );

		$this->pattern_initialization();
	}

	/**
	 * Pattren category registration.
	 * @return void
	 */
	public function pattern_category() {
		register_block_pattern_category(
			'batterdocs',
			[ 'label' => __( 'BetterDocs', 'betterdocs' ) ]
		);
	}

	/**
	 * Get all the Pattrens initialized.
	 * @return void
	 */
	public function pattern_initialization() {
		$_api_classes = scandir( __DIR__ . DIRECTORY_SEPARATOR . 'BlockEditor' . DIRECTORY_SEPARATOR . 'Patterns' );

		if ( ! empty( $_api_classes ) && is_array( $_api_classes ) ) {
			foreach ( $_api_classes as $class ) {
				if ( $class == '.' || $class == '..' || $class == 'BasePattern.php' || strpos( $class, '.' ) === 0 ) {
					continue;
				}

				$classname      = basename( $class, '.php' );
				$classname      = '\\' . __NAMESPACE__ . "\\BlockEditor\\Patterns\\$classname";
				$patterns_class = betterdocs()->container->get( $classname );

				if ( $patterns_class instanceof BasePattern ) {
					$patterns_class->pattern_category();
					$patterns_class->register();
				}
			}
		}
	}

	public function admin_init() {
		$blocks = $this->get_blocks();

		if ( empty( $blocks ) || ! is_array( $blocks ) ) {
			return;
		}

		foreach ( $blocks as $block_name => $block ) {
			if ( isset( $block['object'] ) ) {
				$block_object = betterdocs()->container->get( $block['object'] );

				if ( ! $block_object->can_enable() ) {
					continue;
				}

				$block_object->register_scripts();
			}
		}
	}

	/**
	 * Only for Admin Add/Edit Pages
	 */
	public function enqueue( $hook ) {
		$editor = 'core/edit-post';
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only screen detection.
		$page = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : '';
		if ( $hook === 'site-editor.php' || ( $hook === 'themes.php' && $page === 'gutenberg-edit-site' ) ) {
			$editor = 'core/edit-site';
		}

		$this->assets->register( 'betterdocs-blocks-editor-controls', 'blocks/controls.css' );
		$this->assets->register( 'betterdocs-blocks-editor', 'blocks/style-editor.css', [ 'betterdocs-blocks-editor-controls' ] );
		$this->assets->register( 'betterdocs-blocks-editor', 'blocks/editor.js', [ 'betterdocs-blocks-style-handler' ] );
		$this->assets->enqueue( 'betterdocs-blocks-actions', 'blocks/actions.js', [] );
		$this->assets->localize(
			'betterdocs-blocks-editor',
			'betterDocsBlocksHelper',
			array_merge([
				'is_pro_active'         => betterdocs()->is_pro_active(),
				'is_woocommerce_active' => class_exists( 'WooCommerce' ),
				'resturl'               => get_rest_url(),
				'editorType'            => $editor,
				'betterdocs_glossaries' => Helper::get_glossaries(),
				'docsIcon'              => isset( betterdocs()->settings->get( 'docs_list_icon' )['url'] ) ? betterdocs()->settings->get( 'docs_list_icon' )['url'] : '',
				'settings'              => $this->block_setting_defaults(),
				'aiActions'             => $this->ai_actions_catalog()
			], betterdocs()->settings->chatbot_active_localize())
		);

		if ( $hook == 'post-new.php' || $hook == 'post.php' || $hook == 'site-editor.php' ) {
			$this->assets->enqueue( 'fontpicker-default-theme', 'vendor/css/fonticonpicker.base-theme.react.css' );
			$this->assets->enqueue( 'fontpicker-material-theme', 'vendor/css/fonticonpicker.material-theme.react.css' );
		}
	}

	/**
	 * Settings-panel values a block uses as the default for its own controls.
	 *
	 * A block control that has never been touched should show — and render — what
	 * the Settings panel says, so switching a feature on there is enough and the
	 * per-block control is only for overriding one instance. The editor cannot read
	 * `betterdocs_settings` (the REST route behind it needs `edit_docs_settings`,
	 * which an author does not have), so the values are handed over at enqueue time.
	 *
	 * Nested deliberately: wp_localize_script casts every *top-level* scalar to a
	 * string, so a top-level `false` would arrive in JS as `""` and a `true` as
	 * `"1"`. Inside a sub-array the values are JSON-encoded and keep their types,
	 * which is what a boolean block attribute needs.
	 *
	 * Keys mirror the Settings keys exactly, so the JS side needs no translation
	 * table and a mismatch is obvious on sight.
	 *
	 * @return array
	 */
	protected function block_setting_defaults() {
		$settings = betterdocs()->settings;

		$booleans = [
			'enable_estimated_reading_time',
			'enable_ai_actions',
			'enable_listen',
			'listen_show_speed',
			'ai_actions_copy_page',
			'ai_actions_view_markdown',
			'ai_actions_chatgpt',
			'ai_actions_claude',
			'ai_actions_gemini',
			'ai_actions_perplexity',
			'ai_actions_grok'
		];

		$strings = [
			'estimated_reading_time_title',
			'estimated_reading_time_text',
			'singular_estimated_reading_time_text',
			'ai_actions_button_label',
			'ai_actions_prompt_template',
			'listen_button_label'
		];

		// Kept apart from the strings above so it arrives as a number: the JS side
		// divides by it, and "180" would work by coercion while an empty string
		// would quietly become 0.
		$numbers = [
			'listen_words_per_minute'
		];

		$defaults = [];

		foreach ( $booleans as $key ) {
			$defaults[ $key ] = (bool) $settings->get( $key );
		}

		foreach ( $strings as $key ) {
			$defaults[ $key ] = (string) $settings->get( $key );
		}

		foreach ( $numbers as $key ) {
			$defaults[ $key ] = (int) $settings->get( $key );
		}

		return $defaults;
	}

	/**
	 * Everything the editor needs to draw the AI Actions dropdown.
	 *
	 * The reading-time block's preview shows the real menu — same order, labels,
	 * descriptions and icons as the frontend — so an author can see what the action
	 * toggles do without saving and previewing. There is no post to resolve against
	 * in the editor, so no hrefs are sent: the preview is deliberately inert.
	 *
	 * `caret` rides along because the disclosure arrow is not a registry entry but
	 * still has to match the button the frontend renders.
	 *
	 * @return array
	 */
	protected function ai_actions_catalog() {
		if ( ! isset( betterdocs()->ai_actions ) ) {
			return [
				'items' => [],
				'caret' => ''
			];
		}

		return [
			'items' => betterdocs()->ai_actions->catalog(),
			'caret' => AIActions::icon( 'caret' )
		];
	}

	/**
	 * Add a block category
	 *
	 * @param $block_categories array
	 *
	 * @return array
	 */
	public function register_category( array $block_categories ): array {
		$categories_slugs = wp_list_pluck( $block_categories, 'slug' );

		return in_array( 'betterdocs', $categories_slugs, true ) ? $block_categories : array_merge(
			[
				[
					'slug'  => 'betterdocs',
					'title' => __( 'Betterdocs', 'betterdocs' )
				]
			],
			$block_categories
		);
	}

	/**
	 * Get Blocks
	 *
	 * @since 2.5.0
	 * @return array<array>
	 */
	public function get_blocks() {
		$config_array = require_once BETTERDOCS_ABSPATH . 'includes/blocks.php';
		return apply_filters( 'betterdocs_blocks_config', $config_array );
	}

	public function register_blocks( $enqueue = false ) {
		$blocks = $this->get_blocks();

		if ( empty( $blocks ) || ! is_array( $blocks ) ) {
			return;
		}

		foreach ( $blocks as $block_name => $block ) {
			if ( isset( $block['object'] ) ) {
				$block_object = betterdocs()->container->get( $block['object'] );

				if ( ! $block_object->can_enable() ) {
					continue;
				}

				if ( method_exists( $block_object, 'load_dependencies' ) ) {
					$block_object->load_dependencies();
				}

				if ( $enqueue && method_exists( $block_object, 'enqueue' ) ) {
					$block_object->enqueue( $this->assets );
					continue;
				}

				if ( method_exists( $block_object, 'inner_blocks' ) ) {
					$_inner_blocks = $block_object->inner_blocks();
					foreach ( $_inner_blocks as $block_name => $block ) {
						$block->register( $this->assets );
					}
				}

				$block_object->register( $this->assets );
			}
		}
	}
}
