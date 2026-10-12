import { __ } from "@wordpress/i18n";
import {
    generateTypographyAttributes,
    generateResponsiveRangeAttributes,
    generateDimensionsAttributes,
    generateBackgroundAttributes,
    generateBorderShadowAttributes,
} from "../../../util/helpers";

import {
    BOX_BACKGROUND,
    RESULT_BOX_WIDTH,
    RESULT_BOX_MAXWIDTH,
    RESULT_BOX_BORDER,
    ITEM_PADDING,
    BOX_PADDING,
    FIELD_PADDING,
    FIELD_BORDER,
    ITEM_BORDER,
    RESULT_BOX_BACKGROUND,
    ICON_SIZE,
    WRAPPER_MARGIN,
    SEARCH_BUTTON_BORDER,
    SEARCH_BUTTON_PADDING,
    POPULAR_SEARCH_MARGIN,
    POPULAR_SEARCH_KEYWORD_BORDER,
    POPULAR_SEARCH_KEYWORD_PADDING,
    POPULAR_SEARCH_KEYWORD_MARGIN,
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
import * as typoPrefixs from "./typographyPrefixConstants";

const attributes = {
    // the following 4 attributes is must required for responsive options and asset generation for frontend
    // responsive control attributes ⬇
    resOption: {
        type: "string",
        default: "Desktop",
    },
    searchLayout:{
        type:"string",
        default:"layout-1"
    },
    searchModalLayout:{
        type:"string",
        default:"layout-1"
    },
    searchModalWidth:{
        type:"number",
        default:100
    },
    searchModalWidthUnit:{
        type:"string",
        default:"%"
    },
    searchModalPosition:{
        type:"string",
        default:"left"
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
    placeholderText: {
        type: "string",
        default: __("Search", "betterdocs"),
    },
    fieldBackgroundColor: {
        type: "string",
        default: "#ffffff",
    },
    fieldBackgroundColorLayout2:{
        type: "string",
        default: "#FFFFFF",
    },
    searchModalMagnifierColor:{
        type:'string',
        default:'rgb(152, 162, 179)'
    },
    searchModalFieldColor:{
        type:'string',
        default:'#200505'
    },
    searchModalFieldPlaceholderColor:{
        type:'string',
        default:'#475479'
    },
    searchModalCategoryColor:{
        type:'string',
        default:'rgb(128, 128, 128)'
    },
    searchModalContentTabsListColor:{
        type:'string',
        default:'#1D2939'
    },
    searchModalContentTabsListCategoryColor:{
        type:'string',
        default:'#475467'
    },
    categoryTextColor:{
        type: "string",
        default: "#595959",
    },
    searchButtonTextColor:{
        type: "string",
        default: "#ffffff",
    },
    searchButtonBackgroundColor:{
        type: "string",
        default: "#24cc8f",
    },
    searchButtonBackgroundColorHover:{
        type: "string",
        default: "#24cc8f",
    },
    fieldTextColor: {
        type: "string",
        default: "#595959",
    },
    fieldTextColorLayout2:{
        type:"string",
        default:'#667085'
    },
    searchIconColor: {
        type: "string",
        default: "#444b54",
    },
    searchIconColorLayout2: {
        type: "string",
        default: "rgb(152, 162, 179)",
    },
    closeIconColor: {
        type: "string",
        default: "#ff697b",
    },
    closeBorderColor: {
        type: "string",
        default: "#444b54",
    },
    itemColor: {
        type: "string",
        default: "#444b54",
    },
    itemHoverColor: {
        type: "string",
    },
    searchButtonLayout2Color:{
        type:"string",
        default:"#fff"
    },
    // typography attributes
    ...generateTypographyAttributes(Object.values(typoPrefixs)),
    // responsive range
    ...generateResponsiveRangeAttributes(ICON_SIZE, {
        defaultRange: 30,
    }),
    ...generateResponsiveRangeAttributes(ICON_SIZE_LAYOUT_2, {
        defaultRange: null,
    }),
    ...generateResponsiveRangeAttributes(RESULT_BOX_WIDTH, {
        defaultRange: 100,
        defaultUnit: "%",
    }),
    ...generateResponsiveRangeAttributes(RESULT_BOX_MAXWIDTH, {
        defaultRange: 1600,
    }),
    // dimension
    ...generateDimensionsAttributes(ITEM_PADDING, {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
        isLinked: true,
    }),
    ...generateDimensionsAttributes(FIELD_PADDING, {
        top: 22,
        right: 15,
        bottom: 22,
        left: 15,
        isLinked: false,
    }),
    ...generateDimensionsAttributes(FIELD_PADDING_LAYOUT_2, {
        top: 12,
        right: 12,
        bottom: 12,
        left: 20,
        isLinked: false,
    }),
    ...generateDimensionsAttributes(WRAPPER_MARGIN, {
        top: 28,
        right: 0,
        bottom: 28,
        left: 0,
        isLinked: false,
    }),
    ...generateDimensionsAttributes(WRAPPER_MARGIN_LAYOUT_2, {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        isLinked: false,
    }),
    ...generateDimensionsAttributes(BOX_PADDING, {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        isLinked: true,
    }),
    ...generateDimensionsAttributes(BOX_PADDING_LAYOUT_2, {
        top: 50,
        right: 0,
        bottom: 50,
        left: 0,
        isLinked: true,
    }),
    ...generateDimensionsAttributes(SEARCH_BUTTON_PADDING, {
        top: 15,
        right: 25,
        bottom: 15,
        left: 25,
        isLinked: false,
    }),
    ...generateDimensionsAttributes(POPULAR_SEARCH_MARGIN, {
        top: 24,
        right: 0,
        bottom: 0,
        left: 0,
        isLinked: false,
    }),
    // background
    ...generateBackgroundAttributes(BOX_BACKGROUND, {
        defaultFillColor: "#f7f7f7",
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(SEARCH_MODAL_FIELD_BACKGROUND, {
        defaultFillColor: "#F9FAFB",
        noOverlay: true,
    }),
    ...generateResponsiveRangeAttributes(SEARCH_MODAL_CONTENT_TABS_ICON_SIZE, {
        defaultRange: 21,
    }),
    ...generateBorderShadowAttributes(SEARCH_MODAL_CONTENT_TABS_BORDER, { noShadow: true }),
    ...generateResponsiveRangeAttributes(SEARCH_MODAL_CONTENT_TABS_LIST_ICON_SIZE, {
        defaultRange: 21,
    }),
    ...generateBorderShadowAttributes(SEARCH_MODAL_CONTENT_TABS_LIST_BORDER, { noShadow: true }),
    ...generateResponsiveRangeAttributes(SEARCH_MODAL_CONTENT_TABS_LIST_CATEGORY_ICON_SIZE, {
        defaultRange: 17,
    }),
    ...generateBackgroundAttributes(BOX_BACKGROUND_LAYOUT_2, {
        defaultFillColor: "#F9FAFB",
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(RESULT_BOX_BACKGROUND, {
        defaultFillColor: "#ffffff",
        noOverlay: true,
    }),
    // border shadow attriubtes
    ...generateBorderShadowAttributes(RESULT_BOX_BORDER, { noShadow: true }),
    ...generateBorderShadowAttributes(ITEM_BORDER, { noShadow: true }),
    ...generateBorderShadowAttributes(FIELD_BORDER, { noShadow: true }),
    ...generateBorderShadowAttributes(FIELD_BORDER_LAYOUT_2, { noShadow: true }),
    ...generateBorderShadowAttributes(SEARCH_BUTTON_BORDER, {noShadow: true, noBdrHover:true}),
    ...generateBorderShadowAttributes(POPULAR_SEARCH_KEYWORD_BORDER, {noShadow: true, noBdrHover:true}),
    ...generateDimensionsAttributes(POPULAR_SEARCH_KEYWORD_PADDING, {
        top: 8,
        right: 25,
        bottom: 8,
        left: 25,
        isLinked: false,
    }),
    ...generateBackgroundAttributes(SEARCH_BUTTON_BACKGROUND_LAYOUT_2, {
        defaultFillColor: "#667085",
        noOverlay: true,
    }),
    ...generateDimensionsAttributes(POPULAR_SEARCH_KEYWORD_MARGIN, {
        top: '',
        right: '',
        bottom: '',
        left: '',
        isLinked: false,
    }),
    categorySearch: {
        type:'boolean',
        default:false
    },
    searchButton:{
        type:'boolean',
        default:false
    },
    popularSearch:{
        type:'boolean',
        default:false
    },
    popularSearchText:{
        type: "string",
        default: "Popular Search",
    },
    popularTitleColor:{
        type: "string",
        default: "#8588a6",
    },
    popularKeywordBackgroundColor:{
        type: "string",
        default: "#fff",
    },
    popularKeywordTextColor:{
        type: "string",
        default: "#99a3ca",
    },
    initialDocsNumber: {
        type: 'number',
        default: 5,
    },
    initialFAQNumber:{
        type: 'number',
        default: 5,
    },
    searchButtonLayout2:{
        type:'boolean',
        default:true
    },
    categorySearchLayout2:{
        type:'boolean',
        default:false
    },
    popularSearchLayout2:{
        type:'boolean',
        default:false
    },
    searchHeading:{
        type:'string',
        default:''
    },
    searchSubHeading:{
        type:'string',
        default:''
    },
    searchHeadingTag:{
        type:'string',
        default:'h1'
    },
    searchSubHeadingTag:{
        type:'string',
        default:'p'
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
    },

    // AI Search Suggestions attributes
    enable_ai_powered_search: {
        type: 'boolean',
        default: false,
    },
    ai_suggestion_background_color: {
        type: 'string',
        default: '',
    },
    ai_suggestion_hover_background_color: {
        type: 'string',
        default: '',
    },
    ...generateDimensionsAttributes(AI_SUGGESTION_MARGIN),
    ...generateDimensionsAttributes(AI_SUGGESTION_PADDING),
    ai_suggestion_title_color: {
        type: 'string',
        default: '',
    },
    ai_suggestion_title_font_size: {
        type: 'number',
        default: null,
    },
    ai_suggestion_query_color: {
        type: 'string',
        default: '',
    },
    ai_suggestion_query_font_size: {
        type: 'number',
        default: null,
    },
    ai_suggestion_response_color: {
        type: 'string',
        default: '',
    },
    ai_suggestion_response_font_size: {
        type: 'number',
        default: null,
    },
    ai_suggestion_button_color: {
        type: 'string',
        default: '',
    },
    ai_suggestion_button_bg_color: {
        type: 'string',
        default: '',
    },
    ai_suggestion_button_font_size: {
        type: 'number',
        default: null,
    },
    ...generateDimensionsAttributes(AI_SUGGESTION_BUTTON_PADDING),
    ...generateDimensionsAttributes(AI_SUGGESTION_BUTTON_MARGIN),
};

export default attributes;
