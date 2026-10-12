import React, { useState } from 'react';
import { __ } from "@wordpress/i18n";
import { useSearchParams } from "react-router-dom";
import CategoryModal from '../faq-builder/components/CategoryModal';
import { IconPlus } from "~betterdocs/icons";
import { useFAQ } from "./FAQContext";

export default function CreateFAQGroup() {
    const context = useFAQ();
    const [searchParams] = useSearchParams();
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [updateCategory, setUpdateCategory] = useState(null);

    // This header action creates a General FAQ Group; only show it on the FAQ Builder sub-tab.
    if ((searchParams.get("faq_tab") || "builder") !== "builder") {
        return null;
    }

    // Check if context is undefined
    if (!context) {
        console.error("useFAQ context is undefined. Ensure FAQProvider is set up correctly.");
        return null; // or handle the error as needed
    }

    const { reFetchCategories } = context;

    return (
        <>
            <button
                type="button"
                className="admin-action-button"
                onClick={() => setShowCategoryModal(true)}
            >
                <span className="action-button-icon">
                    <IconPlus />
                </span>
                <span className="action-button-icon-text">
                    {__("Create a New FAQ Group", "betterdocs")}
                </span>
            </button>
            {showCategoryModal || updateCategory !== null ? (
                <CategoryModal
                    open={true}
                    reFetchCategories={reFetchCategories}
                    setShowCategoryModal={setShowCategoryModal}
                    updateCategory={updateCategory}
                    setUpdateCategory={setUpdateCategory}
                />
            ) : null}
        </>
    );
}
