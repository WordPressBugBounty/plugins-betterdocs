import { __, _n, sprintf } from "@wordpress/i18n";
import React from "react";

import { ReactComponent as Directions } from "./assets/images/all-directions.svg";
import { ReactComponent as Delete } from "./assets/images/delete.svg";
import { ReactComponent as Edit } from "./assets/images/edit.svg";
import { ReactComponent as Magic } from "./assets/images/magic.svg";

/**
 * Design-accurate, inert mock of Pro's Glossaries screen. It exists only to sit
 * blurred behind the lock panel, so nothing here fetches or reacts — it renders
 * the very same `bd-faq-ctg-*` card markup (drag handle, title, "Available in N
 * docs" pill, edit / AI / delete actions, status toggle, accordion) and the same
 * SVG icons the real Glossaries screen uses (components/Glossary.js), so the
 * blurred picture matches the real screen exactly.
 */

const ChevronIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M4 5.5L7 8.5L10 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const TERMS = [
    { name: __( "API", "betterdocs" ), count: 47 },
    { name: __( "Endpoint", "betterdocs" ), count: 12 },
    { name: __( "Knowledge Base", "betterdocs" ), count: 8 },
    { name: __( "OAuth", "betterdocs" ), count: 6 },
    { name: __( "Rate Limit", "betterdocs" ), count: 5 },
    { name: __( "SLA", "betterdocs" ), count: 4 },
    { name: __( "Webhook", "betterdocs" ), count: 3 }
];

export default function GlossaryMock() {
    return (
        <div className="bd-gloss-mock">
            <div className="bd-faq-ctg-list">
                <div className="bd-faq-ctg-list-droppable">
                    { TERMS.map( ( t, i ) => (
                        <div className="bd-faq-ctg" key={ i }>
                            <div className="bd-faq-ctg-head">
                                <button type="button" className="bd-faq-button-reset bd-faq-ctg-drag-button" tabIndex={ -1 }>
                                    <Directions />
                                </button>
                                <h3 className="bd-faq-ctg-title">
                                    { t.name }
                                    <span>
                                        { sprintf(
                                            _n( "Available in %d doc", "Available in %d docs", t.count, "betterdocs" ),
                                            t.count
                                        ) }
                                    </span>
                                </h3>
                                <button type="button" className="bd-faq-button-reset bd-faq-action-button" tabIndex={ -1 }>
                                    <Edit />
                                </button>
                                <button type="button" className="bd-faq-button-reset bd-faq-action-button magic-icon" tabIndex={ -1 }>
                                    <Magic />
                                </button>
                                <button type="button" className="bd-faq-button-reset bd-faq-action-button" tabIndex={ -1 }>
                                    <Delete />
                                </button>
                                <span className="bd-faq-toggler">
                                    <input type="checkbox" checked readOnly className="checkbox" />
                                    <span className="knobs"></span>
                                    <span className="layer"></span>
                                </span>
                                <button type="button" className="bd-faq-button-reset bd-faq-accordion-icon" tabIndex={ -1 }>
                                    <ChevronIcon />
                                </button>
                            </div>
                        </div>
                    ) ) }
                </div>
            </div>
        </div>
    );
}
