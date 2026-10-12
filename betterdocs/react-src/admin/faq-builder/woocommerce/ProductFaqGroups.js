import React, { useEffect } from "react";
import { FAQProvider, useFAQ } from "../../components/FAQContext";
import { FAQScopeProvider, PRODUCT_TAXONOMY } from "../context/ScopeContext";
import BetterDocsFaqRoot from "../components/index";

// Fired by the header "Create a New Product FAQ Group" button after a group is
// created; the header sits outside this nested provider, so a window event is
// how it asks the product list to refresh.
export const PRODUCT_FAQ_REFRESH_EVENT = "betterdocs:product-faq-refresh";

// Bridges the header's refresh event to the nested provider's refetch.
const ProductGroupsRefresher = () => {
    const { reFetchCategories } = useFAQ();

    useEffect(() => {
        const handler = () => reFetchCategories?.();
        window.addEventListener(PRODUCT_FAQ_REFRESH_EVENT, handler);
        return () =>
            window.removeEventListener(PRODUCT_FAQ_REFRESH_EVENT, handler);
    }, [reFetchCategories]);

    return null;
};

// A nested FAQProvider isolates the Product scope's category/stat state from the
// General tab's shared provider, so switching tabs never bleeds one list into
// the other. The "Create a New Product FAQ Group" button lives in the page
// header (see CreateProductFAQGroup), matching the General tab's layout.
const ProductFaqGroups = () => {
    return (
        <FAQProvider>
            <FAQScopeProvider taxonomy={PRODUCT_TAXONOMY}>
                <ProductGroupsRefresher />
                <BetterDocsFaqRoot />
            </FAQScopeProvider>
        </FAQProvider>
    );
};

export default ProductFaqGroups;
