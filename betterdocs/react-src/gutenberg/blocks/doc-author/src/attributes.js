import * as typoPrefixs from "./typographyPrefixConstants";
import { AUTHOR_BOX_WRAPPER_PADDING, AUTHOR_BOX_BACKGROUND, AUTHOR_BOX_SIZE, AUTHOR_BOX_WRAPPER_MARGIN, AUTHOR_BOX_BORDER } from "./constants";
import { generateResponsiveRangeAttributes, generateBackgroundAttributes,  generateTypographyAttributes, generateBorderShadowAttributes, generateDimensionsAttributes } from "../../../util/helpers";

const attributes = {
    // the following 4 attributes is must required for responsive options and asset generation for frontend
    // responsive control attributes ⬇
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
    docAuthorColor:{
        type: "string",
        default: "#667085",
    },
    updatedTimeColor:{
        type: "string",
        default: "#475467",
    },
    ...generateTypographyAttributes(Object.values(typoPrefixs)),
    ...generateResponsiveRangeAttributes(AUTHOR_BOX_SIZE, {
        defaultRange: 40,
    }),
    ...generateDimensionsAttributes(AUTHOR_BOX_WRAPPER_MARGIN),
    ...generateDimensionsAttributes(AUTHOR_BOX_WRAPPER_PADDING),
    ...generateBackgroundAttributes(AUTHOR_BOX_BACKGROUND, {
        defaultFillColor: '#ffffff',
        noOverlay: true,
    }),
    ...generateBorderShadowAttributes(AUTHOR_BOX_BORDER),

};

export default attributes;
