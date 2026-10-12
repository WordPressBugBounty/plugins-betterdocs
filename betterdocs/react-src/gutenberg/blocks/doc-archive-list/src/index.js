import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import edit from "./edit";
import attributes from "./attributes";
import icon from "./icon";

import "./style.scss";

registerBlockType("betterdocs/archive-doc-list", {
    title: __("BetterDocs Archive Doc List", "betterdocs"),
    description: __("Streamlines the creation of your knowledge-base archive lists.", "betterdocs"),
    category: "betterdocs",
    attributes,
    icon,
    keywords: [
        __("better docs", "betterdocs"),
        __("archive doc list", "betterdocs"),
        __("docs archive", "betterdocs"),
    ],
    edit: edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
});
