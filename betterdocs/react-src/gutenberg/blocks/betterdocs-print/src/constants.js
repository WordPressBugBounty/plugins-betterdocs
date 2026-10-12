import { Dashicon } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export const PRINT_ICON_PADDING = 'print_icon_padding';
export const PRINT_ICON_MARGIN = 'print_icon_margin';
export const PRINT_ICON_ALIGNMENT = [
	{ label: __(<Dashicon icon={"editor-alignleft"} />, "betterdocs"), value: "left" },
	{ label: __(<Dashicon icon={"editor-aligncenter"} />, "betterdocs"), value: "none" },
	{ label: __(<Dashicon icon={"editor-alignright"} />, "betterdocs"), value: "right" }
];

export const PRINT_ICON_ALIGNMENT_LAYOUT_2_VALUES = [
	{ label: __(<Dashicon icon={"editor-alignleft"} />, "betterdocs"), value: "left" },
	{ label: __(<Dashicon icon={"editor-aligncenter"} />, "betterdocs"), value: "center" },
	{ label: __(<Dashicon icon={"editor-alignright"} />, "betterdocs"), value: "right" }
];

export const LAYOUT = [
    { label: __("Layout 1", "betterdocs"), value: "layout-1" },
    { label: __("Layout 2", "betterdocs"), value: "layout-2" },
];

export const PRINT_ICON_PADDING_LAYOUT_2 = 'print_icon_padding_layout_2';
export const PRINT_ICON_MARGIN_LAYOUT_2 = 'print_icon_margin_layout_2';
export const PRINT_ICON_ALIGNMENT_LAYOUT_2 = [
	{ label: __(<Dashicon icon={"editor-alignleft"} />, "betterdocs"), value: "left" },
	{ label: __(<Dashicon icon={"editor-aligncenter"} />, "betterdocs"), value: "none" },
	{ label: __(<Dashicon icon={"editor-alignright"} />, "betterdocs"), value: "right" }
];
export const BACKGROUND_LAYOUT_2 = 'background_layout_2';
