import React from "react";
import { __ } from "@wordpress/i18n";
import { I } from "./icons";
import { Sparkline } from "./charts";

export function cn( ...c ) { return c.filter( Boolean ).join( " " ); }

export const fmt = ( n ) => ( Number( n ) || 0 ).toLocaleString();
export const fmtCompact = ( n ) => {
    n = Number( n ) || 0;
    if ( n < 1000 ) return String( n );
    for ( const u of [ { v: 1e9, s: "B" }, { v: 1e6, s: "M" }, { v: 1e3, s: "K" } ] ) {
        if ( n >= u.v ) return ( n / u.v ).toFixed( n % u.v === 0 ? 0 : 1 ).replace( /\.0$/, "" ) + u.s;
    }
    return String( n );
};

export function Btn( { kind = "ghost", size = "md", icon, children, className, ...rest } ) {
    return (
        <button className={ cn( "bda-btn", kind, size === "sm" && "sm", className ) } { ...rest }>
            { icon }{ children }
        </button>
    );
}

export function Badge( { children, color = "slate", className } ) {
    return <span className={ cn( "bda-badge", color, className ) }>{ children }</span>;
}

/* Design-system "Pro" badge — same markup quickbuilder renders in Settings
   (crown glyph from the betterdocs `btd-icon` font + amber tokens). */
export function ProBadge( { className } ) {
    return (
        <span className={ cn( "wprf-badge", className ) }>
            <span className="wprf-badge-icon"><i className="btd-icon btd-crown" /></span>
            <span className="wprf-badge-item">{ __( "Pro", "betterdocs" ) }</span>
        </span>
    );
}

export function Card( { children, className, title, action, padded = true } ) {
    return (
        <div className={ cn( "bda-card", className ) }>
            { ( title || action ) && (
                <div className="bda-card-head">
                    { typeof title === "string" ? <h3 className="bda-card-title">{ title }</h3> : title }
                    { action }
                </div>
            ) }
            <div className={ padded ? "bda-card-body" : "bda-card-body flush" }>{ children }</div>
        </div>
    );
}

export function Avatar( { author, size = 24 } ) {
    if ( ! author ) return null;
    return (
        <span className="bda-avatar" style={ { width: size, height: size, fontSize: Math.max( 9, size * 0.42 ), background: `hsl(${ author.hue }, 62%, 50%)` } }>
            { author.initials }
        </span>
    );
}

export function Trend( { value, suffix = "%" } ) {
    if ( value == null ) return null;
    const up = value >= 0;
    return (
        <span className={ cn( "bda-trend", up ? "up" : "down" ) }>
            { up ? <I.ArrowUp size={ 11 } strokeWidth={ 2.5 } /> : <I.ArrowDown size={ 11 } strokeWidth={ 2.5 } /> }
            { Math.abs( value ).toFixed( 1 ) }{ suffix }
        </span>
    );
}

export function HelpBar( { score } ) {
    const color = score >= 80 ? "#00b884" : score >= 60 ? "#F59E0B" : "#EF4444";
    return (
        <div className="bda-helpbar">
            <div className="bda-helpbar-track"><div className="bda-helpbar-fill" style={ { width: `${ score }%`, background: color } } /></div>
            <div className="bda-helpbar-val">{ score }%</div>
        </div>
    );
}

export function KpiCard( { label, value, spark, color = "#00b884", icon, delta, dir } ) {
    const up = dir > 0;
    return (
        <div className="bda-kpi">
            <div className="bda-kpi-top">
                <div className="bda-kpi-label">{ label }</div>
                { icon && <div className="bda-kpi-ico" style={ { background: color + "1A", color } }>{ icon }</div> }
            </div>
            <div className="bda-kpi-row">
                <div>
                    <div className="bda-kpi-value">{ value }</div>
                    { delta != null && (
                        <div className={ cn( "bda-trend", up ? "up" : "down" ) } style={ { marginTop: 8 } }>
                            { up ? <I.ArrowUp size={ 12 } strokeWidth={ 2.5 } /> : <I.ArrowDown size={ 12 } strokeWidth={ 2.5 } /> }
                            <span>{ Math.abs( delta ).toFixed( 1 ) }%</span>
                            <span style={ { color: "var(--text-color-500)", fontWeight: 400, marginLeft: 4 } }>vs prev</span>
                        </div>
                    ) }
                </div>
                { spark && <Sparkline points={ spark } color={ color } width={ 92 } height={ 36 } /> }
            </div>
        </div>
    );
}

