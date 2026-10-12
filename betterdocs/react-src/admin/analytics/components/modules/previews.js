import { __ } from "@wordpress/i18n";
import React from "react";
import { I } from "../common/icons";
import { AreaChart, Donut, HBar } from "../common/charts";
import { Card, KpiCard, Avatar, authorFromName, cn, fmt } from "../common/ui";
import { countryFlag } from "../common/geo";

/* Static, illustrative sample data for the locked-module previews. Nothing here
   is fetched — it exists only to render a convincing, design-accurate picture
   of each Pro module behind the lock panel. */

const LABELS = [ "1", "3", "5", "7", "9", "11", "13", "15", "17", "19", "21", "23", "25", "27" ];
const wave = ( base, amp, n = LABELS.length ) =>
    Array.from( { length: n }, ( _, i ) => Math.round( base + amp * ( Math.sin( i / 1.7 ) * 0.6 + Math.sin( i / 3.3 ) * 0.4 ) + amp * 0.5 ) );

const feelingIcon = ( f ) => f === "sad"
    ? <span className="bda-feed-ico dislike"><I.ThumbsDown size={ 13 } /></span>
    : f === "comment"
        ? <span className="bda-feed-ico" style={ { background: "#eff6ff", color: "#2563eb" } }><I.MessageCircle size={ 13 } /></span>
        : <span className="bda-feed-ico like"><I.ThumbsUp size={ 13 } /></span>;

