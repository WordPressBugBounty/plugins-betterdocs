import { __ } from '@wordpress/i18n';
import {
    generateTypographyAttributes,
    generateResponsiveRangeAttributes,
    generateDimensionsAttributes,
    generateBackgroundAttributes,
    generateBorderShadowAttributes,
} from '../../../util/helpers'

import {
    GRID_BACKGROUND,
    GRID_BORDER,
    GRID_MARGIN,
    GRID_PADDING,
    TITLE_MARGIN,
    TITLE_PADDING,
    TITLE_BACKGROUND,
    TITLE_BORDER,
    COLUMNS,
    GRID_SPACE,
    COUNT_SIZE,
    COUNT_BACKGROUND,
    COUNT_BORDER,
    LIST_MARGIN,
    LIST_PADDING,
    LIST_BACKGROUND,
    ICON_SIZE,
    ICON_MARGIN,
    BTN_MARGIN,
    BTN_PADDING,
    BTN_BACKGROUND,
    BTN_BORDER,
    WRAPPER_MARGIN,
    CONTAINER_SECTION_MARGIN,
    CONTAINER_SECTION_PADDING,
    CONTAINER_SECTION_BACKGROUND,
    ICON_HEIGHT,
    ICON_WIDTH,
    COUNT_BACKGROUND_LAYOUT_2,
    COUNT_PADDING_LAYOUT_2,
    COUNT_MARGIN_LAYOUT_2,
    TITLE_PADDING_LAYOUT_2,
    TITLE_MARGIN_LAYOUT_2
} from './constants'
import * as typoPrefixs from './typographyPrefixConstants'

