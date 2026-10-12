import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import edit from "./edit";
import attributes from "./attributes";
import icon from "./icon";

import "./style.scss";

registerBlockType("betterdocs/single-doc-content", {
    title: __("BetterDocs Single Doc Content", "betterdocs"),
    description: __("Add content to your documentation with this block.", "betterdocs"),
    category: "betterdocs",
    attributes,
    icon,
    keywords: [
        __("better docs", "betterdocs"),
        __("single doc content", "betterdocs"),
        __("doc content", "betterdocs"),
    ],
    edit: edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
});
