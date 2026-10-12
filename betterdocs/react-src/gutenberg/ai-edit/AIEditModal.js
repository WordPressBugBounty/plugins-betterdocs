import { __, sprintf } from "@wordpress/i18n";
import { normalizeAIError } from "../../utils/aiErrorMessage";
import { useSelect, useDispatch } from "@wordpress/data";
import { useState, useMemo, useCallback, useEffect } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

import { STORE_KEY } from "./store";
import { PRESETS as FALLBACK_PRESETS, TONE_OPTIONS, LANGUAGE_OPTIONS } from "./presets";
import { applyBlockReplace, applyInsertAfter, applyInlineReplace } from "./apply";

import {
    Modal, TextArea, Pick, Banner,
    PrimaryBtn, GhostBtn, TextBtn, Spinner, AIMarkWhite, IcCheck, IcArrowR,
    AIcon, AIBadgeIcon, IcSummary, IcPlus,
} from "../ai-shared/kit";
import { PreviewAccept } from "../ai-shared/PreviewAccept";
import InstructionPicker from "../ai-shared/InstructionPicker";

const getConfig = () => (typeof window !== "undefined" && window.betterdocsAIEdit) || {};

const resolvePrompt = (preset, optionValue) => {
    if (!preset || !preset.prompt) {
        return "";
    }
    if (preset.needsOption && optionValue) {
        return preset.prompt.split("{option}").join(optionValue);
    }
    return preset.prompt;
};

