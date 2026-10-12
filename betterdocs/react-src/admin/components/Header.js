import { applyFilters } from "@wordpress/hooks";
import { __, sprintf } from "@wordpress/i18n";
import React from "react";
import Select from "react-select";
import KnowledgeBaseFilter from "../dashboard/components/KnowledgeBaseFilter";
import { useLocation, useSearchParams } from "react-router-dom";

import { Link } from "react-router-dom";

import { IconAutorenew, Logo } from "../../icons/index";

import { makeRouteURL, history } from "../../utils/history";

import DarkModeToggle from "./DarkModeToggle";

// FAQ Builder header "order" options. Rendered with react-select (instead of a
// native <select>) so the menu sits cleanly below the control — matching the
// Knowledge Base filter — instead of overlapping the search field.
const FAQ_ORDER_OPTIONS = [
    { value: "default", label: __("Default Order", "betterdocs") },
    { value: "most_recent", label: __("Most Recent", "betterdocs") },
    { value: "least_recent", label: __("Least Recent", "betterdocs") },
    { value: "a_to_z", label: __("A → Z", "betterdocs") },
    { value: "z_to_a", label: __("Z → A", "betterdocs") },
    { value: "most_questions", label: __("Most Questions", "betterdocs") },
];

const CLASSIC_UI_URLS = {
    "betterdocs-admin":          "edit.php?post_type=docs&amp;bdocs_view=classic",
    "betterdocs-faq":            "edit-tags.php?taxonomy=betterdocs_faq_category&post_type=betterdocs_faq",
    "betterdocs-glossaries":     "edit-tags.php?taxonomy=glossaries&post_type=docs",
    "betterdocs-doc-categories": "edit-tags.php?taxonomy=doc_category&post_type=docs",
    "betterdocs-doc-tags":       "edit-tags.php?taxonomy=doc_tag&post_type=docs",
};

