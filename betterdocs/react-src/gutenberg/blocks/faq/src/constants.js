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
];

export const ORDER = [
  { label: __("Ascending", "betterdocs"), value: "asc" },
  { label: __("Descending", "betterdocs"), value: "desc" },
];

export const FAQ_LAYOUT = [
  { label: __("Modern", "betterdocs"), value: "layout-1" },
  { label: __("Classic", "betterdocs"), value: "layout-2" },
  { label: __("Abstract", "betterdocs"), value: "layout-3" },
  { label: __("Tab", "betterdocs"), value: "layout-4" },
];

export const getFaqTaxonomyOptions = () => {
  const options = [
    { label: __("General FAQ", "betterdocs"), value: "betterdocs_faq_category" },
  ];
  if (Boolean(betterDocsBlocksHelper.is_woocommerce_active)) {
    options.push({ label: __("Product FAQ", "betterdocs"), value: "betterdocs_product_faq_category" });
    options.push({ label: __("Product Assignments", "betterdocs"), value: "product_assignments" });
  }
  return options;
};

export const LAYOUT_MODE = [
  { label: __("Handbook", "betterdocs"), value: "faq" },
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
export const FAQ_SPACE = "faqSpace";
export const COUNT_SIZE = "countSize";
export const ICON_SIZE = "iconSize";
export const THUMBNAIL_SIZE = "thumbnailSize";

// dimension control
export const FAQ_LIST_MARGIN = "faqListMargin";
export const FAQ_LIST_MARGIN_LAYOUT_4 = "faqListMarginLayout4";
export const FAQ_LIST_PADDING = "faqListPadding";
export const FAQ_LIST_PADDING_LAYOUT_4 = "faqListPaddingLayout4";
export const FAQ_CONTENT_MARGIN = "faqContentMargin";
export const FAQ_CONTENT_MARGIN_LAYOUT_4 = "faqContentMarginLayout4";
export const FAQ_CONTENT_PADDING = "faqContentPadding";
export const FAQ_CONTENT_PADDING_LAYOUT_4 = "faqContentPaddingLayout4";
export const TITLE_MARGIN = "titleMargin";
export const DESCRIPTION_MARGIN = "descriptionMargin";
export const TITLE_PADDING = "titlePadding";
export const DESCRIPTION_PADDING = "descriptionPadding";
export const LIST_MARGIN = "listMargin";
export const LIST_PADDING = "listPadding";
export const ICON_MARGIN = "iconMargin";
export const BTN_MARGIN = "btnMargin";
export const BTN_PADDING = "btnPadding";
export const WRAPPER_MARGIN = "wrpMargin";
export const SECTION_TITLE_MARGIN = 'sectionTitleMargin';
export const SECTION_TITLE_PADDING = 'sectionTitlePadding';
export const GROUP_TITLE_MARGIN = 'groupTitleMargin';
export const GROUP_TITLE_MARGIN_LAYOUT_4 = 'groupTitleMarginLayout4';
export const GROUP_TITLE_PADDING = 'groupTitlePadding';
export const GROUP_TITLE_PADDING_LAYOUT_4 = 'groupTitlePaddingLayout4';
export const CONTAINER_SECTION_PADDING = 'containerSectionPadding';
export const CONTAINER_SECTION_MARGIN = 'containerSectionMargin';

// background controls
export const FAQ_LIST_BACKGROUND = "faqListBack";
export const FAQ_LIST_BACKGROUND_LAYOUT_4 = "faqListBackLayout4";
export const FAQ_CONTENT_BACKGROUND = "faqContentBack";
export const FAQ_CONTENT_BACKGROUND_LAYOUT_4 = "faqContentBackLayout4";
export const TITLE_BACKGROUND = "titleBack";
export const DESCRIPTION_BACKGROUND = "descriptionBack";
export const COUNT_BACKGROUND = "countBack";
export const LIST_BACKGROUND = "listBack";
export const BTN_BACKGROUND = "btnBack";
export const CONTAINER_SECTION_BACKGROUND = 'containerSectionBack';

// border shadow attriubtes
export const FAQ_BORDER = "faqBrd";
export const FAQ_BORDER_LAYOUT_4 = "faqBrdLayout4";
export const FAQ_CONTENT_BORDER = "faqContentBrd";
export const FAQ_CONTENT_BORDER_LAYOUT_4 = "faqContentBrdLayout4";
export const TITLE_BORDER = "titleBrd";
export const DESCRIPTION_BORDER = "descriptionBrd";
export const COUNT_BORDER = "countBrd";
export const BTN_BORDER = "btnBrd";

//layout 3 constants
export const FAQ_LIST_BACKGROUND_LAYOUT_3 = "faqListBackLayout3";
