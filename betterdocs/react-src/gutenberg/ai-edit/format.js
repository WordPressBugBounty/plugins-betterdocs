import { __ } from "@wordpress/i18n";
import { registerFormatType, slice, toHTMLString } from "@wordpress/rich-text";
import { RichTextToolbarButton } from "@wordpress/block-editor";
import { dispatch, select } from "@wordpress/data";
import { STORE_KEY } from "./store";

const FORMAT_NAME = "betterdocs/ai-edit";

const aiIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3zm7 10l.95 2.3L22.25 16.25l-2.3.95L19 19.5l-.95-2.3L15.75 16.25l2.3-.95L19 13zM5 15l.7 1.7 1.7.7-1.7.7L5 19.8l-.7-1.7L2.6 17.4l1.7-.7L5 15z" fill="currentColor"/>
    </svg>
);

const Edit = ({ value, isActive, onChange }) => {
    const onClick = () => {
        const start = typeof value.start === "number" ? value.start : 0;
        const end = typeof value.end === "number" ? value.end : start;

        if (end <= start) {
            return;
        }

        const sliced = slice(value, start, end);
        const plain = sliced.text || "";
        const html = toHTMLString({ value: sliced });

        const selectedBlock = select("core/block-editor").getSelectedBlock();

        dispatch(STORE_KEY).openModal({
            selectionType: "inline",
            selectionText: plain,
            selectionHtml: html,
            blockClientId: selectedBlock ? selectedBlock.clientId : null,
            inlineContext: {
                start,
                end,
                formatName: FORMAT_NAME,
            },
        });
    };

    return (
        <RichTextToolbarButton
            icon={aiIcon}
            title={__("Edit with BetterDocs AI", "betterdocs")}
            onClick={onClick}
            isActive={isActive}
        />
    );
};

registerFormatType(FORMAT_NAME, {
    title: __("BetterDocs AI", "betterdocs"),
    tagName: "span",
    className: "betterdocs-ai-edit-marker",
    edit: Edit,
});
