import { __ } from '@wordpress/i18n';

const {
	Dashicon
} = wp.components;

export const BREADCRUMB_TITLE_PADDING = 'breadcrumb_title_padding';
export const BREADCRUMB_TITLE_MARGIN = 'breadcrumb_title_margin';
export const BREADCRUMB_ICON_COLOR = 'breadcrumb_icon_color';
export const BREADCRUMB_ICON_MARGIN = 'breadcrumb_icon_margin';
export const BREADCRUMB_ICON_PADDING = 'breadcrumb_icon_padding';
export const BREADCRUMB_TEXT_ALIGN = [
	{ label: __(<Dashicon icon={"editor-alignleft"} />, "betterdocs"), value: "left" },
	{ label: __(<Dashicon icon={"editor-aligncenter"} />, "betterdocs"), value: "center" },
	{ label: __(<Dashicon icon={"editor-alignright"} />, "betterdocs"), value: "right" }
];

export const LAYOUT = [
    { label: __("Layout 1", "betterdocs"), value: "layout-1" },
    { label: __("Layout 2", "betterdocs"), value: "layout-2" },
];

export const BREADCRUMB_TITLE_PADDING_LAYOUT_TWO = 'breadcrumb_title_padding_layout_two';
export const BREADCRUMB_TITLE_MARGIN_LAYOUT_TWO = 'breadcrumb_title_margin_layout_two';
export const BREADCRUMB_ICON_COLOR_LAYOUT_TWO = 'breadcrumb_icon_color_layout_two';
export const BREADCRUMB_ICON_MARGIN_LAYOUT_TWO = 'breadcrumb_icon_margin_layout_two';
export const BREADCRUMB_ICON_PADDING_LAYOUT_TWO = 'breadcrumb_icon_padding_layout_two';
export const BREADCRUMB_TEXT_ALIGN_LAYOUT_TWO = [
	{ label: __(<Dashicon icon={"editor-alignleft"} />, "betterdocs"), value: "left" },
	{ label: __(<Dashicon icon={"editor-aligncenter"} />, "betterdocs"), value: "center" },
	{ label: __(<Dashicon icon={"editor-alignright"} />, "betterdocs"), value: "right" }
];
