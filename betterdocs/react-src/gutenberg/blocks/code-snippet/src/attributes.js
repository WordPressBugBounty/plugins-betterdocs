import { __ } from "@wordpress/i18n";

import {
    CODE_SNIPPET_WRAPPER_MARGIN,
    CODE_SNIPPET_WRAPPER_PADDING,
    CODE_SNIPPET_HEADER_PADDING,
    CODE_SNIPPET_LINE_NUMBERS_PADDING,
    CODE_SNIPPET_CODE_PADDING,
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
    codeContent: {
        type: "string",
        default: "",
    },
    language: {
        type: "string",
        default: "javascript",
    },
    // Additional languages for a multi-language snippet. Each item:
    // { language, codeContent, fileName }. Empty = single-language (default,
    // behaves exactly as before). When 1+ present, the header shows a
    // language dropdown to switch between the primary + these variants.
    codeVariants: {
        type: "array",
        default: [],
    },
    showCopyButton: {
        type: "boolean",
        default: true,
    },
    showHeader: {
        type: "boolean",
        default: true,
    },
    showLineNumbers: {
        type: "boolean",
        default: false,
    },
    theme: {
        type: "string",
        default: "light",
    },

    // File Preview Header attributes
    fileName: {
        type: "string",
        default: "filename.js",
    },
    showFileIcon: {
        type: "boolean",
        default: true,
    },
    fileIcon: {
        type: "string",
        default: "", // URL to custom icon
    },
    showTrafficLights: {
        type: "boolean",
        default: true,
    },

    // Typography attributes
    ...generateTypographyAttributes(Object.values(prefixes)),

    // Color attributes
    lineNumberColor: {
        type: "string",
        default: null,
    },
    lineNumberBgColor: {
        type: "string",
        default: null,
    },
    lineNumberBorderColor: {
        type: "string",
        default: null,
    },
    lineNumberBorderWidth: {
        type: "number",
        default: 1,
    },
    wrapperBackgroundColor: {
        type: "string",
        default: null,
    },
    wrapperBorderColor: {
        type: "string",
        default: null,
    },
    wrapperBorderWidth: {
        type: "number",
        default: 0,
    },
    wrapperBorderRadius: {
        type: "number",
        default: 0,
    },
    headerBackgroundColor: {
        type: "string",
        default: null,
    },
    headerBorderColor: {
        type: "string",
        default: null,
    },
    headerBorderWidth: {
        type: "number",
        default: 1,
    },
    fileNameColor: {
        type: "string",
        default: null,
    },
    copyButtonColor: {
        type: "string",
        default: null,
    },
    copyButtonBorderColor: {
        type: "string",
        default: null,
    },
    codeBackgroundColor: {
        type: "string",
        default: null,
    },

    // Dimension attributes with null defaults for responsive consistency
    ...generateDimensionsAttributes(CODE_SNIPPET_WRAPPER_MARGIN),
    ...generateDimensionsAttributes(CODE_SNIPPET_WRAPPER_PADDING),
    ...generateDimensionsAttributes(CODE_SNIPPET_HEADER_PADDING),
    ...generateDimensionsAttributes(CODE_SNIPPET_LINE_NUMBERS_PADDING),
    ...generateDimensionsAttributes(CODE_SNIPPET_CODE_PADDING),
};

export default attributes;
