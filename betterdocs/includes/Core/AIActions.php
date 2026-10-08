<?php

namespace WPDeveloper\BetterDocs\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

use WPDeveloper\BetterDocs\Utils\Views;

/**
 * The AI Actions registry.
 *
 * Renders a split button beside the single-doc title: a primary "Copy page"
 * half that puts the doc on the clipboard as Markdown, and a disclosure half
 * that opens the rest of the actions — view the raw Markdown, or hand the doc to
 * ChatGPT, Claude or Google AI Studio as context.
 *
 * Every entry lives in a filterable array, so a Pro feature, an MCP install
 * command or a PDF download becomes one more element in `betterdocs_ai_actions`
 * rather than a change to this class or to the frontend JavaScript.
 *
 * An action is:
 *
 *   id            string  unique slug; becomes data-bd-action
 *   label         string  translated, escaped on output
 *   description   string  translated secondary line
 *   icon          string  key for AIActions::icon(), or a raw SVG string
 *   setting_key   string  Settings key gating the item. Optional — an empty key,
 *                         or one with no registered default, means "always on".
 *   type          string  `copy` (a button run by JS) | `link` (a real anchor)
 *   handler       string  JS handler id; required when type is `copy`
 *   source        string  `md` | `page` — which URL substitutes into {URL}
 *   href_template string  {PROMPT} {URL} {MD_URL} {PAGE_URL} {TITLE}
 *   target        string  `_blank` or empty
 *   primary       bool    exactly one action may own the split button's main half
 *   priority      int     sort order
 *
 * @since 4.8.0
 */
class AIActions {
	/**
	 * @var Settings
	 */
	protected $settings;

	/**
	 * @var Views
	 */
	protected $views;

	/**
	 * @var MarkdownRenderer
	 */
	protected $renderer;

	/**
	 * @var MarkdownEndpoint
	 */
	protected $endpoint;

	/**
	 * Keys in a caller's `$args` that configure *which* actions resolve and *how*,
	 * as opposed to view params the template reads.
	 *
	 * They are split out before the array reaches Views, because Views params are
	 * sticky across calls (see render()) and a key no template reads has no business
	 * persisting into the next instance on the page.
	 *
	 * @var string[]
	 */
	protected static $resolve_keys = [ 'prompt_template', 'enabled_actions' ];

	public function __construct( Settings $settings, Views $views, MarkdownRenderer $renderer, MarkdownEndpoint $endpoint ) {
		$this->settings = $settings;
		$this->views    = $views;
		$this->renderer = $renderer;
		$this->endpoint = $endpoint;
	}

	/**
	 * Master switch for the whole feature.
	 *
	 * @return bool
	 */
	public function is_enabled() {
		/**
		 * Toggle the AI Actions button independently of the setting.
		 *
		 * @since 4.8.0
		 *
		 * @param bool $enabled
		 */
		return (bool) apply_filters( 'betterdocs_ai_actions_enabled', (bool) $this->settings->get( 'enable_ai_actions' ) );
	}

	/**
	 * Default keys, so a third-party registry entry may omit any of them.
	 *
	 * @return array
	 */
	public function defaults() {
		return [
			'id'            => '',
			'label'         => '',
			'description'   => '',
			'icon'          => '',
			'setting_key'   => '',
			'type'          => 'link',
			'handler'       => '',
			'source'        => 'md',
			'href_template' => '',
			'target'        => '_blank',
			'primary'       => false,
			'priority'      => 100,
			// Menu grouping. The view draws a rule wherever this changes between
			// two consecutive entries, so an added entry only has to say which side
			// of the divider it belongs on. `page` acts on this doc, `llm` hands it
			// to somebody else's assistant.
			'group'         => 'llm'
		];
	}

