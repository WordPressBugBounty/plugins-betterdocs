import React, { Suspense, useEffect } from "react";
import { useRoutes, Link } from "react-router-dom";

import { addFilter, applyFilters } from "@wordpress/hooks";
import { addQueryArgs } from "@wordpress/url";
import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";

import Layout from "./Layout";
import CreateFAQGroup from "./CreateFAQGroup";
import CreateProductFAQGroup from "./CreateProductFAQGroup";
import CreateDocCategory from "./CreateDocCategory";
import CreateDocTag from "./CreateDocTag";
import { IconGrid, IconList, IconPlus } from "~betterdocs/icons";
import { makeRouteURL, history } from "~betterdocs/utils";
import Settings from "~betterdocs/admin/settings";
import Dashboard from "~betterdocs/admin/dashboard";
import DashboardOverview from "~betterdocs/admin/dashboard-overview";
import AIChatbot from "~betterdocs/admin/ai-chatbot";
import { FAQProvider } from "./FAQContext";
import { DocCategoriesProvider, useDocCategories } from "./DocCategoriesContext";
import { DocTagsProvider, useDocTags } from "./DocTagsContext";
import FaqBuilder from "~betterdocs/admin/faq-builder";
import Analytics from "~betterdocs/admin/analytics";
import ApiDocsTeaser from "~betterdocs/admin/api-docs";
import ContentIntelligenceTeaser from "~betterdocs/admin/content-intelligence";
import GlossaryTeaser from "~betterdocs/admin/glossaries/GlossaryTeaser";
import DocCategories from "~betterdocs/admin/doc-categories";
import DocTags from "~betterdocs/admin/doc-tags";
import Mcp from "~betterdocs/admin/mcp";
import { useSearchParams } from "react-router-dom";


const ComponentLoader = ({ Component, fallback }) => {
    return (
        <Suspense fallback={fallback ?? "Loading..."}>
            <Component />
        </Suspense>
    );
};

const AddNewPost = () => {
    return (
        <a href="post-new.php?post_type=docs" className="admin-action-button">
            <span className="action-button-icon">
                <IconPlus />
            </span>
            <span className="action-button-icon-text">{__("Add New Docs", "betterdocs")}</span>
        </a>
    );
};

// Reusable plus glyph for the Dashboard's "Add" buttons (fill varies per button).
const PlusIcon = ({ fill }) => (
    <span className="plus-icon">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M5.16602 5.16406V0.164062H6.83268V5.16406H11.8327V6.83073H6.83268V11.8307H5.16602V6.83073H0.166016V5.16406H5.16602Z" fill={fill} />
        </svg>
    </span>
);

// Dashboard "create" actions — shown in the logo bar like every other screen's
// create button (registered via betterdocs_admin_header_action below).
const AddNewItems = () => (
    <div className="betterdocs-addNewItems-button-group">
        <Link
            to={makeRouteURL("betterdocs-faq", { faq_action: "create" }, [], false)}
            className="betterdocs-addNewItems-button betterdocs-faq-button"
        >
            <PlusIcon fill="#344054" />
            <span>{__("Add New FAQ", "betterdocs")}</span>
        </Link>
        <a
            href="post-new.php?post_type=docs"
            className="betterdocs-addNewItems-button betterdocs-doc-button"
        >
            <PlusIcon fill="white" />
            <span>{__("Add New Docs", "betterdocs")}</span>
        </a>
    </div>
);

const DocIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
        <path d="M3 1.5H8.5L11.5 4.5V12.5H3V1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M8.5 1.5V4.5H11.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M5 7H9M5 9H7.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
);

// Count badge component — reads from context so it stays in sync with loaded data.
const DocCategoryCountBadge = () => {
    const ctx = useDocCategories();
    if (!ctx || ctx.totalCount === null) return null;
    return (
        <span className="bd-dc-header-count-badge">
            <DocIcon />
            {ctx.totalCount} {__("total", "betterdocs")}
        </span>
    );
};

const DocTagCountBadge = () => {
    const ctx = useDocTags();
    if (!ctx || ctx.totalCount === null) return null;
    return (
        <span className="bd-dc-header-count-badge">
            <DocIcon />
            {ctx.totalCount} {__("total", "betterdocs")}
        </span>
    );
};

addFilter("betterdocs_admin_header_action", "betterdocs", (content, page) => {
    switch (page) {
        case "betterdocs-dashboard":
            return <AddNewItems />;
        case "betterdocs-admin":
            return <AddNewPost />;
        case "betterdocs-faq":
            return (
                <>
                    <CreateFAQGroup />
                    <CreateProductFAQGroup />
                </>
            );
        case "betterdocs-doc-categories":
            return <CreateDocCategory />;
        case "betterdocs-doc-tags":
            return <CreateDocTag />;
    }
    return content;
});

