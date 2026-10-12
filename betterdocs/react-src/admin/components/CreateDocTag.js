import React from "react";
import { __ } from "@wordpress/i18n";
import { IconPlus } from "~betterdocs/icons";
import { useDocTags } from "./DocTagsContext";

export default function CreateDocTag() {
    const ctx = useDocTags();
    if (!ctx) return null;

    return (
        <button
            type="button"
            className="admin-action-button"
            onClick={() => ctx.openCreate()}
        >
            <span className="action-button-icon">
                <IconPlus />
            </span>
            <span className="action-button-icon-text">
                {__("Add New Tag", "betterdocs")}
            </span>
        </button>
    );
}
