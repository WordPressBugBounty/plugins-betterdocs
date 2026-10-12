import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { __ } from "@wordpress/i18n";
import { applyFilters } from "@wordpress/hooks";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    flattenTree,
    isDescendant,
} from "../utils/treeUtils";
import { deleteDocCategory, updateDocCategory } from "../utils/api";
import { useDocCategories } from "~betterdocs/admin/components/DocCategoriesContext";
import TreeRow from "./TreeRow";
import Pagination from "./Pagination";
import BulkActionsSelect from "./BulkActionsSelect";

const QUERY_KEY  = "doc-categories";
const DEFAULT_PER_PAGE = 20;

const GlobeIcon = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
        <ellipse cx="6.5" cy="6.5" rx="2.5" ry="5.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1 6.5H12" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1.5 4H11.5M1.5 9H11.5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
    </svg>
);

const getAllNodeIds = (nodes) =>
    nodes.reduce((acc, node) => {
        acc.push(node.id);
        if (node.children?.length) acc.push(...getAllNodeIds(node.children));
        return acc;
    }, []);

const CategoryTree = ({ terms, allTerms = [], tree, search, activeLang = "all", setActiveLang, onEdit, onAddChild }) => {
    const [expanded, setExpanded]       = useState(new Set());
    const [selected, setSelected]       = useState(new Set());
    const [bulkAction, setBulkAction]   = useState("");
    const [page, setPage]               = useState(1);
    const [perPage, setPerPage]         = useState(DEFAULT_PER_PAGE);
    const [dragOver, setDragOver]       = useState(null);
    const [highlightId, setHighlightId] = useState(null);
    const dragNodeRef                   = useRef(null);
    const queryClient                   = useQueryClient();
    const ctx                           = useDocCategories();

    const langs          = window.betterdocs_admin?.languages || [];
    const isMultilingual = window.betterdocs_admin?.is_multilingual && langs.length > 0;

    // Per-language term counts from the full (unfiltered) set.
    const langCounts = useMemo(() => {
        const m = {};
        (allTerms || []).forEach((t) => {
            const k = t.lang || "";
            m[k] = (m[k] || 0) + 1;
        });
        return m;
    }, [allTerms]);

    // Auto-expand all nodes when tree data changes
    useEffect(() => {
        if (tree.length > 0) {
            setExpanded((prev) => {
                const next = new Set(prev);
                getAllNodeIds(tree).forEach((id) => next.add(id));
                return next;
            });
        }
    }, [tree]);

    // After a create, jump to the page holding the new term and flash it. Runs on
    // every refetch but no-ops unless a focus term is pending, so edit / delete /
    // reorder refetches leave the current page untouched. The tree is always fully
    // expanded, so locating the term in a fully-expanded flatten gives its real row
    // index regardless of the async `expanded` state.
    useEffect(() => {
        const fid = ctx?.focusTermId;
        if (fid == null) return;
        const rows = flattenTree(tree, new Set(getAllNodeIds(tree)));
        const idx  = rows.findIndex((r) => r.node.id === fid);
        if (idx >= 0) {
            setPage(Math.floor(idx / perPage) + 1);
            setHighlightId(fid);
        }
        ctx.setFocusTermId(null); // one-shot
    }, [tree]);

    // Reset to page 1 only on explicit user actions (search / language / page-size
    // change), never on an edit/delete refetch — the admin must stay on the current page.
    useEffect(() => { setPage(1); }, [search, perPage, activeLang]);

    // Auto-clear the row flash.
    useEffect(() => {
        if (highlightId == null) return;
        const t = setTimeout(() => setHighlightId(null), 2000);
        return () => clearTimeout(t);
    }, [highlightId]);

    const allRows      = flattenTree(tree, expanded);
    const totalRows    = allRows.length;
    const paginatedRows = allRows.slice((page - 1) * perPage, page * perPage);

    const toggleExpand = useCallback((id) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    const toggleSelect = useCallback((id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    const toggleSelectAll = () => {
        if (selected.size === terms.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(terms.map((t) => t.id)));
        }
    };

    // --- Delete ---
    const deleteMutation = useMutation({
        mutationFn: ({ id, force }) => deleteDocCategory(id, { force }),
        onSuccess: () => {
            queryClient.invalidateQueries([QUERY_KEY]);
        },
        onError: (err) => toast.error(err?.message || __("Delete failed.", "betterdocs")),
    });

    const handleDelete = (node) => {
        Swal.fire({
            title: __("Delete this category?", "betterdocs"),
            text: __("You won't be able to revert this!", "betterdocs"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: __("Yes, delete it!", "betterdocs"),
            cancelButtonText: __("Cancel", "betterdocs"),
            customClass: { popup: "betterdocs-bulk-action-popup" },
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate({ id: node.id, force: true });
            }
        });
    };

    // --- HTML5 DnD ---
    const handleDragStart = (e, node) => {
        dragNodeRef.current = node;
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, node, rowRef) => {
        e.preventDefault();
        if (!dragNodeRef.current || dragNodeRef.current.id === node.id) return;
        if (isDescendant(dragNodeRef.current, node.id)) return;

        const rect = rowRef.current.getBoundingClientRect();
        const relY = e.clientY - rect.top;
        const pct  = relY / rect.height;
        const pos  = pct < 0.3 ? "before" : pct > 0.7 ? "after" : "inside";

        setDragOver({ id: node.id, pos });
    };

    const handleDragLeave = () => setDragOver(null);

    const handleDrop = (e, targetNode) => {
        e.preventDefault();
        const dragNode = dragNodeRef.current;
        dragNodeRef.current = null;
        setDragOver(null);

        if (!dragNode || dragNode.id === targetNode.id) return;
        if (!dragOver) return;
        if (isDescendant(dragNode, targetNode.id)) return;

        const { pos } = dragOver;
        const newParent = pos === "inside" ? targetNode.id : (targetNode.parent || 0);

        // QA-012: a drag has to persist the new sibling ORDER, not just the
        // parent. Previously a same-parent reorder wrote nothing (and a
        // parent change wrote only `parent`), so the order — stored in the
        // `doc_category_order` term meta — reverted on reload. Rebuild the
        // target parent's sibling list, splice the dragged node into its new
        // slot, and persist a fresh 1-based order for every row that moved.
        const siblings = allTerms
            .filter((t) => (t.parent || 0) === newParent && t.id !== dragNode.id)
            .sort((a, b) => Number(a.doc_category_order ?? 0) - Number(b.doc_category_order ?? 0));

        let insertIndex;
        if (pos === "inside") {
            insertIndex = siblings.length; // drop as the last child
        } else {
            const targetIdx = siblings.findIndex((t) => t.id === targetNode.id);
            insertIndex = targetIdx === -1
                ? siblings.length
                : (pos === "before" ? targetIdx : targetIdx + 1);
        }

        const ordered = [...siblings];
        ordered.splice(insertIndex, 0, dragNode);

        const writes = [];
        ordered.forEach((node, i) => {
            const newOrder      = i + 1;
            const parentChanged = node.id === dragNode.id && (node.parent || 0) !== newParent;
            const orderChanged  = Number(node.doc_category_order ?? 0) !== newOrder;
            if (parentChanged || orderChanged) {
                const payload = { doc_category_order: newOrder };
                if (parentChanged) {
                    payload.parent = newParent;
                }
                writes.push(updateDocCategory(node.id, payload));
            }
        });

        if (!writes.length) {
            queryClient.invalidateQueries([QUERY_KEY]);
            return;
        }

        Promise.all(writes)
            .then(() => queryClient.invalidateQueries([QUERY_KEY]))
            .catch((err) => toast.error(err?.message || __("Reorder failed.", "betterdocs")));
    };

    // --- Bulk delete ---
    const handleBulkDelete = () => {
        if (!selected.size) return;
        Swal.fire({
            title: __("Delete selected categories?", "betterdocs"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: __("Yes, delete!", "betterdocs"),
            cancelButtonText: __("Cancel", "betterdocs"),
            customClass: { popup: "betterdocs-bulk-action-popup" },
        }).then((result) => {
            if (result.isConfirmed) {
                Promise.all(
                    [...selected].map((id) => deleteDocCategory(id, { force: true })),
                )
                    .then(() => {
                        queryClient.invalidateQueries([QUERY_KEY]);
                        setSelected(new Set());
                        toast.success(__("Categories deleted.", "betterdocs"));
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
        <>
            {/* Toolbar lives OUTSIDE the card (sibling above it) — language tabs (left) + bulk actions (right) */}
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
                                    onClick={() => setActiveLang && setActiveLang("all")}
                                >
                                    {__("All languages", "betterdocs")}
                                    <span className="bd-dc-lang-tab-count">{allTerms.length}</span>
                                </button>
                                {langs.map((lang) => (
                                    <button
                                        key={lang.code}
                                        type="button"
                                        className={`bd-dc-lang-tab${activeLang === lang.code ? " bd-dc-lang-tab--active" : ""}`}
                                        onClick={() => setActiveLang && setActiveLang(lang.code)}
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
            {/* Table header — bd-dc-table-header--tree adds grip spacer alignment */}
            <div className="bd-dc-table-header bd-dc-table-header--tree">
                {/* Spacer matching .bd-dc-grip width so header checkbox aligns with row checkboxes */}
                <span className="bd-dc-grip-spacer" aria-hidden="true" />
                <input
                    type="checkbox"
                    className="bd-dc-checkbox"
                    checked={selected.size === terms.length && terms.length > 0}
                    onChange={toggleSelectAll}
                    aria-label={__("Select all", "betterdocs")}
                />
                <span className="bd-dc-col-name">{__("Name & Description", "betterdocs")}</span>
                {/* Extra table column header slot (e.g. Pro Knowledge Base column). */}
                {applyFilters("betterdocs_doc_category_table_header_column", null)}
                <span className="bd-dc-col-count">{__("Count", "betterdocs")}</span>
                <span className="bd-dc-col-actions">{__("Actions", "betterdocs")}</span>
            </div>

            {/* Rows */}
            <div
                className="bd-dc-table-body"
                onDragOver={(e) => e.preventDefault()}
            >
                {paginatedRows.length === 0 ? (
                    <div className="bd-dc-empty">
                        {__("No categories found.", "betterdocs")}
                    </div>
                ) : (
                    paginatedRows.map(({ node, ...rest }) => (
                        <TreeRow
                            key={node.id}
                            rowData={{ node, ...rest }}
                            isSelected={selected.has(node.id)}
                            isHighlighted={highlightId === node.id}
                            onSelect={toggleSelect}
                            onToggle={toggleExpand}
                            onEdit={onEdit}
                            onAddChild={onAddChild}
                            onDelete={handleDelete}
                            dragOver={dragOver}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        />
                    ))
                )}
            </div>

            </div>

            {/* Pagination — sits below the card, outside its border */}
            <Pagination
                total={totalRows}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
                onPerPageChange={setPerPage}
            />
        </>
    );
};

export default CategoryTree;
