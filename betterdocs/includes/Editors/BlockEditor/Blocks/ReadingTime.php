<?php

namespace WPDeveloper\BetterDocs\Editors\BlockEditor\Blocks;

use WPDeveloper\BetterDocs\Editors\BlockEditor\Block;
use WPDeveloper\BetterDocs\Shortcodes\AIActions;
use WPDeveloper\BetterDocs\Shortcodes\Listen;

/**
 * betterdocs/reading-time — the single-doc meta row.
 *
 * Three independent parts: estimated reading time and the Listen pill on the
 * leading edge, the AI Actions "Copy page" button on the trailing edge, each with
 * its own switch. The block name stays `reading-time` because it is what every
 * saved post, pattern and FSE template already refers to; only the title
 * changed.
 *
 * Every control defaults to the matching Settings-panel value, so an untouched
 * block renders exactly what the site-wide configuration says and the controls
 * exist to override one instance. See the JS counterpart in
 * `react-src/gutenberg/blocks/reading-time/src/settingDefaults.js` — the two
 * halves have to agree or the editor preview and the frontend diverge.
 */
class ReadingTime extends Block {

	// Appended, not replaced: Block::$editor_styles defaults to the BetterDocs
	// editor stylesheet, and assigning over it would take that away from this
	// block alone.
	protected $editor_styles = [
		'betterdocs-blocks-editor',
		'reading-time',
		'betterdocs-ai-actions',
		'betterdocs-listen'
	];

	protected $frontend_styles = [
		'reading-time',
		'betterdocs-ai-actions',
		'betterdocs-listen'
	];

	// Two of the three parts are interactive: clipboard copy and the disclosure menu
	// for AI Actions, the whole player for Listen.
	protected $frontend_scripts = [
		'betterdocs'
	];

	/**
	 * Action id => [ block attribute, Settings key ].
	 *
	 * Ids and Settings keys come from Core\AIActions::registry(); the attribute
	 * names come from `src/inspector.js`, which lists them in the same order.
	 * Spelled out rather than derived because the three of these that a rule would
	 * get right are outnumbered by the four it would not.
	 *
	 * @var array<string, string[]>
	 */
	const AI_ACTIONS = [
		'copy-page'       => [ 'aiCopyPage', 'ai_actions_copy_page' ],
		'view-markdown'   => [ 'aiViewMarkdown', 'ai_actions_view_markdown' ],
		'open-chatgpt'    => [ 'aiChatGPT', 'ai_actions_chatgpt' ],
		'open-claude'     => [ 'aiClaude', 'ai_actions_claude' ],
		'open-aistudio'   => [ 'aiGemini', 'ai_actions_gemini' ],
		'open-perplexity' => [ 'aiPerplexity', 'ai_actions_perplexity' ],
		'open-grok'       => [ 'aiGrok', 'ai_actions_grok' ]
	];

	public function get_name() {
		return 'reading-time';
	}

	/**
	 * Server-side fallbacks for attributes an older saved block does not carry,
	 * and for any control Gutenberg omitted because it still equals its default.
	 *
	 * These read the Settings panel for the same reason the JS defaults do: a
	 * block placed before this feature existed has none of the new attributes, and
	 * should behave as though its controls were never touched.
	 *
	 * @return array
	 */
	public function get_default_attributes() {
		$settings = betterdocs()->settings;

		$defaults = [
			'blockId'                 => '',
			'enableReadingTime'       => (bool) $settings->get( 'enable_estimated_reading_time' ),
			'readingTimeTitle'        => (string) $settings->get( 'estimated_reading_time_title' ),
			'readingTimeText'         => (string) $settings->get( 'estimated_reading_time_text' ),
			'singularReadingTimeText' => (string) $settings->get( 'singular_estimated_reading_time_text' ),
			'enableAIActions'         => (bool) $settings->get( 'enable_ai_actions' ),
			'aiButtonLabel'           => (string) $settings->get( 'ai_actions_button_label' ),
			'aiPromptTemplate'        => (string) $settings->get( 'ai_actions_prompt_template' ),
			'enableListen'            => (bool) $settings->get( 'enable_listen' ),
			'listenButtonLabel'       => (string) $settings->get( 'listen_button_label' ),
			'listenShowSpeed'         => (bool) $settings->get( 'listen_show_speed' )
		];

		foreach ( self::AI_ACTIONS as list( $attribute, $setting_key ) ) {
			$defaults[ $attribute ] = (bool) $settings->get( $setting_key );
		}

		return $defaults;
	}

