// ===== write-with-ai/StudioGenerateModal.js — "Write Documentation with BetterDocs AI" =====
// Superset modal ported from the AI Studio mockup (studio-modal.jsx + the
// OutlineEditor from ai-modal.jsx), wired to the real REST endpoint and real
// Gutenberg insertion. Brand-voice chips are intentionally omitted (deferred).
// The token meter markup is built but kept hidden for now.

import { __, sprintf } from "@wordpress/i18n";
import { normalizeAIError } from "../../utils/aiErrorMessage";
import { useState, useEffect, useRef } from "@wordpress/element";
import { dispatch, select } from "@wordpress/data";

import {
    Modal, AIcon, FieldLabel, TextInput, TextArea, Pick, DropdownSelect, Toggle, Banner,
    PrimaryBtn, GhostBtn, TextBtn,
    IcList, IcSummary, IcChevDown, IcPlus, IcTrash, IcGrip, IcArrowR, IcRefresh, IcCheck, AIPill, AIMarkWhite,
} from "../ai-shared/kit";
import { PreviewAccept, ERR_LABEL } from "../ai-shared/PreviewAccept";
import InstructionPicker from "../ai-shared/InstructionPicker";
import { callWriteWithAI, callWriteWithAIMultipart, getConfig, suggestTerms } from "./api";
import { cleanGeneratedHtml, extractFirstHeading, insertContentToEditor } from "./insert";
import SuggestTermsPreview from "./SuggestTermsPreview";
import GitBrowse from "./GitBrowse";

// Tone + length selectors. The empty/"any" values send no directive (backend default).
const TONE_OPTIONS = [
    { value: "", label: __("Default", "betterdocs") },
    { value: "friendly", label: __("Friendly", "betterdocs") },
    { value: "technical", label: __("Technical", "betterdocs") },
    { value: "formal", label: __("Formal", "betterdocs") },
    { value: "casual", label: __("Casual", "betterdocs") },
];

const SIZE_OPTIONS = [
    { value: "any", label: __("Any", "betterdocs") },
    { value: "short", label: __("Short", "betterdocs") },
    { value: "medium", label: __("Medium", "betterdocs") },
    { value: "long", label: __("Long", "betterdocs") },
];

// ── Local icons (sliders for the settings accordion, sparkle for "Generate") ──
const IcSliders = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" />
        <circle cx="9" cy="7" r="2.2" fill="white" /><circle cx="15" cy="12" r="2.2" fill="white" /><circle cx="9" cy="17" r="2.2" fill="white" />
    </svg>
);
const IcSpark = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white" stroke="none">
        <path d="M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9z" />
        <path d="M19 14l.9 2.4L22 17l-2.1.6L19 20l-.9-2.4L16 17l2.1-.6z" />
    </svg>
);
// Pencil that inherits the tab's color (currentColor) — the kit's AIMark is fixed to the AI accent.
const IcPencil = (p) => (
    <AIcon {...p}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </AIcon>
);
// Git branch glyph (inherits currentColor) for the "From Git" tab.
const IcGit = (p) => (
    <AIcon {...p}>
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="6" cy="18" r="2.5" />
        <circle cx="18" cy="9" r="2.5" />
        <path d="M6 8.5v7" />
        <path d="M18 11.5a6 6 0 0 1-6 6H8.5" />
    </AIcon>
);
// Paperclip glyph for the "From Attachment" tab (inherits currentColor).
const IcPaperclip = (p) => (
    <AIcon {...p}>
        <path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3 3 0 0 1 4.24 4.24l-9.2 9.19a1 1 0 0 1-1.41-1.41l8.49-8.49" />
    </AIcon>
);
// Padlock + star — for the "Pro feature" upsell panel (inherit currentColor).
const IcLock = (p) => (
    <AIcon {...p}>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </AIcon>
);
const IcProStar = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2l2.6 6.3L21 9l-5 4.1L17.5 21 12 17.3 6.5 21 8 13.1 3 9l6.4-.7z" />
    </svg>
);

// ── Underline tabs (Prompt | From source) ────────────────────────────────────
// Typography, colour and active border-bottom mirror the admin
// `.betterdocs-metabox-tabs` (see react-src/admin/scss/unified-metabox.scss):
// 14px / 1.5 / weight 500, inactive #d0d5dd, active + hover green (#00b884),
// active gets a 2px green bottom border.
const Segmented = ({ value, onChange, tabs }) => (
    <div style={{ display: "inline-flex", gap: 12 }}>
        {tabs.map((t) => {
            const active = value === t.id;
            const idle = "var(--text-color-400, #d0d5dd)";
            return (
                <button key={t.id} type="button" onClick={() => onChange(t.id)} style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "4px 4px 13px", border: "none", background: "transparent", cursor: "pointer",
                    borderBottom: `2px solid ${active ? "var(--green)" : "transparent"}`, marginBottom: -1,
                    fontSize: 14, lineHeight: 1.5, fontWeight: 500, whiteSpace: "nowrap",
                    color: active ? "var(--green)" : idle,
                    transition: "color .2s ease, border-color .2s ease",
                }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "var(--green)"; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = idle; }}>
                    {t.icon}{t.label}
                </button>
            );
        })}
    </div>
);

// ── Segmented choice control (tone / length) ─────────────────────────────────
// Segmented choice control (tone / length) — mirrors .betterdocs-faq-page-tabs:
// a white bordered track with a soft shadow; the active segment gets the ash
// (--text-color-50) fill + green (--base-color-700) label.
const SegControl = ({ value, onChange, options }) => (
    <div style={{ display: "flex", gap: 2, flex: 1, background: "var(--base-background, #fff)", border: "1px solid var(--text-color-200, #eaecf0)", padding: 4, borderRadius: 8 }}>
        {options.map((o) => {
            const active = value === o.value;
            return (
                <button key={o.value || "default"} type="button" onClick={() => onChange(o.value)} style={{
                    flex: "1 1 0", minWidth: 0, padding: "7px 6px", borderRadius: 9, border: "none", cursor: "pointer",
                    fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    background: active ? "var(--text-color-50, #f9fafb)" : "transparent",
                    color: active ? "var(--green)" : "var(--muted)",
                    transition: "background .12s, color .12s",
                }}>
                    {o.label}
                </button>
            );
        })}
    </div>
);

// ── Quick prompt chip (From Git) — toggles a starter snippet into the prompt ──
const QuickChip = ({ active, onClick, children }) => (
    <button type="button" onClick={onClick} style={{
        display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 11px", borderRadius: 999, cursor: "pointer",
        fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap",
        border: `1px solid ${active ? "var(--green)" : "var(--text-color-200, #eaecf0)"}`,
        background: active ? "rgba(0,184,132,.08)" : "var(--base-background, #fff)",
        color: active ? "var(--green)" : "var(--ink-2)",
        transition: "background .12s, border-color .12s, color .12s",
    }}
        onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = "var(--text-color-300, #dde2e4)"; e.currentTarget.style.background = "#f4f6f8"; } }}
        onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = "var(--text-color-200, #eaecf0)"; e.currentTarget.style.background = "var(--base-background, #fff)"; } }}>
        <span style={{ display: "flex" }}>{active ? <IcCheck size={13} sw={2.6} /> : <IcPlus size={13} sw={2.2} />}</span>
        {children}
    </button>
);

