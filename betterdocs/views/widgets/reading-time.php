<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- view template receives variables via extract(); prefixing is impractical.

/**
 * The single-doc meta row, as an Elementor widget.
 *
 * Emits the same `.betterdocs-doc-meta` wrapper as
 * views/templates/parts/doc-meta.php, so the leading and trailing groups land on
 * opposite edges and all three controls sit on one centre line without this widget
 * shipping any layout CSS.
 *
 * @var array $attributes
 * @var bool  $enable_reading_time
 * @var bool  $enable_listen
 * @var array $listen_args     Per-instance overrides for Listen::render().
 * @var bool  $enable_ai_actions
 * @var array $ai_actions_args Per-instance overrides for AIActions::render().
 * @var bool  $is_editing      Elementor's canvas or preview iframe.
 */

use WPDeveloper\BetterDocs\Core\AIActions;
use WPDeveloper\BetterDocs\Core\Listen;
use WPDeveloper\BetterDocs\Shortcodes\AIActions as AIActionsShortcode;
use WPDeveloper\BetterDocs\Shortcodes\Listen as ListenShortcode;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$reading_time = '';
if ( ! empty( $enable_reading_time ) ) {
    // Defaulted rather than dereferenced: Elementor fills in every registered
    // control, but a widget saved before one existed can still arrive short of a
    // key if the control was renamed or a third party filtered it away.
    $att = function ( $key ) use ( $attributes ) {
        return isset( $attributes[ $key ] ) ? (string) $attributes[ $key ] : '';
    };

    // esc_attr, not raw: these land inside double-quoted shortcode attributes,
    // where an unescaped quote would break out of the attribute.
    $reading_time = (string) do_shortcode(
        '[betterdocs_reading_time'
        . ' singular_reading_text="' . esc_attr( $att( 'singular_ert_reading_text' ) ) . '"'
        . ' reading_text="' . esc_attr( $att( 'ert_reading_text' ) ) . '"'
        . ' reading_title="' . esc_attr( $att( 'ert_reading_title' ) ) . '"]'
    );
}

$listen = '';
if ( ! empty( $enable_listen ) && isset( betterdocs()->listen ) ) {
    ob_start();

    if ( ! empty( $is_editing ) && ! betterdocs()->listen->has_listen( get_the_ID(), $listen_args ) ) {
        // A template edited against a preview that is not a readable doc resolves to
        // nothing — and a widget that renders nothing cannot be seen, selected or
        // moved. It reads as broken rather than as empty, so the canvas gets static
        // chrome instead. Same reasoning as the AI Actions placeholder below.
        $listen_label = ! empty( $attributes['listen_button_label'] )
            ? $attributes['listen_button_label']
            : betterdocs()->settings->get( 'listen_button_label' );
        ?>
        <?php
        // Spans, not buttons, and that is the whole safety mechanism: the delegated
        // handlers in public/betterdocs.js bind to `button.betterdocs-listen-…`, so
        // nothing here can reach BetterDocsListen — which is important, because this
        // placeholder has no player element for it to measure and open. Same
        // arrangement as the AI Actions placeholder below.
        ?>
        <div class="betterdocs-listen betterdocs-listen-placeholder">
            <span class="betterdocs-listen-trigger">
                <span class="betterdocs-listen-icon" aria-hidden="true">
                    <?php echo wp_kses( Listen::icon( 'headphones' ), Listen::svg_kses() ); ?>
                </span>
                <span class="betterdocs-listen-label"><?php echo esc_html( $listen_label ); ?></span>
            </span>
        </div>
        <?php
    } else {
        // Handed off by token rather than as attributes: `show_speed` is tri-state
        // and a shortcode attribute string cannot express "inherit the setting".
        // See ListenShortcode::push_context().
        $listen_context = ListenShortcode::push_context( $listen_args );

        echo do_shortcode( '[betterdocs_listen context="' . esc_attr( $listen_context ) . '"]' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered template parts, escaped at source.
    }

    $listen = trim( (string) ob_get_clean() );
}

$ai_actions = '';
if ( ! empty( $enable_ai_actions ) && isset( betterdocs()->ai_actions ) ) {
    ob_start();

    if ( ! empty( $is_editing ) && ! betterdocs()->ai_actions->has_actions( get_the_ID(), $ai_actions_args ) ) {
        // The action list is resolved per doc, so a template edited against a
        // preview that is not a readable doc resolves to nothing — and a widget
        // that renders nothing cannot be seen, selected or moved. It reads as
        // broken rather than as empty, so the canvas gets static chrome instead.
        $svg_kses     = AIActions::svg_kses();
        $button_label = ! empty( $attributes['ai_actions_button_label'] )
            ? $attributes['ai_actions_button_label']
            : betterdocs()->settings->get( 'ai_actions_button_label' );
        ?>
        <div class="betterdocs-ai-actions betterdocs-ai-actions-placeholder">
            <span class="betterdocs-ai-actions-primary">
                <span class="betterdocs-ai-actions-icon" aria-hidden="true">
                    <?php echo wp_kses( AIActions::icon( 'copy' ), $svg_kses ); ?>
                </span>
                <span class="betterdocs-ai-actions-label"><?php echo esc_html( $button_label ); ?></span>
            </span>
            <span class="betterdocs-ai-actions-toggle">
                <span class="betterdocs-ai-actions-caret" aria-hidden="true">
                    <?php echo wp_kses( AIActions::icon( 'caret' ), $svg_kses ); ?>
                </span>
            </span>
        </div>
        <?php
    } else {
        // Handed off by token rather than as attributes: the args carry a
        // tri-state `enabled_actions` map and free text that a shortcode
        // attribute string cannot round-trip. See AIActionsShortcode::push_context().
        $ai_actions_context = AIActionsShortcode::push_context( $ai_actions_args );

        echo do_shortcode( '[betterdocs_ai_actions context="' . esc_attr( $ai_actions_context ) . '"]' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered template parts, escaped at source.
    }

    $ai_actions = trim( (string) ob_get_clean() );
}

// Everything switched off, or a doc where nothing resolves: emit no wrapper
// rather than an empty flex row consuming vertical space.
if ( '' === trim( $reading_time ) && '' === $listen && '' === $ai_actions ) {
    return;
}

// One leading box holding both pills, rather than one each: the row's `> *` rule
// zeroes child block margins, and the 8px gap between the pills is the leading
// box's own, so two boxes would space them by the row's wider 16px.
$leading = trim( $reading_time ) . $listen;
?>
<div class="betterdocs-doc-meta">
    <?php if ( '' !== $leading ) : ?>
        <div class="betterdocs-doc-meta-start">
            <?php echo $leading; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered template parts, escaped at source. ?>
        </div>
    <?php endif; ?>

    <?php if ( '' !== $ai_actions ) : ?>
        <div class="betterdocs-doc-meta-end">
            <?php echo $ai_actions; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered template parts, escaped at source. ?>
        </div>
    <?php endif; ?>
</div>
