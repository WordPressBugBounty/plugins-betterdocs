import React, { useRef, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";

const EditIcon = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <path d="M8.5 1.5L11.5 4.5L4 12H1V9L8.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
);

// Delete glyph shared with the AI Chatbot Logs row actions, so the control
// reads the same in every admin table. Drawn on a 24 viewBox at 16px
// (effective stroke ~1.33px) rather than the 13px/1.3 glyphs beside it.
const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const TagRow = ({
    tag,
    isSelected,
    isHighlighted,
    onSelect,
    onEdit,
    onDelete,
    quickEditId,
    quickEditProps,
}) => {
    const rowRef = useRef(null);

    // Bring a freshly created tag into view after the list jumps to its page.
    useEffect(() => {
        if (isHighlighted && rowRef.current) {
            rowRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
    }, [isHighlighted]);

    return (
        <>
        <div
            ref={rowRef}
            className={[
                "bd-dc-row",
                "bd-dt-row",
                isSelected ? "bd-dc-row--selected" : "",
                isHighlighted ? "bd-dc-row--highlight" : "",
            ].filter(Boolean).join(" ")}
        >
            <input
                type="checkbox"
                className="bd-dc-checkbox"
                checked={isSelected}
                onChange={() => onSelect(tag.id)}
                aria-label={__("Select", "betterdocs")}
            />

            <div className="bd-dc-cell-name">
                <span className="bd-dc-name">{decodeEntities(tag.name)}</span>
                <div className="bd-dc-meta-row">
                    {tag.slug && <span className="bd-dc-slug-badge">/{tag.slug}</span>}
                </div>
                <span className={`bd-dc-desc${!tag.description ? " bd-dc-desc--empty" : ""}`}>
                    {tag.description
                        ? decodeEntities(tag.description)
                        : __("No description", "betterdocs")}
                </span>
            </div>

            <div className="bd-dc-cell-count">
                <span className="bd-dc-count-badge">{tag.count}</span>
            </div>

            <div className="bd-dc-cell-actions">
                <button
                    type="button"
                    className="bd-dc-row-action bd-dc-row-action-icon"
                    onClick={() => onEdit(tag)}
                    title={__("Edit", "betterdocs")}
                    aria-label={__("Edit tag", "betterdocs")}
                >
                    <EditIcon />
                </button>
                <button
                    type="button"
                    className="bd-dc-row-action bd-dc-row-action-icon bd-dc-row-action-delete"
                    onClick={() => onDelete(tag)}
                    title={__("Delete", "betterdocs")}
                    aria-label={__("Delete tag", "betterdocs")}
                >
                    <TrashIcon />
                </button>
            </div>
        </div>

        {quickEditId === tag.id && quickEditProps && (
            <div className="bd-dc-quick-edit-wrap">
                {/* QuickEditPanel preserved for potential future use */}
            </div>
        )}
        </>
    );
};

export default TagRow;
