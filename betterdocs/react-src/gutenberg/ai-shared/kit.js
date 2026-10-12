// ===== ai-shared/kit.js — shared primitives for the BetterDocs AI surfaces =====
// Ported from the AI Studio mockup (ai-kit.jsx). Plain-React components styled
// with inline styles + the CSS custom properties defined in tokens.scss. Every
// portal root carries `.bd-ai-scope` so those `var(--x)` tokens resolve.
//
// Consumed by BOTH the Write-with-AI modal and the restyled Edit-with-AI modal.

import { useState, useEffect, useRef, createPortal } from "@wordpress/element";
import Select from "react-select";

// ── Icons (stroke 1.7, currentColor — same convention as the mockup) ─────────
export const AIcon = ({ d, size = 16, fill = "none", stroke = "currentColor", sw = 1.7, children, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
        strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...p}>
        {d && <path d={d} />}
        {children}
    </svg>
);

export const IcClose    = (p) => <AIcon {...p} d="M6 6l12 12M6 18 18 6" />;
export const IcChevDown = (p) => <AIcon {...p} d="m6 9 6 6 6-6" />;
export const IcPlus     = (p) => <AIcon {...p} d="M12 5v14M5 12h14" />;
export const IcTrash    = (p) => <AIcon {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></AIcon>;
export const IcGrip     = (p) => (
    <AIcon {...p} fill="currentColor" stroke="none">
        <circle cx="9" cy="6" r="1.4" /><circle cx="9" cy="12" r="1.4" /><circle cx="9" cy="18" r="1.4" />
        <circle cx="15" cy="6" r="1.4" /><circle cx="15" cy="12" r="1.4" /><circle cx="15" cy="18" r="1.4" />
    </AIcon>
);
export const IcCheck    = (p) => <AIcon {...p} d="M5 12l5 5L20 7" />;
export const IcArrowR   = (p) => <AIcon {...p} d="M5 12h14M13 5l7 7-7 7" />;
export const IcRefresh  = (p) => <AIcon {...p} d="M21 12a9 9 0 1 1-3.51-7.13M21 4v5h-5" />;
export const IcAlert    = (p) => <AIcon {...p}><circle cx="12" cy="12" r="10" /><path d="M12 8v5M12 16.5h.01" /></AIcon>;
export const IcList     = (p) => <AIcon {...p} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />;
export const IcSummary  = (p) => <AIcon {...p} d="M4 6h16M4 10h10M4 14h16M4 18h7" />;

// BetterDocs AI mark — the accent-colored pencil from the modal header
export const AIMark = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="var(--ai)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
);
export const AIMarkWhite = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white"
        strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
);
export const AIBadgeIcon = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9z" />
        <path d="M19 14l.9 2.4L22 17l-2.1.6L19 20l-.9-2.4L16 17l2.1-.6z" />
    </svg>
);

// ── AI icon disc (header) ────────────────────────────────────────────────────
export const AIDisc = ({ size = 44 }) => (
    <div style={{
        width: size, height: size, borderRadius: "50%",
        background: "var(--ai-50)", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
    }}>
        <AIMark size={size * 0.42} />
    </div>
);

// ── Buttons ──────────────────────────────────────────────────────────────────
export const PrimaryBtn = ({ children, icon, onClick, disabled, style }) => (
    <button type="button" onClick={disabled ? undefined : onClick} disabled={disabled} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: disabled ? "#cbd5e1" : "var(--green)", color: "white",
        padding: "11px 20px", borderRadius: 8, border: "none",
        fontSize: 14, fontWeight: 600, whiteSpace: "nowrap",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 1px 0 rgba(0,0,0,.04), inset 0 -1px 0 rgba(0,0,0,.06)",
        transition: "background .15s, transform .05s",
        ...style,
    }}
        onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = "var(--green-600)"; }}
        onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = "var(--green)"; }}>
        {icon}{children}
    </button>
);

// Outlined accent button — uses the AI accent color
export const AccentBtn = ({ children, icon, onClick, disabled, style }) => (
    <button type="button" onClick={disabled ? undefined : onClick} disabled={disabled} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "white",
        color: disabled ? "var(--muted-2)" : "var(--ai)",
        padding: "11px 18px", borderRadius: 8,
        border: `1.5px solid ${disabled ? "var(--border)" : "var(--ai-100)"}`,
        fontSize: 14, fontWeight: 600, whiteSpace: "nowrap",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background .15s, border-color .15s, color .15s",
        ...style,
    }}
        onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = "var(--ai-50)"; e.currentTarget.style.borderColor = "var(--ai)"; } }}
        onMouseLeave={e => { if (!disabled) { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "var(--ai-100)"; } }}>
        {icon}{children}
    </button>
);

