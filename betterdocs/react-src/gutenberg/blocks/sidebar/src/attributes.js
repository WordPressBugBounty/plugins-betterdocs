import { __ } from "@wordpress/i18n";

import {
    generateDimensionsAttributes,
    generateResponsiveRangeAttributes,
    generateBackgroundAttributes,
    generateBorderShadowAttributes,
    generateTypographyAttributes,
} from "../../../util/helpers";
import {
    BOX_PADDING_LAYOUT_1,
    BOX_MARGIN_LAYOUT_1,
    BOX_HEIGHT_LAYOUT_1,
    BOX_WIDTH_LAYOUT_1,
    BOX_TITLE_BACKGROUND_LAYOUT_1,
    BOX_TITLE_BACKGROUND,
    BOX_SHADOW_LAYOUT_1,
    BOX_IMG_SIZE_LAYOUT_1,
    BOX_TITLE_PADDING_LAYOUT_1,
    BOX_TITLE_MARGIN_LAYOUT_1,
    BOX_TITLE_BORDER_LAYOUT_1,
    BOX_COUNT_BORDER_LAYOUT_1,
    BOX_COUNT_BACKGROUND_LAYOUT_1,
    BOX_COUNT_BACKGROUND_LAYOUT_6,
    BOX_DOC_LIST_PADDING_LAYOUT_1,
    BOX_DOC_LIST_MARGIN_LAYOUT_1,
    BOX_DOC_LIST_ICON_SIZE_LAYOUT_1,
    BOX_DOC_LIST_ICON_SPACING_LAYOUT_1,
    BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_1,
    BOX_ACTIVE_TITLE_BACKGROUND,
    BOX_COUNT_BORDER_LAYOUT_6,
    BOX_COUNT_ACTIVE_BACKGROUND_COLOR_LAYOUT_6,
    BOX_ACTIVE_TITLE_BORDER_WIDTH_LAYOUT_6,
    BOX_ACTIVE_LIST_BORDER_WIDTH_LAYOUT_6,
    CONTAINER_PADDING,
    CONTAINER_MARGIN,
    CONTAINER_BACKGROUND,
    CONTAINER_HEIGHT,
    CONTAINER_WIDTH,
    STICKY_TOC_WIDTH,
    BOX_PADDING_LAYOUT_7,
    BOX_MARGIN_LAYOUT_7,
    BOX_HEIGHT_LAYOUT_7,
    BOX_WIDTH_LAYOUT_7,
    BOX_IMG_SIZE_LAYOUT_7,
    BOX_TITLE_BACKGROUND_LAYOUT_7,
    BOX_SHADOW_LAYOUT_7,
    BOX_TITLE_PADDING_LAYOUT_7,
    BOX_TITLE_MARGIN_LAYOUT_7,
    BOX_TITLE_BORDER_LAYOUT_7,
    BOX_DOC_LIST_PADDING_LAYOUT_7,
    BOX_DOC_LIST_MARGIN_LAYOUT_7,
    BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_7,
    BOX_TITLE_BACKGROUND_7,
    TITLE_BACKGROUND_LAYOUT_8,
    BOX_COUNT_BORDER_LAYOUT_7,
    BOX_COUNT_BACKGROUND_LAYOUT_7,
    SIDEBAR_SEARCH_BACKGROUND_LAYOUT_7,
    SIDEBAR_SEARCH_MAGNIFIER_SEARCH_LAYOUT_7_HEIGHT,
    SIDEBAR_SEARCH_MAGNIFIER_SEARCH_LAYOUT_7_WIDTH,
    SEARCH_MODAL_FIELD_BACKGROUND,
    SEARCH_MODAL_CONTENT_TABS_ICON_SIZE_HEIGHT,
    SEARCH_MODAL_CONTENT_TABS_BORDER,
    SEARCH_MODAL_CONTENT_TABS_LIST_ICON_SIZE,
    SEARCH_MODAL_CONTENT_TABS_LIST_BORDER,
    SEARCH_MODAL_CONTENT_TABS_LIST_CATEGORY_ICON_SIZE,
    SIDEBAR_SEARCH_IMAGE_SIZE_WIDTH_LAYOUT_7,
    SIDEBAR_SEARCH_IMAGE_SIZE_HEIGHT_LAYOUT_7,
    BOX_IMG_SIZE_LAYOUT_7_HEIGHT,
    BOX_DOC_LIST_ICON_SIZE_LAYOUT_7,
    SEARCH_MODAL_CONTENT_TABS_ICON_SIZE_WIDTH,
    BOX_PADDING_LAYOUT_8,
    BOX_MARGIN_LAYOUT_8,
    BOX_WIDTH_LAYOUT_8,
    BOX_IMG_SIZE_LAYOUT_8,
    BOX_TITLE_BACKGROUND_LAYOUT_8,
    BOX_SHADOW_LAYOUT_8,
    BOX_TITLE_PADDING_LAYOUT_8,
    BOX_TITLE_MARGIN_LAYOUT_8,
    BOX_DOC_LIST_PADDING_LAYOUT_8,
    BOX_DOC_LIST_MARGIN_LAYOUT_8,
    BOX_DOC_LIST_ICON_SIZE_LAYOUT_8,
    BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_8,
    BOX_COUNT_BACKGROUND_LAYOUT_8,
    TITLE_ARROW_ICON_SIZE_LAYOUT_2,
    TITLE_ARROW_ICON_SIZE_LAYOUT_3,
    TITLE_ARROW_ICON_SIZE_LAYOUT_8,
    DOC_SUB_LIST_ARROW_ICON_SIZE,
	BOX_DOC_LIST_BACKGROUND_COLOR
} from "./constants";

