<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- view template receives variables via extract(); prefixing is impractical.

/**
 * AI Actions split button.
 *
 * Shared by all four surfaces — the classic single-doc headers, the
 * [betterdocs_ai_actions] shortcode, the Gutenberg block and the Elementor
 * widget. Core\AIActions::render() is the only supported way to include it.
 *
 * Built on the WAI-ARIA Disclosure pattern rather than Menu Button: every entry
 * except "Copy page" is a navigation link, and role="menuitem" would override
 * the implicit link role — screen readers would announce "menu item" instead of
 * "link", and the entries would disappear from the links list.
 *
 * @var bool   $enable
 * @var array  $actions  Resolved actions from AIActions::resolve().
 * @var string $md_url
 * @var string $copy_url
 * @var string $page_url
 * @var int    $doc_id
 * @var string $uid
 * @var string $button_label Already resolved by AIActions::render() — the global
 *                           setting, or a per-instance override from the block,
 *                           widget or shortcode. May be blank.
 * @var string $widget_type
 * @var string $blockId
 */

use WPDeveloper\BetterDocs\Core\AIActions;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( empty( $enable ) || empty( $actions ) ) {
	return;
}

$primary = null;
foreach ( $actions as $action ) {
	if ( ! empty( $action['primary'] ) ) {
		$primary = $action;
		break;
	}
}

$classes = 'betterdocs-ai-actions';
if ( ! $primary ) {
	$classes .= ' betterdocs-ai-actions-no-primary';
}
if ( ! empty( $widget_type ) && 'blocks' === $widget_type && ! empty( $blockId ) ) {
	$classes .= ' ' . $blockId;
}

$menu_id   = $uid . '-menu';
$toggle_id = $uid . '-toggle';
$svg_kses  = AIActions::svg_kses();

// Blank is a legitimate saved value — the setting is a plain text field and a
// per-instance control can be cleared — so fall back to the primary action's own
// label rather than shipping an unlabelled button.
$button_label = isset( $button_label ) ? (string) $button_label : '';
if ( '' === trim( $button_label ) ) {
	$button_label = $primary ? $primary['label'] : __( 'AI Actions', 'betterdocs' );
}
?>
<div class="<?php echo esc_attr( $classes ); ?>"
	data-bd-doc-id="<?php echo esc_attr( $doc_id ); ?>"
	data-bd-md-url="<?php echo esc_url( $md_url ); ?>"
	data-bd-copy-url="<?php echo esc_url( $copy_url ); ?>"
	data-bd-page-url="<?php echo esc_url( $page_url ); ?>">

	<?php if ( $primary ) : ?>
		<button type="button" class="betterdocs-ai-actions-primary"
			data-bd-action="<?php echo esc_attr( $primary['id'] ); ?>"
			data-bd-handler="<?php echo esc_attr( $primary['handler'] ); ?>"
			data-bd-source="<?php echo esc_attr( $primary['source'] ); ?>">
			<span class="betterdocs-ai-actions-icon betterdocs-ai-actions-icon-idle" aria-hidden="true">
				<?php echo wp_kses( AIActions::icon( $primary['icon'] ), $svg_kses ); ?>
			</span>
			<?php
			// The copied / failed icons ship with the button and are swapped in by
			// CSS off the wrapper class. That keeps the state change a one-class flip
			// in public/betterdocs.js and keeps every icon in one place —
			// AIActions::icon() — rather than half of them in JavaScript.
			?>
			<span class="betterdocs-ai-actions-icon betterdocs-ai-actions-icon-done" aria-hidden="true">
				<?php echo wp_kses( AIActions::icon( 'check' ), $svg_kses ); ?>
			</span>
			<span class="betterdocs-ai-actions-icon betterdocs-ai-actions-icon-fail" aria-hidden="true">
				<?php echo wp_kses( AIActions::icon( 'alert' ), $svg_kses ); ?>
			</span>
			<span class="betterdocs-ai-actions-label"><?php echo esc_html( $button_label ); ?></span>
		</button>
	<?php endif; ?>

	<button type="button" class="betterdocs-ai-actions-toggle"
		id="<?php echo esc_attr( $toggle_id ); ?>"
		aria-expanded="false"
		aria-controls="<?php echo esc_attr( $menu_id ); ?>"
		aria-label="<?php esc_attr_e( 'AI actions', 'betterdocs' ); ?>">
		<span class="betterdocs-ai-actions-caret" aria-hidden="true">
			<?php echo wp_kses( AIActions::icon( 'caret' ), $svg_kses ); ?>
		</span>
	</button>

	<ul class="betterdocs-ai-actions-menu"
		id="<?php echo esc_attr( $menu_id ); ?>"
		aria-labelledby="<?php echo esc_attr( $toggle_id ); ?>" hidden>
		<?php
		$last_group = null;
		foreach ( $actions as $action ) :
			$group = isset( $action['group'] ) ? (string) $action['group'] : '';

			// A rule between the actions that act on this page and the ones that
			// hand it to an assistant. Driven off the group rather than a hard-coded
			// index so a third-party registry entry lands on the right side of it,
			// and never emitted first or for a single group.
			if ( null !== $last_group && $group !== $last_group ) :
				?>
				<li class="betterdocs-ai-actions-separator" role="presentation"></li>
				<?php
			endif;
			$last_group = $group;
			?>
			<li class="betterdocs-ai-actions-row">
				<?php
				$icon    = wp_kses( AIActions::icon( $action['icon'] ), $svg_kses );
				$is_copy = 'copy' === $action['type'];
				$blank   = ! $is_copy && '_blank' === $action['target'];
				?>
				<?php if ( $is_copy ) : ?>
					<button type="button" class="betterdocs-ai-actions-item"
						data-bd-action="<?php echo esc_attr( $action['id'] ); ?>"
						data-bd-handler="<?php echo esc_attr( $action['handler'] ); ?>"
						data-bd-source="<?php echo esc_attr( $action['source'] ); ?>">
				<?php else : ?>
					<a class="betterdocs-ai-actions-item"
						href="<?php echo esc_url( $action['href'] ); ?>"
						data-bd-action="<?php echo esc_attr( $action['id'] ); ?>"
						<?php echo $blank ? 'target="_blank" rel="noopener noreferrer"' : ''; ?>>
				<?php endif; ?>

					<span class="betterdocs-ai-actions-icon" aria-hidden="true"><?php echo $icon; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses'd above. ?></span>
					<span class="betterdocs-ai-actions-text">
						<span class="betterdocs-ai-actions-title"><?php echo esc_html( $action['label'] ); ?></span>
						<?php if ( '' !== $action['description'] ) : ?>
							<span class="betterdocs-ai-actions-desc"><?php echo esc_html( $action['description'] ); ?></span>
						<?php endif; ?>
					</span>
					<?php if ( $blank ) : ?>
						<?php
						// No visible arrow: each row already says where it goes, and the
						// glyph was a third column fighting the icon tile for the eye.
						// The hint stays for screen readers, which get no other warning
						// that the link leaves the page.
						?>
						<span class="betterdocs-sr-only"><?php esc_html_e( '(opens in a new tab)', 'betterdocs' ); ?></span>
					<?php endif; ?>

				<?php echo $is_copy ? '</button>' : '</a>'; ?>
			</li>
		<?php endforeach; ?>
	</ul>

	<span class="betterdocs-ai-actions-status betterdocs-sr-only" role="status" aria-live="polite"></span>
</div>
