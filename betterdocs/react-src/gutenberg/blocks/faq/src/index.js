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

registerBlockType('betterdocs/faq', {
    title: __('BetterDocs FAQ', 'betterdocs'),
    description: __('Use the FAQ block to easily create a knowledge base section of frequently asked questions.', 'betterdocs'),
    category: 'betterdocs',
    attributes,
    icon,
    keywords: [
        __('betterdocs', 'betterdocs'),
        __('betterdocs faq', 'betterdocs'),
        __('faq', 'betterdocs'),
    ],
    edit: Edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
})
