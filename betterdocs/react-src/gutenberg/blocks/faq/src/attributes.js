import { __ } from '@wordpress/i18n';
import {
    generateTypographyAttributes,
    generateResponsiveRangeAttributes,
    generateDimensionsAttributes,
    generateBackgroundAttributes,
    generateBorderShadowAttributes,
} from '../../../util/helpers'

import {
    FAQ_LIST_BACKGROUND,
    FAQ_BORDER,
    FAQ_CONTENT_BORDER,
    FAQ_LIST_MARGIN,
    FAQ_CONTENT_PADDING,
    FAQ_CONTENT_BACKGROUND,
    TITLE_MARGIN,
    TITLE_PADDING,
    TITLE_BACKGROUND,
    TITLE_BORDER,
    COLUMNS,
    FAQ_SPACE,
    COUNT_SIZE,
    THUMBNAIL_SIZE,
    COUNT_BACKGROUND,
    FAQ_LIST_PADDING,
    FAQ_CONTENT_MARGIN,
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
    SECTION_TITLE_MARGIN,
    SECTION_TITLE_PADDING,
    GROUP_TITLE_MARGIN,
    GROUP_TITLE_PADDING,
    CONTAINER_SECTION_MARGIN,
    CONTAINER_SECTION_PADDING,
    CONTAINER_SECTION_BACKGROUND,
    FAQ_LIST_BACKGROUND_LAYOUT_3,
	FAQ_LIST_BACKGROUND_LAYOUT_4,
	FAQ_CONTENT_BACKGROUND_LAYOUT_4,
	GROUP_TITLE_PADDING_LAYOUT_4,
	GROUP_TITLE_MARGIN_LAYOUT_4,
	FAQ_LIST_PADDING_LAYOUT_4,
	FAQ_LIST_MARGIN_LAYOUT_4,
	FAQ_CONTENT_MARGIN_LAYOUT_4,
	FAQ_CONTENT_PADDING_LAYOUT_4,
	FAQ_BORDER_LAYOUT_4,
	FAQ_CONTENT_BORDER_LAYOUT_4,
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
    faqLayout: {
        type: 'string',
        default: 'layout-1',
    },
    faqTaxonomy: {
        type: 'string',
        default: 'betterdocs_faq_category',
    },
    // Per-block FAQ order. Empty string = inherit the global FAQ Builder order.
    faqOrder: {
        type: 'string',
        default: '',
    },
    faqSectionText: {
        type: 'string',
        default: 'Frequently Asked Questions'
    },
    faqSectionTitleColor: {
        type: 'string',
    },


    // JSON string of `[{value: int, label: string}]`. The editor writes that
    // object form; a bare id array (`"[5]"`) is also accepted since 4.9.0.
    includeFaqGroup: {
        type: 'string',
        default: null,
    },
    excludeFaqGroup: {
        type: 'string',
    },
    faqGroupTitleColor: {
        type: 'string',
    },
	faqGroupTitleLayout4Color: {
        type: 'string',
    },
    faqGroupTitleHoverColor: {
        type: 'string',
    },
	faqGroupTitleLayout4HoverColor: {
        type: 'string',
    },
    faqListColor: {
        type: 'string',
    },
	faqListLayout4Color: {
        type: 'string',
    },
    faqContentColor: {
        type: 'string',
    },
	faqContentLayout4Color: {
        type: 'string',
    },
    faqIconColor: {
        type: 'string',
    },

    faqGroupTitleTypography: {
        type: 'string',
    },

    faqPerPage: {
        type: 'number',
        default: 9,
    },
    orderBy: {
        type: 'string',
        default: 'name',
    },
    order: {
        type: 'string',
        default: 'asc',
    },
    postsPerPage: {
        type: 'number',
        default: 5,
    },
    postsOrderBy: {
        type: 'string',
        default: 'date',
    },
    postsOrder: {
        type: 'string',
        default: 'asc',
    },
    enableNestedSubcategory: {
        type: 'boolean',
        default: false,
    },
    postPerSubcategory: {
        type: 'number',
        default: 3,
    },
    layout: {
        type: 'string',
        default: 'default',
    },
    layoutMode: {
        type: 'string',
        default: 'faq',
    },
    showIcon: {
        type: 'boolean',
        default: true,
    },
    showThumbnail: {
        type: 'boolean',
        default: true,
    },
    showTitle: {
        type: 'boolean',
        default: true,
    },
    showDescription: {
        type: 'boolean',
        default: true,
    },
    titleTag: {
        type: 'string',
        default: 'h2',
    },
    faqSectionTitleTag: {
        type: 'string',
        default: 'h2',
    },
    faqGroupTitleTag: {
        type: 'string',
        default: 'h3',
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
        default: '#eeee22',
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
        default: '#2f3b48'
    },
    showButtonIcon: {
        type: 'boolean',
        default: true,
    },
    buttonIcon: {
        type: 'string',
        default: 'fas fa-arrow-right',
    },
    buttonColor: {
        type: 'string',
        default: '#528ffe',
    },
	buttonColorLayout4:{
		type: 'string',
        default: 'rgb(112, 126, 149)',
	},
    buttonHoverColor: {
        type: 'string',
    },
    buttonPosition: {
        type: 'string',
        default: 'left',
    },
    ...generateDimensionsAttributes(SECTION_TITLE_MARGIN),
    ...generateDimensionsAttributes(SECTION_TITLE_PADDING),
    ...generateDimensionsAttributes(GROUP_TITLE_MARGIN),
	...generateDimensionsAttributes(GROUP_TITLE_MARGIN_LAYOUT_4),
    ...generateDimensionsAttributes(GROUP_TITLE_PADDING),
	...generateDimensionsAttributes(GROUP_TITLE_PADDING_LAYOUT_4),
    // typography attributes
    ...generateTypographyAttributes(Object.values(typoPrefixs)),
    // responsive range
    ...generateResponsiveRangeAttributes(COLUMNS, {
        defaultRange: 3,
        noUnits: true,
    }),
    ...generateResponsiveRangeAttributes(FAQ_SPACE, {
        defaultRange: 10,
        noUnits: true,
    }),
    ...generateResponsiveRangeAttributes(COUNT_SIZE, {
        defaultRange: 30,
    }),
    ...generateResponsiveRangeAttributes(ICON_SIZE, {
        defaultRange: 15,
    }),
    ...generateResponsiveRangeAttributes(THUMBNAIL_SIZE, {
        defaultRange: 300,
    }),
    // dimension
    ...generateDimensionsAttributes(FAQ_LIST_MARGIN),
	...generateDimensionsAttributes(FAQ_LIST_MARGIN_LAYOUT_4),
    ...generateDimensionsAttributes(FAQ_LIST_PADDING),
	...generateDimensionsAttributes(FAQ_LIST_PADDING_LAYOUT_4),
    ...generateDimensionsAttributes(FAQ_CONTENT_MARGIN),
	...generateDimensionsAttributes(FAQ_CONTENT_MARGIN_LAYOUT_4),
    ...generateDimensionsAttributes(FAQ_CONTENT_PADDING),
	...generateDimensionsAttributes(FAQ_CONTENT_PADDING_LAYOUT_4),
    ...generateDimensionsAttributes(TITLE_MARGIN),
	...generateDimensionsAttributes(GROUP_TITLE_MARGIN_LAYOUT_4),
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
    ...generateBackgroundAttributes(CONTAINER_SECTION_BACKGROUND, {
        defaultFillColor: '#ffffff00',
        noOverlay: true,
    }),
    ...generateDimensionsAttributes(CONTAINER_SECTION_MARGIN),
    ...generateDimensionsAttributes(CONTAINER_SECTION_PADDING),
    // background
    ...generateBackgroundAttributes(FAQ_LIST_BACKGROUND, {
        defaultFillColor: '#f0f1f5',
        noOverlay: true,
    }),
	...generateBackgroundAttributes(FAQ_LIST_BACKGROUND_LAYOUT_4, {
        defaultFillColor: '#00000000',
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(FAQ_LIST_BACKGROUND_LAYOUT_3, {
        defaultFillColor: 'rgba(255,255,255,0.5)',
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(FAQ_CONTENT_BACKGROUND, {
        defaultFillColor: '#ffffff',
        noOverlay: true,
    }),
	...generateBackgroundAttributes(FAQ_CONTENT_BACKGROUND_LAYOUT_4, {
        defaultFillColor: '#F6FEF9',
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
    ...generateBorderShadowAttributes(FAQ_BORDER),
	...generateBorderShadowAttributes(FAQ_BORDER_LAYOUT_4),
    ...generateBorderShadowAttributes(FAQ_CONTENT_BORDER, {
        noShadow: true
    }),
	...generateBorderShadowAttributes(FAQ_CONTENT_BORDER_LAYOUT_4, {
        noShadow: true
    }),
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
}

export default attributes
