import React from "react";
import { __ } from "@wordpress/i18n";
import { IconPlus } from "~betterdocs/icons";
import { useDocCategories } from "./DocCategoriesContext";

export default function CreateDocCategory() {
    const ctx = useDocCategories();
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
                {__("Add New Category", "betterdocs")}
            </span>
        </button>
    );
}
