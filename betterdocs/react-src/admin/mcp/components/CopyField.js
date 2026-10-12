import React, { useState } from "react";
import { __ } from "@wordpress/i18n";
import { IconCheck, IconCopy } from "./Icons";

/**
 * A read-only value with a copy button — the page's workhorse, used for the
 * endpoint URLs, the connection token, the CLI one-liner, the JSON block and
 * the AI prompt.
 *
 * `secret` renders the value masked until the user asks to see it: the
 * connection token is admin-equivalent, and an admin screenshotting this page
 * for support should not have to think about redacting it first.
 */
export default function CopyField({ label, value, help, multiline = false, secret = false }) {
    const [copied, setCopied] = useState(false);
    const [revealed, setRevealed] = useState(false);

    const copy = () => {
        if (!value) return;
        const done = () => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        };
        // The async Clipboard API needs a secure context; the textarea fallback
        // covers plain-HTTP installs, where this page still has to work.
        if (window.navigator.clipboard?.writeText) {
            window.navigator.clipboard.writeText(value).then(done, fallbackCopy);
        } else {
            fallbackCopy();
        }
        function fallbackCopy() {
            const el = document.createElement("textarea");
            el.value = value;
            el.setAttribute("readonly", "");
            el.style.position = "fixed";
            el.style.opacity = "0";
            document.body.appendChild(el);
            el.select();
            try {
                document.execCommand("copy");
                done();
            } finally {
                document.body.removeChild(el);
            }
        }
    };

    // A fixed-length mask, not one bullet per character: the real token is 64
    // characters and would wrap to three lines of dots, and its length is not
    // something worth showing anyway.
    const masked = secret && !revealed && value ? "•".repeat(24) : value;

    return (
        <div className="bd-mcp-field">
            {label && <span className="bd-mcp-field__label">{label}</span>}
            <div className={`bd-mcp-field__control${multiline ? " is-block" : ""}`}>
                {multiline ? (
                    <pre className="bd-mcp-field__pre">{masked}</pre>
                ) : (
                    <code className="bd-mcp-field__value">{masked}</code>
                )}
                <div className="bd-mcp-field__actions">
                    {secret && (
                        <button type="button" className="bda-btn ghost sm" onClick={() => setRevealed((v) => !v)}>
                            {revealed ? __("Hide", "betterdocs") : __("Show", "betterdocs")}
                        </button>
                    )}
                    <button
                        type="button"
                        className="bda-btn ghost sm bd-mcp-field__copy"
                        onClick={copy}
                        disabled={!value}
                        aria-label={label ? `${__("Copy", "betterdocs")} — ${label}` : __("Copy", "betterdocs")}
                    >
                        {copied ? <IconCheck /> : <IconCopy />}
                        {copied ? __("Copied", "betterdocs") : __("Copy", "betterdocs")}
                    </button>
                </div>
            </div>
            {help && <span className="bd-mcp-field__help">{help}</span>}
        </div>
    );
}
