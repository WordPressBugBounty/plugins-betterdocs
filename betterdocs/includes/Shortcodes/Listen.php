<?php

namespace WPDeveloper\BetterDocs\Shortcodes;

use WPDeveloper\BetterDocs\Core\Shortcode;

/**
 * [betterdocs_listen] — the Listen pill that morphs into an audio player.
 *
 * The single render path for the feature, the way [betterdocs_ai_actions] is for
 * AI Actions: the classic single-doc meta row, the Gutenberg block and the
 * Elementor widget all reach the pill through this shortcode rather than calling
 * Core\Listen::render() themselves.
 *
 * Attributes:
 *   enable           bool   Render at all. Default true.
 *   post_id          int    Which doc to read. Defaults to the current post,
 *                           which is what you want inside a doc template and
 *                           useless outside one.
 *   label            string Overrides the `listen_button_label` setting.
 *   show_speed       bool   Overrides the `listen_show_speed` setting.
 *   words_per_minute int    Overrides `listen_words_per_minute`, which is what
 *                           the player's total duration is estimated from.
 *   context          string Internal. See push_context().
 *
 * @since 4.9.2
 */
class Listen extends Shortcode {
	/**
	 * One-shot argument handoffs for the block and the widget.
	 *
	 * Same mechanism, and the same reason, as
	 * Shortcodes\AIActions::push_context(): `show_speed` is tri-state — absent
	 * means "inherit the global setting", present means "force on/off" — and a
	 * shortcode attribute string flattens that to two states, because an
	 * unspecified boolean attribute and a `show_speed="0"` arrive identically once
	 * shortcode_atts() has applied the defaults.
	 *
	 * Tokens are consumed on read, so a value cannot leak into a second instance
	 * on the same page.
	 *
	 * @var array<string, array>
	 */
	private static $contexts = [];

	/**
	 * Stash a typed args array and get back a shortcode-safe token.
	 *
	 * @param array $args As accepted by Core\Listen::render().
	 * @return string
	 */
	public static function push_context( array $args ) {
		$token                    = wp_unique_id( 'bd-listen-' );
		self::$contexts[ $token ] = $args;

		return $token;
	}

	/**
	 * Pop a stashed args array. Returns null when the token is unknown, so the
	 * caller can tell "no context" from "context that happened to be empty".
	 *
	 * @param string $token
	 * @return array|null
	 */
	private static function pull_context( $token ) {
		if ( ! isset( self::$contexts[ $token ] ) ) {
			return null;
		}

		$args = self::$contexts[ $token ];
		unset( self::$contexts[ $token ] );

		return $args;
	}

	public function get_name() {
		return 'betterdocs_listen';
	}

	// Nothing to load when the feature is switched off: render() outputs no pill,
	// so the stylesheet and script would be dead weight on the page.
	public function get_style_depends() {
		return betterdocs()->listen->is_enabled() ? [ 'betterdocs-listen' ] : [];
	}

	public function get_script_depends() {
		return betterdocs()->listen->is_enabled() ? [ 'betterdocs' ] : [];
	}

	public function default_attributes() {
		return [
			'enable'           => true,
			'post_id'          => 0,
			'label'            => '',
			// Deliberately '' rather than true: '' is how this shortcode says
			// "inherit the setting", and a `true` default would force the control on
			// for every author who never touched it.
			'show_speed'       => '',
			'words_per_minute' => 0,
			'context'          => ''
		];
	}

	public function render( $atts, $content = null ) {
		if ( ! $this->isset( 'enable' ) ) {
			return;
		}

		$post_id = ! empty( $this->attributes['post_id'] ) ? (int) $this->attributes['post_id'] : get_the_ID();

		if ( ! $post_id ) {
			return;
		}

		betterdocs()->listen->render( $post_id, $this->render_args() );
	}

	/**
	 * Per-instance overrides for Core\Listen::render().
	 *
	 * @return array
	 */
	protected function render_args() {
		$context = '' !== (string) $this->attributes['context']
			? self::pull_context( (string) $this->attributes['context'] )
			: null;

		if ( null !== $context ) {
			return $context;
		}

		$args = [ 'widget_type' => 'shortcode' ];

		// Blank means inherit, so an unset attribute is left out entirely rather
		// than passed as an empty string.
		$label = (string) $this->attributes['label'];
		if ( '' !== trim( $label ) ) {
			$args['button_label'] = $label;
		}

		$speed = $this->attributes['show_speed'];
		if ( '' !== $speed && null !== $speed ) {
			// filter_var, not a truthiness test: the attribute arrives as a string,
			// where "false" and "0" are both truthy.
			$args['show_speed'] = (bool) filter_var( $speed, FILTER_VALIDATE_BOOLEAN );
		}

		$wpm = (int) $this->attributes['words_per_minute'];
		if ( $wpm > 0 ) {
			$args['words_per_minute'] = $wpm;
		}

		return $args;
	}
}
