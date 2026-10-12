import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import { applyFilters, addAction, removeAction } from "@wordpress/hooks";
import { slugify } from "../utils/treeUtils";
import TranslationsPanel from "./TranslationsPanel";
import SlideoverSelect from "./SlideoverSelect";

const ICON_META_KEY = "doc_category_image-id";

// WordPress stores term name & slug in varchar(200) columns; cap input at the
// same length so a save can never fail with the cryptic "could not insert term"
// database error.
const MAX_TERM_LENGTH = 200;

const SlideOverForm = ({ isOpen, onClose, onSave, editNode, defaultParent, allTerms, isSaving, createMeta, onAddTranslation }) => {
    const [name, setName]               = useState("");
    const [slug, setSlug]               = useState("");
    const [parentId, setParentId]       = useState(0);
    const [order, setOrder]             = useState("");
    const [description, setDescription] = useState("");
    const [slugEdited, setSlugEdited]   = useState(false);
    const [iconId, setIconId]           = useState("");
    const [iconUrl, setIconUrl]         = useState("");
    const [lang, setLang]               = useState("");
    const [translationOf, setTranslationOf] = useState(null);
    const [error, setError]             = useState("");
    // Bucket that Pro-injected fields write into: { meta: {...}, fields: {...} }.
    const [extraData, setExtraData]     = useState({ meta: {}, fields: {} });

    const isMultilingual = !!(window.betterdocs_admin?.is_multilingual);
    const defaultLang    = window.betterdocs_admin?.current_admin_language || "";

    // The Pro "Knowledge Base / Cover Image" fields are injected into this
    // slide-over through the `betterdocs_doc_category_slideover_fields` filter,
    // which is registered by a SEPARATE Pro bundle (doc-category-fields.js) that
    // loads independently of this one. applyFilters() is not reactive, so when
    // that bundle registers its callback AFTER this form first renders, the Pro
    // fields silently never appear (the cause of the "sometimes the Knowledge
    // Base option shows, sometimes it doesn't" bug). Both bundles share the
    // global wp.hooks registry, so listen for the registry's `hookAdded` action
    // and force a re-render when our filter is (re)registered — then applyFilters
    // picks it up regardless of script load order.
    const [, forceFilterRerender] = useState(0);
    useEffect(() => {
        const namespace = "betterdocs/doc-category-slideover-fields-rerender";
        addAction("hookAdded", namespace, (hookName) => {
            if (hookName === "betterdocs_doc_category_slideover_fields") {
                forceFilterRerender((n) => n + 1);
            }
        });
        return () => removeAction("hookAdded", namespace);
    }, []);

    useEffect(() => {
        setError("");
        if (editNode) {
            setName(editNode.name || "");
            setSlug(editNode.slug || "");
            setParentId(editNode.parent || 0);
            setOrder(editNode.doc_category_order ?? "");
            setDescription(editNode.description || "");
            setSlugEdited(true);
            setIconId(editNode.meta?.[ICON_META_KEY] || "");
            setIconUrl(editNode.thumbnail || "");
            setLang(editNode.lang || defaultLang);
            setTranslationOf(null); // panel seeds it from the server for edits
        } else {
            setName(""); setSlug(""); setParentId(defaultParent?.id || 0);
            setOrder("");
            setDescription(""); setSlugEdited(false); setIconId(""); setIconUrl("");
            setLang(createMeta?.lang || defaultLang);
            setTranslationOf(createMeta?.translationOf || null);
        }
        setExtraData({ meta: {}, fields: {} });
    }, [editNode, isOpen]);

    const handleNameChange = (e) => {
        const val = e.target.value;
        setName(val);
        if (error) setError("");
        if (!slugEdited) setSlug(slugify(val));
    };

    const openMediaFrame = () => {
        if (!window.wp || !window.wp.media) return;
        const frame = window.wp.media({
            title: __("Select Category Icon", "betterdocs"),
            button: { text: __("Use this image", "betterdocs") },
            library: { type: "image" },
            multiple: false,
        });
        frame.on("select", () => {
            const att = frame.state().get("selection").first().toJSON();
            setIconId(String(att.id));
            setIconUrl(att.sizes?.thumbnail?.url || att.url);
        });
        frame.open();
    };

    const removeIcon = () => { setIconId(""); setIconUrl(""); };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const finalSlug   = slug.trim() || slugify(trimmedName);

        if (!trimmedName) {
            setError(__("Category name cannot be empty or contain only spaces.", "betterdocs"));
            return;
        }
        if (trimmedName.length > MAX_TERM_LENGTH || finalSlug.length > MAX_TERM_LENGTH) {
            setError(__("Could not add category. The name or slug you entered is too long.", "betterdocs"));
            return;
        }

        setError("");
        onSave({
            name:        trimmedName,
            slug:        finalSlug,
            parent:      Number(parentId),
            // Writable REST field — null leaves the existing/drag-assigned order
            // untouched. Coerce to an integer; the field's schema rejects floats,
            // which would otherwise fail the whole save.
            doc_category_order: order === "" ? null : Math.trunc(Number(order)) || 0,
            description,
            ...(isMultilingual && lang ? { lang, translationOf: translationOf || 0 } : {}),
            meta:        { [ICON_META_KEY]: iconId, ...(extraData.meta || {}) },
            ...(extraData.fields || {}),
        });
    };

    // Build a flat option list from the term tree for the parent selector.
    const parentOptions = buildFlatOptions(allTerms, editNode?.id);

    return (
        <>
            {isOpen && <div className="bd-dc-overlay" onClick={onClose} />}
            <div className={`bd-dc-slideover ${isOpen ? "bd-dc-slideover--open" : ""}`}>
                <div className="bd-dc-slideover-header">
                    <h2 className="bd-dc-slideover-title">
                        {editNode
                            ? __("Edit Category", "betterdocs")
                            : __("Add New Category", "betterdocs")}
                    </h2>
                    <button
                        type="button"
                        className="bd-dc-slideover-close"
                        onClick={onClose}
                        aria-label={__("Close", "betterdocs")}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                <form className="bd-dc-slideover-form" onSubmit={handleSubmit}>
                    <div className="bd-dc-slideover-body">
                    {error && <div className="bd-dc-form-error" role="alert">{error}</div>}
                    <div className="bd-dc-field">
                        <label className="bd-dc-label">
                            {__("Name", "betterdocs")}
                            <span className="bd-dc-required">*</span>
                        </label>
                        <input
                            type="text"
                            className="bd-dc-input"
                            value={name}
                            onChange={handleNameChange}
                            placeholder={__("Category name", "betterdocs")}
                            maxLength={MAX_TERM_LENGTH}
                            autoFocus={isOpen && !editNode}
                        />
                    </div>

                    <div className="bd-dc-field">
                        <label className="bd-dc-label">{__("Slug", "betterdocs")}</label>
                        <input
                            type="text"
                            className="bd-dc-input"
                            value={slug}
                            onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); if (error) setError(""); }}
                            placeholder={__("auto-generated", "betterdocs")}
                            maxLength={MAX_TERM_LENGTH}
                        />
                    </div>

                    <div className="bd-dc-field">
                        <label className="bd-dc-label">{__("Order", "betterdocs")}</label>
                        <input
                            type="number"
                            className="bd-dc-input"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            placeholder={__("Display order (e.g. 1, 2, 3)", "betterdocs")}
                            min="0"
                            step="1"
                        />
                    </div>

                    <div className="bd-dc-field">
                        <label className="bd-dc-label">{__("Parent Category", "betterdocs")}</label>
                        <SlideoverSelect
                            value={parentId}
                            onChange={(v) => setParentId(v)}
                            options={[
                                { value: 0, label: __("— None —", "betterdocs") },
                                ...parentOptions.map((opt) => ({
                                    value: opt.id,
                                    label: opt.label,
                                })),
                            ]}
                        />
                    </div>

                    {editNode && (
                        <div className="bd-dc-field">
                            <label className="bd-dc-label">{__("Category ID", "betterdocs")}</label>
                            <input
                                type="text"
                                className="bd-dc-input"
                                value={editNode.id}
                                readOnly
                                disabled
                            />
                        </div>
                    )}

                    <div className="bd-dc-field">
                        <label className="bd-dc-label">{__("Icon", "betterdocs")}</label>
                        <div className="bd-dc-icon-field">
                            <div className="bd-dc-icon-preview">
                                {iconUrl
                                    ? <img src={iconUrl} alt="" />
                                    : <span className="bd-dc-icon-placeholder" aria-hidden="true">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                                      </span>}
                            </div>
                            <div className="bd-dc-icon-buttons">
                                <button type="button" className="bd-dc-btn bd-dc-btn-ghost" onClick={openMediaFrame}>
                                    {iconUrl ? __("Change Image", "betterdocs") : __("Add Image", "betterdocs")}
                                </button>
                                {iconUrl && (
                                    <button type="button" className="bd-dc-btn bd-dc-btn-ghost bd-dc-icon-remove" onClick={removeIcon}>
                                        {__("Remove", "betterdocs")}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bd-dc-field">
                        <label className="bd-dc-label">{__("Description", "betterdocs")}</label>
                        <textarea
                            className="bd-dc-input bd-dc-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder={__("Brief description (optional)", "betterdocs")}
                        />
                    </div>

                    {/* Extension slot for Pro fields (Knowledge Base assignment, Handbook cover image). */}
                    {applyFilters("betterdocs_doc_category_slideover_fields", null, {
                        editNode,
                        isOpen,
                        extraData,
                        setExtraData,
                    })}

                    {/* Language / translation panel (WPML/Polylang) — last, after Description. */}
                    {isMultilingual && (
                        <TranslationsPanel
                            taxonomy="doc_category"
                            editNode={editNode}
                            lang={lang}
                            setLang={setLang}
                            translationOf={translationOf}
                            setTranslationOf={setTranslationOf}
                            onAddTranslation={onAddTranslation}
                        />
                    )}

                    </div>
                    <div className="bd-dc-slideover-footer">
                        <button type="button" className="bd-dc-btn bd-dc-btn-ghost" onClick={onClose}>
                            {__("Cancel", "betterdocs")}
                        </button>
                        <button
                            type="submit"
                            className="bd-dc-btn bd-dc-btn-primary"
                            disabled={isSaving}
                        >
                            {isSaving
                                ? __("Saving…", "betterdocs")
                                : editNode
                                    ? __("Update Category", "betterdocs")
                                    : __("Add Category", "betterdocs")}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

function buildFlatOptions(terms, excludeId, depth = 0, prefix = "") {
    const options = [];
    (terms || []).forEach((t) => {
        // Skip the term being edited (and its whole subtree) — a category can't
        // be its own parent or a child of one of its descendants. Excluding it
        // (rather than rendering a disabled option) keeps every listed option
        // selectable.
        if (t.id === excludeId) return;
        options.push({
            id:    t.id,
            label: prefix + t.name,
        });
        if (t.children?.length) {
            options.push(
                ...buildFlatOptions(t.children, excludeId, depth + 1, prefix + "    "),
            );
        }
    });
    return options;
}

export default SlideOverForm;
