import * as GRID from "./constants";
import * as GRIDTypo from "./typographyPrefixConstants";
import { addProperty } from "../../../helpers/helper";

export default ({ blockId, layoutMode, layout }) => {
    const containerSectionWrapper = `.${blockId}.betterdocs-category-grid-wrapper`;
    const innerWrapperSelector = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper`;
    const singleGridWrapperSelector = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper.masonry > .betterdocs-single-category-wrapper`;
    const singleGridInnerSelector   = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner`;
    const titleSelector        = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-category-title, .${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-category-title a`;
    const titleHoverSelector   = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-category-title:hover`;
    const titleSelector2       = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-category-header`;
    const titleSelector3       = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-category-header .betterdocs-category-header-inner`;
    const titleSelectorLayout2 = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-category-title`;
    const countSelector1       = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-category-items-counts`;
    const countSelector2       = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper.default .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-items-counts span, .${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper.layout-1 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-items-counts span`;
    const countHoverSelector  = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-items-counts:hover span`;
    const countSelector2Part2  = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper.layout-2 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-items-counts span`;
    const countSelector2Layout2 = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper.layout-2 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-items-counts`;
    const countSelector3       = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-items-counts`;
    const buttonSelector       = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-footer a.betterdocs-category-link-btn`;
    const buttonSelector2      = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-footer`;
    const docListSelector1     = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li:not(.betterdocs-nested-category-wrapper)`;
    const docListSelector2     = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li:not(.betterdocs-nested-category-wrapper) a`;
    const docListSelector3     = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-body`;
    const docListSelector4     = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-body .betterdocs-articles-list li i, .${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-body .betterdocs-articles-list .betterdocs-nested-category-wrapper i`;
    const docListSelector5     = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-body .betterdocs-articles-list li img, .${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-body .betterdocs-articles-list .betterdocs-nested-category-wrapper img`;
    const tickerSelector       = `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper.layout-2 .betterdocs-category-items-counts:after`;

    return [
        addProperty('dimension', GRID.CONTAINER_SECTION_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: containerSectionWrapper
        }),
        addProperty('dimension', GRID.CONTAINER_SECTION_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: containerSectionWrapper
        }),
        addProperty('background', GRID.CONTAINER_SECTION_BACKGROUND, {
            args: { noOverlay: true },
            cssSelector: containerSectionWrapper
        }),
        addProperty('responsive', GRID.COLUMNS, {
            defaultData: {
                desktop: 3,
                tab: 2,
                mobile: 1,
            },
            args: { property: '' },
            class: true,
            attr: true,
            attrPrefix: 'column',
            classPrefix: 'betterdocs-column-',
            filter: 'number',
            cssSelector: innerWrapperSelector
        }),
        addProperty('responsive', GRID.GRID_SPACE, {
            defaultData: {
                desktop: 10,
                tab: 10,
                mobile: 10,
            },
            args: { property: '' },
            attr: layoutMode !== 'grid',
            filter: 'number',
            attrPrefix: 'column_space'
        }),
        addProperty('responsive', 'gridSpaceMarginBottom', {
            defaultData: {
                desktop: 10,
                tab: 10,
                mobile: 10,
            },
            args: { property: "margin-bottom", controlName: GRID.GRID_SPACE, customUnit: 'px' },
            // filter: 'number',
            cssSelector: singleGridWrapperSelector,
        }),
        addProperty('dimension', GRID.GRID_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: singleGridInnerSelector
        }),
        addProperty('dimension', GRID.GRID_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: singleGridInnerSelector
        }),
        addProperty('background', GRID.GRID_BACKGROUND, {
            args: { noOverlay: true },
            cssSelector: singleGridInnerSelector
        }),
        addProperty('border', GRID.GRID_BORDER, {
            cssSelector: singleGridInnerSelector
        }),

        // TITLE
        addProperty('color', 'titleColor', {
            args: { hover: 'titleHoverColor' },
            cssSelector: titleSelector,
            hoverSelector: titleHoverSelector,
        }),

        addProperty('typography', GRIDTypo.typoPrefix_title, {
            args: {
                defaultFontSize: 20,
                prefixConstant: GRIDTypo.typoPrefix_title,
            },
            cssSelector: titleSelector
        }),
        addProperty('dimension', layout == 'default' ? GRID.TITLE_PADDING : GRID.TITLE_PADDING_LAYOUT_2, {
            args: { styleFor: "padding" },
            cssSelector: layout == 'default' ? titleSelector3 : titleSelectorLayout2
        }),
        addProperty('dimension', layout == 'default' ? GRID.TITLE_MARGIN :  GRID.TITLE_MARGIN_LAYOUT_2, {
            args: { styleFor: "margin" },
            cssSelector: layout == 'default' ? titleSelector2 : titleSelectorLayout2
        }),
        addProperty('dimension', GRID.COUNT_PADDING_LAYOUT_2, {
            args: { styleFor: "padding" },
            cssSelector: countSelector2Layout2
        }),
        addProperty('dimension', GRID.COUNT_MARGIN_LAYOUT_2, {
            args: { styleFor: "margin" },
            cssSelector: countSelector2Layout2
        }),
        addProperty('background', GRID.TITLE_BACKGROUND, {
            args: { noOverlay: true, noMainBgi: true },
            cssSelector: titleSelector2
        }),
        addProperty('border', GRID.TITLE_BORDER, {
            args: { noShadow: true },
            cssSelector: titleSelector3
        }),

        // Count
        addProperty('typography', GRIDTypo.typoPrefix_count, {
            args: {
                defaultFontSize: 15,
                prefixConstant: GRIDTypo.typoPrefix_count,
            },
            cssSelector: layout == 'default' ? countSelector2 : countSelector2Part2
        }),
        addProperty('responsive', 'countSizeHeight', {
            args: { property: "min-height", controlName: GRID.COUNT_SIZE },
            cssSelector: countSelector2
        }),
        addProperty('responsive', 'countSizeWidth', {
            args: { property: "min-width", controlName: GRID.COUNT_SIZE },
            cssSelector: countSelector2
        }),
        addProperty('color', 'countColor', {
            args: { hover: 'countHoverColor' },
            cssSelector: layout == 'default' ? countSelector2 : countSelector2Part2,
            hoverSelector: countHoverSelector,
        }),
        addProperty('background', layout == 'default' ? GRID.COUNT_BACKGROUND : GRID.COUNT_BACKGROUND_LAYOUT_2, {
            args: { noOverlay: true, noMainBgi: true },
            cssSelector: layout == 'default' ? countSelector1 : countSelector3
        }),
        addProperty('border-top-color', 'tickerBackgroundColor', {
            args: { hover: 'tickerBackgroundColor' },
            cssSelector: tickerSelector
        }),
        addProperty('border', GRID.COUNT_BORDER, {
            args: { noShadow: true },
            cssSelector: countSelector1
        }),

        // Button

        addProperty('color', 'buttonColor', {
            args: { hover: 'buttonHoverColor' },
            cssSelector: buttonSelector
        }),

        //Button Icon Position Missing
        addProperty('alignment', 'buttonPosition', {
            args: { property: "text-align" },
            cssSelector:buttonSelector2
        } ),

        addProperty('typography', GRIDTypo.typoPrefix_button, {
            args: {
                defaultFontSize: 16,
                prefixConstant: GRIDTypo.typoPrefix_button,
            },
            cssSelector: buttonSelector
        }),
        addProperty('dimension', GRID.BTN_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: buttonSelector
        }),
        addProperty('dimension', GRID.BTN_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: buttonSelector
        }),
        addProperty('background', GRID.BTN_BACKGROUND, {
            args: { noOverlay: true, noMainBgi: true },
            cssSelector: buttonSelector
        }),
        addProperty('border', GRID.BTN_BORDER, {
            args: { noShadow: true },
            cssSelector: buttonSelector
        }),

        // List
        addProperty('typography', GRIDTypo.typoPrefix_list, {
            args: {
                defaultFontSize: 15,
                prefixConstant: GRIDTypo.typoPrefix_list,
            },
            cssSelector: docListSelector2
        }),
        addProperty('color', 'listColor', {
            args: { hover: 'listHoverColor' },
            cssSelector: docListSelector2
        }),
        addProperty('dimension', GRID.LIST_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: docListSelector3
        }),
        addProperty('dimension', GRID.LIST_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: docListSelector1
        }),
        addProperty('background', GRID.LIST_BACKGROUND, {
            args: { noOverlay: true, noMainBgi: true },
            cssSelector: docListSelector3
        }),

        // List Icon
        addProperty('responsive', GRID.ICON_SIZE, {
            args: { property: "font-size" },
            cssSelector: docListSelector4
        }),
        addProperty('responsive', GRID.ICON_HEIGHT, {
            args: { property: "height" },
            cssSelector: docListSelector5
        }),
        addProperty('responsive', GRID.ICON_WIDTH, {
            args: { property: "width" },
            cssSelector: docListSelector5
        }),
        addProperty('dimension', GRID.ICON_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: docListSelector4
        }),

        addProperty('color', 'iconColor', {
            cssSelector: docListSelector4
        }),

        // Wrapper Margin
        addProperty('dimension', GRID.WRAPPER_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: `.${blockId}.betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper`
        }),
    ]
}