// ── Action icons (keyed by preset id; custom/unknown actions fall back to a spark)
const Stroke = (props) => <AIcon sw={1.8} {...props} />;
const ACTION_ICONS = {
    improve: (p) => <AIBadgeIcon size={p.size} />,
    shorten: (p) => <Stroke {...p}><path d="M20 4l-5 5m0 0V5m0 4h4" /><path d="M4 20l5-5m0 0v4m0-4H5" /></Stroke>,
    expand: (p) => <Stroke {...p}><path d="M15 9l5-5m0 0h-4m4 0v4" /><path d="M9 15l-5 5m0 0h4m-4 0v-4" /></Stroke>,
    simplify: (p) => <Stroke {...p}><path d="M3 21l9-9" /><path d="M15 3l1.3 2.7L19 7l-2.7 1.3L15 11l-1.3-2.7L11 7z" /></Stroke>,
    change_tone: (p) => <Stroke {...p}><path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" /><circle cx="15" cy="6" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="17" cy="18" r="2" /></Stroke>,
    translate: (p) => <Stroke {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18" /></Stroke>,
    summarize: (p) => <IcSummary size={p.size} sw={1.8} />,
    create_table: (p) => <Stroke {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M3 14h18M9 4v16M15 4v16" /></Stroke>,
};
const iconFor = (id, size = 16) => (ACTION_ICONS[id] || ((p) => <AIBadgeIcon size={p.size} />))({ size });

// Solid quotation-mark glyph — the leading cue on the selected-content excerpt.
const IcQuote = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </svg>
);

// Capitalized section label — mirrors the FieldLabel used across the Write
// Documentation modal (13px / 700 / ink), not an all-caps eyebrow.
const Eyebrow = ({ children, style }) => (
    <div style={{ fontSize: 13, fontWeight: 700, textTransform: "capitalize", color: "var(--ink-2)", ...style }}>
        {children}
    </div>
);

// Muted right-aligned hint sitting on the same row as an Eyebrow.
const HeaderHint = ({ children }) => (
    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>{children}</span>
);

// Small rounded-square icon holder — solid green when active, light grey otherwise.
const IconSquare = ({ active, children }) => (
    <span style={{
        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: active ? "var(--green)" : "#f1f3f5",
        color: active ? "#fff" : "var(--ink-2)",
        transition: "background .12s, color .12s",
    }}>
        {children}
    </span>
);

// Action card — icon square + label. The active state keeps green only as the
// accent (border + icon square) over a subtle ash fill, so the grid doesn't read
// as "all green".
const ActionCard = ({ active, disabled, onClick, icon, children, style }) => (
    <button type="button" onClick={disabled ? undefined : onClick} disabled={disabled} style={{
        display: "flex", alignItems: "center", gap: 10, textAlign: "left",
        padding: "11px 12px", borderRadius: 12, width: "100%",
        cursor: disabled ? "not-allowed" : "pointer",
        background: active ? "var(--text-color-50, #f9fafb)" : "#fff",
        border: `1.5px solid ${active ? "var(--ai)" : "var(--border)"}`,
        color: "var(--ink-2)",
        fontSize: 13, fontWeight: 600,
        opacity: disabled ? 0.55 : 1, transition: "background .12s, border-color .12s, color .12s",
        ...style,
    }}>
        <IconSquare active={active}>{icon}</IconSquare>
        {children}
    </button>
);

const AIEditModal = () => {
    const state = useSelect((s) => s(STORE_KEY).getState(), []);
    const { closeModal, setStatus, setResult, resetResult } = useDispatch(STORE_KEY);

    const [selectedAction, setSelectedAction] = useState("__custom");
    const [instruction, setInstruction] = useState("");
    const [option, setOption] = useState(TONE_OPTIONS[0].value);
    const [prevOption, setPrevOption] = useState("");
    const [selectedInstructionIds, setSelectedInstructionIds] = useState([]);

    const instructionChoices = useMemo(() => {
        const list = getConfig().instructions;
        return Array.isArray(list) ? list : [];
    }, []);

    // Actions come from settings (Edit AI Personalize) via the localized config;
    // fall back to the built-in presets if none were provided.
    const presets = useMemo(() => {
        const list = getConfig().actions;
        return Array.isArray(list) && list.length ? list : FALLBACK_PRESETS;
    }, []);

    const activePreset = useMemo(
        () => presets.find((p) => p.id === selectedAction),
        [presets, selectedAction]
    );

    const onSelectPreset = useCallback((preset) => {
        setSelectedAction(preset.id);
        let nextOption = "";
        if (preset.needsOption === "tone") {
            nextOption = TONE_OPTIONS[0].value;
        } else if (preset.needsOption === "language") {
            nextOption = LANGUAGE_OPTIONS[0].value;
        }
        if (preset.needsOption) {
            setOption(nextOption);
        }
        setInstruction(resolvePrompt(preset, nextOption));
        setPrevOption(preset.needsOption ? nextOption : "");
    }, []);

    const onSelectCustom = useCallback(() => {
        setSelectedAction("__custom");
        setInstruction("");
        setPrevOption("");
    }, []);

    const onOptionChange = useCallback(
        (nextOption) => {
            setOption(nextOption);
            if (prevOption && nextOption !== prevOption) {
                setInstruction((current) =>
                    current ? current.split(prevOption).join(nextOption) : current
                );
            }
            setPrevOption(nextOption);
        },
        [prevOption]
    );

    const onGenerate = useCallback(async () => {
        const config = getConfig();
        if (!config.rest_url) {
            setStatus("error", __("AI Edit is not properly initialized.", "betterdocs"));
            return;
        }

        const body = {
            post_id: config.post_id,
            action: selectedAction === "__custom" ? "custom" : selectedAction,
            selection: state.selectionHtml || state.selectionText || "",
            selection_type: state.selectionType || "block",
            instruction: instruction,
            option: "",
            instruction_ids: selectedInstructionIds,
        };

        setStatus("loading");

        try {
            const response = await apiFetch({
                url: config.rest_url,
                method: "POST",
                headers: { "X-WP-Nonce": config.rest_nonce },
                data: body,
            });

            if (response && response.success && response.data && response.data.content) {
                setResult(response.data.content);
            } else if (response && response.message) {
                setStatus("error", normalizeAIError(response));
            } else {
                setStatus("error", __("Unexpected response from the server.", "betterdocs"));
            }
        } catch (e) {
            const message = normalizeAIError(
                e,
                __("Failed to reach the AI service. Please try again.", "betterdocs")
            );
            setStatus("error", message);
        }
    }, [state, selectedAction, activePreset, instruction, option, selectedInstructionIds, setStatus, setResult]);

    const onReplace = useCallback(() => {
        if (!state.result) return;
        if (state.selectionType === "inline") {
            applyInlineReplace(state.blockClientId, state.inlineContext, state.result);
        } else {
            applyBlockReplace(state.blockClientId, state.result);
        }
        closeModal();
    }, [state, closeModal]);

    const onInsertAfter = useCallback(() => {
        if (!state.result) return;
        applyInsertAfter(state.blockClientId, state.result);
        closeModal();
    }, [state, closeModal]);

    const onDiscard = useCallback(() => {
        resetResult();
    }, [resetResult]);

    // Reset instruction selection each time the modal opens.
    useEffect(() => {
        if (state.isOpen) {
            setSelectedInstructionIds([]);
        }
    }, [state.isOpen]);

    useEffect(() => {
        if (!state.isOpen || !state.blockClientId) {
            return;
        }

        const HIGHLIGHT_CLASS = "betterdocs-ai-edit-highlight";
        const STYLE_ID = "betterdocs-ai-edit-highlight-style";
        const STYLE_CSS = `
            .${HIGHLIGHT_CLASS} {
                outline: 2px solid #00B884 !important;
                outline-offset: 2px;
                border-radius: 2px;
                box-shadow: 0 0 0 4px rgba(0, 184, 132, 0.15);
                transition: outline 0.15s ease-out, box-shadow 0.15s ease-out;
            }
        `;
        const selector = `[data-block="${state.blockClientId}"]`;
        const targets = [];
        const docs = new Set();

        const collectFromDoc = (doc) => {
            try {
                doc.querySelectorAll(selector).forEach((el) => {
                    el.classList.add(HIGHLIGHT_CLASS);
                    targets.push(el);
                    if (el.ownerDocument) {
                        docs.add(el.ownerDocument);
                    }
                });
            } catch (e) { }
        };

        collectFromDoc(document);
        document.querySelectorAll('iframe[name="editor-canvas"]').forEach((iframe) => {
            try {
                if (iframe.contentDocument) {
                    collectFromDoc(iframe.contentDocument);
                }
            } catch (e) { }
        });

        docs.forEach((doc) => {
            if (!doc.getElementById(STYLE_ID) && doc.head) {
                const style = doc.createElement("style");
                style.id = STYLE_ID;
                style.textContent = STYLE_CSS;
                doc.head.appendChild(style);
            }
        });

        return () => {
            targets.forEach((el) => el.classList.remove(HIGHLIGHT_CLASS));
        };
    }, [state.isOpen, state.blockClientId]);

    if (!state.isOpen) {
        return null;
    }

    const optionsForActive =
        activePreset && activePreset.needsOption === "tone"
            ? TONE_OPTIONS
            : activePreset && activePreset.needsOption === "language"
                ? LANGUAGE_OPTIONS
                : null;

    const optionLabel =
        activePreset && activePreset.needsOption === "tone"
            ? __("Tone", "betterdocs")
            : activePreset && activePreset.needsOption === "language"
                ? __("Language", "betterdocs")
                : "";

    const isStructural = !!(activePreset && activePreset.structural);
    const canReplaceInline = !(isStructural && state.selectionType === "inline");

    const selectionPreview = state.selectionText || __("(No text)", "betterdocs");
    const truncated = selectionPreview.length > 300
        ? selectionPreview.slice(0, 300) + "…"
        : selectionPreview;

    const isLoading = state.status === "loading";
    const hasResult = state.status === "done" && state.result;

    const selectedActionLabel = selectedAction === "__custom"
        ? __("Custom Prompt", "betterdocs")
        : (activePreset ? activePreset.label : "");

    return (
        <Modal open={state.isOpen} onClose={closeModal} width={600} labelledBy="bd-ai-edit-title">
            {/* Header */}
            <div style={{ padding: "22px 26px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                    <span style={{
                        width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "var(--green)", boxShadow: "0 2px 6px rgba(0,184,132,.35)",
                    }}>
                        <AIMarkWhite size={22} />
                    </span>
                    <div style={{ paddingRight: 30 }}>
                        <div id="bd-ai-edit-title" style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)", letterSpacing: -0.3 }}>
                            {__("Edit with BetterDocs AI", "betterdocs")}
                        </div>
                        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                            {__("Refine your selected content", "betterdocs")}
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: "18px 26px 24px", overflowY: "auto" }}>
                {!hasResult && (
                    <>
                        {/* Selected content — a quoted excerpt, not an input: an
                            ash-filled callout with a leading quote glyph so it
                            clearly reads as "the text you selected". */}
                        <Eyebrow style={{ marginBottom: 8 }}>{__("Selected content", "betterdocs")}</Eyebrow>
                        <div style={{
                            display: "flex", gap: 11, alignItems: "flex-start",
                            background: "var(--text-color-50, #f9fafb)",
                            border: "1px solid var(--text-color-200, #eaecf0)",
                            borderRadius: 10, padding: "13px 15px", marginBottom: 20,
                        }}>
                            <span style={{ flexShrink: 0, marginTop: 1, color: "var(--muted-2)", display: "flex" }}>
                                <IcQuote size={16} />
                            </span>
                            <div style={{
                                flex: 1, minWidth: 0,
                                fontSize: 13, lineHeight: 1.6, color: "var(--ink-2)",
                                maxHeight: 120, overflow: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word",
                            }}>
                                {truncated}
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                            <Eyebrow>{__("Choose an action", "betterdocs")}</Eyebrow>
                            {selectedActionLabel && (
                                <HeaderHint>
                                    {sprintf(/* translators: %s: selected action name. */ __("Selected: %s", "betterdocs"), selectedActionLabel)}
                                </HeaderHint>
                            )}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                            {presets.map((preset) => (
                                <ActionCard key={preset.id} active={selectedAction === preset.id}
                                    disabled={isLoading} onClick={() => onSelectPreset(preset)}
                                    icon={iconFor(preset.id)}>
                                    {preset.label}
                                </ActionCard>
                            ))}
                        </div>

                        {/* Custom instruction — full-width card */}
                        <ActionCard active={selectedAction === "__custom"} disabled={isLoading}
                            onClick={onSelectCustom} icon={<IcPlus size={16} sw={2} />} style={{ marginTop: 10 }}>
                            <span style={{ flex: 1 }}>{__("Custom Prompt", "betterdocs")}</span>
                            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>
                                {__("Tell AI exactly what you want", "betterdocs")}
                            </span>
                        </ActionCard>

                        {optionsForActive && (
                            <div style={{ marginTop: 18 }}>
                                <Eyebrow style={{ marginBottom: 8 }}>{optionLabel}</Eyebrow>
                                <Pick value={option} onChange={onOptionChange} disabled={isLoading}
                                    options={optionsForActive} style={{ width: "100%" }} />
                            </div>
                        )}

                        <Eyebrow style={{ marginTop: 20, marginBottom: 8 }}>{__("Prompt", "betterdocs")}</Eyebrow>
                        <TextArea value={instruction} onChange={setInstruction} rows={5} disabled={isLoading}
                            placeholder={__("Describe exactly what you want the AI to do.", "betterdocs")} />
                        <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>
                            {selectedAction === "__custom"
                                ? __("Describe exactly what you want the AI to do.", "betterdocs")
                                : __("Review and edit the prompt before generating.", "betterdocs")}
                        </div>

                        {instructionChoices.length > 0 && (
                            <InstructionPicker
                                instructions={instructionChoices}
                                selected={selectedInstructionIds}
                                onChange={setSelectedInstructionIds}
                                disabled={isLoading}
                                style={{ marginTop: 20 }}
                            />
                        )}

                        {state.status === "error" && state.error && (
                            <Banner tone="error" style={{ marginTop: 18 }}>{state.error}</Banner>
                        )}

                        {/* footer */}
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10,
                            marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--border-soft)",
                        }}>
                            <TextBtn onClick={closeModal}>{__("Close", "betterdocs")}</TextBtn>
                            <PrimaryBtn icon={isLoading ? <Spinner size={15} color="#fff" /> : <AIMarkWhite size={16} />}
                                onClick={onGenerate} disabled={isLoading || !instruction.trim()}>
                                {isLoading ? __("Generating…", "betterdocs") : __("Generate", "betterdocs")}
                            </PrimaryBtn>
                        </div>
                    </>
                )}

                {hasResult && (
                    <PreviewAccept
                        mode="replace"
                        status="ready"
                        suggestion={state.result}
                        actions={
                            <>
                                <TextBtn onClick={onDiscard} style={{ marginRight: "auto" }}>
                                    {__("Discard & Retry", "betterdocs")}
                                </TextBtn>
                                <GhostBtn icon={<IcArrowR size={15} />} onClick={onInsertAfter}>
                                    {__("Insert After", "betterdocs")}
                                </GhostBtn>
                                {canReplaceInline && (
                                    <PrimaryBtn icon={<IcCheck size={16} sw={2.4} />} onClick={onReplace}>
                                        {__("Replace Selection", "betterdocs")}
                                    </PrimaryBtn>
                                )}
                            </>
                        }
                    />
                )}
            </div>
        </Modal>
    );
};

export default AIEditModal;
