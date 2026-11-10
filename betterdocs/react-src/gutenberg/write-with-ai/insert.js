// ===== write-with-ai/insert.js — content processing + Gutenberg insertion =====
// Ports the proven helpers from the legacy inline template
// (WriteWithAI::writeWithAIForm): strip code fences, unwrap <body>, drop the
// first <h1>, wrap headings + keywords in <span class="highlight">, then convert
// to blocks via rawHandler and insert (overwrite vs. insert-after).

import { dispatch, select } from "@wordpress/data";
import { rawHandler } from "@wordpress/blocks";
import { sanitizeHtml } from "../../utils/sanitizeHtml";

const escapeHtml = (str) =>
    String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const stripCodeFences = (htmlString) => {
    if (!htmlString) return "";
    return htmlString
        .replace(/^\s*```(?:html|HTML)?\s*\n?/, "")
        .replace(/\n?\s*```\s*$/, "");
};

// Every helper below parses the AI response with innerHTML on a detached <div>,
// where an <img onerror> still fires, so the body is sanitised here — the one
// place the raw response enters — before anything parses or previews it.
const getBodyContent = (htmlString) => {
    if (!htmlString) return "";
    const cleaned = stripCodeFences(htmlString);
    const match = cleaned.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (match) {
        return sanitizeHtml(match[1].replace(/<p>\s+/g, "<p>"));
    }
    return sanitizeHtml(cleaned);
};

// Pull the AI-generated title out of the raw response: the first <h1>'s text.
// Used when title generation was requested; the h1 itself is stripped from the
// body by removeFirstHeading/cleanGeneratedHtml so it never lands in the content.
export const extractFirstHeading = (rawHtml) => {
    const html = getBodyContent(rawHtml);
    const host = document.createElement("div");
    host.innerHTML = html;
    const h1 = host.querySelector("h1");
    return h1 ? (h1.textContent || "").trim() : "";
};

const removeFirstHeading = (htmlString) => {
    const newDiv = document.createElement("div");
    newDiv.innerHTML = htmlString;
    const firstHeading = newDiv.querySelector("h1");
    if (firstHeading) {
        firstHeading.parentNode.removeChild(firstHeading);
    }
    return newDiv.innerHTML;
};

const wrapWithHighlight = (inputString, keywords) => {
    if (!inputString) return "";

    const container = document.createElement("div");
    container.innerHTML = inputString;

    // Wrap each heading's visible text with the highlight span (skip if present)
    container.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
        if (heading.querySelector(".highlight")) return;
        const text = heading.textContent;
        if (!text || !text.trim()) return;
        heading.innerHTML = '<span class="highlight">' + escapeHtml(text) + "</span>";
    });

    // Wrap keywords only inside text nodes — never inside attributes/code/highlights
    const keywordList = (keywords || "")
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

    if (keywordList.length) {
        const pattern = new RegExp("\\b(" + keywordList.map(escapeRegex).join("|") + ")\\b", "gi");
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => {
                let parent = node.parentNode;
                while (parent && parent !== container) {
                    if (parent.nodeType === 1) {
                        const tag = parent.tagName.toLowerCase();
                        if (tag === "code" || tag === "pre") return NodeFilter.FILTER_REJECT;
                        if (parent.classList && parent.classList.contains("highlight")) return NodeFilter.FILTER_REJECT;
                    }
                    parent = parent.parentNode;
                }
                return NodeFilter.FILTER_ACCEPT;
            },
        });

        const textNodes = [];
        let current;
        while ((current = walker.nextNode())) {
            textNodes.push(current);
        }

        textNodes.forEach((textNode) => {
            pattern.lastIndex = 0;
            if (!pattern.test(textNode.nodeValue)) return;
            pattern.lastIndex = 0;
            const fragmentHost = document.createElement("span");
            fragmentHost.innerHTML = escapeHtml(textNode.nodeValue).replace(pattern, '<span class="highlight">$1</span>');
            const parent = textNode.parentNode;
            while (fragmentHost.firstChild) {
                parent.insertBefore(fragmentHost.firstChild, textNode);
            }
            parent.removeChild(textNode);
        });
    }

    return container.innerHTML;
};

// Normalize the raw OpenAI HTML into clean body content (used by the preview too).
export const cleanGeneratedHtml = (rawHtml, keywords = "") => {
    let html = getBodyContent(rawHtml);
    html = removeFirstHeading(html);
    html = wrapWithHighlight(html, keywords);
    return html;
};

// Insert processed HTML into the editor. `isOverwrite` replaces all blocks;
// otherwise inserts after the selected block (or at the end).
export const insertContentToEditor = ({ title, html, isOverwrite }) => {
    const blocks = rawHandler({ HTML: html });

    if (title) {
        dispatch("core/editor").editPost({ title });
    }

    const hasExistingContent = (select("core/block-editor").getBlocks() || []).length > 0;
    const selectedBlockClientId = select("core/block-editor").getSelectedBlockClientId();

    if (isOverwrite || !hasExistingContent) {
        const allBlocks = select("core/block-editor").getBlocks();
        const ids = allBlocks.map((b) => b.clientId);
        if (ids.length) {
            dispatch("core/block-editor").removeBlocks(ids);
        }
        dispatch("core/block-editor").insertBlocks(blocks);
    } else if (selectedBlockClientId) {
        const selectedIndex = select("core/block-editor").getBlockIndex(selectedBlockClientId);
        dispatch("core/block-editor").insertBlocks(blocks, selectedIndex + 1);
    } else {
        dispatch("core/block-editor").insertBlocks(blocks);
    }
};
