// ===== write-with-ai/GitBrowse.js — "Browse repository" picker for From Git =====
// Lets the user pick a connected repository, then a Pull Request, an Issue, or a
// file (folder-by-folder browse). Whatever is picked resolves to a github.com URL
// that the parent modal feeds to the existing `from-git` generation path — this
// component never generates anything itself, it only builds the URL.

import { __ } from "@wordpress/i18n";
import { useState, useEffect, useRef } from "@wordpress/element";

import { DropdownSelect, FieldLabel, Banner, Spinner, IcCheck, IcChevDown } from "../ai-shared/kit";
import { callWriteWithAI } from "./api";

// Source-type segmented (PR | Issue | File) — mirrors the modal's SegControl look.
const TYPES = [
    { value: "pull", label: __("Pull Request", "betterdocs") },
    { value: "issue", label: __("Issue", "betterdocs") },
    { value: "file", label: __("Repository file", "betterdocs") },
];

const TypeSeg = ({ value, onChange, disabled }) => (
    <div style={{ display: "flex", gap: 2, background: "var(--base-background, #fff)", border: "1px solid var(--text-color-200, #eaecf0)", padding: 4, borderRadius: 8, opacity: disabled ? 0.6 : 1 }}>
        {TYPES.map((o) => {
            const active = value === o.value;
            return (
                <button key={o.value} type="button" disabled={disabled} onClick={() => onChange(o.value)} style={{
                    flex: "1 1 0", minWidth: 0, padding: "7px 6px", borderRadius: 9, border: "none", cursor: disabled ? "default" : "pointer",
                    fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    background: active ? "var(--text-color-50, #f9fafb)" : "transparent",
                    color: active ? "var(--green)" : "var(--muted)",
                    transition: "background .12s, color .12s",
                }}>
                    {o.label}
                </button>
            );
        })}
    </div>
);

// Tiny folder / file glyphs (inherit currentColor).
const IcFolder = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
);
const IcFile = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" />
    </svg>
);

const errText = (e) => (e && e.message) || __("Something went wrong. Please try again.", "betterdocs");

// Amber "Private" pill — mirrors Settings → Git Sync → Repository
// (.bd-rs-repo-tag--private) instead of a lock glyph. Hex fallbacks keep the
// colour correct inside the editor, where the --warning-* vars may be absent.
const PrivateTag = () => (
    <span style={{
        display: "inline-block", fontSize: 10, fontWeight: 600, lineHeight: 1,
        padding: "3px 6px", borderRadius: 3, letterSpacing: 0.3, marginLeft: 8,
        background: "var(--warning-50, #fffaeb)", color: "var(--warning-700, #b54708)",
        border: "1px solid var(--warning-100, #fef0c7)",
    }}>{__("Private", "betterdocs")}</span>
);

