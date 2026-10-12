import React from "react";
import { useState, useEffect, useRef } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";
import { Sparkle, Spinner, IconClose, IconCheck, IconDoc } from "./icons";
import { IconDrag } from "../../icons";

/* ---------- AI badge ---------- */
export const AiBadge = ({ label }) => (
    <span className="betterdocs-sd-badge">
        <Sparkle size={14} /> {label || __("AI-powered — no API key needed", "betterdocs")}
    </span>
);

/* ---------- "Generate Sample Docs" sparkle pill ---------- */
export const GenerateBtn = ({ children, onClick, disabled, block }) => (
    <button
        type="button"
        className={`betterdocs-sd-gen-btn${block ? " betterdocs-sd-gen-btn--block" : ""}`}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
    >
        <Sparkle size={16} /> {children || __("Generate Sample Docs", "betterdocs")}
    </button>
);

/* ---------- Detecting view ---------- */
export const DetectingView = ({ title, sub }) => (
    <div className="betterdocs-sd-detecting betterdocs-sd-fade">
        <div className="betterdocs-sd-detecting-orb">
            <Spinner size={64} />
            <span className="betterdocs-sd-detecting-spark"><Sparkle size={24} /></span>
        </div>
        <div className="betterdocs-sd-detecting-title">
            {title || __("Analyzing your site…", "betterdocs")}
        </div>
        <div className="betterdocs-sd-detecting-sub">
            {sub || __("Detecting your site type and the topics your visitors ask about.", "betterdocs")}
        </div>
        <div className="betterdocs-sd-detecting-dots">
            {[0, 1, 2].map((i) => (
                <span key={i} style={{ animationDelay: `${i * 0.18}s` }} />
            ))}
        </div>
    </div>
);

/* ---------- Editable category chips ---------- */
export function CategoryChips({ cats, setCats, emptyText }) {
    const remove = (id) => setCats((cs) => cs.filter((c) => c.id !== id));

    if (!cats.length) {
        return (
            <p className="betterdocs-sd-chips-empty">
                {emptyText || __("All suggestions removed. Reload this page to start over with a fresh set.", "betterdocs")}
            </p>
        );
    }

    return (
        <div className="betterdocs-sd-chips">
            {cats.map((c) => (
                <span key={c.id} className="betterdocs-sd-chip betterdocs-sd-pop">
                    {decodeEntities(c.name)}
                    <button
                        type="button"
                        className="betterdocs-sd-chip-remove"
                        title={__("Remove", "betterdocs")}
                        onClick={() => remove(c.id)}
                    >
                        <IconClose size={14} sw={2.4} />
                    </button>
                </span>
            ))}
        </div>
    );
}

/* ---------- Quota note ---------- */
export const QuotaNote = () => (
    <div className="betterdocs-sd-quota betterdocs-sd-fade">
        <span className="betterdocs-sd-quota-icon"><Sparkle size={16} /></span>
        <div className="betterdocs-sd-quota-text">
            {__("You've used your free AI generation. Add your OpenAI API key in Settings to generate more — your suggested categories are saved below.", "betterdocs")}
        </div>
    </div>
);

