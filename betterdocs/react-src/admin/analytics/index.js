import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import Dashboard from "./components/Dashboard";

const queryClient = new QueryClient();

const BetterDocsAnalytics = () => {
    return (
        <div className="betterdocs-admin-analytics-wrapper">
            <QueryClientProvider client={ queryClient }>
                <Dashboard />
            </QueryClientProvider>
        </div>
    );
};

export default BetterDocsAnalytics;
