import { __ } from '@wordpress/i18n';
import { generateDimensionsAttributes, generateBackgroundAttributes, generateBorderShadowAttributes, generateTypographyAttributes } from '../../../util/helpers';
import { WRAPPER_TAGS_PADDING, TAGS_BACKGROUND, TAGS_BORDER, TAGS_MARGIN, TAGS_PADDING, WRAPPER_TAGS_BACKGROUND, WRAPPER_TAGS_MARGIN } from './constants';
import * as typoPrefixs from './typographyPrefixConstants';

const attributes = {
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
    tagsColor:{
        type:"string",
        default:"#566e8b"
    },
    ...generateTypographyAttributes(Object.values(typoPrefixs)),
    ...generateDimensionsAttributes(WRAPPER_TAGS_PADDING),
    ...generateDimensionsAttributes(WRAPPER_TAGS_MARGIN),
    ...generateDimensionsAttributes(TAGS_MARGIN),
    ...generateDimensionsAttributes(TAGS_PADDING),
    ...generateBorderShadowAttributes(TAGS_BORDER),
    ...generateBackgroundAttributes(WRAPPER_TAGS_BACKGROUND, {
        defaultFillColor: 'rgba(255, 255, 255, 0)',
        noOverlay: true,
    }),
    ...generateBackgroundAttributes(TAGS_BACKGROUND, {
        defaultFillColor: 'rgba(255, 255, 255, 0)',
        noOverlay: true,
    }),
}

export default attributes;

