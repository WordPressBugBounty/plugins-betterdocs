import * as BOX from "./constants";
import * as BOXTypo from "./typographyPrefixConstants";
import { addProperty } from "../../../helpers/helper";


export default ({ blockId, layout }) => {
    const containerWrapper   =  `.${blockId}.betterdocs-category-box-wrapper`;
    const innerWrapperSelector = `.${blockId}.betterdocs-category-box-wrapper .betterdocs-category-box-inner-wrapper`;
    const singleBoxSelector = `.${blockId}.betterdocs-category-box-wrapper .betterdocs-category-box-inner-wrapper .betterdocs-single-category-wrapper`;
    const iconSelector1 = `.${blockId}.betterdocs-category-box-wrapper .betterdocs-category-box-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-category-icon`;
    const iconSelector2 = `.${blockId}.betterdocs-category-box-wrapper .betterdocs-category-box-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-category-icon .betterdocs-category-icon-img`
    const titleSelector = `.${blockId}.betterdocs-category-box-wrapper .betterdocs-category-box-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-category-title`;
    const titleHoverSelector = `.${blockId}.betterdocs-category-box-wrapper .betterdocs-category-box-inner-wrapper .betterdocs-single-category-wrapper:hover .betterdocs-category-title`;
    const countSelector1 = `.${blockId}.betterdocs-category-box-wrapper .betterdocs-category-box-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-category-items-counts`;
    const countSelector2 = `.${blockId}.betterdocs-category-box-wrapper .betterdocs-category-box-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-category-items-counts span`;
    const countSelector3 = `.${blockId}.betterdocs-category-box-wrapper .betterdocs-category-box-inner-wrapper .betterdocs-single-category-wrapper:hover .betterdocs-category-items-counts span`;

    const innerWrapperSelectorLayout4 = `.${blockId}.betterdocs-category-box-wrapper .betterdocs-category-box-inner-wrapper`;
    const singleBoxSelectorLayout4    = `.${blockId} .betterdocs-categories-folder.layout-4 .category-box`;
    const iconSelectorLayout4         = `.${blockId} .betterdocs-categories-folder.layout-4 .category-box .betterdocs-single-category-inner .betterdocs-category-header-inner .betterdocs-folder-icon`;
    const iconSelectorLayout4Image    = `.${blockId} .betterdocs-categories-folder.layout-4 .category-box .betterdocs-single-category-inner .betterdocs-category-header-inner .betterdocs-folder-icon img`;
    const titleSelectorLayout4        = `.${blockId} .betterdocs-categories-folder.layout-4 .category-box .betterdocs-single-category-inner .betterdocs-category-header-inner .betterdocs-category-title-counts .betterdocs-category-title`;
    const titleSelectorLayout4Hover   = `.${blockId} .betterdocs-categories-folder.layout-4 .category-box .betterdocs-single-category-inner .betterdocs-category-header-inner .betterdocs-category-title-counts .betterdocs-category-title:hover`;
    const countSelectorLayout4        = `.${blockId} .betterdocs-categories-folder.layout-4 .category-box .betterdocs-single-category-inner .betterdocs-category-header-inner .betterdocs-category-title-counts .betterdocs-sub-category-items-counts`;
    const countSelectorHoverLayout4   = `.${blockId} .betterdocs-categories-folder.layout-4 .category-box .betterdocs-single-category-inner .betterdocs-category-header-inner .betterdocs-category-title-counts:hover .betterdocs-sub-category-items-counts`;
    const lastUpdatedTimeWrapper      = `.${blockId} .betterdocs-categories-folder.layout-4 .category-box .betterdocs-single-category-inner .betterdocs-category-header-inner .betterdocs-category-title-counts .betterdocs-last-update`;

    const styleArray = layout != 'layout-4' ? [
        addProperty('dimension', BOX.CONTAINER_SECTION_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: containerWrapper
        }),
        addProperty('dimension', BOX.CONTAINER_SECTION_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: containerWrapper
        }),
        addProperty('background', BOX.CONTAINER_SECTION_BACKGROUND, {
            args: { noOverlay: true },
            cssSelector: containerWrapper
        }),
        addProperty('dimension', BOX.WRAPPER_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: `.${blockId}.betterdocs-category-box-wrapper`
        }),
        addProperty('dimension', BOX.WRAPPER_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: `.${blockId}.betterdocs-category-box-wrapper`
        }),
        addProperty('responsive', BOX.COLUMNS, {
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

        addProperty('dimension', BOX.BOX_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: singleBoxSelector
        }),

        addProperty('dimension', BOX.BOX_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: singleBoxSelector
        }),

        addProperty('background', BOX.BOX_BACKGROUND, {
            args: { noOverlay: true },
            cssSelector: singleBoxSelector
        }),

        addProperty('border', BOX.BOX_BORDER, {
            cssSelector: singleBoxSelector
        }),

        addProperty('responsive', 'iconAreaHeight', {
            args: { property: "height", controlName: BOX.ICON_AREA },
            cssSelector: iconSelector1
        }),
        addProperty('responsive', 'iconAreaWidth', {
            args: { property: "width", controlName: BOX.ICON_AREA },
            cssSelector: iconSelector1
        }),
        addProperty('responsive', 'iconAreaFlexBasis', {
            args: { property: "width", controlName: BOX.ICON_AREA },
            cssSelector: iconSelector1 //FIXME: selector needs to be changed. based on layout
        }),

        //should have custom unit like % for this controller
        addProperty('responsive', BOX.ICON_SIZE, {
            args: { property: "width" },
            cssSelector: iconSelector2
        }),

        addProperty('background', BOX.ICON_BACKGROUND, {
            args: { noOverlay: true, noMainBgi: true },
            cssSelector: iconSelector1
        }),

        addProperty('border', BOX.ICON_BORDER, {
            args: { noShadow: true },
            cssSelector: iconSelector1
        }),

        addProperty('dimension', BOX.ICON_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: iconSelector1
        }),

        addProperty('dimension', BOX.ICON_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: iconSelector1
        }),

        addProperty('typography', BOXTypo.typoPrefix_title, {
            args: {
                defaultFontSize: 20,
                prefixConstant: BOXTypo.typoPrefix_title,
            },
            cssSelector: titleSelector
        }),

        addProperty('color', 'titleColor', {
            args: { hover: 'titleHoverColor' },
            cssSelector: titleSelector,
            hoverSelector: titleHoverSelector,
        }),

        addProperty('dimension', BOX.TITLE_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: titleSelector
        }),

        addProperty('typography', BOXTypo.typoPrefix_count, {
            args: {
                defaultFontSize: 20,
                prefixConstant: BOXTypo.typoPrefix_count,
            },
            cssSelector: countSelector2
        }),

        addProperty('color', 'countColor', {
            args: { hover: 'countHoverColor' },
            cssSelector: countSelector2,
            hoverSelector:countSelector3
        }),

        addProperty('dimension', BOX.COUNT_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: countSelector1
        }),
    ] : [
        addProperty('dimension', BOX.WRAPPER_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: `.${blockId}.betterdocs-category-box-wrapper`
        }),
        addProperty('dimension', BOX.WRAPPER_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: `.${blockId}.betterdocs-category-box-wrapper`
        }),
        addProperty('dimension', BOX.BOX_PADDING_LAYOUT_4, {
            args: { styleFor: "padding" },
            cssSelector: singleBoxSelectorLayout4
        }),
        addProperty('dimension', BOX.BOX_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: singleBoxSelectorLayout4
        }),
        addProperty('background', BOX.BOX_BACKGROUND_LAYOUT_4, {
            args: { noOverlay: true },
            cssSelector: singleBoxSelectorLayout4
        }),
        addProperty('border', BOX.BOX_BORDER_LAYOUT_4, {
            cssSelector: singleBoxSelectorLayout4
        }),
        addProperty('responsive', 'iconAreaHeightLayout4', {
            args: { property: "height", controlName: BOX.ICON_AREA_LAYOUT_4 },
            cssSelector: iconSelectorLayout4
        }),
        addProperty('responsive', 'iconAreaWidthLayout4', {
            args: { property: "width", controlName: BOX.ICON_AREA_LAYOUT_4 },
            cssSelector: iconSelectorLayout4
        }),
        addProperty('responsive', 'iconImageHeightLayout4', {
            args: { property: "height", controlName: BOX.ICON_IMAGE_HEIGHT_LAYOUT_4 },
            cssSelector: iconSelectorLayout4Image
        }),
        addProperty('responsive', 'iconImageWidtjLayout4', {
            args: { property: "width", controlName: BOX.ICON_IMAGE_WIDTH_LAYOUT_4 },
            cssSelector: iconSelectorLayout4Image
        }),
        addProperty('responsive', BOX.ICON_SIZE_LAYOUT_4, {
            args: { property: "width" },
            cssSelector: iconSelectorLayout4
        }),
        addProperty('background', BOX.ICON_BACKGROUND_LAYOUT_4, {
            args: { noOverlay: true, noMainBgi: true },
            cssSelector: iconSelectorLayout4
        }),
        addProperty('border', BOX.ICON_BORDER_LAYOUT_4, {
            args: { noShadow: true },
            cssSelector: iconSelectorLayout4
        }),
        addProperty('dimension', BOX.ICON_PADDING_LAYOUT_4, {
            args: { styleFor: "padding" },
            cssSelector: iconSelectorLayout4
        }),
        addProperty('dimension', BOX.ICON_MARGIN_LAYOUT_4, {
            args: { styleFor: "margin" },
            cssSelector: iconSelectorLayout4
        }),

        addProperty('typography', BOXTypo.typoPrefix_title_layout_4, {
            args: {
                defaultFontSize: 24,
                prefixConstant: BOXTypo.typoPrefix_title_layout_4,
            },
            cssSelector: titleSelectorLayout4
        }),

        addProperty('color', 'titleColorLayout4', {
            args: { hover: 'titleHoverColorLayout4' },
            cssSelector: titleSelectorLayout4,
        }),

        addProperty('dimension', BOX.TITLE_MARGIN_LAYOUT_4, {
            args: { styleFor: "margin" },
            cssSelector: titleSelectorLayout4
        }),

        addProperty('typography', BOXTypo.typoPrefix_count_layout_4, {
            args: {
                defaultFontSize: 16,
                prefixConstant: BOXTypo.typoPrefix_count_layout_4,
            },
            cssSelector: countSelectorLayout4
        }),
        addProperty('color', 'countColorLayout4', {
            args: { hover: 'countHoverColorLayout4' },
            cssSelector: countSelectorLayout4,
        }),
        addProperty('dimension', BOX.COUNT_MARGIN_LAYOUT_4, {
            args: { styleFor: "margin" },
            cssSelector: countSelectorLayout4
        }),

        addProperty('typography', BOXTypo.typoPrefix_last_updated_time, {
            args: {
                defaultFontSize: 12,
                prefixConstant: BOXTypo.typoPrefix_last_updated_time,
            },
            cssSelector: lastUpdatedTimeWrapper
        }),

        addProperty('color', 'lastUpdatedTimeColor', {
            args: { hover: 'lastUpdatedTimeHoverColor' },
            cssSelector: lastUpdatedTimeWrapper,
            hoverSelector: lastUpdatedTimeWrapper + ':hover',
        }),

        addProperty('background', BOX.LAST_UPDATED_BACKGROUND_COLOR_LAYOUT_4, {
            args: { noOverlay: true },
            cssSelector: lastUpdatedTimeWrapper
        }),

        addProperty('dimension', BOX.LAST_UPDATED_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: lastUpdatedTimeWrapper
        }),

        addProperty('dimension', BOX.LAST_UPDATED_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: lastUpdatedTimeWrapper
        }),
    ];

    return styleArray
}
