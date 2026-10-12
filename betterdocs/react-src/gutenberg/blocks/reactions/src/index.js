import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import edit from "./edit";
import attributes from "./attributes";
import icon from "./icon";

import "./style.scss";

registerBlockType("betterdocs/reactions", {
    title: __("BetterDocs Reactions", "betterdocs"),
    description: __("Collect user reactions for your documentation.", "betterdocs"),
    category: "betterdocs",
    attributes,
    icon,
    keywords: [
        __("better docs", "betterdocs"),
        __("reactions", "betterdocs"),
        __("betterdocs reactions", "betterdocs"),
    ],
    edit: edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
});