export function Dropdown( { label, value, options, onChange, icon, align = "left", minWidth = 180 } ) {
    const [ open, setOpen ] = React.useState( false );
    const ref = React.useRef( null );
    React.useEffect( () => {
        const h = ( e ) => { if ( ref.current && ! ref.current.contains( e.target ) ) setOpen( false ); };
        document.addEventListener( "mousedown", h );
        return () => document.removeEventListener( "mousedown", h );
    }, [] );
    const selected = options.find( ( o ) => o.value === value ) || options[ 0 ];
    return (
        <div ref={ ref } className="bda-dd">
            <button className="bda-dd-btn" onClick={ () => setOpen( ( o ) => ! o ) }>
                { icon }
                { label && <span className="lbl">{ label }:</span> }
                <span className="val">{ selected?.label }</span>
                <I.ChevronDown size={ 14 } style={ { color: "var(--text-color-500)" } } />
            </button>
            { open && (
                <div className={ cn( "bda-dd-menu", align === "right" && "right" ) } style={ { minWidth } }>
                    { options.map( ( o ) => (
                        <button key={ o.value } className={ cn( "bda-dd-opt", o.value === value && "sel" ) }
                            onClick={ () => { onChange( o.value ); setOpen( false ); } }>
                            <span>{ o.label }</span>
                            { o.value === value && <I.Check size={ 14 } style={ { color: "#00b884" } } /> }
                        </button>
                    ) ) }
                </div>
            ) }
        </div>
    );
}

const DATE_PRESETS = [
    { value: "7", label: __( "Last 7 days", "betterdocs" ) },
    { value: "14", label: __( "Last 14 days", "betterdocs" ) },
    { value: "30", label: __( "Last 30 days", "betterdocs" ) }
];
export function DateRange( { value, onChange } ) {
    return <Dropdown icon={ <I.Calendar size={ 14 } style={ { color: "var(--text-color-600)" } } /> } value={ String( value ) } options={ DATE_PRESETS } onChange={ ( v ) => onChange( parseInt( v, 10 ) ) } minWidth={ 170 } />;
}

export function Pagination( { page, totalPages, onPage, perPage = 20, total } ) {
    if ( totalPages <= 1 ) return (
        <div className="bda-pag"><div className="bda-pag-info">{ total } { __( "items", "betterdocs" ) }</div></div>
    );
    const pages = [];
    for ( let i = 1; i <= totalPages; i++ ) {
        if ( i === 1 || i === totalPages || Math.abs( i - page ) <= 1 ) pages.push( i );
        else if ( pages[ pages.length - 1 ] !== "…" ) pages.push( "…" );
    }
    return (
        <div className="bda-pag">
            <div className="bda-pag-info">
                { __( "Showing", "betterdocs" ) } <b>{ ( page - 1 ) * perPage + 1 }–{ Math.min( page * perPage, total ) }</b> { __( "of", "betterdocs" ) } <b>{ total }</b>
            </div>
            <div className="bda-pag-btns">
                <button disabled={ page <= 1 } onClick={ () => onPage( page - 1 ) }><I.ChevronLeft size={ 16 } /></button>
                { pages.map( ( p, i ) => p === "…"
                    ? <span key={ i } style={ { width: 32, textAlign: "center", color: "var(--text-color-500)" } }>…</span>
                    : <button key={ i } className={ p === page ? "cur" : "" } onClick={ () => onPage( p ) }>{ p }</button> ) }
                <button disabled={ page >= totalPages } onClick={ () => onPage( page + 1 ) }><I.ChevronRight size={ 16 } /></button>
            </div>
        </div>
    );
}

/* ── Empty / error / loading states (Claude design "States gallery") ──
   illustration: "data" | "search" | "error" */
