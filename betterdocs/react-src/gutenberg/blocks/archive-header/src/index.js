import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import Edit from "./edit";
import attributes from "./attributes";
import icon from "./icon";

registerBlockType("betterdocs/archive-header", {
    title: __("BetterDocs Archive Header", "betterdocs"),
    description: __(
        "Header For Archive Page",
        "betterdocs",
    ),
    category: "betterdocs",
    attributes,
    icon,
    keywords: [
        __("betterdocs", "betterdocs"),
        __("archive", "betterdocs"),
        __("header", "betterdocs"),
        __("archive header", "betterdpcs")
    ],
    edit: Edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
});
