import { addProperty } from "../../../helpers/helper";
import {
    WRAPPER_MARGIN,
    WRAPPER_BACKGROUND,
    WRAPPER_BORDER,
    WRAPPER_PADDING,
    READING_TIME_SIZE,
    AI_ACTIONS_PADDING,
    AI_ACTIONS_BACKGROUND,
    AI_ACTIONS_BORDER,
    AI_ACTIONS_ICON_SIZE,
    LISTEN_PADDING,
    LISTEN_BACKGROUND,
    LISTEN_BORDER,
    LISTEN_ICON_SIZE
} from "./constants";
import { typoPrefix_reading_time, typoPrefix_ai_actions, typoPrefix_listen } from "./typographyPrefixConstants";

export default ( { blockId } ) => {
    const wrapperSelector = `.${blockId} .reading-time.betterdocs`;
    const readingTimeSelector = `.${blockId} .reading-time.betterdocs p`;
    const readingTimeIconSelector = `.${blockId} .reading-time p svg`;

    // Margin is the one Wrapper control that moved off the pill and onto the meta
    // row. Inside the row `.betterdocs-doc-meta-start > *` zeroes child block
    // margins with !important — it has to, or a pill with a bottom margin inflates
    // the flex line and knocks the button 12px off centre — so a margin left on
    // the pill would silently do nothing. On the row it still means what it always
    // did: the gap between this block and the article body.
    const metaRowSelector = `.${blockId} .betterdocs-doc-meta`;

    // Both halves of the split button, so background, padding and border stay
    // symmetrical across the divider between them.
    //
    // The `.betterdocs-ai-actions` in the middle is not decoration — it is the
    // third class that wins the cascade. The Customizer now ships real defaults
    // for this button (Admin/Customizer/Defaults.php) and writes them at two
    // classes, `.betterdocs-content-area .betterdocs-ai-actions-primary`. Its
    // stylesheet prints on `wp_head` at 10, after the file this block's CSS is
    // enqueued into, so at equal specificity the site-wide value would win and
    // every per-instance control here would look broken inside a classic
    // single-doc template. Three classes settles it without !important.
    const aiWrapperSelector = `.${blockId} .betterdocs-ai-actions`;
    // The wrapper element itself, at three classes. The block's root div and the
    // button wrapper both carry `blockId` (Blocks\ReadingTime appends it to the
    // button's class list), so `.id .id.betterdocs-ai-actions` matches the same
    // single element `.id .betterdocs-ai-actions` would — but outranks the
    // Customizer's two-class site-wide rules, which otherwise win on order.
    const aiWrapperSelectorOwn = `.${blockId} .${blockId}.betterdocs-ai-actions`;
    const aiButtonSelector = `${aiWrapperSelector} .betterdocs-ai-actions-primary, ${aiWrapperSelector} .betterdocs-ai-actions-toggle`;
    const aiLabelSelector = `${aiWrapperSelector} .betterdocs-ai-actions-label`;
    const aiIconSelector = `${aiWrapperSelector} .betterdocs-ai-actions-primary svg, ${aiWrapperSelector} .betterdocs-ai-actions-toggle svg`;

    // The Listen pill. One element rather than two halves, so background, border
    // and radius have one home — but the same three-class rule applies for the same
    // reason: the Customizer ships real defaults for this pill
    // (Admin/Customizer/Defaults.php) and writes them at two classes, in a
    // stylesheet that prints on `wp_head` at 10 — after the file this block's CSS
    // is enqueued into. At equal specificity the site-wide value would win and
    // every per-instance control here would look broken inside a classic
    // single-doc template.
    //
    // The block's root div and the pill both carry `blockId`
    // (Blocks\ReadingTime appends it to the pill's class list), so
    // `.id .id.betterdocs-listen` matches the same single element
    // `.id .betterdocs-listen` would — while outranking those two-class rules.
    const listenSelector = `.${blockId} .betterdocs-listen`;
    const listenSelectorOwn = `.${blockId} .${blockId}.betterdocs-listen`;
    // Padding, background and the corner all land on the trigger: it is the only
    // element in flow, so it is what gives the pill its size. The player is
    // absolutely positioned with `inset-block: 0` and inherits that height, which
    // is what keeps the design's promise that nothing below the pill moves.
    const listenTriggerSelector = `${listenSelector} .betterdocs-listen-trigger`;
    const listenLabelSelector = `${listenSelector} .betterdocs-listen-label`;
    const listenIconSelector = `${listenSelector} .betterdocs-listen-trigger svg`;
    // The accent is a custom property on the player, inherited by the play button,
    // the progress fill and the scrubber's ring. Its own selector, with nothing
    // else written to it: the helper that emits a custom property omits the
    // trailing semicolon, so a second declaration joined after it would run into
    // the value and both would be dropped.
    const listenAccentSelector = `${listenSelector} .betterdocs-listen-player`;

    return [
        addProperty('dimension', WRAPPER_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: wrapperSelector
        }),
        addProperty('dimension', WRAPPER_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: metaRowSelector
        }),
        addProperty('background', WRAPPER_BACKGROUND, {
            args: { noOverlay: true },
            cssSelector: wrapperSelector
        }),
        addProperty('border', WRAPPER_BORDER, {
            args: { noShadow: true },
            cssSelector:wrapperSelector
        }),
        addProperty('color', 'readingTimeTextColor', {
            cssSelector:readingTimeSelector
        }),
        addProperty('typography', typoPrefix_reading_time, {
            args: {
                defaultFontSize: 14,
                prefixConstant: typoPrefix_reading_time,
            },
            cssSelector: readingTimeSelector
        }),
        addProperty('responsive', READING_TIME_SIZE, {
            args: { property: "height", controlName: READING_TIME_SIZE },
            cssSelector: readingTimeIconSelector
        }),

        addProperty('dimension', AI_ACTIONS_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: aiButtonSelector
        }),
        addProperty('background', AI_ACTIONS_BACKGROUND, {
            args: { noOverlay: true },
            cssSelector: aiButtonSelector
        }),
        // Border on the WRAPPER, not on the halves. A border drawn on each half
        // meets its neighbour at the divider and reads as a double line down the
        // middle of the pill — the stylesheet paints the surface on the wrapper
        // and leaves both halves `border: 0` for exactly that reason.
        addProperty('border', AI_ACTIONS_BORDER, {
            args: { noShadow: true },
            cssSelector: aiWrapperSelectorOwn
        }),
        // …but the radius still has to reach the halves. The wrapper cannot clip
        // them (the dropdown is absolutely positioned, so `overflow: hidden`
        // would cut it off), so each half carries its own outer corners and a
        // radius set only on the wrapper leaves the pill's ends square. Same
        // attributes, second selector — the stylesheet pins the two inner
        // corners to 0, so only the outer pair actually moves.
        addProperty('dimension', `${AI_ACTIONS_BORDER}Rds_`, {
            id: `${AI_ACTIONS_BORDER}Rds_halves`,
            args: { styleFor: 'border-radius' },
            cssSelector: aiButtonSelector
        }),
        addProperty('color', 'aiActionsTextColor', {
            cssSelector: aiLabelSelector
        }),
        // Same two selectors the icon-size control uses: every icon is stroked
        // with currentColor, so `color` on the svg is the whole job.
        addProperty('color', 'aiActionsIconColor', {
            cssSelector: aiIconSelector
        }),
        addProperty('typography', typoPrefix_ai_actions, {
            args: {
                defaultFontSize: 14,
                prefixConstant: typoPrefix_ai_actions,
            },
            cssSelector: aiLabelSelector
        }),
        // One control, two declarations. The stylesheet sizes these icons on both
        // axes, so setting height alone would stretch them. useStyleSheets keys
        // the property list by `id`, so the second entry needs its own — while
        // `args.controlName` keeps both reading the same attribute.
        addProperty('responsive', AI_ACTIONS_ICON_SIZE, {
            args: { property: "height", controlName: AI_ACTIONS_ICON_SIZE },
            cssSelector: aiIconSelector
        }),
        addProperty('responsive', AI_ACTIONS_ICON_SIZE, {
            id: `${AI_ACTIONS_ICON_SIZE}_width`,
            args: { property: "width", controlName: AI_ACTIONS_ICON_SIZE },
            cssSelector: aiIconSelector
        }),

        addProperty('dimension', LISTEN_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: listenTriggerSelector
        }),
        // Background on the PILL, not on the trigger — unlike padding above, and
        // matching what Elementor and dynamic.css.php both do. The trigger goes to
        // `opacity: 0` the instant the player opens, so a fill painted there is
        // visible only while collapsed and the expanded player would ignore the
        // author's colour entirely.
        addProperty('background', LISTEN_BACKGROUND, {
            args: { noOverlay: true },
            cssSelector: listenSelectorOwn
        }),
        // Border on the PILL, not on the trigger: the trigger fills the pill, and a
        // border on both would be drawn twice at the same place — once under the
        // `overflow: hidden` clip and once on top of it, which on a subpixel
        // boundary shows as a doubled edge.
        addProperty('border', LISTEN_BORDER, {
            args: { noShadow: true },
            cssSelector: listenSelectorOwn
        }),
        // …and the radius also has to reach the trigger, which states its own
        // corner so a theme's `button { border-radius }` cannot square it off. Same
        // attributes, second selector; useStyleSheets keys the property list by
        // `id`, so this needs one of its own.
        addProperty('dimension', `${LISTEN_BORDER}Rds_`, {
            id: `${LISTEN_BORDER}Rds_trigger`,
            args: { styleFor: 'border-radius' },
            cssSelector: listenTriggerSelector
        }),
        addProperty('color', 'listenTextColor', {
            cssSelector: listenLabelSelector
        }),
        addProperty('color', 'listenIconColor', {
            cssSelector: listenIconSelector
        }),
        addProperty('color', 'listenAccentColor', {
            args: { customProperty: '--bd-listen-accent' },
            cssSelector: listenAccentSelector
        }),
        // On the pill, not on the label: the player's readout is sized in `em`, so
        // this is what scales the pill and the player together. A font-size on the
        // label alone would leave the clock behind at 12.6px.
        addProperty('typography', typoPrefix_listen, {
            args: {
                defaultFontSize: 14,
                prefixConstant: typoPrefix_listen,
            },
            cssSelector: listenSelectorOwn
        }),
        // The headset glyph on the collapsed pill. Two declarations from one
        // control, for the reason the AI Actions pair above gives: the stylesheet
        // sizes these on both axes, so height alone would stretch them.
        addProperty('responsive', LISTEN_ICON_SIZE, {
            args: { property: "height", controlName: LISTEN_ICON_SIZE },
            cssSelector: listenIconSelector
        }),
        addProperty('responsive', LISTEN_ICON_SIZE, {
            id: `${LISTEN_ICON_SIZE}_width`,
            args: { property: "width", controlName: LISTEN_ICON_SIZE },
            cssSelector: listenIconSelector
        }),
    ];
}
