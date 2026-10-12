import { __ } from "@wordpress/i18n";
import React, { useState } from "react";

import { I } from "../analytics/components/common/icons";
import { cn, ProBadge } from "../analytics/components/common/ui";
import { PageHeader } from "../analytics/components/Chrome";
import LockedPreview from "../analytics/components/modules/LockedPreview";

import CIOverviewMock from "./mocks/CIOverviewMock";
import GapsMock from "./mocks/GapsMock";
import StaleMock from "./mocks/StaleMock";
import HealthMock from "./mocks/HealthMock";
import DuplicatesMock from "./mocks/DuplicatesMock";
import { CopyIcon } from "./mocks/primitives";

import "../analytics/scss/dashboard.scss";
import "./content-intelligence-teaser.scss";

/**
 * Free's Content Intelligence screen — the locked teaser for Pro's v2.0
 * Content Intelligence pillar. Only the WP admin menu item is shortened to
 * "Content IQ" (and the page slug to `betterdocs-content-iq`); every heading,
 * title and description on the screen itself still says Content Intelligence.
 *
 * This is the *full shell* variant, the same shape Free's Analytics teaser
 * uses: the real left-hand sub-nav with all five modules, and a per-module
 * `LockedPreview` over a design-accurate mock of that module. Browsing the nav
 * is the point — someone deciding on an upgrade gets to see each of the five
 * screens they'd be buying, not one generic upsell.
 *
 * Free only registers the `betterdocs-content-iq` route when Pro does
 * not ship Content Intelligence (`betterdocs_admin.content_intelligence_teaser`,
 * decided in PHP by `betterdocs()->show_content_intelligence_teaser()`), so this
 * can never shadow Pro's real screen. The page title comes from the shared admin
 * header (`betterdocs_admin_header_title` in `components/Routes.js`); everything
 * below it is ours.
 */

/* Sub-tab ids and labels are identical to Pro's Content Intelligence nav group
   (betterdocs-pro/react-src/admin/analytics/components/Chrome.js), including the
   icons, so the teaser and the real thing are the same screen with the data
   removed. Each entry also owns its upsell copy — one array keeps the nav, the
   lock panel and the mock from drifting apart. */
const TABS = [
    {
        id: "ci-overview",
        label: __( "Overview", "betterdocs" ),
        icon: I.Sparkle,
        mock: CIOverviewMock,
        heading: { title: __( "Content Intelligence", "betterdocs" ), subtitle: __( "What to fix next — gaps, freshness, and health across your knowledge base.", "betterdocs" ) },
        title: __( "Content Intelligence is a Pro feature", "betterdocs" ),
        subtitle: __( "One screen that answers \"what should I fix next?\" — a health grade for the whole knowledge base, the single highest-impact action this week, and a live count for every intelligence module. It runs on the analytics BetterDocs already collects.", "betterdocs" ),
        bullets: [
            __( "Gaps, stale docs, health score and applied suggestions at a glance", "betterdocs" ),
            __( "\"This week's top action\", ranked by real reader demand", "betterdocs" ),
            __( "The evidence behind it: empty searches, bounced visits, feedback", "betterdocs" ),
            __( "Module tiles that jump straight to the fix", "betterdocs" )
        ]
    },
    {
        id: "gaps",
        label: __( "Content Gaps", "betterdocs" ),
        icon: I.Search,
        mock: GapsMock,
        heading: { title: __( "Content Gap Detection", "betterdocs" ), subtitle: __( "Topics your readers want that your docs don't cover yet.", "betterdocs" ) },
        title: __( "Content Gap Detection is a Pro feature", "betterdocs" ),
        subtitle: __( "Finds the topics your readers keep asking for and your docs never answer. BetterDocs clusters searches that came back empty, visits that bounced, and feedback mentions into topics, then re-checks each one against your existing docs before listing it.", "betterdocs" ),
        bullets: [
            __( "Missing topics ranked by demand, with the queries that evidence them", "betterdocs" ),
            __( "Confidence scoring so you can act on the strongest signals first", "betterdocs" ),
            __( "Accept, dismiss, or draft the doc title with your own AI key", "betterdocs" ),
            __( "Grouped by meaning — not just matching words — with the AI Chatbot add-on", "betterdocs" )
        ]
    },
    {
        id: "stale",
        label: __( "Stale Content", "betterdocs" ),
        icon: I.Clock,
        mock: StaleMock,
        heading: { title: __( "Stale Content", "betterdocs" ), subtitle: __( "Docs losing accuracy, freshness, or engagement — ranked by staleness.", "betterdocs" ) },
        title: __( "Stale Content detection is a Pro feature", "betterdocs" ),
        subtitle: __( "Scores every doc on age, declining views and reactions, outdated version mentions, and broken links — so you refresh the docs that are actually decaying rather than simply the oldest ones.", "betterdocs" ),
        bullets: [
            __( "A 0–100 staleness score with the reason flags behind it", "betterdocs" ),
            __( "Per-doc view trend, ranked worst first", "betterdocs" ),
            __( "Nightly rule-based scan — no API key required", "betterdocs" ),
            __( "Mark as current, dismiss, or open the doc to fix it", "betterdocs" )
        ]
    },
    {
        id: "health",
        label: __( "Health Score", "betterdocs" ),
        icon: I.PieChart,
        mock: HealthMock,
        heading: { title: __( "Content Health Score", "betterdocs" ), subtitle: __( "A single, composite measure of how healthy your knowledge base is.", "betterdocs" ) },
        title: __( "Content Health Score is a Pro feature", "betterdocs" ),
        subtitle: __( "A single composite grade for your knowledge base, built from five measured components, tracked month over month, and broken down to the individual docs pulling it down.", "betterdocs" ),
        bullets: [
            __( "Site-wide score and A–F grade, trended over time", "betterdocs" ),
            __( "Engagement, Helpfulness, Freshness, Findability & Accuracy", "betterdocs" ),
            __( "Score distribution across every published doc", "betterdocs" ),
            __( "Lowest-scoring docs with their weakest component named", "betterdocs" )
        ]
    },
    {
        id: "duplicates",
        label: __( "Duplicates & Overlaps", "betterdocs" ),
        icon: CopyIcon,
        mock: DuplicatesMock,
        heading: { title: __( "Duplicates & Overlaps", "betterdocs" ), subtitle: __( "Docs covering near-identical ground, detected by content similarity.", "betterdocs" ) },
        title: __( "Duplicates & Overlaps is a Pro feature", "betterdocs" ),
        subtitle: __( "Two docs can cover the same ground without sharing a single phrase — one written for beginners, one for admins. BetterDocs compares what your docs mean rather than the words they use, and lists the near-identical pairs with a similarity score.", "betterdocs" ),
        bullets: [
            __( "Near-duplicate doc pairs, scored by content similarity", "betterdocs" ),
            __( "Catches overlaps that share no wording at all", "betterdocs" ),
            __( "Merge, keep both, or dismiss each pair as you review it", "betterdocs" ),
            __( "Semantic detection runs on the BetterDocs AI Chatbot add-on's index", "betterdocs" )
        ]
    }
];

