import { __ } from "@wordpress/i18n"

// responsive range controller
export const ICON_SIZE = 'iconSize'
export const RESULT_BOX_WIDTH = 'resultWidth'
export const RESULT_BOX_MAXWIDTH = 'resultMaxWidth'

// dimension control
export const BOX_PADDING = 'boxPadding'
export const FIELD_PADDING = 'fieldPadding'
export const ITEM_PADDING = 'itemPadding'
export const WRAPPER_MARGIN = 'wrpMargin'

// background controls
export const BOX_BACKGROUND = 'boxBack'
export const RESULT_BOX_BACKGROUND = 'resultBack'

// border shadow attriubtes
export const FIELD_BORDER = 'fieldBrd'
export const RESULT_BOX_BORDER = 'resultBrd'
export const ITEM_BORDER = 'itemBrd'

// advanced search button border
export const SEARCH_BUTTON_BORDER = 'searchButtonBrd';
export const SEARCH_BUTTON_PADDING = 'searchButtonPadding';
export const POPULAR_SEARCH_MARGIN = 'popularSearchMargin';
export const POPULAR_SEARCH_KEYWORD_BORDER = 'popularSearchKeywordBrd';

export const POPULAR_SEARCH_KEYWORD_PADDING = 'popularSearchKeywordPadding';
export const POPULAR_SEARCH_KEYWORD_MARGIN  = 'popularSearchKeywordMargin';

export const SEARCH_LAYOUT_VALUES = [
    { label: __("Classic Layout", "betterdocs"), value: "layout-1" },
    { label: __("Modal Layout", "betterdocs"), value: "layout-2" },
  ]

export const SEARCH_MODAL_LAYOUT_VALUES = [
    { label: __("Layout 1", "betterdocs"), value: "layout-1" },
    { label: __("Layout 2", "betterdocs"), value: "docs-archive" },
    { label: __("Layout 3", "betterdocs"), value: "sidebar" },
  ]

//Search Layout 2 Constants
export const BOX_BACKGROUND_LAYOUT_2 = 'boxBack_layout_2';
export const BOX_PADDING_LAYOUT_2    = 'boxPadding_layout_2';
export const FIELD_PADDING_LAYOUT_2 = 'fieldPadding_layout_2';
export const FIELD_BORDER_LAYOUT_2 = 'fieldBrd_layout_2';
export const ICON_SIZE_LAYOUT_2 = 'iconSize_layout_2';

//Search Layout 2 modal
export const SEARCH_MODAL_FIELD_BACKGROUND = 'search_modal_field_background';
export const SEARCH_MODAL_CONTENT_TABS_ICON_SIZE = 'search_moda_content_tabs_icon_size';
export const SEARCH_MODAL_CONTENT_TABS_BORDER  = 'search_modal_content_tabs_border';
export const SEARCH_MODAL_CONTENT_TABS_LIST_ICON_SIZE = 'search_modal_content_tabs_list_icon_size';
export const SEARCH_MODAL_CONTENT_TABS_LIST_BORDER = 'search_modal_content_tabs_list_border';
export const SEARCH_MODAL_CONTENT_TABS_LIST_CATEGORY_ICON_SIZE = 'search_modal_content_tabs_list_category_icon_size';
export const SEARCH_BUTTON_BACKGROUND_LAYOUT_2 = 'search_button_background_layout_2';

export const WRAPPER_MARGIN_LAYOUT_2 = 'wrpMarginLayout2';

// AI Search Suggestions constants
export const AI_SUGGESTION_MARGIN = 'aiSuggestionMargin';
export const AI_SUGGESTION_PADDING = 'aiSuggestionPadding';
export const AI_SUGGESTION_BUTTON_MARGIN = 'aiSuggestionButtonMargin';
export const AI_SUGGESTION_BUTTON_PADDING = 'aiSuggestionButtonPadding';

export const HTML_TAGS = [
    { label: __("H1", "betterdocs"), value: "h1" },
    { label: __("H2", "betterdocs"), value: "h2" },
    { label: __("H3", "betterdocs"), value: "h3" },
    { label: __("H4", "betterdocs"), value: "h4" },
    { label: __("H5", "betterdocs"), value: "h5" },
    { label: __("H6", "betterdocs"), value: "h6" },
    { label: __("P", "betterdocs"), value: "p" }
];
