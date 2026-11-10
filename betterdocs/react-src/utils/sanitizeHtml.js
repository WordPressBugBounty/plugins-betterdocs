/**
 * Sanitise HTML before it reaches dangerouslySetInnerHTML.
 *
 * For markup we did not write ourselves: AI responses (which a prompt, an
 * attached PDF or a scraped page can steer into emitting <script>, <img
 * onerror> or javascript: links) and anything a visitor typed. DOMPurify's
 * default HTML profile keeps the formatting those surfaces need (headings,
 * paragraphs, lists, links, code/pre, tables, bold/italic) and drops scripts,
 * event handlers, <style>, forms and unsafe URL schemes.
 *
 * `target` is not in DOMPurify's default allow-list, so it is added back for
 * links an AI asked to open in a new tab; such links are always given
 * rel="noopener noreferrer" so the opened page cannot reach window.opener.
 */
import DOMPurify from "dompurify";

let hooked = false;

const ensureHooks = () => {
    if (hooked || !DOMPurify.isSupported) {
        return;
    }
    hooked = true;

    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
        if (node.tagName !== "A" || !node.hasAttribute("target")) {
            return;
        }
        const target = node.getAttribute("target");
        if (target !== "_blank" && target !== "_self") {
            node.removeAttribute("target");
            return;
        }
        if (target === "_blank") {
            const rel = (node.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
            ["noopener", "noreferrer"].forEach((token) => {
                if (!rel.includes(token)) rel.push(token);
            });
            node.setAttribute("rel", rel.join(" "));
        }
    });
};

const purify = (html) =>
    DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
        ADD_ATTR: ["target"],
        FORBID_TAGS: ["style", "form", "input", "button", "textarea", "select"],
    });

/*
 * Gutenberg block delimiters (`<!-- wp:name {"attrs"} -->`, `<!-- /wp:name -->`,
 * `<!-- wp:name /-->`) are HTML comments, which DOMPurify always drops, so AI
 * output written as block markup would lose its block attributes. When the
 * HTML contains delimiters, the markup between them is sanitised segment by
 * segment and each delimiter is put back verbatim — but only if every one
 * matches this strict grammar. The attrs JSON may not contain `<`, `>` or `--`
 * (core's serializer escapes all three as \u003c, \u003e, \u002d\u002d), so a
 * kept comment cannot close early or smuggle markup. Because rawHandler hands
 * delimited markup straight to the block parser, attribute values bypass
 * DOMPurify; any string value holding markup or a script-capable URL scheme
 * rejects the delimiters too. On any rejection every delimiter is dropped and
 * the whole string is sanitised as before.
 */
const DELIMITER_CANDIDATE = /<!--\s+\/?wp:[\s\S]*?-->/g;
const DELIMITER_STRICT =
    /^<!--\s+(\/)?wp:(?:[a-z][a-z0-9_-]*\/)?[a-z][a-z0-9_-]*\s+(?:(\{[^<>]*\})\s+)?(\/)?-->$/;
const UNSAFE_SCHEME = /^(?:javascript|vbscript|data):/i;

const safeAttrValue = (value) => {
    if (typeof value === "string") {
        const compact = value.replace(/[\u0000-\u0020\u007f-\u009f]/g, "");
        // `&#…;` / `&colon;` can spell a scheme once a sloppy render echoes
        // the value into an attribute, so entity-like sequences are refused.
        return !/[<>]/.test(value) && !/&(?:#|colon|tab|newline)/i.test(value) && !UNSAFE_SCHEME.test(compact);
    }
    if (Array.isArray(value)) {
        return value.every(safeAttrValue);
    }
    if (value && typeof value === "object") {
        return Object.keys(value).every((key) => safeAttrValue(key) && safeAttrValue(value[key]));
    }
    return true;
};

const isSafeDelimiter = (comment) => {
    const match = DELIMITER_STRICT.exec(comment);
    if (!match) {
        return false;
    }
    const [, closer, attrs, selfClosing] = match;
    if (closer && (attrs || selfClosing)) {
        return false;
    }
    if (!attrs) {
        return true;
    }
    if (attrs.includes("--")) {
        return false;
    }
    try {
        const parsed = JSON.parse(attrs);
        return !!parsed && typeof parsed === "object" && !Array.isArray(parsed) && safeAttrValue(parsed);
    } catch (e) {
        return false;
    }
};

const sanitizeWithBlockDelimiters = (html) => {
    const delimiters = html.match(DELIMITER_CANDIDATE);
    if (!delimiters || !delimiters.every(isSafeDelimiter)) {
        return purify(html);
    }
    return html
        .split(DELIMITER_CANDIDATE)
        .map((segment, i) => purify(segment) + (i < delimiters.length ? delimiters[i] : ""))
        .join("");
};

export const sanitizeHtml = (html) => {
    if (html === null || html === undefined || html === "") {
        return "";
    }
    ensureHooks();
    const str = String(html);
    return str.includes("<!--") ? sanitizeWithBlockDelimiters(str) : purify(str);
};

export default sanitizeHtml;