export const GhostBtn = ({ children, icon, onClick, style, disabled }) => (
    <button type="button" onClick={disabled ? undefined : onClick} disabled={disabled} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "white", color: disabled ? "var(--muted-2)" : "var(--ink-2)",
        padding: "10px 16px", borderRadius: 8,
        border: "1px solid var(--border)",
        fontSize: 14, fontWeight: 600, whiteSpace: "nowrap",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.7 : 1,
        transition: "background .15s, border-color .15s",
        ...style,
    }}
        onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#d8dde3"; } }}
        onMouseLeave={e => { if (!disabled) { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "var(--border)"; } }}>
        {icon}{children}
    </button>
);

// Quiet tertiary text button — used for "Discard"
export const TextBtn = ({ children, onClick, tone = "muted", style }) => {
    const color = tone === "danger" ? "#dc2626" : "var(--muted)";
    return (
        <button type="button" onClick={onClick} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "transparent", color, padding: "10px 12px",
            border: "none", borderRadius: 8, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
            transition: "background .12s, color .12s", ...style,
        }}
            onMouseEnter={e => { e.currentTarget.style.background = tone === "danger" ? "#fef2f2" : "#f4f6f8"; e.currentTarget.style.color = tone === "danger" ? "#dc2626" : "var(--ink-2)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = color; }}>
            {children}
        </button>
    );
};

// ── "AI generated" pill ──────────────────────────────────────────────────────
// Neutral ash pill so the surface isn't flooded with green — the AI identity is
// carried by the small green sparkle icon alone.
export const AIPill = ({ children = "AI generated", style }) => (
    <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "var(--text-color-50, #f9fafb)", color: "var(--text-color-600, #667085)",
        padding: "5px 11px 5px 9px", borderRadius: 999,
        fontSize: 11.5, fontWeight: 700, letterSpacing: 0.1, whiteSpace: "nowrap", flexShrink: 0,
        border: "1px solid var(--text-color-200, #eaecf0)", ...style,
    }}>
        <span style={{ color: "var(--ai)", display: "flex" }}><AIBadgeIcon size={13} /></span>{children}
    </span>
);

// ── WP-style notice banner (light red, left accent bar) ──────────────────────
export const Banner = ({ tone = "error", children, style }) => {
    const t = tone === "error"
        ? { bg: "var(--wp-red-50)", bar: "var(--wp-red)", fg: "#8a1f20", icon: "var(--wp-red)" }
        : { bg: "#fef6e0", bar: "#d9a406", fg: "#8a6400", icon: "#d9a406" };
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: t.bg, color: t.fg,
            borderRadius: 8,
            padding: "12px 14px", fontSize: 13, fontWeight: 500, lineHeight: 1.5,
            ...style,
        }}>
            <span style={{ color: t.icon, flexShrink: 0, display: "flex" }}><IcAlert size={17} sw={2} /></span>
            <span style={{ flex: 1 }}>{children}</span>
        </div>
    );
};

// ── Spinner + inline "working" status ────────────────────────────────────────
export const Spinner = ({ size = 18, color = "var(--ai)", sw = 2.4 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: "bd-ai-spin .8s linear infinite", flexShrink: 0 }}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".18" strokeWidth={sw} style={{ color }} />
        <path d="M21 12a9 9 0 0 0-9-9" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
);
export const WorkingDots = ({ color = "var(--ai)" }) => (
    <span style={{ display: "inline-flex", gap: 3, marginLeft: 1 }}>
        {[0, 1, 2].map(i => (
            <span key={i} style={{
                width: 4, height: 4, borderRadius: "50%", background: color,
                animation: "bd-ai-dotPulse 1.1s ease-in-out infinite", animationDelay: `${i * 0.16}s`,
            }} />
        ))}
    </span>
);

// ── Inputs ───────────────────────────────────────────────────────────────────
export const FieldLabel = ({ children, required, style }) => (
    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8, ...style }}>
        {children}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
    </div>
);

export const TextInput = ({ value, onChange, placeholder, autoFocus, disabled }) => {
    const [focus, setFocus] = useState(false);
    return (
        <input
            type="text" autoFocus={autoFocus} value={value} placeholder={placeholder} disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
            style={{
                width: "100%", border: `1px solid ${focus ? "var(--green)" : "var(--border)"}`,
                background: focus ? "white" : "#fcfcfd",
                boxShadow: focus ? "0 0 0 3px rgba(0,184,132,.14)" : "none",
                borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "var(--ink)",
                outline: "none", transition: "border-color .15s, box-shadow .15s, background .15s",
            }} />
    );
};

