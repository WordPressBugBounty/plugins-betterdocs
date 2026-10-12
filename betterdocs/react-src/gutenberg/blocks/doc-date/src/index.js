import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import edit from "./edit";
import attributes from "./attributes";
import "./style.scss";
import icon from "./icon";

registerBlockType("betterdocs/date", {
    title: __("BetterDocs Date", "betterdocs"),
    description: __("Display the date of the Docs.", "betterdocs"),
    category: "betterdocs",
    attributes,
    icon,
    keywords: [
        __("betterdocs", "betterdocs"),
        __("betterdocs date", "betterdocs"),
        __("docs date", "betterdocs"),
    ],
    edit: edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
});
