<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- view template receives variables via extract(); prefixing is impractical.

/**
 * The single-doc meta row.
 *
 * Sits between the title and the article body: reading time and the Listen pill
 * on the leading edge, AI Actions on the trailing edge. All three are
 * independently switchable, so the wrapper itself is conditional — if nothing has
 * anything to show, no empty row is emitted and no vertical space is consumed.
 *
 * Included by views/templates/contents/layout-1.php and layout-2.php, which
 * between them serve every single-doc layout in Free (1, 4, 5, 8, 9, 10) and in
 * Pro (2, 3, 6, 7).
 *
 * @var string $reading_time Rendered reading-time markup, or ''.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$reading_time = isset( $reading_time ) ? (string) $reading_time : '';

ob_start();
// Beside the reading-time pill, which is where the design puts it: the two are
// both facts about the article, where AI Actions on the far edge is a thing you
// do to it. No per-instance overrides here — the classic templates render
// whatever the global settings say — so this needs no context handoff.
if ( isset( betterdocs()->listen ) && betterdocs()->listen->has_listen( get_the_ID() ) ) {
	echo do_shortcode( '[betterdocs_listen]' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered template parts, escaped at source.
}
/**
 * Extra content on the leading edge of the doc meta row, after reading time and
 * the Listen pill.
 *
 * @since 4.8.0
 */
do_action( 'betterdocs_doc_meta_start' );
$meta_start = ob_get_clean();

ob_start();
if ( isset( betterdocs()->ai_actions ) && betterdocs()->ai_actions->has_actions() ) {
	// No per-instance overrides here — the classic templates render whatever the
	// global settings say — so this needs no context handoff.
	echo do_shortcode( '[betterdocs_ai_actions]' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered template parts, escaped at source.
}
/**
 * Extra content on the trailing edge of the doc meta row, after AI Actions.
 *
 * @since 4.8.0
 */
do_action( 'betterdocs_doc_meta_end' );
$meta_end = ob_get_clean();

$leading  = $reading_time . $meta_start;
$trailing = $meta_end;

// Nothing on either side: emit no wrapper at all rather than an empty flex row.
if ( '' === trim( $leading ) && '' === trim( $trailing ) ) {
	return;
}
?>
<div class="betterdocs-doc-meta">
	<?php if ( '' !== trim( $leading ) ) : ?>
		<div class="betterdocs-doc-meta-start">
			<?php echo $leading; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered template parts, escaped at source. ?>
		</div>
	<?php endif; ?>

	<?php if ( '' !== trim( $trailing ) ) : ?>
		<div class="betterdocs-doc-meta-end">
			<?php echo $trailing; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered template parts, escaped at source. ?>
		</div>
	<?php endif; ?>
</div>
