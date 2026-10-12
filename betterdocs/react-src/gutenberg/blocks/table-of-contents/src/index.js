import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import "./style.scss";
import edit from "./edit";
import attributes from "./attributes";
import icon from "./icon";

registerBlockType("betterdocs/table-of-contents", {
    title: __("BetterDocs Table Of Contents", "betterdocs"),
    description: __(
        "Display well-structured Table of Contents for your Documentation with lots of styling options.",
        "betterdocs",
    ),
    keywords: [
        __("better docs", "betterdocs"),
        __("toc", "betterdocs"),
        __("table of contents", "betterdocs"),
    ],
    attributes,
    icon,
    edit: edit,
    save: () => null,
    example: {
        viewPortWidth: 1200,
    },
});
