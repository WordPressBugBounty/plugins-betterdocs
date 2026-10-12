import { TOC_BOX_WIDTH, TOC_BOX_PADDING, TOC_BOX_MARGIN, TOC_BOX_BORDER_SHADOW, TOC_TITLE_PADDING, TOC_TITLE_MARGIN, TOC_LIST_PADDING, TOC_LIST_MARGIN, TOC_LIST_BORDER, TOC_LIST_BORDER_PADDING, TOC_ACTIVE_LIST_BORDER, TOC_ACTIVE_LIST_BORDER_POSITION_LEFT, TOC_ACTIVE_LIST_BORDER_POSITION_TOP, TOC_ACTIVE_LIST_BORDER_POSITION_RIGHT, TOC_ACTIVE_LIST_BORDER_POSITION_BOTTOM } from './constants';
import { generateResponsiveRangeAttributes, generateDimensionsAttributes, generateBorderShadowAttributes, generateTypographyAttributes } from '../../../util/helpers';

import * as prefixs from './typographyPrefixConstants';

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
	toc_title_text:{
		type:'string',
		default:'Table Of Contents'
	},
	toc_supported_tags:{
		type:'array',
		default:[
			{ value: '1', label: 'H1' },
			{ value: '2', label: 'H2' },
			{ value: '3', label: 'H3' },
			{ value: '4', label: 'H4' },
			{ value: '5', label: 'H5' }
		]
	},
	toc_list_heirarchy:{
		type:'boolean',
		default:true
	},
	toc_list_number:{
		type:'boolean',
		default:true
	},
	toc_collapsible_small_devices:{
		type:'boolean',
		default:true
	},
	toc_container_back_color:{
		type:'string',
		default:'#ffffff'
	},
	...generateResponsiveRangeAttributes(TOC_BOX_WIDTH),
	...generateDimensionsAttributes(TOC_BOX_PADDING),
	...generateDimensionsAttributes(TOC_BOX_MARGIN),
	...generateBorderShadowAttributes(TOC_BOX_BORDER_SHADOW),
	...generateTypographyAttributes(Object.values(prefixs)),
    ...generateResponsiveRangeAttributes(TOC_ACTIVE_LIST_BORDER_POSITION_LEFT),
    ...generateResponsiveRangeAttributes(TOC_ACTIVE_LIST_BORDER_POSITION_TOP),
    ...generateResponsiveRangeAttributes(TOC_ACTIVE_LIST_BORDER_POSITION_RIGHT),
    ...generateResponsiveRangeAttributes(TOC_ACTIVE_LIST_BORDER_POSITION_BOTTOM),
	toc_title_color:{
		type:'string',
		default:'#3f5876'
	},
	...generateDimensionsAttributes(TOC_TITLE_PADDING),
	...generateDimensionsAttributes(TOC_TITLE_MARGIN),
	toc_list_color:{
		type:'string',
		default:'#566e8b'
	},
	toc_list_hover_color:{
		type:'string',
		default:'#566e8b'
	},
	toc_list_hover_bg_color:{
		type:'string',
		default:''
	},
	...generateDimensionsAttributes(TOC_LIST_PADDING),
	...generateDimensionsAttributes(TOC_LIST_MARGIN, {
        top:5,
        right:0,
        bottom:5,
        left:0,
        isLinked:false
    }),
	...generateBorderShadowAttributes(TOC_LIST_BORDER),
	...generateDimensionsAttributes(TOC_LIST_BORDER_PADDING),
	...generateBorderShadowAttributes(TOC_ACTIVE_LIST_BORDER)
}

export default attributes;
