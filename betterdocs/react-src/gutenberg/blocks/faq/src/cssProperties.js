import * as FAQ from "./constants";
import * as FAQTypo from "./typographyPrefixConstants";
import { addProperty } from "../../../helpers/helper";

export default ({ blockId, faqLayout }) => {

    const containerSectionWrapper = `.${blockId}.betterdocs-faq-wrapper`;
    const innerWrapperSelector = `.${blockId} .betterdocs-category-grid-list-inner-wrapper`;
    const faqSectionTitle = `.${blockId}.betterdocs-faq-wrapper .betterdocs-faq-section-title`;
    const faqGroupTitle   = `.${blockId}.betterdocs-faq-wrapper .betterdocs-faq-inner-wrapper .betterdocs-faq-title .betterdocs-faq-title-tag`;
    const faqSectionTitleHover = `.${blockId}.betterdocs-faq-wrapper .betterdocs-faq-section-title:hover`;
    const faqTitle1   = `.${blockId}.betterdocs-faq-wrapper .betterdocs-faq-inner-wrapper .betterdocs-faq-list > li .betterdocs-faq-group .betterdocs-faq-post`;
    const facIcon   = `.${blockId}.betterdocs-faq-wrapper .betterdocs-faq-inner-wrapper .betterdocs-faq-list > li .betterdocs-faq-group .betterdocs-faq-post > svg, .${blockId}.betterdocs-faq-wrapper .betterdocs-faq-inner-wrapper .betterdocs-faq-list > li .betterdocs-faq-group .betterdocs-faq-post .betterdocs-faq-post-icon-group > svg`;
    const faqTitle   = `.${blockId}.betterdocs-faq-wrapper.betterdocs-shortcode .betterdocs-faq-inner-wrapper .betterdocs-faq-list > li .betterdocs-faq-group .betterdocs-faq-post .betterdocs-faq-post-name`;
    const faqList   = `.${blockId}.betterdocs-faq-wrapper.betterdocs-shortcode .betterdocs-faq-inner-wrapper .betterdocs-faq-list > li .betterdocs-faq-group`;
    const faqContent   = `.${blockId}.betterdocs-faq-wrapper.betterdocs-shortcode .betterdocs-faq-inner-wrapper .betterdocs-faq-list > li .betterdocs-faq-group .betterdocs-faq-main-content`;
    const faqIconTwo = `.${blockId}.betterdocs-faq-wrapper .betterdocs-faq-inner-wrapper .betterdocs-faq-list > li .betterdocs-faq-group .betterdocs-faq-post .betterdocs-faq-post-icon-group > svg path`;

	const faqGroupTitleLayout4 = `.${blockId}.betterdocs-faq-wrapper.betterdocs-faq-layout-4 .betterdocs-faq-inner-wrapper .betterdocs-faq-tab-wrapper .betterdocs-faq-tab .faq-tab-title`;
	const faqGroupTitleLayout4Two = `.${blockId}.betterdocs-faq-wrapper.betterdocs-faq-layout-4 .betterdocs-faq-inner-wrapper .betterdocs-faq-list-wrapper .betterdocs-faq-tab .faq-tab-title`;
	const faqGroupTitleLayout4Selector2 = `.${blockId}.betterdocs-faq-wrapper.betterdocs-faq-layout-4 .betterdocs-faq-inner-wrapper .betterdocs-faq-tab-wrapper .betterdocs-faq-tab`;
	const faqListLayout4 = `.${blockId}.betterdocs-faq-wrapper.betterdocs-faq-layout-4 .betterdocs-faq-inner-wrapper .betterdocs-faq-list-wrapper .betterdocs-faq-list-content .betterdocs-faq-list li .betterdocs-faq-group`;
	const faqListLayout4Selector2 = `.${blockId}.betterdocs-faq-wrapper.betterdocs-faq-layout-4 .betterdocs-faq-inner-wrapper .betterdocs-faq-list-wrapper .betterdocs-faq-list-content .betterdocs-faq-list li .betterdocs-faq-group .betterdocs-faq-post .betterdocs-faq-post-name`;
	const faqListContentLayout4 = `.${blockId}.betterdocs-faq-wrapper.betterdocs-faq-layout-4 .betterdocs-faq-inner-wrapper .betterdocs-faq-list-wrapper .betterdocs-faq-list-content .betterdocs-faq-list li .betterdocs-faq-group.active`;
	const faqListContentLayout4Selector2 = `.${blockId}.betterdocs-faq-wrapper.betterdocs-faq-layout-4 .betterdocs-faq-inner-wrapper .betterdocs-faq-list-wrapper .betterdocs-faq-list-content .betterdocs-faq-list li .betterdocs-faq-group .betterdocs-faq-main-content`;
	const faqListIconLayout4 = `.${blockId}.betterdocs-faq-wrapper.betterdocs-faq-layout-4 .betterdocs-faq-inner-wrapper .betterdocs-faq-list > li .betterdocs-faq-group .betterdocs-faq-post .betterdocs-faq-iconplus, .${blockId}.betterdocs-faq-wrapper.betterdocs-faq-layout-4 .betterdocs-faq-inner-wrapper .betterdocs-faq-list > li .betterdocs-faq-group .betterdocs-faq-post .betterdocs-faq-iconminus`;
	const faqListIconLayout4Selector2 = `.${blockId}.betterdocs-faq-wrapper.betterdocs-faq-layout-4 .betterdocs-faq-inner-wrapper .betterdocs-faq-list > li .betterdocs-faq-group .betterdocs-faq-post .betterdocs-faq-iconplus g path, .${blockId}.betterdocs-faq-wrapper.betterdocs-faq-layout-4 .betterdocs-faq-inner-wrapper .betterdocs-faq-list > li .betterdocs-faq-group .betterdocs-faq-post .betterdocs-faq-iconminus g path`;

    return [
        // addProperty('responsive', FAQ.COLUMNS, {
        //     defaultData: {
        //         desktop: 3,
        //         tab: 2,
        //         mobile: 1,
        //     },
        //     args: { property: '' },
        //     class: true,
        //     attr: true,
        //     attrPrefix: 'column',
        //     classPrefix: 'betterdocs-column-',
        //     filter: 'number',
        //     cssSelector: innerWrapperSelector
        // }),
        // addProperty('responsive', FAQ.FAQ_SPACE, {
        //     defaultData: {
        //         desktop: 10,
        //         tab: 10,
        //         mobile: 10,
        //     },

        //     args: { property: '' },
        //     attr: layoutMode !== 'handbook',
        //     filter: 'number',
        //     attrPrefix: 'column_space'
        // }),
        // addProperty('responsive', 'handbookSpaceMarginBottom', {
        //     defaultData: {
        //         desktop: 10,
        //         tab: 10,
        //         mobile: 10,
        //     },
        //     args: { property: "margin-bottom", controlName: FAQ.FAQ_SPACE, customUnit: 'px' },
        //     // filter: 'number',
        //     cssSelector: singleHandbookWrapperSelector,
        // }),


        addProperty('background', FAQ.CONTAINER_SECTION_BACKGROUND, {
            args: { noOverlay: true },
            cssSelector: containerSectionWrapper
        }),
        addProperty('dimension', FAQ.CONTAINER_SECTION_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: containerSectionWrapper
        }),
        addProperty('dimension', FAQ.CONTAINER_SECTION_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: containerSectionWrapper
        }),
        // FAQ SECTION TITLE
        addProperty('color', 'faqSectionTitleColor', {
            args: { hover: 'faqSectionTitleHoverColor' },
            cssSelector: faqSectionTitle
        }),

        addProperty('typography', faqLayout == 'layout-3' ? FAQTypo.typoPrefix_section_title_layout_3 : FAQTypo.typoPrefix_section_titele, {
            args: faqLayout == 'layout-3' ? {
                defaultFontSize: 24,
                prefixConstant: FAQTypo.typoPrefix_section_titele,
            } : {
                defaultFontSize: 30,
                prefixConstant: FAQTypo.typoPrefix_section_titele,
            },
            cssSelector: faqSectionTitle
        }),

        addProperty('dimension', FAQ.SECTION_TITLE_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: faqSectionTitle
        }),

        addProperty('dimension', FAQ.SECTION_TITLE_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: faqSectionTitle
        }),


        // GROUP TITLE
        addProperty('color', faqLayout == 'layout-4' ? 'faqGroupTitleLayout4Color' : 'faqGroupTitleColor', {
            args: { hover: faqLayout == 'layout-4' ?  'faqGroupTitleLayout4HoverColor' : 'faqGroupTitleHoverColor' },
            cssSelector: faqLayout == 'layout-4'  ? faqGroupTitleLayout4+', '+faqGroupTitleLayout4Two : faqGroupTitle
        }),

        addProperty('typography', ( faqLayout == 'layout-4' ? FAQTypo.typoPrefix_group_title_layout_4 : FAQTypo.typoPrefix_group_title ), {
            args: faqLayout == 'layout-4' ? {
				defaultFontSize: 18,
                prefixConstant: FAQTypo.typoPrefix_group_title_layout_4,
			} : {
                defaultFontSize: 25,
                prefixConstant: FAQTypo.typoPrefix_group_title,
            },
            cssSelector: faqLayout == 'layout-4' ? faqGroupTitleLayout4+', '+faqGroupTitleLayout4Two : faqGroupTitle
        }),

        addProperty('dimension', faqLayout == 'layout-4' ? FAQ.GROUP_TITLE_MARGIN_LAYOUT_4 : FAQ.GROUP_TITLE_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector:  faqLayout == 'layout-4'  ? faqGroupTitleLayout4Selector2 : faqGroupTitle
        }),

        addProperty('dimension', faqLayout == 'layout-4' ? FAQ.GROUP_TITLE_PADDING_LAYOUT_4 : FAQ.GROUP_TITLE_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: faqLayout == 'layout-4' ? faqGroupTitleLayout4Selector2 : faqGroupTitle
        }),


        // FAQ LIST
        addProperty('dimension', faqLayout == 'layout-4' ? FAQ.FAQ_LIST_PADDING_LAYOUT_4 : FAQ.FAQ_LIST_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: faqLayout == 'layout-4' ? faqListLayout4 : faqList
        }),
        addProperty('dimension', faqLayout == 'layout-4' ? FAQ.FAQ_LIST_MARGIN_LAYOUT_4 : FAQ.FAQ_LIST_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: faqLayout == 'layout-4' ? faqListLayout4 : faqList
        }),
        addProperty('border', faqLayout == 'layout-4' ? FAQ.FAQ_BORDER_LAYOUT_4 : FAQ.FAQ_BORDER, {
            cssSelector: faqLayout == 'layout-4' ? `${faqListLayout4}` : `${faqList}`
        }),
        addProperty('border', faqLayout == 'layout-4' ? FAQ.FAQ_CONTENT_BORDER_LAYOUT_4 : FAQ.FAQ_CONTENT_BORDER, {
            cssSelector: faqLayout == 'layout-4' ?  `${faqListContentLayout4}` : `${faqContent}`
        }),
        addProperty('background', faqLayout == 'layout-3' ? FAQ.FAQ_LIST_BACKGROUND_LAYOUT_3 : ( faqLayout == 'layout-4' ? FAQ.FAQ_LIST_BACKGROUND_LAYOUT_4 : FAQ.FAQ_LIST_BACKGROUND ), {
            args: { noOverlay: true },
            cssSelector: faqLayout == 'layout-4' ? faqListLayout4 : faqList
        }),
        addProperty('typography', faqLayout == 'layout-4' ? FAQTypo.typoPrefix_faq_title_layout_4 : FAQTypo.typoPrefix_faq_title, {
            args: faqLayout == 'layout-4' ? {
				defaultFontSize: 18,
                prefixConstant: FAQTypo.typoPrefix_faq_title_layout_4,
			}: {
                defaultFontSize: 17,
                prefixConstant: FAQTypo.typoPrefix_faq_title,
            },
            cssSelector: faqLayout == 'layout-4' ? faqListLayout4Selector2 : faqTitle
        }),
        addProperty('color', faqLayout == 'layout-4' ?  'faqListLayout4Color' : 'faqListColor', {
            cssSelector: faqLayout == 'layout-4'  ? faqListLayout4Selector2 : faqTitle
        }),
        // FAQ CONTENT
        addProperty('dimension', faqLayout == 'layout-4' ? FAQ.FAQ_CONTENT_PADDING_LAYOUT_4 : FAQ.FAQ_CONTENT_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: faqLayout == 'layout-4' ? faqListContentLayout4 : faqContent
        }),
        addProperty('dimension', faqLayout == 'layout-4'? FAQ.FAQ_CONTENT_MARGIN_LAYOUT_4 : FAQ.FAQ_CONTENT_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector:  faqLayout == 'layout-4' ? faqListContentLayout4 : faqContent
        }),

        addProperty('background', faqLayout == 'layout-4' ? FAQ.FAQ_CONTENT_BACKGROUND_LAYOUT_4: FAQ.FAQ_CONTENT_BACKGROUND, {
            args: { noOverlay: true },
            cssSelector: faqLayout == 'layout-4' ? faqListContentLayout4 : faqContent
        }),
        addProperty('typography', faqLayout == 'layout-4' ? FAQTypo.typoPrefix_faq_content_layout_4 : FAQTypo.typoPrefix_faq_content, {
            args: faqLayout == 'layout-4' ? {
				defaultFontSize: 16,
                prefixConstant: FAQTypo.typoPrefix_faq_content_layout_4,
			} :{
                defaultFontSize: 17,
                prefixConstant: FAQTypo.typoPrefix_faq_content,
            },
            cssSelector:  faqLayout == 'layout-4' ?  faqListContentLayout4Selector2 : `${faqContent} p, ${faqContent}`
        }),
        addProperty('color', faqContent == 'layout-4' ? 'faqContentLayout4Color' : 'faqContentColor', {
            args: { hover: 'faqContentColor' },
            cssSelector: faqContent == 'layout-4' ?  faqListContentLayout4Selector2 : `${faqContent} p, ${faqContent}`
        }),
        // addProperty('dimension', FAQ.TITLE_PADDING, {
        //     args: { styleFor: "padding" },
        //     cssSelector: titleSelector3
        // }),
        // addProperty('dimension', FAQ.TITLE_MARGIN, {
        //     args: { styleFor: "margin" },
        //     cssSelector: titleSelector2
        // }),
        // addProperty('background', FAQ.TITLE_BACKGROUND, {
        //     args: { noOverlay: true, noMainBgi: true },
        //     cssSelector: titleSelector2
        // }),
        // addProperty('border', FAQ.TITLE_BORDER, {
        //     args: { noShadow: true },
        //     cssSelector: titleSelector3
        // }),
        //  // DESCRIPTION
        //  addProperty('color', 'descriptionColor', {
        //     args: { hover: 'descriptionHoverColor' },
        //     cssSelector: descriptionSelector
        // }),

        // addProperty('typography', FAQTypo.typoPrefix_description, {
        //     args: {
        //         defaultFontSize: 18,
        //         prefixConstant: FAQTypo.typoPrefix_description,
        //     },
        //     cssSelector: descriptionSelector
        // }),
        // addProperty('dimension', FAQ.DESCRIPTION_PADDING, {
        //     args: { styleFor: "padding" },
        //     cssSelector: descriptionSelector
        // }),
        // addProperty('dimension', FAQ.DESCRIPTION_MARGIN, {
        //     args: { styleFor: "margin" },
        //     cssSelector: descriptionSelector
        // }),
        // addProperty('background', FAQ.DESCRIPTION_BACKGROUND, {
        //     args: { noOverlay: true, noMainBgi: true },
        //     cssSelector: descriptionSelector
        // }),
        // addProperty('border', FAQ.DESCRIPTION_BORDER, {
        //     args: { noShadow: true },
        //     cssSelector: descriptionSelector
        // }),

        // // Thumbail
        // addProperty('responsive', 'thumbnailSize', {
        //     args: { property: "max-width", controlName: FAQ.THUMBNAIL_SIZE },
        //     cssSelector: thumbnailSelector
        // }),


        // // Count
        // addProperty('typography', FAQTypo.typoPrefix_count, {
        //     args: {
        //         defaultFontSize: 15,
        //         prefixConstant: FAQTypo.typoPrefix_count,
        //     },
        //     cssSelector: countSelector2
        // }),
        // addProperty('responsive', 'countSizeHeight', {
        //     args: { property: "min-height", controlName: FAQ.COUNT_SIZE },
        //     cssSelector: countSelector2
        // }),
        // addProperty('responsive', 'countSizeWidth', {
        //     args: { property: "min-width", controlName: FAQ.COUNT_SIZE },
        //     cssSelector: countSelector2
        // }),
        // addProperty('color', 'countColor', {
        //     args: { hover: 'countHoverColor' },
        //     cssSelector: countSelector2
        // }),
        // addProperty('background', FAQ.COUNT_BACKGROUND, {
        //     args: { noOverlay: true, noMainBgi: true },
        //     cssSelector: countSelector1
        // }),
        // addProperty('border', FAQ.COUNT_BORDER, {
        //     args: { noShadow: true },
        //     cssSelector: countSelector1
        // }),

        // // Button

        addProperty(faqLayout == 'layout-4' ? 'stroke' : 'fill', faqLayout == 'layout-4' ? 'buttonColorLayout4' : 'buttonColor', {
            args: { hover: 'buttonHoverColor' },
            cssSelector: faqLayout == 'layout-4' ? faqListIconLayout4Selector2 : faqIconTwo
        }),

        // //Button Icon Position Missing
        // addProperty('alignment', 'buttonPosition', {
        //     args: { property: "text-align" },
        //     cssSelector:buttonSelector2
        // } ),

        // addProperty('typography', FAQTypo.typoPrefix_button, {
        //     args: {
        //         defaultFontSize: 16,
        //         prefixConstant: FAQTypo.typoPrefix_button,
        //     },
        //     cssSelector: buttonSelector
        // }),
        // addProperty('dimension', FAQ.BTN_PADDING, {
        //     args: { styleFor: "padding" },
        //     cssSelector: buttonSelector
        // }),
        // addProperty('dimension', FAQ.BTN_MARGIN, {
        //     args: { styleFor: "margin" },
        //     cssSelector: buttonSelector
        // }),
        // addProperty('background', FAQ.BTN_BACKGROUND, {
        //     args: { noOverlay: true, noMainBgi: true },
        //     cssSelector: buttonSelector
        // }),
        // addProperty('border', FAQ.BTN_BORDER, {
        //     args: { noShadow: true },
        //     cssSelector: buttonSelector
        // }),

        // // List
        // addProperty('typography', FAQTypo.typoPrefix_list, {
        //     args: {
        //         defaultFontSize: 15,
        //         prefixConstant: FAQTypo.typoPrefix_list,
        //     },
        //     cssSelector: docListSelector2
        // }),
        // addProperty('color', 'listColor', {
        //     args: { hover: 'listHoverColor' },
        //     cssSelector: docListSelector2
        // }),
        // addProperty('dimension', FAQ.LIST_PADDING, {
        //     args: { styleFor: "padding" },
        //     cssSelector: docListSelector1
        // }),
        // addProperty('dimension', FAQ.LIST_MARGIN, {
        //     args: { styleFor: "margin" },
        //     cssSelector: docListSelector1
        // }),
        // addProperty('background', FAQ.LIST_BACKGROUND, {
        //     args: { noOverlay: true, noMainBgi: true },
        //     cssSelector: docListSelector3
        // }),

        // // List Icon
        addProperty('responsive', FAQ.ICON_SIZE, {
            args: { property: "width" },
            cssSelector: faqLayout == 'layout-4' ? faqListIconLayout4 : facIcon
        }),

        addProperty('dimension', FAQ.ICON_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: faqLayout == 'layout-4' ? faqListIconLayout4 : facIcon
        }),

        // addProperty('color', 'iconColor', {
        //     cssSelector: docListSelector4
        // }),

        // // Wrapper Margin
        // addProperty('dimension', FAQ.WRAPPER_MARGIN, {
        //     args: { styleFor: "margin" },
        //     cssSelector: `.${blockId} .betterdocs-category-grid-list-inner-wrapper`
        // }),
    ]
}
