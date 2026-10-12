import React from "react";

/* Pure-SVG chart primitives ported from the design. */

export function Sparkline( { points, color = "#00b884", width = 100, height = 28, filled = true, strokeWidth = 1.5 } ) {
    if ( ! points || points.length < 2 ) return null;
    const max = Math.max( ...points ), min = Math.min( ...points ), range = max - min || 1;
    const stepX = width / ( points.length - 1 );
    const yOf = ( v ) => height - 2 - ( ( v - min ) / range ) * ( height - 4 );
    const d = points.map( ( v, i ) => `${ i === 0 ? "M" : "L" }${ i * stepX },${ yOf( v ) }` ).join( " " );
    const id = React.useId();
    return (
        <svg width={ width } height={ height } viewBox={ `0 0 ${ width } ${ height }` } preserveAspectRatio="none">
            { filled && (
                <>
                    <defs>
                        <linearGradient id={ id } x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={ color } stopOpacity="0.25" />
                            <stop offset="100%" stopColor={ color } stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={ `${ d } L${ width },${ height } L0,${ height } Z` } fill={ `url(#${ id })` } />
                </>
            ) }
            <path d={ d } fill="none" stroke={ color } strokeWidth={ strokeWidth } strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function AreaChart( { series, labels, height = 240, colors, formatY = ( v ) => v } ) {
    const ref = React.useRef( null );
    const [ w, setW ] = React.useState( 800 );
    const baseId = React.useId().replace( /:/g, "" );
    React.useEffect( () => {
        if ( ! ref.current ) return;
        const ro = new ResizeObserver( ( entries ) => setW( entries[ 0 ].contentRect.width ) );
        ro.observe( ref.current );
        return () => ro.disconnect();
    }, [] );

    const padL = 44, padR = 16, padT = 12, padB = 28;
    const innerW = Math.max( 100, w - padL - padR );
    const innerH = height - padT - padB;
    const allValues = series.flatMap( ( s ) => s.data );
    const max = Math.max( ...allValues, 1 );
    const pow = Math.pow( 10, Math.floor( Math.log10( max ) ) );
    const niceMax = Math.ceil( max / pow ) * pow;
    const yMax = Math.max( niceMax, max * 1.1 );
    const xOf = ( i ) => padL + ( i / Math.max( 1, labels.length - 1 ) ) * innerW;
    const yOf = ( v ) => padT + innerH - ( v / yMax ) * innerH;
    const yTicks = 4;
    const ticks = Array.from( { length: yTicks + 1 }, ( _, i ) => ( yMax / yTicks ) * i );
    const xTickStep = Math.max( 1, Math.ceil( labels.length / 8 ) );
    const [ hover, setHover ] = React.useState( null );

    return (
        <div ref={ ref } style={ { width: "100%", position: "relative" } }>
            <svg width={ w } height={ height } style={ { display: "block" } }
                onMouseLeave={ () => setHover( null ) }
                onMouseMove={ ( e ) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const i = Math.round( ( ( e.clientX - rect.left - padL ) / innerW ) * ( labels.length - 1 ) );
                    setHover( i >= 0 && i < labels.length ? i : null );
                } }>
                { ticks.map( ( t, i ) => (
                    <g key={ i }>
                        <line x1={ padL } x2={ padL + innerW } y1={ yOf( t ) } y2={ yOf( t ) } stroke="#EDF0F3" strokeWidth="1" />
                        <text x={ padL - 8 } y={ yOf( t ) + 4 } textAnchor="end" fontSize="11" fill="#94A3B8">{ formatY( Math.round( t ) ) }</text>
                    </g>
                ) ) }
                { labels.map( ( l, i ) => ( i % xTickStep === 0 || i === labels.length - 1 ) ? (
                    <text key={ i } x={ xOf( i ) } y={ height - 8 } textAnchor="middle" fontSize="11" fill="#94A3B8">{ l }</text>
                ) : null ) }
                { series.map( ( s, si ) => {
                    const color = s.color || colors?.[ si ] || "#00b884";
                    const d = s.data.map( ( v, i ) => `${ i === 0 ? "M" : "L" }${ xOf( i ) },${ yOf( v ) }` ).join( " " );
                    const area = `${ d } L${ xOf( s.data.length - 1 ) },${ padT + innerH } L${ xOf( 0 ) },${ padT + innerH } Z`;
                    const gid = `g${ baseId }${ si }`;
                    return (
                        <g key={ si }>
                            <defs>
                                <linearGradient id={ gid } x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={ color } stopOpacity="0.20" />
                                    <stop offset="100%" stopColor={ color } stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d={ area } fill={ `url(#${ gid })` } />
                            <path d={ d } fill="none" stroke={ color } strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                    );
                } ) }
                { hover !== null && (
                    <g>
                        <line x1={ xOf( hover ) } x2={ xOf( hover ) } y1={ padT } y2={ padT + innerH } stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
                        { series.map( ( s, si ) => (
                            <circle key={ si } cx={ xOf( hover ) } cy={ yOf( s.data[ hover ] ) } r="4" fill="#fff" stroke={ s.color || colors?.[ si ] || "#00b884" } strokeWidth="2" />
                        ) ) }
                    </g>
                ) }
            </svg>
            { hover !== null && (
                <div style={ {
                    position: "absolute", pointerEvents: "none", background: "#0f172a", color: "#fff",
                    fontSize: "12px", borderRadius: "8px", padding: "8px 12px", boxShadow: "0 8px 24px rgba(0,0,0,.2)",
                    left: `${ Math.max( 8, Math.min( w - 200, xOf( hover ) - 90 ) ) }px`, top: `${ padT }px`, minWidth: "160px"
                } }>
                    <div style={ { color: "#cbd5e1", marginBottom: "6px" } }>{ labels[ hover ] }</div>
                    { series.map( ( s, si ) => (
                        <div key={ si } style={ { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" } }>
                            <span style={ { display: "flex", alignItems: "center", gap: "6px" } }>
                                <span style={ { width: 8, height: 8, borderRadius: 9999, background: s.color || colors?.[ si ] || "#00b884" } } />
                                <span style={ { color: "#e2e8f0" } }>{ s.name }</span>
                            </span>
                            <span style={ { fontWeight: 600, fontVariantNumeric: "tabular-nums" } }>{ formatY( s.data[ hover ] ) }</span>
                        </div>
                    ) ) }
                </div>
            ) }
        </div>
    );
}

export function Donut( { segments, size = 180, thickness = 26, centerLabel, centerValue } ) {
    const cx = size / 2, cy = size / 2, r = ( size - thickness ) / 2;
    const total = segments.reduce( ( s, x ) => s + x.value, 0 ) || 1;
    let acc = 0;
    const arcs = segments.map( ( seg ) => {
        const start = ( acc / total ) * Math.PI * 2 - Math.PI / 2;
        acc += seg.value;
        const end = ( acc / total ) * Math.PI * 2 - Math.PI / 2;
        const large = end - start > Math.PI ? 1 : 0;
        return {
            d: `M${ cx + Math.cos( start ) * r },${ cy + Math.sin( start ) * r } A${ r },${ r } 0 ${ large } 1 ${ cx + Math.cos( end ) * r },${ cy + Math.sin( end ) * r }`,
            color: seg.color
        };
    } );
    return (
        <svg width={ size } height={ size } style={ { flexShrink: 0 } }>
            <circle cx={ cx } cy={ cy } r={ r } fill="none" stroke="#F1F5F9" strokeWidth={ thickness } />
            { arcs.map( ( a, i ) => <path key={ i } d={ a.d } fill="none" stroke={ a.color } strokeWidth={ thickness } /> ) }
            { centerValue != null && (
                <>
                    <text x={ cx } y={ cy - 4 } textAnchor="middle" fontSize="22" fontWeight="700" fill="#0F172A">{ centerValue }</text>
                    <text x={ cx } y={ cy + 16 } textAnchor="middle" fontSize="11" fill="#64748B">{ centerLabel }</text>
                </>
            ) }
        </svg>
    );
}

export function HBar( { items, max, color = "#00b884", format = ( v ) => v } ) {
    const m = max || Math.max( ...items.map( ( i ) => i.value ), 1 );
    return (
        <div className="bda-hbar">
            { items.map( ( it, i ) => (
                <div key={ i } className="bda-hbar-row">
                    <div className="bda-hbar-name">{ it.name }</div>
                    <div className="bda-hbar-track"><div className="bda-hbar-fill" style={ { width: `${ ( it.value / m ) * 100 }%`, background: it.color || color } } /></div>
                    <div className="bda-hbar-val">{ format( it.value ) }</div>
                </div>
            ) ) }
        </div>
    );
}

