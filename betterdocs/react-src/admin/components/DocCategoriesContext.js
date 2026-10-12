import React, { createContext, useContext, useState, useEffect } from "react";

const DocCategoriesContext = createContext(null);

export const DocCategoriesProvider = ({ children }) => {
    const [slideOpen, setSlideOpen]       = useState(false);

    // Auto-open the "Add New Category" slide-over when arrived here from the
    // empty-state "Create A New Category" button (?betterdocs_action=new-category).
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get("betterdocs_action") === "new-category") {
                setSlideOpen(true);
            }
        } catch (e) {}
    }, []);
    const [editNode, setEditNode]         = useState(null);
    const [defaultParent, setDefaultParent] = useState(null);
    const [totalCount, setTotalCount]     = useState(null);
    // One-shot id of a just-created term: the tree jumps to its page and flashes it.
    const [focusTermId, setFocusTermId]   = useState(null);
    // Pre-fill for the "add translation" create flow: { lang, translationOf }.
    const [createMeta, setCreateMeta]     = useState(null);

    const openCreate = (parent = null, meta = null) => {
        setEditNode(null);
        setDefaultParent(parent);
        setCreateMeta(meta);
        setSlideOpen(true);
    };

    const openEdit = (node) => {
        setEditNode(node);
        setDefaultParent(null);
        setCreateMeta(null);
        setSlideOpen(true);
    };

    const close = () => {
        setSlideOpen(false);
        setEditNode(null);
        setDefaultParent(null);
        setCreateMeta(null);
    };

    return (
        <DocCategoriesContext.Provider
            value={{ slideOpen, editNode, defaultParent, totalCount, focusTermId, createMeta, openCreate, openEdit, close, setTotalCount, setFocusTermId }}
        >
            {children}
        </DocCategoriesContext.Provider>
    );
};

export const useDocCategories = () => useContext(DocCategoriesContext);