import * as prefixes from "./typographyPrefixConstants";

const attributes = {
    // the following 4 attributes is must required for responsive options and asset generation for frontend
    // responsive control attributes ⬇
    resOption: {
        type: "string",
        default: "Desktop",
    },
    // blockId attribute for making unique className and other uniqueness ⬇
    blockId: {
        type: "string",
    },
    blockRoot: {
        type: "string",
        default: "better_docs",
    },
    // blockMeta is for keeping all the styles ⬇
    blockMeta: {
        type: "object",
    },
    sidebar_layout: {
        type: "string",
        default: "layout-1",
    },
    titleTag: {
        type: "string",
        default: "h1",
    },
    ...generateBackgroundAttributes(BOX_ACTIVE_TITLE_BACKGROUND, {
        defaultFillColor: "#5a94ff1a",
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(BOX_TITLE_BACKGROUND, {
        defaultFillColor: "",
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(BOX_TITLE_BACKGROUND_7, {
        defaultFillColor: "",
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(TITLE_BACKGROUND_LAYOUT_8, {
        defaultFillColor: "",
        noOverlay: true,
    }),
    selectKB: {
        type: 'string',
        default: null,
    },
    includeCategories: {
        type: "string",
        default: null,
    },
    excludeCategories: {
        type: "string",
        default: null,
    },
    terms_per_page: {
        type: "integer",
        default: 10,
    },
    terms_order: {
        type: "string",
        default: "asc",
    },
    terms_orderby: {
        type: "string",
        default: "doc_category_order",
    },
    postsPerPage: {
        type: "integer",
        default: 10,
    },
    postsOrderBy: {
        type: "string",
        default: "title",
    },
    postsOrder: {
        type: "string",
        default: "asc",
    },
    enableNestedSubcategory: {
        type: "boolean",
        default: false,
    },
    enableLazyLoad: {
        type: "boolean",
        default: false,
    },
    initialDocsQueryNumber:{
        type:"integer",
        default:5
    },
    initialFAQQueryNumber:{
        type:"integer",
        default:5
    },
	...generateBackgroundAttributes(BOX_DOC_LIST_BACKGROUND_COLOR),
    ...generateDimensionsAttributes(CONTAINER_PADDING),
    ...generateDimensionsAttributes(CONTAINER_MARGIN),
    ...generateBackgroundAttributes(CONTAINER_BACKGROUND, {
        defaultFillColor: "#fff",
        noOverlay: true,
    }),
    // ...generateResponsiveRangeAttributes(CONTAINER_HEIGHT),
    ...generateResponsiveRangeAttributes(CONTAINER_WIDTH, {
        defaultRange:100,
        defaultUnit:'%'
    }),
    enableStickyTOC:{
        type: "boolean",
        default: false,
    },
    stickyTOCZIndex:{
        type:"integer",
        default:320
    },
    listIcon: {
        type: 'string',
        default: '',
    },
    ...generateResponsiveRangeAttributes(STICKY_TOC_WIDTH),
    ...generateDimensionsAttributes(BOX_PADDING_LAYOUT_1),
    ...generateDimensionsAttributes(BOX_MARGIN_LAYOUT_1),
    ...generateDimensionsAttributes(BOX_PADDING_LAYOUT_7),
    ...generateDimensionsAttributes(BOX_MARGIN_LAYOUT_7),
    ...generateDimensionsAttributes(BOX_HEIGHT_LAYOUT_7),
    // ...generateResponsiveRangeAttributes(BOX_HEIGHT_LAYOUT_1),
    ...generateResponsiveRangeAttributes(BOX_WIDTH_LAYOUT_1),
    ...generateResponsiveRangeAttributes(BOX_WIDTH_LAYOUT_7),
    ...generateBackgroundAttributes(BOX_COUNT_ACTIVE_BACKGROUND_COLOR_LAYOUT_6, {
        defaultFillColor: "#591fff",
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(BOX_TITLE_BACKGROUND_LAYOUT_1),
    ...generateBackgroundAttributes(BOX_TITLE_BACKGROUND_LAYOUT_7),
    ...generateBorderShadowAttributes(BOX_SHADOW_LAYOUT_1),
    ...generateBorderShadowAttributes(BOX_SHADOW_LAYOUT_7),
    ...generateBackgroundAttributes(BOX_COUNT_BACKGROUND_LAYOUT_1, {
        defaultFillColor: "#528ffe",
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(BOX_COUNT_BACKGROUND_LAYOUT_7, {
        defaultFillColor: "#F2F4F7",
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(BOX_COUNT_BACKGROUND_LAYOUT_6, {
        defaultFillColor:"#fff",
        noOverlay:true
    }),
    ...generateResponsiveRangeAttributes(BOX_IMG_SIZE_LAYOUT_1, {
        defaultRange: 24,
    }),
    ...generateResponsiveRangeAttributes(BOX_IMG_SIZE_LAYOUT_7, {
        defaultRange: 16,
    }),
    ...generateResponsiveRangeAttributes(BOX_IMG_SIZE_LAYOUT_7_HEIGHT, {
        defaultRange: 16,
    }),
    ...generateResponsiveRangeAttributes(SIDEBAR_SEARCH_IMAGE_SIZE_WIDTH_LAYOUT_7, {
        defaultRange: 20,
    }),
    ...generateResponsiveRangeAttributes(SIDEBAR_SEARCH_IMAGE_SIZE_HEIGHT_LAYOUT_7, {
        defaultRange: 20,
    }),
    box_title_color_layout_1: {
        type: "string",
        default: "#3f5876",
    },
    box_title_color_layout_7: {
        type: "string",
        default: "#344054",
    },
    ...generateTypographyAttributes(Object.values(prefixes)),
    ...generateDimensionsAttributes(BOX_TITLE_PADDING_LAYOUT_1),
    ...generateDimensionsAttributes(BOX_TITLE_PADDING_LAYOUT_7),
    ...generateDimensionsAttributes(BOX_TITLE_MARGIN_LAYOUT_1),
    ...generateDimensionsAttributes(BOX_TITLE_MARGIN_LAYOUT_7),
    box_title_active_border_color_layout_1: {
        type: "string",
        default: "#528fff",
    },
    ...generateBorderShadowAttributes(BOX_TITLE_BORDER_LAYOUT_1, {
        noShadow: true,
    }),
    ...generateBorderShadowAttributes(BOX_TITLE_BORDER_LAYOUT_7, {
        noShadow: true,
    }),
    ...generateBorderShadowAttributes(BOX_COUNT_BORDER_LAYOUT_6, {
        noShadow: true,
    }),
    ...generateBorderShadowAttributes(BOX_COUNT_BORDER_LAYOUT_7, {
        noShadow: true,
    }),
    ...generateBorderShadowAttributes(BOX_ACTIVE_TITLE_BORDER_WIDTH_LAYOUT_6, {
        noShadow: true,
        noShdowHover:true,
        noBdrHover:true
    }),
    ...generateBorderShadowAttributes(BOX_ACTIVE_LIST_BORDER_WIDTH_LAYOUT_6, {
        noShadow: true,
        noShdowHover:true,
        noBdrHover:true
    }),
    box_layout_1_count_color: {
        type: "string",
        default: "#fff",
    },
    box_layout_6_count_color:{
        type: "string",
        default: "#2b11e5",
    },
    box_layout_7_count_color:{
        type: "string",
        default: "#344054",
    },
    box_layout_6_count_active_color:{
        type: "string",
        default: "#fefeff",
    },
    ...generateBorderShadowAttributes(BOX_COUNT_BORDER_LAYOUT_1),
    box_doc_List_color_layout_1: {
        type: "string",
        default: "#566e8b",
    },
    box_doc_List_color_layout_7: {
        type: "string",
        default: "#667085",
    },
    box_doc_List_hover_color_layout_1: {
        type: "string",
        default: "#566e8b",
    },
    box_doc_List_hover_color_layout_7: {
        type: "string",
        default: "#667085",
    },
    ...generateDimensionsAttributes(BOX_DOC_LIST_PADDING_LAYOUT_1),
    ...generateDimensionsAttributes(BOX_DOC_LIST_PADDING_LAYOUT_7),
    ...generateDimensionsAttributes(BOX_DOC_LIST_MARGIN_LAYOUT_1),
    ...generateDimensionsAttributes(BOX_DOC_LIST_MARGIN_LAYOUT_7),
    box_doc_List_icon_color_layout_1: {
        type: "string",
        default: "#566e8b",
    },
    ...generateResponsiveRangeAttributes(BOX_DOC_LIST_ICON_SIZE_LAYOUT_1),
    ...generateResponsiveRangeAttributes(BOX_DOC_LIST_ICON_SIZE_LAYOUT_7),
    ...generateDimensionsAttributes(BOX_DOC_LIST_ICON_SPACING_LAYOUT_1),
    box_doc_sub_List_title_color_layout_1: {
        type: "string",
        default: "#566e8b",
    },
    box_doc_sub_List_title_color_layout_7: {
        type: "string",
        default: "#344054",
    },
    box_doc_sub_List_title_hover_color_layout_1: {
        type: "string",
        default: "#566e8b",
    },
    box_doc_sub_List_title_hover_color_layout_7: {
        type: "string",
        default: "#344054",
    },
    box_doc_sub_List_color_layout_1: {
        type: "string",
        default: "#566e8b",
    },
    box_doc_sub_List_color_layout_7: {
        type: "string",
        default: "#667085",
    },
    box_doc_sub_List_hover_color_layout_1: {
        type: "string",
        default: "#566e8b",
    },
    box_doc_sub_List_hover_color_layout_7: {
        type: "string",
        default: "667085",
    },
    ...generateResponsiveRangeAttributes(BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_1),
    ...generateResponsiveRangeAttributes(BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_7),
    showDocIcon:{
        type:"boolean",
        default:true
    },
    sidebar_search_layout_7_placeholder_color: {
        type: "string",
        default: "#98A2B3",
    },
    listIconImageUrl:{
        type:'string',
        default:''
    },
    sidebarSearchModalMagnifierColor:{
        type:'string',
        default:'rgb(152, 162, 179)'
    },
    sidebarSearchModalFieldColor:{
        type:'string',
        default:'#200505'
    },
    sidebarSearchModalFieldPlaceholderColor:{
        type:'string',
        default:'#475479'
    },
    sidebarSearchModalCategoryColor:{
        type:'string',
        default:'rgb(128, 128, 128)'
    },
    sidebarSearchModalContentTabsListColor:{
        type:'string',
        default:'#1D2939'
    },
    sidebarSearchModalContentTabsListCategoryColor:{
        type:'string',
        default:'#475467'
    },
    ...generateBackgroundAttributes(SEARCH_MODAL_FIELD_BACKGROUND, {
        defaultFillColor: "#F9FAFB",
        noOverlay: true,
    }),
    ...generateResponsiveRangeAttributes(SEARCH_MODAL_CONTENT_TABS_ICON_SIZE_HEIGHT, {
        defaultRange: 20,
    }),
    ...generateResponsiveRangeAttributes(SEARCH_MODAL_CONTENT_TABS_ICON_SIZE_WIDTH, {
        defaultRange: 20,
    }),
    ...generateResponsiveRangeAttributes(SEARCH_MODAL_CONTENT_TABS_LIST_ICON_SIZE, {
        defaultRange: 20,
    }),
    ...generateResponsiveRangeAttributes(SEARCH_MODAL_CONTENT_TABS_LIST_CATEGORY_ICON_SIZE, {
        defaultRange: 16,
    }),
    ...generateBorderShadowAttributes(SEARCH_MODAL_CONTENT_TABS_LIST_BORDER),
    ...generateBorderShadowAttributes(SEARCH_MODAL_CONTENT_TABS_BORDER),
    ...generateBackgroundAttributes(SIDEBAR_SEARCH_BACKGROUND_LAYOUT_7, {
        defaultFillColor: "#F9FAFB",
        noOverlay: true,
    }),
    ...generateResponsiveRangeAttributes(SIDEBAR_SEARCH_MAGNIFIER_SEARCH_LAYOUT_7_HEIGHT, {
        defaultRange: 28,
    }),
    ...generateResponsiveRangeAttributes(SIDEBAR_SEARCH_MAGNIFIER_SEARCH_LAYOUT_7_WIDTH, {
        defaultRange: 28,
    }),

    // Layout 8 (Slate Layout) Attributes
    ...generateDimensionsAttributes(BOX_PADDING_LAYOUT_8),
    ...generateDimensionsAttributes(BOX_MARGIN_LAYOUT_8),
    ...generateResponsiveRangeAttributes(BOX_WIDTH_LAYOUT_8),
    ...generateResponsiveRangeAttributes(BOX_IMG_SIZE_LAYOUT_8, {
        defaultRange: 24,
    }),
    ...generateBackgroundAttributes(BOX_TITLE_BACKGROUND_LAYOUT_8),
    ...generateBorderShadowAttributes(BOX_SHADOW_LAYOUT_8),
    ...generateDimensionsAttributes(BOX_TITLE_PADDING_LAYOUT_8),
    ...generateDimensionsAttributes(BOX_TITLE_MARGIN_LAYOUT_8),
    ...generateBackgroundAttributes(BOX_COUNT_BACKGROUND_LAYOUT_8, {
        defaultFillColor: "#528ffe",
        noOverlay: true,
    }),
    box_title_color_layout_8: {
        type: "string",
        default: "#3f5876",
    },
    box_layout_8_count_color: {
        type: "string",
        default: "#566e8b",
    },
    box_doc_List_color_layout_8: {
        type: "string",
        default: "#566e8b",
    },
    box_doc_List_hover_color_layout_8: {
        type: "string",
        default: "#566e8b",
    },
    ...generateDimensionsAttributes(BOX_DOC_LIST_PADDING_LAYOUT_8),
    ...generateDimensionsAttributes(BOX_DOC_LIST_MARGIN_LAYOUT_8),
    ...generateResponsiveRangeAttributes(BOX_DOC_LIST_ICON_SIZE_LAYOUT_8),
    box_doc_sub_List_title_color_layout_8: {
        type: "string",
        default: "",
    },
    box_doc_sub_List_title_hover_color_layout_8: {
        type: "string",
        default: "",
    },
    box_doc_sub_List_color_layout_8: {
        type: "string",
        default: "",
    },
    box_doc_sub_List_hover_color_layout_8: {
        type: "string",
        default: "",
    },
    box_doc_List_hover_bg_color_layout_8: {
        type: "string",
        default: "",
    },
    ...generateResponsiveRangeAttributes(BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_8),

    // Arrow Attributes for layouts 2, 3, and 8
    ...generateResponsiveRangeAttributes(TITLE_ARROW_ICON_SIZE_LAYOUT_2, {
        defaultRange: 16,
    }),
    title_arrow_color_layout_2: {
        type: "string",
        default: "#566e8b",
    },
    title_arrow_hover_color_layout_2: {
        type: "string",
        default: "#566e8b",
    },
    ...generateResponsiveRangeAttributes(TITLE_ARROW_ICON_SIZE_LAYOUT_3, {
        defaultRange: 16,
    }),
    title_arrow_color_layout_3: {
        type: "string",
        default: "#566e8b",
    },
    title_arrow_hover_color_layout_3: {
        type: "string",
        default: "#566e8b",
    },
    ...generateResponsiveRangeAttributes(TITLE_ARROW_ICON_SIZE_LAYOUT_8, {
        defaultRange: 16,
    }),
    title_arrow_color_layout_8: {
        type: "string",
        default: "#566e8b",
    },
    title_arrow_hover_color_layout_8: {
        type: "string",
        default: "#566e8b",
    },

    // Doc Sub List Arrow Attributes
    ...generateResponsiveRangeAttributes(DOC_SUB_LIST_ARROW_ICON_SIZE),
    doc_sub_list_arrow_color: {
        type: "string",
        default: "",
    },
    doc_sub_list_arrow_hover_color: {
        type: "string",
        default: "",
    },

    docQueryType:{
        type:'string',
        default:'popular-docs'
    },
    faqQueryType:{
        type:'string',
        default:'default'
    },
    searchModalQueryTermIds:{
        type:'string',
        default:''
    },
    searchModalQueryDocIds:{
        type:'string',
        default:''
    },
    searchModalQueriesFaqGroupIds:{
        type:'string',
        default:''
    }
};

export default attributes;
