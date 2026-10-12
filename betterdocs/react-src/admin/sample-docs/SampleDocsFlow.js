import React from "react";
import { useState, useEffect, useRef } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import { Sparkle, IconClose, IconCheck, IconArrowRight, IconAlert } from "./icons";
import {
    DetectingView,
    ProfileBody,
    GeneratingBody,
    useGenProgress,
    PreviewGroups,
    GenerateBtn,
    articleTitle,
} from "./Pieces";
import { detectSite, generateDocs, generateOutline, generateArticle, insertDocs, undoDocs } from "./api";

// Keep the "analyzing" view up for at least this long so a fast detect() never
// just flashes the screen — the user should always see it run. (fbs)
const MIN_DETECT_MS = 2000;

// Category display palette (mirrors SampleDocs::PALETTE server-side).
const SD_PALETTE = ["#00B884", "#3B82F6", "#8B5CF6", "#F59E0B", "#0EA5E9", "#EF4444"];

// How many article-expansion calls to run at once. 2 keeps wall-clock reasonable
// without risking the user's host running out of PHP workers (each call = 1 worker).
const ARTICLE_CONCURRENCY = 2;

function titleFor(stage, isFaq) {
    switch (stage) {
        case "detecting":
        case "profile":
            return isFaq ? __("Generate sample FAQs", "betterdocs") : __("Generate sample docs", "betterdocs");
        case "generating":
            return isFaq ? __("Generating your FAQs", "betterdocs") : __("Generating your docs", "betterdocs");
        case "preview":
            return __("Preview & confirm", "betterdocs");
        case "success":
            return __("All done", "betterdocs");
        case "error":
            return __("Something went wrong", "betterdocs");
        default:
            return "";
    }
}

/* apiFetch surfaces WP's raw critical-error page (HTML markup) as e.message on
   an unhandled 500 — never render that in the modal. The generic critical-error
   copy is useless to the user anyway, so map it to the actionable fallback;
   otherwise strip any tags and keep the server's readable message. */
function errorMessage(e, fallback) {
    if (!e?.message || typeof e.message !== "string" || e?.code === "internal_server_error") {
        return fallback;
    }
    const text = e.message.replace(/<\/?[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return text || fallback;
}

/* Expand one article, retrying once on failure. Resolves to the article body or
   null (the caller drops nulls and assembles a partial KB). */
async function fetchArticleWithRetry(jobToken, index) {
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const res = await generateArticle({ job_token: jobToken, index });
            if (res?.article?.content_html) return res.article;
        } catch (e) {
            // fall through to retry / give up
        }
    }
    return null;
}

/* Merge the proxy's generated groups (with content_html) back onto the suggested
   categories so we keep their icon/color for display. A general FAQ's groups are
   designed by the AI, so there may be more of them than there were topic chips —
   fall back to the palette by index rather than giving every extra group the same
   color.

   product_category / all_products MUST be preserved: the insert step sends this merged
   array straight back to the server, which routes each product-FAQ group by those fields
   (all_products → shown on every product page; product_category → attached to that
   WooCommerce category). Dropping them here would silently un-assign every generated
   product FAQ. */
function mergeGenerated(cats, generated) {
    return (generated || []).map((g, i) => {
        const base = cats[i] || {};
        return {
            id: base.id || "g" + i,
            name: g.name || base.name,
            icon: base.icon || "book",
            color: base.color || SD_PALETTE[i % SD_PALETTE.length],
            slug: g.slug,
            description: g.description,
            articles: g.articles || [],
            product_category: g.product_category || "",
            all_products: !!g.all_products,
        };
    });
}

