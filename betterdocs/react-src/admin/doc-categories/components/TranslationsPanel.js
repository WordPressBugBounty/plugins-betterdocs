import React, { useEffect, useState, useRef } from "react";
import { __ } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";
import { getTermTranslations } from "../utils/api";
import SlideoverSelect from "./SlideoverSelect";

const GlobeIcon = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
        <ellipse cx="6.5" cy="6.5" rx="2.5" ry="5.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1 6.5H12" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1.5 4H11.5M1.5 9H11.5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
    </svg>
);

/**
 * WPML/Polylang translation panel for the slide-over: Language select +
 * "This is a translation of" (for non-default languages) + a "Translate" list of
 * the other languages with their existing translation or an "add" link.
 *
 * The parent owns `lang` + `translationOf` (sent to the server on save); this
 * component fetches the group/candidates and renders the controls.
 */
const TranslationsPanel = ({
    taxonomy,
    editNode,
    lang,
    setLang,
    translationOf,
    setTranslationOf,
    onAddTranslation,
}) => {
    const languages   = window.betterdocs_admin?.languages || [];
    const [data, setData] = useState({
        default_lang: window.betterdocs_admin?.current_admin_language || "",
        translations: {},
        candidates: [],
        translation_of: 0,
    });
    // Track which term/lang we've already seeded translationOf for, so a user's
    // dropdown change isn't overwritten by a refetch.
    const seededRef = useRef(null);

    useEffect(() => {
        if (!languages.length) return;
        const params = { taxonomy };
        if (editNode?.id) params.term_id = editNode.id;
        if (lang) params.lang = lang;

        let active = true;
        getTermTranslations(params)
            .then((res) => {
                if (!active || !res || res.enabled === false) return;
                setData(res);
                // Seed the dropdown from the server once per term load (don't clobber edits).
                const seedKey = `${editNode?.id || "new"}:${lang}`;
                if (seededRef.current !== seedKey) {
                    seededRef.current = seedKey;
                    if (translationOf == null && res.translation_of) {
                        setTranslationOf(res.translation_of);
                    }
                }
            })
            .catch(() => {});
        return () => { active = false; };
    }, [taxonomy, editNode?.id, lang]);

    if (!languages.length) return null;

    const defaultLang  = data.default_lang;
    const translations = data.translations || {};
    const candidates   = data.candidates || [];
    const showTranslationOf = lang && lang !== defaultLang;

    return (
        <div className="bd-dc-lang-panel">
            <div className="bd-dc-lang-panel-title">
                <GlobeIcon />
                {__("Language", "betterdocs")}
            </div>

            <div className="bd-dc-field">
                <SlideoverSelect
                    value={lang}
                    onChange={(v) => setLang(v)}
                    placeholder={__("— Select —", "betterdocs")}
                    options={languages.map((l) => ({ value: l.code, label: l.label }))}
                />
            </div>

            {showTranslationOf && (
                <div className="bd-dc-field">
                    <label className="bd-dc-label">{__("This is a translation of", "betterdocs")}</label>
                    <SlideoverSelect
                        value={translationOf || 0}
                        onChange={(v) => setTranslationOf(Number(v))}
                        options={[
                            { value: 0, label: __("— None —", "betterdocs") },
                            ...candidates.map((c) => ({ value: c.term_id, label: decodeEntities(c.name) })),
                        ]}
                    />
                </div>
            )}

            {/* Translate: other languages — existing translation or an "add" link */}
            <div className="bd-dc-translate">
                <div className="bd-dc-translate-head">{__("Translate", "betterdocs")}</div>
                {languages
                    .filter((l) => l.code !== lang)
                    .map((l) => {
                        const existing = translations[l.code];
                        return (
                            <div key={l.code} className="bd-dc-translate-row">
                                <span className="bd-dc-translate-lang">{l.label}</span>
                                {existing ? (
                                    <span className="bd-dc-translate-name">{decodeEntities(existing.name)}</span>
                                ) : (
                                    <button
                                        type="button"
                                        className="bd-dc-translate-add"
                                        onClick={() => onAddTranslation && onAddTranslation(l.code)}
                                    >
                                        {__("add", "betterdocs")}
                                    </button>
                                )}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default TranslationsPanel;
