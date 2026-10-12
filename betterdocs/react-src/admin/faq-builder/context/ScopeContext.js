import React, { createContext, useContext } from "react";

export const GENERAL_TAXONOMY = "betterdocs_faq_category";
export const PRODUCT_TAXONOMY = "betterdocs_product_faq_category";

// Default scope is the General FAQ taxonomy, so every existing FAQ Builder
// component keeps its current behavior even when rendered outside a provider.
const FAQScopeContext = createContext({
    taxonomy: GENERAL_TAXONOMY,
    isProduct: false,
});

export const FAQScopeProvider = ({ taxonomy = GENERAL_TAXONOMY, children }) => {
    const value = {
        taxonomy,
        isProduct: taxonomy === PRODUCT_TAXONOMY,
    };
    return (
        <FAQScopeContext.Provider value={value}>
            {children}
        </FAQScopeContext.Provider>
    );
};

export const useFAQScope = () => useContext(FAQScopeContext);