	public function render( $attributes, $content ) {
		$reading_time = $this->reading_time_markup( $attributes );
		$listen       = $this->listen_markup( $attributes );
		$ai_actions   = $this->ai_actions_markup( $attributes );

		// Nothing switched on, or a doc where nothing resolves: emit no wrapper
		// rather than an empty flex row taking up vertical space. Matches what
		// views/templates/parts/doc-meta.php does for the classic layouts.
		if ( '' === $reading_time && '' === $listen && '' === $ai_actions ) {
			return;
		}

		// The same wrapper views/templates/parts/doc-meta.php emits, so the block
		// inherits the classic row's layout — including the child margin reset that
		// keeps the button on the reading-time pill's centre line — without a line
		// of CSS of its own.
		printf(
			'<div class="%s"><div class="betterdocs-doc-meta">',
			esc_attr( isset( $attributes['blockId'] ) ? $attributes['blockId'] : '' )
		);

		// One leading box holding both, rather than one each: the row's `> *` rule
		// zeroes child block margins, and the 8px gap between the pills is the
		// leading box's own, so two boxes would space them by the row's wider 16px.
		$leading = $reading_time . $listen;

		if ( '' !== $leading ) {
			echo '<div class="betterdocs-doc-meta-start">' . $leading . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered template parts, escaped at source.
		}

		if ( '' !== $ai_actions ) {
			echo '<div class="betterdocs-doc-meta-end">' . $ai_actions . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered template parts, escaped at source.
		}

		echo '</div></div>';
	}

	/**
	 * @param array $attributes
	 * @return string
	 */
	protected function reading_time_markup( $attributes ) {
		if ( empty( $attributes['enableReadingTime'] ) ) {
			return '';
		}

		// esc_attr, not esc_html: these land inside double-quoted shortcode
		// attributes, where an unescaped quote would break out of the attribute.
		return (string) do_shortcode(
			'[betterdocs_reading_time'
			. ' singular_reading_text="' . esc_attr( $attributes['singularReadingTimeText'] ) . '"'
			. ' reading_text="' . esc_attr( $attributes['readingTimeText'] ) . '"'
			. ' reading_title="' . esc_attr( $attributes['readingTimeTitle'] ) . '"]'
		);
	}

	/**
	 * @param array $attributes
	 * @return string
	 */
	protected function listen_markup( $attributes ) {
		if ( empty( $attributes['enableListen'] ) || ! isset( betterdocs()->listen ) ) {
			return '';
		}

		// Handed off by token rather than as attributes, for the reason
		// Shortcodes\Listen::push_context() gives: `show_speed` is tri-state, and a
		// shortcode attribute string cannot express "inherit the setting".
		$context = Listen::push_context( $this->listen_args( $attributes ) );

		return trim(
			(string) do_shortcode( '[betterdocs_listen context="' . esc_attr( $context ) . '"]' )
		);
	}

	/**
	 * Per-instance overrides for Core\Listen::render().
	 *
	 * A blank label means "inherit", so it is left out entirely rather than passed
	 * as an empty string. `show_speed` is passed whenever the attribute exists at
	 * all, because false is a legitimate value there and omitting it would fall
	 * back to the site-wide setting instead of switching the control off.
	 *
	 * @param array $attributes
	 * @return array
	 */
	protected function listen_args( $attributes ) {
		$args = [
			'widget_type' => 'blocks',
			'blockId'     => isset( $attributes['blockId'] ) ? $attributes['blockId'] : ''
		];

		if ( ! empty( $attributes['listenButtonLabel'] ) ) {
			$args['button_label'] = (string) $attributes['listenButtonLabel'];
		}

		if ( isset( $attributes['listenShowSpeed'] ) ) {
			$args['show_speed'] = (bool) $attributes['listenShowSpeed'];
		}

		return $args;
	}

	/**
	 * @param array $attributes
	 * @return string
	 */
	protected function ai_actions_markup( $attributes ) {
		if ( empty( $attributes['enableAIActions'] ) || ! isset( betterdocs()->ai_actions ) ) {
			return '';
		}

		// Handed off by token rather than as attributes: the args carry a tri-state
		// `enabled_actions` map and free text that a shortcode attribute string
		// cannot round-trip. See AIActions::push_context().
		$context = AIActions::push_context( $this->ai_actions_args( $attributes ) );

		return trim(
			(string) do_shortcode( '[betterdocs_ai_actions context="' . esc_attr( $context ) . '"]' )
		);
	}

	/**
	 * Per-instance overrides for Core\AIActions::render().
	 *
	 * A blank text control means "inherit", so it is left out entirely rather than
	 * passed as an empty string — render() treats a blank override as absent, but
	 * omitting it keeps the intent legible at the call site.
	 *
	 * @param array $attributes
	 * @return array
	 */
	protected function ai_actions_args( $attributes ) {
		$enabled = [];
		foreach ( self::AI_ACTIONS as $id => list( $attribute ) ) {
			if ( isset( $attributes[ $attribute ] ) ) {
				$enabled[ $id ] = (bool) $attributes[ $attribute ];
			}
		}

		$args = [
			'widget_type'     => 'blocks',
			'blockId'         => isset( $attributes['blockId'] ) ? $attributes['blockId'] : '',
			'enabled_actions' => $enabled
		];

		if ( ! empty( $attributes['aiButtonLabel'] ) ) {
			$args['button_label'] = (string) $attributes['aiButtonLabel'];
		}

		if ( ! empty( $attributes['aiPromptTemplate'] ) ) {
			$args['prompt_template'] = (string) $attributes['aiPromptTemplate'];
		}

		return $args;
	}
}
