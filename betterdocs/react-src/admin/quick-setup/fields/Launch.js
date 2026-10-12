import { Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useBuilderContext } from "quickbuilder";
import React, { useCallback, useState } from "react";
import { apiFetch } from "../../utils";
import toastAlert from "../../utils/toastAlert";
import { getLayoutPicks, hasLayoutPicks } from "./layoutStore";

const Launch = (props) => {
    const [isSubmit, setIsSubmit] = useState(false);
    const context = useBuilderContext();

    const handleSubmit = useCallback(
        (event) => {
            if (context?.isSubmitting) {
                return;
            }

            context.setSubmitting(true);

            if(context?.values?.enable_sample_data) {
                apiFetch.post("create-sample-docs", {action:'create-dummy-data'});
            }

            // Persist the chosen Customize-step layouts as theme_mods (only if the
            // user visited that step), alongside the rest of the wizard's save.
            if (hasLayoutPicks()) {
                apiFetch.post("customize/layouts", { layouts: getLayoutPicks() });
            }

            // Dark mode is a client cookie (utils/darkMode), never a saved setting —
            // do NOT persist it here, or it would write `betterdocs_settings` and the
            // theme would diverge from the cookie the other screens read.
            apiFetch
                .post("settings", { ...context.values })
                .then((res) => {
                    if (res?.success) {
                        document.cookie = "betterdocs_insights_allowed=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=/;";
                        // Setup complete — clear the persisted sample-docs preview.
                        try { localStorage.removeItem("betterdocs_setup_generated_docs"); } catch (e) {}
                        toastAlert(
                            "success",
                            __('Changes Saved Successfully.', "betterdocs")
                        ).then(() => {
                            const url = new URL(window.location.href);
                            url.search = "";
                            url.searchParams.set("page", "betterdocs-admin");
                            window.location.replace(url.href);
                        });
                    } else {
                        toastAlert(
                            res?.code === "nothing_changed" ? "info" : "error",
                            __(
                                res?.message ?? 'Something went wrong.',
                                "betterdocs"
                            )
                        );
                    }
                })
                .catch((err) => {
                    toastAlert(
                        "error",
                        __('Something went wrong.', "betterdocs")
                    );
                })
                .finally(() => {
                    context.setSubmitting(false);
                    if (context?.config?.save_locally) {
                        localStorage.removeItem("quickbuilder_active_tab");
                    }
                });
        },
        [context.values]
    );

    return (
        <>
            <Button
                disabled={isSubmit}
                className="wprf-btn wprf-step-btn-publish"
                onClick={handleSubmit}
            >
                {isSubmit && __("Finishing...", "betterdocs")}
                {!isSubmit && __("Finish", "betterdocs")}
            </Button>
        </>
    );
};

export default Launch;