export function EmptyArt( { kind = "data" } ) {
    if ( kind === "search" ) {
        return (
            <svg width="120" height="100" viewBox="0 0 120 100" fill="none" aria-hidden="true">
                <ellipse cx="60" cy="92" rx="44" ry="4" fill="#EDF0F3" />
                <rect x="22" y="20" width="60" height="58" rx="6" fill="#fff" stroke="#d1fadf" strokeWidth="1.5" />
                <rect x="30" y="32" width="44" height="2.5" rx="1.25" fill="#d1fadf" />
                <rect x="30" y="40" width="32" height="2.5" rx="1.25" fill="#EDF0F3" />
                <rect x="30" y="48" width="36" height="2.5" rx="1.25" fill="#EDF0F3" />
                <circle cx="84" cy="62" r="14" fill="#fff" stroke="#00b884" strokeWidth="2.5" />
                <line x1="94" y1="72" x2="104" y2="82" stroke="#00b884" strokeWidth="3" strokeLinecap="round" />
            </svg>
        );
    }
    if ( kind === "error" ) {
        return (
            <svg width="120" height="100" viewBox="0 0 120 100" fill="none" aria-hidden="true">
                <ellipse cx="60" cy="92" rx="44" ry="4" fill="#FEE2E2" />
                <path d="M60 20 L96 80 H24 Z" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" strokeLinejoin="round" />
                <line x1="60" y1="40" x2="60" y2="60" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
                <circle cx="60" cy="70" r="2.5" fill="#EF4444" />
            </svg>
        );
    }
    return (
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" aria-hidden="true">
            <ellipse cx="60" cy="92" rx="44" ry="4" fill="#EDF0F3" />
            <rect x="22" y="22" width="76" height="58" rx="8" fill="#fff" stroke="#d1fadf" strokeWidth="1.5" />
            <path d="M30 66 L42 54 L52 62 L66 46 L78 56 L90 44" stroke="#00b884" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="42" cy="54" r="2.5" fill="#00b884" /><circle cx="52" cy="62" r="2.5" fill="#00b884" />
            <circle cx="66" cy="46" r="2.5" fill="#00b884" /><circle cx="78" cy="56" r="2.5" fill="#00b884" /><circle cx="90" cy="44" r="2.5" fill="#00b884" />
            <rect x="30" y="30" width="22" height="3" rx="1.5" fill="#d1fadf" />
            <rect x="30" y="36" width="14" height="2.5" rx="1.25" fill="#EDF0F3" />
        </svg>
    );
}

export function EmptyState( { illustration = "data", title, subtitle, actionLabel, onAction } ) {
    return (
        <div className="bda-empty">
            <EmptyArt kind={ illustration } />
            <h3>{ title }</h3>
            { subtitle && <p>{ subtitle }</p> }
            { actionLabel && (
                <button className="bda-empty-action" onClick={ onAction }>
                    { actionLabel } <I.ArrowRight size={ 13 } />
                </button>
            ) }
        </div>
    );
}

export function ErrorState( { title, subtitle, code, onRetry } ) {
    return (
        <div className="bda-empty">
            <EmptyArt kind="error" />
            <h3>{ title || __( "Couldn't load this section", "betterdocs" ) }</h3>
            <p>{ subtitle || __( "We hit a snag fetching this data. This is usually temporary — try again, or check that the analytics service is reachable.", "betterdocs" ) }</p>
            { onRetry && (
                <div className="bda-empty-actions">
                    <button className="bda-btn primary" onClick={ onRetry }><I.RefreshCw size={ 13 } />{ __( "Try again", "betterdocs" ) }</button>
                </div>
            ) }
            { code && <code className="bda-empty-code">{ code }</code> }
        </div>
    );
}

export function SkeletonLine( { w = "100%", h = 10, className, style } ) {
    return <div className={ cn( "bda-skel", className ) } style={ { width: w, height: h, ...style } } />;
}

export function KpiSkeleton() {
    return (
        <div className="bda-kpi">
            <SkeletonLine w="50%" h={ 10 } style={ { marginBottom: 12 } } />
            <div className="bda-kpi-row">
                <div>
                    <SkeletonLine w={ 120 } h={ 26 } style={ { marginBottom: 8 } } />
                    <SkeletonLine w={ 80 } h={ 10 } />
                </div>
                <SkeletonLine w={ 90 } h={ 36 } />
            </div>
        </div>
    );
}

export function TableRowSkeleton( { cols = 6 } ) {
    return (
        <tr>
            { Array.from( { length: cols } ).map( ( _, i ) => (
                <td key={ i }><SkeletonLine w={ i === 0 ? "70%" : "55%" } h={ 10 } /></td>
            ) ) }
        </tr>
    );
}

export function Skeleton( { lines = 4 } ) {
    return (
        <div style={ { display: "flex", flexDirection: "column", gap: 12, padding: 8 } }>
            { Array.from( { length: lines } ).map( ( _, i ) => (
                <SkeletonLine key={ i } h={ 12 } w={ i === 0 ? "70%" : "100%" } />
            ) ) }
        </div>
    );
}

/* Deterministic avatar descriptor from a name. */
export function authorFromName( name ) {
    const n = String( name || "?" ).trim();
    let hue = 0;
    for ( let i = 0; i < n.length; i++ ) hue = ( hue * 31 + n.charCodeAt( i ) ) % 360;
    const initials = n.split( /\s+/ ).slice( 0, 2 ).map( ( p ) => p[ 0 ] || "" ).join( "" ).toUpperCase() || "?";
    return { hue, initials, name: n };
}
