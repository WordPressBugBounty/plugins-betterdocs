import React from "react";
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { DocIllustration } from "../../sample-docs/icons";
import { AiBadge, GenerateBtn } from "../../sample-docs/Pieces";
import SampleDocsFlow from "../../sample-docs/SampleDocsFlow";
import { sampleDocsEnabled } from "../../sample-docs/api";

const NoDocsBody = ({ isDocs }) => {
    const [text, setText] = useState(__("Generate Sample Docs", "betterdocs"));
    const [flowOpen, setFlowOpen] = useState(false);
    const aiEnabled = sampleDocsEnabled();

    // Tier-3 fallback: the classic CSV "dummy data" import (used when AI is
    // disabled, or as a manual fallback).
    const createDummyData = async (e) => {
        e.preventDefault();
        setText(__("Generating...", "betterdocs"));
        let response = await wp.apiFetch({
            url: betterdocs_admin?.generate_data_url,
            method: "POST",
            data: {
                action: "create-dummy-data",
                _wpnonce: betterdocs_admin?.nonce,
            },
        });
        if (response?.status == "success") {
            setText(__("Generated Successfully", "betterdocs"));
            window.location.reload();
        } else {
            setText(__("Generation Failed", "betterdocs"));
            setTimeout(() => setText(__("Generate Sample Docs", "betterdocs")), 1000);
        }
    };

    return (
        <section className="betterdocs-dashboard-body">
            <div className="betterdocs-no-docs-wrapper betterdocs-sd-empty-card">
                <div className="betterdocs-no-docs-img-wrap">
                    <DocIllustration />
                </div>

                <div className="betterdocs-no-docs-content">
                    <h3 className="betterdocs-no-docs-title">
                        {__("No Category Found", "betterdocs")}
                    </h3>
                    <p className="betterdocs-no-docs-text">
                        {aiEnabled
                            ? __("Please create a new category to get started — or let AI build a starter knowledge base for you.", "betterdocs")
                            : __("Please create a new category to get started", "betterdocs")}
                    </p>

                    {!isDocs && (
                        <>
                            <div className="betterdocs-sd-empty-actions">
                                <a
                                    href={`${betterdocs_admin.admin_url}admin.php?page=betterdocs-doc-categories&betterdocs_action=new-category`}
                                    className="betterdocs-sd-create-btn"
                                >
                                    {__("Create A New Category", "betterdocs")}
                                </a>

                                {aiEnabled ? (
                                    <GenerateBtn block onClick={() => setFlowOpen(true)} />
                                ) : (
                                    <a href="#" className="betterdocs-dashboard-btn" onClick={createDummyData}>
                                        {text}
                                    </a>
                                )}
                            </div>

                            {aiEnabled && (
                                <div className="betterdocs-sd-empty-badge">
                                    <AiBadge />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {flowOpen && (
                <SampleDocsFlow
                    contentType="docs"
                    onClose={() => setFlowOpen(false)}
                    onComplete={() => window.location.reload()}
                />
            )}
        </section>
    );
};

export default NoDocsBody;
