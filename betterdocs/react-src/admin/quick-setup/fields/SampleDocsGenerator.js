import React from "react";
import { useState, useEffect } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";
import { Sparkle, IconDoc } from "../../sample-docs/icons";
import { AiBadge, GenerateBtn, PopulatedDocs } from "../../sample-docs/Pieces";
import SampleDocsFlow from "../../sample-docs/SampleDocsFlow";
import { sampleDocsEnabled, fetchExistingDocs } from "../../sample-docs/api";

/* Quick Setup "Create Content" field — replaces the old DocCreate.gif.
   Leads with the AI promo banner ("Skip the blank page"). If the site
   already has docs/categories (or sample docs were generated this session),
   it shows them read-only in the All Docs grid instead of the empty prompt.
   Renders inside the tab content area only; tab header + left nav untouched. */

/* Persist the generated docs for the wizard session so leaving the page
   (Dashboard / All Docs) and returning keeps the populated view. */
const LS_GEN_KEY = "betterdocs_setup_generated_docs";

const slimCats = (cats) =>
    (cats || []).map((c, i) => ({
        id: c.id || "sd_" + i,
        name: decodeEntities(c.name || ""),
        icon: c.icon || "book",
        color: c.color || "#00B884",
        articles: (c.articles || []).map((a) => decodeEntities(typeof a === "string" ? a : a?.title || "")),
    }));

const readStoredDocs = () => {
    try {
        const s = window.localStorage?.getItem(LS_GEN_KEY);
        const parsed = s ? JSON.parse(s) : null;
        return Array.isArray(parsed) && parsed.length ? parsed : null;
    } catch (e) {
        return null;
    }
};

function SampleDocsGenerator(props) {
    const [flowOpen, setFlowOpen] = useState(false);
    const [generated, setGenerated] = useState(readStoredDocs);
    const [existing, setExisting] = useState(null);
    const aiEnabled = sampleDocsEnabled();

    // Detect content the site already has, so the step reflects reality
    // instead of always prompting "No categories yet".
    useEffect(() => {
        if (generated) return; // a fresh generation takes precedence
        let alive = true;
        fetchExistingDocs().then((cats) => {
            if (alive && cats && cats.length) {
                setExisting(slimCats(cats));
            }
        });
        return () => {
            alive = false;
        };
    }, []);

    if (!aiEnabled) {
        return null;
    }

    // What to display in the grid: a fresh generation wins, else existing content.
    const docs = generated || existing;
    const totalDocs = docs ? docs.reduce((n, c) => n + (c.articles?.length || 0), 0) : 0;

    return (
        <div className={`betterdocs-sd-qs ${props?.classes || ""}`}>
            {/* AI promo + empty prompt only when there are no docs yet. */}
            {!docs && (
                <>
                    {/* AI promo banner — green gradient hero, matches the design. */}
                    <div className="betterdocs-sd-promo betterdocs-sd-fade">
                        <span className="betterdocs-sd-promo-glow" aria-hidden="true" />
                        <span className="betterdocs-sd-promo-icon">
                            <Sparkle size={28} />
                        </span>
                        <div className="betterdocs-sd-promo-body">
                            <div className="betterdocs-sd-promo-head">
                                <h4 className="betterdocs-sd-promo-title">
                                    {__("Skip the blank page", "betterdocs")}
                                </h4>
                                <AiBadge />
                            </div>
                            <p className="betterdocs-sd-promo-text">
                                {__("BetterDocs can read your site and generate a tailored starter knowledge base — categories and draft articles — in about a minute.", "betterdocs")}
                            </p>
                        </div>
                        <GenerateBtn onClick={() => setFlowOpen(true)}>
                            {__("Generate Sample Docs", "betterdocs")}
                        </GenerateBtn>
                    </div>

                    <div className="betterdocs-sd-manual-divider">
                        <span className="betterdocs-sd-manual-line" />
                        <span className="betterdocs-sd-manual-label">{__("or build it yourself", "betterdocs")}</span>
                        <span className="betterdocs-sd-manual-line" />
                    </div>
                    <div className="betterdocs-sd-manual">
                        <span className="betterdocs-sd-manual-icon">
                            <IconDoc size={24} />
                        </span>
                        <div className="betterdocs-sd-manual-title">{__("No categories yet", "betterdocs")}</div>
                        <div className="betterdocs-sd-manual-text">
                            {__("Add your first category and articles manually from the All Docs screen after setup.", "betterdocs")}
                        </div>
                    </div>
                </>
            )}

            {docs && docs.length > 0 && (
                <div className="betterdocs-sd-qs-result">
                    <div className="betterdocs-sd-qs-result-head">
                        {sprintf(
                            generated
                                ? __("%1$d categories · %2$d docs created", "betterdocs")
                                : __("%1$d categories · %2$d docs", "betterdocs"),
                            docs.length,
                            totalDocs
                        )}
                    </div>
                    {/* Read-only preview — no actions available inside the wizard. */}
                    <PopulatedDocs cats={docs} />
                </div>
            )}

            {flowOpen && (
                <SampleDocsFlow
                    contentType="docs"
                    onClose={() => setFlowOpen(false)}
                    onComplete={(result) => {
                        setFlowOpen(false);
                        if (result?.categories?.length) {
                            const slim = slimCats(result.categories);
                            setGenerated(slim);
                            try {
                                window.localStorage?.setItem(LS_GEN_KEY, JSON.stringify(slim));
                            } catch (e) {}
                        }
                    }}
                />
            )}
        </div>
    );
}

export default SampleDocsGenerator;
