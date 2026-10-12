import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import edit from "./edit";
import attributes from "./atttributes";
import icon from "./icon";

import "./style.scss";

registerBlockType("betterdocs/breadcrumb", {
    title: __("BetterDocs Breadcrumb", "betterdocs"),
    description: __("Ensure a well-structured knowledge base to guide users effectively.", "betterdocs"),
    category: "betterdocs",
    attributes,
    icon,
    keywords: [__("better docs", "betterdocs"), __("breadcrumb", "betterdocs")],
    edit: edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
});
