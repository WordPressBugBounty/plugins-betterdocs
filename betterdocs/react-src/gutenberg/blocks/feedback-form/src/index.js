import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import edit from "./edit";
import attributes from "./attributes";
import icon from "./icon";

import "./style.scss";

registerBlockType("betterdocs/feedback-form", {
    title: __("BetterDocs Feedback Form", "betterdocs"),
    description: __("Collect user feedback or reviews for your knowledge base documentation.", "betterdocs"),
    category: "betterdocs",
    attributes,
    icon,
    keywords: [
        __("better docs", "betterdocs"),
        __("feedback form", "betterdocs"),
        __("single doc", "betterdocs"),
    ],
    edit: edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
});
