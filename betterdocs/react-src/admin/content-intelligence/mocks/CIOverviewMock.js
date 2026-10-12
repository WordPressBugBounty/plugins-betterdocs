import { __ } from "@wordpress/i18n";
import React from "react";

import { I } from "../../analytics/components/common/icons";
import { CopyIcon, FauxBtn } from "./primitives";

/**
 * Inert mock of Pro's Content Intelligence Overview
 * (betterdocs-pro/react-src/admin/content-intelligence/views/CIOverviewView.js).
 *
 * Same three bands as the real screen, in the same order: the KPI strip that
 * answers "how is the knowledge base doing", the "this week's top action" hero
 * with the evidence behind it, and the module tiles that navigate. Numbers are
 * invented but plausible for a mid-size knowledge base — the point is that a
 * Free user recognises this screen the day they upgrade.
 */

// Per-module accent, copied from Pro so the same hue keys the same module in
// both plugins (gaps green, stale amber, duplicates violet, health blue).
const ACCENT = {
    gaps: "#00b884",
    stale: "#f59e0b",
    duplicates: "#8b5cf6",
    health: "#3b82f6"
};

const GRADE_COLOR = "#16C098";

function Kpi( { label, color, icon: Icon, children, footer } ) {
    return (
        <div className="bda-kpi bd-cit-kpi">
            <div className="bda-kpi-top">
                <div className="bda-kpi-label">{ label }</div>
                <div className="bda-kpi-ico" style={ { background: color + "1A", color } }><Icon size={ 15 } /></div>
            </div>
            <div className="bd-cit-kpi-body">{ children }</div>
            { footer && <div className="bd-cit-kpi-foot">{ footer }</div> }
        </div>
    );
}

function Tile( { id, icon: Icon, value, unit, title, blurb } ) {
    const color = ACCENT[ id ];
    return (
        <div className="bd-cit-tile">
            <span className="bd-cit-tile-ico" style={ { background: color + "18", color } }><Icon size={ 18 } /></span>
            <span className="bd-cit-tile-num">
                <strong>{ value }</strong>
                <span className="bd-cit-tile-unit">{ unit }</span>
            </span>
            <span className="bd-cit-tile-title">{ title }</span>
            <span className="bd-cit-tile-blurb">{ blurb }</span>
            <span className="bd-cit-tile-cta">{ __( "View", "betterdocs" ) } <I.ArrowRight size={ 12 } /></span>
        </div>
    );
}

// The evidence block under the hero: which reader signals point at the topic.
const SIGNALS = [
    { n: "86", label: __( "zero-result searches", "betterdocs" ) },
    { n: "27", label: __( "high-bounce exits", "betterdocs" ) },
    { n: "15", label: __( "feedback mentions", "betterdocs" ) }
];

export default function CIOverviewMock() {
    return (
        <div className="bda-stack-sm">
            <div className="bda-kpi-grid">
                <Kpi label={ __( "Content Gaps Detected", "betterdocs" ) } color={ ACCENT.gaps } icon={ I.Sparkle }
                    footer={ <span className="bd-cit-hint">{ __( "3 new this week", "betterdocs" ) }</span> }>
                    <div className="bda-kpi-value">14</div>
                </Kpi>

                <Kpi label={ __( "Stale Docs", "betterdocs" ) } color={ ACCENT.stale } icon={ I.Clock }
                    footer={ <span className="bd-cit-hint">{ __( "5 critical", "betterdocs" ) }</span> }>
                    <div className="bda-kpi-value">26</div>
                </Kpi>

                <Kpi label={ __( "Content Health Score", "betterdocs" ) } color={ GRADE_COLOR } icon={ I.PieChart }
                    footer={ <>
                        <span className="bda-trend up"><I.ArrowUp size={ 11 } />{ __( "+4 pts", "betterdocs" ) }</span>
                        <span className="bd-cit-hint">{ __( "site-wide", "betterdocs" ) }</span>
                    </> }>
                    <div className="bd-cit-score">
                        <span className="bda-kpi-value">78</span>
                        <span className="bd-cit-grade" style={ { background: GRADE_COLOR + "1A", color: GRADE_COLOR } }>B</span>
                    </div>
                </Kpi>

                <Kpi label={ __( "AI Suggestions Applied", "betterdocs" ) } color="#8b5cf6" icon={ I.Check }
                    footer={ <div className="bd-cit-bar"><div className="bd-cit-bar-fill" style={ { width: "68%" } } /></div> }>
                    <div className="bd-cit-score">
                        <span className="bda-kpi-value">31</span>
                        <span className="bd-cit-rate"><strong>68%</strong> { __( "accepted", "betterdocs" ) }</span>
                    </div>
                </Kpi>
            </div>

            <div className="bd-cit-hero">
                <div className="bd-cit-hero-main">
                    <span className="bd-cit-hero-ico"><I.Sparkle size={ 22 } /></span>
                    <div className="bd-cit-hero-copy">
                        <div className="bd-cit-hero-eyebrow">
                            <span>{ __( "This week's top action", "betterdocs" ) }</span>
                            <span className="bd-cit-conf is-high">{ __( "High confidence", "betterdocs" ) }</span>
                        </div>
                        <h2 className="bd-cit-hero-title">
                            { __( "Write the missing", "betterdocs" ) } <em>SSO login errors</em> { __( "guide", "betterdocs" ) }
                        </h2>
                        <p className="bd-cit-hero-sub">
                            { __( "128 reader signals point to this missing topic. It's your highest-demand gap, and no doc covers it yet.", "betterdocs" ) }
                        </p>
                        <div className="bd-cit-hero-actions">
                            <FauxBtn kind="primary">{ __( "Review this gap", "betterdocs" ) }</FauxBtn>
                            <FauxBtn kind="ghost">{ __( "See all gaps", "betterdocs" ) }</FauxBtn>
                        </div>
                    </div>
                </div>

                <div className="bd-cit-signals">
                    { SIGNALS.map( ( s, i ) => (
                        <div className="bd-cit-signal" key={ i }>
                            <div className="bd-cit-signal-num">{ s.n }</div>
                            <div className="bd-cit-signal-label">{ s.label }</div>
                        </div>
                    ) ) }
                </div>
            </div>

            <div>
                <h3 className="bd-cit-section">{ __( "Intelligence modules", "betterdocs" ) }</h3>
                <div className="bd-cit-tiles">
                    <Tile id="gaps" icon={ I.Sparkle } value="14" unit={ __( "topics", "betterdocs" ) }
                        title={ __( "Content Gaps", "betterdocs" ) }
                        blurb={ __( "Demand your docs don't answer yet.", "betterdocs" ) } />
                    <Tile id="stale" icon={ I.Clock } value="26" unit={ __( "docs", "betterdocs" ) }
                        title={ __( "Stale Content", "betterdocs" ) }
                        blurb={ __( "Docs losing freshness and accuracy.", "betterdocs" ) } />
                    <Tile id="duplicates" icon={ CopyIcon } value="9" unit={ __( "pairs", "betterdocs" ) }
                        title={ __( "Duplicates & Overlaps", "betterdocs" ) }
                        blurb={ __( "Docs covering the same ground.", "betterdocs" ) } />
                    <Tile id="health" icon={ I.PieChart } value="B·78" unit={ __( "score", "betterdocs" ) }
                        title={ __( "Content Health", "betterdocs" ) }
                        blurb={ __( "How healthy your KB is overall.", "betterdocs" ) } />
                </div>
            </div>
        </div>
    );
}
