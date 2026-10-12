import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getDocTags, createDocTag, updateDocTag, deleteDocTag } from "../utils/api";
import { makeUniqueSlug } from "../../doc-categories/utils/treeUtils";
import { setTermLanguage } from "../../doc-categories/utils/api";
import { useDocTags } from "~betterdocs/admin/components/DocTagsContext";
import TagRow from "./TagRow";
import SlideOverForm from "./SlideOverForm";
import Pagination from "../../doc-categories/components/Pagination";
import TableSkeleton from "../../doc-categories/components/TableSkeleton";
import BulkActionsSelect from "../../doc-categories/components/BulkActionsSelect";

const QUERY_KEY      = "doc-tags";
const DEFAULT_PER_PAGE = 20;

const GlobeIcon = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
        <ellipse cx="6.5" cy="6.5" rx="2.5" ry="5.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1 6.5H12" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1.5 4H11.5M1.5 9H11.5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
    </svg>
);

const DocTagsRoot = () => {
    const ctx         = useDocTags();
    const outletCtx   = useOutletContext() || [];
    const search      = outletCtx[6] || "";
    const queryClient = useQueryClient();

    const [selected, setSelected]     = useState(new Set());
    const [bulkAction, setBulkAction] = useState("");
    const [page, setPage]             = useState(1);
    const [perPage, setPerPage]       = useState(DEFAULT_PER_PAGE);
    const [highlightId, setHighlightId] = useState(null);
    // Default to the language selected in the admin language bar
    // (current_admin_language); fall back to "all" when none is set or it isn't
    // among the known languages.
    const [activeLang, setActiveLang] = useState(() => {
        const langList = window.betterdocs_admin?.languages || [];
        const multilingual = window.betterdocs_admin?.is_multilingual && langList.length > 0;
        const current = window.betterdocs_admin?.current_admin_language || "";
        return multilingual && current && langList.some((l) => l.code === current)
            ? current
            : "all";
    });

    const langs          = window.betterdocs_admin?.languages || [];
    const isMultilingual = window.betterdocs_admin?.is_multilingual && langs.length > 0;

    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEY, search],
        queryFn: () => getDocTags({ per_page: 100, search }).then((r) => r.data),
        // Keep the current list on screen while a new search refetches so the
        // "No results" empty state doesn't flash between keystrokes (issue #61).
        keepPreviousData: true,
    });

    const tags = data || [];

    // Language filter (WPML/Polylang) applied client-side over the fetched set.
    const visibleTags = activeLang === "all"
        ? tags
        : tags.filter((t) => (t.lang || "") === activeLang);

    // Per-language counts from the full fetched set.
    const langCounts = {};
    tags.forEach((t) => { const k = t.lang || ""; langCounts[k] = (langCounts[k] || 0) + 1; });

    useEffect(() => {
        if (ctx && data !== undefined) ctx.setTotalCount(tags.length);
    }, [tags.length]);

    // Reset to page 1 when search / language / perPage changes
    useEffect(() => { setPage(1); }, [search, perPage, activeLang]);

    // After a create, jump to the page holding the new tag (tags are name-sorted,
    // so it may land anywhere) and flash it.
    useEffect(() => {
        const fid = ctx?.focusTagId;
        if (fid == null) return;
        const idx = visibleTags.findIndex((t) => t.id === fid);
        if (idx >= 0) {
            setPage(Math.floor(idx / perPage) + 1);
            setHighlightId(fid);
        }
        ctx.setFocusTagId(null); // one-shot
    }, [tags]);

    // Auto-clear the row flash.
    useEffect(() => {
        if (highlightId == null) return;
        const t = setTimeout(() => setHighlightId(null), 2000);
        return () => clearTimeout(t);
    }, [highlightId]);

    const paginatedTags = visibleTags.slice((page - 1) * perPage, page * perPage);

    const saveMutation = useMutation({
        mutationFn: (payload) =>
            ctx?.editTag
                ? updateDocTag(ctx.editTag.id, payload)
                : createDocTag(payload),
        onSuccess: (result, variables) => {
            const wasCreate = !ctx?.editTag; // capture before close() clears editTag
            const termId    = wasCreate ? result?.id : ctx?.editTag?.id;

            const finalize = () => {
                queryClient.invalidateQueries([QUERY_KEY]);
                ctx?.close();
                if (wasCreate && termId) ctx?.setFocusTagId(termId);
                toast.success(
                    wasCreate
                        ? __("Tag created.", "betterdocs")
                        : __("Tag updated.", "betterdocs"),
                );
            };

            if (isMultilingual && variables?.lang && termId) {
                setTermLanguage({
                    taxonomy:       "doc_tag",
                    term_id:        termId,
                    lang:           variables.lang,
                    translation_of: variables.translationOf || 0,
                }).then(finalize).catch(finalize);
            } else {
                finalize();
            }
        },
        onError: (err) => toast.error(err?.message || __("Save failed.", "betterdocs")),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteDocTag(id, { force: true }),
        onSuccess: () => queryClient.invalidateQueries([QUERY_KEY]),
        onError: (err) => toast.error(err?.message || __("Delete failed.", "betterdocs")),
    });

    const handleDelete = (tag) => {
        Swal.fire({
            title: __("Delete this tag?", "betterdocs"),
            text: __("You won't be able to revert this!", "betterdocs"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: __("Yes, delete it!", "betterdocs"),
            cancelButtonText: __("Cancel", "betterdocs"),
            customClass: { popup: "betterdocs-bulk-action-popup" },
        }).then((result) => {
            if (result.isConfirmed) deleteMutation.mutate(tag.id);
        });
    };

    const toggleSelect = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        setSelected(selected.size === visibleTags.length && visibleTags.length > 0
            ? new Set()
            : new Set(visibleTags.map((t) => t.id)));
    };

    const handleBulkDelete = () => {
        if (!selected.size) return;
        Swal.fire({
            title: __("Delete selected tags?", "betterdocs"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: __("Yes, delete!", "betterdocs"),
            cancelButtonText: __("Cancel", "betterdocs"),
            customClass: { popup: "betterdocs-bulk-action-popup" },
        }).then((result) => {
            if (result.isConfirmed) {
                Promise.all([...selected].map((id) => deleteDocTag(id, { force: true })))
                    .then(() => {
                        queryClient.invalidateQueries([QUERY_KEY]);
                        setSelected(new Set());
                        toast.success(__("Tags deleted.", "betterdocs"));
                    })
                    .catch((err) => toast.error(err?.message));
            }
        });
    };

    const handleApplyBulkAction = () => {
        if (!bulkAction || !selected.size) return;
        if (bulkAction === "delete") handleBulkDelete();
    };

    return (
        <div className="bd-dc-root">
            {isLoading ? (
                <TableSkeleton variant="flat" />
            ) : isError ? (
                <div className="bd-dc-error">{__("Failed to load tags.", "betterdocs")}</div>
            ) : tags.length === 0 && !search ? (
                // No tags at all — mirror the categories page: show only the empty
                // card, with no toolbar / bulk-actions. (A search-with-no-results still
                // keeps the toolbar and falls through to the in-body empty message below.)
                <div className="bd-dc-tree-card">
                    <div className="bd-dc-empty">
                        {__('No tags yet. Click "Add New Tag" to create one.', "betterdocs")}
                    </div>
                </div>
            ) : (
                <>
                    {/* Toolbar lives OUTSIDE the card — language tabs (left) + bulk actions (right) */}
                    <div className="bd-dc-toolbar">
                        {isMultilingual && (
                            <div className="bd-dc-toolbar-left">
                                <div className="bd-dc-lang-tabs">
                                    <span className="bd-dc-lang-tabs-label">
                                        <GlobeIcon />
                                        {__("LANGUAGE", "betterdocs")}
                                    </span>
                                    <div className="bd-dc-lang-tabs-list">
                                        <button
                                            type="button"
                                            className={`bd-dc-lang-tab${activeLang === "all" ? " bd-dc-lang-tab--active" : ""}`}
                                            onClick={() => setActiveLang("all")}
                                        >
                                            {__("All languages", "betterdocs")}
                                            <span className="bd-dc-lang-tab-count">{tags.length}</span>
                                        </button>
                                        {langs.map((lang) => (
                                            <button
                                                key={lang.code}
                                                type="button"
                                                className={`bd-dc-lang-tab${activeLang === lang.code ? " bd-dc-lang-tab--active" : ""}`}
                                                onClick={() => setActiveLang(lang.code)}
                                                title={lang.native || lang.label}
                                            >
                                                {lang.label}
                                                <span className="bd-dc-lang-tab-count">{langCounts[lang.code] || 0}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="bd-dc-toolbar-right">
                            <div className="bd-dc-bulk-actions">
                                <BulkActionsSelect value={bulkAction} onChange={setBulkAction} />
                                <button
                                    type="button"
                                    className="bd-dc-btn-apply"
                                    onClick={handleApplyBulkAction}
                                    disabled={!bulkAction || !selected.size}
                                >
                                    {__("Apply", "betterdocs")}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bd-dc-tree-card">
                    <div className="bd-dc-table-header">
                        <input
                            type="checkbox"
                            className="bd-dc-checkbox"
                            checked={selected.size === visibleTags.length && visibleTags.length > 0}
                            onChange={toggleSelectAll}
                            aria-label={__("Select all", "betterdocs")}
                        />
                        <span className="bd-dc-col-name">{__("Name & Description", "betterdocs")}</span>
                        <span className="bd-dc-col-count">{__("Count", "betterdocs")}</span>
                        <span className="bd-dc-col-actions">{__("Actions", "betterdocs")}</span>
                    </div>

                    <div className="bd-dc-table-body">
                        {visibleTags.length === 0 ? (
                            <div className="bd-dc-empty">
                                {search
                                    ? __("No tags match your search.", "betterdocs")
                                    : __('No tags yet. Click "Add New Tag" to create one.', "betterdocs")}
                            </div>
                        ) : (
                            paginatedTags.map((tag) => (
                                <TagRow
                                    key={tag.id}
                                    tag={tag}
                                    isSelected={selected.has(tag.id)}
                                    isHighlighted={highlightId === tag.id}
                                    onSelect={toggleSelect}
                                    onEdit={(t) => ctx?.openEdit(t)}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>

                    </div>

                    {/* Pagination — sits below the card, outside its border */}
                    <Pagination
                        total={visibleTags.length}
                        page={page}
                        perPage={perPage}
                        onPageChange={setPage}
                        onPerPageChange={setPerPage}
                    />
                </>
            )}

            {ctx && (
                <SlideOverForm
                    isOpen={ctx.slideOpen}
                    onClose={ctx.close}
                    onSave={(p) => {
                        const existingSlugs = tags.map((t) => t.slug);
                        const ownSlug = ctx?.editTag?.slug ?? null;
                        saveMutation.mutate({
                            ...p,
                            slug: makeUniqueSlug(p.slug, existingSlugs, ownSlug),
                        });
                    }}
                    editTag={ctx.editTag}
                    isSaving={saveMutation.isPending}
                    createMeta={ctx.createMeta}
                    onAddTranslation={(langCode) => {
                        const sourceId = ctx?.editTag?.id;
                        ctx?.close();
                        ctx?.openCreate({ lang: langCode, translationOf: sourceId });
                    }}
                />
            )}
        </div>
    );
};

export default DocTagsRoot;
