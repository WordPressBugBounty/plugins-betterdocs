import { __, sprintf } from "@wordpress/i18n";
import React from "react";

import LockedPreview from "../analytics/components/modules/LockedPreview";
import GlossaryMock from "./GlossaryMock";
import "../analytics/scss/dashboard.scss";
import "./glossary-teaser.scss";

const FEATURE_BULLETS = [
    __( "A–Z glossary index, styled like the rest of your docs", "betterdocs" ),
    __( "Auto-link terms across every doc with hover tooltips", "betterdocs" ),
    __( "Write definitions with AI, then edit them inline", "betterdocs" ),
    __( "Drag-to-reorder, plus CSV import & export", "betterdocs" )
];

/**
 * Free's Glossaries screen — the locked slot shown when the real Pro manager is
 * not available. It reads two shapes off `betterdocs_admin`:
 *
 *  - No Pro at all → the classic upsell ("Glossaries is a Pro feature", Pro
 *    badge, Upgrade Now).
 *  - Pro active but too old (Glossaries moved to Pro) → an *update* screen: the
 *    user already owns Pro, so we drop the Pro badge and the pricing CTA and ask
 *    them to update Pro to the version that ships the manager.
 *
 * Once a Pro new enough to register the taxonomy is active, its real manager
 * takes the `betterdocs-glossaries` route instead and this never renders.
 */
export default function GlossaryTeaser() {
    const admin       = ( typeof window !== "undefined" && window.betterdocs_admin ) || {};
    const needsUpdate = !! admin.glossaries_needs_pro_update;

    if ( needsUpdate ) {
        const minVer    = admin.glossaries_min_pro_version || "4.3.1";
        const curVer    = admin.betterdocs_pro_version || "";
        const updateUrl = admin.glossaries_pro_update_url || "";

        const subtitle = curVer
            ? sprintf(
                /* translators: 1: current Pro version, 2: required Pro version. */
                __( "You're on BetterDocs Pro %1$s — update to Pro %2$s or later to manage your glossary here.", "betterdocs" ),
                curVer,
                minVer
            )
            : sprintf(
                /* translators: %s: required Pro version. */
                __( "Update to BetterDocs Pro %s or later to manage your glossary here.", "betterdocs" ),
                minVer
            );

        return (
            <div className="betterdocs-dashboard-body betterdocs-faq-wrapper betterdocs-dashboard-container bd-gloss-wrapper">
                <LockedPreview
                    title={ __( "BetterDocs Pro Needs a Compatibility Update.", "betterdocs" ) }
                    subtitle={ subtitle }
                    bullets={ FEATURE_BULLETS }
                    badge={ null }
                    ctaLabel={ __( "Update BetterDocs Pro", "betterdocs" ) }
                    ctaHref={ updateUrl }
                >
                    <GlossaryMock />
                </LockedPreview>
            </div>
        );
    }

    return (
        <div className="betterdocs-dashboard-body betterdocs-faq-wrapper betterdocs-dashboard-container bd-gloss-wrapper">
            <LockedPreview
                title={ __( "Glossaries is a Pro feature", "betterdocs" ) }
                subtitle={ __( "Build an A–Z glossary of your product's terms and auto-link them across every doc, so readers get an instant definition on hover — no more explaining the same jargon twice.", "betterdocs" ) }
                bullets={ FEATURE_BULLETS }
            >
                <GlossaryMock />
            </LockedPreview>
        </div>
    );
}