	/**
	 * The registry.
	 *
	 * URL formats mirror what Mintlify ships in production. Two are worth calling
	 * out because they look like mistakes and are not:
	 *
	 *  - ChatGPT gets the plain permalink rather than the `.md` URL. Its browsing
	 *    tool renders HTML perfectly well, and the `hints=search` parameter makes it
	 *    fetch rather than guess.
	 *  - "Gemini" points at Google AI Studio. gemini.google.com has no prompt
	 *    prefill parameter — the browser extensions that claim otherwise exist
	 *    precisely because it does not — while AI Studio supports `?prompt=`.
	 *
	 * @return array id => definition
	 */
	public function registry() {
		$ask = __( 'Ask questions about this page', 'betterdocs' );

		$actions = [
			'copy-page'       => [
				'id'          => 'copy-page',
				'label'       => __( 'Copy page', 'betterdocs' ),
				'description' => __( 'Copy this page as Markdown for LLMs', 'betterdocs' ),
				'icon'        => 'copy',
				'setting_key' => 'ai_actions_copy_page',
				'type'        => 'copy',
				'handler'     => 'copy-markdown',
				'source'      => 'md',
				'target'      => '',
				'primary'     => true,
				'priority'    => 10,
				'group'       => 'page'
			],
			'view-markdown'   => [
				'id'            => 'view-markdown',
				'label'         => __( 'View as Markdown', 'betterdocs' ),
				'description'   => __( 'Open this page as plain Markdown', 'betterdocs' ),
				'icon'          => 'markdown',
				'setting_key'   => 'ai_actions_view_markdown',
				'href_template' => '{MD_URL}',
				'priority'      => 20,
				'group'         => 'page'
			],
			'open-chatgpt'    => [
				'id'            => 'open-chatgpt',
				'label'         => __( 'Open in ChatGPT', 'betterdocs' ),
				'description'   => $ask,
				'icon'          => 'chatgpt',
				'setting_key'   => 'ai_actions_chatgpt',
				'source'        => 'page',
				'href_template' => 'https://chatgpt.com/?hints=search&q={PROMPT}',
				'priority'      => 30
			],
			'open-claude'     => [
				'id'            => 'open-claude',
				'label'         => __( 'Open in Claude', 'betterdocs' ),
				'description'   => $ask,
				'icon'          => 'claude',
				'setting_key'   => 'ai_actions_claude',
				'href_template' => 'https://claude.ai/new?q={PROMPT}',
				'priority'      => 40
			],
			'open-aistudio'   => [
				'id'            => 'open-aistudio',
				'label'         => __( 'Open in Google AI Studio', 'betterdocs' ),
				'description'   => __( 'Ask questions about this page (Google account required)', 'betterdocs' ),
				'icon'          => 'gemini',
				'setting_key'   => 'ai_actions_gemini',
				'href_template' => 'https://aistudio.google.com/prompts/new_chat?prompt={PROMPT}',
				'priority'      => 50
			],
			'open-perplexity' => [
				'id'            => 'open-perplexity',
				'label'         => __( 'Open in Perplexity', 'betterdocs' ),
				'description'   => $ask,
				'icon'          => 'perplexity',
				'setting_key'   => 'ai_actions_perplexity',
				// /search?q= answers with a 301; /search/new?q= is the current form.
				'href_template' => 'https://www.perplexity.ai/search/new?q={PROMPT}',
				'priority'      => 60
			],
			'open-grok'       => [
				'id'            => 'open-grok',
				'label'         => __( 'Open in Grok', 'betterdocs' ),
				'description'   => $ask,
				'icon'          => 'grok',
				'setting_key'   => 'ai_actions_grok',
				'href_template' => 'https://grok.com/?q={PROMPT}',
				'priority'      => 70
			]
		];

		/**
		 * Filter the AI Actions registry.
		 *
		 * Add an element to put a new item in the dropdown. A `link` action needs no
		 * JavaScript at all; a `copy` action needs a matching handler registered on
		 * `window.betterdocsAIActionHandlers`.
		 *
		 * @since 4.8.0
		 *
		 * @param array    $actions  id => definition
		 * @param Settings $settings
		 */
		return (array) apply_filters( 'betterdocs_ai_actions', $actions, $this->settings );
	}

