import {
    CODE_SNIPPET_WRAPPER_MARGIN,
    CODE_SNIPPET_WRAPPER_PADDING,
    CODE_SNIPPET_HEADER_PADDING,
    CODE_SNIPPET_LINE_NUMBERS_PADDING,
    CODE_SNIPPET_CODE_PADDING,
} from '../../code-snippet/src/constants';

import {
    generateTypographyAttributes,
    generateDimensionsAttributes,
} from '../../../util/helpers';

import * as prefixes from '../../code-snippet/src/typographyPrefixConstants';

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

    // Content: one entry per HTTP status → a tab. { status, language, codeContent }.
    responses: {
        type: 'array',
        default: [
            { status: '200', language: 'json', codeContent: '{\n  "success": true\n}' },
        ],
    },

    showCopyButton: {
        type: 'boolean',
        default: true,
    },
    showHeader: {
        type: 'boolean',
        default: true,
    },
    showLineNumbers: {
        type: 'boolean',
        default: false,
    },
    theme: {
        type: 'string',
        default: 'light',
    },

    // Typography attributes (shared with Code Snippet)
    ...generateTypographyAttributes(Object.values(prefixes)),

    // Color / border attributes (reuse the Code Snippet style machinery)
    lineNumberColor: {
        type: 'string',
        default: null,
    },
    lineNumberBgColor: {
        type: 'string',
        default: null,
    },
    lineNumberBorderColor: {
        type: 'string',
        default: null,
    },
    lineNumberBorderWidth: {
        type: 'number',
        default: 1,
    },
    wrapperBackgroundColor: {
        type: 'string',
        default: null,
    },
    wrapperBorderColor: {
        type: 'string',
        default: null,
    },
    wrapperBorderWidth: {
        type: 'number',
        default: 0,
    },
    wrapperBorderRadius: {
        type: 'number',
        default: 0,
    },
    headerBackgroundColor: {
        type: 'string',
        default: null,
    },
    headerBorderColor: {
        type: 'string',
        default: null,
    },
    headerBorderWidth: {
        type: 'number',
        default: 1,
    },
    fileNameColor: {
        type: 'string',
        default: null,
    },
    copyButtonColor: {
        type: 'string',
        default: null,
    },
    copyButtonBorderColor: {
        type: 'string',
        default: null,
    },
    codeBackgroundColor: {
        type: 'string',
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
