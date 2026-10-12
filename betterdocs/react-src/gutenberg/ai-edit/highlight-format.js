import { __ } from "@wordpress/i18n";
import { registerFormatType, toggleFormat } from "@wordpress/rich-text";
import { RichTextToolbarButton } from "@wordpress/block-editor";

const FORMAT_NAME = "betterdocs/highlight";

const highlightIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M5 18l3.5-3.5 6-6L18 12l-7 7H5v-1zm10.5-13.5l3 3-2 2-3-3 2-2z" fill="currentColor" />
    </svg>
);

const Edit = ({ isActive, value, onChange }) => (
    <RichTextToolbarButton
        icon={highlightIcon}
        title={__("Highlight", "betterdocs")}
        onClick={() => onChange(toggleFormat(value, { type: FORMAT_NAME }))}
        isActive={isActive}
    />
);

registerFormatType(FORMAT_NAME, {
    title: __("Highlight", "betterdocs"),
    tagName: "span",
    className: "highlight",
    edit: Edit,
});