const attributes = {
    // the following 4 attributes is must required for responsive options and asset generation for frontend
    // responsive control attributes ⬇
    resOption: {
        type: 'string',
        default: 'Desktop',
    },
    // blockId attribute for making unique className and other uniqueness ⬇
    blockId: {
        type: 'string',
    },
    blockRoot: {
        type: 'string',
        default: 'better_docs',
    },
    // blockMeta is for keeping all the styles ⬇
    blockMeta: {
        type: 'object',
    },
    selectKB: {
        type: 'string',
        default: null,
    },
    includeCategories: {
        type: 'string',
        default: null,
    },
    excludeCategories: {
        type: 'string',
    },
    gridPerPage: {
        type: 'number',
        default: 9,
    },
    orderBy: {
        type: 'string',
        default: 'doc_category_order',
    },
    order: {
        type: 'string',
        default: 'asc',
    },
    listIconImageUrl: {
        type: 'string',
        default: '',
    },
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
    enableNestedSubcategory: {
        type: 'boolean',
        default: false,
    },
    enableLazyLoad: {
        type: 'boolean',
        default: false,
    },
    postPerSubcategory: {
        type: 'number',
        default: 3,
    },
    subCategoryPerGrid:{
        type: 'number',
        default: 2,
    },
    layout: {
        type: 'string',
        default: 'default',
    },
    layoutMode: {
        type: 'string',
        default: 'grid',
    },
    showIcon: {
        type: 'boolean',
        default: true,
    },
    showTitle: {
        type: 'boolean',
        default: true,
    },
    titleTag: {
        type: 'string',
        default: 'h2',
    },
    showHeader: {
        type: 'boolean',
        default: true,
    },
    showCount: {
        type: 'boolean',
        default: true,
    },
    showList: {
        type: 'boolean',
        default: true,
    },
    showButton: {
        type: 'boolean',
        default: true,
    },
    buttonText: {
        type: 'string',
        default: __('Explore More', 'betterdocs'),
    },
    titleColor: {
        type: 'string',
        default: '#528ffe',
    },
    titleHoverColor: {
        type: 'string',
    },
    countColor: {
        type: 'string',
        default: '#ffffff',
    },
    countHoverColor: {
        type: 'string',
        default: '#ffffff',
    },
    listIcon: {
        type: 'string',
        default: 'far fa-file-alt',
    },
    listColor: {
        type: 'string',
        default: '#566e8b',
    },
    listHoverColor: {
        type: 'string',
    },
    iconColor: {
        type: 'string',
    },
    showButtonIcon: {
        type: 'boolean',
        default: true,
    },
    buttonIcon: {
        type: 'string',
        default: 'fas fa-angle-right',
    },
    buttonIconPosition: {
        type: 'string',
        default: 'after',
    },
    buttonColor: {
        type: 'string',
        default: '#528ffe',
    },
    buttonHoverColor: {
        type: 'string',
    },
    buttonPosition: {
        type: 'string',
        default: 'left',
    },
    // typography attributes
    ...generateTypographyAttributes(Object.values(typoPrefixs)),
    // responsive range
    ...generateResponsiveRangeAttributes(COLUMNS, {
        defaultRange: 3,
        noUnits: true,
    }),
    ...generateResponsiveRangeAttributes(GRID_SPACE, {
        defaultRange: 10,
        noUnits: true,
    }),
    ...generateResponsiveRangeAttributes(COUNT_SIZE, {
        defaultRange: 30,
    }),
    ...generateResponsiveRangeAttributes(ICON_SIZE, {
        defaultRange: 15,
    }),
    ...generateResponsiveRangeAttributes(ICON_HEIGHT, {
        defaultRange: 15,
    }),
    ...generateResponsiveRangeAttributes(ICON_WIDTH, {
        defaultRange: 15,
    }),
    // dimension
    ...generateDimensionsAttributes(GRID_MARGIN),
    ...generateDimensionsAttributes(GRID_PADDING),
    ...generateDimensionsAttributes(TITLE_MARGIN),
    ...generateDimensionsAttributes(TITLE_PADDING, {
        top: 0,
        right: 0,
        bottom: 20,
        left: 0,
        isLinked: false,
    }),
    ...generateDimensionsAttributes(LIST_MARGIN),
    ...generateDimensionsAttributes(LIST_PADDING),
    ...generateDimensionsAttributes(ICON_MARGIN),
    ...generateDimensionsAttributes(BTN_MARGIN),
    ...generateDimensionsAttributes(BTN_PADDING),
    ...generateDimensionsAttributes(WRAPPER_MARGIN, {
        top: 28,
        right: 0,
        bottom: 28,
        left: 0,
        isLinked: false,
    }),
    // background
    ...generateBackgroundAttributes(GRID_BACKGROUND, {
        defaultFillColor: '#ffffff',
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(TITLE_BACKGROUND, {
        defaultFillColor: '#ffffff',
        noOverlay: true,
        noMainBgi: true,
    }),
    ...generateBackgroundAttributes(COUNT_BACKGROUND, {
        defaultFillColor: '#528ffe',
        noOverlay: true,
        noMainBgi: true,
    }),
    ...generateBackgroundAttributes(COUNT_BACKGROUND_LAYOUT_2, {
        defaultFillColor: '#fc8c91',
        noOverlay: true,
        noMainBgi: true,
    }),
    ...generateBackgroundAttributes(LIST_BACKGROUND, {
        defaultFillColor: '#ffffff',
        noOverlay: true,
        noMainBgi: true,
    }),
    ...generateBackgroundAttributes(BTN_BACKGROUND, {
        defaultFillColor: '#ffffff',
        noOverlay: true,
        noMainBgi: true,
    }),
    // border shadow attriubtes
    ...generateBorderShadowAttributes(GRID_BORDER),
    ...generateBorderShadowAttributes(TITLE_BORDER, {
        noShadow: true,
        bdrDefaults: {
            top: 0,
            right: 0,
            bottom: 2,
            left: 0,
            isLinked: false,
        },
        defaultBdrColor: '#528ffe',
        defaultBdrStyle: 'solid',
    }),
    ...generateBorderShadowAttributes(COUNT_BORDER, { noShadow: true }),
    ...generateBorderShadowAttributes(BTN_BORDER, { noShadow: true }),
    categoryTitleLink:{
        type: 'boolean',
        default: false,
    },
    ...generateDimensionsAttributes(CONTAINER_SECTION_MARGIN),
    ...generateDimensionsAttributes(CONTAINER_SECTION_PADDING),
    ...generateBackgroundAttributes(CONTAINER_SECTION_BACKGROUND, {
        defaultFillColor: 'rgba(255, 255, 255, 0)',
        noOverlay: true,
    }),
    prefix: {
        type: 'string',
        default: '',
    },
    suffix: {
        type: 'string',
        default: '',
    },
    suffixSingular: {
        type: 'string',
        default:''
    },
    tickerBackgroundColor:{
        type:'string',
        default: 'rgb(173, 94, 98)'
    },
    ...generateDimensionsAttributes(COUNT_PADDING_LAYOUT_2),
    ...generateDimensionsAttributes(COUNT_MARGIN_LAYOUT_2),
    ...generateDimensionsAttributes(TITLE_PADDING_LAYOUT_2),
    ...generateDimensionsAttributes(TITLE_MARGIN_LAYOUT_2)
}

export default attributes