addFilter("betterdocs_admin_header_title", "betterdocs", (content, page) => {
    switch (page) {
        case "betterdocs-faq":
            return "FAQ Builder";
        case "betterdocs-dashboard":
            return "Dashboard";
        case "betterdocs-admin":
            return "All Docs";
        case "betterdocs-settings":
            return "Settings";
        case "betterdocs-analytics":
            return "Analytics";
        // Since U37 the MCP screen renders its own header row into the shell's
        // container (`mcp/components/McpHeader.js`) and `Header.js` skips the
        // default row for it, so this case no longer reaches the page — it is
        // kept as the answer for anyone who applies the filter, exactly as the
        // analytics case is kept here and in Pro.
        case "betterdocs-mcp":
            return "MCP";
        case "betterdocs-glossaries":
            return "Glossaries";
        case "betterdocs-ai-chatbot":
            return "AI Chatbot";
        case "betterdocs-api-docs":
            return "API Documentation";
        case "betterdocs-content-iq":
            return "Content Intelligence";
        case "betterdocs-doc-categories":
            return "Doc Categories";
        case "betterdocs-doc-tags":
            return "Doc Tags";
    }
    return content;
});

addFilter("betterdocs_admin_header_count", "betterdocs", (content, page) => {
    if (page === "betterdocs-doc-categories") return <DocCategoryCountBadge />;
    if (page === "betterdocs-doc-tags") return <DocTagCountBadge />;
    return content;
});

addFilter(
    "betterdocs_admin_header_action_icons",
    "betterdocs",
    (content, page, location, mode) => {
        let newContents = [];
        if ((mode == null && page === "betterdocs-admin") || (mode == 'grid' && page === "betterdocs-admin")) {
            newContents.push(
                <li key={2}>
                    <Link
                        onClick={(e) => {
                            betterdocs_admin.dashboard_mode = '';
                            apiFetch({
                                method: "POST",
                                path: "betterdocs/v1/dashboard-mode",
                                data: { dashboard_mode: 'list' }
                            });
                        }}
                        to={makeRouteURL("betterdocs-admin", { mode: "list", post_status: "any" })}
                        className={`betterdocs-dashboard-header-action betterdocs-dashboard-header-action-list ${location.search.includes('mode=list') ? 'active' : ''}`}
                    >
                        <IconList />
                    </Link>
                </li>
            );
            return [...newContents, ...content];
        } else if (mode == 'list' && page === "betterdocs-admin") {
            newContents.push(
                <li key={3}>
                    <Link
                        onClick={(e) => {
                            betterdocs_admin.dashboard_mode = '';
                            apiFetch({
                                method: "POST",
                                path: "betterdocs/v1/dashboard-mode",
                                data: { dashboard_mode: 'grid' }
                            });
                        }}
                        to={makeRouteURL("betterdocs-admin", { mode: "grid" }, [], false)}
                        className={`betterdocs-dashboard-header-action betterdocs-dashboard-header-action-grid ${location.search.includes('mode=grid') ? 'active' : ''}`}
                    >
                        <IconGrid />
                    </Link>
                </li>
            );
            return [...newContents, ...content];
        }
        return content;
    },
);

let getSiblings = function (e) {
    let siblings = [];
    if (!e.parentNode) return siblings;
    let sibling = e.parentNode.firstChild;
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== e) siblings.push(sibling);
        sibling = sibling.nextSibling;
    }
    return siblings;
};

const findRoutes = (carry, route) => {
    if (route?.children) return route.children.reduce(findRoutes, carry);
    if (route?.path) carry.push(route.path);
    return carry;
};

