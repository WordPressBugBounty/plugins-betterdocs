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

registerBlockType("betterdocs/searchbox", {
  title: __("BetterDocs Search Form", "betterdocs"),
  description: __(
    "Simple search forms for easy user guidance for your knowledge base.",
    "betterdocs"
  ),
  category: "betterdocs",
  attributes,
  icon,
  keywords: [__("better docs", "betterdocs"), __("Search Box", "betterdocs")],
  edit: Edit,
  save: () => null,
  example: {
    viewportWidth: 1200,
  },
});
