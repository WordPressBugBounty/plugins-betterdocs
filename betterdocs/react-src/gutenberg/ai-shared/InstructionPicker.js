// ===== ai-shared/InstructionPicker.js =====
// Shared selector for saved "Write with AI" instruction sets, used by both the
// Write Documentation modal and the AI Edit modal. The "Default" set is never
// listed here — the backend always applies it as the base system prompt; this
// picker only selects the *extra* sets layered on top.
//
// Rendering rules (per product spec):
//   • 0 sets  → render nothing (caller usually guards too).
//   • 1–4 set → segmented toggle buttons (multi-select).
//   • ≥ 5 set → multi-select dropdown with checkboxes.

import { __, sprintf } from "@wordpress/i18n";
import { useState, useRef, useEffect } from "@wordpress/element";
import { IcChevDown, IcCheck, AIcon } from "./kit";

const BUTTON_LIMIT = 4;

// Default section wording — shared verbatim by the Write-with-AI and Edit-with-AI
// modals so the "Instructions" picker looks and reads the same in both places.
const DEFAULT_LABEL = __("Instructions", "betterdocs");
const DEFAULT_HINT = __("Optional — saved instructions that steer the AI", "betterdocs");

// Small compass glyph shown before each chip title — "guides" that steer the AI.
const IcGuide = (p) => (
    <AIcon sw={1.7} {...p}>
        <circle cx="12" cy="12" r="9" />
        <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </AIcon>
);

// Capitalized section label + right-aligned muted hint — mirrors the FieldLabel
// used across the Write Documentation modal (13px / 700 / ink), not an all-caps
// eyebrow.
const eyebrowStyle = { fontSize: 13, fontWeight: 700, textTransform: "capitalize", color: "var(--ink-2)" };
const hintStyle = { fontSize: 12, fontWeight: 500, color: "var(--muted)" };

const toggle = (ids, id) =>
    ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];

// ── ≤ 4 sets: segmented toggle buttons ───────────────────────────────────────
// `leadingIcon` (optional) renders before every chip title; when omitted the chip
// shows a check icon on the active item (the original behavior).
const ButtonGroup = ({ items, selected, onChange, disabled, leadingIcon }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {items.map((it) => {
            const active = selected.includes(it.id);
            return (
                <button
                    key={it.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(toggle(selected, it.id))}
                    title={it.title}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        maxWidth: 240,
                        padding: "8px 14px",
                        borderRadius: 8,
                        cursor: disabled ? "not-allowed" : "pointer",
                        fontSize: 12.5,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        background: active ? "var(--ai-50)" : "white",
                        color: active ? "var(--ai)" : "var(--ink-2)",
                        border: `1px solid ${active ? "var(--ai-100)" : "var(--border)"}`,
                        opacity: disabled ? 0.55 : 1,
                        transition: "background .12s, border-color .12s, color .12s",
                    }}
                >
                    {leadingIcon
                        ? <span style={{ display: "flex", flexShrink: 0 }}>{leadingIcon}</span>
                        : (active && <IcCheck size={14} sw={2.6} />)}
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                        {it.title}
                    </span>
                </button>
            );
        })}
    </div>
);

// ── ≥ 5 sets: multi-select dropdown ──────────────────────────────────────────
const Dropdown = ({ items, selected, onChange, disabled }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onDocClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [open]);

    const count = selected.length;
    const summary =
        count === 0
            ? __("Select instructions…", "betterdocs")
            : sprintf(
                  /* translators: %d: number of selected instruction sets. */
                  __("%d selected", "betterdocs"),
                  count
              );

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    border: "1px solid var(--border)",
                    background: "#fcfcfd",
                    borderRadius: 9,
                    padding: "9px 12px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: count ? "var(--ink-2)" : "var(--muted)",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.55 : 1,
                }}
            >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {summary}
                </span>
                <span
                    style={{
                        display: "flex",
                        color: "var(--muted)",
                        transform: open ? "rotate(180deg)" : "none",
                        transition: "transform .15s",
                    }}
                >
                    <IcChevDown size={15} />
                </span>
            </button>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        zIndex: 10,
                        top: "calc(100% + 6px)",
                        left: 0,
                        right: 0,
                        maxHeight: 240,
                        overflowY: "auto",
                        background: "white",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        boxShadow: "0 8px 24px rgba(15,23,42,.12)",
                        padding: 6,
                    }}
                >
                    {items.map((it) => {
                        const active = selected.includes(it.id);
                        return (
                            <button
                                key={it.id}
                                type="button"
                                onClick={() => onChange(toggle(selected, it.id))}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: "8px 10px",
                                    borderRadius: 7,
                                    border: "none",
                                    background: active ? "var(--ai-50)" : "transparent",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "var(--ink-2)",
                                }}
                            >
                                <span
                                    style={{
                                        width: 18,
                                        height: 18,
                                        flexShrink: 0,
                                        borderRadius: 5,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: active ? "var(--ai)" : "white",
                                        border: `1px solid ${active ? "var(--ai)" : "var(--border)"}`,
                                        color: "white",
                                    }}
                                >
                                    {active && <IcCheck size={12} sw={3} />}
                                </span>
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {it.title}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ── Public component ─────────────────────────────────────────────────────────
const InstructionPicker = ({
    instructions,
    selected = [],
    onChange,
    disabled = false,
    label,
    hint,
    hideLabel = false,
    leadingIcon,
    style,
}) => {
    const items = Array.isArray(instructions)
        ? instructions.filter((i) => i && i.id)
        : [];

    if (items.length === 0) return null;

    const headerLabel = label || DEFAULT_LABEL;
    const headerHint = hint === undefined ? DEFAULT_HINT : hint; // pass "" to suppress
    const chipIcon = leadingIcon || <IcGuide size={14} />;

    return (
        <div style={style}>
            {!hideLabel && (
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                    <span style={eyebrowStyle}>{headerLabel}</span>
                    {headerHint && <span style={hintStyle}>{headerHint}</span>}
                </div>
            )}
            {items.length <= BUTTON_LIMIT ? (
                <ButtonGroup items={items} selected={selected} onChange={onChange} disabled={disabled} leadingIcon={chipIcon} />
            ) : (
                <Dropdown items={items} selected={selected} onChange={onChange} disabled={disabled} />
            )}
        </div>
    );
};

export default InstructionPicker;
