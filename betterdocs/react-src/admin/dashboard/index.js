import React, { useState } from "react";
import AllDocsGrid from "./components/AllDocsGrid.js";
import AllDocsList from "./components/AllDocsList.js";

import { useSearchParams } from "react-router-dom";
import { DashboardContextProvider } from "./DashboardContext.js";

import { ToastContainer } from "react-toastify";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Dashboard = () => {
    const [searchParams] = useSearchParams();

    const [dashboardData, setDashboardData] = useState({
        isOpen: false,
        isListMenuOpen: false,
        quickAction: {},
    });

    let dashboardProps = {};

    if (searchParams.has("kb") && searchParams.get("kb") !== "") {
        dashboardProps.kb = searchParams.get("kb");
    }

    if( searchParams.has('post_status') && searchParams.get('post_status') != '' ){
        dashboardProps.post_status = searchParams.get('post_status');
    }

    if( betterdocs_admin?.dashboard_mode != undefined && betterdocs_admin?.dashboard_mode != '' && !searchParams.has("mode") ) {
        searchParams.set('mode', betterdocs_admin?.dashboard_mode);
    }

    if (!searchParams.has("mode") || searchParams.get("mode") === "grid") {
        const queryClientGrid = new QueryClient();
        return <>
                    <QueryClientProvider client={queryClientGrid}>
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
                        <AllDocsGrid {...dashboardProps} />
                    </QueryClientProvider>
                </>;
    }
    const queryClientList = new QueryClient();
    return (
        <QueryClientProvider client={queryClientList}>
            <DashboardContextProvider
                value={{
                    data: dashboardData,
                    setData: setDashboardData,
                }}
            >
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
                <AllDocsList {...dashboardProps} />
            </DashboardContextProvider>
        </QueryClientProvider>
    );
};

export default Dashboard;
