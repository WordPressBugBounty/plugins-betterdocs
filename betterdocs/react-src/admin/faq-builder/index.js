import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Modal from "react-modal";
import { ToastContainer } from "react-toastify";
import { __ } from "@wordpress/i18n";
import BetterDocsFaqRoot from "./components/index";
import WooCommerceFaq from "./woocommerce";

const BetterDocsApp = () => {
    const [searchParams] = useSearchParams();
    const wcActive = Boolean(window.betterdocs_admin?.is_woocommerce_active);
    const faqTab = searchParams.get("faq_tab") || "builder";
    const showWoo = wcActive && faqTab === "woocommerce";

    return (
        <div className="betterdocs-dashboard-body betterdocs-faq-wrapper betterdocs-dashboard-container">
            {showWoo ? <WooCommerceFaq /> : <BetterDocsFaqRoot />}
        </div>
    );
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

const FaqBuilder = () => {
    useEffect(() => {
        Modal.setAppElement("#betterdocs-faq-builder-wrapper");
    }, []);

    return (
        <div
            id="betterdocs-faq-builder-wrapper"
            className="betterdocs-faq-builder-wrapper"
        >
            <QueryClientProvider client={queryClient}>
                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    closeOnClick={true}
                    pauseOnHover={true}
                    draggable={true}
                    progress={undefined}
                    theme="colored"
                    limit={4}
                />
                <BetterDocsApp />
            </QueryClientProvider>
        </div>
    );
};

export default FaqBuilder;
