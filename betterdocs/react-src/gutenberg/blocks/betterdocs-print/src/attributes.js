import { __ } from "@wordpress/i18n";
import { generateDimensionsAttributes, generateBackgroundAttributes } from "../../../util/helpers";
import { PRINT_ICON_MARGIN, PRINT_ICON_MARGIN_LAYOUT_2, PRINT_ICON_PADDING, PRINT_ICON_PADDING_LAYOUT_2, BACKGROUND_LAYOUT_2 } from "./constants";

const attributes = {
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
    print_icon_alignment: {
        type: "string",
        default: "right",
    },
    ...generateDimensionsAttributes(PRINT_ICON_PADDING),
    ...generateDimensionsAttributes(PRINT_ICON_MARGIN),
    layout:{
        type:"string",
        default:"layout-1"
    },
    print_icon_alignment_layout_2: {
        type: "string",
        default: "right",
    },
    ...generateDimensionsAttributes(PRINT_ICON_PADDING_LAYOUT_2),
    ...generateDimensionsAttributes(PRINT_ICON_MARGIN_LAYOUT_2),
    ...generateBackgroundAttributes(BACKGROUND_LAYOUT_2, {
        defaultFillColor: '#F2F4F7',
        noOverlay: true,
    }),
};

export default attributes;
