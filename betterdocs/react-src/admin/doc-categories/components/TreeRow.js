import React, { useRef, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import { applyFilters } from "@wordpress/hooks";
import { decodeEntities } from "@wordpress/html-entities";
import ConnectorColumn from "./ConnectorColumn";

// Right-pointing chevron from Claude design — rotates 90° when expanded
const ChevronIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m9 6 6 6-6 6" />
    </svg>
);

const GripIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="9"  cy="6"  r="1.4" />
        <circle cx="9"  cy="12" r="1.4" />
        <circle cx="9"  cy="18" r="1.4" />
        <circle cx="15" cy="6"  r="1.4" />
        <circle cx="15" cy="12" r="1.4" />
        <circle cx="15" cy="18" r="1.4" />
    </svg>
);

const PlusIcon = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <path d="M6.5 1V12M1 6.5H12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

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

const TreeRow = ({
    rowData,
    isSelected,
    isHighlighted,
    onSelect,
    onToggle,
    onEdit,
    onAddChild,
    onDelete,
    dragOver,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
}) => {
    const { node, depth, isLast, parentLastChain, hasChildren, isOpen } = rowData;
    const rowRef = useRef(null);

    const dropZone = dragOver?.id === node.id ? dragOver.pos : null;
    const childCount = node.children?.length || 0;

    // Bring a freshly created row into view after the page jumps to it.
    useEffect(() => {
        if (isHighlighted && rowRef.current) {
            rowRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
    }, [isHighlighted]);

    return (
        <div
            ref={rowRef}
            className={[
                "bd-dc-row",
                isSelected ? "bd-dc-row--selected" : "",
                isHighlighted ? "bd-dc-row--highlight" : "",
                dropZone === "before"  ? "bd-dc-row--drop-before"  : "",
                dropZone === "after"   ? "bd-dc-row--drop-after"   : "",
                dropZone === "inside"  ? "bd-dc-row--drop-inside"  : "",
            ].filter(Boolean).join(" ")}
            draggable
            onDragStart={(e) => onDragStart(e, node)}
            onDragOver={(e)  => onDragOver(e, node, rowRef)}
            onDragLeave={onDragLeave}
            onDrop={(e)      => onDrop(e, node)}
            data-id={node.id}
        >
            {/* Grip */}
            <span className="bd-dc-grip" title={__("Drag to reorder", "betterdocs")}>
                <GripIcon />
            </span>

            {/* Checkbox */}
            <input
                type="checkbox"
                className="bd-dc-checkbox"
                checked={isSelected}
                onChange={() => onSelect(node.id)}
                aria-label={__("Select", "betterdocs")}
            />

            {/* Connector lines */}
            <ConnectorColumn depth={depth} isLast={isLast} parentLastChain={parentLastChain} />

            {/* Chevron expand/collapse — always green when node has children */}
            {hasChildren ? (
                <button
                    type="button"
                    className={`bd-dc-chevron ${isOpen ? "bd-dc-chevron--open" : ""}`}
                    onClick={() => onToggle(node.id)}
                    aria-label={isOpen ? __("Collapse", "betterdocs") : __("Expand", "betterdocs")}
                >
                    <ChevronIcon />
                </button>
            ) : (
                <span className="bd-dc-chevron-placeholder" />
            )}

            {/* Category icon thumbnail */}
            {node.thumbnail && (
                <span className="bd-dc-row-icon" aria-hidden="true">
                    <img src={node.thumbnail} alt="" />
                </span>
            )}

            {/* Name & meta */}
            <div className="bd-dc-cell-name">
                <span
                    className="bd-dc-name"
                    onClick={() => onToggle(node.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && onToggle(node.id)}
                >
                    {decodeEntities(node.name)}
                </span>

                <div className="bd-dc-meta-row">
                    {node.slug && (
                        <span className="bd-dc-slug-badge">/{node.slug}</span>
                    )}
                    {hasChildren && childCount > 0 && (
                        <span className="bd-dc-children-count">
                            &middot; {childCount}{" "}
                            {childCount === 1
                                ? __("child", "betterdocs")
                                : __("children", "betterdocs")}
                        </span>
                    )}
                </div>

                <span className={`bd-dc-desc${!node.description ? " bd-dc-desc--empty" : ""}`}>
                    {node.description
                        ? decodeEntities(node.description)
                        : __("No description", "betterdocs")}
                </span>
            </div>

            {/* Extra table column cell slot (e.g. Pro Knowledge Base column). */}
            {applyFilters("betterdocs_doc_category_table_row_column", null, node)}

            {/* Count badge */}
            <div className="bd-dc-cell-count">
                <span className="bd-dc-count-badge">{node.count}</span>
            </div>

            {/* Row actions — icon-only buttons, visible on row hover */}
            <div className="bd-dc-cell-actions">
                <button
                    type="button"
                    className="bd-dc-row-action bd-dc-row-action-icon"
                    onClick={() => onAddChild(node)}
                    title={__("Add child", "betterdocs")}
                    aria-label={__("Add child category", "betterdocs")}
                >
                    <PlusIcon />
                </button>
                <button
                    type="button"
                    className="bd-dc-row-action bd-dc-row-action-icon"
                    onClick={() => onEdit(node)}
                    title={__("Edit", "betterdocs")}
                    aria-label={__("Edit category", "betterdocs")}
                >
                    <EditIcon />
                </button>
                <button
                    type="button"
                    className="bd-dc-row-action bd-dc-row-action-icon bd-dc-row-action-delete"
                    onClick={() => onDelete(node)}
                    title={__("Delete", "betterdocs")}
                    aria-label={__("Delete category", "betterdocs")}
                >
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};

export default TreeRow;
