import { __ } from "@wordpress/i18n";

// Dimension control constants
export const ARTICLE_SUMMARY_TITLE_MARGIN = "articleSummaryTitleMargin";
export const ARTICLE_SUMMARY_TITLE_PADDING = "articleSummaryTitlePadding";
export const ARTICLE_SUMMARY_CONTENT_MARGIN = "articleSummaryContentMargin";
export const ARTICLE_SUMMARY_CONTENT_PADDING = "articleSummaryContentPadding";
export const ARTICLE_SUMMARY_BOX_MARGIN = "articleSummaryBoxMargin";
export const ARTICLE_SUMMARY_BOX_PADDING = "articleSummaryBoxPadding";

// Text alignment options
export const ARTICLE_SUMMARY_TEXT_ALIGN = [
    { label: __("Left", "betterdocs"), value: "left" },
    { label: __("Center", "betterdocs"), value: "center" },
    { label: __("Right", "betterdocs"), value: "right" },
];
