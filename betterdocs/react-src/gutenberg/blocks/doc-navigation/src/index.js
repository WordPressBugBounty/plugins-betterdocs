import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import edit from "./edit";
import attributes from "./attributes";
import icon from "./icon";

import "./style.scss";

registerBlockType("betterdocs/doc-navigation", {
    title: __("BetterDocs Doc Navigation", "betterdocs"),
    description: __("Navigate between one docs to another easily with doc navigator block.", "betterdocs"),
    category: "betterdocs",
    attributes,
    icon,
    keywords: [
        __("better docs", "betterdocs"),
        __("navigation", "betterdocs"),
        __("betterdocs doc-navigation", "betterdocs"),
    ],
    edit: edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
});
