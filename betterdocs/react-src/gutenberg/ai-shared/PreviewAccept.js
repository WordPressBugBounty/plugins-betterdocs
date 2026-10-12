// ===== ai-shared/PreviewAccept.js — shared Preview / Accept surface =====
// Ported from the AI Studio mockup (ai-preview.jsx) and adapted to render REAL
// generated HTML (the OpenAI response) instead of the mockup's block array.
// Reused by BOTH the Write-with-AI modal (doc preview) and the Edit-with-AI
// modal (replace preview). Nothing is written anywhere except via onKeep.

import { __ } from "@wordpress/i18n";
import {
    AIPill, Banner, Spinner, WorkingDots, TextBtn, GhostBtn, PrimaryBtn,
    IcRefresh, IcCheck,
} from "./kit";

// Headings for the error banner. A code that is missing here falls back to the
// generic "Couldn't generate", which tells the author nothing about a problem
// they could actually fix — so every code the attachment paths can raise is
// named, not just the transport-level ones.
export const ERR_LABEL = {
    rate_limit: __("Rate limited", "betterdocs"),
    timeout: __("Request timed out", "betterdocs"),
    empty: __("Empty result", "betterdocs"),
    missing_key: __("API key required", "betterdocs"),

    // Attachments — the file never made it far enough to generate.
    ai_file_too_large: __("File too large", "betterdocs"),
    ai_bad_filetype: __("Unsupported file type", "betterdocs"),
    ai_upload_failed: __("Upload didn't finish", "betterdocs"),
    ai_read_failed: __("Couldn't read that file", "betterdocs"),
    ai_bad_image: __("Not a readable image", "betterdocs"),
    ai_bad_media: __("Not a readable recording", "betterdocs"),
    ai_empty_attachment: __("Nothing to read", "betterdocs"),
    ai_pdf_encrypted: __("PDF is password-protected", "betterdocs"),
    ai_pdf_no_text: __("PDF has no readable text", "betterdocs"),

    // Recordings.
    ai_no_speech: __("No speech found", "betterdocs"),
    ai_no_transcription: __("Platform can't read recordings", "betterdocs"),
    ai_transcribe_failed: __("Transcription failed", "betterdocs"),

    // Images.
    ai_no_vision: __("Model can't read images", "betterdocs"),
};

// Rough word/section counts straight off the generated HTML string.
const htmlStats = (html) => {
    if (!html) return { words: 0, sections: 0 };
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const text = (tmp.textContent || "").trim();
    const words = text ? text.split(/\s+/).length : 0;
    const sections = tmp.querySelectorAll("h2").length;
    return { words, sections };
};

// shimmer skeleton lines while generating
export const SkeletonLines = ({ rows = [92, 100, 78, 0, 64, 100, 88, 70] }) => (
    <div style={{ marginTop: 4 }}>
        {rows.map((w, i) => w === 0
            ? <div key={i} style={{ height: 12 }} />
            : <div key={i} style={{
                height: 12, width: `${w}%`, margin: "11px 0", borderRadius: 6,
                background: "linear-gradient(90deg,#EEF1F5 25%,#F6F8FA 37%,#EEF1F5 63%)",
                backgroundSize: "480px 100%", animation: "bd-ai-shimmer 1.3s linear infinite",
            }} />
        )}
    </div>
);

export const LoadingState = ({ label = __("Generating", "betterdocs") }) => {
    // Ash tone (matches the skeleton shimmer) so the loading row reads as a quiet
    // placeholder rather than a green accent.
    const ash = "var(--text-color-500, #98a2b3)";
    return (
        <div style={{ padding: "6px 2px 2px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: ash, fontWeight: 700, fontSize: 13.5, marginBottom: 14 }}>
                <Spinner size={18} color={ash} /> <span>{label}<WorkingDots color={ash} /></span>
            </div>
            <SkeletonLines />
        </div>
    );
};

// Rendered HTML preview surface (the "DocPreview" equivalent).
const DocHtml = ({ html }) => (
    <div className="bd-ai-doc-preview" style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-2)", animation: "bd-ai-blockIn .4s ease both" }}
        dangerouslySetInnerHTML={{ __html: html }} />
);

// The core body. `mode` is "doc" (rendered HTML) or "replace" (text in/out).
export const PreviewAccept = ({
    mode = "doc", html, original, suggestion,
    status = "ready", loadingLabel = __("Generating", "betterdocs"), error,
    onKeep, onRegenerate, onDiscard, actions,
    keepLabel = __("Keep", "betterdocs"), maxHeight = 360,
}) => {
    const stats = status === "ready" && mode === "doc" ? htmlStats(html) : null;
    return (
        <div>
            {/* meta row above the preview — only once generation is done, so the
                "AI generated" pill never shows over the loading skeleton. */}
            {status === "ready" && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                    <AIPill />
                    {mode === "doc" && stats && (
                        <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, whiteSpace: "nowrap" }}>
                            ≈ {stats.words} {__("words", "betterdocs")} · {stats.sections} {__("sections", "betterdocs")}
                        </span>
                    )}
                    {mode === "replace" && (
                        <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, whiteSpace: "nowrap" }}>{__("Replaces your selection", "betterdocs")}</span>
                    )}
                </div>
            )}

            {/* preview surface */}
            <div style={{
                border: "1px solid var(--border)", borderRadius: 12,
                background: status === "error" ? "white" : "#fcfcfd",
                padding: status === "loading" ? "18px 18px 22px" : "18px 20px",
                maxHeight, overflowY: "auto",
            }}>
                {status === "loading" && <LoadingState label={loadingLabel} />}

                {status === "error" && (
                    <div style={{ padding: "4px 0" }}>
                        <Banner tone="error">
                            <strong style={{ fontWeight: 700 }}>{ERR_LABEL[error?.code] || __("Something went wrong", "betterdocs")}.</strong>{" "}
                            {error?.message}
                        </Banner>
                    </div>
                )}

                {status === "ready" && mode === "doc" && <DocHtml html={html} />}

                {status === "ready" && mode === "replace" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {original != null && (
                            <>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: "var(--muted-2)", marginBottom: 6 }}>{__("Current selection", "betterdocs")}</div>
                                    <div style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, textDecoration: "line-through", textDecorationColor: "rgba(107,114,128,.35)" }}>{original}</div>
                                </div>
                                <div style={{ height: 1, background: "var(--border-soft)" }} />
                            </>
                        )}
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: "var(--text-color-700, #344054)", marginBottom: 6 }}>{__("Suggested replacement", "betterdocs")}</div>
                            <div className="bd-ai-doc-preview" style={{ fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.7, animation: "bd-ai-blockIn .4s ease both" }}
                                dangerouslySetInnerHTML={{ __html: suggestion }} />
                        </div>
                    </div>
                )}
            </div>

            {/* action row — caller may override the whole row via `actions` */}
            {actions ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18 }}>{actions}</div>
            ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18 }}>
                    <TextBtn onClick={onDiscard} style={{ marginRight: "auto" }}>{__("Discard", "betterdocs")}</TextBtn>
                    {onRegenerate && (
                        <GhostBtn icon={<IcRefresh size={15} />} onClick={onRegenerate} style={{
                            opacity: status === "loading" ? 0.5 : 1, pointerEvents: status === "loading" ? "none" : "auto",
                        }}>{__("Regenerate", "betterdocs")}</GhostBtn>
                    )}
                    <PrimaryBtn icon={<IcCheck size={16} sw={2.4} />} onClick={onKeep} disabled={status !== "ready"}>{keepLabel}</PrimaryBtn>
                </div>
            )}
        </div>
    );
};
