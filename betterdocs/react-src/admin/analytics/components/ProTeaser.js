import { __ } from "@wordpress/i18n";
import React from "react";
import { I } from "./common/icons";
import { cn, ProBadge } from "./common/ui";

/* Pro upgrade target — falls back to the public pricing page; if the host site
   localises a different URL (e.g. an affiliate link) we honour that. */
export function upgradeUrl() {
    return ( window.betterdocs_admin && window.betterdocs_admin.upgrade_url )
        || "https://betterdocs.co/dashboard-upgrade-to-pro";
}

/* Pro teaser card body. Used as the content of a full-tab teaser (default) or
   as a `compact` variant slotted inside an existing card (e.g. Search Trends). */
export default function ProTeaser( { title, subtitle, feature, icon, compact = false } ) {
    const Icon = icon || I.Sparkle;
    return (
        <div className={ cn( "bda-teaser", compact && "compact" ) }>
            { feature && <ProBadge /> }
            <span className="bda-teaser-ico"><Icon size={ compact ? 18 : 22 } /></span>
            <h3 className="bda-teaser-title">{ title || __( "Available in BetterDocs Pro", "betterdocs" ) }</h3>
            { subtitle && <p className="bda-teaser-sub">{ subtitle }</p> }
            <a className="bda-btn primary sm" href={ upgradeUrl() } target="_blank" rel="noopener noreferrer">
                { __( "Upgrade Now", "betterdocs" ) } <I.ArrowRight size={ 12 } />
            </a>
        </div>
    );
}
