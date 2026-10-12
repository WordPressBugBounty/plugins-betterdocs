import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import "./style.scss";
import edit from "./edit";
import attributes from "./attributes";
import icon from "./icon";

registerBlockType("betterdocs/social-share", {
    title: __("BetterDocs Social Share", "betterdocs"),
    description: __("Enable users to instantly share docs on social media platforms with ease.", "betterdocs"),
    keywords: [
        __("better docs", "betterdocs"),
        __("social share", "betterdocs"),
    ],
    attributes,
    icon,
    edit: edit,
    save: () => null,
    example: {
        viewPortWidth: 1200,
    },
});
