import { __ } from "@wordpress/i18n";

// Wrapper constants
export const CODE_SNIPPET_WRAPPER_MARGIN = "codeSnippetWrapperMargin";
export const CODE_SNIPPET_WRAPPER_PADDING = "codeSnippetWrapperPadding";

// Header constants
export const CODE_SNIPPET_HEADER_PADDING = "codeSnippetHeaderPadding";

// Line Numbers constants
export const CODE_SNIPPET_LINE_NUMBERS_PADDING = "codeSnippetLineNumbersPadding";

// Code Content constants
export const CODE_SNIPPET_CODE_PADDING = "codeSnippetCodePadding";

// Language Options
export const LANGUAGE_OPTIONS = [
    { label: __("JavaScript", "betterdocs"), value: "javascript" },
    { label: __("PHP", "betterdocs"), value: "php" },
    { label: __("Python", "betterdocs"), value: "python" },
    { label: __("Java", "betterdocs"), value: "java" },
    { label: __("Ruby", "betterdocs"), value: "ruby" },
    { label: __("cURL", "betterdocs"), value: "curl" },
    { label: __("Bash", "betterdocs"), value: "bash" },
    { label: __("JSON", "betterdocs"), value: "json" },
    { label: __("YAML", "betterdocs"), value: "yaml" },
    { label: __("HTML", "betterdocs"), value: "html" },
    { label: __("CSS", "betterdocs"), value: "css" },
    { label: __("SQL", "betterdocs"), value: "sql" },
    { label: __("XML", "betterdocs"), value: "xml" },
    { label: __("C++", "betterdocs"), value: "cpp" },
    { label: __("C#", "betterdocs"), value: "csharp" },
    { label: __("Go", "betterdocs"), value: "go" },
    { label: __("Rust", "betterdocs"), value: "rust" },
    { label: __("Swift", "betterdocs"), value: "swift" },
    { label: __("Kotlin", "betterdocs"), value: "kotlin" },
    { label: __("TypeScript", "betterdocs"), value: "typescript" },
];

// Theme Options
export const THEME_OPTIONS = [
    { label: __("Light", "betterdocs"), value: "light" },
    { label: __("Dark", "betterdocs"), value: "dark" },
];

// Default Code Placeholder
export const DEFAULT_CODE_PLACEHOLDER = `// Paste or type your code here…`;
