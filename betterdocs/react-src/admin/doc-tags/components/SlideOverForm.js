import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import { slugify } from "../utils/slugify";
import TranslationsPanel from "../../doc-categories/components/TranslationsPanel";

// WordPress stores term name & slug in varchar(200) columns; cap input at the
// same length so a save can never fail with the cryptic "could not insert term"
// database error.
const MAX_TERM_LENGTH = 200;

const SlideOverForm = ({ isOpen, onClose, onSave, editTag, isSaving, createMeta, onAddTranslation }) => {
    const [name, setName]               = useState("");
    const [slug, setSlug]               = useState("");
    const [description, setDescription] = useState("");
    const [slugEdited, setSlugEdited]   = useState(false);
    const [lang, setLang]               = useState("");
    const [translationOf, setTranslationOf] = useState(null);
    const [error, setError]             = useState("");

    const isMultilingual = !!(window.betterdocs_admin?.is_multilingual);
    const defaultLang    = window.betterdocs_admin?.current_admin_language || "";

    useEffect(() => {
        setError("");
        if (editTag) {
            setName(editTag.name || "");
            setSlug(editTag.slug || "");
            setDescription(editTag.description || "");
            setSlugEdited(true);
            setLang(editTag.lang || defaultLang);
            setTranslationOf(null);
        } else {
            setName(""); setSlug(""); setDescription(""); setSlugEdited(false);
            setLang(createMeta?.lang || defaultLang);
            setTranslationOf(createMeta?.translationOf || null);
        }
    }, [editTag, isOpen]);

    const handleNameChange = (e) => {
        const val = e.target.value;
        setName(val);
        if (error) setError("");
        if (!slugEdited) setSlug(slugify(val));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const finalSlug   = slug.trim() || slugify(trimmedName);

        if (!trimmedName) {
            setError(__("Tag name cannot be empty or contain only spaces.", "betterdocs"));
            return;
        }
        if (trimmedName.length > MAX_TERM_LENGTH || finalSlug.length > MAX_TERM_LENGTH) {
            setError(__("Could not add tag. The name or slug you entered is too long.", "betterdocs"));
            return;
        }

        setError("");
        onSave({
            name:        trimmedName,
            slug:        finalSlug,
            description,
            ...(isMultilingual && lang ? { lang, translationOf: translationOf || 0 } : {}),
        });
    };

    return (
        <>
            {isOpen && <div className="bd-dc-overlay" onClick={onClose} />}
            <div className={`bd-dc-slideover ${isOpen ? "bd-dc-slideover--open" : ""}`}>
                <div className="bd-dc-slideover-header">
                    <h2 className="bd-dc-slideover-title">
                        {editTag ? __("Edit Tag", "betterdocs") : __("Add New Tag", "betterdocs")}
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
                            placeholder={__("Tag name", "betterdocs")}
                            maxLength={MAX_TERM_LENGTH}
                            autoFocus={isOpen && !editTag}
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
                        <label className="bd-dc-label">{__("Description", "betterdocs")}</label>
                        <textarea
                            className="bd-dc-input bd-dc-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder={__("Brief description (optional)", "betterdocs")}
                        />
                    </div>

                    {/* Language / translation panel (WPML/Polylang) — last, after Description. */}
                    {isMultilingual && (
                        <TranslationsPanel
                            taxonomy="doc_tag"
                            editNode={editTag}
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
                                : editTag
                                    ? __("Update Tag", "betterdocs")
                                    : __("Add Tag", "betterdocs")}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default SlideOverForm;