const Header = ({
    page,
    filter,
    trash,
    postStatus,
    docs,
    mode,
    faqSearchKeyword,
    handleFAQSearch,
    faqOrder,
    onFaqOrderChange,
    docCategoriesKeyword,
    handleDocCategoriesSearch,
    docTagsKeyword,
    handleDocTagsSearch,
}) => {
    const [mkbFilter, setMkbFilterValue] = filter;
    const [isLoading, totalItems] = docs;
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const faqTab = searchParams.get("faq_tab") || "builder";
    const faqSubtab = searchParams.get("faq_subtab") || "groups";
    const isFaqBuilderTab = page === "betterdocs-faq" && faqTab === "builder";
    // The WooCommerce "Product FAQ Groups" sub-tab lists FAQ groups just like the
    // General builder, so it gets the same search / order / Classic UI controls.
    const isWooGroupsTab =
        page === "betterdocs-faq" &&
        faqTab === "woocommerce" &&
        faqSubtab === "groups";
    const showFaqGroupControls = isFaqBuilderTab || isWooGroupsTab;
    const wcActive = Boolean(window.betterdocs_admin?.is_woocommerce_active);

    const routeClass = page ? `route-${page.replace(/^betterdocs-/, '')}` : '';

    // FAQ search shows only on the groups tabs (General builder / Woo groups),
    // not on the WooCommerce product-assignment sub-tab. Glossaries is absent
    // here on purpose: it moved to Pro, which renders its own field into the
    // `betterdocs_admin_header_search` slot below.
    const hasSearch = showFaqGroupControls
        || page === "betterdocs-doc-categories" || page === "betterdocs-doc-tags";

    const searchValue = page === "betterdocs-faq" ? faqSearchKeyword
        : page === "betterdocs-doc-categories" ? docCategoriesKeyword
        : page === "betterdocs-doc-tags" ? docTagsKeyword
        : "";

    const searchHandler = page === "betterdocs-faq" ? handleFAQSearch
        : page === "betterdocs-doc-categories" ? handleDocCategoriesSearch
        : page === "betterdocs-doc-tags" ? handleDocTagsSearch
        : null;

    const searchPlaceholder = page === "betterdocs-faq" ? __("Search groups & questions…", "betterdocs")
        : page === "betterdocs-doc-categories" ? __("Search categories…", "betterdocs")
        : page === "betterdocs-doc-tags" ? __("Search tags…", "betterdocs")
        : "";

    // Allow Pro/add-ons to register Classic-UI links for their own React pages
    // (e.g. the Knowledge Base admin page).
    const classicUIUrls = applyFilters("betterdocs_classic_ui_urls", CLASSIC_UI_URLS, page);
    let classicUIUrl  = classicUIUrls[page] || null;
    // FAQ: only show Classic UI on the groups tabs, and point the WooCommerce
    // groups tab at the product FAQ category taxonomy.
    if (page === "betterdocs-faq") {
        classicUIUrl = showFaqGroupControls
            ? `edit-tags.php?taxonomy=${isWooGroupsTab ? "betterdocs_product_faq_category" : "betterdocs_faq_category"}&post_type=betterdocs_faq`
            : null;
    }

    return (
        <section className={`betterdocs-dashboard-header${routeClass ? ` ${routeClass}` : ''}`}>
            <div className="betterdocs-dashboard-header-top">
                <div className="betterdocs-dashboard-container">
                    <div className="betterdocs-row betterdocs-logo-action">
                        <div className="betterdocs-col betterdocs-col-xs-6 betterdocs-dashboard-header-left betterdocs-dashboard-header-items">
                            <div className="betterdocs-dashboard-logo">
                                <Logo />
                            </div>
                        </div>
                        <div className="betterdocs-col betterdocs-col-xs-6 betterdocs-dashboard-header-right betterdocs-dashboard-header-items">
                            {/* Per-page "create" action (Add New Docs/FAQ/Category/…)
                                — the Dashboard's Add FAQ/Docs buttons are registered
                                here too via betterdocs_admin_header_action (Routes.js).
                                The mode switcher lives in the container row below (same
                                spot on every screen), not in this sticky logo bar. */}
                            {applyFilters("betterdocs_admin_header_action", null, page)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="betterdocs-dashboard-container">
                {/* Analytics, Content Intelligence and MCP render their own
                    per-route header into this container, so skip the default row
                    for them. Each portals the dark-mode switcher back in with its
                    own row — dropping this row without it would take the screen's
                    only global control with it (analytics/components/Chrome.js,
                    content-intelligence/index.js, mcp/components/McpHeader.js). */}
                {page !== "betterdocs-analytics" && page !== "betterdocs-content-iq" && page !== "betterdocs-mcp" && (
                <div className="betterdocs-row">
                    <div className="betterdocs-col betterdocs-header-left betterdocs-col-xs-6">
                        <h2 className="betterdocs-dashboard-header-title">
                            {applyFilters(
                                "betterdocs_admin_header_title",
                                __("All Docs", "betterdocs"),
                                page,
                            )}
                        </h2>
                        {/* Per-page count badge rendered via filter */}
                        {applyFilters("betterdocs_admin_header_count", null, page)}
                        {/* The General FAQ / WooCommerce tab strip only makes sense
                            when WooCommerce is active — without it there is nothing to
                            switch to, so render no tabs and show the builder directly. */}
                        {page === "betterdocs-faq" && wcActive && (
                            <div className="betterdocs-faq-page-tabs" role="tablist">
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={faqTab === "builder"}
                                    className={`betterdocs-faq-page-tab${faqTab === "builder" ? " active" : ""}`}
                                    onClick={() =>
                                        history.push(makeRouteURL("betterdocs-faq", { faq_tab: "builder" }))
                                    }
                                >
                                    {__("General FAQ", "betterdocs")}
                                </button>
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={faqTab === "woocommerce"}
                                    className={`betterdocs-faq-page-tab${faqTab === "woocommerce" ? " active" : ""}`}
                                    onClick={() =>
                                        history.push(makeRouteURL("betterdocs-faq", { faq_tab: "woocommerce" }))
                                    }
                                >
                                    {__("WooCommerce", "betterdocs")}
                                </button>
                            </div>
                        )}
                        {(page == 'betterdocs-admin' && !isLoading && totalItems > 0) && (
                            <>
                                <p className="trash-line"></p>
                                <Link className="header-trash" to={makeRouteURL("betterdocs-admin", {
                                    mode: "list",
                                    post_status: "trash"
                                })}> {sprintf(__("Trash (%d)", "betterdocs"), totalItems)} </Link>
                            </>
                        )}
                    </div>
                    <div className="betterdocs-col betterdocs-header-right betterdocs-col-xs-6 betterdocs-d-flex betterdocs-justify-end">
                        {/* Multiple-KB filter (Pro) — styled like the FAQ order select, in the header-right control group. */}
                        {betterdocs_admin?.multiple_kb == 1 && applyFilters(
                            "betterdocs_kb_filter_section",
                            '',
                            [KnowledgeBaseFilter, mkbFilter, setMkbFilterValue, page, postStatus],
                        )}
                        {hasSearch && (
                            <div className="betterdocs-header-search-field">
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={searchValue}
                                    onChange={searchHandler}
                                    className="search-input"
                                />
                                <span className="betterdocs-header-search-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="38" viewBox="0 0 50 50"><path d="M21 3C11.602 3 4 10.602 4 20s7.602 17 17 17c3.355 0 6.46-.984 9.094-2.656l12.281 12.281 4.25-4.25L34.5 30.281C36.68 27.421 38 23.88 38 20c0-9.398-7.602-17-17-17m0 4c7.2 0 13 5.8 13 13s-5.8 13-13 13S8 27.2 8 20 13.8 7 21 7" /></svg>
                                </span>
                            </div>
                        )}
                        {/* Header search slot for Pro/add-on React pages (e.g. Knowledge Base). */}
                        {!hasSearch && applyFilters("betterdocs_admin_header_search", null, page)}
                        {showFaqGroupControls && onFaqOrderChange && (
                            <div className="betterdocs-dropdown-wrapper">
                                <span className="betterdocs-dropdown-icon" aria-hidden="true">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                </span>
                                <Select
                                    className="betterdocs-dropdown-select"
                                    classNamePrefix="betterdocs-dropdown"
                                    value={FAQ_ORDER_OPTIONS.find(
                                        (opt) => opt.value === (faqOrder || "default")
                                    )}
                                    options={FAQ_ORDER_OPTIONS}
                                    onChange={(opt) => onFaqOrderChange(opt?.value || "default")}
                                    isSearchable={false}
                                    isClearable={false}
                                    menuPlacement="bottom"
                                />
                            </div>
                        )}
                        {classicUIUrl && (
                            <div className="betterdocs-header-button">
                                <a
                                    href={classicUIUrl}
                                    className="betterdocs-dashboard-header-action betterdocs-classic-ui-btn"
                                >
                                    <span><IconAutorenew /></span>{" "}
                                    {__("Classic UI", "betterdocs")}
                                </a>
                            </div>
                        )}
                        <ul className="betterdocs-dashboard-header-action-list betterdocs-text-align-right">
                            {/* Mode (dark/light) switcher — same spot on every
                                screen. Page-specific extras (e.g. the All Docs
                                grid/list toggle) are prepended via the filter.
                                The Dashboard's Add FAQ/Docs buttons live in the
                                sticky logo bar above (betterdocs_admin_header_action),
                                not here. Analytics never reaches this row — the whole
                                default row is skipped for it above. */}
                            {applyFilters(
                                "betterdocs_admin_header_action_icons",
                                [
                                    <li key="dark-mode-toggle">
                                        <DarkModeToggle key="dark-mode-button" />
                                    </li>
                                ],
                                page,
                                location,
                                mode
                            )}
                        </ul>
                    </div>
                </div>
                )}
            </div>
        </section>
    );
};

export default Header;
