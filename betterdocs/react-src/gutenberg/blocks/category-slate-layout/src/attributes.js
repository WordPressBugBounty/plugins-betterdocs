import { __ } from '@wordpress/i18n';
import {
    generateTypographyAttributes,
    generateResponsiveRangeAttributes,
    generateDimensionsAttributes,
    generateBackgroundAttributes,
    generateBorderShadowAttributes,
} from '../../../util/helpers'

import {
    CONTAINER_MARGIN,
    CONTAINER_PADDING,
    CONTAINER_BACKGROUND,
    GRID_COLUMNS,
    GRID_SPACE,
    GRID_MARGIN,
    GRID_PADDING,
    GRID_BACKGROUND,
    GRID_BORDER,
    TITLE_MARGIN,
    TITLE_PADDING,
    TITLE_BACKGROUND,
    TITLE_BORDER,
    LIST_MARGIN,
    LIST_PADDING,
    LIST_BACKGROUND,
    LIST_BORDER,
} from './constants'
import * as typoPrefixs from './typographyPrefixConstants'

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

    // Content Options
    selectKB: {
        type: 'string',
        default: '',
    },
    includeCategories: {
        type: 'string',
        default: '',
    },
    excludeCategories: {
        type: 'string',
    },
    gridPerPage: {
        type: 'number',
        default: 9,
    },
    offset: {
        type: 'number',
        default: 0,
    },
    orderBy: {
        type: 'string',
        default: 'doc_category_order',
    },
    order: {
        type: 'string',
        default: 'asc',
    },

    // Grid List Docs Options
    postsPerPage: {
        type: 'number',
        default: 5,
    },
    postsOrderBy: {
        type: 'string',
        default: 'betterdocs_order',
    },
    postsOrder: {
        type: 'string',
        default: 'asc',
    },

    // Layout Options
    layout: {
        type: 'string',
        default: 'layout-3',
    },
    showIcon: {
        type: 'boolean',
        default: true,
    },
    categoryIcon: {
        type: 'string',
        default: 'folder',
    },
    showTitle: {
        type: 'boolean',
        default: true,
    },
    titleTag: {
        type: 'string',
        default: 'h2',
    },

    categoryTitleLink: {
        type: 'boolean',
        default: true,
    },

    // Colors
    titleColor: {
        type: 'string',
        default: '',
    },
    titleHoverColor: {
        type: 'string',
        default: '',
    },
    listColor: {
        type: 'string',
        default: '',
    },
    listHoverColor: {
        type: 'string',
        default: '',
    },

    // Background Colors (for backward compatibility)
    containerBgColor: {
        type: 'string',
        default: '',
    },
    gridBgColor: {
        type: 'string',
        default: '',
    },

    // Typography attributes
    ...generateTypographyAttributes(Object.values(typoPrefixs)),

    // Responsive range attributes
    ...generateResponsiveRangeAttributes(GRID_COLUMNS, {
        defaultRange: 3,
        noUnits: true,
    }),
    ...generateResponsiveRangeAttributes(GRID_SPACE, {
        defaultRange: 48,
        noUnits: true,
    }),

    // Dimension attributes
    ...generateDimensionsAttributes(CONTAINER_MARGIN),
    ...generateDimensionsAttributes(CONTAINER_PADDING),
    ...generateDimensionsAttributes(GRID_PADDING),
    ...generateDimensionsAttributes(GRID_MARGIN),
    ...generateDimensionsAttributes(TITLE_MARGIN),
    ...generateDimensionsAttributes(TITLE_PADDING),
    ...generateDimensionsAttributes(LIST_MARGIN),
    ...generateDimensionsAttributes(LIST_PADDING),


    // Background attributes
    ...generateBackgroundAttributes(CONTAINER_BACKGROUND, {
        defaultFillColor: '',
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(GRID_BACKGROUND, {
        defaultFillColor: '',
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(TITLE_BACKGROUND, {
        defaultFillColor: '',
        noOverlay: true,
        noMainBgi: true,
    }),
    ...generateBackgroundAttributes(LIST_BACKGROUND, {
        defaultFillColor: '',
        noOverlay: true,
        noMainBgi: true,
    }),

    // Border shadow attributes
    ...generateBorderShadowAttributes(GRID_BORDER),
    ...generateBorderShadowAttributes(TITLE_BORDER),
    ...generateBorderShadowAttributes(LIST_BORDER),
}

export default attributes
