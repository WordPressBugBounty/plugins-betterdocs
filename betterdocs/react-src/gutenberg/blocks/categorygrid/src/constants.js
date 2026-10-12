import { __ } from '@wordpress/i18n';
import { Dashicon } from '@wordpress/components';

export const ORDER_BY = [
  { label: __("Name", "betterdocs"), value: "name" },
  { label: __("Slug", "betterdocs"), value: "slug" },
  { label: __("Term Group", "betterdocs"), value: "term_group" },
  { label: __("ID", "betterdocs"), value: "id" },
  { label: __("Description", "betterdocs"), value: "description" },
  {
    label: __("BetterDocs Order", "betterdocs"),
    value: "doc_category_order",
  },
];

export const POSTS_ORDER_BY = [
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

export const ORDER = [
  { label: __("Ascending", "betterdocs"), value: "asc" },
  { label: __("Descending", "betterdocs"), value: "desc" },
];

export const LAYOUT = [
  { label: __("Default", "betterdocs"), value: "default" },
  { label: __("Layout 2", "betterdocs"), value: "layout-2" },
];

export const LAYOUT_MODE = [
  { label: __("Grid", "betterdocs"), value: "grid" },
  { label: __("Masonry", "betterdocs"), value: "masonry" },
];

export const HTML_TAGS = [
  { label: __("H1", "betterdocs"), value: "h1" },
  { label: __("H2", "betterdocs"), value: "h2" },
  { label: __("H3", "betterdocs"), value: "h3" },
  { label: __("H4", "betterdocs"), value: "h4" },
  { label: __("H5", "betterdocs"), value: "h5" },
  { label: __("H6", "betterdocs"), value: "h6" },
  { label: __("span", "betterdocs"), value: "span" },
  { label: __("p", "betterdocs"), value: "p" },
  { label: __("div", "betterdocs"), value: "div" },
];

export const BUTTON_POSITION = [
  {
    label: __(
      <Dashicon icon={"editor-alignleft"} title={__("Left", "betterdocs")} />
    ),
    value: "left",
  },
  {
    label: __(
      <Dashicon
        icon={"editor-aligncenter"}
        title={__("Center", "betterdocs")}
      />
    ),
    value: "center",
  },
  {
    label: __(
      <Dashicon icon={"editor-alignright"} title={__("Right", "betterdocs")} />
    ),
    value: "right",
  },
];

// responsive range controller
export const COLUMNS = "col";
export const GRID_SPACE = "gridSpace";
export const COUNT_SIZE = "countSize";
export const ICON_SIZE = "iconSize";
export const ICON_WIDTH = 'iconWidth';
export const ICON_HEIGHT = 'iconHeight';

// dimension control
export const GRID_MARGIN = "gridMargin";
export const GRID_PADDING = "gridPadding";
export const TITLE_MARGIN = "titleMargin";
export const TITLE_PADDING = "titlePadding";
export const TITLE_MARGIN_LAYOUT_2 = "titleMarginLayout2";
export const TITLE_PADDING_LAYOUT_2 = "titlePaddingLayout2";
export const LIST_MARGIN = "listMargin";
export const LIST_PADDING = "listPadding";
export const ICON_MARGIN = "iconMargin";
export const BTN_MARGIN = "btnMargin";
export const BTN_PADDING = "btnPadding";
export const WRAPPER_MARGIN = "wrpMargin";
export const CONTAINER_SECTION_MARGIN = 'containerSectionMargin'
export const CONTAINER_SECTION_PADDING = 'containerSectionPadding'

// background controls
export const GRID_BACKGROUND = "gridBack";
export const TITLE_BACKGROUND = "titleBack";
export const COUNT_BACKGROUND = "countBack";
export const COUNT_BACKGROUND_LAYOUT_2 = "countBackLayout2";
export const LIST_BACKGROUND = "listBack";
export const BTN_BACKGROUND = "btnBack";
export const CONTAINER_SECTION_BACKGROUND = 'containerSectionBackground';

// border shadow attriubtes
export const GRID_BORDER = "gridBrd";
export const TITLE_BORDER = "titleBrd";
export const COUNT_BORDER = "countBrd";
export const BTN_BORDER = "btnBrd";

export const COUNT_PADDING_LAYOUT_2 = 'countPaddingLayout2';
export const COUNT_MARGIN_LAYOUT_2 = 'countMarginLayout2';