/* ---------- Detected profile ---------- */
export function ProfileBody({ profile, cats, setCats, quota, contentType = "docs", intent = "", setIntent }) {
    const site = profile?.site || {};
    // Prefer the server's content-aware niche label (e.g. "AI / LLM platform");
    // fall back to the plugin-type label for older profiles.
    const typeLabel = decodeEntities((profile?.niche_label && String(profile.niche_label)) || humanType(profile?.type));
    const signals = (profile?.signals?.active_plugins || []).slice(0, 5);
    const storeName = decodeEntities(site.title || __("your site", "betterdocs"));
    // Content-type-specific scan blurb: docs vs FAQ vs WooCommerce product FAQ.
    const blurb =
        contentType === "product_faq"
            ? __("We scanned %s and prepared starter FAQs for your product categories, from what your products actually say.", "betterdocs")
            : contentType === "faq"
                ? __("We scanned %s and prepared a starter list of FAQs tailored to what your visitors usually ask.", "betterdocs")
                : __("We scanned %s and prepared a starter knowledge base tailored to what your visitors usually ask.", "betterdocs");
    // Both FAQ tabs now work the same way: real detected topics as chips (the General
    // tab's site subjects, the WooCommerce tab's product categories), with the AI
    // designing the groups and writing the questions. Only docs differs.
    const isGeneralFaq = contentType !== "docs";
    const showIntent = !!setIntent && (contentType === "docs" || isGeneralFaq);
    const intentCopy = isGeneralFaq
        ? contentType === "product_faq"
            ? {
                label: __("What should these product FAQs answer? (optional)", "betterdocs"),
                placeholder: __("e.g. Sizing and care questions shoppers ask before buying our apparel.", "betterdocs"),
                hint: __("BetterDocs AI writes an FAQ for each product category, from your real products — and attaches it to that category so it shows on those product pages.", "betterdocs"),
            }
            : {
                label: __("What should these FAQs answer? (optional)", "betterdocs"),
                placeholder: __("e.g. Questions advertisers ask before signing up — pricing, billing, campaign limits.", "betterdocs"),
                hint: __("BetterDocs AI groups the questions by subject the way a real FAQ page does, and answers each in a few sentences. Add a line to steer it.", "betterdocs"),
            }
        : {
            label: __("What should this knowledge base be about? (optional)", "betterdocs"),
            placeholder: __("e.g. A knowledge base for our billboard advertising platform, for both advertisers and operators.", "betterdocs"),
            hint: __("BetterDocs AI designs the full structure — an Introduction, a Quickstart, and in-depth guides — from your site content. Add a sentence to steer it.", "betterdocs"),
        };
    // Count of detected subjects (chips). Docs used to also show an article count
    // ("3 categories, 9 docs"), but those were placeholder seed articles — the deep
    // outline flow right-sizes the real KB, so the number never matched. All three tabs
    // now show just the detected-topic count.
    const catCount = sprintf(_n("%d topic", "%d topics", cats.length, "betterdocs"), cats.length);

    return (
        <div className="betterdocs-sd-profile betterdocs-sd-fade">
            <div>
                <div className="betterdocs-sd-profile-head">
                    <h3 className="betterdocs-sd-profile-title">
                        {sprintf(__("We detected %s", "betterdocs"), withArticle(typeLabel))}
                    </h3>
                </div>
                <p className="betterdocs-sd-profile-blurb">
                    {sprintf(blurb, storeName)}
                </p>
                {signals.length > 0 && (
                    <div className="betterdocs-sd-signals">
                        {signals.map((s) => (
                            <span key={s} className="betterdocs-sd-signal">
                                <span className="betterdocs-sd-signal-dot" />
                                {s}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {showIntent && (
                <div className="betterdocs-sd-intent">
                    <label className="betterdocs-sd-intent-label" htmlFor="betterdocs-sd-intent-input">
                        {intentCopy.label}
                    </label>
                    <textarea
                        id="betterdocs-sd-intent-input"
                        className="betterdocs-sd-intent-input"
                        rows={2}
                        maxLength={400}
                        placeholder={intentCopy.placeholder}
                        value={intent}
                        onChange={(e) => setIntent(e.target.value)}
                    />
                    <p className="betterdocs-sd-intent-hint">{intentCopy.hint}</p>
                </div>
            )}

            <div>
                {/* Hide the whole "Topics we detected" section when there are no chips —
                    the same for docs, sample FAQ and sample product FAQ. An empty state
                    ("No specific topics detected" / "All suggestions removed") reads as a
                    failure, but it isn't: the AI still designs the content from the full
                    site content digest. So we omit the section and let the intent box +
                    generation speak for it. */}
                {cats.length > 0 && (
                    <>
                        <div className="betterdocs-sd-profile-subhead">
                            <span className="betterdocs-sd-profile-subtitle">
                                {__("Topics we detected", "betterdocs")}
                            </span>
                            <span className="betterdocs-sd-profile-count">
                                {catCount}
                            </span>
                        </div>
                        <CategoryChips cats={cats} setCats={setCats} />
                        <p className="betterdocs-sd-intent-hint">
                            {contentType === "product_faq"
                                ? __("These are your product categories. BetterDocs AI writes an FAQ for each one from your real products — remove a category to keep it out.", "betterdocs")
                                : contentType === "docs"
                                    ? __("These are subjects found on your site. BetterDocs AI designs your knowledge base around them — remove a topic to keep it out.", "betterdocs")
                                    : __("These are subjects found on your site. BetterDocs AI designs the FAQ groups, writes the questions and answers them — remove a topic to keep it out.", "betterdocs")}
                        </p>
                    </>
                )}
                <p className="betterdocs-sd-privacy-note">
                    {contentType === "product_faq"
                        ? __("We send your site type and category suggestions to BetterDocs AI. No customer personal data is included.", "betterdocs")
                        : __("We send your site type, detected topics and short public content excerpts to BetterDocs AI. No customer personal data is included.", "betterdocs")}
                </p>
            </div>

            {quota && <QuotaNote />}
        </div>
    );
}

/* ---------- Generating progress ---------- */
export function useGenProgress(cats, ready, onDone) {
    const [rows, setRows] = useState(() => cats.map((c) => ({ id: c.id, state: "pending", written: 0 })));
    const [pct, setPct] = useState(0);
    const [seqDone, setSeqDone] = useState(false); // the "writing" animation has played through every category
    const doneRef = useRef(onDone);
    doneRef.current = onDone;
    const finished = useRef(false);

    // The writing animation fills the bar the whole way; once it reaches 100% the
    // "Finalizing" step (below) covers the wait for the real generation result.
    const CAP = 100;

    // Category "writing" animation — runs once on mount, drives the bar to CAP.
    useEffect(() => {
        let alive = true;
        const timers = [];
        const after = (ms, fn) => {
            const t = setTimeout(() => alive && fn(), ms);
            timers.push(t);
        };
        setRows(cats.map((c) => ({ id: c.id, state: "pending", written: 0 })));
        setPct(0);
        setSeqDone(false);
        finished.current = false;
        const total = cats.length || 1;

        const runCat = (i) => {
            if (i >= cats.length) {
                setSeqDone(true);
                return;
            }
            setRows((r) => r.map((x, idx) => (idx === i ? { ...x, state: "creating" } : x)));
            after(480, () => {
                setRows((r) => r.map((x, idx) => (idx === i ? { ...x, state: "writing" } : x)));
                const arts = cats[i].articles.length;
                // FAQ topics carry no seeded questions (the AI decides how many each
                // subject warrants), so there is nothing to count up — hold the row in
                // "writing" for a beat, then mark it done.
                if (!arts) {
                    after(900, () => {
                        setRows((r) => r.map((x, idx) => (idx === i ? { ...x, state: "done" } : x)));
                        setPct(Math.round(((i + 1) / total) * CAP));
                        after(280, () => runCat(i + 1));
                    });
                    return;
                }
                const writeOne = (w) => {
                    setRows((r) => r.map((x, idx) => (idx === i ? { ...x, written: w } : x)));
                    if (w < arts) after(300, () => writeOne(w + 1));
                    else
                        after(360, () => {
                            setRows((r) => r.map((x, idx) => (idx === i ? { ...x, state: "done" } : x)));
                            setPct(Math.round(((i + 1) / total) * CAP));
                            after(280, () => runCat(i + 1));
                        });
                };
                after(320, () => writeOne(1));
            });
        };
        after(450, () => runCat(0));
        return () => {
            alive = false;
            timers.forEach(clearTimeout);
        };
    }, []);

    // Completion: once the writing animation has played through (bar at 100%),
    // advance to the preview the instant the real result is ready. While waiting,
    // the bar rests at 100% and the "Finalizing" step shows a spinner.
    useEffect(() => {
        if (finished.current || !seqDone || !ready) return;
        finished.current = true;
        setPct(100);
        const t = setTimeout(() => doneRef.current && doneRef.current(), 300);
        return () => clearTimeout(t);
    }, [seqDone, ready]);

    // `finalizing`: the writing animation has played through (bar at 100%) but the
    // real generation result hasn't arrived yet.
    // `done`: the animation finished AND the real result is ready — the terminal
    // 100% state, just before we transition to the preview.
    return { rows, pct, finalizing: seqDone && !ready, done: seqDone && ready };
}

export function GeneratingBody({ cats, rows, pct, finalizing, done = false, contentType = "docs" }) {
    const rowFor = (c) => rows.find((r) => r.id === c.id) || { state: "pending", written: 0 };
    // Content-type-aware progress copy: a knowledge base, an FAQ list, and product
    // FAQs are different things, so the label must match what's being generated.
    // `ready` is the terminal 100% message shown once generation is complete — it
    // must not fall back to "Building…" in the moment before we switch screens.
    const COPY = {
        docs:        { building: __("Building your knowledge base…", "betterdocs"),  finalizing: __("Finalizing your knowledge base…", "betterdocs"), ready: __("Knowledge base is ready", "betterdocs") },
        faq:         { building: __("Building your FAQs…", "betterdocs"),            finalizing: __("Finalizing your FAQs…", "betterdocs"),            ready: __("FAQs are ready", "betterdocs") },
        product_faq: { building: __("Building your product FAQs…", "betterdocs"),    finalizing: __("Finalizing your product FAQs…", "betterdocs"),    ready: __("Product FAQs are ready", "betterdocs") },
    };
    const copy = COPY[contentType] || COPY.docs;
    return (
        <div className="betterdocs-sd-fade">
            <div className="betterdocs-sd-progress-head">
                <span className="betterdocs-sd-progress-label">
                    {done ? copy.ready : (finalizing || pct === 100) ? copy.finalizing : copy.building}
                </span>
                <span className="betterdocs-sd-progress-pct">{pct}%</span>
            </div>
            <div className="betterdocs-sd-progress-track">
                <div className="betterdocs-sd-progress-fill" style={{ width: `${pct}%` }} />
            </div>

            <div className="betterdocs-sd-progress-rows">
                {cats.map((c) => {
                    const r = rowFor(c);
                    const done = r.state === "done";
                    const live = r.state === "creating" || r.state === "writing";
                    // A FAQ topic has no planned question count (the AI decides), so its
                    // rows can't show k/N — they'd read "Writing 1/0 questions…".
                    const planned = c.articles.length;
                    const sub =
                        r.state === "creating"
                            ? sprintf(__("Creating %s…", "betterdocs"), decodeEntities(c.name))
                            : r.state === "writing"
                                ? (!planned
                                    ? __("Writing questions…", "betterdocs")
                                    : contentType === "docs"
                                        ? sprintf(__("Writing %1$d/%2$d docs…", "betterdocs"), r.written, planned)
                                        : sprintf(__("Writing %1$d/%2$d questions…", "betterdocs"), r.written, planned))
                                : done
                                    ? (!planned
                                        ? __("Questions ready", "betterdocs")
                                        : contentType === "docs"
                                            ? sprintf(_n("%d doc ready", "%d docs ready", planned, "betterdocs"), planned)
                                            : sprintf(_n("%d question ready", "%d questions ready", planned, "betterdocs"), planned))
                                    : __("Queued", "betterdocs");
                    return (
                        <div
                            key={c.id}
                            className={`betterdocs-sd-progress-row${live ? " is-live" : ""}${r.state === "pending" ? " is-pending" : ""}`}
                        >
                            <div className="betterdocs-sd-progress-row-meta">
                                <div className="betterdocs-sd-progress-row-name">{decodeEntities(c.name)}</div>
                                <div className={`betterdocs-sd-progress-row-sub${done ? " is-done" : ""}`}>{sub}</div>
                            </div>
                            <div className="betterdocs-sd-progress-row-state">
                                {done ? (
                                    <span className="betterdocs-sd-progress-check"><IconCheck size={14} sw={3} /></span>
                                ) : live ? (
                                    <Spinner size={20} />
                                ) : (
                                    <span className="betterdocs-sd-progress-dot" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {(finalizing || pct === 100) && (
                <div className={`betterdocs-sd-progress-finalizing${done ? " is-done" : ""}`}>
                    <span className="betterdocs-sd-progress-finalizing-icon">
                        {done ? <IconCheck size={14} sw={3} /> : <Spinner size={18} />}
                    </span>
                    <span className="betterdocs-sd-progress-finalizing-text">
                        {done ? copy.ready : copy.finalizing}
                    </span>
                </div>
            )}
        </div>
    );
}

/* ---------- Preview groups ---------- */
export function PreviewGroups({ cats, contentType = "docs" }) {
    return (
        <div className="betterdocs-sd-preview">
            {cats.map((c) => (
                <div key={c.id} className="betterdocs-sd-preview-group betterdocs-sd-fade">
                    <div className="betterdocs-sd-preview-head">
                        <span className="betterdocs-sd-preview-name">{decodeEntities(c.name)}</span>
                        {/* The consolidated store-wide group shows on every product page; label it
                            so the owner knows it isn't tied to one product category. */}
                        {c.all_products && (
                            <span className="betterdocs-sd-preview-tag" title={__("Shown on every product page", "betterdocs")}>
                                {__("All products", "betterdocs")}
                            </span>
                        )}
                        <span className="betterdocs-sd-preview-badge">
                            {itemCount(c.articles.length, contentType)}
                        </span>
                    </div>
                    <div>
                        {c.articles.map((a, i) => (
                            <div key={i} className="betterdocs-sd-preview-article">
                                <span className="betterdocs-sd-preview-article-icon"><IconDoc size={16} /></span>
                                <span className="betterdocs-sd-preview-article-title">{articleTitle(a)}</span>
                                <span className="betterdocs-sd-preview-article-draft">{__("Draft", "betterdocs")}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ---------- Populated docs — All Docs grid look (read-only) ----------
   Mirrors the dashboard category grid (betterdocs-row > col-md-4 >
   category-wrap). Read-only: drag handle is shown but there are no hover
   action buttons and no "Add New Doc" footer; height follows content. */
export function PopulatedDocs({ cats }) {
    return (
        <div className="betterdocs-sd-populated">
            <div className="betterdocs-sd-populated-header">
                <div className="betterdocs-sd-populated-header-left">
                    <h2 className="betterdocs-sd-populated-title">{__("All Docs", "betterdocs")}</h2>
                    <span className="betterdocs-sd-populated-badge">{__("AI-generated", "betterdocs")}</span>
                </div>
            </div>
            <div className="betterdocs-sd-populated-grid betterdocs-row">
                {cats.map((c) => (
                    <div key={c.id} className="betterdocs-col betterdocs-col-md-4 betterdocs-sd-fade">
                        <div className="betterdocs-sd-cat-wrap">
                            <div className="betterdocs-sd-cat-header">
                                <h3 className="betterdocs-sd-cat-name">{decodeEntities(c.name)}</h3>
                            </div>
                            <ul className="betterdocs-sd-cat-list">
                                {c.articles.map((a, i) => (
                                    <li key={i}>
                                        <span className="betterdocs-sd-doc-drag">
                                            <IconDrag />
                                        </span>
                                        <span className="betterdocs-sd-doc-title">{articleTitle(a)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ---------- helpers ---------- */
export function articleTitle(a) {
    return decodeEntities(typeof a === "string" ? a : a?.title || "");
}

/* Count label matched to what's being generated and correctly singular/plural:
   docs → "1 doc" / "3 docs"; FAQ & product FAQ → "1 question" / "3 questions". */
export function itemCount(n, contentType = "docs") {
    return contentType === "docs"
        ? sprintf(_n("%d doc", "%d docs", n, "betterdocs"), n)
        : sprintf(_n("%d question", "%d questions", n, "betterdocs"), n);
}

function humanType(type) {
    const map = {
        ecommerce: __("WooCommerce store", "betterdocs"),
        course_lms: __("course / LMS site", "betterdocs"),
        digital_downloads: __("digital downloads store", "betterdocs"),
        membership: __("membership site", "betterdocs"),
        community: __("community site", "betterdocs"),
        business_site: __("business site", "betterdocs"),
        general: __("website", "betterdocs"),
    };
    return map[type] || map.general;
}

/* Prefix the right indefinite article ("a"/"an") for a human label, so e.g.
   "AI / LLM platform" reads "an AI / LLM platform" and "WooCommerce store"
   reads "a WooCommerce store". */
function withArticle(label) {
    const l = String(label || "").trim();
    if (!l) return __("a website", "betterdocs");
    return /^[aeiou]/i.test(l) ? `an ${l}` : `a ${l}`;
}
