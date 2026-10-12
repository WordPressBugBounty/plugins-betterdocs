import { __ } from "@wordpress/i18n";
import React from "react";

import { I } from "../../analytics/components/common/icons";
import { Badge, Card } from "../../analytics/components/common/ui";
import { CopyIcon, FauxBtn } from "./primitives";

/**
 * Inert mock of Pro's Duplicates & Overlaps screen
 * (betterdocs-pro/react-src/admin/content-intelligence/views/DuplicatesView.js):
 * the explainer banner and one card per near-duplicate pair, each with its
 * similarity score and the merge / keep-both / dismiss triage.
 *
 * The pairs are invented, and are the kind this module actually finds: two
 * articles on one subject written for different audiences, sharing barely a
 * phrase between them — which is exactly why word matching misses them.
 */
const PAIRS = [
    { sim: 94, a: "Setting Up Two-Factor Authentication", b: "Enable 2FA on Your Account" },
    { sim: 88, a: "Installing the CLI on macOS", b: "Getting Started with the Command Line Tool" },
    { sim: 81, a: "Billing FAQ", b: "Common Questions About Invoices and Payments" }
];

function PairCard( { pair } ) {
    return (
        <Card padded>
            <div className="bd-cit-pair-head">
                <Badge color="purple">{ pair.sim }% { __( "similar", "betterdocs" ) }</Badge>
                <div className="bd-cit-row-actions">
                    <FauxBtn kind="soft" size="sm" icon={ <CopyIcon size={ 13 } /> }>{ __( "Merge", "betterdocs" ) }</FauxBtn>
                    <FauxBtn kind="ghost" size="sm">{ __( "Keep both", "betterdocs" ) }</FauxBtn>
                    <FauxBtn kind="ghost" size="sm" icon={ <I.X size={ 13 } /> } />
                </div>
            </div>
            <div className="bd-cit-pair-body">
                <div className="bd-cit-pair-doc">
                    <div className="bd-cit-pair-title">{ pair.a }</div>
                    <span className="bd-cit-pair-link"><I.ExternalLink size={ 12 } /> { __( "Open doc", "betterdocs" ) }</span>
                </div>
                <CopyIcon size={ 16 } className="bd-cit-pair-join" />
                <div className="bd-cit-pair-doc">
                    <div className="bd-cit-pair-title">{ pair.b }</div>
                    <span className="bd-cit-pair-link"><I.ExternalLink size={ 12 } /> { __( "Open doc", "betterdocs" ) }</span>
                </div>
            </div>
        </Card>
    );
}

export default function DuplicatesMock() {
    return (
        <div className="bda-stack-sm">
            <div className="bda-banner">
                <div className="bda-banner-ico"><CopyIcon size={ 18 } /></div>
                <div className="bd-cit-banner-copy">
                    <div className="bd-cit-banner-title">{ __( "Docs covering near-identical ground", "betterdocs" ) }</div>
                    <div className="bd-cit-banner-sub">
                        { __( "Detected by comparing what your docs mean, not the words they use. Merge the pairs worth collapsing, or keep both and differentiate them.", "betterdocs" ) }
                    </div>
                </div>
                <FauxBtn kind="soft" size="sm" icon={ <I.RefreshCw size={ 13 } /> }>{ __( "Sync now", "betterdocs" ) }</FauxBtn>
            </div>

            <div className="bda-stack-sm">
                { PAIRS.map( ( p, i ) => <PairCard pair={ p } key={ i } /> ) }
            </div>
        </div>
    );
}
