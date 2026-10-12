import React from "react";

/* Inline SVG icons for the Sample Docs flow — ported from the design mockup,
   stroke 1.7, currentColor so they inherit color from CSS. */

export const Sparkle = ({ size = 15, sw = 1.6 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.6 4.6L18 9l-4.4 1.4L12 15l-1.6-4.6L6 9l4.4-1.4z" />
        <path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
    </svg>
);

export const Spinner = ({ size = 22 }) => (
    <span
        className="betterdocs-sd-spinner"
        style={{ width: size, height: size }}
        aria-hidden="true"
    />
);

const SD_GLYPH = {
    truck: "M1 3h13v10H1zM14 8h4l3 3v2h-7zM5.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
    refund: "M3 12a9 9 0 1 1 3 6.7|M3 21v-4h4",
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5",
    help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M9.5 9a2.5 2.5 0 0 1 5 .25c0 1.5-2.5 2-2.5 3.75M12 17.5h.01",
    tag: "M20.6 13.4 12 22l-8-8V4h10l6.6 6.6a2 2 0 0 1 0 2.8z|M7.5 7.5h.01",
};

export const CatGlyph = ({ name, size = 18, sw = 1.7 }) => {
    const raw = SD_GLYPH[name] || SD_GLYPH.book;
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
            {raw.split("|").map((d, i) => <path key={i} d={d} />)}
        </svg>
    );
};

export const IconClose = ({ size = 16, sw = 1.7 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

export const IconPlus = ({ size = 16, sw = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
    </svg>
);

export const IconCheck = ({ size = 16, sw = 2.4 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

export const IconArrowRight = ({ size = 16, sw = 2.2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
);

export const IconDoc = ({ size = 16, sw = 1.7 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M9 13h6M9 17h6" />
    </svg>
);

export const IconAlert = ({ size = 20, sw = 1.8 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4M12 16h.01" />
    </svg>
);

export const DocIllustration = () => (
    <svg width="118" height="132" viewBox="0 0 118 132" fill="none" aria-hidden="true">
        <rect x="20" y="14" width="70" height="92" rx="9" fill="#fff" stroke="#E2E5EA" strokeWidth="2" transform="rotate(-7 55 60)" />
        <rect x="26" y="22" width="74" height="98" rx="10" fill="#fff" stroke="#DDE1E6" strokeWidth="2" />
        <path d="M84 22h0l16 16v0H90a6 6 0 0 1-6-6V22z" fill="#EAEDF1" />
        <rect x="40" y="52" width="44" height="5" rx="2.5" fill="#E4E7EC" />
        <rect x="40" y="66" width="34" height="5" rx="2.5" fill="#E9ECF0" />
        <rect x="40" y="80" width="40" height="5" rx="2.5" fill="#E9ECF0" />
    </svg>
);

export const FaqIllustration = () => (
    <svg width="124" height="132" viewBox="0 0 124 132" fill="none" aria-hidden="true">
        <rect x="24" y="16" width="68" height="90" rx="10" fill="#fff" stroke="#E2E5EA" strokeWidth="2" transform="rotate(-7 58 61)" />
        <rect x="30" y="24" width="72" height="96" rx="11" fill="#fff" stroke="#DDE1E6" strokeWidth="2" />
        <rect x="44" y="46" width="44" height="6" rx="3" fill="#E4E7EC" />
        <rect x="44" y="60" width="34" height="6" rx="3" fill="#E9ECF0" />
        <rect x="44" y="74" width="40" height="6" rx="3" fill="#E9ECF0" />
        <rect x="44" y="88" width="26" height="6" rx="3" fill="#EDEFF2" />
        <circle cx="96" cy="34" r="18" fill="var(--base-color-700)" />
        <path d="M91 30a5 5 0 0 1 10 .5c0 3-5 4-5 7.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="96" cy="44" r="1.5" fill="#fff" />
    </svg>
);
