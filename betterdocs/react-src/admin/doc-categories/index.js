import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import DocCategoriesRoot from "./components/DocCategoriesRoot";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

const DocCategories = () => (
    <div className="betterdocs-dashboard-body betterdocs-dashboard-container bd-doc-categories-wrapper">
        <QueryClientProvider client={queryClient}>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
                limit={4}
            />
            <DocCategoriesRoot />
        </QueryClientProvider>
    </div>
);

export default DocCategories;
