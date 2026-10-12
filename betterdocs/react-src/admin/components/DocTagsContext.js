import React, { createContext, useContext, useState } from "react";

const DocTagsContext = createContext(null);

export const DocTagsProvider = ({ children }) => {
    const [slideOpen, setSlideOpen]   = useState(false);
    const [editTag, setEditTag]       = useState(null);
    const [totalCount, setTotalCount] = useState(null);
    // One-shot id of a just-created tag: the list jumps to its page and flashes it.
    const [focusTagId, setFocusTagId] = useState(null);
    // Pre-fill for the "add translation" create flow: { lang, translationOf }.
    const [createMeta, setCreateMeta] = useState(null);

    const openCreate = (meta = null) => {
        setEditTag(null);
        setCreateMeta(meta);
        setSlideOpen(true);
    };

    const openEdit = (tag) => {
        setEditTag(tag);
        setCreateMeta(null);
        setSlideOpen(true);
    };

    const close = () => {
        setSlideOpen(false);
        setEditTag(null);
        setCreateMeta(null);
    };

    return (
        <DocTagsContext.Provider
            value={{ slideOpen, editTag, totalCount, focusTagId, createMeta, openCreate, openEdit, close, setTotalCount, setFocusTagId }}
        >
            {children}
        </DocTagsContext.Provider>
    );
};

export const useDocTags = () => useContext(DocTagsContext);
