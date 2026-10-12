import { Dashicon } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export const ICON_SIZE = "icon_size";
export const FORM_WIDTH = "form_width";
export const FORM_HEIGHT = "form_height";
export const FORM_HEADING_ALIGN = [
    { label: __(<Dashicon icon={"editor-alignleft"} />), value: "left" },
    { label: __(<Dashicon icon={"editor-aligncenter"} />), value: "center" },
    { label: __(<Dashicon icon={"editor-alignright"} />), value: "right" },
];
export const FORM_BUTTON_WIDTH = "form_button_width";
export const FORM_BUTTON_PADDING = "form_button_padding";
export const FORM_BUTTON_ALIGN = [
    { label: __(<Dashicon icon={"editor-alignleft"} />), value: "left" },
    { label: __(<Dashicon icon={"editor-aligncenter"} />), value: "center" },
    { label: __(<Dashicon icon={"editor-alignright"} />), value: "right" },
];