// ── One row inside the Advanced settings card ────────────────────────────────
const SettingRow = ({ label, children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0" }}>
        <span style={{ width: 62, flexShrink: 0, fontSize: 13, fontWeight: 700, color: "var(--ink-2)" }}>{label}</span>
        {children}
    </div>
);
const ToggleRow = ({ title, subtitle, checked, onChange }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "14px 0" }}>
        <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>{title}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{subtitle}</div>
        </div>
        <Toggle checked={checked} onChange={onChange} />
    </div>
);

// ── Read-only platform + model indicator ─────────────────────────────────────
const ModelPill = ({ platform, model }) => {
    const label = [platform, model].filter(Boolean).join(" · ");
    if (!label) return null;
    return (
        <span title={__("AI platform & model configured in BetterDocs → Settings → AI", "betterdocs")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 11px", borderRadius: 999, background: "var(--text-color-50, #f9fafb)",
            border: "1px solid var(--border)", fontSize: 12, fontWeight: 700, color: "var(--ink-2)", whiteSpace: "nowrap",
        }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)" }} />
            {label}
        </span>
    );
};

// ── Token meter — markup built but hidden for now (design-complete, inactive) ──
const TokenMeter = ({ estimated = 0, max = 4000, hidden = true }) => {
    const pct = Math.min(100, Math.round((estimated / max) * 100));
    return (
        <div data-bd-token-meter style={{ display: hidden ? "none" : "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted-2)", whiteSpace: "nowrap" }}>
                {__("Tokens", "betterdocs")}
            </span>
            <span style={{ position: "relative", width: 90, height: 6, borderRadius: 999, background: "#eef0f3", overflow: "hidden" }}>
                <span style={{ position: "absolute", inset: 0, width: `${pct}%`, background: "var(--ai)", borderRadius: 999 }} />
            </span>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--muted)", whiteSpace: "nowrap" }}>
                ~{estimated}/{max}
            </span>
        </div>
    );
};

// ── Editable outline (H2/H3, drag to reorder, inline edit, add/remove) ────────
const OutlineEditor = ({ items, setItems, onExpand, onRegenerate, onDiscard }) => {
    const [dragId, setDragId] = useState(null);
    const [overId, setOverId] = useState(null);

    const move = (from, to) => {
        setItems((list) => {
            const next = [...list];
            const [m] = next.splice(from, 1);
            next.splice(to, 0, m);
            return next;
        });
    };
    const onDrop = (targetId) => {
        const from = items.findIndex((i) => i.id === dragId);
        const to = items.findIndex((i) => i.id === targetId);
        if (from > -1 && to > -1 && from !== to) move(from, to);
        setDragId(null); setOverId(null);
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <AIPill>{__("AI outline", "betterdocs")}</AIPill>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                    {sprintf(__("%d sections · drag to reorder", "betterdocs"), items.length)}
                </span>
            </div>

            <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 8, maxHeight: 340, overflowY: "auto" }}>
                {items.map((it) => {
                    const isH3 = it.level === "h3";
                    return (
                        <div key={it.id}
                            draggable
                            onDragStart={() => setDragId(it.id)}
                            onDragOver={(e) => { e.preventDefault(); setOverId(it.id); }}
                            onDrop={() => onDrop(it.id)}
                            onDragEnd={() => { setDragId(null); setOverId(null); }}
                            style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "7px 8px", marginLeft: isH3 ? 26 : 0, borderRadius: 9,
                                background: overId === it.id && dragId !== it.id ? "var(--text-color-100, #f0f0f0)" : dragId === it.id ? "#f4f6f8" : "transparent",
                                opacity: dragId === it.id ? 0.5 : 1, transition: "background .12s",
                            }}>
                            <span style={{ color: "#b6bdc7", cursor: "grab", display: "flex", flexShrink: 0 }}><IcGrip size={14} /></span>
                            <button type="button"
                                onClick={() => setItems((list) => list.map((x) => x.id === it.id ? { ...x, level: x.level === "h2" ? "h3" : "h2" } : x))}
                                title={__("Toggle heading level", "betterdocs")}
                                style={{
                                    flexShrink: 0, width: 32, height: 24, borderRadius: 6, cursor: "pointer",
                                    fontSize: 11, fontWeight: 800, letterSpacing: 0.3,
                                    background: isH3 ? "var(--text-color-50, #f9fafb)" : "var(--text-color-100, #f0f0f0)",
                                    color: isH3 ? "var(--muted)" : "var(--text-color-700, #344054)",
                                    border: `1px solid ${isH3 ? "var(--border-soft)" : "var(--text-color-300, #dde2e4)"}`,
                                }}>
                                {isH3 ? "H3" : "H2"}
                            </button>
                            <input type="text"
                                value={it.text}
                                onChange={(e) => setItems((list) => list.map((x) => x.id === it.id ? { ...x, text: e.target.value } : x))}
                                style={{
                                    flex: 1, border: "1px solid transparent", background: "transparent",
                                    borderRadius: 7, padding: "6px 8px", outline: "none",
                                    fontSize: isH3 ? 13.5 : 14, fontWeight: isH3 ? 500 : 600, color: "var(--ink)",
                                    transition: "background .12s, border-color .12s",
                                }}
                                onFocus={(e) => { e.target.style.background = "white"; e.target.style.borderColor = "var(--border)"; }}
                                onBlur={(e) => { e.target.style.background = "transparent"; e.target.style.borderColor = "transparent"; }} />
                            <button type="button" onClick={() => setItems((list) => list.filter((x) => x.id !== it.id))}
                                title={__("Remove", "betterdocs")} style={{
                                    width: 28, height: 28, borderRadius: 7, color: "#b6bdc7", flexShrink: 0, border: "none",
                                    background: "transparent", cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#b6bdc7"; }}>
                                <IcTrash size={14} />
                            </button>
                        </div>
                    );
                })}

                <button type="button"
                    onClick={() => setItems((list) => [...list, { id: `new-${Date.now()}`, level: "h2", text: __("New section", "betterdocs") }])}
                    style={{
                        display: "flex", alignItems: "center", gap: 8, width: "100%", border: "none",
                        padding: "9px 10px", marginTop: 2, borderRadius: 9, background: "transparent", cursor: "pointer",
                        color: "var(--muted)", fontSize: 13.5, fontWeight: 600, textAlign: "left",
                        transition: "background .12s, color .12s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f6f8"; e.currentTarget.style.color = "var(--ink-2)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; }}>
                    <IcPlus size={15} sw={2.2} /> {__("Add section", "betterdocs")}
                </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18 }}>
                <TextBtn onClick={onDiscard} style={{ marginRight: "auto" }}>{__("Discard", "betterdocs")}</TextBtn>
                <GhostBtn icon={<IcRefresh size={15} />} onClick={onRegenerate}>{__("Regenerate outline", "betterdocs")}</GhostBtn>
                <PrimaryBtn icon={<IcArrowR size={16} sw={2.2} />} onClick={onExpand} disabled={items.length === 0}>{__("Expand into Doc", "betterdocs")}</PrimaryBtn>
            </div>
        </div>
    );
};