	/**
	 * Registry, reduced to what this doc should actually show, with every URL
	 * resolved.
	 *
	 * `$args` lets one caller — a block, a widget, a shortcode — configure its own
	 * instance without touching the global settings. Every key is optional and a
	 * blank one means "inherit", so an untouched control falls through to the
	 * Settings panel rather than overriding it with emptiness.
	 *
	 * @param \WP_Post|int|null $post
	 * @param array             $args {
	 *     @type string $prompt_template Overrides `ai_actions_prompt_template`.
	 *     @type array  $enabled_actions Action id => bool, overriding that action's
	 *                                   `setting_key`.
	 * }
	 * @return array
	 */
	public function resolve( $post, $args = [] ) {
		$post = get_post( $post );

		if ( ! $post instanceof \WP_Post || ! $this->renderer->can_read( $post ) ) {
			return [];
		}

		$md_url   = $this->endpoint->url( $post );
		$page_url = get_permalink( $post );
		$template = isset( $args['prompt_template'] ) ? (string) $args['prompt_template'] : '';

		// Blank means inherit, at both levels: an untouched block control falls
		// through to the setting, and a cleared setting falls through to the string
		// the feature shipped with.
		if ( '' === trim( $template ) ) {
			$template = (string) $this->settings->get( 'ai_actions_prompt_template' );
		}

		if ( '' === trim( $template ) ) {
			$template = __( 'Read from {URL} so I can ask questions about it.', 'betterdocs' );
		}

		$resolved = [];

		foreach ( $this->registry() as $id => $action ) {
			$action       = wp_parse_args( $action, $this->defaults() );
			$action['id'] = '' !== $action['id'] ? $action['id'] : $id;

			if ( ! $this->action_enabled( $action, $args ) ) {
				continue;
			}

			// An action that needs the Markdown address is meaningless when the
			// endpoint is off or the doc has no Markdown URL.
			if ( 'md' === $action['source'] && '' === $md_url ) {
				continue;
			}

			$url    = 'page' === $action['source'] ? $page_url : $md_url;
			$prompt = str_replace( '{URL}', $url, $template );

			/**
			 * Filter the prompt handed to an AI assistant.
			 *
			 * @since 4.8.0
			 *
			 * @param string   $prompt
			 * @param array    $action
			 * @param \WP_Post $post
			 */
			$prompt = (string) apply_filters( 'betterdocs_ai_actions_prompt', $prompt, $action, $post );

			$action['href'] = strtr(
				$action['href_template'],
				[
					'{PROMPT}'   => rawurlencode( $prompt ),
					'{URL}'      => $url,
					'{MD_URL}'   => $md_url,
					'{PAGE_URL}' => $page_url,
					'{TITLE}'    => rawurlencode( get_the_title( $post ) )
				]
			);

			$resolved[ $action['id'] ] = $action;
		}

		uasort(
			$resolved,
			function ( $a, $b ) {
				return (int) $a['priority'] - (int) $b['priority'];
			}
		);

		/**
		 * Last chance to alter the rendered action list for a doc.
		 *
		 * @since 4.8.0
		 * @since 4.9.1 `$args` added.
		 *
		 * @param array    $resolved
		 * @param \WP_Post $post
		 * @param array    $args Per-instance overrides from the calling surface.
		 */
		return (array) apply_filters( 'betterdocs_ai_actions_resolved', $resolved, $post, $args );
	}

	/**
	 * The registry, normalised and ordered, for a surface that has no doc to
	 * resolve against.
	 *
	 * The block editor is the caller: it has to draw the dropdown so the author can
	 * see what each toggle does, but there is no post to build hrefs from and the
	 * preview must never navigate anywhere. So this is everything the menu needs to
	 * be *drawn* — label, description, icon markup, whether it owns the primary half
	 * — and nothing it would need to be *used*.
	 *
	 * Order and `setting_key` come straight from registry(), so an entry a third
	 * party adds through `betterdocs_ai_actions` shows up in the editor too.
	 *
	 * @since 4.9.1
	 *
	 * @return array[] Ordered list, lowest priority first.
	 */
	public function catalog() {
		$catalog = [];

		foreach ( $this->registry() as $id => $action ) {
			$action = wp_parse_args( $action, $this->defaults() );

			$catalog[] = [
				'id'          => '' !== $action['id'] ? $action['id'] : $id,
				'label'       => (string) $action['label'],
				'description' => (string) $action['description'],
				'icon'        => self::icon( $action['icon'] ),
				'setting_key' => (string) $action['setting_key'],
				'primary'     => (bool) $action['primary'],
				// Only a link can open a tab. The editor no longer draws an arrow for
				// it — neither does the frontend — but the flag still says which rows
				// leave the site, and a third-party preview may want it.
				'external'    => 'copy' !== $action['type'] && '_blank' === $action['target'],
				// So the editor preview can draw the same group rule as the frontend.
				'group'       => (string) $action['group'],
				'priority'    => (int) $action['priority']
			];
		}

		usort(
			$catalog,
			function ( $a, $b ) {
				return $a['priority'] - $b['priority'];
			}
		);

		return $catalog;
	}

