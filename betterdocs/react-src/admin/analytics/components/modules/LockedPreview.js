import { __ } from "@wordpress/i18n";
import React from "react";
import { I } from "../common/icons";
import { ProBadge } from "../common/ui";
import { upgradeUrl } from "../ProTeaser";

/* Locked Pro module: renders a real, design-accurate mock of the feature
   (`children`) blurred behind a frosted lock panel. The mock sells what the
   user gets; the panel carries the Pro badge, copy, a "what's included" list,
   and the upgrade CTA. The mock is inert (aria-hidden + pointer-events:none in
   CSS) so it's purely illustrative. */
export default function LockedPreview( { title, subtitle, bullets = [], children, badge, ctaLabel, ctaHref } ) {
    // Defaults preserve the upsell shell (Pro badge + "Upgrade Now" → pricing).
    // Callers such as the Glossaries "update your Pro" screen override these to
    // point an existing-Pro user at the plugin update instead of a purchase.
    const cta_label = ctaLabel || __( "Upgrade Now", "betterdocs" );
    const cta_href  = ctaHref || upgradeUrl();

    return (
        <div className="bda-page">
            <div className="bda-locked">
                <div className="bda-locked-mock" aria-hidden="true">
                    { children }
                </div>
                <div className="bda-lock-overlay">
                    <div className="bda-lock-panel">
                        <span className="bda-lock-ico"><I.Lock size={ 24 } /></span>
                        { badge === undefined ? <ProBadge /> : badge }
                        <h3 className="bda-lock-title">{ title }</h3>
                        { subtitle && <p className="bda-lock-sub">{ subtitle }</p> }
                        { bullets.length > 0 && (
                            <ul className="bda-lock-bullets">
                                { bullets.map( ( b, i ) => (
                                    <li key={ i }><I.Check size={ 14 } /><span>{ b }</span></li>
                                ) ) }
                            </ul>
                        ) }
                        <a className="bda-btn primary" href={ cta_href } target="_blank" rel="noopener noreferrer">
                            { cta_label } <I.ArrowRight size={ 13 } />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