const backBtn = {
    width: 34, height: 34, borderRadius: 9, flexShrink: 0, border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "var(--muted)", background: "#f4f6f8",
};

const SOURCE_TYPES = [
    { value: "", label: __("Auto-detect", "betterdocs") },
    { value: "transcript", label: __("Support transcript", "betterdocs") },
    { value: "forum", label: __("Forum thread", "betterdocs") },
    { value: "notes", label: __("Raw notes", "betterdocs") },
];

const SOURCE_PLACEHOLDERS = {
    "": __("Paste any existing content — a support chat, forum thread, or rough notes. BetterDocs AI will turn it into a structured doc.", "betterdocs"),
    transcript: __("Paste the full support conversation (chat or email). BetterDocs AI will turn it into a structured doc.", "betterdocs"),
    forum: __("Paste the forum thread, including replies. BetterDocs AI will turn it into a structured doc.", "betterdocs"),
    notes: __("Paste your rough notes or bullet points. BetterDocs AI will expand them into a structured doc.", "betterdocs"),
};

const GIT_PLACEHOLDER = __("Paste a GitHub pull request or file URL — e.g. https://github.com/owner/repo/pull/123 or .../blob/main/docs/guide.md", "betterdocs");
const UPGRADE_URL = "https://betterdocs.co/upgrade";

// From Git input modes: paste a URL, or browse the connected account's repos.
// ── Attachment kinds ─────────────────────────────────────────────────────────
//
// Recordings take a different route through the modal than every other
// attachment: they are transcribed first, the author corrects the transcript,
// and only then is the doc generated from that text. The extension list comes
// from the server (REST\WriteWithAI::media_exts) so the two can never drift.
const MEDIA_EXTS_FALLBACK = [
    "mp3", "mpga", "m4a", "wav", "flac", "ogg", "oga", "mp4", "mpeg", "mpg", "webm",
];

// Read lazily, not at module scope: the bundle can evaluate before
// wp_localize_script has run on some screens, and a snapshot taken then would
// freeze the fallback list even once the real config arrives.
const mediaExts = () => getConfig().media_exts || MEDIA_EXTS_FALLBACK;

const extOf = (name) => String(name || "").split(".").pop().toLowerCase();

const isRecording = (f) => !!f && mediaExts().indexOf(extOf(f.name)) !== -1;

// Accept attribute for the file input, built from the same list.
const acceptAttr = () =>
    [".pdf", ".docx", ".txt", ".md", ".markdown", ".png", ".jpg", ".jpeg", ".webp"]
        .concat(mediaExts().map((e) => `.${e}`))
        .join(",");

// wp_localize_script stringifies top-level scalars, so every number here
// arrives as "26214400" and every boolean as "1" or "". Coerce explicitly
// rather than leaning on JS comparison rules — "0" is truthy, and a silently
// truthy "can transcribe" flag would offer a button that always fails.
const num = (value, fallback) => {
    const n = parseInt(value, 10);
    return isNaN(n) || n <= 0 ? fallback : n;
};

const flag = (value) => !!value && "0" !== String(value);

// The server cap, already clamped to what the host will accept — a site with
// upload_max_filesize = 8M advertises 8 MB here, not our 25.
const capFor = (f) => {
    const cfg = getConfig();
    return isRecording(f)
        ? num(cfg.max_media_bytes, 25165824)
        : num(cfg.max_upload_bytes, 5242880);
};

const asMB = (bytes) => `${Math.round((bytes / 1048576) * 10) / 10} MB`;

const GIT_MODES = [
    { value: "url", label: __("Paste URL", "betterdocs") },
    { value: "browse", label: __("Browse repository", "betterdocs") },
];

// Quick prompt starters for the From Git tab. One click appends the snippet to
// the additional-prompt field (click again to remove) — they replace the old
// framing dropdown, so the AI reads the intent straight from the prompt text.
const QUICK_PROMPTS = [
    { id: "feature", label: __("Document this feature / PR", "betterdocs"),
        text: __("Explain what this feature does and how to use it in clear end-user documentation terms — focus on the user-facing behavior, not the code or implementation details.", "betterdocs") },
    { id: "howto", label: __("Turn into a how-to guide", "betterdocs"),
        text: __("Turn this into a concise, numbered step-by-step how-to guide.", "betterdocs") },
    { id: "whatsnew", label: __("Write a what's-new doc", "betterdocs"),
        text: __("Write a \"What's New\" announcement-style doc that highlights the changes and explains why they matter to users.", "betterdocs") },
    { id: "adapt", label: __("Adapt this doc to my site", "betterdocs"),
        text: __("Rewrite this as a fresh doc for my site, keeping the meaning but improving the clarity, structure, and tone.", "betterdocs") },
];

const withId = (outline) =>
    (outline || []).map((o, i) => ({ id: `o-${i}`, level: o.level === "h3" ? "h3" : "h2", text: String(o.text || "") }));

// Taxonomies offered in the preview-step term suggestions (order = display order).
// Slugs double as the canonical post-attribute key (doc_category/doc_tag have no
// rest_base), matching the native Docs AI Suite panel.
const SUGGEST_TAXONOMIES = [
    { taxonomy: "doc_category", label: __("Categories", "betterdocs") },
    { taxonomy: "doc_tag", label: __("Tags", "betterdocs") },
];