	/**
	 * Is this action switched on?
	 *
	 * An action whose `setting_key` is empty, or is not a key BetterDocs registers a
	 * default for, is treated as always on. That is what makes a third-party
	 * registry entry work without also registering a setting.
	 *
	 * Settings::get() is deliberately called with no `$default` argument: passing
	 * one overrides the registered default, and `betterdocs_settings` only ever
	 * contains keys the user has actually saved.
	 *
	 * A caller's `enabled_actions` map wins over both, and is keyed on the action id
	 * rather than on `setting_key` so that a third-party registry entry with no
	 * setting at all is still switchable per instance.
	 *
	 * @param array $action
	 * @param array $args
	 * @return bool
	 */
	protected function action_enabled( $action, $args = [] ) {
		if ( isset( $args['enabled_actions'][ $action['id'] ] ) ) {
			return (bool) $args['enabled_actions'][ $action['id'] ];
		}

		$key = $action['setting_key'];

		if ( '' === $key ) {
			return true;
		}

		$registered = array_merge( $this->settings->get_default(), $this->settings->get_pro_defaults() );
		if ( ! array_key_exists( $key, $registered ) ) {
			return true;
		}

		return (bool) $this->settings->get( $key );
	}

	/**
	 * Will render() actually output anything for this doc?
	 *
	 * Templates need this before they commit to a layout: every action can be
	 * switched off individually, and a doc the reader may not read resolves to
	 * nothing at all, so "the feature is on" is not the same as "there is a button".
	 *
	 * @param \WP_Post|int|null $post
	 * @param array             $args Per-instance overrides, as for resolve(). An
	 *                                `enable` of false answers false outright.
	 * @return bool
	 */
	public function has_actions( $post = null, $args = [] ) {
		if ( isset( $args['enable'] ) && ! $args['enable'] ) {
			return false;
		}

		if ( ! $this->is_enabled() ) {
			return false;
		}

		$post = get_post( $post );

		return $post instanceof \WP_Post && ! empty( $this->resolve( $post, $args ) );
	}

	/**
	 * Render the button for a doc.
	 *
	 * @param \WP_Post|int|null $post
	 * @param array             $extra {
	 *     View params, plus the per-instance overrides resolve() understands.
	 *
	 *     @type bool   $enable          Switch this instance off. Cannot switch it
	 *                                   *on* — see below.
	 *     @type string $button_label    Overrides `ai_actions_button_label`.
	 *     @type string $prompt_template Overrides `ai_actions_prompt_template`.
	 *     @type array  $enabled_actions Action id => bool.
	 *     @type string $widget_type
	 *     @type string $blockId
	 * }
	 */
	public function render( $post = null, $extra = [] ) {
		$post = get_post( $post );

		if ( ! $post instanceof \WP_Post ) {
			return;
		}

		// A surface may switch its own instance off, but never on: the global stays a
		// hard kill switch, so turning the feature off in Settings cannot be undone
		// by a block somebody placed a year ago and forgot about.
		if ( isset( $extra['enable'] ) && ! $extra['enable'] ) {
			return;
		}

		if ( ! $this->is_enabled() ) {
			return;
		}

		$actions = $this->resolve( $post, $extra );
		if ( empty( $actions ) ) {
			return;
		}

		// Views is a shared singleton whose params are sticky across calls, so every
		// key this template reads has to be passed explicitly — otherwise a block
		// rendered earlier on the page leaks its blockId into the classic instance.
		// For the same reason the resolve-only keys are dropped here rather than
		// forwarded: no template reads them, so nothing should keep them alive.
		$this->views->get(
			'templates/parts/ai-actions',
			wp_parse_args(
				array_diff_key( $extra, array_flip( self::$resolve_keys ) ),
				[
					'enable'       => true,
					'actions'      => $actions,
					'md_url'       => $this->endpoint->url( $post ),
					// The clipboard gets the human-facing profile — no YAML front
					// matter, since this is about to be pasted into a chat box.
					'copy_url'     => $this->endpoint->url( $post, 'copy' ),
					'page_url'     => get_permalink( $post ),
					'doc_id'       => (int) $post->ID,
					'uid'          => wp_unique_id( 'betterdocs-ai-actions-' ),
					'button_label' => (string) $this->settings->get( 'ai_actions_button_label' ),
					'widget_type'  => '',
					'blockId'      => ''
				]
			)
		);
	}

