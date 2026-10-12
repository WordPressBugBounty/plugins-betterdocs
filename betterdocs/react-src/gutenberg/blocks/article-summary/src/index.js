import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import edit from "./edit";
import attributes from "./attributes";
import icon from "./icon";

import "./style.scss";

registerBlockType("betterdocs/article-summary", {
    title: __("AI Doc Summarizer", "betterdocs"),
    description: __(
        "Display AI-powered article summaries for your documentation with customizable styling options.",
        "betterdocs"
    ),
    category: "betterdocs",
    attributes,
    icon,
    keywords: [
        __("betterdocs", "betterdocs"),
        __("ai doc summarizer", "betterdocs"),
        __("doc summary", "betterdocs"),
        __("article summary", "betterdocs"),
        __("ai summary", "betterdocs"),
    ],
    edit: edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
});
