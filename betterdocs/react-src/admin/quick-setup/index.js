import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { addFilter } from "@wordpress/hooks";
import React from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import QuickBuildWrapper from "./quickbuilder/QuickBuildWrapper";
import QuickSetupHeader from "./QuickSetupHeader";

import Field from "./fields/Field";

addFilter("custom_field", "BetterDocs", Field);

const BetterDocsQuickSetupApp = () => {
    return (
        <>
            <QuickSetupHeader />
            <div className="betterdocs-settings-wrapper">
                <QuickBuildWrapper />
            </div>
        </>
    );
};

const queryClient = new QueryClient();

// style
import "../scss/setup-wizard.scss";

const quickSetupContainer = document.getElementById("betterdocsQuickSetupBuilder");
if (quickSetupContainer) {
    createRoot(quickSetupContainer).render(
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
            <BetterDocsQuickSetupApp />
        </QueryClientProvider>
    );
}
