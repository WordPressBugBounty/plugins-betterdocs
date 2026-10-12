import { applyFilters } from "@wordpress/hooks";
import { addProperty } from "../../../helpers/helper";
import * as ARCHIVE_LIST from "./constants";
import * as ARCHIVE_LIST_TYPO from "./typographyPrefixConstants";
import attributes from "./attributes";

export default ({ blockId, list_icon, layout }) => {
    const archiveListSelector = `.${blockId}.betterdocs-content-area .betterdocs-entry-body ul li a`;
    const archiveListIconSelector = `.${blockId}.betterdocs-content-area .betterdocs-entry-body ul li svg, .${blockId}.betterdocs-content-area .betterdocs-entry-body ul li i, .${blockId}.betterdocs-content-area .betterdocs-entry-body ul li img`;
    const archiveListDescriptionSelector = `.${blockId}.betterdocs-content-area .betterdocs-entry-title p`;
    const archiveListHeadingSelector = `.${blockId}.betterdocs-content-area .betterdocs-entry-title .betterdocs-entry-heading`;
	const archiveListBackgroundWrapper = `.${blockId}.betterdocs-content-area .betterdocs-content-inner-area`;
	const archiveListBackgroundWrapperLayout3 = `.${blockId} .betterdocs-title-excerpt-lists .betterdocs-title-excerpt-list`;
	const archiveListBackgroundWrapperLayout2 = `.${blockId}.betterdocs-taxonomy-doc-category .layout-6.betterdocs-category-grid-list-inner-wrapper .betterdocs-body ul li`;

    const archiveListLayoutThreeSelector          = `.${blockId} .betterdocs-title-excerpt-lists .betterdocs-title-excerpt-list h2 a`;
    const archiveListIconSelectorLayoutThree      = `.${blockId} .betterdocs-title-excerpt-lists .betterdocs-title-excerpt-list h2 span svg`;
    const archiveListIconOuterSelectorLayoutThree = `.${blockId} .betterdocs-title-excerpt-lists .betterdocs-title-excerpt-list h2 span`;
    const archiveListIconSvgSelectorLayoutThree   = `.${blockId} .betterdocs-title-excerpt-lists .betterdocs-title-excerpt-list h2 span svg path`;
    const archiveListLayoutThreeExcerptSelector   =  `.${blockId} .betterdocs-title-excerpt-lists .betterdocs-title-excerpt-list p`;
    const archiveListLastUpdatedSelector          =  `.${blockId} .betterdocs-title-excerpt-lists .betterdocs-title-excerpt-list .update-date`;
    const paginationSelectorOne                   = `.${blockId} .betterdocs-entry-body .betterdocs-pagination ul li a`;
    const paginationSelectorTwo                   = `.${blockId} .betterdocs-pagination ul li a`;
    const paginationSelectorOneActive             = `.${blockId} .betterdocs-pagination ul li.active a`;
    const paginationRootWrapperOne                = `.${blockId} .betterdocs-entry-body .betterdocs-pagination`;
    const paginationRootWrapperTwo                = `.${blockId} .betterdocs-pagination`;
    const paginationRootWrapperUlLayoutOne        = `.${blockId} .betterdocs-entry-body .betterdocs-pagination ul`;
    const paginationRootWrapperUlLayoutTwo        = `.${blockId} .betterdocs-pagination ul`;
    const layout2Wrapper                          =  `.${blockId}.betterdocs-taxonomy-doc-category .layout-6.betterdocs-category-grid-list-inner-wrapper .betterdocs-body ul `;

    let styleCollections = [
        addProperty("typography", ARCHIVE_LIST_TYPO.TYPO_ARCHIVE_LIST, {
            args: {
                prefixConstant: ARCHIVE_LIST_TYPO.TYPO_ARCHIVE_LIST,
            },
            cssSelector: archiveListSelector,
        }),

        addProperty("color", "list_color", {
            args: { hover: "list_hover_color" },
            cssSelector: archiveListSelector,
        }),

        addProperty( list_icon != '' ? "color" : "fill", "list_icon_color", {
            args: { hover: "list_icon_color" },
            cssSelector: archiveListIconSelector,
        }),

		addProperty('background', layout == 'layout-1' ? ARCHIVE_LIST.ARCHIVE_LIST_WRAPPER_BACKGROUND : ( layout == 'layout-2' ? ARCHIVE_LIST.ARCHIVE_LIST_WRAPPER_BACKGROUND_LAYOUT_2 : ARCHIVE_LIST.ARCHIVE_LIST_WRAPPER_BACKGROUND_LAYOUT_3 ), {
            args: { noOverlay: true },
            cssSelector: layout == 'layout-1' ? archiveListBackgroundWrapper :  ( layout == 'layout-3' || layout == 'layout-4' ? archiveListBackgroundWrapperLayout3 : archiveListBackgroundWrapperLayout2 )
        }),

        addProperty( list_icon != '' ? "color" : "fill", "list_icon_hover_color", {
            args: { hover: "list_icon_hover_color" },
            cssSelector: `.${blockId}.betterdocs-content-area .betterdocs-entry-body ul li svg:hover, .${blockId}.betterdocs-content-area .betterdocs-entry-body ul li i:hover`,
        }),

        addProperty("responsive", "listIconWidth", {
            args: {
                property: "width",
                controlName: ARCHIVE_LIST.ARCHIVE_ICON_WIDTH,
            },
            cssSelector: archiveListIconSelector,
        }),

        addProperty("responsive", "listIconHeight", {
            args: {
                property: "height",
                controlName: ARCHIVE_LIST.ARCHIVE_ICON_HEIGHT,
            },
            cssSelector: archiveListIconSelector,
        }),

        addProperty("color", "list_description_color", {
            args: { hover: "list_description_color" },
            cssSelector: archiveListDescriptionSelector,
        }),

        addProperty("typography", ARCHIVE_LIST_TYPO.TYPO_DESCRIPTION, {
            args: {
                prefixConstant: ARCHIVE_LIST_TYPO.TYPO_DESCRIPTION,
            },
            cssSelector: archiveListDescriptionSelector,
        }),
        addProperty("typography", ARCHIVE_LIST_TYPO.TYPO_ARCHIVE_TITLE, {
            args: {
                prefixConstant: ARCHIVE_LIST_TYPO.TYPO_ARCHIVE_TITLE,
            },
            cssSelector: archiveListHeadingSelector,
        }),
        addProperty("color", "list_title_color", {
            args: { hover: "list_title_color" },
            cssSelector: archiveListHeadingSelector,
        }),

        addProperty("typography", ARCHIVE_LIST_TYPO.TYPO_ARCHIVE_LIST_TITLE_THREE, {
            args: {
                prefixConstant: ARCHIVE_LIST_TYPO.TYPO_ARCHIVE_LIST_TITLE_THREE,
                defaultFontSize: 20,
            },
            cssSelector: archiveListLayoutThreeSelector,
        }),
        addProperty("color", "list_title_color_layout_three", {
            args: { hover: "list_title_hover_color_layout_three" },
            cssSelector: archiveListLayoutThreeSelector,
        }),

        addProperty( "fill", "list_icon_color_layout_three", {
            args: { hover: "list_icon_hover_color_layout_three" },
            cssSelector: archiveListIconSvgSelectorLayoutThree,
        }),

        addProperty("responsive", "listIconWidth", {
            args: {
                property: "width",
                controlName: ARCHIVE_LIST.LIST_THREE_ICON_WIDTH,
            },
            cssSelector: archiveListIconOuterSelectorLayoutThree,
        }),

        addProperty("responsive", "listIconHeight", {
            args: {
                property: "height",
                controlName: ARCHIVE_LIST.LIST_THREE_ICON_HEIGHT,
            },
            cssSelector: archiveListIconOuterSelectorLayoutThree,
        }),
        addProperty('background', ARCHIVE_LIST.LIST_ICON_BACKGROUND_LAYOUT_THREE, {
            args: { noOverlay: true },
            cssSelector: archiveListIconOuterSelectorLayoutThree
        }),
        addProperty("color", "list_exceprt_color_layout_three", {
            args: { hover: "list_exceprt_color_layout_three" },
            cssSelector: archiveListLayoutThreeExcerptSelector,
        }),
        addProperty("typography", ARCHIVE_LIST_TYPO.TYPO_EXCEPRT_LAYOUT_THREE, {
            args: {
                prefixConstant: ARCHIVE_LIST_TYPO.TYPO_EXCEPRT_LAYOUT_THREE,
            },
            cssSelector: archiveListLayoutThreeExcerptSelector,
        }),
        addProperty("typography", ARCHIVE_LIST_TYPO.LAST_UPDATED_TIME_TYPO, {
            args: {
                prefixConstant: ARCHIVE_LIST_TYPO.LAST_UPDATED_TIME_TYPO,
            },
            cssSelector: archiveListLastUpdatedSelector,
        }),
        addProperty("color", "last_updated_time_color", {
            args: { hover: "last_updated_time_color" },
            cssSelector: archiveListLastUpdatedSelector,
        }),
        addProperty('background', ARCHIVE_LIST.LAST_UPDATED_BACKGROUND_LAYOUT_THREE, {
            args: { noOverlay: true },
            cssSelector: archiveListLastUpdatedSelector
        }),
        addProperty("color", "pagination_color", {
            args: { hover: "pagination_color" },
            cssSelector: paginationSelectorOne+','+paginationSelectorTwo,
        }),
        addProperty('background', ARCHIVE_LIST.PAGINATION_BACKGROUND_COLOR_LAYOUT_1, {
            args: { noOverlay: true },
            cssSelector: paginationSelectorOne
        }),
        addProperty('background', ARCHIVE_LIST.PAGINATION_BACKGROUND_COLOR_LAYOUT_3, {
            args: { noOverlay: true },
            cssSelector: paginationSelectorTwo
        }),
        addProperty("responsive", "paginationHeight", {
            args: {
                property: "height",
                controlName: ARCHIVE_LIST.PAGINATION_HEIGHT_LAYOUT_1_3,
            },
            cssSelector: paginationSelectorOne,
        }),
        addProperty("responsive", "paginationWidth", {
            args: {
                property: "width",
                controlName: ARCHIVE_LIST.PAGINATION_WIDTH_LAYOUT_1_3,
            },
            cssSelector: paginationSelectorOne,
        }),
        addProperty("typography", ARCHIVE_LIST_TYPO.TYPO_PAGINATION, {
            args: {
                prefixConstant: ARCHIVE_LIST_TYPO.TYPO_PAGINATION,
                defaultFontSize: 14,
            },
            cssSelector: paginationSelectorOne,
        }),
        addProperty("border-color", "pagination_active_border_color", {
            cssSelector: paginationSelectorOneActive,
        }),
        addProperty("color", "pagination_active_color", {
            args: { hover: "pagination_active_color" },
            cssSelector: paginationSelectorOneActive,
        }),
        addProperty('alignment', layout == 'layout-1' ? 'pagination_alignment_layout_1' : 'pagination_alignment_layout_3', {
            args: { alignProperty: "justify-content" },
            cssSelector:layout == 'layout-1' ? paginationRootWrapperUlLayoutOne : paginationRootWrapperTwo
        } ),
        addProperty('dimension', ARCHIVE_LIST.PAGINATION_PADDING_1_3, {
            args: { styleFor: "padding" },
            cssSelector: layout == 'layout-1' ? paginationRootWrapperOne : paginationRootWrapperTwo
        }),
        addProperty('dimension', ARCHIVE_LIST.PAGINATION_MARGIN_1_3, {
            args: { styleFor: "margin" },
            cssSelector: layout == 'layout-1' ? paginationRootWrapperOne : paginationRootWrapperTwo
        }),
        addProperty('dimension', ARCHIVE_LIST.LAYOUT_2_WRAPPER_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: layout2Wrapper
        }),
        addProperty('dimension', ARCHIVE_LIST.LAYOUT_2_WRAPPER_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: layout2Wrapper
        }),

        // Container Section Controls
        addProperty('dimension', ARCHIVE_LIST.CONTAINER_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: layout == 'layout-1' ? `.${blockId} .betterdocs-articles-list` : `.${blockId} .betterdocs-title-excerpt-lists`
        }),
        addProperty('dimension', ARCHIVE_LIST.CONTAINER_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: layout == 'layout-1' ? `.${blockId} .betterdocs-articles-list` : `.${blockId} .betterdocs-title-excerpt-lists`
        }),

        // Category List Controls (Layout 3 & 4)
        addProperty('dimension', ARCHIVE_LIST.LIST_ITEM_SPACING, {
            args: { styleFor: "margin" },
            cssSelector: `.${blockId} .betterdocs-title-excerpt-lists .betterdocs-title-excerpt-list`
        }),
        addProperty('dimension', ARCHIVE_LIST.LIST_AREA_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: `.${blockId} .betterdocs-title-excerpt-lists .betterdocs-title-excerpt-list`
        }),
        addProperty('dimension', ARCHIVE_LIST.TITLE_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: `.${blockId} .betterdocs-title-excerpt-lists .betterdocs-title-excerpt-list h2`
        }),
        addProperty('dimension', ARCHIVE_LIST.TITLE_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: `.${blockId} .betterdocs-title-excerpt-lists .betterdocs-title-excerpt-list h2`
        }),
        addProperty('dimension', ARCHIVE_LIST.EXCERPT_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: `.${blockId} .betterdocs-title-excerpt-lists .betterdocs-title-excerpt-list p`
        }),
        addProperty('dimension', ARCHIVE_LIST.EXCERPT_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: `.${blockId} .betterdocs-title-excerpt-lists .betterdocs-title-excerpt-list p`
        }),
        addProperty('dimension', ARCHIVE_LIST.DATE_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: `.${blockId} .betterdocs-title-excerpt-lists .betterdocs-title-excerpt-list .update-date`
        }),
        addProperty('dimension', ARCHIVE_LIST.DATE_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: `.${blockId} .betterdocs-title-excerpt-lists .betterdocs-title-excerpt-list .update-date`
        })
    ];
    styleCollections = applyFilters('filterStyleObject', styleCollections, blockId);
    return styleCollections;
};
