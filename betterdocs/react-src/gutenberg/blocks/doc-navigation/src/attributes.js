import { __ } from '@wordpress/i18n';

import { generateTypographyAttributes, generateResponsiveRangeAttributes, generateDimensionsAttributes, generateBorderShadowAttributes } from '../../../util/helpers';
import * as prefixes from './typographyPrefixConstants';
import { NAVIGATION_ARROW_SIZE, NAVIGATION_BOX_PADDING, NAVIGATION_BOX_MARGIN, NAVIGATION_BOX_BORDER, NAVIGATION_ARROW_PADDING, NAVIGATION_ARROW_MARGIN } from './constants';

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
	navigation_text_color:{
		type:'string',
		default:'#3f5876'
	},
	navigation_text_hover_color:{
		type:'string',
		default:'#3f5876'
	},
    navigation_box_color:{
		type:"string",
		default:'#FFFFFF00'
	},
	...generateTypographyAttributes(Object.values(prefixes)),
	...generateResponsiveRangeAttributes(NAVIGATION_ARROW_SIZE),
    ...generateDimensionsAttributes(NAVIGATION_BOX_PADDING),
	...generateDimensionsAttributes(NAVIGATION_BOX_MARGIN),
	...generateBorderShadowAttributes(NAVIGATION_BOX_BORDER),
	...generateDimensionsAttributes(NAVIGATION_ARROW_PADDING),
	...generateDimensionsAttributes(NAVIGATION_ARROW_MARGIN),
	navigation_arrow_color:{
		type:'string',
		default:'#5edf8e'
	}
}

export default attributes;
