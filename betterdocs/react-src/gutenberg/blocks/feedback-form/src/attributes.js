import { __ } from "@wordpress/i18n";
import {
    generateTypographyAttributes,
    generateDimensionsAttributes,
    generateResponsiveRangeAttributes,
} from "../../../util/helpers";
import {
    FORM_BUTTON_PADDING,
    ICON_SIZE,
    FORM_WIDTH,
    FORM_HEIGHT,
    FORM_BUTTON_WIDTH,
} from "./constants";
import * as typoPrefixs from "./typographyPrefixConstants";

const objAttributes = {
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
	feedbackFormNameLabelText:{
		type:"string",
		default:__('Name:', 'betterdocs')
	},
	feedbackFormEmailLabelText:{
		type:"string",
		default:__( 'Email:', 'betterdocs' )
	},
	feedbackFormMessageLabelText:{
		type:"string",
		default:__( 'Message:', 'betterdocs' )
	},
    formContent: {
        type: "string",
        default: __("Still stuck? How can we help?", 'betterdocs'),
    },
    formTitle: {
        type: "string",
        default: __("How can we help?", 'betterdocs'),
    },
    buttonText: {
        type: "string",
        default: "Submit",
    },
    formContentColor: {
        type: "string",
        default: "#566e8b",
    },
    iconColor: {
        type: "string",
        default: "00ffffff",
    },
    feedbackFormHeadingColor: {
        type: "string",
        default: "#000000",
    },
    feedbackFormHeadingAlignment: {
        type: "string",
        default: "left",
    },
    feedbackFormLabelColor: {
        type: "string",
        default: "#7e8da2",
    },
    feedbackFormButtonBackColor: {
        type: "string",
        default: "#528ffe",
    },
    feedbackFormButtonTextColor: {
        type: "string",
        default: "#fff",
    },
    feedbackFormButtonAlignment: {
        type: "string",
        default: "left",
    },
    ...generateTypographyAttributes(Object.values(typoPrefixs)),
    ...generateDimensionsAttributes(FORM_BUTTON_PADDING),
    ...generateResponsiveRangeAttributes(ICON_SIZE, {
        defaultRange: 26,
    }),
    ...generateResponsiveRangeAttributes(FORM_WIDTH, {
        defaultRange: 500,
    }),
    ...generateDimensionsAttributes(FORM_HEIGHT, {
        defaultRange: 1,
    }),
    ...generateDimensionsAttributes(FORM_BUTTON_WIDTH, {
        defaultRange: 1,
    }),
};
export default objAttributes;