/* ── Overview (Free-locked) ──────────────────────────────────────────── */
export function OverviewMock() {
    const arts = [
        { t: "Getting Started with BetterDocs", v: 4820, u: 3110 },
        { t: "How to Create Your First Knowledge Base", v: 3760, u: 2540 },
        { t: "Configuring Live Search", v: 2980, u: 2010 },
        { t: "Setting Up the FAQ Builder", v: 2210, u: 1640 },
        { t: "Customizing the Knowledge Base Layout", v: 1870, u: 1290 },
        { t: "Troubleshooting Permalink Issues", v: 1490, u: 1120 },
        { t: "Importing Docs from Other Tools", v: 1130, u: 870 }
    ];
    const queries = [
        { q: "installation", c: 486 },
        { q: "shortcode", c: 372 },
        { q: "live search", c: 291 },
        { q: "faq", c: 244 },
        { q: "elementor", c: 188 },
        { q: "permalink", c: 141 },
        { q: "import", c: 97 }
    ];
    const recent = [
        { f: "happy", t: "Getting Started with BetterDocs", d: "2026-06-28" },
        { f: "sad", t: "Configuring Live Search", d: "2026-06-27" },
        { f: "happy", t: "Setting Up the FAQ Builder", d: "2026-06-26" },
        { f: "happy", t: "Importing Docs from Other Tools", d: "2026-06-25" }
    ];
    return (
        <div className="bda-stack">
            <div className="bda-kpi-grid">
                <KpiCard label={ __( "Total Views", "betterdocs" ) }   value="48.2K" spark={ wave( 1200, 320 ) } delta={ 12.4 } dir={ 1 } icon={ <I.Eye size={ 14 } /> }      color="#00b884" />
                <KpiCard label={ __( "Unique Readers", "betterdocs" ) } value="31.5K" spark={ wave( 900, 240 ) }  delta={ 8.1 }  dir={ 1 } icon={ <I.Users size={ 14 } /> }    color="#3B82F6" />
                <KpiCard label={ __( "Searches", "betterdocs" ) }       value="6.4K"  spark={ wave( 220, 70 ) }   delta={ 5.2 }  dir={ 1 } icon={ <I.Search size={ 14 } /> }   color="#F59E0B" />
                <KpiCard label={ __( "Reactions", "betterdocs" ) }      value="1.2K"  spark={ wave( 60, 18 ) }    delta={ 3.6 }  dir={ 1 } icon={ <I.ThumbsUp size={ 14 } /> } color="#8B5CF6" />
            </div>
            <div className="bda-grid12">
                <div className="bda-col8">
                    <Card padded={ false } title={ __( "Top 10 Docs", "betterdocs" ) }>
                        <table className="bda-table bda-table--fixed">
                            <thead><tr>
                                <th style={ { width: 48 } }>#</th>
                                <th>{ __( "Doc", "betterdocs" ) }</th>
                                <th className="bda-t-right" style={ { width: 90 } }>{ __( "Views", "betterdocs" ) }</th>
                                <th className="bda-t-right" style={ { width: 90 } }>{ __( "Unique", "betterdocs" ) }</th>
                            </tr></thead>
                            <tbody>
                                { arts.map( ( a, i ) => (
                                    <tr key={ i }>
                                        <td><span className={ cn( "bda-rank", i < 3 && "top" ) }>{ i + 1 }</span></td>
                                        <td><div className="bda-title-cell">{ a.t }</div></td>
                                        <td className="bda-t-right bda-num bda-strong">{ fmt( a.v ) }</td>
                                        <td className="bda-t-right bda-num">{ fmt( a.u ) }</td>
                                    </tr>
                                ) ) }
                            </tbody>
                        </table>
                    </Card>
                    <Card padded title={ __( "Search Trends", "betterdocs" ) }>
                        <AreaChart labels={ LABELS } series={ [
                            { name: __( "Searches", "betterdocs" ), data: wave( 220, 80 ), color: "#F59E0B" },
                            { name: __( "Zero-results", "betterdocs" ), data: wave( 40, 24 ), color: "#EF4444" }
                        ] } height={ 200 } />
                    </Card>
                </div>
                <div className="bda-col4">
                    <Card padded={ false } title={ __( "Top Search Queries", "betterdocs" ) }>
                        <table className="bda-table">
                            <thead><tr><th>{ __( "Query", "betterdocs" ) }</th><th className="bda-t-right">{ __( "Count", "betterdocs" ) }</th></tr></thead>
                            <tbody>
                                { queries.map( ( q, i ) => (
                                    <tr key={ i }>
                                        <td><span className="bda-strong" style={ { fontWeight: 500 } }>{ q.q }</span></td>
                                        <td className="bda-t-right bda-num">{ fmt( q.c ) }</td>
                                    </tr>
                                ) ) }
                            </tbody>
                        </table>
                    </Card>
                    <Card title={ __( "Recent Feedback", "betterdocs" ) }>
                        <div style={ { display: "flex", flexDirection: "column", gap: 12 } }>
                            { recent.map( ( f, i ) => (
                                <div key={ i } style={ { display: "flex", gap: 10 } }>
                                    { feelingIcon( f.f ) }
                                    <div style={ { minWidth: 0 } }>
                                        <div className="bda-title-cell" style={ { fontSize: 12.5 } }>{ f.t }</div>
                                        <div style={ { fontSize: 11.5, color: "var(--text-color-500)", marginTop: 2 } }>{ f.d }</div>
                                    </div>
                                </div>
                            ) ) }
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

/* ── Article Performance ─────────────────────────────────────────────── */
export function ArticlesMock() {
    const rows = [
        { t: "Getting Started with BetterDocs", v: 4820, u: 3110, h: 92 },
        { t: "How to Create Your First Knowledge Base", v: 3760, u: 2540, h: 88 },
        { t: "Configuring Live Search", v: 2980, u: 2010, h: 81 },
        { t: "Setting Up the FAQ Builder", v: 2210, u: 1640, h: 76 },
        { t: "Troubleshooting Permalink Issues", v: 1490, u: 1120, h: 64 }
    ];
    return (
        <div className="bda-stack">
            <div className="bda-kpi-grid">
                <KpiCard label={ __( "Total Views", "betterdocs" ) }   value="48.2K" spark={ wave( 1200, 320 ) } delta={ 12.4 } dir={ 1 }  icon={ <I.Eye size={ 14 } /> }      color="#00b884" />
                <KpiCard label={ __( "Unique Readers", "betterdocs" ) } value="31.5K" spark={ wave( 900, 240 ) }  delta={ 8.1 }  dir={ 1 }  icon={ <I.Users size={ 14 } /> }    color="#3B82F6" />
                <KpiCard label={ __( "Avg. Read Time", "betterdocs" ) } value="2m 48s" spark={ wave( 160, 30 ) }  delta={ -2.3 } dir={ -1 } icon={ <I.Clock size={ 14 } /> }    color="#F59E0B" />
                <KpiCard label={ __( "Helpfulness", "betterdocs" ) }    value="84%"   spark={ wave( 80, 8 ) }     delta={ 3.6 }  dir={ 1 }  icon={ <I.ThumbsUp size={ 14 } /> } color="#8B5CF6" />
            </div>
            <Card padded title={ __( "Views Over Time", "betterdocs" ) }>
                <AreaChart labels={ LABELS } series={ [ { name: __( "Views", "betterdocs" ), data: wave( 1200, 360 ), color: "#00b884" } ] } height={ 220 } />
            </Card>
            <Card padded={ false } title={ __( "Per-Doc Breakdown", "betterdocs" ) }>
                <table className="bda-table bda-table--fixed">
                    <thead><tr>
                        <th>{ __( "Doc", "betterdocs" ) }</th>
                        <th className="bda-t-right" style={ { width: 90 } }>{ __( "Views", "betterdocs" ) }</th>
                        <th className="bda-t-right" style={ { width: 90 } }>{ __( "Unique", "betterdocs" ) }</th>
                        <th className="bda-t-right" style={ { width: 110 } }>{ __( "Helpful", "betterdocs" ) }</th>
                    </tr></thead>
                    <tbody>
                        { rows.map( ( r, i ) => (
                            <tr key={ i }>
                                <td><div className="bda-title-cell">{ r.t }</div></td>
                                <td className="bda-t-right bda-num bda-strong">{ fmt( r.v ) }</td>
                                <td className="bda-t-right bda-num">{ fmt( r.u ) }</td>
                                <td className="bda-t-right"><span className={ cn( "bda-badge", r.h >= 80 ? "green" : r.h >= 65 ? "amber" : "red" ) }>{ r.h }%</span></td>
                            </tr>
                        ) ) }
                    </tbody>
                </table>
            </Card>
        </div>
    );
}

/* ── Search Analytics ────────────────────────────────────────────────── */
export function SearchMock() {
    const zero = [
        { q: "export to pdf", n: 142 },
        { q: "white label branding", n: 98 },
        { q: "multi language docs", n: 76 },
        { q: "slack integration", n: 54 },
        { q: "api rate limits", n: 31 }
    ];
    return (
        <div className="bda-stack">
            <div className="bda-kpi-grid cols-3">
                <KpiCard label={ __( "Total Searches", "betterdocs" ) }   value="12.4K" spark={ wave( 400, 120 ) } delta={ 18.2 } dir={ 1 }  icon={ <I.Search size={ 14 } /> }      color="#00b884" />
                <KpiCard label={ __( "Unique Queries", "betterdocs" ) }   value="3.8K"  spark={ wave( 120, 40 ) }  delta={ 6.5 }  dir={ 1 }  icon={ <I.TrendingUp size={ 14 } /> }  color="#3B82F6" />
                <KpiCard label={ __( "Zero-Result Rate", "betterdocs" ) } value="9.7%"  spark={ wave( 40, 10 ) }   delta={ -4.1 } dir={ -1 } icon={ <I.AlertCircle size={ 14 } /> } color="#EF4444" />
            </div>
            <Card padded title={ __( "Searches vs. Zero-Results", "betterdocs" ) }>
                <AreaChart labels={ LABELS } height={ 220 } series={ [
                    { name: __( "Searches", "betterdocs" ),     data: wave( 420, 130 ), color: "#00b884" },
                    { name: __( "Zero-results", "betterdocs" ), data: wave( 70, 28 ),   color: "#EF4444" }
                ] } />
            </Card>
            <Card padded={ false } title={ __( "Top Zero-Result Queries", "betterdocs" ) }>
                <table className="bda-table">
                    <thead><tr><th>{ __( "Query", "betterdocs" ) }</th><th className="bda-t-right">{ __( "Searches", "betterdocs" ) }</th></tr></thead>
                    <tbody>
                        { zero.map( ( r, i ) => (
                            <tr key={ i }>
                                <td><span className="bda-strong" style={ { fontWeight: 500 } }>{ r.q }</span></td>
                                <td className="bda-t-right bda-num">{ fmt( r.n ) }</td>
                            </tr>
                        ) ) }
                    </tbody>
                </table>
            </Card>
        </div>
    );
}

/* ── Reader Engagement ───────────────────────────────────────────────── */
export function EngagementMock() {
    const countries = [
        { code: "US", v: 4280 }, { code: "GB", v: 2140 }, { code: "DE", v: 1620 },
        { code: "IN", v: 1390 }, { code: "CA", v: 980 }, { code: "AU", v: 720 }
    ];
    const langs = [ { l: "English (en)", p: 68 }, { l: "Spanish (es)", p: 12 }, { l: "German (de)", p: 9 }, { l: "French (fr)", p: 6 } ];
    return (
        <div className="bda-stack">
            <div className="bda-grid12">
                <div className="bda-col4">
                    <Card padded title={ __( "Devices", "betterdocs" ) }>
                        <div style={ { display: "flex", justifyContent: "center", padding: "8px 0" } }>
                            <Donut size={ 180 } thickness={ 26 } centerValue="62%" centerLabel={ __( "Desktop", "betterdocs" ) } segments={ [
                                { value: 62, color: "#00b884" }, { value: 30, color: "#3B82F6" }, { value: 8, color: "#F59E0B" }
                            ] } />
                        </div>
                    </Card>
                </div>
                <div className="bda-col8">
                    <Card padded title={ __( "Top Countries", "betterdocs" ) }>
                        <HBar items={ countries.map( ( c ) => ( { name: `${ countryFlag( c.code ) }  ${ c.code }`, value: c.v } ) ) } format={ fmt } />
                    </Card>
                    <Card padded title={ __( "Languages", "betterdocs" ) }>
                        <HBar items={ langs.map( ( x ) => ( { name: x.l, value: x.p } ) ) } max={ 100 } color="#3B82F6" format={ ( v ) => `${ v }%` } />
                    </Card>
                </div>
            </div>
        </div>
    );
}

/* ── Feedback Inbox ──────────────────────────────────────────────────── */
export function FeedbackMock() {
    const feed = [
        { f: "happy",   t: "Getting Started with BetterDocs", note: __( "Clear and to the point — solved my issue.", "betterdocs" ), d: "2026-05-28" },
        { f: "sad",     t: "Configuring Live Search",         note: __( "Couldn't find how to change the result limit.", "betterdocs" ), d: "2026-05-27" },
        { f: "comment", t: "Setting Up the FAQ Builder",      note: __( "Would love drag-and-drop reordering here.", "betterdocs" ), d: "2026-05-27" },
        { f: "happy",   t: "How to Create Your First KB",     note: __( "The screenshots made this really easy.", "betterdocs" ), d: "2026-05-26" },
        { f: "sad",     t: "Troubleshooting Permalinks",      note: __( "Still 404ing after flushing rewrites.", "betterdocs" ), d: "2026-05-25" }
    ];
    return (
        <div className="bda-stack">
            <div className="bda-kpi-grid cols-3">
                <KpiCard label={ __( "Likes", "betterdocs" ) }    value="1,284" delta={ 9.2 }  dir={ 1 }  icon={ <I.ThumbsUp size={ 14 } /> }      color="#00b884" />
                <KpiCard label={ __( "Dislikes", "betterdocs" ) } value="146"   delta={ -3.4 } dir={ -1 } icon={ <I.ThumbsDown size={ 14 } /> }    color="#EF4444" />
                <KpiCard label={ __( "Comments", "betterdocs" ) } value="372"   delta={ 14.0 } dir={ 1 }  icon={ <I.MessageCircle size={ 14 } /> } color="#3B82F6" />
            </div>
            <Card padded={ false } title={ __( "Recent Feedback", "betterdocs" ) }>
                <div className="bda-feed">
                    { feed.map( ( f, i ) => (
                        <div key={ i } className="bda-feed-row">
                            { feelingIcon( f.f ) }
                            <div style={ { minWidth: 0, flex: 1 } }>
                                <div className="bda-title-cell">{ f.t }</div>
                                <div style={ { fontSize: 12.5, color: "var(--text-color-850)", marginTop: 3 } }>{ f.note }</div>
                            </div>
                            <div style={ { fontSize: 11.5, color: "var(--text-color-500)", whiteSpace: "nowrap" } }>{ f.d }</div>
                        </div>
                    ) ) }
                </div>
            </Card>
        </div>
    );
}

/* ── Link Health ─────────────────────────────────────────────────────── */
export function LinksMock() {
    const links = [
        { u: "/docs/getting-started", l: "https://old.example.com/setup", s: 404 },
        { u: "/docs/live-search", l: "http://legacy.site/search-api", s: 301 },
        { u: "/docs/faq-builder", l: "https://cdn.broken.io/img/diagram.png", s: 404 },
        { u: "/docs/permalinks", l: "https://example.org/moved-page", s: 302 }
    ];
    const badge = ( s ) => s >= 400 ? "red" : "amber";
    return (
        <div className="bda-stack">
            <div className="bda-kpi-grid cols-3">
                <KpiCard label={ __( "Broken Links", "betterdocs" ) }  value="18" delta={ -22.0 } dir={ -1 } icon={ <I.AlertTriangle size={ 14 } /> } color="#EF4444" />
                <KpiCard label={ __( "Redirects", "betterdocs" ) }     value="42" delta={ 1.2 }   dir={ 1 }  icon={ <I.Link size={ 14 } /> }          color="#F59E0B" />
                <KpiCard label={ __( "Links Checked", "betterdocs" ) } value="1,906" delta={ 5.8 } dir={ 1 } icon={ <I.Check size={ 14 } /> }          color="#00b884" />
            </div>
            <Card padded={ false } title={ __( "Broken & Redirected Links", "betterdocs" ) }>
                <table className="bda-table bda-table--fixed">
                    <thead><tr>
                        <th>{ __( "Doc", "betterdocs" ) }</th>
                        <th>{ __( "Link", "betterdocs" ) }</th>
                        <th className="bda-t-right" style={ { width: 90 } }>{ __( "Status", "betterdocs" ) }</th>
                    </tr></thead>
                    <tbody>
                        { links.map( ( r, i ) => (
                            <tr key={ i }>
                                <td><div className="bda-title-cell">{ r.u }</div></td>
                                <td><div className="bda-title-cell" style={ { color: "var(--text-color-600)" } }>{ r.l }</div></td>
                                <td className="bda-t-right"><span className={ cn( "bda-badge", badge( r.s ) ) }>{ r.s }</span></td>
                            </tr>
                        ) ) }
                    </tbody>
                </table>
            </Card>
        </div>
    );
}

/* ── Author Performance ──────────────────────────────────────────────── */
export function AuthorsMock() {
    const authors = [
        { n: "Sarah Chen", a: 24, v: 18400, h: 91 },
        { n: "Marcus Reid", a: 18, v: 13250, h: 86 },
        { n: "Aisha Khan", a: 15, v: 9870, h: 83 },
        { n: "Tom Becker", a: 11, v: 6420, h: 74 }
    ];
    return (
        <div className="bda-stack">
            <Card padded={ false } title={ __( "Contribution & Reception", "betterdocs" ) }>
                <table className="bda-table bda-table--fixed">
                    <thead><tr>
                        <th>{ __( "Author", "betterdocs" ) }</th>
                        <th className="bda-t-right" style={ { width: 90 } }>{ __( "Docs", "betterdocs" ) }</th>
                        <th className="bda-t-right" style={ { width: 100 } }>{ __( "Views", "betterdocs" ) }</th>
                        <th className="bda-t-right" style={ { width: 110 } }>{ __( "Helpful", "betterdocs" ) }</th>
                    </tr></thead>
                    <tbody>
                        { authors.map( ( r, i ) => (
                            <tr key={ i }>
                                <td>
                                    <div style={ { display: "flex", alignItems: "center", gap: 10 } }>
                                        <Avatar author={ authorFromName( r.n ) } size={ 26 } />
                                        <span className="bda-strong">{ r.n }</span>
                                    </div>
                                </td>
                                <td className="bda-t-right bda-num">{ r.a }</td>
                                <td className="bda-t-right bda-num bda-strong">{ fmt( r.v ) }</td>
                                <td className="bda-t-right"><span className={ cn( "bda-badge", r.h >= 80 ? "green" : "amber" ) }>{ r.h }%</span></td>
                            </tr>
                        ) ) }
                    </tbody>
                </table>
            </Card>
        </div>
    );
}

/* ── AI Traffic ──────────────────────────────────────────────────────── */
export function AiTrafficMock() {
    const agents = [
        { n: "ChatGPT", v: 4820, c: "#10a37f" },
        { n: "Claude", v: 3110, c: "#d97757" },
        { n: "Perplexity", v: 2240, c: "#20808d" },
        { n: "Gemini", v: 1680, c: "#4285f4" },
        { n: "Bing AI", v: 940, c: "#0078d4" }
    ];
    const pages = [
        { t: "Getting Started with BetterDocs", a: "ChatGPT", f: 1840, h: 920 },
        { t: "How to Create Your First Knowledge Base", a: "Claude", f: 1320, h: 1510 },
        { t: "Configuring Live Search", a: "Perplexity", f: 980, h: 740 },
        { t: "Setting Up the FAQ Builder", a: "ChatGPT", f: 760, h: 1180 },
        { t: "Troubleshooting Permalink Issues", a: "Gemini", f: 540, h: 1320 }
    ];
    return (
        <div className="bda-stack">
            <div className="bda-kpi-grid">
                <KpiCard label={ __( "AI Fetches", "betterdocs" ) }     value="12.8K" spark={ wave( 380, 140 ) } delta={ 31.2 } dir={ 1 }  icon={ <I.TrendingUp size={ 14 } /> } color="#00b884" />
                <KpiCard label={ __( "AI Agents", "betterdocs" ) }      value="15"    spark={ wave( 12, 4 ) }    delta={ 25.0 } dir={ 1 }  icon={ <I.Users size={ 14 } /> }      color="#8B5CF6" />
                <KpiCard label={ __( "AI : Human", "betterdocs" ) }     value="0.45"  spark={ wave( 40, 12 ) }   delta={ 18.4 } dir={ 1 }  icon={ <I.PieChart size={ 14 } /> }   color="#3B82F6" />
                <KpiCard label={ __( "Visibility Score", "betterdocs" ) } value="87"  spark={ wave( 80, 6 ) }    delta={ 4.0 }  dir={ 1 }  icon={ <I.ChartLine size={ 14 } /> } color="#F59E0B" />
            </div>
            <div className="bda-grid12">
                <div className="bda-col4">
                    <Card padded title={ __( "Agent Distribution", "betterdocs" ) }>
                        <div style={ { display: "flex", justifyContent: "center", padding: "8px 0" } }>
                            <Donut size={ 180 } thickness={ 26 } centerValue="31%" centerLabel={ __( "AI share", "betterdocs" ) }
                                segments={ agents.map( ( a ) => ( { value: a.v, color: a.c } ) ) } />
                        </div>
                    </Card>
                </div>
                <div className="bda-col8">
                    <Card padded title={ __( "Top Agents", "betterdocs" ) }>
                        <HBar items={ agents.map( ( a ) => ( { name: a.n, value: a.v, color: a.c } ) ) } format={ fmt } />
                    </Card>
                </div>
            </div>
            <Card padded title={ __( "AI Traffic Over Time", "betterdocs" ) }>
                <AreaChart labels={ LABELS } height={ 220 } series={ [
                    { name: __( "Human visits", "betterdocs" ), data: wave( 980, 220 ), color: "#CBD5E1" },
                    { name: __( "AI fetches", "betterdocs" ),   data: wave( 420, 160 ), color: "#00b884" }
                ] } />
            </Card>
            <Card padded={ false } title={ __( "Most-Fetched Docs by AI", "betterdocs" ) }>
                <table className="bda-table bda-table--fixed">
                    <thead><tr>
                        <th>{ __( "Doc", "betterdocs" ) }</th>
                        <th style={ { width: 120 } }>{ __( "Top agent", "betterdocs" ) }</th>
                        <th className="bda-t-right" style={ { width: 100 } }>{ __( "AI fetches", "betterdocs" ) }</th>
                        <th className="bda-t-right" style={ { width: 90 } }>{ __( "Human", "betterdocs" ) }</th>
                    </tr></thead>
                    <tbody>
                        { pages.map( ( r, i ) => (
                            <tr key={ i }>
                                <td><div className="bda-title-cell">{ r.t }</div></td>
                                <td><span className="bda-strong" style={ { fontWeight: 500 } }>{ r.a }</span></td>
                                <td className="bda-t-right bda-num bda-strong">{ fmt( r.f ) }</td>
                                <td className="bda-t-right bda-num">{ fmt( r.h ) }</td>
                            </tr>
                        ) ) }
                    </tbody>
                </table>
            </Card>
        </div>
    );
}

/* ── Analytics Settings ──────────────────────────────────────────────── */
function MockToggle( { on } ) {
    return (
        <span className={ cn( "bda-mock-toggle", on && "on" ) }><span className="bda-mock-knob" /></span>
    );
}
export function SettingsMock() {
    const rows = [
        { l: __( "Cookieless tracking", "betterdocs" ),       d: __( "Measure visits without setting cookies.", "betterdocs" ), on: true },
        { l: __( "MaxMind GeoIP", "betterdocs" ),             d: __( "Resolve reader country from IP.", "betterdocs" ), on: true },
        { l: __( "GA4 forwarding", "betterdocs" ),            d: __( "Mirror events to Google Analytics 4.", "betterdocs" ), on: false },
        { l: __( "Bot exclusion", "betterdocs" ),             d: __( "Filter known crawlers from analytics.", "betterdocs" ), on: true }
    ];
    return (
        <div className="bda-stack">
            <Card padded title={ __( "Privacy & Integrations", "betterdocs" ) }>
                <div style={ { display: "flex", flexDirection: "column" } }>
                    { rows.map( ( r, i ) => (
                        <div key={ i } className="bda-mock-setting">
                            <div style={ { minWidth: 0 } }>
                                <div className="bda-strong" style={ { fontSize: 13.5 } }>{ r.l }</div>
                                <div style={ { fontSize: 12.5, color: "var(--text-color-600)", marginTop: 2 } }>{ r.d }</div>
                            </div>
                            <MockToggle on={ r.on } />
                        </div>
                    ) ) }
                    <div className="bda-mock-setting">
                        <div style={ { minWidth: 0 } }>
                            <div className="bda-strong" style={ { fontSize: 13.5 } }>{ __( "Data retention", "betterdocs" ) }</div>
                            <div style={ { fontSize: 12.5, color: "var(--text-color-600)", marginTop: 2 } }>{ __( "How long to keep raw analytics events.", "betterdocs" ) }</div>
                        </div>
                        <span className="bda-badge slate">{ __( "365 days", "betterdocs" ) }</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}
