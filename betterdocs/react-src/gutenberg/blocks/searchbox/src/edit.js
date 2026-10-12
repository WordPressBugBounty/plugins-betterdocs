/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { select } from "@wordpress/data";
import { useBlockProps } from "@wordpress/block-editor";
import { applyFilters, doAction } from "@wordpress/hooks";
import { safeHTML } from '@wordpress/dom';
import SearchField from "../../../../public/shortcodes/search-modal/SearchField";
import { useRef } from "@wordpress/element";

/**
 * Internal dependencies
 */
import Inspector from "./inspector";

import {
    softMinifyCssStrings,
    isCssExists,
    duplicateBlockIdFix,
    generateDimensionsControlStyles,
    generateBorderShadowStyles,
    generateTypographyStyles,
    generateBackgroundControlStyles,
    generateResponsiveRangeStyles,
} from "../../../util/helpers";
import {
    BOX_BACKGROUND,
    BOX_PADDING,
    FIELD_PADDING,
    FIELD_BORDER,
    ICON_SIZE,
    RESULT_BOX_WIDTH,
    RESULT_BOX_MAXWIDTH,
    RESULT_BOX_BACKGROUND,
    RESULT_BOX_BORDER,
    ITEM_PADDING,
    ITEM_BORDER,
    WRAPPER_MARGIN,
    BOX_BACKGROUND_LAYOUT_2,
    BOX_PADDING_LAYOUT_2,
    FIELD_PADDING_LAYOUT_2,
    FIELD_BORDER_LAYOUT_2,
    ICON_SIZE_LAYOUT_2,
    SEARCH_MODAL_FIELD_BACKGROUND,
    SEARCH_MODAL_CONTENT_TABS_ICON_SIZE,
    SEARCH_MODAL_CONTENT_TABS_BORDER,
    SEARCH_MODAL_CONTENT_TABS_LIST_ICON_SIZE,
    SEARCH_MODAL_CONTENT_TABS_LIST_BORDER,
    SEARCH_MODAL_CONTENT_TABS_LIST_CATEGORY_ICON_SIZE,
    SEARCH_BUTTON_BACKGROUND_LAYOUT_2,
    WRAPPER_MARGIN_LAYOUT_2,
    AI_SUGGESTION_MARGIN,
    AI_SUGGESTION_PADDING,
    AI_SUGGESTION_BUTTON_MARGIN,
    AI_SUGGESTION_BUTTON_PADDING
} from "./constants";
import {
    typoPrefix_fieldtext,
    typoPrefix_resulttext,
    typoPrefix_fieldtext_layout_2,
    SEARCH_MODAL_FIELD_TYPO,
    SEARCH_MODAL_CATEGORY_FIELD_TYPO,
    SEARCH_MODAL_CONTENT_TABS_TYPO,
    SEARCH_MODAL_CONTENT_TABS_LIST_TYPO,
    SEARCH_MODAL_CONTENT_TABS_LIST_CATEGORY_TYPO,
    SEARCH_BUTTON_LAYOUT_2_TYPO,
    AI_SUGGESTION_TITLE_TYPO,
    AI_SUGGESTION_QUERY_TYPO,
    AI_SUGGESTION_RESPONSE_TYPO,
    AI_SUGGESTION_BUTTON_TYPO
} from "./typographyPrefixConstants";

import { usePreviewDeviceType } from "../../../hooks";

