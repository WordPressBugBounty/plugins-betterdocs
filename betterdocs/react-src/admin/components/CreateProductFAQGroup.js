import React, { useState } from "react";
import { __ } from "@wordpress/i18n";
import { useSearchParams } from "react-router-dom";
import CategoryModal from "../faq-builder/components/CategoryModal";
import { FAQScopeProvider, PRODUCT_TAXONOMY } from "../faq-builder/context/ScopeContext";
import { PRODUCT_FAQ_REFRESH_EVENT } from "../faq-builder/woocommerce/ProductFaqGroups";
import { IconPlus } from "~betterdocs/icons";

export default function CreateProductFAQGroup() {
    const [searchParams] = useSearchParams();
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [updateCategory, setUpdateCategory] = useState(null);

    // This creates a Product FAQ Group; only show it on the WooCommerce tab's
    // "Product FAQ Groups" sub-tab.
    const faqTab = searchParams.get("faq_tab") || "builder";
    const subtab = searchParams.get("faq_subtab") || "groups";
    if (faqTab !== "woocommerce" || subtab !== "groups") {
        return null;
    }

    // The product list lives in a nested FAQ provider (and a QueryClientProvider)
    // we can't reach from the header, so refresh it via a window event the
    // product list listens for.
    const reFetchCategories = () =>
        window.dispatchEvent(new CustomEvent(PRODUCT_FAQ_REFRESH_EVENT));

    return (
        <FAQScopeProvider taxonomy={PRODUCT_TAXONOMY}>
            <button
                type="button"
                className="admin-action-button"
                onClick={() => setShowCategoryModal(true)}
            >
                <span className="action-button-icon">
                    <IconPlus />
                </span>
                <span className="action-button-icon-text">
                    {__("Create a New Product FAQ Group", "betterdocs")}
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
        </FAQScopeProvider>
    );
}
