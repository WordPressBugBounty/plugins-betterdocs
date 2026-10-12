import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
import Edit from './edit';
import attributes from './attributes';
import icon from "./icon";

registerBlockType('betterdocs/code-snippet', {
    title: __('BetterDocs Code Snippet', 'betterdocs'),
    description: __('Display code snippets with syntax highlighting and copy functionality.', 'betterdocs'),
    category: 'betterdocs',
    icon: icon,
    keywords: [
        __('code', 'betterdocs'),
        __('snippet', 'betterdocs'),
        __('syntax', 'betterdocs'),
        __('highlight', 'betterdocs'),
        __('betterdocs', 'betterdocs'),
    ],
    supports: {
        align: ['wide', 'full'],
        html: false,
    },
    example: {
        attributes: {
            codeContent: `function helloWorld() {
    console.log("Hello, World!");
    return "Welcome to BetterDocs!";
}

helloWorld();`,
            language: 'javascript',
            showCopyButton: true,
            showLineNumbers: false,
            theme: 'light',
        },
    },
    attributes,
    edit: Edit,
    save: () => null, // Dynamic block
});
