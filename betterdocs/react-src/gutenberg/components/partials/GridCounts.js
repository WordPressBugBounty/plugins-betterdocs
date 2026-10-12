import React from "react";
import { sprintf, _n } from "@wordpress/i18n";

const GridCounts = ({ count, attributes }) => {
    let { prefix = "", suffix = "", suffixSingular = "", layout } = attributes;

    return (
        <div data-count={count} className="betterdocs-category-items-counts">
            <span>
                {sprintf(
                    _n(
                        '%1$s %2$d %3$s',
                        '%1$s %2$d %3$s',
                        count,
                        "betterdocs",
                    ),
                    prefix,
                    count,
                    count === 1 ? suffixSingular : suffix
                )?.trim()}{" "}
            </span>
        </div>
    );
};

export default GridCounts;
