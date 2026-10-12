import { __ } from "@wordpress/i18n";
import { createHigherOrderComponent } from "@wordpress/compose";
import { addFilter } from "@wordpress/hooks";
import { BlockControls } from "@wordpress/block-editor";
import { ToolbarGroup, ToolbarButton } from "@wordpress/components";
import { dispatch, select } from "@wordpress/data";
import { serialize } from "@wordpress/blocks";
import { Fragment } from "@wordpress/element";
import { STORE_KEY } from "./store";

const SUPPORTED_BLOCKS = [
    "core/paragraph",
    "core/heading",
    "core/list",
    "core/list-item",
    "core/quote",
    "core/pullquote",
    "core/preformatted",
    "core/verse",
    "core/code",
    "core/details",
    "core/group",
    "core/columns",
    "core/column",
];

const aiIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3zm7 10l.95 2.3L22.25 16.25l-2.3.95L19 19.5l-.95-2.3L15.75 16.25l2.3-.95L19 13zM5 15l.7 1.7 1.7.7-1.7.7L5 19.8l-.7-1.7L2.6 17.4l1.7-.7L5 15z" fill="currentColor"/>
    </svg>
);

const isSupported = (name) => SUPPORTED_BLOCKS.indexOf(name) !== -1;

const withAIBlockControl = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const { name, isSelected, clientId } = props;

        if (!isSelected || !isSupported(name)) {
            return <BlockEdit {...props} />;
        }

        const onClick = () => {
            const block = select("core/block-editor").getBlock(clientId);
            if (!block) {
                return;
            }

            const html = serialize([block]);

            const tmp = document.createElement("div");
            tmp.innerHTML = html;
            const plain = (tmp.textContent || tmp.innerText || "")
                .replace(/\r\n?/g, "\n")
                .replace(/[ \t]+/g, " ")
                .replace(/[ \t]*\n[ \t]*/g, "\n")
                .replace(/\n{2,}/g, "\n\n")
                .trim();

            dispatch(STORE_KEY).openModal({
                selectionType: "block",
                selectionText: plain,
                selectionHtml: html,
                blockClientId: clientId,
                inlineContext: null,
            });
        };

        return (
            <Fragment>
                <BlockEdit {...props} />
                <BlockControls group="other">
                    <ToolbarGroup>
                        <ToolbarButton
                            icon={aiIcon}
                            label={__("Edit with BetterDocs AI", "betterdocs")}
                            onClick={onClick}
                        />
                    </ToolbarGroup>
                </BlockControls>
            </Fragment>
        );
    };
}, "withAIBlockControl");

addFilter("editor.BlockEdit", "betterdocs/ai-edit-block-control", withAIBlockControl);