const Routes = () => {
    const [searchParams] = useSearchParams();

    const routes = applyFilters("betterdocs_routes_wrapper", [
        {
            element: (
                <FAQProvider>
                    <DocCategoriesProvider>
                        <DocTagsProvider>
                            <Layout />
                        </DocTagsProvider>
                    </DocCategoriesProvider>
                </FAQProvider>
            ),
            children: applyFilters("betterdocs_routes", [
                {
                    path: "betterdocs-admin",
                    element: <ComponentLoader Component={Dashboard} />,
                    exact: true,
                    index: true,
                },
                {
                    path: "betterdocs-dashboard",
                    element: <ComponentLoader Component={DashboardOverview} />,
                    exact: true,
                    index: true,
                },
                {
                    path: "betterdocs-settings",
                    element: <ComponentLoader Component={Settings} />,
                    exact: true,
                },
                {
                    path: "betterdocs-mcp",
                    element: <ComponentLoader Component={Mcp} />,
                    exact: true,
                },
                {
                    path: "betterdocs-faq",
                    element: <ComponentLoader Component={FaqBuilder} />,
                    exact: true,
                },
                {
                    path: "betterdocs-analytics",
                    element: <ComponentLoader Component={Analytics} />,
                    exact: true,
                },
                {
                    path: "betterdocs-doc-categories",
                    element: <ComponentLoader Component={DocCategories} />,
                    exact: true,
                },
                {
                    path: "betterdocs-doc-tags",
                    element: <ComponentLoader Component={DocTags} />,
                    exact: true,
                },
                ...(betterdocs_admin?.betterdocs_ChatBot_plugin == false ? [
                    {
                        path: "betterdocs-ai-chatbot",
                        element: <ComponentLoader Component={AIChatbot} />,
                        exact: true,
                        index: true,
                    }
                ] : []),
                // Free's locked API Docs teaser — PHP decides whether it belongs
                // here, since it would otherwise shadow Pro's route. Truthy check:
                // wp_localize_script sends "1" / "", never a real boolean.
                ...(betterdocs_admin?.api_docs_teaser ? [
                    {
                        path: "betterdocs-api-docs",
                        element: <ComponentLoader Component={ApiDocsTeaser} />,
                        exact: true,
                    }
                ] : []),
                // Free's locked Glossaries teaser. Glossaries is Pro — the whole
                // manager lives there and injects its own route on this same
                // path, so Free must not register anything here while Pro is
                // active or it would shadow it. Truthy check: wp_localize_script
                // sends "1" / "", never a real boolean.
                ...(betterdocs_admin?.glossaries_teaser ? [
                    {
                        path: "betterdocs-glossaries",
                        element: <ComponentLoader Component={GlossaryTeaser} />,
                        exact: true,
                    }
                ] : []),
                // Free's locked Content Intelligence teaser — same deal as API
                // Docs above: PHP owns the decision so this never shadows Pro's
                // route. Truthy check: wp_localize_script sends "1" / "", never
                // a real boolean.
                ...(betterdocs_admin?.content_intelligence_teaser ? [
                    {
                        path: "betterdocs-content-iq",
                        element: <ComponentLoader Component={ContentIntelligenceTeaser} />,
                        exact: true,
                    }
                ] : [])
            ]),
        },
    ]);

    const routesPath = routes.reduce(findRoutes, []);

    const handleClick = function (e) {
        const path = this.getAttribute("href");
        const menu_class = this.getAttribute("class");
        const page = path.split("=")[1];
        let args = { page };
        if (betterdocs_admin.betterdocs_pro_plugin == true && betterdocs_admin.analytics_older == true && menu_class == 'betterdocs-analytics') {
            e.preventDefault();
            window.location.href = path;
            return;
        }

        if (routesPath.includes(page)) {
            e.preventDefault();
        } else {
            return;
        }

        if (path) {
            if (searchParams.get('mode')) args.mode = searchParams.get('mode');
            let url = addQueryArgs(window.location.href?.split('?')[0], args);
            history.push(url);
            const selected = this.parentNode;
            let siblings = getSiblings(selected);
            siblings.forEach((element) => element.classList.remove("current"));
            selected.classList.add("current");
            document.body.classList.add("betterdocs_page_" + page);
        }
    };

    useEffect(() => {
        const betterDocsMenu = document.querySelectorAll(
            "#toplevel_page_betterdocs-dashboard a",
        );
        betterDocsMenu.forEach((element) => {
            element.removeEventListener("click", handleClick);
            element.addEventListener("click", handleClick);
        });
        return () => {
            betterDocsMenu.forEach((element) => {
                element.removeEventListener("click", handleClick);
            });
        };
    }, [routesPath]);

    // Keep the WP admin submenu highlight (and the page-scoped body class) in sync
    // with the active route, so SPA navigation that bypasses the menu — e.g. the
    // dashboard "Add New FAQ" Link — still activates the right menu item.
    useEffect(() => {
        const page = searchParams.get("page") || "betterdocs-dashboard";
        const submenu = document.querySelector(
            "#toplevel_page_betterdocs-dashboard .wp-submenu",
        );
        if (submenu) {
            submenu.querySelectorAll("li").forEach((li) => {
                const a = li.querySelector("a");
                const match = (a?.getAttribute("href") || "").match(/[?&]page=([^&]+)/);
                const isCurrent = Boolean(match && match[1] === page);
                li.classList.toggle("current", isCurrent);
                if (a) a.classList.toggle("current", isCurrent);
            });
        }
        Array.from(document.body.classList)
            .filter((c) => c.startsWith("betterdocs_page_"))
            .forEach((c) => document.body.classList.remove(c));
        document.body.classList.add("betterdocs_page_" + page);
    }, [searchParams]);

    return useRoutes(routes);
};

export default Routes;
