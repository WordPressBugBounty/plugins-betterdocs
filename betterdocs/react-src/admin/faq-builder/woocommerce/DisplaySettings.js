import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import {
    getWooFaqDisplaySettings,
    saveWooFaqDisplaySettings,
} from "../utils/function";
import { SettingsLoader } from "./Loaders";

const PLACEMENTS = [
    { value: "product_tab", label: __("Product tab", "betterdocs") },
    { value: "after_summary", label: __("After product summary", "betterdocs") },
    { value: "before_summary", label: __("Before product summary", "betterdocs") },
];

// Ordered like the customizer's "Select FAQ Layout" control (Abstract, Modern,
// Classic). Retro (layout-4) is intentionally omitted for product FAQs.
const LAYOUTS = [
    { value: "layout-3", label: __("Abstract", "betterdocs") },
    { value: "layout-1", label: __("Modern", "betterdocs") },
    { value: "layout-2", label: __("Classic", "betterdocs") },
];

// Live preview images, reused from the customizer "Select FAQ Layout" control
// so the admin sees exactly what the front end renders for each layout.
const DIR_URL =
    (typeof window !== "undefined" && window.betterdocs_admin?.dir_url) || "";
const LAYOUT_PREVIEWS = LAYOUTS.reduce((acc, { value }) => {
    acc[value] = `${DIR_URL}assets/static/admin/images/customizer/faq/${value}.png`;
    return acc;
}, {});

const DisplaySettings = () => {
    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);

    const { data: settingsRes, isLoading: settingsLoading } = useQuery(
        ["wooFaqDisplaySettings"],
        getWooFaqDisplaySettings
    );

    // Seed the local form once settings arrive.
    useEffect(() => {
        if (settingsRes?.data && form === null) {
            setForm(settingsRes.data);
        }
    }, [settingsRes]);

    if (settingsLoading || form === null) {
        return <SettingsLoader />;
    }

    const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const selectedLayout =
        LAYOUTS.find((o) => o.value === form.layout) || LAYOUTS[0];

    const handleSave = () => {
        setSaving(true);
        saveWooFaqDisplaySettings(form)
            .then((res) => {
                if (res?.data) {
                    setForm(res.data);
                }
                toast.success(__("Display settings saved.", "betterdocs"));
            })
            .catch((err) => {
                toast.error(
                    err?.message ||
                        __("Could not save display settings.", "betterdocs")
                );
            })
            .finally(() => setSaving(false));
    };

    return (
        <div className="betterdocs-woo-display-settings">
            <div className="betterdocs-woo-assignments-head">
                <div>
                    <h3>{__("Display Settings", "betterdocs")}</h3>
                    <p>
                        {__(
                            "Control how product FAQs appear on single product pages.",
                            "betterdocs"
                        )}
                    </p>
                </div>
            </div>

            <div className="betterdocs-woo-settings-form">
                <div className="bd-woo-settings-main">
                    <div className="bd-woo-field bd-woo-field-toggle">
                        <label className="bd-woo-switch">
                            <input
                                type="checkbox"
                                checked={!!form.enable}
                                onChange={(e) =>
                                    update("enable", e.target.checked)
                                }
                            />
                            <span className="bd-woo-switch-slider" />
                        </label>
                        <div className="bd-woo-field-label">
                            <strong>
                                {__("Enable product FAQs", "betterdocs")}
                            </strong>
                            <span>
                                {__(
                                    "Render FAQ groups on single WooCommerce product pages.",
                                    "betterdocs"
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="bd-woo-field">
                        <label className="bd-woo-field-label">
                            <strong>{__("Placement", "betterdocs")}</strong>
                        </label>
                        <Select
                            className="bd-faq-select"
                            classNamePrefix="bd-faq-select"
                            options={PLACEMENTS}
                            value={PLACEMENTS.find(
                                (o) => o.value === form.placement
                            )}
                            isDisabled={!form.enable}
                            onChange={(opt) => update("placement", opt.value)}
                            menuPortalTarget={
                                typeof document !== "undefined"
                                    ? document.body
                                    : null
                            }
                            styles={{
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                }),
                            }}
                        />
                    </div>

                    {form.placement === "product_tab" && (
                        <div className="bd-woo-field">
                            <label className="bd-woo-field-label">
                                <strong>{__("Tab title", "betterdocs")}</strong>
                            </label>
                            <input
                                type="text"
                                className="bd-woo-text-input"
                                value={form.tab_title}
                                disabled={!form.enable}
                                onChange={(e) =>
                                    update("tab_title", e.target.value)
                                }
                            />
                        </div>
                    )}

                    <div className="bd-woo-field">
                        <label className="bd-woo-field-label">
                            <strong>{__("Layout", "betterdocs")}</strong>
                        </label>
                        <Select
                            className="bd-faq-select"
                            classNamePrefix="bd-faq-select"
                            options={LAYOUTS}
                            value={selectedLayout}
                            isDisabled={!form.enable}
                            onChange={(opt) => update("layout", opt.value)}
                            menuPortalTarget={
                                typeof document !== "undefined"
                                    ? document.body
                                    : null
                            }
                            styles={{
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                }),
                            }}
                        />
                    </div>

                    <div className="bd-woo-field bd-woo-field-toggle">
                        <label className="bd-woo-switch">
                            <input
                                type="checkbox"
                                checked={!!form.enable_schema}
                                onChange={(e) =>
                                    update("enable_schema", e.target.checked)
                                }
                            />
                            <span className="bd-woo-switch-slider" />
                        </label>
                        <div className="bd-woo-field-label">
                            <strong>
                                {__("Output FAQ schema", "betterdocs")}
                            </strong>
                            <span>
                                {__(
                                    "Add FAQPage structured data. Skipped automatically when an SEO plugin already outputs FAQ schema.",
                                    "betterdocs"
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="bd-woo-settings-actions">
                        <button
                            type="button"
                            className="bd-woo-save-btn"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving
                                ? __("Saving…", "betterdocs")
                                : __("Save Settings", "betterdocs")}
                        </button>
                    </div>
                </div>

                <div className="bd-woo-settings-preview">
                    <img
                        className="bd-woo-settings-preview-img"
                        src={
                            LAYOUT_PREVIEWS[form.layout] ||
                            LAYOUT_PREVIEWS["layout-3"]
                        }
                        alt={`${selectedLayout.label} ${__(
                            "layout preview",
                            "betterdocs"
                        )}`}
                    />
                    <span className="bd-woo-settings-preview-caption">
                        {selectedLayout.label} {__("Layout", "betterdocs")}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DisplaySettings;
