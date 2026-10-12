import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import edit from "./edit";
import attributes from "./attributes";
import icon from "./icon";

// import "./style.scss";

registerBlockType("betterdocs/sidebar", {
    title: __("BetterDocs Sidebar", "betterdocs"),
    description: __("Easily incorporate sidebars into your knowledge base documentation.","betterdocs"),
    category: "betterdocs",
    attributes,
    icon,
    keywords: [
        __("better docs", "betterdocs"),
        __("betterdocs sidebar", "betterdocs"),
        __("sidebar", "betterdocs"),
    ],
    edit: edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
});