const edit = ({ attributes, setAttributes, isSelected, clientId }) => {
    const {
        blockMeta,
        blockId,
        resOption,
        placeholderText,
        fieldBackgroundColor,
        fieldTextColor,
        searchIconColor,
        closeIconColor,
        closeBorderColor,
        itemColor,
        itemHoverColor,
        categorySearch,
        searchButton,
        popularSearch,
        searchLayout,
        searchModalLayout,
        searchModalWidth,
        searchModalWidthUnit,
        searchModalPosition,
        fieldBackgroundColorLayout2,
        fieldTextColorLayout2,
        searchIconColorLayout2,
        searchModalMagnifierColor,
        searchModalFieldColor,
        searchModalFieldPlaceholderColor,
        searchModalCategoryColor,
        searchModalContentTabsListColor,
        searchModalContentTabsListCategoryColor,
        searchHeading,
        searchSubHeading,
        popularSearchLayout2,
        categorySearchLayout2,
        searchButtonLayout2,
        initialDocsNumber,
        initialFAQNumber,
        searchModalQueryDocIds,
        searchModalQueryTermIds,
        searchButtonLayout2Color,
        searchModalQueriesFaqGroupIds,
        docQueryType,
        faqQueryType,
        // AI Search Suggestions attributes
        enable_ai_powered_search,
		ai_suggestion_background_color,
		ai_suggestion_hover_background_color,
        ai_suggestion_title_color,
        ai_suggestion_query_color,
        ai_suggestion_response_color,
        ai_suggestion_button_color,
        ai_suggestion_button_bg_color
    } = attributes;



    // this useEffect is for setting the resOption attribute to desktop/tab/mobile depending on the added 'eb-res-option-' class
    /**
     * resOption: __experimentalPreviewDeviceType()
     * Set Responsive Option
     */
    usePreviewDeviceType(setAttributes);

    // this useEffect is for creating an unique id for each block's unique className by a random unique number
    useEffect(() => {
        const BLOCK_PREFIX = "betterdocs-searchbox";
        duplicateBlockIdFix({
            BLOCK_PREFIX,
            blockId,
            setAttributes,
            select,
            clientId,
        });
    }, []);

    const blockProps = useBlockProps({
        className: `bd-guten-block-main-parent-wrapper`,
    });

    // search box background
    const {
        backgroundStylesDesktop: boxBackgroundStylesDesktop,
        hoverBackgroundStylesDesktop: boxHoverBackgroundStylesDesktop,
        backgroundStylesTab: boxBackgroundStylesTab,
        hoverBackgroundStylesTab: boxHoverBackgroundStylesTab,
        backgroundStylesMobile: boxBackgroundStylesMobile,
        hoverBackgroundStylesMobile: boxHoverBackgroundStylesMobile,
        bgTransitionStyle: boxBgTransitionStyle,
    } = generateBackgroundControlStyles({
        attributes,
        controlName: searchLayout == 'layout-1' ? BOX_BACKGROUND : BOX_BACKGROUND_LAYOUT_2,
        noOverlay: true,
    });

    // Box Padding
    const {
        dimensionStylesDesktop: boxPaddingDesktop,
        dimensionStylesTab: boxPaddingTab,
        dimensionStylesMobile: boxPaddingMobile,
    } = generateDimensionsControlStyles({
        controlName: searchLayout == 'layout-1' ? BOX_PADDING : BOX_PADDING_LAYOUT_2,
        styleFor: "padding",
        attributes,
    });

    // search text typography
    const {
        typoStylesDesktop: textTypoStylesDesktop,
        typoStylesTab: textTypoStylesTab,
        typoStylesMobile: textTypoStylesMobile,
    } = generateTypographyStyles({
        attributes,
        prefixConstant: searchLayout == 'layout-1' ? typoPrefix_fieldtext : typoPrefix_fieldtext_layout_2,
        defaultFontSize: searchLayout == 'layout-1' ? 14 : 16,
    });

    // Box Padding
    const {
        dimensionStylesDesktop: textPaddingDesktop,
        dimensionStylesTab: textPaddingTab,
        dimensionStylesMobile: textPaddingMobile,
    } = generateDimensionsControlStyles({
        controlName: searchLayout == 'layout-1' ? FIELD_PADDING : FIELD_PADDING_LAYOUT_2,
        styleFor: "padding",
        attributes,
    });

    // text field border
    const {
        stylesDesktop: textFieldBdShadowStyesDesktop,
        stylesTab: textFieldBdShadowStyesTab,
        stylesMobile: textFieldBdShadowStyesMobile,
        stylesHoverDesktop: textFieldBdShadowStylesHoverDesktop,
        stylesHoverTab: textFieldBdShadowStylesHoverTab,
        stylesHoverMobile: textFieldBdShadowStylesHoverMobile,
        transitionStyle: textFieldBdShadowTransitionStyle,
    } = generateBorderShadowStyles({
        controlName: searchLayout == 'layout-1' ? FIELD_BORDER : FIELD_BORDER_LAYOUT_2,
        noShadow: true,
        attributes,
    });

    // search icon size
    const {
        rangeStylesDesktop: searchIconSizeDesktop,
        rangeStylesTab: searchIconSizeTab,
        rangeStylesMobile: searchIconSizeMobile,
    } = generateResponsiveRangeStyles({
        controlName: ICON_SIZE,
        property: "width",
        attributes,
    });

    // result box width
    const {
        rangeStylesDesktop: resultBoxWidthDesktop,
        rangeStylesTab: resultBoxWidthTab,
        rangeStylesMobile: resultBoxWidthMobile,
    } = generateResponsiveRangeStyles({
        controlName: RESULT_BOX_WIDTH,
        property: "width",
        attributes,
    });

    // result box max-width
    const {
        rangeStylesDesktop: resultBoxMaxWidthDesktop,
        rangeStylesTab: resultBoxMaxWidthTab,
        rangeStylesMobile: resultBoxMaxWidthMobile,
    } = generateResponsiveRangeStyles({
        controlName: RESULT_BOX_MAXWIDTH,
        property: "max-width",
        attributes,
    });

    // result box background
    const {
        backgroundStylesDesktop: resultBoxBackgroundStylesDesktop,
        hoverBackgroundStylesDesktop: resultBoxHoverBackgroundStylesDesktop,
        backgroundStylesTab: resultBoxBackgroundStylesTab,
        hoverBackgroundStylesTab: resultBoxHoverBackgroundStylesTab,
        backgroundStylesMobile: resultBoxBackgroundStylesMobile,
        hoverBackgroundStylesMobile: resultBoxHoverBackgroundStylesMobile,
        bgTransitionStyle: resultBoxBgTransitionStyle,
    } = generateBackgroundControlStyles({
        attributes,
        controlName: RESULT_BOX_BACKGROUND,
        noOverlay: true,
    });

    // result box border
    const {
        stylesDesktop: resultBoxBdShadowStyesDesktop,
        stylesTab: resultBoxBdShadowStyesTab,
        stylesMobile: resultBoxBdShadowStyesMobile,
        stylesHoverDesktop: resultBoxBdShadowStylesHoverDesktop,
        stylesHoverTab: resultBoxBdShadowStylesHoverTab,
        stylesHoverMobile: resultBoxBdShadowStylesHoverMobile,
        transitionStyle: resultBoxBdShadowTransitionStyle,
    } = generateBorderShadowStyles({
        controlName: RESULT_BOX_BORDER,
        noShadow: true,
        attributes,
    });

    // result list text typography
    const {
        typoStylesDesktop: resultListTypoStylesDesktop,
        typoStylesTab: resultListTypoStylesTab,
        typoStylesMobile: resultListTypoStylesMobile,
    } = generateTypographyStyles({
        attributes,
        prefixConstant: typoPrefix_resulttext,
    });

    // result list Padding
    const {
        dimensionStylesDesktop: reslutListPaddingDesktop,
        dimensionStylesTab: reslutListPaddingTab,
        dimensionStylesMobile: reslutListPaddingMobile,
    } = generateDimensionsControlStyles({
        controlName: ITEM_PADDING,
        styleFor: "padding",
        attributes,
    });

    // result list border
    const {
        stylesDesktop: resultListBdShadowStyesDesktop,
        stylesTab: resultListBdShadowStyesTab,
        stylesMobile: resultListBdShadowStyesMobile,
        stylesHoverDesktop: resultListBdShadowStylesHoverDesktop,
        stylesHoverTab: resultListBdShadowStylesHoverTab,
        stylesHoverMobile: resultListBdShadowStylesHoverMobile,
        transitionStyle: resultListBdShadowTransitionStyle,
    } = generateBorderShadowStyles({
        controlName: ITEM_BORDER,
        noShadow: true,
        attributes,
    });

    // wrapper margin
    const {
        dimensionStylesDesktop: wrpMarginDesktop,
        dimensionStylesTab: wrpMarginTab,
        dimensionStylesMobile: wrpMarginMobile,
    } = generateDimensionsControlStyles({
        controlName: searchLayout == 'layout-1' ? WRAPPER_MARGIN : WRAPPER_MARGIN_LAYOUT_2,
        styleFor: "margin",
        attributes,
    });

    // AI Search Suggestions Margin
    const {
        dimensionStylesDesktop: aiSuggestionMarginDesktop,
        dimensionStylesTab: aiSuggestionMarginTab,
        dimensionStylesMobile: aiSuggestionMarginMobile,
    } = generateDimensionsControlStyles({
        controlName: AI_SUGGESTION_MARGIN,
        styleFor: "margin",
        attributes,
    });

    // AI Search Suggestions Padding
    const {
        dimensionStylesDesktop: aiSuggestionPaddingDesktop,
        dimensionStylesTab: aiSuggestionPaddingTab,
        dimensionStylesMobile: aiSuggestionPaddingMobile,
    } = generateDimensionsControlStyles({
        controlName: AI_SUGGESTION_PADDING,
        styleFor: "padding",
        attributes,
    });

    // AI Search Suggestions Button Margin
    const {
        dimensionStylesDesktop: aiSuggestionButtonMarginDesktop,
        dimensionStylesTab: aiSuggestionButtonMarginTab,
        dimensionStylesMobile: aiSuggestionButtonMarginMobile,
    } = generateDimensionsControlStyles({
        controlName: AI_SUGGESTION_BUTTON_MARGIN,
        styleFor: "margin",
        attributes,
    });

    // AI Search Suggestions Button Padding
    const {
        dimensionStylesDesktop: aiSuggestionButtonPaddingDesktop,
        dimensionStylesTab: aiSuggestionButtonPaddingTab,
        dimensionStylesMobile: aiSuggestionButtonPaddingMobile,
    } = generateDimensionsControlStyles({
        controlName: AI_SUGGESTION_BUTTON_PADDING,
        styleFor: "padding",
        attributes,
    });

    // AI Search Suggestions Title Typography
    const {
        typoStylesDesktop: aiSuggestionTitleTypoDesktop,
        typoStylesTab: aiSuggestionTitleTypoTab,
        typoStylesMobile: aiSuggestionTitleTypoMobile,
    } = generateTypographyStyles({
        attributes,
        prefixConstant: AI_SUGGESTION_TITLE_TYPO,
        defaultFontSize: 18,
    });

    // AI Search Suggestions Query Typography
    const {
        typoStylesDesktop: aiSuggestionQueryTypoDesktop,
        typoStylesTab: aiSuggestionQueryTypoTab,
        typoStylesMobile: aiSuggestionQueryTypoMobile,
    } = generateTypographyStyles({
        attributes,
        prefixConstant: AI_SUGGESTION_QUERY_TYPO,
        defaultFontSize: 14,
    });

    // AI Search Suggestions Response Typography
    const {
        typoStylesDesktop: aiSuggestionResponseTypoDesktop,
        typoStylesTab: aiSuggestionResponseTypoTab,
        typoStylesMobile: aiSuggestionResponseTypoMobile,
    } = generateTypographyStyles({
        attributes,
        prefixConstant: AI_SUGGESTION_RESPONSE_TYPO,
        defaultFontSize: 14,
    });

    // AI Search Suggestions Button Typography
    const {
        typoStylesDesktop: aiSuggestionButtonTypoDesktop,
        typoStylesTab: aiSuggestionButtonTypoTab,
        typoStylesMobile: aiSuggestionButtonTypoMobile,
    } = generateTypographyStyles({
        attributes,
        prefixConstant: AI_SUGGESTION_BUTTON_TYPO,
        defaultFontSize: 14,
    });

    //search modal field background
    const {
        backgroundStylesDesktop: searchModalFieldBackgroundDesktop,
        hoverBackgroundStylesDesktop: searchModalFieldBackgroundDesktopHover,
        backgroundStylesTab: searchModalFieldBackgroundTab,
        hoverBackgroundStylesTab: searchModalFieldBackgroundHoverTab,
        backgroundStylesMobile: searchModalFieldBackgroundMobile,
        hoverBackgroundStylesMobile: searchModalFieldBackgroundHoverMobile,
        bgTransitionStyle: searchModalFieldBackgroundTransition
    } = generateBackgroundControlStyles({
        attributes,
        controlName: SEARCH_MODAL_FIELD_BACKGROUND,
        noOverlay: true,
    });

    const {
        typoStylesDesktop: searchModalFieldTypoDesktop,
        typoStylesTab: searchModalFieldTypoTab,
        typoStylesMobile: searchModalFieldTypoMobile,
    } = generateTypographyStyles({
        attributes,
        prefixConstant: SEARCH_MODAL_FIELD_TYPO,
        defaultFontSize: 16
    });

    const {
        typoStylesDesktop: searchModalCategoryFieldTypoDesktop,
        typoStylesTab: searchModalCaetgoryFieldTypoTab,
        typoStylesMobile: searchModalCategoryFieldTypoMobile,
    } = generateTypographyStyles({
        attributes,
        prefixConstant:SEARCH_MODAL_CATEGORY_FIELD_TYPO,
        defaultFontSize:15
    });

    const {
        typoStylesDesktop: searchModalContentTabsTypoDesktop,
        typoStylesTab: searchModalContentTabsTypoTab,
        typoStylesMobile: searchModalContentTabsTypoMobile,
    } = generateTypographyStyles({
        attributes,
        prefixConstant:SEARCH_MODAL_CONTENT_TABS_TYPO,
        defaultFontSize:14
    });

    const {
        rangeStylesDesktop: searchModalContentTabsIconSizeDesktop,
        rangeStylesTab: searchModalContentTabsIconSizeTab,
        rangeStylesMobile: searchModalContentTabsIconSizeMobile,
    } = generateResponsiveRangeStyles({
        controlName: SEARCH_MODAL_CONTENT_TABS_ICON_SIZE,
        property: "width",
        attributes,
    });

    const {
        stylesDesktop: searchModalContentTabsBorderDesktop,
        stylesTab: searchModalContentTabsBorderTab,
        stylesMobile: searchModalContentTabsBorderMobile,
        stylesHoverDesktop: searchModalContentTabsBorderHoverDesktop,
        stylesHoverTab: searchModalContentTabsBorderHoverTab,
        stylesHoverMobile: searchModalContentTabsBorderHoverMobile,
        transitionStyle: searchModalContentTabsTransition,
    } = generateBorderShadowStyles({
        controlName: SEARCH_MODAL_CONTENT_TABS_BORDER,
        noShadow: true,
        attributes,
    });

    const {
        typoStylesDesktop: searchModalContentTabsListTypoDesktop,
        typoStylesTab: searchModalContentTabsListTypoTab,
        typoStylesMobile: searchModalContentTabsListTypoMobile,
    } = generateTypographyStyles({
        attributes,
        prefixConstant:SEARCH_MODAL_CONTENT_TABS_LIST_TYPO,
        defaultFontSize:16
    });

    const {
        rangeStylesDesktop: searchModalContentTabsListIconSizeDesktop,
        rangeStylesTab: searchModalContentTabsListIconSizeTab,
        rangeStylesMobile: searchModalContentTabsListIconSizeMobile,
    } = generateResponsiveRangeStyles({
        controlName: SEARCH_MODAL_CONTENT_TABS_LIST_ICON_SIZE,
        property: "width",
        attributes,
    });

    const {
        stylesDesktop: searchModalContentTabsListBorderDesktop,
        stylesTab: searchModalContentTabsListBorderTab,
        stylesMobile: searchModalContentTabsListBorderMobile,
        stylesHoverDesktop: searchModalContentTabsListBorderHoverDesktop,
        stylesHoverTab: searchModalContentTabsListBorderHoverTab,
        stylesHoverMobile: searchModalContentTabsListBorderHoverMobile,
        transitionStyle: searchModalContentTabsListTransition,
    } = generateBorderShadowStyles({
        controlName: SEARCH_MODAL_CONTENT_TABS_LIST_BORDER,
        noShadow: true,
        attributes,
    });

    const {
        typoStylesDesktop: searchModalContentTabsListCategoryTypoDesktop,
        typoStylesTab: searchModalContentTabsListCategoryTypoTab,
        typoStylesMobile: searchModalContentTabsListCategoryTypoMobile,
    } = generateTypographyStyles({
        attributes,
        prefixConstant:SEARCH_MODAL_CONTENT_TABS_LIST_CATEGORY_TYPO,
        defaultFontSize:14
    });

    const {
        rangeStylesDesktop: searchModalContentTabsListCategoryIconSizeDesktop,
        rangeStylesTab: searchModalContentTabsListCategoryIconSizeTab,
        rangeStylesMobile: searchModalContentTabsListCategoryIconSizeMobile,
    } = generateResponsiveRangeStyles({
        controlName: SEARCH_MODAL_CONTENT_TABS_LIST_CATEGORY_ICON_SIZE,
        property: "width",
        attributes,
    });

    const {
        typoStylesDesktop: searchLayoutTwoButtonTypoDesk,
        typoStylesTab: searchLayoutTwoButtonTypoTab,
        typoStylesMobile: searchLayoutTwoButtonTypoMob,
    } = generateTypographyStyles({
        attributes,
        prefixConstant:SEARCH_BUTTON_LAYOUT_2_TYPO,
        defaultFontSize:16
    });

    const {
        backgroundStylesDesktop: searchButtonLayoutTwoBackgroundColorDesk,
        hoverBackgroundStylesDesktop: searchButtonLayoutTwoBackgroundColorHoverDesk,
        backgroundStylesTab: searchButtonLayoutTwoBackgroundColorTab,
        hoverBackgroundStylesTab: searchButtonLayoutTwoBackgroundColorHoverTab,
        backgroundStylesMobile: searchButtonLayoutTwoBackgroundColorMobile,
        hoverBackgroundStylesMobile: searchButtonLayoutTwoBackgroundColorHoverMobile,
        bgTransitionStyle: searchButtonLayoutTwoBackgroundColorTransitionStyles,
    } = generateBackgroundControlStyles({
        attributes,
        controlName: SEARCH_BUTTON_BACKGROUND_LAYOUT_2,
        noOverlay: true,
    });

    const {
        rangeStylesDesktop: searchIconSizeDesktopLayout2,
        rangeStylesTab: searchIconSizeTabLayout2,
        rangeStylesMobile: searchIconSizeMobileLayout2,
    } = generateResponsiveRangeStyles({
        controlName: ICON_SIZE_LAYOUT_2,
        property: "height",
        attributes,
    });

    const desktopStyles = `
        .${blockId}.betterdocs-searchbox-wrapper, .${blockId}.betterdocs-search-form-wrapper {
            ${wrpMarginDesktop}
            ${boxBackgroundStylesDesktop}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search  {
            ${boxPaddingDesktop}
            transition: ${boxBgTransitionStyle};
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search:hover, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search:hover  {
            ${boxHoverBackgroundStylesDesktop}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .betterdocs-searchform, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .betterdocs-searchform  {
            ${
                fieldBackgroundColor
                    ? `background: ${fieldBackgroundColor};`
                    : ""
            }
            ${fieldTextColor ? `color:${fieldTextColor};` : ""}
            ${textFieldBdShadowStyesDesktop}
            transition: ${textFieldBdShadowTransitionStyle};
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .betterdocs-searchform:hover, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .betterdocs-searchform:hover{
            ${textFieldBdShadowStylesHoverDesktop}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .betterdocs-searchform .betterdocs-search-field::placeholder, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .betterdocs-searchform .betterdocs-search-field::placeholder {
            ${fieldTextColor ? `color:${fieldTextColor};` : ""}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-searchform, .${blockId}.betterdocs-search-form-wrapper .betterdocs-searchform{
            ${textPaddingDesktop}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-searchform .betterdocs-search-field, .${blockId}.betterdocs-search-form-wrapper .betterdocs-searchform .betterdocs-search-field{
            ${textTypoStylesDesktop}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-searchform svg.docs-search-icon, .${blockId}.betterdocs-search-form-wrapper .betterdocs-searchform svg.docs-search-icon {
            ${searchIconSizeDesktop}
            height: auto;
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar .search-input-wrapper .search-icon path,
		.${blockId} .betterdocs-search-modal-archive .betterdocs-live-search .betterdocs-searchform .betterdocs-searchform-input-wrap svg path,
        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-searchform svg.docs-search-icon path, .${blockId}.betterdocs-search-form-wrapper .betterdocs-searchform svg.docs-search-icon path {
            ${searchIconColor ? `fill: ${searchIconColor};` : ""}
        }

        .${blockId}.betterdocs-searchbox-wrapper .docs-search-close .close-line, .${blockId}.betterdocs-search-form-wrapper .docs-search-close .close-line {
            ${closeIconColor ? `fill: ${closeIconColor};` : ""}
        }

       .${blockId}.betterdocs-searchbox-wrapper .docs-search-loader, .${blockId}.betterdocs-searchbox-wrapper .docs-search-close .close-border, .${blockId}.betterdocs-search-form-wrapper .docs-search-loader, .${blockId}.betterdocs-search-form-wrapper .docs-search-close .close-border {
           ${closeBorderColor ? `fill: ${closeBorderColor};` : ""}
       }

       .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .docs-search-result, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .docs-search-result {
            ${resultBoxWidthDesktop}
            ${resultBoxMaxWidthDesktop}
            ${resultBoxBackgroundStylesDesktop}
            ${resultBoxBdShadowStyesDesktop}
            transition: ${resultBoxBdShadowTransitionStyle}, ${resultBoxBgTransitionStyle};
       }

       .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .docs-search-result:hover, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .docs-search-result:hover{
           ${resultBoxHoverBackgroundStylesDesktop}
           ${resultBoxBdShadowStylesHoverDesktop}
       }


       .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .docs-search-result li, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .docs-search-result li {
           ${resultListBdShadowStyesDesktop}
           transition: ${resultListBdShadowTransitionStyle};
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .docs-search-result li:hover, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .docs-search-result li:hover {
            ${resultBoxHoverBackgroundStylesDesktop}
            ${resultListBdShadowStylesHoverDesktop}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .docs-search-result li:hover a span, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .docs-search-result li:hover a span{
            ${itemHoverColor ? `color: ${itemHoverColor};` : ""}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .docs-search-result li a span, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .docs-search-result li a span {
             ${resultListTypoStylesDesktop}
             ${reslutListPaddingDesktop}
             ${itemColor ? `color: ${itemColor};` : ""}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 {
            ${boxBackgroundStylesDesktop}
            ${boxPaddingDesktop}
            ${wrpMarginDesktop}
            transition: ${boxBgTransitionStyle};
        }

       .${blockId} .betterdocs-search-modal-archive .betterdocs-live-search,
       .${blockId} .betterdocs-search-modal-sidebar .betterdocs-live-search {
            ${boxBackgroundStylesDesktop}
            transition: ${boxBgTransitionStyle};
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1:hover,
        .${blockId} .betterdocs-search-modal-archive .betterdocs-live-search:hover,
        .${blockId} .betterdocs-search-modal-sidebar .betterdocs-live-search:hover{
            ${boxHoverBackgroundStylesDesktop}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar,
        .${blockId} .betterdocs-search-modal-archive .betterdocs-live-search .betterdocs-searchform {
            background-color:${fieldBackgroundColorLayout2};
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar .search-input-wrapper .search-input,
        .${blockId} .betterdocs-search-modal-archive .betterdocs-live-search .betterdocs-searchform .search-input-wrapper .search-input{
            color:${fieldTextColorLayout2};
            ${textTypoStylesDesktop}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar,
        .${blockId} .betterdocs-search-modal-archive .betterdocs-live-search .betterdocs-searchform {
            ${textPaddingDesktop}
            ${textFieldBdShadowStyesDesktop}
            transition: ${textFieldBdShadowTransitionStyle};
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar:hover,
        .${blockId} .betterdocs-search-modal-archive .betterdocs-live-search .betterdocs-searchform:hover {
            ${textFieldBdShadowStylesHoverDesktop}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header svg g path{
            fill:${searchModalMagnifierColor};
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header .betterdocs-searchform-input-wrap .betterdocs-search-field {
            color:${searchModalFieldColor};
            ${searchModalFieldTypoDesktop};
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header .betterdocs-searchform-input-wrap .betterdocs-search-field::placeholder {
            color:${searchModalFieldPlaceholderColor};
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header .betterdocs-select-option-wrapper .betterdocs-form-select .css-1jqq78o-placeholder{
            color:${searchModalCategoryColor};
            ${searchModalCategoryFieldTypoDesktop};
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list .content-main h4{
            color:${searchModalContentTabsListColor};
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list .content-sub h5{
            color:${searchModalContentTabsListCategoryColor};
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header {
            ${searchModalFieldBackgroundDesktop}
            transition:${searchModalFieldBackgroundTransition};
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header:hover {
            ${searchModalFieldBackgroundDesktopHover}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-info-tab .betterdocs-tab-items span:not(.tab-icon){
            ${searchModalContentTabsTypoDesktop}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-info-tab .betterdocs-tab-items span svg{
            ${searchModalContentTabsIconSizeDesktop}
            height:auto;
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-info-tab .betterdocs-tab-items{
            ${searchModalContentTabsBorderDesktop}
            transition:${searchModalContentTabsTransition};
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-info-tab .betterdocs-tab-items:hover{
            ${searchModalContentTabsBorderHoverDesktop}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list .content-main h4{
            ${searchModalContentTabsListTypoDesktop}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar .search-button,
		.${blockId} .betterdocs-search-modal-archive .betterdocs-live-search .betterdocs-searchform .search-button {
            color:${searchButtonLayout2Color};
            ${searchLayoutTwoButtonTypoDesk}
            ${searchButtonLayoutTwoBackgroundColorDesk}
            transition:${searchButtonLayoutTwoBackgroundColorTransitionStyles};
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar .search-button:hover,
		.${blockId} .betterdocs-search-modal-archive .betterdocs-live-search .betterdocs-searchform .search-button:hover{
            ${searchButtonLayoutTwoBackgroundColorHoverDesk}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar .search-input-wrapper .search-icon,
		.${blockId} .betterdocs-search-modal-archive .betterdocs-live-search .betterdocs-searchform .betterdocs-searchform-input-wrap svg {
            width:auto;
            ${searchIconSizeDesktopLayout2}
        }

		.${blockId} .betterdocs-search-modal-archive .betterdocs-live-search .betterdocs-searchform .betterdocs-searchform-input-wrap svg path {
			${searchIconColor ? `fill: ${searchIconColor};` : ""}
		}

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list .content-main svg{
            ${searchModalContentTabsListIconSizeDesktop}
            height:auto;
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list{
            ${searchModalContentTabsListBorderDesktop}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list:hover{
            ${searchModalContentTabsListBorderHoverDesktop}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header .betterdocs-select-option-wrapper .css-19bb58m{
            ${searchModalContentTabsListCategoryTypoDesktop}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list .content-sub svg{
            ${searchModalContentTabsListCategoryIconSizeDesktop}
            height:auto;
        }

        /* AI Search Suggestions Styles */
        ${(() => {
            // Check if AI Search Suggestions are enabled globally and for this block using block editor localization
            const isAISearchEnabled = () => {
                try {
                    return typeof window.betterDocsBlocksHelper !== 'undefined' &&
                           (window.betterDocsBlocksHelper.AI_SEARCH_SUGGESTIONS_ENABLED == true ||
                            window.betterDocsBlocksHelper.AI_SEARCH_SUGGESTIONS_ENABLED === 1);
                } catch (error) {
                    return false;
                }
            };

            if (!isAISearchEnabled() || !enable_ai_powered_search) {
                return '';
            }

            return `
                .${blockId} .betterdocs-ai-suggestion {
                    ${aiSuggestionMarginDesktop}
                    ${aiSuggestionPaddingDesktop}
					background-color: ${ai_suggestion_background_color};
                }
                .${blockId} .betterdocs-ai-suggestion:hover {
					background-color: ${ai_suggestion_hover_background_color};
                }
                .${blockId} .betterdocs-ai-suggestion .ai-suggestion-prompt .ai-suggestion-text .ai-suggestion-label {
                    color: ${ai_suggestion_title_color};
                    ${aiSuggestionTitleTypoDesktop}
                }
                .${blockId} .betterdocs-ai-suggestion .ai-suggestion-prompt .ai-suggestion-content .ai-suggestion-query {
                    color: ${ai_suggestion_query_color};
                    ${aiSuggestionQueryTypoDesktop}
                }
                .${blockId} .betterdocs-ai-suggestion .ai-response .ai-response-content {
                    color: ${ai_suggestion_response_color};
                    ${aiSuggestionResponseTypoDesktop}
                }
                .${blockId} .betterdocs-ai-suggestion .ai-response .ai-response-actions .continue-conversation-btn {
                    color: ${ai_suggestion_button_color};
                    background-color: ${ai_suggestion_button_bg_color};
                    ${aiSuggestionButtonMarginDesktop}
                    ${aiSuggestionButtonPaddingDesktop}
                    ${aiSuggestionButtonTypoDesktop}
                }
            `;
        })()}
        /* SearchModal Layout 2 & 3 Width and Position */
        .${blockId} {
            text-align: ${searchModalPosition};
        }
        .${blockId} .betterdocs-search-modal-archive,
        .${blockId} .betterdocs-search-modal-sidebar {
            width: ${searchModalWidth}${searchModalWidthUnit};
			max-width: 100%;
            display: inline-block;
            text-align: left;
        }
    `;

    const tabStyles = `
        .${blockId}.betterdocs-searchbox-wrapper, .${blockId}.betterdocs-search-form-wrapper {
            ${wrpMarginTab}
            ${boxBackgroundStylesTab}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search {
            ${boxPaddingTab}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search:hover, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search:hover{
            ${boxHoverBackgroundStylesTab}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-searchform, .${blockId}.betterdocs-search-form-wrapper .betterdocs-searchform{
            ${textPaddingTab}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-searchform .betterdocs-search-field, .${blockId}.betterdocs-search-form-wrapper .betterdocs-searchform .betterdocs-search-field{
            ${textTypoStylesTab}
        }


        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .betterdocs-searchform, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .betterdocs-searchform {
            ${textFieldBdShadowStyesTab}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .betterdocs-searchform:hover, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .betterdocs-searchform:hover  {
            ${textFieldBdShadowStylesHoverTab}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-searchform svg.docs-search-icon, .${blockId}.betterdocs-search-form-wrapper .betterdocs-searchform svg.docs-search-icon{
            ${searchIconSizeTab}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .docs-search-result, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .docs-search-result {
            ${resultBoxWidthTab}
            ${resultBoxMaxWidthTab}
            ${resultBoxBackgroundStylesTab}
            ${resultBoxBdShadowStyesTab}
       }

       .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .docs-search-result:hover, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .docs-search-result:hover {
            ${resultBoxBdShadowStylesHoverTab}
            ${resultBoxHoverBackgroundStylesTab}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .docs-search-result li, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .docs-search-result li {
            ${resultListBdShadowStyesTab}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .docs-search-result li:hover, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .docs-search-result li:hover {
            ${resultListBdShadowStylesHoverTab}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .docs-search-result li a, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .docs-search-result li a{
            ${resultListTypoStylesTab}
            ${reslutListPaddingTab}
       }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1{
            ${boxBackgroundStylesTab}
            ${boxPaddingTab}
            ${wrpMarginTab}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1:hover{
            ${boxHoverBackgroundStylesTab}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar .search-input-wrapper .search-input{
            ${textTypoStylesTab}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar {
            ${textPaddingTab}
            ${textFieldBdShadowStyesTab}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar:hover {
            ${textFieldBdShadowStylesHoverTab}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header {
            ${searchModalFieldBackgroundTab}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header:hover {
            ${searchModalFieldBackgroundHoverTab}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header .betterdocs-searchform-input-wrap .betterdocs-search-field {
            ${searchModalFieldTypoTab};
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header .betterdocs-select-option-wrapper .betterdocs-form-select .css-1jqq78o-placeholder{
            ${searchModalCaetgoryFieldTypoTab};
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-info-tab .betterdocs-tab-items span:not(.tab-icon){
            ${searchModalContentTabsTypoTab}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-info-tab .betterdocs-tab-items span svg{
            ${searchModalContentTabsIconSizeTab}
            height:auto;
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-info-tab .betterdocs-tab-items{
            ${searchModalContentTabsBorderTab}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-info-tab .betterdocs-tab-items:hover{
            ${searchModalContentTabsBorderHoverTab}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list .content-main h4{
            ${searchModalContentTabsListTypoTab}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list .content-main svg{
            ${searchModalContentTabsListIconSizeTab}
            height:auto;
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list{
            ${searchModalContentTabsListBorderTab}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list:hover{
            ${searchModalContentTabsListBorderHoverTab}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header .betterdocs-select-option-wrapper .css-19bb58m{
            ${searchModalContentTabsListCategoryTypoTab}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list .content-sub svg{
            ${searchModalContentTabsListCategoryIconSizeTab}
            height:auto;
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar .search-button{
            ${searchLayoutTwoButtonTypoTab}
            ${searchButtonLayoutTwoBackgroundColorTab}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar .search-button:hover{
            ${searchButtonLayoutTwoBackgroundColorHoverTab}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar .search-input-wrapper .search-icon,
		.${blockId} .betterdocs-search-modal-archive .betterdocs-live-search .betterdocs-searchform .betterdocs-searchform-input-wrap svg {
            width:auto;
            ${searchIconSizeTabLayout2}
        }

        ${(() => {
            const isAISearchEnabled = () => {
                try {
                    return (typeof window !== 'undefined' &&
                            window.betterDocsBlocksHelper &&
                            window.betterDocsBlocksHelper.AI_SEARCH_SUGGESTIONS_ENABLED === 1);
                } catch (error) {
                    return false;
                }
            };

            if (!isAISearchEnabled() || !enable_ai_powered_search) {
                return '';
            }

            return `
                .${blockId} .betterdocs-ai-suggestion {
                    ${aiSuggestionMarginTab}
                    ${aiSuggestionPaddingTab}
                }
                .${blockId} .betterdocs-ai-suggestion .ai-suggestion-prompt .ai-suggestion-text .ai-suggestion-label {
                    ${aiSuggestionTitleTypoTab}
                }
                .${blockId} .betterdocs-ai-suggestion .ai-suggestion-prompt .ai-suggestion-content .ai-suggestion-query {
                    ${aiSuggestionQueryTypoTab}
                }
                .${blockId} .betterdocs-ai-suggestion .ai-response .ai-response-content {
                    ${aiSuggestionResponseTypoTab}
                }
                .${blockId} .betterdocs-ai-suggestion .ai-response .ai-response-actions .continue-conversation-btn {
                    ${aiSuggestionButtonMarginTab}
                    ${aiSuggestionButtonPaddingTab}
                    ${aiSuggestionButtonTypoTab}
                }
            `;
        })()}

        /* SearchModal Layout 2 & 3 Width and Position - Tablet */
        .${blockId} {
            text-align: ${searchModalPosition};
        }
        .${blockId} .betterdocs-search-modal-archive,
        .${blockId} .betterdocs-search-modal-sidebar {
            width: ${searchModalWidth}${searchModalWidthUnit};
            display: inline-block;
            text-align: left;
        }
    `;
    const mobileStyles = `
        .${blockId}.betterdocs-searchbox-wrapper, .${blockId}.betterdocs-search-form-wrapper {
            ${boxBackgroundStylesMobile}
            ${wrpMarginMobile}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search {
            ${boxPaddingMobile}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search:hover, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search:hover {
            ${boxHoverBackgroundStylesMobile}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-searchform, .${blockId}.betterdocs-search-form-wrapper .betterdocs-searchform {
            ${textPaddingMobile}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-searchform .betterdocs-search-field, .${blockId}.betterdocs-search-form-wrapper .betterdocs-searchform .betterdocs-search-field{
            ${textTypoStylesMobile}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .betterdocs-searchform, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .betterdocs-searchform {
            ${textFieldBdShadowStyesMobile}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .betterdocs-searchform:hover, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .betterdocs-searchform:hover {
            ${textFieldBdShadowStylesHoverMobile}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-searchform svg.docs-search-icon,
		.${blockId}.betterdocs-search-form-wrapper .betterdocs-searchform svg.docs-search-icon,
		.${blockId} .betterdocs-search-modal-archive .betterdocs-live-search .betterdocs-searchform .betterdocs-searchform-input-wrap svg {
            ${searchIconSizeMobile}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .docs-search-result, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .docs-search-result {
            ${resultBoxWidthMobile}
            ${resultBoxMaxWidthMobile}
            ${resultBoxBackgroundStylesMobile}
            ${resultBoxBdShadowStyesMobile}
       }

       .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .docs-search-result:hover, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .docs-search-result:hover {
            ${resultBoxBdShadowStylesHoverMobile}
            ${resultBoxHoverBackgroundStylesMobile}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .docs-search-result li, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .docs-search-result li {
            ${resultListBdShadowStyesMobile}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .docs-search-result li:hover, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .docs-search-result li:hover {
            ${resultListBdShadowStylesHoverMobile}
        }

        .${blockId}.betterdocs-searchbox-wrapper .betterdocs-live-search .docs-search-result li a, .${blockId}.betterdocs-search-form-wrapper .betterdocs-live-search .docs-search-result li a {
            ${resultListTypoStylesMobile}
            ${reslutListPaddingMobile}
       }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1{
            ${boxBackgroundStylesMobile}
            ${boxPaddingMobile}
            ${wrpMarginMobile}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1:hover{
            ${boxHoverBackgroundStylesMobile}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar .search-input-wrapper .search-input{
            ${textTypoStylesMobile}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar {
            ${textPaddingMobile}
            ${textFieldBdShadowStyesMobile}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar:hover {
            ${textFieldBdShadowStylesHoverMobile}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header {
            ${searchModalFieldBackgroundMobile}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header:hover {
            ${searchModalFieldBackgroundHoverMobile}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header .betterdocs-searchform-input-wrap .betterdocs-search-field {
            ${searchModalFieldTypoMobile};
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header .betterdocs-select-option-wrapper .betterdocs-form-select .css-1jqq78o-placeholder{
            ${searchModalCategoryFieldTypoMobile};
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-info-tab .betterdocs-tab-items span:not(.tab-icon){
            ${searchModalContentTabsTypoMobile}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-info-tab .betterdocs-tab-items span svg{
            ${searchModalContentTabsIconSizeMobile}
            height:auto;
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-info-tab .betterdocs-tab-items{
            ${searchModalContentTabsBorderMobile}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-info-tab .betterdocs-tab-items:hover{
            ${searchModalContentTabsBorderHoverMobile}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list .content-main h4{
            ${searchModalContentTabsListTypoMobile}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list .content-main svg{
            ${searchModalContentTabsListIconSizeMobile}
            height:auto;
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list{
            ${searchModalContentTabsListBorderMobile}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list:hover{
            ${searchModalContentTabsListBorderHoverMobile}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header .betterdocs-select-option-wrapper .css-19bb58m{
            ${searchModalContentTabsListCategoryTypoMobile}
        }

        .${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list .content-sub svg{
            ${searchModalContentTabsListCategoryIconSizeMobile}
            height:auto;
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar .search-button{
            ${searchLayoutTwoButtonTypoMob}
            ${searchButtonLayoutTwoBackgroundColorMobile}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar .search-button:hover{
            ${searchButtonLayoutTwoBackgroundColorHoverMobile}
        }

        .${blockId} .betterdocs-search-modal-layout-1 .betterdocs-search-layout-1 .search-bar .search-input-wrapper .search-icon {
            width:auto;
            ${searchIconSizeMobileLayout2}
        }

        ${(() => {
            const isAISearchEnabled = () => {
                try {
                    return (typeof window !== 'undefined' &&
                            window.betterDocsBlocksHelper &&
                            window.betterDocsBlocksHelper.AI_SEARCH_SUGGESTIONS_ENABLED === 1);
                } catch (error) {
                    return false;
                }
            };

            if (!isAISearchEnabled() || !enable_ai_powered_search) {
                return '';
            }

            return `
                .${blockId} .betterdocs-ai-suggestion {
                    ${aiSuggestionMarginMobile}
                    ${aiSuggestionPaddingMobile}
                }
                .${blockId} .betterdocs-ai-suggestion .ai-suggestion-prompt .ai-suggestion-text .ai-suggestion-label {
                    ${aiSuggestionTitleTypoMobile}
                }
                .${blockId} .betterdocs-ai-suggestion .ai-suggestion-prompt .ai-suggestion-content .ai-suggestion-query {
                    ${aiSuggestionQueryTypoMobile}
                }
                .${blockId} .betterdocs-ai-suggestion .ai-response .ai-response-content {
                    ${aiSuggestionResponseTypoMobile}
                }
                .${blockId} .betterdocs-ai-suggestion .ai-response .ai-response-actions .continue-conversation-btn {
                    ${aiSuggestionButtonMarginMobile}
                    ${aiSuggestionButtonPaddingMobile}
                    ${aiSuggestionButtonTypoMobile}
                }
            `;
        })()}

        /* SearchModal Layout 2 & 3 Width and Position - Mobile */

        .${blockId} {
            text-align: ${searchModalPosition};
        }
        .${blockId} .betterdocs-search-modal-archive,
        .${blockId} .betterdocs-search-modal-sidebar {
            width: ${searchModalWidth}${searchModalWidthUnit};
            display: inline-block;
            text-align: left;
        }
    `;

    // all css styles for large screen width (desktop/laptop) in strings ⬇
    let desktopAllStyles = softMinifyCssStrings(`
              ${isCssExists(desktopStyles) ? desktopStyles : " "}
          `);

    // all css styles for Tab in strings ⬇
    let tabAllStyles = softMinifyCssStrings(`
              ${isCssExists(tabStyles) ? tabStyles : " "}
          `);

    // all css styles for Mobile in strings ⬇
    let mobileAllStyles = softMinifyCssStrings(`
              ${isCssExists(mobileStyles) ? mobileStyles : " "}
          `);

    let allStyles = {
        desktop: desktopAllStyles,
        tab: tabAllStyles,
        mobile: mobileAllStyles,
    };

    let filteredStyleObject = applyFilters("filterStyles", allStyles, [
        allStyles,
        attributes,
        blockId,
    ]);

    // Set All Style in "blockMeta" Attribute
    useEffect(() => {
        let styleObject = {
            ...filteredStyleObject,
        };
        if (JSON.stringify(blockMeta) != JSON.stringify(styleObject)) {
            setAttributes({ blockMeta: styleObject });
        }
    }, [attributes]);

    useEffect(() => {
        if( docQueryType == 'popular-docs' ) {
            setAttributes({ searchModalQueryTermIds: '', searchModalQueryDocIds:'' });
        }

        if( docQueryType == 'specific-doc-ids' ) {
            setAttributes({ searchModalQueryTermIds: '' });
        }

        if( docQueryType == 'specific-doc-term-ids' ){
            setAttributes({ searchModalQueryDocIds: '' });
        }

        if( faqQueryType == 'default' ) {
            setAttributes({searchModalQueriesFaqGroupIds: ''});
        }
    }, [docQueryType, faqQueryType]);

    const topRef = useRef(null);

    let { desktop, tab, mobile } = filteredStyleObject;

    // Generate dynamic className based on searchModalLayout
    const getSearchModalClassName = () => {
        switch(searchModalLayout) {
            case 'layout-1':
                return 'betterdocs-search-modal-layout-1';
            case 'docs-archive':
                return 'betterdocs-search-modal-archive';
            case 'sidebar':
                return 'betterdocs-search-modal-sidebar';
            default:
                return 'betterdocs-search-modal-layout-1';
        }
    };

    let searchLayout2Props = {className: getSearchModalClassName(), id: 'betterdocs-search-modal', 'data-popularsearch':popularSearchLayout2 == true ? true : null, 'data-categorysearch':categorySearchLayout2 == true ? true : null, 'data-numberofdocs':initialDocsNumber, 'data-numberoffaqs':initialFAQNumber};

    if( searchModalQueryDocIds?.length > 0 ) {
        searchLayout2Props['data-doc_ids'] = searchModalQueryDocIds;
    }

    if( searchModalQueryTermIds?.length > 0 ) {
        searchLayout2Props['data-doc_categories_ids'] = searchModalQueryTermIds;
    }

    if( searchModalQueriesFaqGroupIds?.length > 0 ) {
        searchLayout2Props['data-faq_categories_ids'] = searchModalQueriesFaqGroupIds;
    }

    // Add AI Search Suggestions data attribute - check both global AI enabled AND individual block setting
    const isAIEnabled = (() => {
        try {
            return typeof window.betterDocsBlocksHelper !== 'undefined' &&
                   (window.betterDocsBlocksHelper.AI_SEARCH_SUGGESTIONS_ENABLED == true ||
                    window.betterDocsBlocksHelper.AI_SEARCH_SUGGESTIONS_ENABLED === 1);
        } catch (error) {
            return false;
        }
    })();

    if( isAIEnabled && enable_ai_powered_search ) {
        searchLayout2Props['data-ai-suggestions'] = 'true';
        console.log('Gutenberg AI Suggestions Debug:', {
            isAIEnabled,
            enable_ai_powered_search,
            finalResult: 'enabled'
        });
    } else {
        console.log('Gutenberg AI Suggestions Debug:', {
            isAIEnabled,
            enable_ai_powered_search,
            finalResult: 'disabled'
        });
    }

    return (
        <>
            {isSelected && (
                <Inspector
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
            )}
            <div {...blockProps}>
                <style>
                    {`
                   ${desktop}

                   /* mimmikcssStart */

                   ${resOption === "Tablet" ? tab : " "}
                   ${resOption === "Mobile" ? tab + mobile : " "}

                   /* mimmikcssEnd */

                   @media all and (max-width: 1024px) {

                       /* tabcssStart */
                       ${softMinifyCssStrings(tab)}
                       /* tabcssEnd */

                   }

                   @media all and (max-width: 767px) {

                       /* mobcssStart */
                       ${softMinifyCssStrings(mobile)}
                       /* mobcssEnd */

                   }
                   `}
                </style>
                {searchLayout == 'layout-1' && <div className={`${blockId} betterdocs-searchbox-wrapper betterdocs-search-form-wrapper`}>
                    <div className={'betterdocs-live-search'}>
                        {(searchHeading || searchSubHeading) && (
                            <div className="betterdocs-search-heading">
                                {searchHeading && React.createElement(attributes.searchHeadingTag, { className: "heading" }, searchHeading)}
                                {searchSubHeading && React.createElement(attributes.searchSubHeadingTag, { className: "subheading" }, searchSubHeading)}
                            </div>
                        )}
                        <form className="betterdocs-searchform">
                            <svg
                                className="docs-search-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                width={38}
                                viewBox="0 0 50 50"
                            >
                                <path d="M21 3C11.602 3 4 10.602 4 20s7.602 17 17 17c3.355 0 6.46-.984 9.094-2.656l12.281 12.281 4.25-4.25L34.5 30.281C36.68 27.421 38 23.88 38 20c0-9.398-7.602-17-17-17zm0 4c7.2 0 13 5.8 13 13s-5.8 13-13 13S8 27.2 8 20 13.8 7 21 7z" />
                            </svg>
                            <input
                                type="text"
                                id="betterdocs-search-field"
                                className="betterdocs-search-field"
                                placeholder={
                                    placeholderText ? placeholderText : ""
                                }
                                autoComplete="off"
                                value=""
                                onChange={() => null}
                            />
                            {categorySearch &&
                                applyFilters("searchCategoryFilter", "")}
                            {searchButton &&
                                applyFilters("searchButtonFilter", "")}
                            <input
                                type="hidden"
                                value="Search"
                                className="betterdocs-search-submit"
                            />
                            <svg
                                className="docs-search-loader"
                                width={38}
                                height={38}
                                xmlns="http://www.w3.org/2000/svg"
                                stroke="#444b54"
                            >
                                <g
                                    transform="translate(1 1)"
                                    strokeWidth={2}
                                    fill="none"
                                    fillRule="evenodd"
                                >
                                    <circle
                                        strokeOpacity={0.5}
                                        cx={18}
                                        cy={18}
                                        r={18}
                                    />
                                    <path d="M36 18c0-9.94-8.06-18-18-18">
                                        <animateTransform
                                            attributeName="transform"
                                            type="rotate"
                                            from="0 18 18"
                                            to="360 18 18"
                                            dur="1s"
                                            repeatCount="indefinite"
                                        />
                                    </path>
                                </g>
                            </svg>
                            <svg
                                className="docs-search-close"
                                xmlns="http://www.w3.org/2000/svg"
                                width={38}
                                viewBox="0 0 128 128"
                            >
                                <path
                                    fill="#fff"
                                    d="M28.643 28.646a50 50 0 1070.712 70.709 50 50 0 10-70.712-70.71z"
                                />
                                <path
                                    className="close-border"
                                    d="M64 117c-14.2 0-27.5-5.5-37.5-15.5-20.7-20.7-20.7-54.3 0-75C36.5 16.5 49.8 11 64 11s27.5 5.5 37.5 15.5S117 49.8 117 64s-5.5 27.5-15.5 37.5S78.2 117 64 117zm0-100c-12.6 0-24.4 4.9-33.2 13.8-18.3 18.3-18.3 48.1 0 66.5C39.6 106.1 51.4 111 64 111c12.6 0 24.4-4.9 33.2-13.8S111 76.6 111 64s-4.9-24.4-13.8-33.2S76.6 17 64 17z"
                                />
                                <path
                                    className="close-line"
                                    d="M53.4 77.6c-.8 0-1.5-.3-2.1-.9-1.2-1.2-1.2-3.1 0-4.2l21.2-21.2c1.2-1.2 3.1-1.2 4.2 0 1.2 1.2 1.2 3.1 0 4.2L55.5 76.7c-.6.6-1.3.9-2.1.9z"
                                />
                                <path
                                    className="close-line"
                                    d="M74.6 77.6c-.8 0-1.5-.3-2.1-.9L51.3 55.5c-1.2-1.2-1.2-3.1 0-4.2 1.2-1.2 3.1-1.2 4.2 0l21.2 21.2c1.2 1.2 1.2 3.1 0 4.2-.6.6-1.3.9-2.1.9z"
                                />
                            </svg>
                        </form>
                        {popularSearch && applyFilters("popularSearchKeyword", "", [attributes])}
                    </div>
                </div>}
                {searchLayout == 'layout-2' &&
                    <div className={`${blockId}`}>
                        <div {...searchLayout2Props} ref={topRef}>
                            <SearchField
                                topWrapperRef={topRef}
                                searchButton={searchButtonLayout2}
                                heading={searchHeading}
                                subheading={searchSubHeading}
								headingTag={attributes.searchHeadingTag}
								subheadingTag={attributes.searchSubHeadingTag}
                                buttonText="Search"
                                placeholder={__(placeholderText, 'betterdocs')}
                                layout={
                                    searchModalLayout === 'layout-1' ? 'betterdocs-search-modal-layout-1' :
                                    searchModalLayout === 'docs-archive' ? 'betterdocs-search-modal-archive' :
                                    searchModalLayout === 'sidebar' ? 'betterdocs-search-modal-sidebar' :
                                    'betterdocs-search-modal-layout-1'
                                }
                            />
                        </div>
                    </div>
                }
            </div>
        </>
    );
};

export default edit;
