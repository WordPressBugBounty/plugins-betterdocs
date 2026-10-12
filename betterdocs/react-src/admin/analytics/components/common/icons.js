import React from "react";

/* Icon library ported from the design (lucide-style, 1.75 stroke). */
const ico = ( path ) => function Icon( { size = 16, className = "", strokeWidth = 1.75, ...rest } ) {
    return (
        <svg width={ size } height={ size } viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={ strokeWidth } strokeLinecap="round" strokeLinejoin="round" className={ className } { ...rest }>
            { path }
        </svg>
    );
};

export const I = {
    Home: ico( <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></> ),
    Article: ico( <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></> ),
    Search: ico( <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></> ),
    Users: ico( <><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.5" /><path d="M21 19c0-2.2-1.8-4-4-4" /></> ),
    Inbox: ico( <><path d="M3 13l3-7h12l3 7" /><path d="M3 13v6h18v-6" /><path d="M3 13h5l1.5 2.5h5L16 13h5" /></> ),
    Link: ico( <><path d="M10 13a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 11a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1-1" /></> ),
    Pen: ico( <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></> ),
    Settings: ico( <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></> ),
    Calendar: ico( <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></> ),
    ChevronDown: ico( <path d="m6 9 6 6 6-6" /> ),
    ChevronUp: ico( <path d="m18 15-6-6-6 6" /> ),
    ChevronRight: ico( <path d="m9 6 6 6-6 6" /> ),
    ChevronLeft: ico( <path d="m15 6-6 6 6 6" /> ),
    ArrowUp: ico( <><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></> ),
    ArrowDown: ico( <><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></> ),
    ArrowRight: ico( <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></> ),
    ArrowUpRight: ico( <><path d="M7 17 17 7" /><path d="M7 7h10v10" /></> ),
    Download: ico( <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></> ),
    Sparkle: ico( <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></> ),
    X: ico( <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></> ),
    Eye: ico( <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></> ),
    Clock: ico( <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></> ),
    ThumbsUp: ico( <path d="M7 22V11M2 11h5v11H2zM18.5 22h-9V11l5-9a2 2 0 0 1 2 2v5h4.5a2 2 0 0 1 2 2.3l-1 7a2 2 0 0 1-2 1.7z" /> ),
    ThumbsDown: ico( <path d="M17 2v11M22 13h-5V2h5zM5.5 2h9v11l-5 9a2 2 0 0 1-2-2v-5H3a2 2 0 0 1-2-2.3l1-7a2 2 0 0 1 2-1.7z" /> ),
    MessageCircle: ico( <path d="M21 12a8 8 0 1 1-3-6.2L21 4l-1 4.5A8 8 0 0 1 21 12z" /> ),
    Globe: ico( <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" /></> ),
    Monitor: ico( <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></> ),
    Phone: ico( <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></> ),
    Tablet: ico( <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M11 18h2" /></> ),
    Check: ico( <path d="M20 6 9 17l-5-5" /> ),
    RefreshCw: ico( <><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></> ),
    ExternalLink: ico( <><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /></> ),
    Sun: ico( <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></> ),
    Moon: ico( <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /> ),
    AlertTriangle: ico( <><path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></> ),
    AlertCircle: ico( <><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></> ),
    TrendingUp: ico( <><path d="m3 17 6-6 4 4 8-8" /><path d="M14 7h7v7" /></> ),
    Trash: ico( <><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="m6 6 1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" /></> ),
    Pin: ico( <><circle cx="12" cy="10" r="3" /><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" /></> ),
    Lock: ico( <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></> ),
    PieChart: ico( <><path d="M21 12A9 9 0 1 1 12 3v9z" /><path d="M21 12A9 9 0 0 0 12 3" /></> ),
    ChartLine: ico( <><path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 5-6" /></> )
};
