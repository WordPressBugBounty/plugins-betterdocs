import { __ } from "@wordpress/i18n";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { I } from "./common/icons";
import { cn, DateRange } from "./common/ui";
import DarkModeToggle from "../../components/DarkModeToggle";

export const TITLES = {
    overview:   { title: __( "Overview", "betterdocs" ), subtitle: __( "Reader behavior across all your knowledge bases.", "betterdocs" ) },
    "ai-traffic": { title: __( "AI Traffic", "betterdocs" ), subtitle: __( "Which AI agents are reading your docs — and how often.", "betterdocs" ) },
    articles:   { title: __( "Docs Performance", "betterdocs" ), subtitle: __( "How each doc is performing — views, unique readers, and trends.", "betterdocs" ) },
    search:     { title: __( "Search Analytics", "betterdocs" ), subtitle: __( "What your readers are looking for — and what they can't find.", "betterdocs" ) },
    engagement: { title: __( "Reader Engagement", "betterdocs" ), subtitle: __( "Geography, sources, devices, and languages.", "betterdocs" ) },
    feedback:   { title: __( "Feedback Inbox", "betterdocs" ), subtitle: __( "Likes, dislikes, and comments — all in one feed.", "betterdocs" ) },
    links:      { title: __( "Link Health", "betterdocs" ), subtitle: __( "Broken links and redirects across your articles.", "betterdocs" ) },
    authors:    { title: __( "Author Performance", "betterdocs" ), subtitle: __( "Per-author contribution and reception across the knowledge base.", "betterdocs" ) },
    settings:   { title: __( "Analytics Settings", "betterdocs" ), subtitle: __( "Configure data retention, privacy, and integrations.", "betterdocs" ) }
};

/* The tab title + sub-header + filters are portalled into the admin header's
   second-row .betterdocs-dashboard-container so the analytics title sits in the
   unified header (consistent with FAQ Builder + Pro).

   `titles` / `fallbackRoute` are parameterised so the Content Intelligence teaser
   (content-intelligence/index.js) can reuse this exact portal — same header slot,
   same dark-mode switcher — with its own per-module heading map. */
export function PageHeader( { route, days, onDays, showFilters = true, titles = TITLES, fallbackRoute = "overview" } ) {
    const [ host, setHost ] = useState( null );

    useEffect( () => {
        const target = document.querySelector( ".betterdocs-dashboard-header > .betterdocs-dashboard-container" );
        if ( ! target ) {
            return;
        }
        const node = document.createElement( "div" );
        node.className = "bda-analytics-header";
        target.appendChild( node );
        setHost( node );
        return () => { node.remove(); };
    }, [] );

    if ( ! host ) {
        return null;
    }

    const meta = titles[ route ] || titles[ fallbackRoute ];

    return createPortal(
        <div className="betterdocs-row">
            <div className="betterdocs-col betterdocs-header-left betterdocs-col-xs-6">
                <div className="bda-page-heading">
                    <h2 className="betterdocs-dashboard-header-title">{ meta.title }</h2>
                    { meta.subtitle && <p className="bda-page-sub">{ meta.subtitle }</p> }
                </div>
            </div>
            <div className="betterdocs-col betterdocs-header-right betterdocs-col-xs-6 betterdocs-d-flex betterdocs-justify-end">
                { showFilters && <DateRange value={ days } onChange={ onDays } /> }
                <ul className="betterdocs-dashboard-header-action-list betterdocs-text-align-right">
                    <li><DarkModeToggle /></li>
                </ul>
            </div>
        </div>,
        host
    );
}

/* Pro flag — every tab is gated in Free (Overview now shows a locked teaser
   too). The `pro` field controls the inline nav badge AND which view renders. */
const NAV = [
    { id: "overview",   label: __( "Overview", "betterdocs" ),            icon: I.Home,    pro: true  },
    { id: "ai-traffic", label: __( "AI Traffic", "betterdocs" ),          icon: I.Sparkle, pro: true  },
    { id: "articles",   label: __( "Docs Performance", "betterdocs" ), icon: I.Article, pro: true  },
    { id: "search",     label: __( "Search Analytics", "betterdocs" ),    icon: I.Search,  pro: true  },
    { id: "engagement", label: __( "Reader Engagement", "betterdocs" ),   icon: I.Users,   pro: true  },
    { id: "feedback",   label: __( "Feedback Inbox", "betterdocs" ),      icon: I.Inbox,   pro: true  },
    { id: "links",      label: __( "Link Health", "betterdocs" ),         icon: I.Link,    pro: true  },
    { id: "authors",    label: __( "Author Performance", "betterdocs" ),  icon: I.Pen,     pro: true  }
];

const NAV_CONFIG = [
    { id: "settings", label: __( "Settings", "betterdocs" ), icon: I.Settings, pro: true }
];

export function AnalyticsNav( { active, onNav } ) {
    const renderItem = ( item ) => {
        const Icon = item.icon;
        const isActive = item.id === active;
        return (
            <button key={ item.id } className={ cn( "bda-nav-item", isActive && "active" ) } onClick={ () => onNav( item.id ) }>
                <Icon size={ 16 } className="bda-nav-ico" strokeWidth={ isActive ? 2.2 : 1.8 } />
                <span>{ item.label }</span>
            </button>
        );
    };
    return (
        <nav className="bda-nav">
            <div className="bda-nav-items">
                { NAV.map( renderItem ) }
            </div>
            <div className="bda-nav-items">
                { NAV_CONFIG.map( renderItem ) }
            </div>
        </nav>
    );
}