export const TextArea = ({ value, onChange, placeholder, rows = 4, disabled }) => {
    const [focus, setFocus] = useState(false);
    return (
        <textarea
            rows={rows} value={value} placeholder={placeholder} disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
            style={{
                width: "100%", resize: "vertical",
                border: `1px solid ${focus ? "var(--green)" : "var(--border)"}`,
                background: focus ? "white" : "#fcfcfd",
                boxShadow: focus ? "0 0 0 3px rgba(0,184,132,.14)" : "none",
                borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "var(--ink-2)",
                outline: "none", fontFamily: "inherit", lineHeight: 1.55,
                transition: "border-color .15s, box-shadow .15s, background .15s",
            }} />
    );
};

// On/off switch styled to match the kit — used for the title / overwrite toggles.
export const Toggle = ({ checked, onChange, label, disabled }) => (
    <label style={{
        display: "inline-flex", alignItems: "center", gap: 9,
        fontSize: 12.5, fontWeight: 600, color: "var(--ink-2)",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1,
    }}>
        <span
            role="switch" aria-checked={!!checked}
            onClick={() => { if (!disabled) onChange(!checked); }}
            style={{
                position: "relative", width: 36, height: 20, flexShrink: 0,
                borderRadius: 999, background: checked ? "var(--green)" : "#cbd5e1",
                transition: "background .15s",
            }}>
            <span style={{
                position: "absolute", top: 2, left: checked ? 18 : 2,
                width: 16, height: 16, borderRadius: "50%", background: "white",
                boxShadow: "0 1px 2px rgba(15,23,42,.25)", transition: "left .15s",
            }} />
        </span>
        {label}
    </label>
);

// Native <select> styled to match the BetterDocs dashboard select control via
// the shared `.bd-ai-select` class (see ai-shared/tokens.scss). Used for the
// language / source-type / git / tone / length pickers.
export const Pick = ({ value, onChange, options, style, disabled }) => (
    <div style={{ position: "relative", ...style }}>
        <select className="bd-ai-select" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
            {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--muted)", display: "flex" }}>
            <IcChevDown size={16} />
        </span>
    </div>
);

// react-select dropdown that reuses the BetterDocs dashboard "betterdocs-dropdown"
// (FAQ order / bulk-actions) markup + classNamePrefix, so its control + styled
// option menu match the admin exactly. Styling lives in ai-shared/tokens.scss
// (scoped to .bd-ai-scope). Used for the source / git / language pickers.
export const DropdownSelect = ({ value, onChange, options, style, disabled, isSearchable = false, placeholder, formatOptionLabel }) => (
    <div className="betterdocs-dropdown-wrapper" style={style}>
        <Select
            className="betterdocs-dropdown-select"
            classNamePrefix="betterdocs-dropdown"
            value={options.find((o) => o.value === value) || null}
            options={options}
            onChange={(opt) => onChange(opt ? opt.value : "")}
            isDisabled={disabled}
            isSearchable={isSearchable}
            isClearable={false}
            placeholder={placeholder}
            formatOptionLabel={formatOptionLabel}
            menuPlacement="auto"
            menuShouldScrollIntoView={false}
        />
    </div>
);

// ── Modal shell — rendered through a portal at document.body ──────────────────
export const Modal = ({ open, onClose, width = 600, children, labelledBy }) => {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    if (!open) return null;
    return createPortal(
        <div className="bd-ai-scope" style={{ position: "fixed", inset: 0, zIndex: 100050 }} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
            <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.4)", animation: "bd-ai-fadeIn .15s ease" }} />
            <div style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width, maxWidth: "calc(100vw - 48px)", maxHeight: "calc(100vh - 48px)",
                background: "white", borderRadius: 16, boxShadow: "var(--shadow-lg)",
                display: "flex", flexDirection: "column", overflow: "hidden",
                animation: "bd-ai-modalIn .2s cubic-bezier(.2,.7,.3,1)",
            }}>
                {children}
                {/* Matches the admin .bd-faq-modal-close-button — 32px ash rounded
                    square with the shared X glyph, no shadow. */}
                <button type="button" onClick={onClose} title="Close" aria-label="Close" style={{
                    position: "absolute", top: 16, right: 22, zIndex: 2,
                    width: 32, height: 32, borderRadius: 9, border: "none",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    color: "var(--muted)", background: "#f2f4f7", cursor: "pointer",
                    boxShadow: "none", transition: "all .2s ease-in-out",
                }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#eaecf0"; e.currentTarget.style.color = "var(--ink)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#f2f4f7"; e.currentTarget.style.color = "var(--muted)"; }}>
                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.69687 14L0.296875 12.6L5.89687 7L0.296875 1.4L1.69687 0L7.29688 5.6L12.8969 0L14.2969 1.4L8.69688 7L14.2969 12.6L12.8969 14L7.29688 8.4L1.69687 14Z" fill="currentColor" />
                    </svg>
                </button>
            </div>
        </div>,
        document.body
    );
};
