// ===== write-with-ai/SuggestTermsPreview.js — term suggestions in the preview step =====
// Rendered beneath the generated-doc preview when the "Suggest categories & tags"
// advanced toggle is on. Shows AI-suggested terms grouped by taxonomy
// as selectable chips (existing terms reused; new ones badged "new"). Selection is
// controlled by the modal, which applies the kept terms on "Keep & insert".

import { __ } from "@wordpress/i18n";
import { Spinner } from "../ai-shared/kit";

// One selectable term chip. Active = kept (will be added to the doc on insert).
const Chip = ({ item, active, onToggle }) => (
    <button type="button" onClick={onToggle} style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 10px", borderRadius: 8, cursor: "pointer",
        fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap",
        border: `1px solid ${active ? "var(--green)" : "var(--border)"}`,
        background: active ? "var(--text-color-50, #f9fafb)" : "white",
        color: "var(--ink-2)",
        transition: "background .12s, border-color .12s, color .12s",
    }}>
        <span style={{ fontSize: 13, lineHeight: 1, width: 10, textAlign: "center", color: active ? "var(--green)" : "var(--muted)" }}>{active ? "✓" : "+"}</span>
        <span>{item.name}</span>
        {item.is_new && (
            <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 0.2, textTransform: "lowercase",
                padding: "2px 6px", borderRadius: 5, marginLeft: 2,
                background: "var(--text-color-200, #eaecf0)", color: "var(--text-color-700, #344054)",
            }}>{__("new", "betterdocs")}</span>
        )}
    </button>
);

// `groups`: [{ taxonomy, label, items: [{name, term_id, is_new}] }]
// `selected`: Set of `${taxonomy}::${name}` keys. `onToggle(key)` flips one.
// Per-taxonomy message shown when a group has no suggestions (instead of a blank gap).
const EMPTY_TEXT = {
    doc_category: __("No category suggestions for this doc.", "betterdocs"),
    doc_tag:      __("No tag suggestions for this doc.", "betterdocs"),
};

const SuggestTermsPreview = ({ groups, selected, onToggle, loading }) => {
    // Only bail when there are no enabled taxonomies at all; an enabled taxonomy
    // that returns nothing still renders an explanatory message below.
    if (!loading && groups.length === 0) return null;

    return (
        <div style={{ marginTop: 18, borderTop: "1px solid var(--border-soft)", paddingTop: 16 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: "var(--ink)" }}>
                {__("Suggested categories & tags", "betterdocs")}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", margin: "3px 0 12px" }}>
                {__("Pick the terms to add — existing terms are reused, new ones are created on insert.", "betterdocs")}
            </div>

            {loading && (
                <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: "var(--muted)" }}>
                    <Spinner size={15} /> {__("Finding relevant terms…", "betterdocs")}
                </div>
            )}

            {!loading && groups.map((g) => (
                <div key={g.taxonomy} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: "var(--muted-2)", marginBottom: 7 }}>
                        {g.label}
                    </div>
                    {g.items.length ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                            {g.items.map((item) => {
                                const key = `${g.taxonomy}::${item.name}`;
                                return <Chip key={key} item={item} active={selected.has(key)} onToggle={() => onToggle(key)} />;
                            })}
                        </div>
                    ) : (
                        <div style={{ fontSize: 12.5, color: "var(--muted)", fontStyle: "italic" }}>
                            {EMPTY_TEXT[g.taxonomy] || __("No suggestions found.", "betterdocs")}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SuggestTermsPreview;