export default function SampleDocsFlow({ contentType = "docs", onClose, onComplete }) {
    const [stage, setStage] = useState("detecting");
    const [profile, setProfile] = useState(null);
    const [cats, setCats] = useState([]);
    const [generated, setGenerated] = useState([]);
    const [quota, setQuota] = useState(false);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState(null);
    const [inserting, setInserting] = useState(false);
    const [intent, setIntent] = useState("");

    // Deep-docs orchestrator state: real per-article progress (no timed fake).
    // genPhase: "outlining" → "writing" → "finalizing" → "done".
    const [genPhase, setGenPhase] = useState("outlining");
    const [genRows, setGenRows] = useState([]);
    const [genPct, setGenPct] = useState(0);
    // Number of articles the AI planned in the outline but that failed to expand
    // (after a retry). Surfaced in the preview so a partial KB isn't shown as complete.
    const [missingCount, setMissingCount] = useState(0);
    const jobTokenRef = useRef("");

    const genResult = useRef(null);
    const [apiDone, setApiDone] = useState(false);

    // Guards for async work: `mountedRef` blocks state updates after unmount;
    // `cancelledRef` lets the user cancel an in-flight generation (QA-006, QA-010).
    const mountedRef = useRef(true);
    const cancelledRef = useRef(false);
    useEffect(() => () => { mountedRef.current = false; }, []);

    // Both "faq" and "product_faq" use the FAQ-flavored copy; only "docs" differs.
    const isFaq = contentType !== "docs";
    const draftedCount = generated.reduce((n, c) => n + (c.articles?.length || 0), 0);

    /* ESC closes the modal. */
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    /* Kick off detection on mount. */
    useEffect(() => {
        let alive = true;
        const startedAt = Date.now();
        detectSite(contentType)
            .then((res) => {
                if (!alive) return;
                const wait = Math.max(0, MIN_DETECT_MS - (Date.now() - startedAt));
                setTimeout(() => {
                    if (!alive) return;
                    setProfile(res.profile);
                    setCats((res.categories || []).map((c) => ({ ...c })));
                    setStage("profile");
                }, wait);
            })
            .catch((e) => {
                if (!alive) return;
                setError(errorMessage(e, __("Could not analyze your site.", "betterdocs")));
                setStage("error");
            });
        return () => {
            alive = false;
        };
    }, []);

    const showPreview = () => {
        setGenerated(genResult.current || []);
        setStage("preview");
    };

    /* Entry point from the Generate button: docs use the deep outline→expand flow;
       FAQ / product FAQ keep the single-call path. */
    const startGenerate = () => {
        if (isFaq) {
            startGenerateClassic();
        } else {
            startGenerateDeep();
        }
    };

    /* Single-call generation (FAQ/product_faq, and the docs fallback when the proxy
       has no /outline endpoint yet). */
    const startGenerateClassic = () => {
        genResult.current = null;
        cancelledRef.current = false;
        setApiDone(false);
        setGenPhase("writing"); // classic path uses the timed animation, not "outlining"
        setStage("generating");

        generateDocs({ content_type: contentType, profile, categories: cats, intent })
            .then((res) => {
                if (cancelledRef.current || !mountedRef.current) return;
                genResult.current = mergeGenerated(cats, res.categories);
                setApiDone(true);
            })
            .catch((e) => {
                if (cancelledRef.current || !mountedRef.current) return;
                if (e?.code === "quota_exceeded") {
                    setQuota(true);
                    setStage("profile");
                } else {
                    setError(errorMessage(e, __("The AI service could not generate docs.", "betterdocs")));
                    setStage("error");
                }
            });
    };

    /* Deep KB (docs): design the IA, then expand every article with live progress. */
    const startGenerateDeep = async () => {
        genResult.current = null;
        cancelledRef.current = false;
        setApiDone(false);
        setQuota(false);
        setGenPct(0);
        setGenRows([]);
        setMissingCount(0);
        setGenPhase("outlining");
        setStage("generating");

        let out;
        try {
            // Send the topics the user kept: removing a chip must skip that category and
            // its docs. (The outline call used to send none, so pruning did nothing.)
            out = await generateOutline({ profile, intent, categories: cats });
        } catch (e) {
            if (cancelledRef.current || !mountedRef.current) return;
            if (e?.code === "quota_exceeded") {
                setQuota(true);
                setStage("profile");
                return;
            }
            // Old proxy without /outline → fall back to the single-call docs path.
            if (e?.data?.proxy_status === 404) {
                startGenerateClassic();
                return;
            }
            setError(errorMessage(e, __("The AI service could not design your knowledge base.", "betterdocs")));
            setStage("error");
            return;
        }
        if (cancelledRef.current || !mountedRef.current) return;

        const outlineCats = (out?.outline?.categories || []).map((c, i) => ({
            id: c.id || "oc" + i,
            name: c.name,
            slug: c.slug,
            icon: c.icon || "book",
            color: c.color || SD_PALETTE[i % SD_PALETTE.length],
            description: c.description,
            articles: Array.isArray(c.articles) ? c.articles : [],
        }));

        const total = out?.outline?.total_articles || outlineCats.reduce((n, c) => n + c.articles.length, 0);
        if (!outlineCats.length || total === 0) {
            setError(__("The AI service returned an empty knowledge base. Please try again.", "betterdocs"));
            setStage("error");
            return;
        }

        jobTokenRef.current = out.job_token;
        setCats(outlineCats);
        setGenRows(outlineCats.map((c) => ({ id: c.id, state: "pending", written: 0 })));
        setGenPct(0);
        setGenPhase("writing");

        // Flat work list of { catId, index } across the whole KB.
        const work = [];
        outlineCats.forEach((c) => c.articles.forEach((a) => work.push({ catId: c.id, index: a.index })));

        const results = {}; // index → expanded article body
        let done = 0;
        const refreshProgress = () => {
            setGenPct(Math.round((done / total) * 100));
            setGenRows(
                outlineCats.map((c) => {
                    const written = c.articles.filter((a) => results[a.index]).length;
                    const state = written >= c.articles.length ? "done" : written > 0 ? "writing" : "pending";
                    return { id: c.id, state, written };
                })
            );
        };

        // Concurrency-limited workers sharing one queue (JS is single-threaded, so
        // Array.shift() is race-free here).
        const queue = work.slice();
        const worker = async () => {
            while (queue.length) {
                if (cancelledRef.current || !mountedRef.current) return;
                const item = queue.shift();
                const article = await fetchArticleWithRetry(jobTokenRef.current, item.index);
                if (cancelledRef.current || !mountedRef.current) return;
                if (article) results[item.index] = article;
                done++;
                refreshProgress();
            }
        };
        await Promise.all(Array.from({ length: ARTICLE_CONCURRENCY }, () => worker()));
        if (cancelledRef.current || !mountedRef.current) return;

        // Assemble the generated KB, dropping any article that failed after a retry.
        const generatedCats = outlineCats
            .map((c) => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                icon: c.icon,
                color: c.color,
                description: c.description,
                articles: c.articles
                    .map((a) => results[a.index])
                    .filter(Boolean)
                    .map((b) => ({
                        title: b.title,
                        slug: b.slug,
                        type: b.type,
                        content_html: b.content_html,
                        excerpt: b.excerpt,
                    })),
            }))
            .filter((c) => c.articles.length > 0);

        if (!generatedCats.length) {
            setError(__("The AI service could not write any articles. Please try again.", "betterdocs"));
            setStage("error");
            return;
        }

        // Some articles the outline planned may have failed to expand (and were
        // dropped above). Record how many so the preview can flag a partial KB
        // instead of presenting it as complete.
        const generatedCount = generatedCats.reduce((n, c) => n + c.articles.length, 0);
        setMissingCount(Math.max(0, total - generatedCount));

        genResult.current = generatedCats;
        setGenPct(100);
        setGenPhase("done");
        // Brief terminal state, then reveal the preview.
        setTimeout(() => {
            if (cancelledRef.current || !mountedRef.current) return;
            showPreview();
        }, 500);
    };

    /* Abort an in-flight generation and return to the profile screen (QA-010). */
    const cancelGenerate = () => {
        cancelledRef.current = true;
        genResult.current = null;
        setApiDone(false);
        setGenPhase("outlining");
        setStage("profile");
    };

    /* Navigate to the BetterDocs AI settings tab (where the OpenAI key lives). */
    const goToAiSettings = () => {
        const base = (typeof window !== "undefined" && window.betterdocs_admin?.admin_url) || "";
        window.location.href = `${base}admin.php?page=betterdocs-settings&tab=tab-betterdocs-ai`;
    };

    const insert = () => {
        setInserting(true);
        insertDocs({ content_type: contentType, categories: generated })
            .then((res) => {
                setSummary(res);
                setStage("success");
            })
            .catch((e) => {
                setError(errorMessage(e, __("Could not insert the docs.", "betterdocs")));
                setStage("error");
            })
            .finally(() => setInserting(false));
    };

    const removeSamples = () => {
        undoDocs(contentType).finally(() => {
            if (onComplete) onComplete({ removed: true });
            else onClose();
        });
    };

    const finish = () => {
        if (onComplete) onComplete({ ...(summary || { inserted: true }), categories: generated });
        else onClose();
    };

    return (
        <div className="betterdocs-sd-overlay" onClick={onClose}>
            <div className="betterdocs-sd-modal betterdocs-sd-pop" onClick={(e) => e.stopPropagation()}>
                <div className="betterdocs-sd-modal-header">
                    <span className="betterdocs-sd-modal-spark"><Sparkle size={18} /></span>
                    <div className="betterdocs-sd-modal-heading">
                        <div className="betterdocs-sd-modal-title">{titleFor(stage, isFaq)}</div>
                        <div className="betterdocs-sd-modal-sub">{__("BetterDocs AI · hosted, no API key required", "betterdocs")}</div>
                    </div>
                    <button type="button" className="betterdocs-sd-modal-close" onClick={onClose}>
                        <IconClose size={17} />
                    </button>
                </div>

                <div className="betterdocs-sd-modal-body">
                    {stage === "detecting" && <DetectingView />}

                    {stage === "profile" && (
                        <ProfileBody
                            profile={profile}
                            cats={cats}
                            setCats={setCats}
                            quota={quota}
                            contentType={contentType}
                            intent={intent}
                            setIntent={setIntent}
                        />
                    )}

                    {stage === "generating" && (
                        isFaq ? (
                            <GenStage cats={cats} ready={apiDone} onDone={showPreview} contentType={contentType} />
                        ) : genPhase === "outlining" ? (
                            <DetectingView
                                title={__("Designing your knowledge base…", "betterdocs")}
                                sub={__("Planning the categories and articles from what your site is about.", "betterdocs")}
                            />
                        ) : (
                            <GeneratingBody
                                cats={cats}
                                rows={genRows}
                                pct={genPct}
                                finalizing={genPhase === "finalizing"}
                                done={genPhase === "done"}
                                contentType={contentType}
                            />
                        )
                    )}

                    {stage === "preview" && (
                        <div className="betterdocs-sd-fade">
                            <div className="betterdocs-sd-preview-intro">
                                <div className="betterdocs-sd-preview-intro-title">
                                    {isFaq
                                        ? __("Your starter FAQs are ready", "betterdocs")
                                        : missingCount > 0
                                            ? __("Your starter knowledge base is ready (partial)", "betterdocs")
                                            : __("Your starter knowledge base is ready", "betterdocs")}
                                </div>
                                <div className="betterdocs-sd-preview-intro-sub">
                                    {sprintf(
                                        _n(
                                            "Review the %d item, then add it as a draft to publish when you're ready.",
                                            "Review the %d items, then add them as drafts — publish the ones you want when you're ready.",
                                            draftedCount,
                                            "betterdocs"
                                        ),
                                        draftedCount
                                    )}
                                </div>
                            </div>
                            {missingCount > 0 && (
                                <div className="betterdocs-sd-preview-warning" role="alert">
                                    <span className="betterdocs-sd-preview-warning-icon">!</span>
                                    <span>
                                        {sprintf(
                                            _n(
                                                "%d article couldn't be generated and was skipped. You can add what's here, or discard and try again for the full set.",
                                                "%d articles couldn't be generated and were skipped. You can add what's here, or discard and try again for the full set.",
                                                missingCount,
                                                "betterdocs"
                                            ),
                                            missingCount
                                        )}
                                    </span>
                                </div>
                            )}
                            <PreviewGroups cats={generated} contentType={contentType} />
                        </div>
                    )}

                    {stage === "success" && (
                        <div className="betterdocs-sd-success betterdocs-sd-fade">
                            <span className="betterdocs-sd-success-check"><IconCheck size={26} sw={2.6} /></span>
                            <div className="betterdocs-sd-success-title">
                                {isFaq ? __("Sample FAQs added as drafts", "betterdocs") : __("Sample docs added as drafts", "betterdocs")}
                            </div>
                            <div className="betterdocs-sd-success-sub">
                                {summary
                                    ? (isFaq
                                        ? sprintf(__("%1$d FAQ groups · %2$d questions saved as drafts. Review and publish the ones you want to go live.", "betterdocs"), summary.categories, summary.articles)
                                        : sprintf(__("%1$d categories · %2$d docs saved as drafts. Review and publish the ones you want to go live — nothing is public until you do.", "betterdocs"), summary.categories, summary.articles))
                                    : __("Saved as drafts.", "betterdocs")}
                            </div>
                        </div>
                    )}

                    {stage === "error" && (
                        <div className="betterdocs-sd-error betterdocs-sd-fade">
                            <span className="betterdocs-sd-error-icon"><IconAlert size={22} /></span>
                            <div className="betterdocs-sd-error-title">{error}</div>
                            <div className="betterdocs-sd-error-sub">
                                {__("This is usually temporary. Please try again in a moment.", "betterdocs")}
                            </div>
                        </div>
                    )}
                </div>

                {stage !== "detecting" && (
                    <div className="betterdocs-sd-modal-footer">
                        {stage === "generating" && (
                            <button type="button" className="betterdocs-sd-btn-ghost" onClick={cancelGenerate}>
                                {__("Cancel", "betterdocs")}
                            </button>
                        )}

                        {stage === "profile" && (
                            <>
                                <button type="button" className="betterdocs-sd-btn-ghost" onClick={onClose}>
                                    {__("Cancel", "betterdocs")}
                                </button>
                                {quota ? (
                                    <button type="button" className="betterdocs-sd-btn-primary" onClick={goToAiSettings}>
                                        {__("Add API key in Settings", "betterdocs")} <IconArrowRight size={16} />
                                    </button>
                                ) : (
                                    // A general FAQ needs no topic chips — with none, the AI designs it
                                    // from the site profile alone. Only the deterministic product FAQ is
                                    // driven by its categories.
                                    <GenerateBtn onClick={startGenerate} disabled={contentType === "product_faq" && cats.length === 0}>
                                        {isFaq ? __("Generate My FAQs", "betterdocs") : __("Generate My Knowledge Base", "betterdocs")}
                                    </GenerateBtn>
                                )}
                            </>
                        )}

                        {stage === "preview" && (
                            <>
                                <button type="button" className="betterdocs-sd-btn-discard" onClick={onClose}>
                                    {__("Discard", "betterdocs")}
                                </button>
                                <button type="button" className="betterdocs-sd-btn-primary" onClick={insert} disabled={inserting}>
                                    <IconCheck size={16} sw={2.6} />{" "}
                                    {inserting
                                        ? __("Inserting…", "betterdocs")
                                        : isFaq ? __("Insert all FAQs", "betterdocs") : __("Insert all docs", "betterdocs")}
                                </button>
                            </>
                        )}

                        {stage === "success" && (
                            <>
                                <button type="button" className="betterdocs-sd-btn-ghost" onClick={removeSamples}>
                                    {isFaq ? __("Remove sample FAQs", "betterdocs") : __("Remove sample docs", "betterdocs")}
                                </button>
                                <button type="button" className="betterdocs-sd-btn-primary" onClick={finish}>
                                    {isFaq ? __("View my FAQs", "betterdocs") : __("View my docs", "betterdocs")}
                                </button>
                            </>
                        )}

                        {stage === "error" && (
                            <>
                                <button type="button" className="betterdocs-sd-btn-ghost" onClick={onClose}>
                                    {__("Close", "betterdocs")}
                                </button>
                                <button type="button" className="betterdocs-sd-btn-primary" onClick={() => { setError(null); setStage("detecting"); reDetect(mountedRef, setProfile, setCats, setStage, setError, contentType); }}>
                                    {__("Try again", "betterdocs")}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function GenStage({ cats, ready, onDone, contentType }) {
    const { rows, pct, finalizing, done } = useGenProgress(cats, ready, onDone);
    return <GeneratingBody cats={cats} rows={rows} pct={pct} finalizing={finalizing} done={done} contentType={contentType} />;
}

function reDetect(mountedRef, setProfile, setCats, setStage, setError, contentType) {
    const startedAt = Date.now();
    detectSite(contentType)
        .then((res) => {
            if (!mountedRef.current) return;
            const wait = Math.max(0, MIN_DETECT_MS - (Date.now() - startedAt));
            setTimeout(() => {
                if (!mountedRef.current) return;
                setProfile(res.profile);
                setCats((res.categories || []).map((c) => ({ ...c })));
                setStage("profile");
            }, wait);
        })
        .catch((e) => {
            if (!mountedRef.current) return;
            setError(errorMessage(e, __("Could not analyze your site.", "betterdocs")));
            setStage("error");
        });
}

export { articleTitle };
