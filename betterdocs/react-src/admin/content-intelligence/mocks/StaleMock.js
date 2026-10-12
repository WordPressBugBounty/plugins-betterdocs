import { __ } from "@wordpress/i18n";
import React from "react";

import { Sparkline } from "../../analytics/components/common/charts";
import { I } from "../../analytics/components/common/icons";
import { Badge, Card, KpiCard } from "../../analytics/components/common/ui";
import { decline, FauxBtn } from "./primitives";

/**
 * Inert mock of Pro's Stale Content screen
 * (betterdocs-pro/react-src/admin/content-intelligence/views/StaleView.js):
 * the "how this is scored" banner, the three KPIs, and the ranked table where
 * every row shows its staleness bar, its view trend, and the reason flags that
 * produced the score.
 */

// The reason flags Pro's stale scanner emits, with Pro's colour mapping.
const FLAGS = {
    age:        { label: __( "Not updated 8+ months", "betterdocs" ), color: "amber" },
    age6:       { label: __( "Not updated 6+ months", "betterdocs" ), color: "amber" },
    decline:    { label: __( "Declining views", "betterdocs" ), color: "red" },
    contradict: { label: __( "Contradicts newer doc", "betterdocs" ), color: "purple" },
    version:    { label: __( "Outdated version", "betterdocs" ), color: "amber" },
    broken:     { label: __( "Broken link", "betterdocs" ), color: "red" }
};

const ROWS = [
    { t: "Installing BetterDocs on WordPress Multisite", cat: "Getting Started", score: 91, updated: "12 Mar 2024", flags: [ "age", "version", "decline" ] },
    { t: "Configuring Live Search Filters", cat: "Search", score: 84, updated: "28 Apr 2024", flags: [ "age", "decline" ] },
    { t: "Legacy Shortcode Reference", cat: "Reference", score: 77, updated: "05 Jun 2024", flags: [ "contradict", "broken" ] },
    { t: "Setting Up the FAQ Builder", cat: "FAQ", score: 63, updated: "19 Sep 2024", flags: [ "age6", "decline" ] },
    { t: "Importing Docs from Other Tools", cat: "Migration", score: 51, updated: "02 Nov 2024", flags: [ "age6" ] }
];

function StalenessScore( { score } ) {
    const color = score >= 75 ? "#ef4444" : score >= 50 ? "#f59e0b" : "#eab308";
    return (
        <div className="bd-cit-staleness">
            <div className="bd-cit-staleness-track">
                <div className="bd-cit-staleness-fill" style={ { width: `${ score }%`, background: color } } />
            </div>
            <span className="bda-num bda-strong" style={ { color } }>{ score }</span>
        </div>
    );
}

export default function StaleMock() {
    return (
        <div className="bda-stack-sm">
            <div className="bda-banner">
                <div className="bda-banner-ico"><I.Clock size={ 18 } /></div>
                <div className="bd-cit-banner-copy">
                    <div className="bd-cit-banner-title">{ __( "Docs losing freshness", "betterdocs" ) }</div>
                    <div className="bd-cit-banner-sub">
                        { __( "Scored on age, declining engagement, version references, and broken links. Runs nightly — no API key required.", "betterdocs" ) }
                    </div>
                </div>
            </div>

            <div className="bda-kpi-grid cols-3">
                <KpiCard label={ __( "Stale Docs", "betterdocs" ) } value="26" icon={ <I.Clock size={ 16 } /> } color="#f59e0b" />
                <KpiCard label={ __( "Critical", "betterdocs" ) } value="5" icon={ <I.AlertTriangle size={ 16 } /> } color="#ef4444" />
                <KpiCard label={ __( "Avg. Staleness", "betterdocs" ) } value="64 / 100" icon={ <I.TrendingUp size={ 16 } /> } color="#8b5cf6" />
            </div>

            <Card padded={ false } title={ __( "Docs by staleness", "betterdocs" ) }>
                <table className="bda-table">
                    <thead>
                        <tr>
                            <th>{ __( "Doc", "betterdocs" ) }</th>
                            <th style={ { width: 150 } }>{ __( "Staleness", "betterdocs" ) }</th>
                            <th>{ __( "Last updated", "betterdocs" ) }</th>
                            <th style={ { width: 90 } }>{ __( "Trend", "betterdocs" ) }</th>
                            <th>{ __( "Reason", "betterdocs" ) }</th>
                            <th className="bda-t-right">{ __( "Actions", "betterdocs" ) }</th>
                        </tr>
                    </thead>
                    <tbody>
                        { ROWS.map( ( r, i ) => (
                            <tr key={ i }>
                                <td>
                                    <div className="bda-title-cell">{ r.t }</div>
                                    <div className="bd-cit-row-meta">{ r.cat }</div>
                                </td>
                                <td><StalenessScore score={ r.score } /></td>
                                <td className="bd-cit-row-meta">{ r.updated }</td>
                                <td><Sparkline points={ decline( 120 - i * 12 ) } color="#ef4444" width={ 74 } height={ 26 } /></td>
                                <td>
                                    <div className="bd-cit-flags">
                                        { r.flags.map( ( f ) => (
                                            <Badge key={ f } color={ FLAGS[ f ].color }>{ FLAGS[ f ].label }</Badge>
                                        ) ) }
                                    </div>
                                </td>
                                <td className="bda-t-right">
                                    <div className="bd-cit-row-actions">
                                        <FauxBtn kind="ghost" size="sm" icon={ <I.Pen size={ 13 } /> }>{ __( "Edit", "betterdocs" ) }</FauxBtn>
                                        <FauxBtn kind="ghost" size="sm" icon={ <I.Check size={ 13 } /> }>{ __( "Mark current", "betterdocs" ) }</FauxBtn>
                                    </div>
                                </td>
                            </tr>
                        ) ) }
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
