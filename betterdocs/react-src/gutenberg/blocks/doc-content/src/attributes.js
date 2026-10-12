import { __ } from "@wordpress/i18n";
import {
    generateTypographyAttributes,
    generateDimensionsAttributes,
} from "../../../util/helpers";
import { DOC_CONTENT_PADDING, DOC_CONTENT_MARGIN } from "./constants";
import * as typoPrefixs from "./typographyPrefixConstants";

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
    ...generateTypographyAttributes(Object.values(typoPrefixs)),
    doc_content_color: {
        type: "string",
        default: "#4d4d4d",
    },
    ...generateDimensionsAttributes(DOC_CONTENT_PADDING),
    ...generateDimensionsAttributes(DOC_CONTENT_MARGIN),
};

export default attributes;
