<?php

namespace WPDeveloper\BetterDocs\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

use WPDeveloper\BetterDocs\Utils\Views;

/**
 * Listen — text to audio for a doc.
 *
 * A 28px pill in the single-doc meta row, beside "5 min read" and styled exactly
 * like it. Pressed, the pill expands *in place* into a small player: play/pause,
 * a progress bar you can click to seek, elapsed/total time, a speed control and a
 * close button. Nothing below it moves and there is no floating player covering
 * the article, which is the whole point of the design — the control the reader
 * pressed becomes the control they operate.
 *
 * The speech itself is the browser's: `window.speechSynthesis`, driven by
 * public/betterdocs.js. That has consequences this class exists to respect:
 *
 *  - It is JavaScript-only and not universally available, so the pill ships
 *    hidden and public/betterdocs.js reveals it once it has confirmed support.
 *    A button that cannot speak is worse than no button (see listen.scss).
 *  - There is no audio file and no server round trip, so nothing here renders a
 *    media URL. What it does render is the word count, so the player can show a
 *    total duration before a single word has been spoken.
 *
 * The text comes from the page the reader is already on — see `speechText()` in
 * public/betterdocs.js — with the `.md` address as the fallback for a placement
 * that is not inside a doc body. Both are gated on MarkdownRenderer::can_read(),
 * the same check AI Actions uses, so a restricted doc is never read aloud.
 *
 * @since 4.9.2
 */
class Listen {
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
	 * The playback rates the speed control cycles through.
	 *
	 * The shipped default. Everything reads it through rates(), which applies the
	 * `betterdocs_listen_rates` filter — so the rendered chip and the list the
	 * script cycles are always the same list. public/betterdocs.js owns the cycling.
	 *
	 * @var float[]
	 */
	const RATES = [ 1, 1.25, 1.5, 2, 0.75 ];

