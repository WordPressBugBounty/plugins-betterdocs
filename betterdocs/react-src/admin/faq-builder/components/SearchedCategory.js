import { useRef } from "react";
import { decodeEntities } from "@wordpress/html-entities";
import { __ } from "@wordpress/i18n";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { categoryStatusChange, deleteFaqCategory, scrollExpandedIntoView } from "./../utils/function";
import { useFAQScope } from "../context/ScopeContext";
import CreateFaq from "./CreateFaq";
import { IconPlus } from "../../../icons";

// icons
import { ReactComponent as Grip } from "./../assets/images/grip.svg";
import { ReactComponent as Delete } from "./../assets/images/delete.svg";
import { ReactComponent as DownArrow } from "./../assets/images/down-arrow.svg";
import { ReactComponent as Edit } from "./../assets/images/edit.svg";
import SearchedFaqList from "./SearchedFaqList";

const SearchedCategory = ({
    category,
    categoriesLoading,
    allFaqCategories,
    reFetchCategories,
    setFetchUncategorizedFaq,
    setUpdateCategory,
    categoryExpanded,
    setCategoryExpanded,
    setCreateFaqAt,
    createFaqAt,
    faqExpanded,
    setFaqExpanded,
    changeFaqSort,
    setChangeFaqSort,
    reFetchFaqForCategory,
    setReFetchFaqForCategory,
    setShowFaqAIModalForm,
}) => {
    const [reFetchData, setReFetchData] = useState();
    const [categoryStatus, setCategoryStatus] = useState(true);
    const isFetching = useRef(false);
    const { taxonomy } = useFAQScope();
    const queryClient = useQueryClient();

    /* Same reason as Category.js: the group list, the pagination total and the "FAQ
       Groups" stat card all read the ["allFaqCategories"] query, so a deletion has to
       invalidate the cache rather than lean on a refetch callback passed down props —
       otherwise the count keeps its pre-delete value until a full page reload. */
    const refreshAfterGroupChange = () => {
        queryClient.invalidateQueries({ queryKey: ["allFaqCategories"] });
        queryClient.invalidateQueries({ queryKey: ["allFaqSearchedData"] });
        queryClient.invalidateQueries({ queryKey: ["uncategorizedFaq"] });
    };

    useEffect(() => {
        if (categoryExpanded !== createFaqAt) {
            setCreateFaqAt(null);
        }
    }, [categoryExpanded, createFaqAt]);

    useEffect(() => {
        setCategoryStatus(category?.meta?.status[0]);
    }, [category?.meta?.status[0]]);

    const createFaq = (term_id) => {
        setCreateFaqAt(term_id);
        setFaqExpanded(undefined);
        setCategoryExpanded(term_id);
        scrollExpandedIntoView(`ctg-${term_id}`);
    };

    const deleteCategory = (term_id) => {
        Swal.fire({
            title: __("Delete this FAQ Group?", "betterdocs"),
            icon: "warning",
            showConfirmButton: true,
            showCancelButton:true,
            confirmButtonText: __('Yes', 'betterdocs'),
            cancelButtonText: __('No', 'betterdocs'),
            input: "checkbox",
            inputValue: 0,
            inputPlaceholder: __(
                "Also delete all FAQs inside this FAQ Group",
                "betterdocs",
            ),
            customClass: {
                popup: 'betterdocs-bulk-action-popup'
            }
        }).then((result) => {
            if (result?.isConfirmed) {
                if (result?.value == 0) {
                    deleteFaqCategory(term_id, false, taxonomy)
                        .then(() => {
                            reFetchCategories();
                            refreshAfterGroupChange();
                            toast.success(__("FAQ Group deleted.", "betterdocs"));
                        })
                        .catch((err) => {
                            err?.name
                                ? toast.error(`${err?.name} :${err?.message}`)
                                : toast.error(`${err?.message}`);
                        });
                } else {
                    deleteFaqCategory(term_id, true, taxonomy)
                        .then(() => {
                            reFetchCategories();
                            refreshAfterGroupChange();
                            toast.success(__("FAQ Group deleted with all FAQs.", "betterdocs"));
                        })
                        .catch((err) => {
                            err?.name
                                ? toast.error(`${err?.name} :${err?.message}`)
                                : toast.error(`${err?.message}`);
                        });
                }
            }
        });
    };

    const handleShow = (term_id) => {
        if (categoryExpanded == term_id) {
            setCategoryExpanded(undefined);
            setFaqExpanded(undefined);
            setCreateFaqAt(null);
        } else {
            setCategoryExpanded(term_id);
            scrollExpandedIntoView(`ctg-${term_id}`);
        }
    };

    const handleCategoryStatus = (term_id) => {
        if (isFetching.current) return;

        isFetching.current = true;
        categoryStatusChange(term_id, categoryStatus === "1" ? "0" : "1")
            .then(() => {
                categoryStatus === "1"
                    ? toast.error(__("FAQ Group Disabled.", "betterdocs"))
                    : toast.success(__("FAQ Group Enabled.", "betterdocs"));
                reFetchCategories();
            })
            .catch((err) => {
                err?.name
                    ? toast.error(`${err?.name} :${err?.message}`)
                    : toast.error(`${err?.message}`);
            })
            .finally(() => {
                isFetching.current = false;
            });
    };

    // In search results, show how many FAQs matched the keyword (the count of
    // FAQs actually shown). Falls back to the group total when the group was
    // matched by its name alone (no matched_faqs).
    const matchedCount =
        Array.isArray(category?.matched_faqs) && category.matched_faqs.length
            ? category.matched_faqs.length
            : category?.count;

    return (
        <>
            <div className="bd-faq-ctg" data-bd-expand-id={`ctg-${category?.term_id}`}>
                <div className="bd-faq-ctg-head">
                    <button
                        type="button"
                        className="bd-faq-button-reset bd-faq-ctg-drag-button"
                    >
                        <Grip />
                    </button>
                    <div
                        className="bd-faq-ctg-title-wrap"
                        onClick={() => handleShow(category?.term_id)}
                        style={{ cursor: "pointer" }}
                    >
                        <h3 className="bd-faq-ctg-title">
                            {decodeEntities(category?.name)}
                        </h3>
                        {typeof matchedCount !== "undefined" && (
                            <span className="bd-faq-ctg-meta">
                                <span className="bd-faq-ctg-meta-count">
                                    {`${matchedCount} `}
                                    {matchedCount === 1
                                        ? __("question", "betterdocs")
                                        : __("questions", "betterdocs")}
                                </span>
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        className="bd-faq-button button-secondary"
                        onClick={() => createFaq(category?.term_id)}
                    >
                        <span className="action-button-icon">
                            <IconPlus />
                        </span>
                        <span className="bd-faq-text">
                            {__("Add a New FAQ", "betterdocs")}
                        </span>
                    </button>
                    <button
                        type="button"
                        className="bd-faq-button-reset bd-faq-action-button"
                        onClick={() => setUpdateCategory(category)}
                    >
                        <Edit />
                    </button>
                    <button
                        type="button"
                        className="bd-faq-button-reset bd-faq-action-button delete-icon"
                        onClick={() => deleteCategory(category?.term_id)}
                    >
                        <Delete />
                    </button>
                    <label
                        className="bd-faq-toggler"
                        onClick={() => handleCategoryStatus(category?.term_id)}
                    >
                        <input
                            type="checkbox"
                            checked={categoryStatus === "1"}
                            onChange={() => handleCategoryStatus(category?.term_id)}
                            className="checkbox"
                        />
                        <span className="knobs"></span>
                        <span className="layer"></span>
                    </label>
                    <button
                        type="button"
                        className={`bd-faq-accordion-icon ${
                            categoryExpanded == category?.term_id ? "active" : ""
                        }`}
                        onClick={() => handleShow(category?.term_id)}
                    >
                        <DownArrow />
                    </button>
                </div>
                <div
                    className={`bd-faq-category-body ${
                        categoryExpanded == category?.term_id ? "active" : ""
                    }`}
                >
                    <div style={{ overflow: "hidden" }}>
                        <div className="bd-faq-category-body-inner">
                            {createFaqAt === category?.term_id && (
                                <CreateFaq
                                    reFetchFaqList={reFetchData?.func}
                                    createFaqAt={createFaqAt}
                                    setCreateFaqAt={setCreateFaqAt}
                                    reFetchCategories={reFetchCategories}
                                    setShowFaqAIModalForm={
                                        setShowFaqAIModalForm
                                    }
                                />
                            )}
                            {categoryExpanded == category?.term_id ? (
                                <SearchedFaqList
                                    category={category}
                                    allFaqCategories={allFaqCategories}
                                    changeFaqSort={changeFaqSort}
                                    reFetchFaqForCategory={
                                        reFetchFaqForCategory
                                    }
                                    createFaqAt={createFaqAt}
                                    categoriesLoading={categoriesLoading}
                                    reFetchCategories={reFetchCategories}
                                    setCreateFaqAt={setCreateFaqAt}
                                    faqExpanded={faqExpanded}
                                    setFaqExpanded={setFaqExpanded}
                                    setReFetchFaqForCategory={
                                        setReFetchFaqForCategory
                                    }
                                    setChangeFaqSort={setChangeFaqSort}
                                    setReFetchData={setReFetchData}
                                />
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchedCategory;