	/**
	 * Inline SVG for an icon key. An unrecognised key that looks like markup is
	 * returned as-is (so a registry entry can supply its own), otherwise the generic
	 * sparkle is used.
	 *
	 * @param string $key
	 * @return string
	 */
	public static function icon( $key ) {
		if ( false !== strpos( (string) $key, '<svg' ) ) {
			return $key;
		}

		// Weights, not sizes: the stylesheet sizes these (14px in the button, 15px
		// in the menu tiles), and at 14px a 1.8 stroke leaves the two smallest
		// glyphs — the caret and the copied tick — visibly lighter than the label
		// beside them. Both are drawn at 2.4, which is what the design specifies.
		$strokes = [
			'caret' => '2.4',
			'check' => '2.4'
		];
		$stroke  = isset( $strokes[ $key ] ) ? $strokes[ $key ] : '2';

		$open   = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="' . $stroke . '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
		$shapes = [
			'copy'       => '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
			'check'      => '<path d="m20 6-11 11-5-5"/>',
			'alert'      => '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5h.01"/>',
			'markdown'   => '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 15V9l3 3 3-3v6M17 9v5m0 0 2-2m-2 2-2-2"/>',
			'caret'      => '<path d="m6 9 6 6 6-6"/>',
			'chatgpt'    => '<path d="M12 2.5 20.5 7.25v9.5L12 21.5 3.5 16.75v-9.5z"/><path d="M12 7.5v9M8.2 9.6l7.6 4.4M15.8 9.6l-7.6 4.4"/>',
			// Anthropic's mark is a radiating burst.
			'claude'     => '<path d="M12 2.5v19M2.5 12h19M5.2 5.2l13.6 13.6M18.8 5.2 5.2 18.8"/>',
			// Google's Gemini spark: a four-pointed concave star.
			'gemini'     => '<path d="M12 2c0 5.52 4.48 10 10 10-5.52 0-10 4.48-10 10 0-5.52-4.48-10-10-10 5.52 0 10-4.48 10-10Z"/>',
			'perplexity' => '<path d="M12 3.5v17M12 9 5.5 4v6.5h13V4L12 9M5.5 13.5V20l6.5-5 6.5 5v-6.5"/>',
			'grok'       => '<path d="M4.5 19.5 19.5 4.5M9.5 4.5 19.5 19.5M4.5 4.5 9 10.5"/>',
			'sparkle'    => '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>'
		];

		$shape = isset( $shapes[ $key ] ) ? $shapes[ $key ] : $shapes['sparkle'];

		return $open . $shape . '</svg>';
	}

	/**
	 * wp_kses allowlist for action icons, including SVGs supplied by third-party
	 * registry entries.
	 *
	 * Attribute names are lower-cased by wp_kses, so `viewBox` is listed as
	 * `viewbox` — which is what HTML parsing expects anyway.
	 *
	 * @return array
	 */
	public static function svg_kses() {
		$shape = [
			'fill'             => [],
			'fill-rule'        => [],
			'fill-opacity'     => [],
			'clip-rule'        => [],
			'clip-path'        => [],
			'stroke'           => [],
			'stroke-width'     => [],
			'stroke-linecap'   => [],
			'stroke-linejoin'  => [],
			'stroke-dasharray' => [],
			'opacity'          => [],
			'transform'        => [],
			'class'            => [],
			'style'            => [],
			'mask'             => [],
			'id'               => []
		];

		return [
			'svg'      => array_merge(
				$shape,
				[
					'xmlns'       => [],
					'viewbox'     => [],
					'width'       => [],
					'height'      => [],
					'aria-hidden' => [],
					'role'        => [],
					'focusable'   => []
				]
			),
			'g'        => $shape,
			'path'     => array_merge( $shape, [ 'd' => [] ] ),
			'rect'     => array_merge( $shape, [ 'x' => [], 'y' => [], 'width' => [], 'height' => [], 'rx' => [], 'ry' => [] ] ),
			'circle'   => array_merge( $shape, [ 'cx' => [], 'cy' => [], 'r' => [] ] ),
			'ellipse'  => array_merge( $shape, [ 'cx' => [], 'cy' => [], 'rx' => [], 'ry' => [] ] ),
			'line'     => array_merge( $shape, [ 'x1' => [], 'y1' => [], 'x2' => [], 'y2' => [] ] ),
			'polyline' => array_merge( $shape, [ 'points' => [] ] ),
			'polygon'  => array_merge( $shape, [ 'points' => [] ] ),
			'mask'     => array_merge( $shape, [ 'maskunits' => [], 'x' => [], 'y' => [], 'width' => [], 'height' => [] ] ),
			'defs'     => [],
			'clippath' => [ 'id' => [] ],
			'title'    => [],
			'desc'     => []
		];
	}
}
