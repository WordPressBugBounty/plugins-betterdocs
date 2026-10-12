
import { generateBorderShadowAttributes, generateDimensionsAttributes, generateResponsiveRangeAttributes, generateTypographyAttributes } from "../../../util/helpers";
import { SOCIAL_SHARE_TITLE_PADDING, SOCIAL_SHARE_TITLE_MARGIN, SOCIAL_SHARE_BOX_HEIGHT, SOCIAL_SHARE_BOX_WIDTH, SOCIAL_SHARE_BOX_PADDING, SOCIAL_SHARE_BOX_MARGIN, SOCIAL_SHARE_BOX_BORDER, SOCIAL_SHARE_ICON_PADDING, SOCIAL_SHARE_ICON_MARGIN, SOCIAL_SHARE_TITLE_PADDING_LAYOUT_2, SOCIAL_SHARE_TITLE_MARGIN_LAYOUT_2, SOCIAL_SHARE_BOX_HEIGHT_LAYOUT_2, SOCIAL_SHARE_BOX_WIDTH_LAYOUT_2, SOCIAL_SHARE_BOX_PADDING_LAYOUT_2, SOCIAL_SHARE_BOX_MARGIN_LAYOUT_2, SOCIAL_SHARE_BOX_BORDER_LAYOUT_2, SOCIAL_SHARE_ICON_PADDING_LAYOUT_2, SOCIAL_SHARE_ICON_MARGIN_LAYOUT_2, SOCIAL_SHARE_ICON_HEIGHT_LAYOUT_2, SOCIAL_SHARE_ICON_WIDTH_LAYOUT_2, SOCIAL_SHARE_ICON_OUTER_HEIGHT_LAYOUT_2, SOCIAL_SHARE_ICON_OUTER_WIDTH_LAYOUT_2 } from './constants';
import * as prefixes from "./typographyPrefixConstants";

const attributes =  {
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
	share_title:{
		type:'string',
		default:'Share This Article : '
	},
	share_title_tag:{
		type:'string',
		default:'h4'
	},
	share_title_color:{
		type:'string',
		default:'#566e8b'
	},
	share_title_hover_color:{
		type:'string',
		default:'#566e8b'
	},
    share_title_color_layout_2:{
		type:'string',
		default:'#1D2939'
	},
	share_title_hover_color_layout_2:{
		type:'string',
		default:'#1D2939'
	},
	...generateDimensionsAttributes(SOCIAL_SHARE_TITLE_PADDING),
	...generateDimensionsAttributes(SOCIAL_SHARE_TITLE_MARGIN),
    ...generateDimensionsAttributes(SOCIAL_SHARE_TITLE_PADDING_LAYOUT_2),
	...generateDimensionsAttributes(SOCIAL_SHARE_TITLE_MARGIN_LAYOUT_2),
	share_box_wrapper_color:{
		type:'string',
		default:'transparent'
	},
	share_content_align:{
		type:'string',
		default:'left'
	},
    share_content_align_layout_2:{
        type:'string',
		default:'left'
    },
    share_box_wrapper_color_layout_2:{
		type:'string',
		default:'transparent'
	},
	...generateResponsiveRangeAttributes(SOCIAL_SHARE_BOX_HEIGHT),
	...generateResponsiveRangeAttributes(SOCIAL_SHARE_BOX_WIDTH),
	...generateDimensionsAttributes(SOCIAL_SHARE_BOX_PADDING),
	...generateDimensionsAttributes(SOCIAL_SHARE_BOX_MARGIN),
	...generateBorderShadowAttributes(SOCIAL_SHARE_BOX_BORDER),
    ...generateResponsiveRangeAttributes(SOCIAL_SHARE_BOX_HEIGHT_LAYOUT_2),
	...generateResponsiveRangeAttributes(SOCIAL_SHARE_BOX_WIDTH_LAYOUT_2),
	...generateDimensionsAttributes(SOCIAL_SHARE_BOX_PADDING_LAYOUT_2),
	...generateDimensionsAttributes(SOCIAL_SHARE_BOX_MARGIN_LAYOUT_2),
	...generateBorderShadowAttributes(SOCIAL_SHARE_BOX_BORDER_LAYOUT_2),
	show_facebook_icon: {
		type:"boolean",
		default:true
	},
	show_twitter_icon:{
		type:"boolean",
		default:true
	},
	show_linkedin_icon:{
		type:"boolean",
		default:true
	},
	show_pinterest_icon:{
		type:"boolean",
		default:true
	},
    layout:{
        type:"string",
        default:'layout-1'
    },
	...generateDimensionsAttributes(SOCIAL_SHARE_ICON_PADDING),
	...generateDimensionsAttributes(SOCIAL_SHARE_ICON_MARGIN),
    ...generateDimensionsAttributes(SOCIAL_SHARE_ICON_PADDING_LAYOUT_2),
	...generateDimensionsAttributes(SOCIAL_SHARE_ICON_MARGIN_LAYOUT_2),
	...generateTypographyAttributes(Object.values(prefixes)),
    ...generateResponsiveRangeAttributes(SOCIAL_SHARE_ICON_HEIGHT_LAYOUT_2),
    ...generateResponsiveRangeAttributes(SOCIAL_SHARE_ICON_WIDTH_LAYOUT_2),
    ...generateResponsiveRangeAttributes(SOCIAL_SHARE_ICON_OUTER_HEIGHT_LAYOUT_2),
    ...generateResponsiveRangeAttributes(SOCIAL_SHARE_ICON_OUTER_WIDTH_LAYOUT_2)
}

export default attributes;
