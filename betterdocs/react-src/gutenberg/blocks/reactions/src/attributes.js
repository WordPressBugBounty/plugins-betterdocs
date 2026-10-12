import { __ } from '@wordpress/i18n';

import { generateTypographyAttributes, generateResponsiveRangeAttributes, generateDimensionsAttributes, generateBorderShadowAttributes } from '../../../util/helpers';
import { REACTION_ICON_WIDTH, REACTION_TITLE_PADDING, REACTION_TITLE_MARGIN, REACTION_ICON_HEIGHT, REACTION_ICON_BORDER, REACTION_BOX_PADDING, REACTION_BOX_MARGIN, REACTION_BOX_BORDER, REACTION_ICON_WIDTH_LAYOUT_2, REACTION_TITLE_PADDING_LAYOUT_2, REACTION_TITLE_MARGIN_LAYOUT_2, REACTION_ICON_HEIGHT_LAYOUT_2, REACTION_ICON_BORDER_LAYOUT_2, REACTION_BOX_PADDING_LAYOUT_2, REACTION_BOX_MARGIN_LAYOUT_2, REACTION_BOX_BORDER_LAYOUT_2, REACTION_ICON_WIDTH_LAYOUT_3, REACTION_TITLE_PADDING_LAYOUT_3, REACTION_TITLE_MARGIN_LAYOUT_3, REACTION_ICON_HEIGHT_LAYOUT_3, REACTION_ICON_BORDER_LAYOUT_3, REACTION_BOX_PADDING_LAYOUT_3, REACTION_BOX_MARGIN_LAYOUT_3, REACTION_BOX_BORDER_LAYOUT_3 } from './constants';
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
    layout:{
        type:"string",
        default:"layout-1"
    },
	reaction_text: {
		type:'string',
		default:'What are your feelings'
	},
	reaction_text_tag: {
		type:'string',
		default:'h4'
	},
	reaction_text_color:{
		type:'string',
		default:'#566e8b'
	},
	reaction_icon_color: {
		type:'string',
		default:'#19ca9e'
	},
	reaction_icon_hover_color: {
		type:'string',
		default:'#fff'
	},
	reaction_inner_icon_color:{
		type:'string',
		default:'#fff'
	},
	reaction_inner_icon_hover_color:{
		type:'string',
		default:'#19ca9e'
	},
	reaction_box_color:{
		type:"string",
		default:'#fff'
	},
	reaction_box_hover_color:{
		type:"string",
		default:'#fff'
	},
    reaction_text_color_layout_2:{
		type:'string',
		default:'#475467'
	},
	reaction_box_color_layout_2:{
		type:"string",
		default:'#fff'
	},
	reaction_box_hover_color_layout_2:{
		type:"string",
		default:'#fff'
	},
    reaction_text_color_layout_3:{
		type:'string',
		default:'#667085'
	},
	reaction_box_color_layout_3:{
		type:"string",
		default:'#F9FAFB'
	},
	reaction_box_hover_color_layout_3:{
		type:"string",
		default:'#F9FAFB'
	},
    reaction_icon_text_color_layout_3:{
        type:"string",
		default:'#667085'
    },
	...generateTypographyAttributes(Object.values(prefixes)),
	...generateResponsiveRangeAttributes(REACTION_ICON_WIDTH, {
		defaultRange: 29
	}),
	...generateDimensionsAttributes(REACTION_TITLE_PADDING),
	...generateDimensionsAttributes(REACTION_TITLE_MARGIN),
	...generateResponsiveRangeAttributes(REACTION_ICON_HEIGHT, {
		defaultRange:29
	}),
	...generateBorderShadowAttributes(REACTION_ICON_BORDER),
	...generateDimensionsAttributes(REACTION_BOX_PADDING),
	...generateDimensionsAttributes(REACTION_BOX_MARGIN),
	...generateBorderShadowAttributes(REACTION_BOX_BORDER),
    ...generateResponsiveRangeAttributes(REACTION_ICON_WIDTH_LAYOUT_2, {
		defaultRange: 40
	}),
	...generateDimensionsAttributes(REACTION_TITLE_PADDING_LAYOUT_2),
	...generateDimensionsAttributes(REACTION_TITLE_MARGIN_LAYOUT_2),
	...generateResponsiveRangeAttributes(REACTION_ICON_HEIGHT_LAYOUT_2, {
		defaultRange:40
	}),
	...generateBorderShadowAttributes(REACTION_ICON_BORDER_LAYOUT_2),
	...generateDimensionsAttributes(REACTION_BOX_PADDING_LAYOUT_2),
	...generateDimensionsAttributes(REACTION_BOX_MARGIN_LAYOUT_2),
	...generateBorderShadowAttributes(REACTION_BOX_BORDER_LAYOUT_2),
    ...generateResponsiveRangeAttributes(REACTION_ICON_WIDTH_LAYOUT_3, {
		defaultRange: 16
	}),
	...generateDimensionsAttributes(REACTION_TITLE_PADDING_LAYOUT_3),
	...generateDimensionsAttributes(REACTION_TITLE_MARGIN_LAYOUT_3),
	...generateResponsiveRangeAttributes(REACTION_ICON_HEIGHT_LAYOUT_3, {
		defaultRange:16
	}),
	...generateBorderShadowAttributes(REACTION_ICON_BORDER_LAYOUT_3),
	...generateDimensionsAttributes(REACTION_BOX_PADDING_LAYOUT_3),
	...generateDimensionsAttributes(REACTION_BOX_MARGIN_LAYOUT_3),
	...generateBorderShadowAttributes(REACTION_BOX_BORDER_LAYOUT_3),
    show_happy_icon:{
        type:"boolean",
		default:true
    },
    happy_icon_url:{
        type:"string",
        default:""
    },
    show_neutral_icon:{
        type:"boolean",
		default:true
    },
    neutral_icon_url:{
        type:"string",
        default:""
    },
    show_sad_icon:{
        type:"boolean",
		default:true
    },
    sad_icon_url:{
        type:"string",
        default:""
    }
}
export default attributes;
