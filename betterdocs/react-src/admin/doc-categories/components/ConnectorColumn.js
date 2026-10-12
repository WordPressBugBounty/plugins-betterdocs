import React from "react";

const INDENT = 28;

/**
 * CSS-based tree connector column. Uses absolutely-positioned spans so
 * vertical lines span the full row height regardless of row content.
 * The parent .bd-dc-connector must have align-self:stretch (set in SCSS).
 */
const ConnectorColumn = ({ depth, isLast, parentLastChain }) => {
    if (depth === 0) return <span style={{ width: 8, flexShrink: 0 }} />;

    const totalWidth = depth * INDENT;

    return (
        <span className="bd-dc-connector" style={{ width: totalWidth }}>
            {/* Vertical continuation lines for ancestor levels that are not last */}
            {parentLastChain.map((isAncestorLast, i) =>
                !isAncestorLast ? (
                    <span
                        key={i}
                        className="bd-dc-connector-vline"
                        style={{ left: i * INDENT + INDENT / 2 - 1 }}
                    />
                ) : null,
            )}

            {/* L-shape for the current node:
                - Not last: solid vertical line + horizontal arm at center
                - Last: vertical line from top to center only (gradient masks bottom half) */}
            <span
                className={`bd-dc-connector-lshape${isLast ? " bd-dc-connector-lshape--last" : ""}`}
                style={{ left: (depth - 1) * INDENT + INDENT / 2 - 1 }}
            />
        </span>
    );
};

export default ConnectorColumn;
