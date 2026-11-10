import { __ } from "@wordpress/i18n";
import { useBuilderContext } from "quickbuilder";
import React, { useCallback, useRef } from "react";
import { apiFetch } from "../../utils";
import toastAlert from "../../utils/toastAlert";
import { getLayoutPicks, hasLayoutPicks } from "./layoutStore";

/**
 * Finalize step content: the in-content "Finish setup" call to action.
 *
 * Nothing in the wizard is persisted until this runs — it saves
 * `betterdocs_settings`, the chosen Customize layouts, and (optionally) the
 * sample docs, then redirects to the dashboard. This mirrors the legacy footer
 * Launch button so the primary action lives with the content, not at the bottom.
 */
const FinishPanel = (props) => {
    const context = useBuilderContext();
    const isSubmitting = context?.isSubmitting;
    // Guards against a second click landing before quickbuilder re-renders
    // with `isSubmitting` set.
    const finishingRef = useRef(false);

    const handleFinish = useCallback(() => {
        if (context?.isSubmitting || finishingRef.current) {
            return;
        }

        finishingRef.current = true;
        context.setSubmitting(true);

        const release = () => {
            finishingRef.current = false;
            context.setSubmitting(false);
        };

        // The side requests must finish before we navigate away: redirecting
        // while one is still in flight aborts it (apiFetch reports that as
        // `fetch_error`) and can cut the sample-docs import short.
        const sideRequests = [];

        if (context?.values?.enable_sample_data) {
            sideRequests.push(
                apiFetch.post("create-sample-docs", { action: "create-dummy-data" })
            );
        }

        // Persist the chosen Customize-step layouts as theme_mods (only if the
        // user visited that step), alongside the rest of the wizard's save.
        if (hasLayoutPicks()) {
            sideRequests.push(
                apiFetch.post("customize/layouts", { layouts: getLayoutPicks() })
            );
        }

        // Dark mode is a client cookie (utils/darkMode), never a saved setting —
        // do NOT persist it here, or the theme would diverge from that cookie.
        const saveSettings = apiFetch.post("settings", { ...context.values });

        Promise.all([saveSettings, ...sideRequests])
            .then(([res]) => {
                // Finishing without changing anything is still a finished setup.
                if (res?.success || res?.code === "nothing_changed") {
                    document.cookie =
                        "betterdocs_insights_allowed=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=/;";
                    // Setup complete — clear the persisted sample-docs preview.
                    try {
                        localStorage.removeItem("betterdocs_setup_generated_docs");
                        if (context?.config?.save_locally) {
                            localStorage.removeItem("quickbuilder_active_tab");
                        }
                    } catch (e) {}
                    // Stay in the "Finishing…" state until the page unloads so
                    // the button cannot be clicked again in the meantime.
                    toastAlert(
                        "success",
                        __("Changes Saved Successfully.", "betterdocs"),
                        { autoClose: 1500 }
                    ).then(() => {
                        const url = new URL(window.location.href);
                        url.search = "";
                        url.searchParams.set("page", "betterdocs-admin");
                        window.location.replace(url.href);
                    });
                    return;
                }

                toastAlert(
                    "error",
                    __(res?.message ?? "Something went wrong.", "betterdocs")
                );
                release();
            })
            .catch(() => {
                toastAlert("error", __("Something went wrong.", "betterdocs"));
                release();
            });
    }, [context]);

    return (
        <div className="betterdocs-finish">
            <div className="betterdocs-finish-icon">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
            </div>

            <h3 className="betterdocs-finish-title">
                {__("Save & apply your setup", "betterdocs")}
            </h3>
            <p className="betterdocs-finish-text">
                {__(
                    "Nothing is saved until you finish. Click below to store your settings, apply your configuration, and head to your BetterDocs dashboard.",
                    "betterdocs"
                )}
            </p>

            <button
                type="button"
                className="betterdocs-finish-btn"
                onClick={handleFinish}
                disabled={isSubmitting}
            >
                {isSubmitting
                    ? __("Finishing…", "betterdocs")
                    : __("Finish setup", "betterdocs")}
            </button>

            <p className="betterdocs-finish-hint">
                {__(
                    "You can revisit any step above before finishing.",
                    "betterdocs"
                )}
            </p>
        </div>
    );
};

export default FinishPanel;
