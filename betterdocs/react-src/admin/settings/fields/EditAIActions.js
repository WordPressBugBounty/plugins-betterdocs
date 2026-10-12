import React, { useMemo, useState } from "react";
import { __ } from "@wordpress/i18n";
import { v4 } from "uuid";
import { useBuilderContext, withLabel } from "quickbuilder";
import ReactModal from "react-modal";
import Swal from "sweetalert2";
import CloseIcon from "../components/CloseIcon";
import { apiFetch, toastAlert } from "../../utils";

// ── Edit AI Personalize → Edit with AI actions ───────────────────────────────
// List + modal editor, mirroring the Write AI Personalize instruction sets.
// Predefined actions (predefined === true) can be toggled on/off and have their
// instruction edited, but their label is locked and they can't be deleted. Custom
// actions can be added, fully edited, and removed. Enable toggles persist inline;
// add/edit happens in a popup, persisted via the settings endpoint (merges per-key).

// Predefined actions whose prompt carries a {option} placeholder, with the label
// of the option BetterDocs substitutes at runtime (tone / language picker).
const OPTION_HINTS = {
    change_tone: __("tone", "betterdocs"),
    translate: __("language", "betterdocs"),
};

// Row action icons (match WwaInstructions.js / BetterRepeaterValueShow.js).
const EditIcon = ({ onClick }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 12 12" fill="none" onClick={onClick}>
        <path fillRule="evenodd" clipRule="evenodd" d="M8.60581 0.582347C8.97868 0.209473 9.48441 0 10.0117 0C10.2729 0 10.5314 0.0514267 10.7726 0.151347C11.0139 0.251267 11.233 0.39772 11.4177 0.582347C11.6023 0.766973 11.7487 0.98616 11.8487 1.22739C11.9486 1.46861 12 1.72716 12 1.98826C12 2.24936 11.9486 2.50791 11.8487 2.74913C11.7487 2.99036 11.6023 3.20955 11.4177 3.39417L10.6821 4.12977C10.4217 4.39013 9.99961 4.39013 9.73928 4.12978L7.87021 2.26076C7.60988 2.00041 7.60988 1.5783 7.87021 1.31795L8.60581 0.582347ZM6.92741 3.20357C6.66708 2.94322 6.24495 2.94322 5.98461 3.20357L1.34057 7.8476C0.913375 8.2748 0.610308 8.81007 0.463781 9.3962L0.0199214 11.1717C-0.0368786 11.3988 0.0296881 11.6391 0.195275 11.8047C0.360861 11.9703 0.601188 12.0369 0.828375 11.9801L2.60382 11.5362C3.18993 11.3897 3.72519 11.0867 4.15239 10.6595L8.79641 6.0154C9.05681 5.75507 9.05681 5.33293 8.79641 5.0726L6.92741 3.20357Z" fill="#718096" />
        <path fillRule="evenodd" clipRule="evenodd" d="M6 11.3346C6 10.9664 6.29847 10.668 6.66667 10.668H11.3333C11.7015 10.668 12 10.9664 12 11.3346C12 11.7028 11.7015 12.0013 11.3333 12.0013H6.66667C6.29847 12.0013 6 11.7028 6 11.3346Z" fill="#718096" />
    </svg>
);

const DeleteIcon = ({ onClick }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none" onClick={onClick}>
        <path d="M2 3.9987H3.33333M3.33333 3.9987H14M3.33333 3.9987V13.332C3.33333 13.6857 3.47381 14.0248 3.72386 14.2748C3.97391 14.5249 4.31304 14.6654 4.66667 14.6654H11.3333C11.687 14.6654 12.0261 14.5249 12.2761 14.2748C12.5262 14.0248 12.6667 13.6857 12.6667 13.332V3.9987H3.33333ZM5.33333 3.9987V2.66536C5.33333 2.31174 5.47381 1.9726 5.72386 1.72256C5.97391 1.47251 6.31304 1.33203 6.66667 1.33203H9.33333C9.68696 1.33203 10.0261 1.47251 10.2761 1.72256C10.5262 1.9726 10.6667 2.31174 10.6667 2.66536V3.9987M6.66667 7.33203V11.332M9.33333 7.33203V11.332" stroke="#98A2B3" strokeWidth={1.66667} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Lightweight enable/disable switch — self-contained inline styles so the field
// doesn't depend on quickbuilder's toggle markup.
const Toggle = ({ checked, onChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
            position: "relative", width: 36, height: 20, borderRadius: 999,
            border: "none", cursor: "pointer", padding: 0, flex: "0 0 auto",
            background: checked ? "#00b884" : "#cbd2d9", transition: "background .15s",
        }}
    >
        <span style={{
            position: "absolute", top: 2, left: checked ? 18 : 2, width: 16, height: 16,
            borderRadius: "50%", background: "#fff", transition: "left .15s",
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }} />
    </button>
);

