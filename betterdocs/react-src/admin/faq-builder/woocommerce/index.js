import React from "react";
import { __ } from "@wordpress/i18n";
import { useSearchParams } from "react-router-dom";
import { makeRouteURL, history } from "~betterdocs/utils";
import ProductFaqGroups from "./ProductFaqGroups";
import DisplaySettings from "./DisplaySettings";

const SUBTABS = [
    { key: "groups", label: __("Product FAQ Groups", "betterdocs") },
    { key: "display", label: __("Display Settings", "betterdocs") },
];

const WooCommerceFaq = () => {
    const [searchParams] = useSearchParams();
    const subtab = searchParams.get("faq_subtab") || "groups";

    const goToSubtab = (key) =>
        history.push(
            makeRouteURL("betterdocs-faq", {
                faq_tab: "woocommerce",
                faq_subtab: key,
            })
        );

    return (
        <div className="betterdocs-woo-faq">
            <div className="betterdocs-woo-faq-subtabs" role="tablist">
                {SUBTABS.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={subtab === tab.key}
                        className={`betterdocs-woo-faq-subtab${
                            subtab === tab.key ? " active" : ""
                        }`}
                        onClick={() => goToSubtab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="betterdocs-woo-faq-panel">
                {subtab === "groups" && <ProductFaqGroups />}
                {subtab === "display" && <DisplaySettings />}
            </div>
        </div>
    );
};

export default WooCommerceFaq;
