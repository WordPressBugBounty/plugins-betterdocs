import { __ } from "@wordpress/i18n";
import { Dashicon } from "@wordpress/components";

export const ARCHIVE_DOC_ORDERBY = [
    { label: __("Doc ID", "betterdocs"), value: "id" },
	{ label: __("Doc Author", "betterdocs"), value: "author" },
	{ label: __("Title", "betterdocs"), value: "title" },
	{ label: __("Date", "betterdocs"), value: "date" },
	{ label: __("Last Modified Date", "betterdocs"), value: "modified" },
	{ label: __("Parent Id", "betterdocs"), value: "parent" },
	{ label: __("Random", "betterdocs"), value: "rand" },
	{ label: __("Comment Count", "betterdocs"), value: "comment_count" },
	{ label: __("Menu Order", "betterdocs"), value: "menu_order" },
	{ label: __("BetterDocs Order", "betterdocs"), value: "betterdocs_order" },
];

export let LAYOUT_OPTIONS = [
    {
        label: __("Layout 1", "betterdocs"),
        value: "layout-1",
    },
    {
        label: __("Layout 2", "betterdocs"),
        value: "layout-2",
    },
    {
        label: __("Layout 3", "betterdocs"),
        value: "layout-3",
    },
    {
        label: __("Layout 4", "betterdocs"),
        value: "layout-4",
    },
];

export const ARCHIVE_DOC_ORDER = [
    { label: __("Ascending", "betterdocs"), value: "asc" },
    { label: __("Descending", "betterdocs"), value: "desc" },
];

export const ARCHIVE_LIST_WRAPPER_BACKGROUND = "archive_list_wrapper_background";
export const ARCHIVE_LIST_WRAPPER_BACKGROUND_LAYOUT_2 = "archive_list_wrapper_background_layout_2";
export const ARCHIVE_LIST_WRAPPER_BACKGROUND_LAYOUT_3 = "archive_list_wrapper_background_layout_3";
export const ARCHIVE_LIST_WRAPPER_BACKGROUND_LAYOUT_4 = "archive_list_wrapper_background_layout_4";

export const ARCHIVE_ICON_WIDTH = "archive_icon_width";
export const ARCHIVE_ICON_HEIGHT = "archive_icon_height";

export const LIST_TWO_ICON_WIDTH = "list_two_icon_width";
export const LIST_TWO_ICON_HEIGHT = "list_two_icon_height";

export const LIST_THREE_ICON_WIDTH = "list_three_icon_width";
export const LIST_THREE_ICON_HEIGHT = "list_three_icon_height";
export const LAST_UPDATED_BACKGROUND_LAYOUT_THREE =
    "last_updated_background_layout_three";
export const LIST_ICON_BACKGROUND_LAYOUT_THREE =
    "list_icon_background_layout_three";

export const LIST_FOUR_ICON_WIDTH = "list_four_icon_width";
export const LIST_FOUR_ICON_HEIGHT = "list_four_icon_height";
export const LAST_UPDATED_BACKGROUND_LAYOUT_FOUR =
    "last_updated_background_layout_four";
export const LIST_ICON_BACKGROUND_LAYOUT_FOUR =
    "list_icon_background_layout_four";

export const LAYOUT_2_WRAPPER_MARGIN = 'layout_2_wrapper_margin';
export const LAYOUT_2_WRAPPER_PADDING = 'layout_2_wrapper_padding';

// Container Section Controls
export const CONTAINER_PADDING = 'container_padding';
export const CONTAINER_MARGIN = 'container_margin';

// Category List Controls
export const LIST_ITEM_SPACING = 'list_item_spacing';
export const LIST_AREA_PADDING = 'list_area_padding';
export const TITLE_MARGIN = 'title_margin';
export const TITLE_PADDING = 'title_padding';
export const EXCERPT_MARGIN = 'excerpt_margin';
export const EXCERPT_PADDING = 'excerpt_padding';
export const DATE_MARGIN = 'date_margin';
export const DATE_PADDING = 'date_padding';
export const PAGINATION_PADDING_1_3 = "pagination_padding_1_3";
export const PAGINATION_MARGIN_1_3 = "pagination_margin_1_3";
export const PAGINATION_ALIGNMENT = "pagination_alignment";
export const PAGINATION_HEIGHT_LAYOUT_1_3 = "pagination_height_layout_1_3";
export const PAGINATION_WIDTH_LAYOUT_1_3 = "pagination_width_layout_1_3";
export const PAGINATION_BACKGROUND_COLOR_LAYOUT_1 =
    "pagination_background_color_layout_1";
export const PAGINATION_BACKGROUND_COLOR_LAYOUT_3 =
    "pagination_background_color_layout_3";

export const ALIGNMENT_VALUES = [
    {
        label: __(
            <Dashicon
                icon={"editor-alignleft"}
                title={__("Left", "betterdocs")}
            />,
        ),
        value: "start",
    },
    {
        label: __(
            <Dashicon
                icon={"editor-aligncenter"}
                title={__("Center", "betterdocs")}
            />,
        ),
        value: "center",
    },
    {
        label: __(
            <Dashicon
                icon={"editor-alignright"}
                title={__("Right", "betterdocs")}
            />,
        ),
        value: "end",
    },
];
