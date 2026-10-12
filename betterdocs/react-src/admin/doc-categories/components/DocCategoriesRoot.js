import React, { useMemo, useEffect, useState } from "react";
import { __ } from "@wordpress/i18n";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { getDocCategories, createDocCategory, updateDocCategory, setTermLanguage } from "../utils/api";
import { buildTree, makeUniqueSlug } from "../utils/treeUtils";
import { useDocCategories } from "~betterdocs/admin/components/DocCategoriesContext";
import CategoryTree from "./CategoryTree";
import SlideOverForm from "./SlideOverForm";
import TableSkeleton from "./TableSkeleton";

const QUERY_KEY = "doc-categories";

const DocCategoriesRoot = () => {
    const ctx          = useDocCategories();
    const outletCtx    = useOutletContext() || [];
    const search       = outletCtx[5] || "";
    const queryClient  = useQueryClient();
    const isMultilingual = !!(window.betterdocs_admin?.is_multilingual);

    const handleAddTranslation = (langCode) => {
        const sourceId = ctx?.editNode?.id;
        ctx?.close();
        ctx?.openCreate(null, { lang: langCode, translationOf: sourceId });
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEY],
        queryFn: () => getDocCategories({ per_page: 100 }).then((r) => r.data),
    });

    const terms = data || [];

    // Active language filter (WPML/Polylang). Default to the language currently
    // selected in the admin language bar (current_admin_language) so the list
    // opens on that language; fall back to "all" when none is selected or it
    // isn't among the known languages.
    const [activeLang, setActiveLang] = useState(() => {
        const langs = window.betterdocs_admin?.languages || [];
        const current = window.betterdocs_admin?.current_admin_language || "";
        return isMultilingual && current && langs.some((l) => l.code === current)
            ? current
            : "all";
    });

    // Keep header count badge in sync
    useEffect(() => {
        if (ctx && data !== undefined) ctx.setTotalCount(terms.length);
    }, [terms.length]);

    const filteredTerms = useMemo(() => {
        // Language filter first (on the flat set, so buildTree promotes any
        // matching child whose parent is a different language to a root).
        const byLang = activeLang === "all"
            ? terms
            : terms.filter((t) => (t.lang || "") === activeLang);

        if (!search.trim()) return byLang;
        const q = search.toLowerCase();
        return byLang.filter(
            (t) =>
                t.name.toLowerCase().includes(q) ||
                t.slug.toLowerCase().includes(q) ||
                (t.description || "").toLowerCase().includes(q),
        );
    }, [terms, search, activeLang]);

    const tree = useMemo(() => buildTree(filteredTerms), [filteredTerms]);

    const saveMutation = useMutation({
        mutationFn: (payload) =>
            ctx?.editNode
                ? updateDocCategory(ctx.editNode.id, payload)
                : createDocCategory(payload),
        onSuccess: (result, variables) => {
            const wasCreate = !ctx?.editNode; // capture before close() clears editNode
            const termId    = wasCreate ? result?.id : ctx?.editNode?.id;

            const finalize = () => {
                queryClient.invalidateQueries([QUERY_KEY]);
                ctx?.close();
                // Focus the saved term on create AND edit: after the refetch
                // re-sorts by doc_category_order, this jumps to the page now
                // holding the term and flashes it — so an Order change visibly
                // moves the category to its new position (matching the create UX).
                if (termId) ctx?.setFocusTermId(termId);
                toast.success(
                    wasCreate
                        ? __("Category created.", "betterdocs")
                        : __("Category updated.", "betterdocs"),
                );
            };

            // Authoritative language + translation-group write (WPML/Polylang).
            if (isMultilingual && variables?.lang && termId) {
                setTermLanguage({
                    taxonomy:        "doc_category",
                    term_id:         termId,
                    lang:            variables.lang,
                    translation_of:  variables.translationOf || 0,
                }).then(finalize).catch(finalize);
            } else {
                finalize();
            }
        },
        onError: (err) =>
            toast.error(err?.message || __("Save failed.", "betterdocs")),
    });

    const handleSave = (payload) => {
        const existingSlugs = terms.map((t) => t.slug);
        const ownSlug = ctx?.editNode?.slug ?? null;
        const finalPayload = {
            ...payload,
            slug:   makeUniqueSlug(payload.slug, existingSlugs, ownSlug),
            parent: payload.parent || ctx?.defaultParent?.id || 0,
        };
        saveMutation.mutate(finalPayload);
    };

    return (
        <div className="bd-dc-root">
            {isLoading ? (
                <TableSkeleton variant="tree" />
            ) : isError ? (
                <div className="bd-dc-error">{__("Failed to load categories.", "betterdocs")}</div>
            ) : terms.length === 0 ? (
                <div className="bd-dc-tree-card">
                    <div className="bd-dc-empty">
                        {__('No categories yet. Click “Add New Category” to create one.', "betterdocs")}
                    </div>
                </div>
            ) : (
                <CategoryTree
                    terms={filteredTerms}
                    allTerms={terms}
                    tree={tree}
                    search={search}
                    activeLang={activeLang}
                    setActiveLang={setActiveLang}
                    onEdit={(node) => ctx?.openEdit(node)}
                    onAddChild={(parentNode) => {
                        // pre-fill parent in the slide-over
                        if (ctx) { ctx.openCreate(parentNode); }
                    }}
                />
            )}

            {/* Slide-over controlled entirely by DocCategoriesContext */}
            {ctx && (
                <SlideOverForm
                    isOpen={ctx.slideOpen}
                    onClose={ctx.close}
                    onSave={handleSave}
                    editNode={ctx.editNode}
                    defaultParent={ctx.defaultParent}
                    allTerms={tree}
                    isSaving={saveMutation.isPending}
                    createMeta={ctx.createMeta}
                    onAddTranslation={handleAddTranslation}
                />
            )}
        </div>
    );
};

export default DocCategoriesRoot;
