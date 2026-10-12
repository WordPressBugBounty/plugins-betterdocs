import React from "react";

// Loading skeleton that mirrors the real tree-table / tag-list layout.
// variant="tree" renders the connector + chevron column (Doc Categories);
// variant="flat" omits them (Doc Tags). Structural classes are reused from
// _tree-table.scss so the skeleton aligns pixel-for-pixel with the loaded UI.

const ROW_COUNT = 6;

// Varied widths keep the shimmer from looking like a uniform grid
const TITLE_WIDTHS = ["46%", "34%", "52%", "40%", "30%", "48%"];
const META_WIDTHS  = ["62%", "70%", "55%", "66%", "58%", "72%"];

const SkeletonRow = ({ variant, index }) => (
    <div className="bd-dc-row bd-dc-row--skel">
        <span className="bd-dc-grip" aria-hidden="true">
            <span className="bd-dc-skel bd-dc-skel-grip" />
        </span>
        <span className="bd-dc-skel bd-dc-skel-check" />

        {variant === "tree" && (
            <>
                <span className="bd-dc-skel-connector" aria-hidden="true" />
                <span className="bd-dc-skel bd-dc-skel-chevron" />
            </>
        )}

        <span className="bd-dc-cell-name">
            <span
                className="bd-dc-skel bd-dc-skel-line bd-dc-skel-line--title"
                style={{ width: TITLE_WIDTHS[index % TITLE_WIDTHS.length] }}
            />
            <span
                className="bd-dc-skel bd-dc-skel-line bd-dc-skel-line--meta"
                style={{ width: META_WIDTHS[index % META_WIDTHS.length] }}
            />
        </span>

        <span className="bd-dc-cell-count">
            <span className="bd-dc-skel bd-dc-skel-count" />
        </span>

        <span className="bd-dc-cell-actions">
            <span className="bd-dc-skel bd-dc-skel-action" />
            <span className="bd-dc-skel bd-dc-skel-action" />
            {variant === "tree" && <span className="bd-dc-skel bd-dc-skel-action" />}
        </span>
    </div>
);

const TableSkeleton = ({ variant = "flat" }) => {
    const isTree = variant === "tree";
    return (
        <>
            {/* Toolbar lives outside the card (sibling above it) */}
            <div className="bd-dc-toolbar" aria-busy="true">
                <div className="bd-dc-toolbar-left">
                    <span className="bd-dc-skel bd-dc-skel-toolbar-chip" />
                </div>
                <div className="bd-dc-toolbar-right">
                    <span className="bd-dc-skel bd-dc-skel-toolbar-select" />
                    <span className="bd-dc-skel bd-dc-skel-toolbar-apply" />
                </div>
            </div>

            <div className="bd-dc-tree-card" aria-busy="true" aria-live="polite">
            {/* Header */}
            <div className={`bd-dc-table-header${isTree ? " bd-dc-table-header--tree" : ""}`}>
                {isTree && <span className="bd-dc-grip-spacer" aria-hidden="true" />}
                <span className="bd-dc-skel bd-dc-skel-check" />
                <span className="bd-dc-col-name" />
                <span className="bd-dc-col-count" />
                <span className="bd-dc-col-actions" />
            </div>

            {/* Rows */}
            <div className="bd-dc-table-body">
                {Array.from({ length: ROW_COUNT }).map((_, i) => (
                    <SkeletonRow key={i} variant={variant} index={i} />
                ))}
            </div>
            </div>
        </>
    );
};

export default TableSkeleton;
