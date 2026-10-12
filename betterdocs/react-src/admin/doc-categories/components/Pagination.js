import React from "react";
import { __ } from "@wordpress/i18n";

const FirstIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 17 5 12l6-5" />
        <path d="M18 17 12 12l6-5" />
    </svg>
);

const PrevIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m15 18-6-6 6-6" />
    </svg>
);

const NextIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m9 6 6 6-6 6" />
    </svg>
);

const LastIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 17 12 12 6 7" />
        <path d="M13 17 19 12 13 7" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

/**
 * Build per-page options dynamically from the total.
 * Base is always [10, 20, 50], then adds multiples of 100 until the last
 * option is >= total (so there's always one option that fits everything).
 * Examples: 70 → [10,20,50,100]  |  645 → [10,20,50,100,200,…,700]
 */
function buildPerPageOptions(total) {
    const options = [10, 20, 50];
    let n = 100;
    while (options[options.length - 1] < total) {
        options.push(n);
        n += 100;
    }
    return options;
}

const buildPageList = (page, totalPages) => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1];
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
};

const Pagination = ({ total, page, perPage, onPageChange, onPerPageChange }) => {
    const totalPages      = Math.ceil(total / perPage);
    // Hide the whole pagination (info + rows-per-page + nav) on a single page.
    if (!total || totalPages <= 1) return null;

    const showNav         = totalPages > 1;
    const perPageOptions  = buildPerPageOptions(total);

    const start = (page - 1) * perPage + 1;
    const end   = Math.min(page * perPage, total);
    const pageList = buildPageList(page, totalPages);

    const handlePerPageChange = (e) => {
        onPerPageChange(Number(e.target.value));
        onPageChange(1);
    };

    return (
        <div className="bd-dc-pagination">
            {/* Left: "Showing X–Y of Z" + divider + Rows per page */}
            <div className="bd-dc-pagination-left">
                <span className="bd-dc-pagination-info">
                    {__("Showing", "betterdocs")}{" "}
                    <strong>{start}–{end}</strong>{" "}
                    {__("of", "betterdocs")}{" "}
                    <strong>{total}</strong>
                </span>

                <span className="bd-dc-pagination-divider" aria-hidden="true" />

                <div className="bd-dc-rows-per-page">
                    <span className="bd-dc-rows-label">{__("Rows per page", "betterdocs")}</span>
                    <div className="bd-dc-per-page-wrapper">
                        <select
                            className="bd-dc-per-page-select"
                            value={perPage}
                            onChange={handlePerPageChange}
                            aria-label={__("Rows per page", "betterdocs")}
                        >
                            {perPageOptions.map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                        <span className="bd-dc-per-page-chevron" aria-hidden="true">
                            <ChevronDownIcon />
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: first/prev + page numbers (with ellipsis) + next/last */}
            {showNav && <div className="bd-dc-pagination-nav">
                <button
                    type="button"
                    className="bd-dc-page-btn"
                    disabled={page === 1}
                    onClick={() => onPageChange(1)}
                    aria-label={__("First page", "betterdocs")}
                ><FirstIcon /></button>
                <button
                    type="button"
                    className="bd-dc-page-btn"
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                    aria-label={__("Previous page", "betterdocs")}
                ><PrevIcon /></button>

                {pageList.map((item, idx) =>
                    item === "…" ? (
                        <span key={`ellipsis-${idx}`} className="bd-dc-page-ellipsis">…</span>
                    ) : (
                        <button
                            key={item}
                            type="button"
                            className={`bd-dc-page-btn bd-dc-page-btn--num${item === page ? " bd-dc-page-btn--active" : ""}`}
                            onClick={() => item !== page && onPageChange(item)}
                            aria-label={`${__("Page", "betterdocs")} ${item}`}
                            aria-current={item === page ? "page" : undefined}
                        >{item}</button>
                    )
                )}

                <button
                    type="button"
                    className="bd-dc-page-btn"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    aria-label={__("Next page", "betterdocs")}
                ><NextIcon /></button>
                <button
                    type="button"
                    className="bd-dc-page-btn"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(totalPages)}
                    aria-label={__("Last page", "betterdocs")}
                ><LastIcon /></button>
            </div>}
        </div>
    );
};

export default Pagination;
