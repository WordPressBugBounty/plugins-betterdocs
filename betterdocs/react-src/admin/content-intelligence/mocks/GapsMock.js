import { __ } from "@wordpress/i18n";
import React from "react";

import { I } from "../../analytics/components/common/icons";
import { Badge, Card } from "../../analytics/components/common/ui";
import { FauxBtn } from "./primitives";

/**
 * Inert mock of Pro's Content Gaps screen
 * (betterdocs-pro/react-src/admin/content-intelligence/views/GapsView.js):
 * the explainer banner, then one card per detected topic carrying its
 * provenance + confidence badges, the demand meter, the reader queries that
 * evidence it, and the AI-drafted article suggestion.
 */

// 5-segment demand meter, same construction as Pro's.
function DemandMeter( { value } ) {
    const filled = Math.round( ( Math.max( 0, Math.min( 100, value ) ) / 100 ) * 5 );
    return (
        <div className="bd-cit-demand">
            { [ 0, 1, 2, 3, 4 ].map( ( i ) => (
                <span key={ i } className={ i < filled ? "is-on" : "" } />
            ) ) }
        </div>
    );
}

/* Invented gaps of the kind this module actually surfaces: a question readers
   ask in several different wordings that no article answers. */
const GAPS = [
    {
        semantic: true,
        confidence: __( "High confidence", "betterdocs" ),
        color: "green",
        topic: "SSO login errors",
        volume: 384,
        phrasings: 6,
        demand: 94,
        queries: [ "sso login error", "saml authentication failed", "okta sign in loop", "single sign-on not working" ],
        suggested: "Troubleshooting SSO and SAML Sign-In Errors",
        outline: "1. Check the identity provider metadata\n2. Match the ACS URL and entity ID\n3. Read the SAML response\n4. Common Okta and Azure AD failures"
    },
    {
        semantic: true,
        confidence: __( "Medium confidence", "betterdocs" ),
        color: "amber",
        topic: "Exporting a knowledge base to PDF",
        volume: 211,
        phrasings: 4,
        demand: 68,
        queries: [ "export docs to pdf", "print whole knowledge base", "offline documentation download" ],
        suggested: "Exporting Your Knowledge Base as a PDF Handbook",
        outline: ""
    },
    {
        semantic: false,
        confidence: __( "Medium confidence", "betterdocs" ),
        color: "amber",
        topic: "Webhook retry behaviour",
        volume: 96,
        phrasings: 3,
        demand: 52,
        queries: [ "webhook retry policy", "failed webhook delivery", "webhook timeout" ],
        suggested: "",
        outline: ""
    }
];

function GapCard( { gap } ) {
    return (
        <Card padded>
            <div className="bd-cit-gap-head">
                <div className="bd-cit-gap-main">
                    <div className="bd-cit-gap-badges">
                        { gap.semantic
                            ? <Badge color="purple">{ __( "AI-detected", "betterdocs" ) }</Badge>
                            : <Badge color="slate">{ __( "Search analytics", "betterdocs" ) }</Badge> }
                        <Badge color={ gap.color }>{ gap.confidence }</Badge>
                    </div>
                    <div className="bd-cit-gap-title">{ gap.topic }</div>
                    <div className="bd-cit-gap-meta">
                        { gap.volume } { __( "unanswered searches", "betterdocs" ) }
                        { " · " }{ gap.phrasings } { __( "phrasings", "betterdocs" ) }
                    </div>
                </div>
                <div className="bd-cit-gap-side">
                    <DemandMeter value={ gap.demand } />
                    <FauxBtn kind="ghost" size="sm" icon={ <I.X size={ 13 } /> } />
                </div>
            </div>

            <div className="bd-cit-gap-queries">
                <div className="bd-cit-label">{ __( "Sample reader queries", "betterdocs" ) }</div>
                <div className="bd-cit-chips">
                    { gap.queries.map( ( q, i ) => <code className="bd-cit-chip" key={ i }>{ q }</code> ) }
                </div>
            </div>

            <div className="bd-cit-gap-foot">
                { gap.suggested ? (
                    <>
                        <div className="bd-cit-label">{ __( "Suggested doc", "betterdocs" ) }</div>
                        <div className="bd-cit-gap-suggested">{ gap.suggested }</div>
                        { gap.outline && <pre className="bd-cit-gap-outline">{ gap.outline }</pre> }
                    </>
                ) : (
                    <div className="bd-cit-gap-draft">
                        <FauxBtn kind="soft" size="sm" icon={ <I.Sparkle size={ 13 } /> }>
                            { __( "Draft title with AI", "betterdocs" ) }
                        </FauxBtn>
                        <span className="bd-cit-hint">{ __( "Uses your API key", "betterdocs" ) }</span>
                    </div>
                ) }
            </div>
        </Card>
    );
}

export default function GapsMock() {
    return (
        <div className="bda-stack-sm">
            <div className="bda-banner">
                <div className="bda-banner-ico"><I.Sparkle size={ 18 } /></div>
                <div className="bd-cit-banner-copy">
                    <div className="bd-cit-banner-title">{ __( "Topics readers want that your docs don't cover", "betterdocs" ) }</div>
                    <div className="bd-cit-banner-sub">
                        { __( "Clustered from searches that came back empty, visits that bounced, and what readers said in feedback. Every topic is re-checked against your existing docs before it is listed.", "betterdocs" ) }
                    </div>
                </div>
                <FauxBtn kind="soft" size="sm" icon={ <I.RefreshCw size={ 13 } /> }>{ __( "Analyze now", "betterdocs" ) }</FauxBtn>
            </div>

            <div className="bda-stack-sm">
                { GAPS.map( ( g, i ) => <GapCard gap={ g } key={ i } /> ) }
            </div>
        </div>
    );
}