const formStyles = {
    label: { display: "block", fontSize: 13, fontWeight: 600, color: "#1e2329", margin: "0 0 6px" },
    input: {
        width: "100%", boxSizing: "border-box", border: "1px solid #d8dde2", borderRadius: 7,
        padding: "10px 12px", fontSize: 14, color: "#1e2329", outline: "none",
    },
    textarea: {
        width: "100%", boxSizing: "border-box", minHeight: 180, resize: "vertical",
        border: "1px solid #d8dde2", borderRadius: 8, padding: "11px 13px", fontSize: 13, lineHeight: 1.55,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
        color: "#1e2329", outline: "none",
    },
    group: { marginBottom: 18 },
    lockedNote: { fontSize: 12.5, color: "#667085", marginTop: 6 },
    footer: {
        display: "flex", justifyContent: "flex-end", alignItems: "center",
        gap: 10, marginTop: 26,
    },
    btnCancel: {
        background: "#fff", border: "1px solid #d0d5dd", color: "#344054",
        borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600,
        cursor: "pointer", lineHeight: 1.42,
    },
    btnSave: {
        background: "#00b884", border: "none", color: "#fff",
        borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600,
        cursor: "pointer", lineHeight: 1.42,
    },
};

// react-modal overlay + content for the shared FAQ-builder modal shell
// (.bd-faq-ctg-modal), matching CategoryModal so the modal reads identically.
const customStyles = {
    overlay: {
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(35, 40, 45, 0.5)", zIndex: 99999,
        padding: 50, paddingTop: 70, display: "flex", flexDirection: "column", overflow: "auto",
    },
    content: {
        width: "40rem", maxWidth: "90%", position: "static", height: "auto", overflow: "initial", margin: "auto",
    },
};

const noteStyle = { margin: "6px 0 0", fontSize: 12.5, lineHeight: 1.45, color: "var(--text-color-600, #667085)" };

