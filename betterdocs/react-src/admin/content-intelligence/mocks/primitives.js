import React from "react";
import { cn } from "../../analytics/components/common/ui";

/**
 * Shared, inert building blocks for the Content Intelligence mocks.
 *
 * Everything in `mocks/` is decoration: it renders behind `LockedPreview`'s
 * frosted panel, which hides it from the accessibility tree (`aria-hidden`) and
 * kills pointer events in CSS. `aria-hidden` does not remove focusability
 * though — a real <button> or <a> in there would still be reachable with Tab,
 * putting invisible, blurred controls in the tab order. So every control in the
 * mocks is one of these look-alike <span>s instead, exactly as `ApiDocsMock`
 * does for its row actions.
 */

/* Looks like `common/ui.js`'s <Btn>, minus the button. */
export function FauxBtn( { kind = "ghost", size = "md", icon, children, className } ) {
    return (
        <span className={ cn( "bda-btn", kind, size === "sm" && "sm", className ) }>
            { icon }{ children }
        </span>
    );
}

/**
 * The one glyph the shared analytics icon set is missing: Pro keys the
 * Duplicates & Overlaps module off `I.Copy`, which Free's
 * `analytics/components/common/icons.js` does not ship. Same lucide-style
 * 24×24 / 1.75-stroke construction as every icon in there, so this stays inside
 * the existing design language rather than starting a second one. Local to the
 * teaser because the teaser is the only thing in Free that needs it.
 */
export function CopyIcon( { size = 16, className = "", strokeWidth = 1.75, ...rest } ) {
    return (
        <svg width={ size } height={ size } viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={ strokeWidth } strokeLinecap="round" strokeLinejoin="round" className={ className } { ...rest }>
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
        </svg>
    );
}

/* Deterministic descending series for the stale-article sparklines — stale
   content is, by definition, on the way down. Same shape-from-a-formula idiom
   as `previews.js`'s `wave()`, so the trend lines read like the ones in the
   Analytics teasers. */
export const decline = ( base, n = 12 ) =>
    Array.from( { length: n }, ( _, i ) =>
        Math.round( base * ( 1 - i / ( n * 1.6 ) ) + Math.sin( i / 1.3 ) * base * 0.06 ) );
