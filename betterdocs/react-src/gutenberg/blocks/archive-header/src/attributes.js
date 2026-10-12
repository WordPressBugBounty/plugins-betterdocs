import { HEADER_ICON_SIZE, HEADER_BACKGROUND_COLOR, HEADER_MARGIN, HEADER_PADDING, HEADER_ICON_INNER_WIDTH, HEADER_ICON_INNER_HEIGHT } from "./constants";
import * as typoPrefixes from "./typographyPrefixConstants";
import { generateTypographyAttributes, generateDimensionsAttributes, generateResponsiveRangeAttributes,generateBackgroundAttributes } from "../../../util/helpers";

const attributes = {
    resOption: {
        type: "string",
        default: "Desktop",
    },
    blockId: {
        type: "string",
    },
    blockRoot: {
        type: "string",
        default: "better_docs",
    },
    blockMeta: {
        type: "object",
    },
    archiveHeaderTitleColor:{
        type:"string",
        default:"#1D2939"
    },
    archiveHeaderDocCountColor:{
        type:"string",
        default:"#475467"
    },
    ...generateTypographyAttributes(Object.values(typoPrefixes)),
    ...generateBackgroundAttributes(HEADER_BACKGROUND_COLOR, {
        defaultFillColor: '#F9FAFB',
        noOverlay: true,
    }),
    ...generateDimensionsAttributes(HEADER_MARGIN, {
        top: 0,
        right: 0,
        bottom: 36,
        left: 0,
        isLinked: false,
    }),
    ...generateDimensionsAttributes(HEADER_PADDING, {
        top: 20,
        right: 20,
        bottom: 40,
        left: 20,
        isLinked: false,
    }),
    ...generateResponsiveRangeAttributes(HEADER_ICON_SIZE, {
        defaultRange: 56,
    }),
    ...generateResponsiveRangeAttributes(HEADER_ICON_INNER_WIDTH, {
        defaultRange: 56,
    }),
    ...generateResponsiveRangeAttributes(HEADER_ICON_INNER_HEIGHT, {
        defaultRange: 56,
    }),
    titleTag:{
        type:"string",
        default:"h2"
    }
}
export default attributes;
