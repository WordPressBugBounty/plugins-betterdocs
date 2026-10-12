import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import edit from "./edit";
import attributes from "./attributes";
import icon from "./icon";

registerBlockType("betterdocs/docs-tag", {
    title: __("BetterDocs Docs tag", "betterdocs"),
    description: __("Single Doc Tags Block", "betterdocs"),
    category: "betterdocs",
    attributes,
    icon,
    keywords: [
        __("docs tags", "betterdocs"),
        __("tags", "betterdocs"),
        __("betterdocs tags", "betterdocs"),
    ],
    edit: edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
});