const EditAIActions = (props) => {
    const builderContext = useBuilderContext();
    const fieldName = props.name;

    const raw = builderContext.values?.[fieldName];
    const items = useMemo(() => {
        const source = Array.isArray(raw) ? raw : Array.isArray(props.value) ? props.value : [];
        return source.map((it) => ({
            id: it?.id || v4(),
            label: it?.label ?? "",
            instruction: it?.instruction ?? "",
            enabled: it?.enabled === undefined ? true : !!it.enabled,
            predefined: !!it?.predefined,
        }));
    }, [raw, props.value]);

    // editing: { index, isNew, draft } | null
    const [editing, setEditing] = useState(null);

    // Update form state for immediate UI feedback, then persist this single field
    // via the settings endpoint (it merges per-key) — no page-level Save needed.
    const persist = (next) => {
        builderContext.setFieldValue(fieldName, next);
        apiFetch
            .post("settings", { [fieldName]: next, _active_tab: "tab-betterdocs-ai" })
            .then((res) => {
                if (res?.success) {
                    toastAlert("success", __("Actions saved.", "betterdocs"));
                } else {
                    toastAlert(
                        res?.code === "nothing_changed" ? "info" : "error",
                        __(res?.message ?? "Couldn't save actions.", "betterdocs")
                    );
                }
            });
    };

    const toast = (type, msg) => {
        if (props?.context?.alerts?.toast) props.context.alerts.toast(type, msg);
        else toastAlert(type, msg);
    };

    const onToggle = (index, enabled) => {
        persist(items.map((it, i) => (i === index ? { ...it, enabled } : it)));
    };

    const openEdit = (index) => {
        setEditing({ index, isNew: false, draft: { ...items[index] } });
    };

    const openAdd = () => {
        setEditing({
            index: -1,
            isNew: true,
            draft: { id: v4(), label: "", instruction: "", enabled: true, predefined: false },
        });
    };

    const closeModal = () => setEditing(null);

    const saveModal = () => {
        if (!editing) return;
        const draft = {
            id: editing.draft.id || v4(),
            label: (editing.draft.label || "").trim(),
            instruction: editing.draft.instruction || "",
            enabled: editing.draft.enabled === undefined ? true : !!editing.draft.enabled,
            predefined: !!editing.draft.predefined,
        };
        if (!draft.predefined && draft.label === "") {
            toast("error", __("Please add a name for this action.", "betterdocs"));
            return;
        }
        if (draft.instruction.trim() === "") {
            toast("error", __("Instruction can't be empty.", "betterdocs"));
            return;
        }

        if (editing.isNew) {
            persist([...items, draft]);
        } else {
            persist(items.map((it, i) => (i === editing.index ? draft : it)));
        }
        setEditing(null);
    };

    const onDelete = (index) => {
        if (items[index]?.predefined) return;
        Swal.fire({
            text: __("Are you sure you want to delete this action?", "betterdocs"),
            icon: "warning",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: __("Yes", "betterdocs"),
            cancelButtonText: __("No", "betterdocs"),
            customClass: { popup: "betterdocs-bulk-action-popup" },
        }).then((result) => {
            if (result?.isConfirmed) {
                persist(items.filter((_, i) => i !== index));
            }
        });
    };

    const setDraft = (patch) =>
        setEditing((e) => (e ? { ...e, draft: { ...e.draft, ...patch } } : e));

    const editingIsPredefined = editing && editing.draft.predefined;
    const editingOptionHint = editing && OPTION_HINTS[editing.draft.id];

    return (
        <div className="wprf-control-field wwa-instructions-field edit-ai-actions-field">
            <div className="wprf-repeater-control">
                <div className="wprf-repeater-content">
                    {items.map((item, index) => (
                        <div className="wprf-repeater-field" key={item.id}>
                            <div className="wprf-repeater-inner-field betterdocs">
                                <div className="wprf-repeater-inner-field-item">
                                    <p>{item.label || __("(Untitled)", "betterdocs")}</p>
                                </div>
                                <div className="betterdocs-action-toggle-wrapper">
                                    <div className="betterdocs-cookies-list-action">
                                        <ul id="betterdocs-admin-actions-ul" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <Toggle checked={item.enabled} onChange={(v) => onToggle(index, v)} />
                                            <EditIcon onClick={() => openEdit(index)} />
                                            {!item.predefined && (
                                                <DeleteIcon onClick={() => onDelete(index)} />
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="wprf-repeater-label" onClick={openAdd}>
                    <button type="button" className="wprf-repeater-button" onClick={openAdd}>
                        + {__("Add Action", "betterdocs")}
                    </button>
                </div>
            </div>

            <ReactModal
                isOpen={!!editing}
                ariaHideApp={false}
                className="bd-faq-ctg-modal"
                onRequestClose={closeModal}
                style={customStyles}
            >
                <div className="bd-faq-ctg-header">
                    <span
                        className="bd-faq-stat-card__icon"
                        style={{ "--bd-icon-tint": "#7f56d9", "--bd-icon-tint-rgb": "127, 86, 217" }}
                    >
                        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
                            <path d="M19 15l.9 2.4L22 18l-2.1.6L19 21l-.9-2.4L16 18l2.1-.6z" />
                        </svg>
                    </span>
                    <div className="bd-faq-ctg-heading">
                        <h3 className="bd-faq-ctg-title">
                            {editing && editing.isNew ? __("Add Action", "betterdocs") : __("Edit Action", "betterdocs")}
                        </h3>
                        <p className="bd-faq-ctg-subtitle">
                            {__("Name the action and write the instruction BetterDocs AI should follow when it runs on the selected content.", "betterdocs")}
                        </p>
                    </div>
                </div>

                {editing && (
                    <div className="bd-faq-ctg-body">
                        <div className="bd-faq-cgt-field">
                            <label className="bd-faq-label">{__("Action name", "betterdocs")}</label>
                            <input
                                type="text"
                                className="bd-faq-input"
                                style={editingIsPredefined ? { background: "var(--text-color-100)", color: "var(--text-color-600)", cursor: "not-allowed" } : undefined}
                                value={editing.draft.label}
                                readOnly={editingIsPredefined}
                                placeholder={__("e.g. Add a TL;DR", "betterdocs")}
                                onChange={(e) => setDraft({ label: e.target.value })}
                            />
                            {editingIsPredefined && (
                                <p style={noteStyle}>
                                    {__("This is a built-in action — its name is locked, but you can edit its instruction or turn it off.", "betterdocs")}
                                </p>
                            )}
                        </div>

                        <div className="bd-faq-cgt-field">
                            <label className="bd-faq-label">{__("Instruction", "betterdocs")}</label>
                            <textarea
                                className="bd-faq-textarea"
                                rows={5}
                                value={editing.draft.instruction}
                                placeholder={__("Describe exactly what the AI should do with the selected content…", "betterdocs")}
                                onChange={(e) => setDraft({ instruction: e.target.value })}
                            />
                            {editingOptionHint && (
                                <p style={noteStyle}>{sprintfOption(editingOptionHint)}</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="bd-faq-ctg-footer">
                    <button type="button" className="bd-faq-button button-ghost" onClick={closeModal}>
                        <span className="bd-faq-text">{__("Cancel", "betterdocs")}</span>
                    </button>
                    <button type="button" className="bd-faq-button button-success" onClick={saveModal}>
                        <span className="bd-faq-text">{editing && editing.isNew ? __("Save", "betterdocs") : __("Update", "betterdocs")}</span>
                    </button>
                </div>

                <button type="button" className="bd-faq-modal-close-button" onClick={closeModal}>
                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.69687 14L0.296875 12.6L5.89687 7L0.296875 1.4L1.69687 0L7.29688 5.6L12.8969 0L14.2969 1.4L8.69688 7L14.2969 12.6L12.8969 14L7.29688 8.4L1.69687 14Z" fill="currentColor" />
                    </svg>
                </button>
            </ReactModal>
        </div>
    );
};

// Keep the {option} placeholder explanation readable without string concatenation
// inside JSX. `which` is "tone" or "language".
const sprintfOption = (which) =>
    __("Keep the ", "betterdocs") +
    "{option}" +
    __(" placeholder where the selected ", "betterdocs") +
    which +
    __(" should appear.", "betterdocs");

export default withLabel(React.memo(EditAIActions));
