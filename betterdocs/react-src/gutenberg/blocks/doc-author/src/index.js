import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import Edit from "./edit";
import attributes from "./attributes";
import icon from "./icon";


registerBlockType("betterdocs/doc-author", {
    title: __("BetterDocs Doc Author", "betterdocs"),
    description: __(
        "Doc Author Block For Single Docs",
        "betterdocs",
    ),
    category: "betterdocs",
    attributes,
    icon,
    keywords: [
        __("better docs", "betterdocs"),
        __("doc author", "betterdocs"),
        __("updated time", "betterdocs"),
        __('author', 'betterdocs')
    ],
    edit: Edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
});
