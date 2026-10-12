import { __ } from '@wordpress/i18n';

import { generateTypographyAttributes, generateResponsiveRangeAttributes, generateBackgroundAttributes } from '../../../util/helpers';
import { ARCHIVE_ICON_WIDTH, ARCHIVE_ICON_HEIGHT, LIST_THREE_ICON_WIDTH, LIST_THREE_ICON_HEIGHT, LAST_UPDATED_BACKGROUND_LAYOUT_THREE, LIST_ICON_BACKGROUND_LAYOUT_THREE, PAGINATION_HEIGHT_LAYOUT_1_3, PAGINATION_WIDTH_LAYOUT_1_3, PAGINATION_BACKGROUND_COLOR_LAYOUT_1, PAGINATION_BACKGROUND_COLOR_LAYOUT_3, PAGINATION_PADDING_1_3, PAGINATION_MARGIN_1_3, ARCHIVE_LIST_WRAPPER_BACKGROUND, ARCHIVE_LIST_WRAPPER_BACKGROUND_LAYOUT_2, LAYOUT_2_WRAPPER_MARGIN, LAYOUT_2_WRAPPER_PADDING, ARCHIVE_LIST_WRAPPER_BACKGROUND_LAYOUT_3, CONTAINER_PADDING, CONTAINER_MARGIN, LIST_ITEM_SPACING, LIST_AREA_PADDING, TITLE_MARGIN, TITLE_PADDING, EXCERPT_MARGIN, EXCERPT_PADDING, DATE_MARGIN, DATE_PADDING } from './constants';
import * as typoPrefixs from './typographyPrefixConstants';
import { generateDimensionsAttributes } from '../../../util/helpers';

