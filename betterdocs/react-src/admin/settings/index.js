import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {addFilter, doAction} from "@wordpress/hooks";
import React from "react";
import {ToastContainer} from "react-toastify";

import {CustomizerLink, ElementorLink, GutenbergLink} from "./components";
import Field from "./fields/Field";
import QuickBuildWrapper from "./quickbuilder/QuickBuildWrapper";
import registerQuickBuilderFetchFix from "../utils/quickbuilderFetchFix";

// Must run before any QuickBuilder ajax button can be clicked: without a method
// those requests never leave the browser. See the util for the full story.
registerQuickBuilderFetchFix();

addFilter("betterdocs_settings_gutenberg_link", "BetterDocs", GutenbergLink);
addFilter("betterdocs_settings_elementor_link", "BetterDocs", ElementorLink);
addFilter("betterdocs_settings_customizer_link", "BetterDocs", CustomizerLink);
addFilter("custom_field", "BetterDocs", Field);


const BetterDocsSettingApp = () => {
    return (
        <div className="betterdocs-settings-wrapper">
            <QuickBuildWrapper/>
        </div>
    );
};

const queryClient = new QueryClient();

const Settings = () => {
    return (
        <div className="betterdocs-settings-wrap">
            {doAction("betterdocs_settings_header", "settings")}
            <div className="betterdocs-left-right-settings">
                {doAction("betterdocs_before_settings_left")}
                <div className="betterdocs-settings">
                    <div className="betterdocs-settings-content">
                        <div className="betterdocs-dashboard-container betterdocs-settings-form-wrapper">
                            <div id="betterdocsQuickBuilder">
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
                                    <BetterDocsSettingApp/>
                                </QueryClientProvider>
                            </div>
                        </div>
                    </div>
                    {doAction("betterdocs_settings_footer")}
                </div>
                {doAction("betterdocs_after_settings_left")}
            </div>
        </div>
    );
};

export default Settings;
