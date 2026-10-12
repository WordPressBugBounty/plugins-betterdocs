import { __ } from "@wordpress/i18n";
import React, { useEffect } from "react";
import UncategorizedFaq from "./UncategorizedFaq";
import { scrollExpandedIntoView } from "../utils/function";

// icons
import { ReactComponent as DownArrow } from "./../assets/images/down-arrow.svg";
import FaqLoader from "../utils/FaqLoader";

const UncategorizedFaqList = ({
    categoriesLoading,
    allFaqCategories,
    reFetchCategories,
    allUncategorizedFaq,
    setFetchUncategorizedFaq,
    categoryExpanded,
    setCategoryExpanded,
    setCreateFaqAt,
    faqExpanded,
    setFaqExpanded,
    setReFetchFaqForCategory,
    uncategorizedFaqLoading,
    uncategorizedFaqFetching,
    highlightGroupId,
}) => {
    // Focus target after a FAQ is created without a group: open + scroll the
    // panel so the new FAQ row (which flashes itself) is visible.
    const isHighlighted = highlightGroupId === "uncategorized";
    useEffect(() => {
        if (!isHighlighted) return;
        setCategoryExpanded("uncategorized");
        setFetchUncategorizedFaq && setFetchUncategorizedFaq();
        scrollExpandedIntoView("ctg-uncategorized");
    }, [isHighlighted]);

    const handleShow = () => {
        if (categoryExpanded == "uncategorized") {
            setCategoryExpanded(undefined);
        } else {
            setCategoryExpanded("uncategorized");
            // Fetch on open (like the categorized groups) so the loader shows.
            setFetchUncategorizedFaq && setFetchUncategorizedFaq();
        }
    };

    return (
        <div className="bd-faq-ctg" data-bd-expand-id="ctg-uncategorized">
            <div className="bd-faq-ctg-head">
                <div
                    className="bd-faq-ctg-title-wrap"
                    onClick={() => handleShow()}
                    style={{ cursor: "pointer" }}
                >
                    <h3 className="bd-faq-ctg-title">
                        {__("Uncategorized", "betterdocs")}
                    </h3>
                    {allUncategorizedFaq?.length > 0 && (
                        <span className="bd-faq-ctg-meta">
                            <span className="bd-faq-ctg-meta-count">
                                {`${allUncategorizedFaq.length} `}
                                {allUncategorizedFaq.length === 1
                                    ? __("question", "betterdocs")
                                    : __("questions", "betterdocs")}
                            </span>
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    className={`bd-faq-accordion-icon ${categoryExpanded == "uncategorized" ? "active" : ""
                        }`}
                    onClick={() => handleShow()}
                >
                    <DownArrow />
                </button>
            </div>
            <div
                className={`bd-faq-category-body ${categoryExpanded == "uncategorized" ? "active" : ""
                    }`}
            >
                <div style={{ overflow: "hidden" }}>
                    <div className="bd-faq-category-body-inner">
                        {categoryExpanded == "uncategorized" &&
                            // Only show the loader on the initial load — NOT on a
                            // background refetch (isFetching). A refetch fires after
                            // editing/saving an uncategorized FAQ; swapping the whole
                            // list for the loader there collapsed the open edit form
                            // abruptly. Matching the categorized FaqList (which keys
                            // off isLoading only) keeps the accordion open and the
                            // slide-transition smooth.
                            (uncategorizedFaqLoading ? (
                                <FaqLoader />
                            ) : (
                            allUncategorizedFaq?.map((faq) => (
                                <UncategorizedFaq
                                    key={faq?.ID}
                                    data={faq}
                                    reFetchFaqList={setFetchUncategorizedFaq}
                                    categoriesLoading={categoriesLoading}
                                    allFaqCategories={allFaqCategories}
                                    reFetchCategories={reFetchCategories}
                                    setCreateFaqAt={setCreateFaqAt}
                                    faqExpanded={faqExpanded}
                                    setFaqExpanded={setFaqExpanded}
                                    setReFetchFaqForCategory={
                                        setReFetchFaqForCategory
                                    }
                                    settings={betterdocsFaq?.betterdocs_settings}
                                />
                            ))
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UncategorizedFaqList;
