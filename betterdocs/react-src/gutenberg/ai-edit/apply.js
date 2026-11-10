import { dispatch, select } from "@wordpress/data";
import { create, insert, toHTMLString } from "@wordpress/rich-text";
import { rawHandler } from "@wordpress/blocks";
import { sanitizeHtml } from "../../utils/sanitizeHtml";

// The preview sanitises only what it shows, so the raw AI result is sanitised
// again here, right before it becomes blocks: an <img onerror> or javascript:
// link hidden from the preview must not reach the post either.
const toBlocks = (resultHtml) => {
    const html = sanitizeHtml(resultHtml);
    return html ? rawHandler({ HTML: html }) : [];
};

export const applyBlockReplace = (clientId, resultHtml) => {
    if (!clientId || !resultHtml) {
        return false;
    }

    const newBlocks = toBlocks(resultHtml);
    if (!newBlocks || !newBlocks.length) {
        return false;
    }

    dispatch("core/block-editor").replaceBlock(clientId, newBlocks);
    return true;
};

export const applyInsertAfter = (clientId, resultHtml) => {
    if (!resultHtml) {
        return false;
    }

    const newBlocks = toBlocks(resultHtml);
    if (!newBlocks || !newBlocks.length) {
        return false;
    }

    const rootClientId = clientId
        ? select("core/block-editor").getBlockRootClientId(clientId) || ""
        : "";
    const index = clientId
        ? select("core/block-editor").getBlockIndex(clientId, rootClientId) + 1
        : select("core/block-editor").getBlockCount();

    dispatch("core/block-editor").insertBlocks(newBlocks, index, rootClientId);
    return true;
};

// DOMParser gives an inert document, so markup in the AI result (an <img
// onerror>, say) cannot run while we read its text.
const plainFromHtml = (html) => {
    const body = new DOMParser().parseFromString(String(html || ""), "text/html").body;
    return (body && body.textContent) || "";
};

export const applyInlineReplace = (clientId, inlineContext, resultText) => {
    if (!clientId || !inlineContext) {
        return false;
    }

    const block = select("core/block-editor").getBlock(clientId);
    if (!block || !block.attributes) {
        return false;
    }

    const targetAttr =
        block.name === "core/heading" || block.name === "core/paragraph" || block.name === "core/list-item"
            ? "content"
            : null;

    if (!targetAttr || typeof block.attributes[targetAttr] !== "string") {
        return false;
    }

    const currentValue = create({ html: block.attributes[targetAttr] });
    const replacement = create({ text: plainFromHtml(resultText).replace(/\n+/g, " ") });

    const { start, end } = inlineContext;
    const safeStart = Math.min(Math.max(0, start), currentValue.text.length);
    const safeEnd = Math.min(Math.max(safeStart, end), currentValue.text.length);

    const newValue = insert(currentValue, replacement, safeStart, safeEnd);

    const newHtml = toHTMLString({ value: newValue });

    dispatch("core/block-editor").updateBlockAttributes(clientId, {
        [targetAttr]: newHtml,
    });

    return true;
};
