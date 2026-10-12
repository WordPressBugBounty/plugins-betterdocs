import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import { slugify } from "../utils/treeUtils";

const QuickEditPanel = ({ node, onSave, onCancel, isSaving }) => {
    const [name, setName] = useState(node.name);
    const [slug, setSlug] = useState(node.slug);
    const [description, setDescription] = useState(node.description || "");
    const [slugEdited, setSlugEdited] = useState(false);

    useEffect(() => {
        setName(node.name);
        setSlug(node.slug);
        setDescription(node.description || "");
        setSlugEdited(false);
    }, [node.id]);

    const handleNameChange = (e) => {
        const val = e.target.value;
        setName(val);
        if (!slugEdited) setSlug(slugify(val));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave({ name: name.trim(), slug: slug.trim() || slugify(name.trim()), description });
    };

    return (
        <form className="bd-dc-quick-edit" onSubmit={handleSubmit}>
            <div className="bd-dc-quick-edit-grid">
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
                        required
                        autoFocus
                    />
                </div>
                <div className="bd-dc-field">
                    <label className="bd-dc-label">{__("Slug", "betterdocs")}</label>
                    <input
                        type="text"
                        className="bd-dc-input"
                        value={slug}
                        onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
                    />
                </div>
                <div className="bd-dc-field bd-dc-field-full">
                    <label className="bd-dc-label">{__("Description", "betterdocs")}</label>
                    <textarea
                        className="bd-dc-input bd-dc-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                    />
                </div>
            </div>
            <div className="bd-dc-quick-edit-actions">
                <button type="submit" className="bd-dc-btn bd-dc-btn-primary" disabled={isSaving}>
                    {isSaving ? __("Saving…", "betterdocs") : __("Update", "betterdocs")}
                </button>
                <button type="button" className="bd-dc-btn bd-dc-btn-ghost" onClick={onCancel}>
                    {__("Cancel", "betterdocs")}
                </button>
            </div>
        </form>
    );
};

export default QuickEditPanel;
