import { __ } from '@wordpress/i18n';

import { generateTypographyAttributes } from "../../../util/helpers";
import * as prefixes from './typographyPrefixConstants';
import { DOC_DATE_BACKGROUND, DOC_DATE_BORDER, DOC_DATE_MARGIN, DOC_DATE_PADDING } from './constants';
import { generateBackgroundAttributes, generateDimensionsAttributes, generateBorderShadowAttributes } from '../../../util/helpers';

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
	doc_date_color:{
		type:'string',
		default:'#566e8b'
	},
	doc_date_align:{
		type:'string',
		default:'left'
	},
    ...generateBackgroundAttributes(DOC_DATE_BACKGROUND, {
        defaultFillColor: 'rgba(255, 255, 255, 0)',
        noOverlay: true,
    }),
    ...generateDimensionsAttributes(DOC_DATE_MARGIN),
    ...generateDimensionsAttributes(DOC_DATE_PADDING),
    ...generateBorderShadowAttributes(DOC_DATE_BORDER),
}

export default attributes
