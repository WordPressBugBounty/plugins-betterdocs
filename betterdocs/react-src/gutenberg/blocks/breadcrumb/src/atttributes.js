import { __ } from '@wordpress/i18n';

import {
	BREADCRUMB_TITLE_PADDING,
	BREADCRUMB_TITLE_MARGIN,
	BREADCRUMB_ICON_MARGIN,
	BREADCRUMB_ICON_PADDING,
    BREADCRUMB_TITLE_MARGIN_LAYOUT_TWO,
    BREADCRUMB_TITLE_PADDING_LAYOUT_TWO,
    BREADCRUMB_ICON_MARGIN_LAYOUT_TWO,
    BREADCRUMB_ICON_PADDING_LAYOUT_TWO
} from './constants';
import {
	generateTypographyAttributes,
	generateDimensionsAttributes,
} from '../../../util/helpers';
import * as prefixes from './typographyPrefixConstants';


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
	...generateTypographyAttributes(Object.values(prefixes)),
	...generateDimensionsAttributes(BREADCRUMB_TITLE_MARGIN, {
		top:0,
		right:0,
		bottom:0,
		left:0
	}),
	...generateDimensionsAttributes(BREADCRUMB_TITLE_PADDING, {
		top:0,
		right:0,
		bottom:0,
		left:0
	}),
    ...generateDimensionsAttributes(BREADCRUMB_TITLE_MARGIN_LAYOUT_TWO, {
		top:0,
		right:0,
		bottom:0,
		left:0
	}),
	...generateDimensionsAttributes(BREADCRUMB_TITLE_PADDING_LAYOUT_TWO, {
		top:0,
		right:0,
		bottom:0,
		left:0
	}),
	breadcrumb_title_color:{
		type:'string',
		default:'#566e8b'
	},
    breadcrumb_title_color_layout_two:{
		type:'string',
		default:'#667085'
	},
	breadcrumb_icon_color:{
		type:'string',
		default:'#566e8b'
	},
    breadcrumb_icon_color_two:{
		type:'string',
		default:'#566e8b'
	},
	...generateDimensionsAttributes(BREADCRUMB_ICON_MARGIN, {
		top:0,
		right:0,
		bottom:0,
		left:0
	}),
	...generateDimensionsAttributes(BREADCRUMB_ICON_PADDING, {
		top:0,
		right:0,
		bottom:0,
		left:0
	}),
    ...generateDimensionsAttributes(BREADCRUMB_ICON_MARGIN_LAYOUT_TWO, {
		top:0,
		right:0,
		bottom:0,
		left:0
	}),
	...generateDimensionsAttributes(BREADCRUMB_ICON_PADDING_LAYOUT_TWO, {
		top:0,
		right:0,
		bottom:0,
		left:0
	}),
	align:{
		type:'string',
		default:'left'
	},
    align_layout_two:{
		type:'string',
		default:'left'
	},
    layout:{
        type:"string",
        default:'layout-1'
    },
    wrapper_background_color_layout_two:{
        type:"string",
        default:'#F9FAFB'
    }
}

export default attributes;
