/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit'
import attributes from './attributes'
import icon from './icon'
/**
 * Styles are compiled via webpack configuration
 * See webpack.config.js: "blocks/category-slate-layout/default"
 */

registerBlockType('betterdocs/category-slate-layout', {
    title: __('BetterDocs Slate Layout', 'betterdocs'),
    description: __('Display knowledge base categories with modern slate-style layout.', 'betterdocs'),
    category: 'betterdocs',
    attributes,
    icon,
    keywords: [
        __('betterdocs', 'betterdocs'),
        __('category slate', 'betterdocs'),
        __('slate layout', 'betterdocs'),
        __('modern grid', 'betterdocs'),
    ],
    edit: Edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
})