const attributes = {
	resOption: {
        type: 'string',
        default: 'Desktop',
    },
    layout: {
        type: 'string',
        default: 'layout-1',
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
	nested_subcategory: {
		type:'boolean',
		default:true
	},
	orderby:{
		type:'string',
		default:'betterdocs_order'
	},
	order:{
		type:'string',
		default:'asc'
	},
	nested_subcategory:{
		type:'boolean',
		default:false
	},
	...generateTypographyAttributes(Object.values(typoPrefixs)),
    list_icon:{
        type: 'string',
        default: 'far fa-file-alt',
    },
	list_color:{
		type:'string',
		default:'#566e8b'
	},
	list_hover_color:{
		type:'string',
		default:'#566e8b'
	},
	list_icon_color:{
		type:'string',
		default:'#566e8b'
	},
	list_icon_hover_color:{
		type:'string',
		default:'#566e8b'
	},
	...generateResponsiveRangeAttributes(ARCHIVE_ICON_WIDTH, {
        defaultRange: 0,
		default:'px'
    }),
	...generateResponsiveRangeAttributes(ARCHIVE_ICON_HEIGHT, {
		defaultRange: 0,
		default:'px'
	}),
    ...generateResponsiveRangeAttributes(LIST_THREE_ICON_WIDTH, {
        defaultRange: 32,
		default:'px'
    }),
    ...generateResponsiveRangeAttributes(LIST_THREE_ICON_HEIGHT, {
        defaultRange: 32,
		default:'px'
    }),
    ...generateBackgroundAttributes(LAST_UPDATED_BACKGROUND_LAYOUT_THREE, {
        defaultFillColor: '#FFFCF5',
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(LIST_ICON_BACKGROUND_LAYOUT_THREE, {
        defaultFillColor: '#F2F4F7',
        noOverlay: true,
    }),

	list_description_color:{
		type:'string',
		default:'#566e8b'
	},
	list_title_color:{
		type:'string',
		default:'#566e8b'
	},
    list_color_layout_two:{
		type:'string',
		default:'#15063f'
	},
    list_title_color_layout_three:{
		type:'string',
		default:'#1D2939'
	},
	list_hover_color_layout_two:{
		type:'string',
		default:'#15063f'
	},
    list_title_hover_color_layout_three:{
		type:'string',
		default:'#1D2939'
	},
	list_icon_color_layout_two:{
		type:'string',
		default:'#000000'
	},
    list_icon_color_layout_three:{
        type:'string',
        default:'rgb(196, 196, 196)'
    },
    list_icon_hover_color_layout_three:{
        type:'string',
        default:'rgb(196, 196, 196)'
    },
    list_exceprt_color_layout_three:{
        type:'string',
        default:'#475467'
    },
    last_updated_time_color:{
        type:'string',
        default:'#475467'
    },
	list_icon_hover_color_two:{
		type:'string',
		default:'#000000'
	},
    list_description_color_layout_two:{
        type:'string',
		default:'#707070'
    },
    postsPerPageLayoutTwo:{
        type:"number",
        default:-1
    },
    listIconImageUrl:{
        type:"string",
        default:""
    },
    pagination:{
        type:"boolean",
        default:false
    },
    pagination_color:{
		type:'string',
		default:'#737A85'
	},
    pagination_active_color:{
		type:'string',
		default:'#00B884'
	},
    pagination_active_border_color:{
	    type:'string',
		default:'#00B884'
    },
    ...generateResponsiveRangeAttributes(PAGINATION_HEIGHT_LAYOUT_1_3, {
		defaultRange: 40,
		default:'px'
	}),
    ...generateResponsiveRangeAttributes(PAGINATION_WIDTH_LAYOUT_1_3, {
		defaultRange: 40,
		default:'px'
	}),
    ...generateBackgroundAttributes(PAGINATION_BACKGROUND_COLOR_LAYOUT_1, {
        defaultFillColor: '#fff',
        noOverlay: true,
    }),
	...generateBackgroundAttributes(ARCHIVE_LIST_WRAPPER_BACKGROUND, {
        defaultFillColor: '#fff',
        noOverlay: true,
    }),
	...generateBackgroundAttributes(ARCHIVE_LIST_WRAPPER_BACKGROUND_LAYOUT_2, {
        defaultFillColor: '#fff',
        noOverlay: true,
    }),...generateBackgroundAttributes(ARCHIVE_LIST_WRAPPER_BACKGROUND_LAYOUT_3, {
        defaultFillColor: '#fff',
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(PAGINATION_BACKGROUND_COLOR_LAYOUT_3, {
        defaultFillColor: '#F6F7F8',
        noOverlay: true,
    }),
    ...generateDimensionsAttributes(PAGINATION_PADDING_1_3),
    ...generateDimensionsAttributes(PAGINATION_MARGIN_1_3),
    ...generateDimensionsAttributes(LAYOUT_2_WRAPPER_MARGIN),
    ...generateDimensionsAttributes(LAYOUT_2_WRAPPER_PADDING),
    pagination_alignment_layout_1:{
		type:'string',
		default:'start'
	},
    pagination_alignment_layout_3:{
		type:'string',
		default:'center'
	},
	listTitleTag: {
		type: 'string',
		default: 'h3'
	},
	listEntryHeadingTag: {
		type: 'string',
		default: 'h3'
	},

    // Container Section Controls
    ...generateDimensionsAttributes(CONTAINER_PADDING),
    ...generateDimensionsAttributes(CONTAINER_MARGIN),

    // Category List Controls
    ...generateDimensionsAttributes(LIST_ITEM_SPACING),
    ...generateDimensionsAttributes(LIST_AREA_PADDING),
    ...generateDimensionsAttributes(TITLE_MARGIN),
    ...generateDimensionsAttributes(TITLE_PADDING),
    ...generateDimensionsAttributes(EXCERPT_MARGIN),
    ...generateDimensionsAttributes(EXCERPT_PADDING),
    ...generateDimensionsAttributes(DATE_MARGIN),
    ...generateDimensionsAttributes(DATE_PADDING),
}

export default attributes;

