import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

// Lower-case, matching the file on disk: macOS resolves "./Edit" anyway, a
// case-sensitive filesystem does not.
import Edit from "./edit";
import attributes from "./attributes";
import icon from "./icon";


registerBlockType("betterdocs/reading-time", {
    title: __("Reading Time, Listen and AI Action", "betterdocs"),
    description: __(
        'The single-doc meta row: estimated reading time, a Listen button that reads the doc aloud, and a "Copy page" button that hands it to an AI assistant. Each part has its own switch.',
        "betterdocs",
    ),
    category: "betterdocs",
    attributes,
    icon,
    keywords: [
        __("better docs", "betterdocs"),
        __("reading time", "betterdocs"),
        __("time", "betterdocs"),
        __("ai", "betterdocs"),
        __("markdown", "betterdocs"),
        __("copy page", "betterdocs"),
        __("listen", "betterdocs"),
        __("audio", "betterdocs"),
        __("text to speech", "betterdocs"),
        __("accessibility", "betterdocs"),
    ],
    edit: Edit,
    save: () => null,
    example: {
        viewportWidth: 1200,
    },
});
