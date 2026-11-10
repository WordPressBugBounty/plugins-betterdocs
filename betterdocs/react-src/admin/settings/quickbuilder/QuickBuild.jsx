import {__} from "@wordpress/i18n";
import {FormBuilder, useBuilderContext} from "quickbuilder";
import React, {useCallback, useEffect} from "react";
import "react-toastify/dist/ReactToastify.css";
import {apiFetch, licenseInactiveAlert, proAlert} from "../../utils";
import toastAlert from "../../utils/toastAlert";
import {doAction} from "@wordpress/hooks";

const setToolbarMenuUrl = ({builtin_doc_page, docs_slug, docs_page}) => {
    let hrefLink = document.querySelector('#wp-admin-bar-view-docs .ab-item');

    if (hrefLink == null) {
        let adminBarSiteNameMenu = document.querySelector('#wp-admin-bar-site-name');
        if (adminBarSiteNameMenu != null) {
            let hrefLinkLi = document.createElement('li');
            hrefLinkLi.id = 'wp-admin-bar-view-docs';

            hrefLink = document.createElement('a');
            hrefLink.classList.add('ab-item');
            hrefLink.textContent = 'Visit Documentation';

            let windowUrl = new URL(window.location.href);
            hrefLink.href = windowUrl.origin;

            hrefLinkLi.append(hrefLink);
            adminBarSiteNameMenu.querySelector('#wp-admin-bar-site-name-default').append(hrefLinkLi);
            // adminBarSiteNameMenu.classList.add('hover');
        } else {
            return;
        }
    }

    let url = new URL(hrefLink.href);
    let pathname = docs_slug?.length > 0 ? docs_slug : 'docs';

    if (builtin_doc_page) {
        url.searchParams.delete('page_id');
    } else if (!builtin_doc_page && docs_page > 0) {
        pathname = '';
        url.searchParams.set('page_id', docs_page)
    }

    url.pathname = pathname;

    hrefLink.href = url.toString();
}

const QuickBuild = (props) => {
    const builder = useBuilderContext();

    useEffect(() => {
        builder.registerAlert("pro_alert", proAlert);
        builder.registerAlert("toast", toastAlert);
        builder.registerAlert("licenseInactiveAlert", licenseInactiveAlert);
    }, []);

    builder.submit.onSubmit = useCallback((event, context) => {
        if (context?.isSubmitting) {
            return;
        }

        context.setSubmitting(true);

        setToolbarMenuUrl(context.values);

        doAction('betterdocs_settings_saved', context);

        // Tell the server which tab is being saved so tab-scoped validation
        // (e.g. the AI min-token floor) only runs for the relevant tab and
        // doesn't block saves from unrelated settings pages.
        // Prefer the live URL hash (always current) over builder.config.active, which is
        // captured at mount and can be stale (defaults to 'tab-general'), causing tab-scoped
        // validation like the AI min-token floor to be skipped. Mirror hashToTabId(): strip
        // the leading '#', then prefix 'tab-' unless the slug already has it.
        const hashSlug = (window.location.hash || "").replace(/^#/, "").trim();
        const activeTab = hashSlug
            ? (hashSlug.startsWith("tab-") ? hashSlug : `tab-${hashSlug}`)
            : (builder?.config?.active || "");

        apiFetch
            .post("settings", { ...context.values, _active_tab: activeTab })
            .then((res) => {
                if (res?.success && res?.data?.notice === "builtin_doc_page_restored") {
                    // The server switched the built-in docs page back on (no custom
                    // Docs Page selected): reflect that in the form and tell the user.
                    const setFieldValue = context?.setFieldValue || builder?.setFieldValue;
                    if (typeof setFieldValue === "function") {
                        setFieldValue("builtin_doc_page", true);
                    }
                    setToolbarMenuUrl({ ...context.values, builtin_doc_page: true });
                    toastAlert("warning", res.data.message, { autoClose: 8000 });
                } else if (res?.success) {
                    toastAlert(
                        "success",
                        __('Changes Saved Successfully.', "betterdocs")
                    );
                } else {
                    toastAlert(
                        res?.code === 'nothing_changed' ? "info" : "error",
                        __(res?.message ?? 'Something went wrong.', "betterdocs")
                    );
                }
            })
            .catch((err) => {
                toastAlert("error", __('Something went wrong.', "betterdocs"));
            }).finally(() => {
            context.setSubmitting(false);
        });
    }, []);

    return (
        <div className="betterdocs-quick-builder-wrapper">
            <FormBuilder {...builder} />
        </div>
    );
};

export default QuickBuild;