/* Per-module heading map for the portalled header, keyed by tab id — the real
   product titles (not the "… is a Pro feature" upsell copy), so the header reads
   exactly like Pro's. Reuses the Analytics PageHeader portal + dark-mode switcher
   via its `titles` prop. */
const CI_TITLES = Object.fromEntries( TABS.map( ( t ) => [ t.id, t.heading ] ) );

export default function ContentIntelligenceTeaser() {
    const [ tab, setTab ] = useState( TABS[ 0 ].id );
    const active = TABS.find( ( t ) => t.id === tab ) || TABS[ 0 ];
    const Mock = active.mock;

    const nav = ( id ) => {
        setTab( id );
        window.scrollTo( { top: 0 } );
    };

    return (
        <div className="betterdocs-dashboard-body bd-cit-wrapper">
            { /* Active-tab title + subtitle, portalled into the shared admin
                 header (the default row is skipped for this page in Header.js) —
                 same treatment as Analytics, no filters. */ }
            <PageHeader route={ tab } titles={ CI_TITLES } fallbackRoute="ci-overview" showFilters={ false } />
            <div className="bda-app">
                <div className="bda-container">
                    <div className="bda-shell">
                        <nav className="bda-nav bd-cit-nav">
                            <div className="bda-nav-title">{ __( "Content Intelligence", "betterdocs" ) }</div>
                            <div className="bda-nav-items">
                                { TABS.map( ( item ) => {
                                    const Icon = item.icon;
                                    const isActive = item.id === active.id;
                                    return (
                                        <button
                                            key={ item.id }
                                            type="button"
                                            className={ cn( "bda-nav-item", isActive && "active" ) }
                                            onClick={ () => nav( item.id ) }
                                        >
                                            <Icon size={ 16 } className="bda-nav-ico" strokeWidth={ isActive ? 2.2 : 1.8 } />
                                            <span>{ item.label }</span>
                                            <ProBadge className="bda-nav-pro" />
                                        </button>
                                    );
                                } ) }
                            </div>
                        </nav>
                        <main className="bda-main">
                            <LockedPreview
                                title={ active.title }
                                subtitle={ active.subtitle }
                                bullets={ active.bullets }
                            >
                                <Mock />
                            </LockedPreview>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
