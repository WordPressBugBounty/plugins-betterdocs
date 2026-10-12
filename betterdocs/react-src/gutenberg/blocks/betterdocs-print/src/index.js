import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import Edit from "./edit";
import attributes from "./attributes";
import icon from "./icon";

registerBlockType("betterdocs/betterdocs-print", {
    title: __("BetterDocs Print Button", "betterdocs"),
    description: __(
        "Print Button lets your users simply just hit the button, save as PDF & print the documentation.",
        "betterdocs",
    ),
    category: "betterdocs",
    attributes,
    icon,
    keywords: [
        __("betterdocs", "betterdocs"),
        __("category box", "betterdocs"),
    ],
    edit: Edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
});
