import React, { createContext, useContext, useState, useCallback } from 'react';

const FAQContext = createContext();

export const FAQProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [reFetchCategories, setReFetchCategories] = useState(() => () => {});
    // Bumped on any FAQ activity (add / delete / duplicate / draft toggle) so
    // the stat cards re-derive even when the change is to an uncategorized FAQ
    // (which doesn't alter the categories query the cards otherwise watch).
    const [statsVersion, setStatsVersion] = useState(0);
    const bumpStats = useCallback(() => setStatsVersion((v) => v + 1), []);

    // One-shot "reveal this FAQ" signal, set after a FAQ is created
    // (?faq_action=create) or moved into a group via Edit. Shape:
    // { groupId, faqId } where groupId ("uncategorized" | term id) drives the
    // pagination jump + group expand, and faqId is the FAQ row that then
    // flashes. Mirrors the Doc Categories / Doc Tags panels' focusTermId.
    // `highlightGroupId` = group currently being expanded; `highlightFaqId` =
    // FAQ row currently flashing (consumed by the row once it renders).
    const [focusTarget, setFocusTarget] = useState(null);
    const [highlightGroupId, setHighlightGroupId] = useState(null);
    const [highlightFaqId, setHighlightFaqId] = useState(null);

    return (
        <FAQContext.Provider value={{ categories, setCategories, reFetchCategories, setReFetchCategories, statsVersion, bumpStats, focusTarget, setFocusTarget, highlightGroupId, setHighlightGroupId, highlightFaqId, setHighlightFaqId }}>
            {children}
        </FAQContext.Provider>
    );
};

export const useFAQ = () => {
    return useContext(FAQContext);
};