// ── The modal ─────────────────────────────────────────────────────────────────
const StudioGenerateModal = ({ open, onClose }) => {
    const config = getConfig();
    const hasKey = !!config.has_key;
    const languageOptions = Array.isArray(config.language_options) ? config.language_options : [];
    const showLanguage = !!config.is_multilingual_active && languageOptions.length > 0;
    const instructionChoices = Array.isArray(config.instructions) ? config.instructions : [];

    // From Git gating: Pro must be active AND Git Sync enabled + authenticated.
    const isProActive = !!config.is_pro_active;
    const git = config.git || {};
    const gitReady = isProActive && !!git.enabled && !!git.connected;
    // Site owners can hide the whole "From Git" tab from Settings → Git Sync
    // (default on). Only applies when Pro is active; without Pro the tab still
    // shows the upsell.
    const showGitTab = !isProActive || git.ai_enabled !== false;
    // Repository browsing is GitHub-only (GitLab connections are single-project);
    // GitLab users get the Paste-URL mode only.
    const gitProvider = git.provider || "github";
    const canBrowse = gitProvider === "github";
    // Falls back to the Git Sync settings anchor (not the AI settings anchor).
    const gitSettingsUrl = git.settings_url || "admin.php?page=betterdocs-settings#git-sync";

    const [tab, setTab] = useState("prompt");
    const [stage, setStage] = useState("form"); // form · loadingOutline · loadingDoc · outline · preview · previewError
    const [prompt, setPrompt] = useState("");
    const [source, setSource] = useState("");
    const [srcType, setSrcType] = useState(SOURCE_TYPES[0].value);
    const [gitUrl, setGitUrl] = useState("");
    const [gitPrompt, setGitPrompt] = useState(""); // additional prompt for the From Git tab
    const [gitMode, setGitMode] = useState("url");   // url · browse
    const [file, setFile] = useState(null);          // selected file for the From Attachment tab
    const [filePrompt, setFilePrompt] = useState(""); // optional prompt for the From Attachment tab
    // Recording flow: a transcript sits between the upload and generation so the
    // author can fix mis-heard product names before the doc is written.
    const [transcript, setTranscript] = useState("");
    const [transcribing, setTranscribing] = useState(false);
    const [fileError, setFileError] = useState("");
    const [transcriptClipped, setTranscriptClipped] = useState(false);
    // Keyboard focus on the (visually hidden) file input, drawn on its drop zone.
    const [pickerFocus, setPickerFocus] = useState(false);
    // Bumped whenever the file changes or is removed. A transcription answers
    // only if it is still the latest request — otherwise Remove (or a new pick)
    // during "Transcribing…" let the old file's transcript land on the new file.
    const transcribeReq = useRef(0);
    const [browseUrl, setBrowseUrl] = useState("");  // URL resolved by the browse picker
    const [lang, setLang] = useState("");
    const [tone, setTone] = useState("");
    const [docSize, setDocSize] = useState("any");
    const [selectedInstructionIds, setSelectedInstructionIds] = useState([]);
    const [advOpen, setAdvOpen] = useState(false);
    const [existingTitle, setExistingTitle] = useState("");
    const [hasContent, setHasContent] = useState(false);
    const [regenerateTitle, setRegenerateTitle] = useState(true);
    const [overwrite, setOverwrite] = useState(true);
    const [genTitle, setGenTitle] = useState("");
    const [html, setHtml] = useState("");
    const [outline, setOutline] = useState([]);
    const [error, setError] = useState(null);
    // Preview-step term suggestions — one independent on/off control per taxonomy.
    const [suggestTax, setSuggestTax] = useState({ doc_category: true, doc_tag: true });
    const [suggestions, setSuggestions] = useState({});       // { [taxonomy]: [{name,term_id,is_new}] }
    const [suggestLoading, setSuggestLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState(() => new Set()); // `${taxonomy}::${name}` kept

    // Snapshot the editor's title + content state, and reset, each time it opens.
    useEffect(() => {
        if (!open) return;
        setStage("form");
        setError(null);
        setGenTitle("");
        setOverwrite(true);
        setRegenerateTitle(true);
        setSelectedInstructionIds([]);
        setGitMode("url");
        setBrowseUrl("");
        setGitPrompt("");
        setFile(null);
        setFilePrompt("");
        setTranscript("");
        setTranscribing(false);
        setFileError("");
        setTranscriptClipped(false);
        transcribeReq.current += 1;
        setSuggestTax({ doc_category: true, doc_tag: true });
        setSuggestions({});
        setSelectedKeys(new Set());
        setSuggestLoading(false);
        try {
            const editorTitle = window.wp?.data?.select("core/editor")?.getEditedPostAttribute("title") || "";
            setExistingTitle(editorTitle);
            const blocks = window.wp?.data?.select("core/block-editor")?.getBlocks() || [];
            setHasContent(blocks.length > 0);
        } catch (e) { /* editor not ready */ }
    }, [open]);

    // Generate a title when the doc has none, or when the user opted to regenerate.
    const titleRequested = !existingTitle || regenerateTitle;

    const canPrompt = hasKey && prompt.trim().length > 0;
    const canSource = hasKey && source.trim().length > 20;
    // The URL "Generate from Git" sends: pasted, or resolved by the browse picker.
    const effectiveGitUrl = (gitMode === "browse" ? browseUrl : gitUrl).trim();
    const canGit = hasKey && gitReady && effectiveGitUrl.length > 8;
    // A recording needs a transcript before it can generate; every other file
    // type goes straight through as it always has.
    const canAttachment = hasKey && !!file && (!isRecording(file) || transcript.trim().length > 0);
    // On the Git tab without a working connection we show only the upsell/connect
    // panel — no Guides, Advanced settings, or generate footer.
    const gitBlocked = tab === "git" && !gitReady;
    const est = Math.round(((prompt + source).length) / 4) + 200;

    // Append the chosen language to the prompt at send-time (client-side).
    const langSuffix = () => {
        if (!showLanguage || !lang) return "";
        const found = languageOptions.find((o) => String(o.value) === String(lang));
        const label = found ? found.label : lang;
        return " " + sprintf(__("Write the documentation in %s.", "betterdocs"), label);
    };

    // Shared directives sent on every generation: tone, size, and whether the AI
    // should also produce a title (assembled into the prompt by the backend).
    const directives = () => ({ tone, doc_size: docSize, generate_title: titleRequested, instruction_ids: selectedInstructionIds });

    // Quick-prompt chips toggle their snippet into the From Git prompt: append if
    // absent, strip it out (tidying stray blank lines) if already there.
    const toggleQuickPrompt = (text) => setGitPrompt((prev) =>
        prev.includes(text)
            ? prev.split(text).join("").replace(/\n{2,}/g, "\n").trim()
            : (prev.trim() ? prev.trim() + "\n" + text : text)
    );

    // Term suggestions are gated by an API key AND the Docs AI Suite setting (the
    // same gate the REST endpoint enforces). Each taxonomy then has its own toggle.
    const canSuggest = hasKey && !!config.suggest_terms_enabled;

    // Taxonomies to actually request: whichever per-taxonomy toggles are on.
    const enabledSuggestTaxes = () => SUGGEST_TAXONOMIES.filter(
        (t) => suggestTax[t.taxonomy]
    );

    const toggleTax = (tax) => setSuggestTax((prev) => ({ ...prev, [tax]: !prev[tax] }));

    const toggleKey = (key) => setSelectedKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key); else next.add(key);
        return next;
    });

    // Fetch suggestions for each enabled taxonomy in parallel off the freshly
    // generated doc.
    const fetchTermSuggestions = (contentHtml, docTitle) => {
        const taxes = enabledSuggestTaxes();
        setSuggestions({});
        setSelectedKeys(new Set());
        if (!taxes.length) { setSuggestLoading(false); return; }
        setSuggestLoading(true);
        Promise.all(
            taxes.map((t) =>
                suggestTerms({ taxonomy: t.taxonomy, content: contentHtml, title: docTitle })
                    .then((list) => [t.taxonomy, list])
            )
        )
            .then((pairs) => {
                const next = {};
                pairs.forEach(([tax, list]) => { next[tax] = list || []; });
                setSuggestions(next);
            })
            .finally(() => setSuggestLoading(false));
    };

    // Apply every kept suggestion (from an enabled taxonomy) to the (unsaved) doc:
    // create new terms as needed, then assign via editPost keyed by the taxonomy
    // slug — mirroring the native Docs AI Suite panel so tokens update immediately.
    const applyKeptTerms = async () => {
        if (!selectedKeys.size) return;
        const { saveEntityRecord } = dispatch("core");
        const editor = dispatch("core/editor");
        const editorSelect = select("core/editor");
        for (const t of SUGGEST_TAXONOMIES) {
            if (!suggestTax[t.taxonomy]) continue;
            const items = (suggestions[t.taxonomy] || []).filter((s) => selectedKeys.has(`${t.taxonomy}::${s.name}`));
            if (!items.length) continue;
            const current = (editorSelect.getEditedPostAttribute(t.taxonomy) || []).map(Number);
            const toAdd = [];
            for (const s of items) {
                let termId = s.term_id;
                if (!termId) {
                    try {
                        const created = await saveEntityRecord("taxonomy", t.taxonomy, { name: s.name });
                        termId = created && created.id;
                    } catch (e) { continue; }
                }
                termId = Number(termId);
                if (termId && !current.includes(termId) && !toAdd.includes(termId)) toAdd.push(termId);
            }
            if (toAdd.length) editor.editPost({ [t.taxonomy]: [...current, ...toAdd] });
        }
    };

    const handleDoc = (data) => {
        const newTitle = titleRequested ? extractFirstHeading(data.content) : "";
        if (titleRequested) setGenTitle(newTitle);
        const cleaned = cleanGeneratedHtml(data.content);
        setHtml(cleaned);
        setStage("preview");
        if (canSuggest && enabledSuggestTaxes().length) {
            fetchTermSuggestions(cleaned, newTitle || existingTitle);
        }
    };

    // Refuse an oversize file here rather than uploading it and waiting for the
    // server to say no — the old flow pushed the whole 50 MB up the wire first.
    const pickFile = (picked) => {
        transcribeReq.current += 1;
        setTranscribing(false);
        setTranscript("");
        setTranscriptClipped(false);
        setFileError("");

        if (!picked) {
            setFile(null);
            return;
        }

        const cap = capFor(picked);
        if (picked.size > cap) {
            setFile(null);
            setFileError(sprintf(
                /* translators: 1: file name, 2: maximum allowed size. */
                __("“%1$s” is larger than the %2$s limit. Trim it, or export a smaller version.", "betterdocs"),
                picked.name,
                asMB(cap)
            ));
            return;
        }

        setFile(picked);
    };

    // Step one of the recording flow. Returns the transcript to the panel; no
    // doc is written and no stage change happens, so the author stays in the form.
    const transcribeFile = () => {
        if (!file) return;
        setError(null);
        setFileError("");
        setTranscribing(true);

        const req = ++transcribeReq.current;

        callWriteWithAIMultipart("transcribe-attachment", {}, file)
            .then((data) => {
                if (req !== transcribeReq.current) return;
                setTranscript(String((data && data.transcript) || ""));
                setTranscriptClipped(!!(data && data.clipped));
                setTranscribing(false);
            })
            .catch((err) => {
                if (req !== transcribeReq.current) return;
                setFileError(normalizeAIError(err));
                setTranscribing(false);
            });
    };

    const run = (action) => {
        setError(null);
        setStage(action === "generate-outline" ? "loadingOutline" : "loadingDoc");

        // From Attachment posts a multipart request (the file + directives) and
        // lands on the same doc-preview flow as every other source.
        if (action === "from-attachment") {
            // A recording has already become text; generate from the transcript the
            // author just approved, through the ordinary grounded source path. Only
            // non-media attachments still need the file itself on the wire.
            if (isRecording(file)) {
                callWriteWithAI("from-source", {
                    source: transcript,
                    source_type: "recording",
                    prompt: filePrompt + langSuffix(),
                    ...directives(),
                })
                    .then(handleDoc)
                    .catch((err) => { setError({ ...(err || {}), message: normalizeAIError(err) }); setStage("previewError"); });
                return;
            }

            callWriteWithAIMultipart(action, { prompt: filePrompt + langSuffix(), ...directives() }, file)
                .then(handleDoc)
                .catch((err) => { setError({ ...(err || {}), message: normalizeAIError(err) }); setStage("previewError"); });
            return;
        }

        let payload;
        if (action === "from-source") {
            payload = { source, source_type: srcType, prompt: prompt + langSuffix(), ...directives() };
        } else if (action === "from-git") {
            payload = { git_url: effectiveGitUrl, prompt: gitPrompt + langSuffix(), ...directives() };
        } else {
            payload = { prompt: prompt + langSuffix(), ...directives() };
        }

        callWriteWithAI(action, payload)
            .then((data) => {
                if (action === "generate-outline") {
                    setOutline(withId(data.outline));
                    setStage("outline");
                } else {
                    handleDoc(data);
                }
            })
            .catch((err) => {
                setError({ ...(err || {}), message: normalizeAIError(err) });
                setStage(action === "generate-outline" ? "form" : "previewError");
            });
    };

    const expand = () => {
        setError(null);
        setStage("loadingDoc");
        callWriteWithAI("expand-outline", {
            outline: outline.map((o) => ({ level: o.level, text: o.text })),
            prompt: prompt + langSuffix(),
            ...directives(),
        })
            .then(handleDoc)
            .catch((err) => { setError({ ...(err || {}), message: normalizeAIError(err) }); setStage("previewError"); });
    };

    const keepAndInsert = async () => {
        await applyKeptTerms();
        insertContentToEditor({ title: titleRequested ? genTitle : "", html, isOverwrite: overwrite });
        onClose();
    };

    const regenerateDoc = () => run(tab === "source" ? "from-source" : tab === "git" ? "from-git" : tab === "attachment" ? "from-attachment" : "generate-doc");
    const showBack = stage === "outline" || stage === "preview" || stage === "previewError";

    // Live summary shown on the collapsed "Advanced settings" bar.
    const toneLabel = (TONE_OPTIONS.find((o) => o.value === tone) || TONE_OPTIONS[0]).label;
    const sizeLabel = "any" === docSize
        ? __("Any size", "betterdocs")
        : (SIZE_OPTIONS.find((o) => o.value === docSize) || SIZE_OPTIONS[0]).label;
    const enabledCount = (existingTitle && regenerateTitle ? 1 : 0) + (hasContent && overwrite ? 1 : 0) + (canSuggest ? enabledSuggestTaxes().length : 0);
    /* translators: 1: tone label, 2: length label, 3: number of enabled toggles. */
    const advSummary = sprintf(__("%1$s · %2$s · %3$d on", "betterdocs"), toneLabel, sizeLabel, enabledCount);

    // Settings rows are conditional; build the list, then render with dividers.
    const settingRows = [
        <SettingRow key="tone" label={__("Tone", "betterdocs")}>
            <SegControl value={tone} onChange={setTone} options={TONE_OPTIONS} />
        </SettingRow>,
        <SettingRow key="length" label={__("Length", "betterdocs")}>
            <SegControl value={docSize} onChange={setDocSize} options={SIZE_OPTIONS} />
        </SettingRow>,
    ];
    if (showLanguage) {
        settingRows.push(
            <SettingRow key="lang" label={__("Language", "betterdocs")}>
                <DropdownSelect value={lang} onChange={setLang}
                    options={[{ value: "", label: __("Default (Site Language)", "betterdocs") }, ...languageOptions]}
                    style={{ flex: 1 }} />
            </SettingRow>
        );
    }
    if (existingTitle) {
        settingRows.push(
            <ToggleRow key="title" checked={regenerateTitle} onChange={setRegenerateTitle}
                title={__("Regenerate title", "betterdocs")} subtitle={__("Let AI rewrite the document title", "betterdocs")} />
        );
    }
    if (hasContent) {
        settingRows.push(
            <ToggleRow key="overwrite" checked={overwrite} onChange={setOverwrite}
                title={__("Overwrite existing doc", "betterdocs")} subtitle={__("Replace current content instead of appending", "betterdocs")} />
        );
    }
    if (canSuggest) {
        settingRows.push(
            <ToggleRow key="suggest-cat" checked={suggestTax.doc_category} onChange={() => toggleTax("doc_category")}
                title={__("Suggest categories", "betterdocs")}
                subtitle={__("Suggest doc categories after generating", "betterdocs")} />,
            <ToggleRow key="suggest-tag" checked={suggestTax.doc_tag} onChange={() => toggleTax("doc_tag")}
                title={__("Suggest tags", "betterdocs")}
                subtitle={__("Suggest doc tags after generating", "betterdocs")} />
        );
    }

    return (
        <Modal open={open} onClose={onClose} width={720} labelledBy="bd-wd-title">
            {/* Header */}
            <div style={{ padding: "22px 26px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                    {showBack ? (
                        <button type="button" onClick={() => setStage("form")} title={__("Back", "betterdocs")} style={backBtn}>
                            <AIcon d="M15 18l-6-6 6-6" size={17} sw={2} />
                        </button>
                    ) : (
                        <div style={{
                            width: 46, height: 46, borderRadius: 13, flexShrink: 0, background: "var(--green)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 2px 6px rgba(0,184,132,.35)",
                        }}>
                            <AIMarkWhite size={22} />
                        </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div id="bd-wd-title" style={{ fontSize: 19, fontWeight: 800, color: "var(--ink)", letterSpacing: -0.3, paddingRight: 30 }}>
                            {__("Write Documentation", "betterdocs")}
                        </div>
                        {!showBack && (
                            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                                {__("Draft a doc with BetterDocs AI", "betterdocs")}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs + model on one line. The modal width (720) is sized so the
                four source tabs and the "Platform · Model" pill share a single
                row with room to spare — at 640 the pill overflowed and clipped. */}
            {!showBack && stage === "form" && (
                <div style={{ padding: "18px 26px 0px", borderBottom: "1px solid var(--border-soft)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <Segmented value={tab} onChange={setTab} tabs={[
                        { id: "prompt", label: __("Prompt", "betterdocs"), icon: <IcPencil size={15} /> },
                        { id: "source", label: __("From source", "betterdocs"), icon: <IcSummary size={15} /> },
                        ...(showGitTab ? [{ id: "git", label: __("From Git", "betterdocs"), icon: <IcGit size={15} /> }] : []),
                        { id: "attachment", label: __("From Attachment", "betterdocs"), icon: <IcPaperclip size={15} /> },
                    ]} />
                    {/* Lift the pill to align with the tab labels, not the bottom
                        border — the tabs carry 13px bottom padding, so a centred
                        pill otherwise sits low against the divider line. */}
                    <div style={{ marginBottom: 10 }}>
                        <ModelPill platform={config.platform_label} model={config.model_label || config.model} />
                    </div>
                </div>
            )}

            {/* Body — the 320px floor keeps the form/loading/preview steps a
                comfortable size, but the error step's content is tiny, so we let
                it size to content (no forced floor) and the footer sits at the
                modal bottom instead of floating above a large empty gap. */}
            <div style={{ padding: "16px 26px 22px", overflowY: "auto", minHeight: stage === "previewError" ? undefined : 320 }}>
                {stage === "form" && (
                    <>
                        {!hasKey && (
                            <Banner tone="error" style={{ marginBottom: 16 }}>
                                {__("Please insert your", "betterdocs")}{" "}
                                <a href={config.settings_url || "#"} target="_blank" rel="noreferrer" style={{ color: "var(--wp-blue)", fontWeight: 700, textDecoration: "none" }}>
                                    {__("OpenAI API Key", "betterdocs")}
                                </a>{" "}
                                {__("to use this Write with AI feature.", "betterdocs")}
                            </Banner>
                        )}
                        {hasKey && error && (
                            <Banner tone="error" style={{ marginBottom: 16 }}>
                                <strong style={{ fontWeight: 700 }}>{ERR_LABEL[error.code] || __("Couldn't generate", "betterdocs")}.</strong> {error.message}
                            </Banner>
                        )}

                        {tab === "prompt" && (
                            <>
                                <FieldLabel>{__("What should this documentation cover?", "betterdocs")}</FieldLabel>
                                <TextArea value={prompt} onChange={setPrompt} rows={5}
                                    placeholder={__("Describe what you want the documentation to cover — e.g. \"A getting-started guide for installing and configuring the plugin.\" BetterDocs AI handles the structure and formatting.", "betterdocs")} />
                                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>
                                    {__("The clearer your request, the better the result. A title and formatting are added automatically.", "betterdocs")}
                                </div>
                            </>
                        )}

                        {tab === "source" && (
                            <>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                                    <FieldLabel style={{ margin: 0 }}>{__("Source content:", "betterdocs")}</FieldLabel>
                                    <DropdownSelect value={srcType} onChange={setSrcType} options={SOURCE_TYPES} style={{ width: 200 }} />
                                </div>
                                <TextArea value={source} onChange={setSource} rows={7}
                                    placeholder={SOURCE_PLACEHOLDERS[srcType] || SOURCE_PLACEHOLDERS[""]} />
                                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>
                                    {__("BetterDocs AI uses only what's in your source — it won't invent details.", "betterdocs")}
                                </div>
                            </>
                        )}

                        {tab === "git" && !isProActive && (
                            /* State 1 — Pro not active: upgrade panel */
                            <div style={{ textAlign: "center", padding: "16px 8px 6px" }}>
                                {/* Lock tile */}
                                <div style={{
                                    width: 56, height: 56, borderRadius: 15, margin: "0 auto",
                                    background: "#fff7e6", color: "#f0a615",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <IcLock size={26} sw={1.9} />
                                </div>
                                {/* Pro eyebrow */}
                                <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#f0a615", fontSize: 13.5, fontWeight: 800 }}>
                                        <IcProStar size={14} />{__("Pro", "betterdocs")}
                                    </span>
                                </div>
                                {/* Headline */}
                                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)", marginTop: 10, letterSpacing: -0.3 }}>
                                    {__("Writing from Git is a Pro feature", "betterdocs")}
                                </div>
                                {/* Description */}
                                <div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 8, lineHeight: 1.55, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
                                    {__("Paste a pull request or repo file URL and let BetterDocs AI turn what you already shipped in Git into a polished doc.", "betterdocs")}
                                </div>
                                {/* Feature list */}
                                <div style={{ display: "inline-flex", flexDirection: "column", gap: 12, textAlign: "left", marginTop: 22 }}>
                                    {[
                                        __("Generate a doc from a Pull Request", "betterdocs"),
                                        __("Turn a repository file into a new doc", "betterdocs"),
                                        __("Works with GitHub & GitLab via Git Sync", "betterdocs"),
                                    ].map((feature, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--ink-2)" }}>
                                            <span style={{ color: "var(--green)", display: "flex", flexShrink: 0 }}><IcCheck size={17} sw={2.4} /></span>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                                {/* CTA */}
                                <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                                    <PrimaryBtn onClick={() => window.open(UPGRADE_URL, "_blank", "noopener")}>
                                        {__("Upgrade Now", "betterdocs")}<IcArrowR size={16} sw={2.2} />
                                    </PrimaryBtn>
                                </div>
                            </div>
                        )}

                        {tab === "git" && isProActive && !gitReady && (
                            /* State 2 — Pro active but Git Sync not enabled/connected */
                            <Banner tone="warn">
                                {__("Enable and connect", "betterdocs")}{" "}
                                <a href={gitSettingsUrl} target="_blank" rel="noreferrer" style={{ color: "var(--wp-blue)", fontWeight: 700, textDecoration: "none" }}>
                                    {__("BetterDocs Git Sync", "betterdocs")}
                                </a>{" "}
                                {__("to generate documentation from a repository.", "betterdocs")}
                            </Banner>
                        )}

                        {tab === "git" && gitReady && (
                            /* State 3 — connected: the From Git form */
                            <>
                                {/* Source mode: Paste URL | Browse repository */}
                                <div style={{ marginBottom: 14 }}>
                                    {canBrowse
                                        ? <SegControl value={gitMode} onChange={setGitMode} options={GIT_MODES} />
                                        : <FieldLabel style={{ margin: 0 }}>{__("Git URL:", "betterdocs")}</FieldLabel>}
                                </div>

                                {(!canBrowse || gitMode === "url") && (
                                    <>
                                        <TextInput value={gitUrl} onChange={setGitUrl} placeholder={GIT_PLACEHOLDER} />
                                        <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>
                                            {__("BetterDocs AI fetches the content over your connected Git account and writes from it — it won't invent details.", "betterdocs")}
                                        </div>
                                    </>
                                )}

                                {canBrowse && gitMode === "browse" && (
                                    <GitBrowse onSelect={setBrowseUrl} settingsUrl={gitSettingsUrl} />
                                )}

                                {/* Additional prompt + quick starters — layered on the Git source in both modes */}
                                <div style={{ marginTop: 16 }}>
                                    <FieldLabel>{__("Add a prompt (optional)", "betterdocs")}</FieldLabel>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                                        {QUICK_PROMPTS.map((q) => (
                                            <QuickChip key={q.id} active={gitPrompt.includes(q.text)} onClick={() => toggleQuickPrompt(q.text)}>
                                                {q.label}
                                            </QuickChip>
                                        ))}
                                    </div>
                                    <TextArea value={gitPrompt} onChange={setGitPrompt} rows={3}
                                        placeholder={__("Add extra instructions for this doc, or tap a suggestion above — e.g. \"Focus on the user-facing steps and keep it beginner-friendly.\"", "betterdocs")} />
                                </div>
                            </>
                        )}

                        {tab === "attachment" && (
                            <>
                                <FieldLabel>{__("Upload a file to write from:", "betterdocs")}</FieldLabel>
                                <label style={{
                                    position: "relative",
                                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                    gap: 6, padding: "26px 16px", textAlign: "center", cursor: "pointer",
                                    borderRadius: 10, border: "1.5px dashed var(--text-color-200, #d0d5dd)",
                                    background: "var(--base-background, #fff)",
                                    outline: pickerFocus ? "2px solid var(--wp-admin-theme-color, #2271b1)" : "none",
                                    outlineOffset: 2,
                                }}>
                                    {/* Visually hidden rather than display:none, which took the
                                        input out of the tab order — the picker could not be
                                        reached from the keyboard at all. */}
                                    <input type="file" accept={acceptAttr()}
                                        style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0, opacity: 0 }}
                                        onFocus={(e) => { let visible = true; try { visible = e.target.matches(":focus-visible"); } catch (x) { /* older engines */ } setPickerFocus(visible); }}
                                        onBlur={() => setPickerFocus(false)}
                                        onChange={(e) => {
                                            pickFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);
                                            // Cleared so that picking the same file again — after
                                            // Remove — still fires a change.
                                            e.target.value = "";
                                        }} />
                                    <span style={{ display: "flex", color: "var(--green)" }}><IcPaperclip size={22} /></span>
                                    {file
                                        ? <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", wordBreak: "break-all" }}>{file.name}</span>
                                        : <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-2)" }}>{__("Click to choose a file", "betterdocs")}</span>}
                                    <span style={{ fontSize: 12.5, color: "var(--muted)" }}>
                                        {sprintf(
                                            /* translators: 1: document/image size limit, 2: recording size limit. */
                                            __("PDF, DOCX, TXT, MD or an image up to %1$s — or a recording (MP3, M4A, WAV, FLAC, OGG, MP4, MPEG, WEBM) up to %2$s", "betterdocs"),
                                            asMB(num(config.max_upload_bytes, 5242880)),
                                            asMB(num(config.max_media_bytes, 25165824))
                                        )}
                                    </span>
                                </label>
                                {fileError && (
                                    <div style={{ marginTop: 8 }}><Banner tone="error">{fileError}</Banner></div>
                                )}
                                {file && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                                        <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{`${Math.max(1, Math.round(file.size / 1024))} KB`}</span>
                                        <TextBtn onClick={() => { transcribeReq.current += 1; setTranscribing(false); setFile(null); setTranscript(""); setTranscriptClipped(false); setFileError(""); }}>{__("Remove", "betterdocs")}</TextBtn>
                                    </div>
                                )}

                                {/* Recording → transcribe, correct, then generate. The transcript is
                                    shown because speech-to-text mangles product names, and a wrong
                                    term here becomes a wrong term in the published doc. */}
                                {file && isRecording(file) && (
                                    <div style={{ marginTop: 14 }}>
                                        {!transcript && (
                                            <>
                                                <GhostBtn
                                                    onClick={transcribeFile}
                                                    disabled={!hasKey || transcribing || !flag(config.supports_transcription)}
                                                >
                                                    {transcribing
                                                        ? __("Transcribing your recording…", "betterdocs")
                                                        : __("Transcribe recording", "betterdocs")}
                                                </GhostBtn>
                                                {!flag(config.supports_transcription) && (
                                                    <div style={{ marginTop: 8 }}>
                                                        <Banner tone="warn">
                                                            {sprintf(
                                                                /* translators: %s: the configured AI platform label. */
                                                                __("%s can't read audio or video. Switch to OpenAI or Google Gemini in Settings → AI Content Suite.", "betterdocs"),
                                                                config.platform_label || config.platform || ""
                                                            )}
                                                        </Banner>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {transcript && (
                                            <>
                                                <FieldLabel>{__("Transcript — correct anything misheard, then generate:", "betterdocs")}</FieldLabel>
                                                <TextArea value={transcript} onChange={setTranscript} rows={8} />
                                                {transcriptClipped && (
                                                    <div style={{ marginTop: 8 }}>
                                                        <Banner tone="warn">
                                                            {__("This recording is longer than BetterDocs AI can use at once, so the transcript stops part-way — the doc will cover only this part. Split the recording to document the rest.", "betterdocs")}
                                                        </Banner>
                                                    </div>
                                                )}
                                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                                                    <span style={{ fontSize: 12.5, color: "var(--muted)" }}>
                                                        {sprintf(
                                                            /* translators: %d: character count of the transcript. */
                                                            __("%d characters", "betterdocs"),
                                                            transcript.length
                                                        )}
                                                    </span>
                                                    <TextBtn onClick={transcribeFile}>{__("Transcribe again", "betterdocs")}</TextBtn>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                                <div style={{ marginTop: 16 }}>
                                    <FieldLabel>{__("Add a prompt (optional)", "betterdocs")}</FieldLabel>
                                    <TextArea value={filePrompt} onChange={setFilePrompt} rows={3}
                                        placeholder={__("Optional: how should BetterDocs AI treat this file? — e.g. \"Turn this into a step-by-step how-to guide.\"", "betterdocs")} />
                                </div>
                                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>
                                    {file && isRecording(file)
                                        ? __("BetterDocs AI transcribes the speech, then writes only from that transcript — it won't invent details. Video is read for its audio; what's on screen is not.", "betterdocs")
                                        : __("BetterDocs AI reads the file's text and writes only from its content — it won't invent details.", "betterdocs")}
                                </div>
                            </>
                        )}

                        {/* Guides — pick saved instruction sets to layer on the base prompt */}
                        {!gitBlocked && instructionChoices.length > 0 && (
                            <div style={{ marginTop: 18 }}>
                                <InstructionPicker
                                    instructions={instructionChoices}
                                    selected={selectedInstructionIds}
                                    onChange={setSelectedInstructionIds}
                                />
                            </div>
                        )}

                        {/* Advanced settings — collapsible (tone · length · language · toggles) */}
                        {!gitBlocked && (
                        <div style={{ marginTop: 18 }}>
                            <button type="button" onClick={() => setAdvOpen((v) => !v)} aria-expanded={advOpen} style={{
                                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                                padding: "11px 14px", borderRadius: 8, cursor: "pointer",
                                background: "var(--base-background, #fff)",
                                border: "1px solid var(--text-color-200, #eaecf0)",
                                transition: "background .12s, border-color .12s",
                            }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 700, color: "var(--ink-2)" }}>
                                    <IcSliders size={16} />{__("Advanced settings", "betterdocs")}
                                </span>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>{advSummary}</span>
                                    <span style={{ display: "flex", color: "var(--muted)", transform: advOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
                                        <IcChevDown size={16} />
                                    </span>
                                </span>
                            </button>

                            {advOpen && (
                                <div style={{ marginTop: 10, background: "var(--base-background, #fff)", border: "1px solid var(--text-color-200, #eaecf0)", borderRadius: 8, padding: "2px 16px" }}>
                                    {settingRows.map((row, i) => (
                                        <div key={row.key} style={{ borderTop: i ? "1px solid var(--border-soft)" : "none" }}>{row}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                        )}

                        {/* footer */}
                        {!gitBlocked && (
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border-soft)" }}>
                            <div style={{ marginRight: "auto" }}><TokenMeter estimated={est} max={config.max_token || 4000} hidden /></div>
                            {tab === "prompt" && (
                                <>
                                    <GhostBtn icon={<IcList size={16} />} onClick={() => run("generate-outline")} disabled={!canPrompt}>{__("Generate Outline", "betterdocs")}</GhostBtn>
                                    <PrimaryBtn icon={<IcSpark size={16} />} onClick={() => run("generate-doc")} disabled={!canPrompt}>{__("Generate Doc", "betterdocs")}</PrimaryBtn>
                                </>
                            )}
                            {tab === "source" && (
                                <PrimaryBtn icon={<IcSpark size={16} />} onClick={() => run("from-source")} disabled={!canSource}>{__("Generate from source", "betterdocs")}</PrimaryBtn>
                            )}
                            {tab === "git" && (
                                <PrimaryBtn icon={<IcSpark size={16} />} onClick={() => run("from-git")} disabled={!canGit}>{__("Generate from Git", "betterdocs")}</PrimaryBtn>
                            )}
                            {tab === "attachment" && (
                                <PrimaryBtn icon={<IcSpark size={16} />} onClick={() => run("from-attachment")} disabled={!canAttachment}>{__("Generate from attachment", "betterdocs")}</PrimaryBtn>
                            )}
                        </div>
                        )}
                        {!hasKey && <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 8, textAlign: "right" }}>{__("Connect an API key in Settings → AI to enable generation.", "betterdocs")}</div>}
                    </>
                )}

                {(stage === "loadingDoc" || stage === "loadingOutline") && (
                    <PreviewAccept mode="doc" status="loading"
                        loadingLabel={stage === "loadingOutline" ? __("Outlining", "betterdocs") : (tab === "source" ? __("Reading your source", "betterdocs") : tab === "git" ? __("Fetching from Git", "betterdocs") : tab === "attachment" ? (isRecording(file) ? __("Writing from your transcript", "betterdocs") : __("Reading your file", "betterdocs")) : __("Generating documentation", "betterdocs"))}
                        onKeep={() => { }} onDiscard={() => setStage("form")} />
                )}

                {stage === "outline" && (
                    <OutlineEditor items={outline} setItems={setOutline} onExpand={expand}
                        onRegenerate={() => run("generate-outline")} onDiscard={() => setStage("form")} />
                )}

                {(stage === "preview" || stage === "previewError") && (
                    <PreviewAccept mode="doc" status={stage === "previewError" ? "error" : "ready"} error={error} html={html}
                        keepLabel={__("Keep & insert", "betterdocs")} maxHeight={340}
                        onKeep={keepAndInsert} onRegenerate={regenerateDoc} onDiscard={() => setStage("form")}
                        actions={
                            <div style={{ width: "100%" }}>
                                {stage === "preview" && canSuggest && enabledSuggestTaxes().length > 0 && (
                                    <SuggestTermsPreview
                                        groups={enabledSuggestTaxes().map((t) => ({ taxonomy: t.taxonomy, label: t.label, items: suggestions[t.taxonomy] || [] }))}
                                        selected={selectedKeys}
                                        onToggle={toggleKey}
                                        loading={suggestLoading}
                                    />
                                )}
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18 }}>
                                    <TextBtn onClick={() => setStage("form")} style={{ marginRight: "auto" }}>{__("Discard", "betterdocs")}</TextBtn>
                                    <GhostBtn icon={<IcRefresh size={15} />} onClick={regenerateDoc}>{__("Regenerate", "betterdocs")}</GhostBtn>
                                    <PrimaryBtn icon={<IcCheck size={16} sw={2.4} />} onClick={keepAndInsert} disabled={stage !== "preview"}>{__("Keep & insert", "betterdocs")}</PrimaryBtn>
                                </div>
                            </div>
                        } />
                )}
            </div>
        </Modal>
    );
};

export default StudioGenerateModal;
