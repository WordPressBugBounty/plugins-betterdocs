import { __ } from "@wordpress/i18n";
import React from "react";

import { Donut, HBar, Sparkline } from "../../analytics/components/common/charts";
import { I } from "../../analytics/components/common/icons";
import { Badge, Card } from "../../analytics/components/common/ui";
import { FauxBtn } from "./primitives";

/**
 * Inert mock of Pro's Content Health Score screen
 * (betterdocs-pro/react-src/admin/content-intelligence/views/HealthView.js):
 * the composite score donut with its month-over-month trend, the five scored
 * components with the weakest one called out, the distribution across every
 * published doc, and the articles dragging the average down.
 */

const SCORE = 78;
const GRADE = "B";
const COLOR = "#16C098";

// The five components of the composite score (Pro's `COMPONENTS`), with a
// plausible reading for each. Freshness is deliberately the weak one — that is
// what makes the "weakest area" callout below say something.
const COMPONENTS = [
    { name: __( "Engagement", "betterdocs" ), value: 82 },
    { name: __( "Helpfulness", "betterdocs" ), value: 88 },
    { name: __( "Freshness", "betterdocs" ), value: 61 },
    { name: __( "Findability", "betterdocs" ), value: 74 },
    { name: __( "Accuracy", "betterdocs" ), value: 79 }
];

const DISTRIBUTION = [
    { name: "81-100", value: 34, color: "#16C098" },
    { name: "61-80", value: 41, color: "#16C098" },
    { name: "41-60", value: 18, color: "#f59e0b" },
    { name: "21-40", value: 7, color: "#ef4444" },
    { name: "0-20", value: 3, color: "#ef4444" }
];

const UNDER = [
    { t: "Legacy Shortcode Reference", cat: "Reference", grade: "F", score: 31, weak: __( "Accuracy", "betterdocs" ) },
    { t: "Installing on WordPress Multisite", cat: "Getting Started", grade: "D", score: 44, weak: __( "Freshness", "betterdocs" ) },
    { t: "Configuring Live Search Filters", cat: "Search", grade: "D", score: 48, weak: __( "Findability", "betterdocs" ) },
    { t: "Customizing the KB Layout", cat: "Design", grade: "C", score: 57, weak: __( "Engagement", "betterdocs" ) }
];

const GRADE_COLOR = { A: "#16C098", B: "#16C098", C: "#f59e0b", D: "#f97316", F: "#ef4444" };

const barColor = ( v ) => ( v >= 75 ? "#16C098" : v >= 60 ? "#f59e0b" : "#ef4444" );

export default function HealthMock() {
    return (
        <div className="bda-stack-sm">
            <div className="bda-grid12">
                <div className="bda-col6">
                    <Card padded title={ __( "Content Health Score", "betterdocs" ) }>
                        <div className="bd-cit-health-top">
                            <Donut
                                size={ 130 }
                                thickness={ 14 }
                                centerValue={ SCORE }
                                centerLabel={ `${ __( "Grade", "betterdocs" ) } ${ GRADE }` }
                                segments={ [
                                    { value: SCORE, color: COLOR },
                                    { value: 100 - SCORE, color: "transparent" }
                                ] }
                            />
                            <div>
                                <div className="bd-cit-health-grade">
                                    <span>{ GRADE }</span>
                                    <span className="bda-trend up"><I.ArrowUp size={ 11 } />{ __( "+4 pts", "betterdocs" ) }</span>
                                </div>
                                <div className="bd-cit-row-meta">{ __( "vs last month · site-wide", "betterdocs" ) }</div>
                                <div style={ { marginTop: 12 } }>
                                    <Sparkline points={ [ 68, 70, 69, 72, 74, 73, 76, 78 ] } color={ COLOR } width={ 180 } height={ 36 } />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="bda-col6">
                    <Card padded title={ __( "Score components", "betterdocs" ) }>
                        <HBar
                            max={ 100 }
                            items={ COMPONENTS.map( ( c ) => ( { ...c, color: barColor( c.value ) } ) ) }
                            format={ ( v ) => `${ v }` }
                        />
                        <div className="bda-banner" style={ { marginTop: 14 } }>
                            <div className="bda-banner-ico"><I.AlertTriangle size={ 16 } /></div>
                            <div className="bd-cit-banner-copy">
                                <div className="bd-cit-banner-title">{ __( "Weakest area: Freshness · 61", "betterdocs" ) }</div>
                                <div className="bd-cit-banner-sub">{ __( "How recently updated", "betterdocs" ) }</div>
                            </div>
                            <FauxBtn kind="soft" size="sm">{ __( "Fix stale content", "betterdocs" ) }</FauxBtn>
                        </div>
                    </Card>
                </div>
            </div>

            <Card padded title={ __( "Score distribution", "betterdocs" ) }>
                <HBar items={ DISTRIBUTION } format={ ( v ) => `${ v }` } />
            </Card>

            <Card padded={ false } title={ __( "Lowest-scoring docs", "betterdocs" ) }>
                <table className="bda-table">
                    <thead>
                        <tr>
                            <th>{ __( "Doc", "betterdocs" ) }</th>
                            <th style={ { width: 110 } }>{ __( "Health", "betterdocs" ) }</th>
                            <th>{ __( "Weakest area", "betterdocs" ) }</th>
                            <th className="bda-t-right">{ __( "Action", "betterdocs" ) }</th>
                        </tr>
                    </thead>
                    <tbody>
                        { UNDER.map( ( u, i ) => (
                            <tr key={ i }>
                                <td>
                                    <div className="bda-title-cell">{ u.t }</div>
                                    <div className="bd-cit-row-meta">{ u.cat }</div>
                                </td>
                                <td>
                                    <div className="bd-cit-health-cell">
                                        <span className="bd-cit-health-grade-chip" style={ { background: GRADE_COLOR[ u.grade ] } }>{ u.grade }</span>
                                        <span className="bda-num bda-strong">{ u.score }</span>
                                    </div>
                                </td>
                                <td><Badge color="slate">{ u.weak }</Badge></td>
                                <td className="bda-t-right">
                                    <FauxBtn kind="ghost" size="sm" icon={ <I.TrendingUp size={ 13 } /> }>{ __( "Improve", "betterdocs" ) }</FauxBtn>
                                </td>
                            </tr>
                        ) ) }
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
