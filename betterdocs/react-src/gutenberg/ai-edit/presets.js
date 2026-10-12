import { __ } from "@wordpress/i18n";

export const PRESETS = [
    {
        id: "improve",
        label: __("Improve Writing", "betterdocs"),
        prompt: __(
            "Improve the writing quality, clarity, grammar, and structure of the content below while preserving its original meaning and intent.",
            "betterdocs"
        ),
    },
    {
        id: "shorten",
        label: __("Make Shorter", "betterdocs"),
        prompt: __(
            "Make the content below more concise. Preserve all essential information; remove redundancy and filler.",
            "betterdocs"
        ),
    },
    {
        id: "expand",
        label: __("Make Longer", "betterdocs"),
        prompt: __(
            "Expand the content below with more detail, examples, and clear explanations. Keep the original voice.",
            "betterdocs"
        ),
    },
    {
        id: "simplify",
        label: __("Simplify", "betterdocs"),
        prompt: __(
            "Rewrite the content below in simpler language so it is easy to understand for a non-technical reader.",
            "betterdocs"
        ),
    },
    {
        id: "fix_grammar",
        label: __("Fix Grammar", "betterdocs"),
        prompt: __(
            "Fix only the grammar, spelling, and punctuation in the content below. Do not rewrite or change the meaning or style.",
            "betterdocs"
        ),
    },
    {
        id: "change_tone",
        label: __("Change Tone", "betterdocs"),
        needsOption: "tone",
        prompt: __(
            "Rewrite the content below in a {option} tone while preserving its meaning.",
            "betterdocs"
        ),
    },
    {
        id: "translate",
        label: __("Translate", "betterdocs"),
        needsOption: "language",
        prompt: __(
            "Translate the content below into {option}. Preserve meaning, tone, and any HTML structure.",
            "betterdocs"
        ),
    },
    {
        id: "summarize",
        label: __("Summarize", "betterdocs"),
        prompt: __(
            "Summarize the content below into 2 to 3 clear sentences.",
            "betterdocs"
        ),
    },
    {
        id: "create_table",
        label: __("Create Table", "betterdocs"),
        structural: true,
        prompt: __(
            "Extract the statistics, figures, or comparable data from the content below and represent them as a single HTML table. Infer clear column headers. Include every distinct data point. If no tabular data can be reasonably inferred, return the best possible structured representation.",
            "betterdocs"
        ),
    },
];

export const TONE_OPTIONS = [
    { value: "Formal", label: __("Formal", "betterdocs") },
    { value: "Casual", label: __("Casual", "betterdocs") },
    { value: "Professional", label: __("Professional", "betterdocs") },
    { value: "Friendly", label: __("Friendly", "betterdocs") },
    { value: "Technical", label: __("Technical", "betterdocs") },
    { value: "Confident", label: __("Confident", "betterdocs") },
];

export const LANGUAGE_OPTIONS = [
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Portuguese", label: "Portuguese" },
    { value: "Italian", label: "Italian" },
    { value: "Dutch", label: "Dutch" },
    { value: "Arabic", label: "Arabic" },
    { value: "Bengali", label: "Bengali" },
    { value: "Hindi", label: "Hindi" },
    { value: "Japanese", label: "Japanese" },
    { value: "Chinese (Simplified)", label: "Chinese (Simplified)" },
    { value: "Korean", label: "Korean" },
    { value: "Russian", label: "Russian" },
    { value: "Turkish", label: "Turkish" },
];
