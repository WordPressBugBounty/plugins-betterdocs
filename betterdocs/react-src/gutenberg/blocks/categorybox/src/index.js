/**
 * WordPress dependeincies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from "./edit";
import attributes from "./attributes";
import icon from "./icon";
/**
 * Import styles
 */
import "./style.scss";

registerBlockType("betterdocs/categorybox", {
    title: __("BetterDocs Category Box", "betterdocs"),
    description: __(
        "Highlight documentation categories with eye-catching boxes.",
        "betterdocs"
    ),
    category: "betterdocs",
    attributes,
    icon,
    keywords: [__("better docs", "betterdocs"), __("category box", "betterdocs")],
    edit: Edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
});
