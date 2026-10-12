/* Country + language helpers used by the Reader Engagement view.
   Country codes are ISO-3166 alpha-2; flag emoji is built from the regional
   indicator code points so we never have to ship a flag-name dictionary. */

const REGIONAL_INDICATOR_A = 0x1F1E6;

export function countryFlag( code ) {
    if ( ! code || code.length !== 2 ) return "🏳";
    const a = code.toUpperCase().charCodeAt( 0 ) - 65;
    const b = code.toUpperCase().charCodeAt( 1 ) - 65;
    if ( a < 0 || a > 25 || b < 0 || b > 25 ) return "🏳";
    return String.fromCodePoint( REGIONAL_INDICATOR_A + a, REGIONAL_INDICATOR_A + b );
}

/* Centroid approximations (lat/lng) for ~60 common analytics countries — enough
   for the world-map bubble overlay. Codes outside this set fall back to a
   nullable centroid (skipped on the map, still listed). */
export const COUNTRY_DB = {
    US: { name: "United States", lat: 38, lng: -97 },
    IN: { name: "India", lat: 22, lng: 78 },
    GB: { name: "United Kingdom", lat: 54, lng: -2 },
    DE: { name: "Germany", lat: 51, lng: 10 },
    BR: { name: "Brazil", lat: -14, lng: -51 },
    FR: { name: "France", lat: 46, lng: 2 },
    CA: { name: "Canada", lat: 56, lng: -106 },
    AU: { name: "Australia", lat: -25, lng: 133 },
    JP: { name: "Japan", lat: 36, lng: 138 },
    ES: { name: "Spain", lat: 40, lng: -3 },
    NL: { name: "Netherlands", lat: 52, lng: 5 },
    SG: { name: "Singapore", lat: 1.4, lng: 103.8 },
    IT: { name: "Italy", lat: 42, lng: 12 },
    SE: { name: "Sweden", lat: 60, lng: 18 },
    NO: { name: "Norway", lat: 61, lng: 8 },
    DK: { name: "Denmark", lat: 56, lng: 10 },
    FI: { name: "Finland", lat: 64, lng: 26 },
    PL: { name: "Poland", lat: 52, lng: 20 },
    IE: { name: "Ireland", lat: 53, lng: -8 },
    BE: { name: "Belgium", lat: 50.5, lng: 4.5 },
    CH: { name: "Switzerland", lat: 47, lng: 8 },
    AT: { name: "Austria", lat: 47.5, lng: 14 },
    PT: { name: "Portugal", lat: 39.5, lng: -8 },
    GR: { name: "Greece", lat: 39, lng: 22 },
    TR: { name: "Turkey", lat: 39, lng: 35 },
    RU: { name: "Russia", lat: 62, lng: 95 },
    UA: { name: "Ukraine", lat: 49, lng: 32 },
    CZ: { name: "Czechia", lat: 50, lng: 15 },
    RO: { name: "Romania", lat: 46, lng: 25 },
    HU: { name: "Hungary", lat: 47, lng: 19 },
    BG: { name: "Bulgaria", lat: 43, lng: 25 },
    ZA: { name: "South Africa", lat: -30, lng: 25 },
    NG: { name: "Nigeria", lat: 10, lng: 8 },
    EG: { name: "Egypt", lat: 26, lng: 30 },
    KE: { name: "Kenya", lat: -1, lng: 38 },
    MA: { name: "Morocco", lat: 32, lng: -7 },
    CN: { name: "China", lat: 35, lng: 105 },
    KR: { name: "South Korea", lat: 36, lng: 128 },
    TW: { name: "Taiwan", lat: 24, lng: 121 },
    HK: { name: "Hong Kong", lat: 22.3, lng: 114.2 },
    ID: { name: "Indonesia", lat: -2, lng: 118 },
    TH: { name: "Thailand", lat: 15, lng: 101 },
    VN: { name: "Vietnam", lat: 16, lng: 108 },
    MY: { name: "Malaysia", lat: 4, lng: 102 },
    PH: { name: "Philippines", lat: 13, lng: 122 },
    PK: { name: "Pakistan", lat: 30, lng: 70 },
    BD: { name: "Bangladesh", lat: 24, lng: 90 },
    LK: { name: "Sri Lanka", lat: 7, lng: 81 },
    IR: { name: "Iran", lat: 32, lng: 53 },
    IL: { name: "Israel", lat: 31, lng: 35 },
    AE: { name: "United Arab Emirates", lat: 24, lng: 54 },
    SA: { name: "Saudi Arabia", lat: 24, lng: 45 },
    MX: { name: "Mexico", lat: 23, lng: -102 },
    AR: { name: "Argentina", lat: -38, lng: -64 },
    CL: { name: "Chile", lat: -36, lng: -71 },
    CO: { name: "Colombia", lat: 4, lng: -72 },
    PE: { name: "Peru", lat: -10, lng: -75 },
    VE: { name: "Venezuela", lat: 7, lng: -66 },
    NZ: { name: "New Zealand", lat: -42, lng: 173 }
};

export function countryName( code ) {
    if ( ! code ) return "";
    const upper = code.toUpperCase();
    if ( COUNTRY_DB[ upper ] ) return COUNTRY_DB[ upper ].name;
    // Browser fallback for codes outside our short table.
    try {
        const n = new Intl.DisplayNames( [ "en" ], { type: "region" } ).of( upper );
        return n && n !== upper ? n : upper;
    } catch ( e ) { return upper; }
}

/* Language full name + code label — "English (en)", "Deutsch (de)", etc.
   Uses the browser's Intl.DisplayNames; falls back to a short list, then the
   raw code so we always render something readable. */
const LANG_FALLBACK = {
    en: "English", es: "Spanish", fr: "French", de: "German", it: "Italian",
    pt: "Portuguese", nl: "Dutch", sv: "Swedish", no: "Norwegian", da: "Danish",
    fi: "Finnish", pl: "Polish", ru: "Russian", uk: "Ukrainian", cs: "Czech",
    el: "Greek", tr: "Turkish", ar: "Arabic", he: "Hebrew", hi: "Hindi",
    bn: "Bangla", ja: "Japanese", ko: "Korean", zh: "Chinese", id: "Indonesian",
    th: "Thai", vi: "Vietnamese"
};

export function languageName( code ) {
    if ( ! code ) return "—";
    const lower = String( code ).toLowerCase().replace( /[_].*$/, "" ).slice( 0, 5 );
    try {
        const n = new Intl.DisplayNames( [ "en" ], { type: "language" } ).of( lower );
        if ( n && n.toLowerCase() !== lower ) return `${ n } (${ lower })`;
    } catch ( e ) {}
    const root = lower.split( "-" )[ 0 ];
    if ( LANG_FALLBACK[ root ] ) return `${ LANG_FALLBACK[ root ] } (${ lower })`;
    return lower;
}

/* Client-side CSV download — assemble + trigger via a transient blob URL. */
export function downloadCsv( filename, rows ) {
    if ( ! rows || ! rows.length ) return;
    const esc = ( v ) => {
        const s = String( v == null ? "" : v );
        return /[",\n]/.test( s ) ? `"${ s.replace( /"/g, '""' ) }"` : s;
    };
    const csv = rows.map( ( r ) => r.map( esc ).join( "," ) ).join( "\n" );
    const blob = new Blob( [ csv ], { type: "text/csv;charset=utf-8" } );
    const url = URL.createObjectURL( blob );
    const a = document.createElement( "a" );
    a.href = url; a.download = filename;
    document.body.appendChild( a ); a.click(); a.remove();
    setTimeout( () => URL.revokeObjectURL( url ), 1000 );
}