// react-select option renderer: repo name + a "Private" pill for private repos.
const formatRepoOption = (opt) => (
    <span style={{ display: "inline-flex", alignItems: "center", minWidth: 0 }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{opt.label}</span>
        {opt.private && <PrivateTag />}
    </span>
);

// A single directory-listing browser. Navigates folders in place; selecting a
// file reports its blob URL up via onPick.
const FileBrowser = ({ repo, onPick, disabled }) => {
    const [ref, setRef] = useState("");
    const [path, setPath] = useState("");
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState("");   // selected file path
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const reqId = useRef(0);

    const load = (nextPath, keepRef) => {
        const id = ++reqId.current;
        setLoading(true);
        setError(null);
        callWriteWithAI("git-contents", { repo, path: nextPath, ref: keepRef || "" })
            .then((data) => {
                if (id !== reqId.current) return; // stale
                setRef(data.ref || keepRef || "");
                setPath(data.path != null ? data.path : nextPath);
                setItems(Array.isArray(data.items) ? data.items : []);
            })
            .catch((e) => { if (id === reqId.current) { setError(e); setItems([]); } })
            .finally(() => { if (id === reqId.current) setLoading(false); });
    };

    // (Re)load the root whenever the repo changes; reset any prior selection.
    useEffect(() => {
        setSelected("");
        onPick("");
        if (repo) load("", "");
        else { setItems([]); setPath(""); setRef(""); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [repo]);

    const openDir = (p) => { setSelected(""); onPick(""); load(p, ref); };
    const pickFile = (it) => {
        setSelected(it.path);
        onPick(`https://github.com/${repo}/blob/${ref}/${it.path}`);
    };

    // Breadcrumb from the current path.
    const crumbs = path ? path.split("/") : [];
    const goCrumb = (i) => openDir(crumbs.slice(0, i + 1).join("/"));

    return (
        <div>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, marginBottom: 8, fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>
                <button type="button" onClick={() => openDir("")} style={crumbBtn}>{__("Root", "betterdocs")}</button>
                {crumbs.map((c, i) => (
                    <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <span style={{ color: "var(--text-color-300, #dde2e4)" }}>/</span>
                        <button type="button" onClick={() => goCrumb(i)} style={crumbBtn}>{c}</button>
                    </span>
                ))}
            </div>

            {error && <Banner tone="error" style={{ marginBottom: 10 }}>{errText(error)}</Banner>}

            <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 6, maxHeight: 240, overflowY: "auto", position: "relative", minHeight: 90 }}>
                {loading && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "28px 0", color: "var(--muted)", fontSize: 13 }}>
                        <Spinner size={16} /> {__("Loading…", "betterdocs")}
                    </div>
                )}
                {!loading && !error && items.length === 0 && (
                    <div style={{ padding: "26px 10px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>{__("This folder is empty.", "betterdocs")}</div>
                )}
                {!loading && items.map((it) => {
                    const isDir = it.type === "dir";
                    const isSel = !isDir && selected === it.path;
                    return (
                        <button key={it.path} type="button" disabled={disabled}
                            onClick={() => (isDir ? openDir(it.path) : pickFile(it))}
                            style={{
                                display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                                padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer",
                                background: isSel ? "var(--text-color-50, #f9fafb)" : "transparent",
                                color: isSel ? "var(--green)" : "var(--ink)", fontSize: 13.5, fontWeight: isSel ? 700 : 500,
                                transition: "background .12s",
                            }}
                            onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = "#f4f6f8"; }}
                            onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = "transparent"; }}>
                            <span style={{ display: "flex", flexShrink: 0, color: isSel ? "var(--green)" : (isDir ? "var(--muted)" : "#b6bdc7") }}>
                                {isDir ? <IcFolder size={16} /> : <IcFile size={16} />}
                            </span>
                            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.name}</span>
                            {isDir && <span style={{ display: "flex", color: "#c4cbd5", transform: "rotate(-90deg)" }}><IcChevDown size={15} /></span>}
                            {isSel && <span style={{ display: "flex", color: "var(--green)" }}><IcCheck size={16} sw={2.4} /></span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const crumbBtn = {
    border: "none", background: "transparent", cursor: "pointer", padding: "2px 4px",
    borderRadius: 5, color: "var(--wp-blue, #2271b1)", fontSize: 12.5, fontWeight: 600,
};

// ── The browse picker ─────────────────────────────────────────────────────────
const GitBrowse = ({ onSelect, disabled, settingsUrl }) => {
    const [repos, setRepos] = useState([]);
    const [repoLoading, setRepoLoading] = useState(true);
    const [repoError, setRepoError] = useState(null);
    const [repo, setRepo] = useState("");

    const [kind, setKind] = useState("pull");        // pull · issue · file
    const [items, setItems] = useState([]);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [itemsError, setItemsError] = useState(null);
    const [item, setItem] = useState("");            // selected PR/issue URL
    const itemsReq = useRef(0);

    // Load the connected account's repositories once.
    useEffect(() => {
        setRepoLoading(true);
        callWriteWithAI("git-repos", {})
            .then((data) => setRepos(Array.isArray(data.repos) ? data.repos : []))
            .catch((e) => setRepoError(e))
            .finally(() => setRepoLoading(false));
    }, []);

    // Load PRs/Issues whenever the repo or kind (pull/issue) changes.
    useEffect(() => {
        setItem("");
        onSelect("");
        if (!repo || kind === "file") { setItems([]); return; }
        const id = ++itemsReq.current;
        setItemsLoading(true);
        setItemsError(null);
        callWriteWithAI("git-items", { repo, kind })
            .then((data) => { if (id === itemsReq.current) setItems(Array.isArray(data.items) ? data.items : []); })
            .catch((e) => { if (id === itemsReq.current) { setItemsError(e); setItems([]); } })
            .finally(() => { if (id === itemsReq.current) setItemsLoading(false); });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [repo, kind]);

    const repoOptions = repos.map((r) => ({ value: r.value, label: r.label, private: !!r.private }));
    const pickItem = (url) => { setItem(url); onSelect(url); };

    // Surface a clear reconnect prompt when the repo list can't load or comes back
    // empty. The GitHub App user token is short-lived (~8h) and, once it lapses, the
    // proxy returns no repositories — a silent empty dropdown looks broken, so show
    // an explicit "session may have expired → reconnect" message instead.
    if (repoError || (!repoLoading && repos.length === 0)) {
        return (
            <Banner tone={repoError ? "error" : "warn"}>
                {repoError
                    ? errText(repoError)
                    : __("No repositories found. If GitHub shows connected but nothing loads here, your GitHub session has likely expired.", "betterdocs")}
                {settingsUrl && (
                    <>
                        {" "}
                        <a href={settingsUrl} target="_blank" rel="noreferrer"
                            style={{ color: "var(--wp-blue)", fontWeight: 700, textDecoration: "none" }}>
                            {__("Reconnect in Settings → Git Integration", "betterdocs")}
                        </a>
                    </>
                )}
            </Banner>
        );
    }

    return (
        <div>
            {/* Repository */}
            <FieldLabel>{__("Repository", "betterdocs")}</FieldLabel>
            <DropdownSelect
                value={repo}
                onChange={(v) => setRepo(v)}
                options={repoOptions}
                formatOptionLabel={formatRepoOption}
                isSearchable
                disabled={disabled || repoLoading}
                placeholder={repoLoading ? __("Loading repositories…", "betterdocs") : __("Search a repository…", "betterdocs")}
                style={{ width: "100%" }}
            />

            {/* Type */}
            <div style={{ marginTop: 14 }}>
                <FieldLabel>{__("What to document", "betterdocs")}</FieldLabel>
                <TypeSeg value={kind} onChange={setKind} disabled={disabled || !repo} />
            </div>

            {/* Selection */}
            <div style={{ marginTop: 14 }}>
                {!repo && (
                    <div style={{ fontSize: 12.5, color: "var(--muted)", padding: "6px 2px" }}>
                        {__("Choose a repository to continue.", "betterdocs")}
                    </div>
                )}

                {repo && kind !== "file" && (
                    <>
                        <FieldLabel>{kind === "issue" ? __("Select an issue", "betterdocs") : __("Select a pull request", "betterdocs")}</FieldLabel>
                        {itemsError
                            ? <Banner tone="error">{errText(itemsError)}</Banner>
                            : <DropdownSelect
                                value={item}
                                onChange={pickItem}
                                options={items}
                                isSearchable
                                disabled={disabled || itemsLoading}
                                placeholder={
                                    itemsLoading ? __("Loading…", "betterdocs")
                                        : items.length === 0 ? (kind === "issue" ? __("No open issues found", "betterdocs") : __("No open pull requests found", "betterdocs"))
                                            : (kind === "issue" ? __("Search an issue…", "betterdocs") : __("Search a pull request…", "betterdocs"))
                                }
                                style={{ width: "100%" }}
                            />}
                    </>
                )}

                {repo && kind === "file" && (
                    <FileBrowser repo={repo} onPick={onSelect} disabled={disabled} />
                )}
            </div>
        </div>
    );
};

export default GitBrowse;
