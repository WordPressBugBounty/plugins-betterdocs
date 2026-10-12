/**
 * WordPress dependeincies
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
 * Import styles
 */
import './style.scss'

registerBlockType('betterdocs/categorygrid', {
    title: __('BetterDocs Category Grid', 'betterdocs'),
    description: __('Represent knowledge base categories with amazing grid view.', 'betterdocs'),
    category: 'betterdocs',
    attributes,
    icon,
    keywords: [
        __('betterdocs', 'betterdocs'),
        __('category grid', 'betterdocs'),
    ],
    edit: Edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
})
