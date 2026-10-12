import { __ } from "@wordpress/i18n";

import {
    ARTICLE_SUMMARY_TITLE_MARGIN,
    ARTICLE_SUMMARY_TITLE_PADDING,
    ARTICLE_SUMMARY_CONTENT_MARGIN,
    ARTICLE_SUMMARY_CONTENT_PADDING,
    ARTICLE_SUMMARY_BOX_MARGIN,
    ARTICLE_SUMMARY_BOX_PADDING,
} from './constants';

import {
    generateTypographyAttributes,
    generateDimensionsAttributes,
} from '../../../util/helpers';

import * as prefixes from './typographyPrefixConstants';

const attributes = {
    // Required attributes for responsive options and asset generation
    resOption: {
        type: 'string',
        default: 'Desktop',
    },
    blockId: {
        type: 'string',
    },
    blockRoot: {
        type: 'string',
        default: 'better_docs',
    },
    blockMeta: {
        type: 'object',
    },

    // Content attributes
    customTitle: {
        type: "string",
        default: "",
    },
    showTitle: {
        type: "boolean",
        default: true,
    },

    // Typography attributes
    ...generateTypographyAttributes(Object.values(prefixes)),

    // Color attributes
    titleColor: {
        type: "string",
        default: "#2c3e50",
    },
	titleBGColor: {
        type: "string",
        default: "#f9fafb",
    },
    contentColor: {
        type: "string",
        default: "#555555",
    },
    loadingColor: {
        type: "string",
        default: "#666666",
    },
    iconColor: {
        type: "string",
        default: "#2c3e50",
    },
    backgroundColor: {
        type: "string",
        default: "#ffffff",
    },
    borderColor: {
        type: "string",
        default: "#e1e5e9",
    },

    // Border attributes
    borderWidth: {
        type: "number",
        default: 1,
    },
    borderRadius: {
        type: "number",
        default: 8,
    },

    // Icon size
    iconSize: {
        type: "number",
        default: 14,
    },

    // Dimension attributes
    ...generateDimensionsAttributes(ARTICLE_SUMMARY_TITLE_MARGIN),
    ...generateDimensionsAttributes(ARTICLE_SUMMARY_TITLE_PADDING),
    ...generateDimensionsAttributes(ARTICLE_SUMMARY_CONTENT_MARGIN),
    ...generateDimensionsAttributes(ARTICLE_SUMMARY_CONTENT_PADDING),
    ...generateDimensionsAttributes(ARTICLE_SUMMARY_BOX_MARGIN),
    ...generateDimensionsAttributes(ARTICLE_SUMMARY_BOX_PADDING),
};

export default attributes;
