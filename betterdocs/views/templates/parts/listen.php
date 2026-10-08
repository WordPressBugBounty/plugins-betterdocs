<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- view template receives variables via extract(); prefixing is impractical.

/**
 * Listen — the pill that morphs in place into an audio player.
 *
 * Shared by all four surfaces: the classic single-doc meta row, the
 * [betterdocs_listen] shortcode, the Gutenberg block and the Elementor widget.
 * Core\Listen::render() is the only supported way to include it.
 *
 * Both states ship in the markup at once and CSS crossfades between them, which
 * is what makes the morph possible: a player built in JavaScript on first click
 * cannot be measured before it exists, and the width transition needs a target
 * width. The trigger is the only element in flow, so the pill's collapsed width
 * is its label's natural width in whatever language the site runs in — nothing
 * here hard-codes the design's 80px.
 *
 * The player is `inert` until it opens (and the trigger `inert` once it has), so
 * Tab never lands on the half of the control that is currently invisible.
 *
 * @var bool   $enable
 * @var string $label      Resolved by Core\Listen::render() — the setting, or a
 *                         per-instance override. Never blank by the time it gets
 *                         here.
 * @var bool   $show_speed
 * @var int    $words      Word count behind the duration estimate.
 * @var int    $wpm        Words per minute to estimate with.
 * @var float  $rate       Playback rate the speed control starts on.
 * @var string $listen_url `.md` address, for a placement with no doc body on the
 *                         page to read from. May be blank.
 * @var int    $doc_id
 * @var string $uid
 * @var string $widget_type
 * @var string $blockId
 */

use WPDeveloper\BetterDocs\Core\Listen;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( empty( $enable ) ) {
	return;
}

$classes = 'betterdocs-listen';
if ( ! empty( $widget_type ) && 'blocks' === $widget_type && ! empty( $blockId ) ) {
	$classes .= ' ' . $blockId;
}

$svg_kses = Listen::svg_kses();

// The total the player shows before anything has been spoken. Rendered rather
// than computed in JavaScript so the pill is honest on first paint, and so a
// filter on the word count reaches it.
$total_seconds = $wpm > 0 ? (int) round( $words / $wpm * 60 ) : 0;
$total_time    = sprintf( '%d:%02d', (int) floor( $total_seconds / 60 ), $total_seconds % 60 );

// Rates render as "1×", not "1.0x": the multiplication sign is the correct glyph
// and is what the design uses.
//
// number_format() with an explicit "." rather than number_format_i18n(), which is
// the one place a locale must NOT be consulted here: in a comma-decimal locale it
// returns "1,00", and trimming the trailing zeros off that leaves "1," — while a
// rate is a technical multiplier that reads the same everywhere. The same trim
// runs in public/betterdocs.js, so the label the script writes on the next click
// matches the one rendered here.
$rate_label = sprintf(
	/* translators: %s: playback speed multiplier, e.g. 1.5 */
	__( '%s×', 'betterdocs' ),
	rtrim( rtrim( number_format( (float) $rate, 2, '.', '' ), '0' ), '.' )
);
?>
<div class="<?php echo esc_attr( $classes ); ?>"
	data-bd-doc-id="<?php echo esc_attr( $doc_id ); ?>"
	data-bd-listen-url="<?php echo esc_url( $listen_url ); ?>"
	data-bd-read-page="<?php echo ! empty( $read_page ) ? '1' : '0'; ?>"
	data-bd-words="<?php echo esc_attr( $words ); ?>"
	data-bd-wpm="<?php echo esc_attr( $wpm ); ?>"
	data-bd-total="<?php echo esc_attr( $total_seconds ); ?>">

	<button type="button" class="betterdocs-listen-trigger"
		id="<?php echo esc_attr( $uid ); ?>-trigger"
		aria-label="<?php
		/* translators: %s: the visible button label, e.g. "Listen". */
		echo esc_attr( sprintf( __( '%s to this article', 'betterdocs' ), $label ) );
		?>">
		<span class="betterdocs-listen-icon" aria-hidden="true">
			<?php echo wp_kses( Listen::icon( 'headphones' ), $svg_kses ); ?>
		</span>
		<span class="betterdocs-listen-label"><?php echo esc_html( $label ); ?></span>
	</button>

	<div class="betterdocs-listen-player" id="<?php echo esc_attr( $uid ); ?>-player" inert>
		<?php
		// Both glyphs ship together and CSS shows one, the same arrangement the AI
		// Actions button uses for its copied / failed icons: the state change stays a
		// one-class flip in public/betterdocs.js and every icon stays in one place.
		?>
		<button type="button" class="betterdocs-listen-play" aria-label="<?php esc_attr_e( 'Play', 'betterdocs' ); ?>">
			<span class="betterdocs-listen-icon betterdocs-listen-icon-play" aria-hidden="true">
				<?php echo wp_kses( Listen::icon( 'play' ), $svg_kses ); ?>
			</span>
			<span class="betterdocs-listen-icon betterdocs-listen-icon-pause" aria-hidden="true">
				<?php echo wp_kses( Listen::icon( 'pause' ), $svg_kses ); ?>
			</span>
		</button>

		<?php
		// A real ARIA slider rather than a bare div: arrow keys seek, which is the
		// only way to scrub without a pointer. `aria-valuetext` carries the position
		// as a time, because "37" on its own says nothing useful.
		?>
		<div class="betterdocs-listen-seek" role="slider" tabindex="0"
			aria-label="<?php esc_attr_e( 'Seek', 'betterdocs' ); ?>"
			aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
			aria-valuetext="<?php echo esc_attr( '0:00' ); ?>">
			<div class="betterdocs-listen-track">
				<span class="betterdocs-listen-fill"></span>
				<span class="betterdocs-listen-thumb"></span>
			</div>
		</div>

		<span class="betterdocs-listen-time">
			<span class="betterdocs-listen-elapsed">0:00</span>
			<span class="betterdocs-listen-separator" aria-hidden="true"> / </span>
			<span class="betterdocs-listen-total"><?php echo esc_html( $total_time ); ?></span>
		</span>

		<?php if ( ! empty( $show_speed ) ) : ?>
			<button type="button" class="betterdocs-listen-speed"
				aria-label="<?php echo esc_attr( $rate_label . ' ' . __( 'Playback speed', 'betterdocs' ) ); ?>"
				data-bd-rate="<?php echo esc_attr( $rate ); ?>"><?php echo esc_html( $rate_label ); ?></button>
		<?php endif; ?>

		<button type="button" class="betterdocs-listen-close" aria-label="<?php esc_attr_e( 'Close player', 'betterdocs' ); ?>">
			<span class="betterdocs-listen-icon" aria-hidden="true">
				<?php echo wp_kses( Listen::icon( 'close' ), $svg_kses ); ?>
			</span>
		</button>
	</div>

	<span class="betterdocs-listen-status betterdocs-sr-only" role="status" aria-live="polite"></span>
</div>
