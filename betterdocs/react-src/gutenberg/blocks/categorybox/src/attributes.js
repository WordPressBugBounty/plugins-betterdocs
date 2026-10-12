import { __ } from '@wordpress/i18n';
import {
    generateTypographyAttributes,
    generateResponsiveRangeAttributes,
    generateDimensionsAttributes,
    generateBackgroundAttributes,
    generateBorderShadowAttributes,
} from '../../../util/helpers'

import {
    BOX_BACKGROUND,
    BOX_BORDER,
    BOX_MARGIN,
    BOX_PADDING,
    TITLE_MARGIN,
    COUNT_MARGIN,
    COLUMNS,
    ICON_AREA,
    ICON_SIZE,
    ICON_BACKGROUND,
    ICON_BORDER,
    ICON_MARGIN,
    ICON_PADDING,
    WRAPPER_MARGIN,
    CONTAINER_SECTION_MARGIN,
    CONTAINER_SECTION_PADDING,
    CONTAINER_SECTION_BACKGROUND,
    COLUMNS_LAYOUT_4,
    ICON_AREA_LAYOUT_4,
    ICON_SIZE_LAYOUT_4,
    BOX_MARGIN_LAYOUT_4,
    BOX_PADDING_LAYOUT_4,
    TITLE_MARGIN_LAYOUT_4,
    COUNT_MARGIN_LAYOUT_4,
    ICON_MARGIN_LAYOUT_4,
    ICON_PADDING_LAYOUT_4,
    WRAPPER_MARGIN_LAYOUT_4,
    BOX_BACKGROUND_LAYOUT_4,
    ICON_BACKGROUND_LAYOUT_4,
    BOX_BORDER_LAYOUT_4,
    ICON_BORDER_LAYOUT_4,
    CONTAINER_SECTION_MARGIN_LAYOUT_4,
    CONTAINER_SECTION_PADDING_LAYOUT_4,
    CONTAINER_SECTION_BACKGROUND_LAYOUT_4,
    LAST_UPDATED_BACKGROUND_COLOR_LAYOUT_4,
    LAST_UPDATED_PADDING,
    LAST_UPDATED_MARGIN,
    WRAPPER_PADDING,
    ICON_IMAGE_WIDTH_LAYOUT_4,
    ICON_IMAGE_HEIGHT_LAYOUT_4
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
    boxPerPage: {
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
    layout: {
        type: 'string',
        default: 'default',
    },
    showIcon: {
        type: 'boolean',
        default: true,
    },
    showLastUpdatedTime: {
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
    showCount: {
        type: 'boolean',
        default: true,
    },
    prefix: {
        type: 'string',
    },
    suffix: {
        type: 'string',
        default: __('Docs', 'betterdocs'),
    },
    suffixSingular: {
        type: 'string',
        default: __('Doc', 'betterdocs'),
    },
    titleColor: {
        type: 'string',
        default: '#333333',
    },
    titleColorLayout4:{
        type: 'string',
        default: '#1D2939',
    },
    titleHoverColor: {
        type: 'string',
    },
    titleHoverColorLayout4:{
        type:'string',
    },
    countColor: {
        type: 'string',
        default: '#707070',
    },
    countColorLayout4:{
        type: 'string',
        default: '#475467',
    },
    countHoverColor: {
        type: 'string',
    },
    countHoverColorLayout4: {
        type: 'string',
    },
    lastUpdatedTimeColor:{
        type:'string',
        default:'#475467'
    },
    lastUpdatedTimeHoverColor:{
        type:'string',
    },
    layout4Col:{
        type:"number",
        default:4
    },
    // typography attributes
    ...generateTypographyAttributes(Object.values(typoPrefixs)),
    // responsive range
    ...generateResponsiveRangeAttributes(COLUMNS, {
        defaultRange: 3,
        noUnits: true,
    }),
    ...generateResponsiveRangeAttributes(ICON_AREA, {
        defaultRange: 80,
    }),
    ...generateResponsiveRangeAttributes(ICON_SIZE),
    // dimension
    ...generateDimensionsAttributes(BOX_MARGIN),
    ...generateDimensionsAttributes(BOX_PADDING),
    ...generateDimensionsAttributes(TITLE_MARGIN),
    ...generateDimensionsAttributes(COUNT_MARGIN),
    ...generateDimensionsAttributes(ICON_MARGIN),
    ...generateDimensionsAttributes(ICON_PADDING),
    ...generateDimensionsAttributes(WRAPPER_MARGIN),
    ...generateDimensionsAttributes(WRAPPER_PADDING),
    // background
    ...generateBackgroundAttributes(BOX_BACKGROUND, {
        defaultFillColor: '#f8f8fc',
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(ICON_BACKGROUND, {
        noOverlay: true,
        noMainBgi: true,
    }),
    // border shadow attriubtes
    ...generateBorderShadowAttributes(BOX_BORDER),
    ...generateBorderShadowAttributes(ICON_BORDER, { noShadow: true }),
    ...generateDimensionsAttributes(CONTAINER_SECTION_MARGIN),
    ...generateDimensionsAttributes(CONTAINER_SECTION_PADDING),
    ...generateBackgroundAttributes(CONTAINER_SECTION_BACKGROUND, {
        defaultFillColor: 'rgba(255, 255, 255, 0)',
        noOverlay: true,
    }),
    ...generateResponsiveRangeAttributes(ICON_AREA_LAYOUT_4, {
        defaultRange: 32,
    }),
    ...generateResponsiveRangeAttributes(ICON_SIZE_LAYOUT_4),
    ...generateResponsiveRangeAttributes(ICON_IMAGE_WIDTH_LAYOUT_4, {
        defaultRange: 32,
    }),
    ...generateResponsiveRangeAttributes(ICON_IMAGE_HEIGHT_LAYOUT_4, {
        defaultRange: 32,
    }),
    // dimension
    ...generateDimensionsAttributes(BOX_MARGIN_LAYOUT_4),
    ...generateDimensionsAttributes(LAST_UPDATED_PADDING),
    ...generateDimensionsAttributes(LAST_UPDATED_MARGIN),
    ...generateDimensionsAttributes(BOX_PADDING_LAYOUT_4),
    ...generateDimensionsAttributes(TITLE_MARGIN_LAYOUT_4),
    ...generateDimensionsAttributes(COUNT_MARGIN_LAYOUT_4),
    ...generateDimensionsAttributes(ICON_MARGIN_LAYOUT_4),
    ...generateDimensionsAttributes(ICON_PADDING_LAYOUT_4),
    // background
    ...generateBackgroundAttributes(BOX_BACKGROUND_LAYOUT_4, {
        defaultFillColor: '#fff',
        noOverlay: true,
    }),
     // background
     ...generateBackgroundAttributes(LAST_UPDATED_BACKGROUND_COLOR_LAYOUT_4, {
        defaultFillColor: '#FFFCF5',
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(ICON_BACKGROUND_LAYOUT_4, {
        noOverlay: true,
        noMainBgi: true,
    }),
    // border shadow attriubtes
    ...generateBorderShadowAttributes(BOX_BORDER_LAYOUT_4),
    ...generateBorderShadowAttributes(ICON_BORDER_LAYOUT_4, { noShadow: true }),
    ...generateDimensionsAttributes(CONTAINER_SECTION_MARGIN_LAYOUT_4),
    ...generateDimensionsAttributes(CONTAINER_SECTION_PADDING_LAYOUT_4),
    ...generateBackgroundAttributes(CONTAINER_SECTION_BACKGROUND_LAYOUT_4, {
        defaultFillColor: 'rgba(255, 255, 255, 0)',
        noOverlay: true,
    }),
}

export default attributes
