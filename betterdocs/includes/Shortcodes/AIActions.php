<?php

namespace WPDeveloper\BetterDocs\Shortcodes;

use WPDeveloper\BetterDocs\Core\Shortcode;

/**
 * [betterdocs_ai_actions] — the "Copy page" split button.
 *
 * The single render path for the feature, the way [betterdocs_reading_time] is
 * for reading time: the classic single-doc templates, the Gutenberg block and
 * the Elementor widget all reach the button through this shortcode rather than
 * calling Core\AIActions::render() themselves.
 *
 * Attributes:
 *   enable          bool   Render at all. Default true.
 *   post_id         int    Which doc to act on. Defaults to the current post,
 *                          which is what you want inside a doc template and
 *                          useless outside one.
 *   actions         string Comma-separated allow-list of action ids, e.g.
 *                          "copy-page,open-chatgpt". Listed actions are forced
 *                          on and every other action off. Omit to inherit the
 *                          global per-action settings.
 *   button_label    string Overrides the `ai_actions_button_label` setting.
 *   prompt_template string Overrides the `ai_actions_prompt_template` setting.
 *                          Cannot contain `]` — WP's shortcode regex excludes it
 *                          from the attribute run, so the tag is truncated there
 *                          and the remainder spills into the page as body text.
 *                          Set the `ai_actions_prompt_template` setting instead
 *                          when the prompt needs a bracket.
 *   context         string Internal. See push_context().
 *
 * @since 4.8.0
 */
class AIActions extends Shortcode {
	/**
	 * One-shot argument handoffs for the block and the widget.
	 *
	 * Those two callers hold a typed args array — an `enabled_actions` map plus
	 * free-text overrides — and none of it survives a round trip through a
	 * shortcode attribute string:
	 *
	 * - WP's shortcode regex excludes `]` from the attribute run, and esc_attr()
	 *   does not escape it, so a `]` anywhere in `prompt_template` (long, user
	 *   editable, and the place a bracket is most likely to appear) truncates the
	 *   tag and dumps the rest as body text.
	 * - `enabled_actions` is tri-state — absent means "inherit the global
	 *   setting", present means "force on/off" (Core\AIActions::action_enabled())
	 *   — and a flat comma list can only express two of those three.
	 *
	 * So internal callers stash the array here, pass the opaque token, and the
	 * shortcode pops it. Tokens are consumed on read, so a value cannot leak into
	 * a second instance on the same page.
	 *
	 * @var array<string, array>
	 */
	private static $contexts = [];

	/**
	 * Stash a typed args array and get back a shortcode-safe token.
	 *
	 * @param array $args As accepted by Core\AIActions::render().
	 * @return string
	 */
	public static function push_context( array $args ) {
		$token                     = wp_unique_id( 'bd-ai-' );
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
		return 'betterdocs_ai_actions';
	}

	public function get_style_depends() {
		return [ 'betterdocs-ai-actions' ];
	}

	public function get_script_depends() {
		return [ 'betterdocs' ];
	}

	public function default_attributes() {
		return [
			'enable'          => true,
			'post_id'         => 0,
			'actions'         => '',
			'button_label'    => '',
			'prompt_template' => '',
			'context'         => ''
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

		betterdocs()->ai_actions->render( $post_id, $this->render_args() );
	}

	/**
	 * Per-instance overrides for Core\AIActions::render().
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

		$enabled = $this->enabled_actions();
		if ( null !== $enabled ) {
			$args['enabled_actions'] = $enabled;
		}

		// Blank means inherit, so an unset attribute is left out entirely rather
		// than passed as an empty string.
		foreach ( [ 'button_label', 'prompt_template' ] as $key ) {
			$value = (string) $this->attributes[ $key ];
			if ( '' !== trim( $value ) ) {
				$args[ $key ] = $value;
			}
		}

		return $args;
	}

	/**
	 * Turn the `actions` allow-list into the tri-state map render() expects.
	 *
	 * An author writing the shortcode by hand means "show exactly these", so a
	 * non-empty list forces every known action on or off explicitly. An omitted
	 * attribute returns null, leaving every action to its global setting.
	 *
	 * @return array<string, bool>|null
	 */
	protected function enabled_actions() {
		$list = trim( (string) $this->attributes['actions'] );

		if ( '' === $list ) {
			return null;
		}

		$allowed = array_filter( array_map( 'trim', explode( ',', $list ) ) );
		$enabled = [];

		foreach ( betterdocs()->ai_actions->catalog() as $action ) {
			$enabled[ $action['id'] ] = in_array( $action['id'], $allowed, true );
		}

		return $enabled;
	}
}