	/**
	 * Words a synthetic voice gets through in a minute at rate 1.
	 *
	 * Deliberately lower than the 200 the reading-time pill assumes: that number
	 * describes silent reading, and a `speechSynthesis` voice at rate 1 lands
	 * around 170-190. Used only for the duration estimate the player shows.
	 *
	 * @var int
	 */
	const WORDS_PER_MINUTE = 180;

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
		 * Toggle the Listen button independently of the setting.
		 *
		 * @since 4.9.2
		 *
		 * @param bool $enabled
		 */
		return (bool) apply_filters( 'betterdocs_listen_enabled', (bool) $this->settings->get( 'enable_listen' ) );
	}

	/**
	 * Will render() actually output anything for this doc?
	 *
	 * Templates need this before they commit to a layout, the same way they need
	 * AIActions::has_actions(): a doc the reader may not read renders nothing, so
	 * "the feature is on" is not the same as "there is a button".
	 *
	 * @param \WP_Post|int|null $post
	 * @param array             $args Per-instance overrides. An `enable` of false
	 *                                answers false outright.
	 * @return bool
	 */
	public function has_listen( $post = null, $args = [] ) {
		if ( isset( $args['enable'] ) && ! $args['enable'] ) {
			return false;
		}

		if ( ! $this->is_enabled() ) {
			return false;
		}

		$post = get_post( $post );

		if ( ! $post instanceof \WP_Post || ! $this->renderer->can_read( $post ) ) {
			return false;
		}

		// A doc with no words to speak. Rare, but an empty player that runs from
		// 0:00 to 0:00 is worse than no pill.
		return $this->word_count( $post ) > 0;
	}

	/**
	 * Words in a doc, counted the way the reading-time pill counts them.
	 *
	 * Same regex as Shortcodes\ReadingTime so the two numbers cannot disagree —
	 * they sit next to each other, and a "5 min read" beside a 7:30 player reads
	 * as a bug even though the two measure different things.
	 *
	 * @param \WP_Post|int|null $post
	 * @return int
	 */
	public function word_count( $post ) {
		$post = get_post( $post );

		if ( ! $post instanceof \WP_Post ) {
			return 0;
		}

		$text = wp_strip_all_tags( (string) $post->post_content );
		preg_match_all( '/<[^>]*>|[\p{L}\p{M}]+/u', $text, $matches );

		$count = ! empty( $matches[0] ) ? count( $matches[0] ) : 0;

		/**
		 * Filter the word count behind the player's total duration.
		 *
		 * @since 4.9.2
		 *
		 * @param int      $count
		 * @param \WP_Post $post
		 */
		return (int) apply_filters( 'betterdocs_listen_word_count', $count, $post );
	}

	/**
	 * The playback rates the speed control cycles through.
	 *
	 * Filtered here rather than at each call site, because both call sites have to
	 * agree: localize() hands the list to the script, and render() prints the first
	 * entry as the speed chip's starting label. Filter only one of them and a site
	 * that reorders the rates ships a chip reading "1×" over a voice running at
	 * 0.75, until the reader clicks it once.
	 *
	 * @return float[]
	 */
	public function rates() {
		/**
		 * Filter the playback rates the Listen speed control offers.
		 *
		 * The first entry is where playback starts.
		 *
		 * @since 4.9.2
		 *
		 * @param float[] $rates
		 */
		$rates = array_values( array_filter( array_map( 'floatval', (array) apply_filters( 'betterdocs_listen_rates', self::RATES ) ) ) );

		// A filter that emptied the list, or left only zeroes, would render a chip
		// with no label and divide the duration estimate by nothing.
		return ! empty( $rates ) ? $rates : array_map( 'floatval', self::RATES );
	}

	/**
	 * Words per minute the player should assume, after settings and overrides.
	 *
	 * @param array $args Per-instance overrides.
	 * @return int
	 */
	public function words_per_minute( $args = [] ) {
		$wpm = isset( $args['words_per_minute'] ) ? (int) $args['words_per_minute'] : 0;

		if ( $wpm < 1 ) {
			$wpm = (int) $this->settings->get( 'listen_words_per_minute' );
		}

		if ( $wpm < 1 ) {
			$wpm = self::WORDS_PER_MINUTE;
		}

		return $wpm;
	}

	/**
	 * Render the pill for a doc.
	 *
	 * @param \WP_Post|int|null $post
	 * @param array             $extra {
	 *     View params, plus the per-instance overrides this class understands.
	 *
	 *     @type bool   $enable           Switch this instance off. Cannot switch it
	 *                                    *on* — the global is a hard kill switch,
	 *                                    exactly as for AI Actions.
	 *     @type string $button_label     Overrides `listen_button_label`.
	 *     @type bool   $show_speed       Overrides `listen_show_speed`.
	 *     @type int    $words_per_minute Overrides `listen_words_per_minute`.
	 *     @type string $widget_type
	 *     @type string $blockId
	 * }
	 */
	public function render( $post = null, $extra = [] ) {
		$post = get_post( $post );

		if ( ! $post instanceof \WP_Post ) {
			return;
		}

		if ( ! $this->has_listen( $post, $extra ) ) {
			return;
		}

		$label = isset( $extra['button_label'] ) ? (string) $extra['button_label'] : '';
		if ( '' === trim( $label ) ) {
			$label = (string) $this->settings->get( 'listen_button_label' );
		}
		if ( '' === trim( $label ) ) {
			$label = __( 'Listen', 'betterdocs' );
		}

		$show_speed = isset( $extra['show_speed'] )
			? (bool) $extra['show_speed']
			: (bool) $this->settings->get( 'listen_show_speed' );

		// The script reads the rendered article only when it IS this doc — the doc's
		// own page. Anywhere else (a shortcode with `post_id` on a landing page) the
		// article on screen is something else entirely, so the `.md` copy is the
		// only source, and without the endpoint there is nothing right to read.
		$read_page  = is_singular() && (int) get_queried_object_id() === (int) $post->ID;
		$listen_url = $this->endpoint->url( $post, 'copy' );

		if ( ! $read_page && '' === $listen_url ) {
			return;
		}

		// Views is a shared singleton whose params are sticky across calls, so every
		// key this template reads is passed explicitly — otherwise a block rendered
		// earlier on the page leaks its blockId into the classic instance. The
		// resolve-only keys are dropped rather than forwarded, for the same reason
		// Core\AIActions::render() drops its own.
		$this->views->get(
			'templates/parts/listen',
			wp_parse_args(
				array_diff_key( $extra, array_flip( [ 'button_label', 'show_speed', 'words_per_minute', 'enable' ] ) ),
				[
					'enable'       => true,
					'label'        => $label,
					'show_speed'   => $show_speed,
					'words'        => $this->word_count( $post ),
					'wpm'          => $this->words_per_minute( $extra ),
					// The first of the FILTERED rates — see rates(). This is the label
					// the script will move off on the first click, so the two lists
					// have to be the same one.
					'rate'         => $this->rates()[0],
					// The `copy` profile: no YAML front matter, which would otherwise
					// be read aloud. Empty when the endpoint is switched off, in which
					// case the script falls back to the page it is already on.
					'listen_url'   => $listen_url,
					'read_page'    => $read_page,
					'doc_id'       => (int) $post->ID,
					'uid'          => wp_unique_id( 'betterdocs-listen-' ),
					'widget_type'  => '',
					'blockId'      => ''
				]
			)
		);
	}

	/**
	 * Strings and numbers public/betterdocs.js needs.
	 *
	 * Localized once by Core\Scripts, which runs with no `$post`, so nothing
	 * per-doc belongs here — that lives on the rendered `data-bd-*` attributes.
	 *
	 * @return array
	 */
	public function localize() {
		return [
			'rates' => $this->rates(),
			/**
			 * Elements inside the doc body whose text must never be spoken.
			 *
			 * Three groups, each for its own reason:
			 *
			 *  - **Code.** A synthetic voice reading a shell snippet character by
			 *    character is unusable, and skipping the block is what a person
			 *    reading aloud would do too.
			 *  - **Chrome.** The table of contents duplicates every heading; the meta
			 *    row, the summary, the share and feedback blocks and the reactions are
			 *    controls, not prose.
			 *  - **Text that is not prose in the flow it appears in.** The `#` this
			 *    plugin appends to every heading as an anchor link, which is otherwise
			 *    pronounced "hash" after each one — note the class is
			 *    `batterdocs-anchor`, spelled that way in the markup this plugin has
			 *    always emitted, with the corrected spelling listed beside it in case
			 *    that is ever fixed. And the glossary tooltip's body, which is a hover
			 *    popup: it sits inline in the DOM, so a voice reads the whole
			 *    definition in the middle of the sentence that merely mentions the
			 *    term. The term itself is an `<a>` outside the overlay and still reads.
			 *  - **Text nobody sees.** `[hidden]`, `aria-hidden`, screen-reader-only
			 *    text and the body of a collapsed `<details>` — the sighted reader
			 *    does not see it and a screen reader user already hears it their way.
			 *
			 * @since 4.9.2
			 *
			 * @param string $selector A CSS selector list.
			 */
			'skip'  => (string) apply_filters(
				'betterdocs_listen_skip_selector',
				'script, style, noscript, pre, code, kbd, samp, [hidden], [aria-hidden="true"], .screen-reader-text, .sr-only, .betterdocs-sr-only, details:not([open]) > :not(summary), .betterdocs-doc-meta, .betterdocs-toc, #betterdocs-toc-wrapper, .betterdocs-ai-actions, .betterdocs-listen, .betterdocs-article-summary, .betterdocs-social-share, .betterdocs-feedback-form, .betterdocs-reactions, .batterdocs-anchor, .betterdocs-anchor, .glossary-tooltip-overlay'
			),
			/**
			 * Where in the page the spoken text is read from, in order.
			 *
			 * @since 4.9.2
			 *
			 * @param string[] $selectors
			 */
			'read'  => array_values(
				(array) apply_filters(
					'betterdocs_listen_content_selector',
					[ '.betterdocs-entry-content', '.betterdocs-content-area', '.entry-content' ]
				)
			),
			/**
			 * Pin the voice the player speaks with, by name or name fragment.
			 *
			 * Matched case-insensitively against `SpeechSynthesisVoice.name`, and
			 * checked before the automatic pick — which is a heuristic over voice
			 * names and so can only ever be a good default. Nothing is validated
			 * here: the voice list is per-browser and per-machine, so the server has
			 * no way to know what exists. A name nothing matches falls through to
			 * the automatic pick.
			 *
			 * Example: `return 'Google UK English Female';`
			 *
			 * @since 4.9.2
			 *
			 * @param string $voice
			 */
			'voice' => (string) apply_filters( 'betterdocs_listen_voice', '' ),
			'i18n'  => [
				'listen'      => __( 'Listen', 'betterdocs' ),
				'play'        => __( 'Play', 'betterdocs' ),
				'pause'       => __( 'Pause', 'betterdocs' ),
				'close'       => __( 'Close player', 'betterdocs' ),
				'speed'       => __( 'Playback speed', 'betterdocs' ),
				'seek'        => __( 'Seek', 'betterdocs' ),
				'preparing'   => __( 'Preparing audio…', 'betterdocs' ),
				'playing'     => __( 'Playing this article', 'betterdocs' ),
				'paused'      => __( 'Paused', 'betterdocs' ),
				'ended'       => __( 'Finished reading this article', 'betterdocs' ),
				'failed'      => __( 'This article could not be read aloud.', 'betterdocs' ),
				'listen_to'   => __( 'Listen to this article', 'betterdocs' )
			]
		];
	}

	/**
	 * Inline SVG for one of the player's icons.
	 *
	 * Paths are the design's. Stroke weights differ per glyph on purpose: at 14px
	 * and below a 2 leaves the close cross visibly lighter than the label beside
	 * it, while the play and pause triangles are filled rather than stroked.
	 *
	 * @param string $key
	 * @return string
	 */
	public static function icon( $key ) {
		if ( false !== strpos( (string) $key, '<svg' ) ) {
			return $key;
		}

		// Filled glyphs. Drawn without a stroke so they stay solid shapes at 9px,
		// which is the size the player's play/pause button uses.
		$filled = [
			'play'  => '<path d="M6 4l14 8-14 8z"/>',
			'pause' => '<rect x="5" y="4" width="4.5" height="16" rx="1"/><rect x="14.5" y="4" width="4.5" height="16" rx="1"/>'
		];

		if ( isset( $filled[ $key ] ) ) {
			return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">'
				. $filled[ $key ] . '</svg>';
		}

		$strokes = [
			'close' => '2.6'
		];
		$stroke  = isset( $strokes[ $key ] ) ? $strokes[ $key ] : '2';

		$open   = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="' . $stroke . '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
		$shapes = [
			// A headset: the band, and an ear cup either side. The design's mark.
			'headphones' => '<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 15a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2zM3 15a2 2 0 0 0 2 2h1v-5H5a2 2 0 0 0-2 2z"/>',
			'close'      => '<path d="M6 6l12 12M18 6 6 18"/>'
		];

		$shape = isset( $shapes[ $key ] ) ? $shapes[ $key ] : $shapes['headphones'];

		return $open . $shape . '</svg>';
	}

	/**
	 * wp_kses allowlist for the player's icons.
	 *
	 * Core\AIActions::svg_kses() is a generic SVG allowlist rather than anything
	 * about AI actions, and duplicating sixty lines of attribute map to avoid
	 * naming it would be the worse trade.
	 *
	 * @return array
	 */
	public static function svg_kses() {
		return AIActions::svg_kses();
	}
}
