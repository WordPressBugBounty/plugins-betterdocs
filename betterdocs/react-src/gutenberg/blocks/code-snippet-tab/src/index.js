import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
import Edit from './edit';
import attributes from './attributes';
import icon from './icon';

registerBlockType('betterdocs/code-snippet-tab', {
    title: __('BetterDocs Code Snippet Tab', 'betterdocs'),
    description: __('Show HTTP responses as status-code tabs (200, 404, …), each with a copyable code example.', 'betterdocs'),
    category: 'betterdocs',
    icon: icon,
    keywords: [
        __('response', 'betterdocs'),
        __('api', 'betterdocs'),
        __('http', 'betterdocs'),
        __('status', 'betterdocs'),
        __('betterdocs', 'betterdocs'),
    ],
    supports: {
        align: ['wide', 'full'],
        html: false,
    },
    example: {
        attributes: {
            responses: [
                { status: '200', language: 'json', codeContent: '{\n  "success": true,\n  "data": {}\n}' },
                { status: '404', language: 'json', codeContent: '{\n  "success": false,\n  "message": "Not found"\n}' },
            ],
            theme: 'light',
        },
    },
    attributes,
    edit: Edit,
    save: () => null, // Dynamic block
});
