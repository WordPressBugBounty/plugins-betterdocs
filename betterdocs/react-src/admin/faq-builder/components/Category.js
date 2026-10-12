import { useRef } from "react";
import { decodeEntities } from "@wordpress/html-entities";
import { __, _n, sprintf } from "@wordpress/i18n";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { categoryStatusChange, deleteFaqCategory, scrollExpandedIntoView } from "./../utils/function";
import CreateFaq from "./CreateFaq";
import { IconPlus } from "../../../icons";
import { useFAQScope } from "../context/ScopeContext";
import { useFAQ } from "../../components/FAQContext";

// icons
import { ReactComponent as Grip } from "./../assets/images/grip.svg";
import { ReactComponent as Delete } from "./../assets/images/delete.svg";
import { ReactComponent as DownArrow } from "./../assets/images/down-arrow.svg";
import { ReactComponent as Edit } from "./../assets/images/edit.svg";
import FaqList from "./FaqList";

const Category = ({
    index,
    category,
    order,
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
    highlightGroupId,
}) => {
    const { taxonomy } = useFAQScope();
    // Set only when a specific FAQ inside is being revealed (create/move). A
    // freshly created group has no faqId, so it should flash but stay closed.
    const { highlightFaqId, bumpStats } = useFAQ();
    const queryClient = useQueryClient();

    /**
     * Refresh everything a group deletion invalidates.
     *
     * The group list, the pagination total and the "FAQ Groups" stat card all read the
     * SAME query (["allFaqCategories", …] — its total comes from the response's
     * X-WP-Total header), so they must not depend on a refetch callback threaded down
     * three levels of props: if that link is dropped anywhere, the numbers silently keep
     * the pre-delete value until a full page reload. Invalidate at the cache instead, so
     * every consumer of the query re-reads it no matter who triggered the delete.
     */
    const refreshAfterGroupChange = () => {
        queryClient.invalidateQueries({ queryKey: ["allFaqCategories"] });
        queryClient.invalidateQueries({ queryKey: ["uncategorizedFaq"] });
        // The Total/Published/Drafts cards come from a different endpoint (docs-faq-count),
        // which nothing above touches — deleting a group with its FAQs changes those too.
        if (typeof bumpStats === "function") {
            bumpStats();
        }
    };
    const [reFetchData, setReFetchData] = useState();
    // Initialise from the actual status so the toggle renders in its final
    // position immediately. Defaulting to `true` made it flip false→true once
    // data resolved, replaying the slide animation on every mount / page change
    // (issue #70).
    const [categoryStatus, setCategoryStatus] = useState(category?.meta?.status?.[0]);
    const isFetching = useRef(false);

    // When this group is the focus target (after it's created, or after a FAQ
    // was created in / moved into it), open it, scroll it into view, and flash
    // the group card itself — the group analogue of the FAQ row's 2s flash, so
    // a brand-new (empty) group is still visibly highlighted. Run a local 2s
    // flash so it completes even after highlightGroupId is cleared.
    const [flashing, setFlashing] = useState(false);
    const isHighlighted =
        highlightGroupId != null && String(highlightGroupId) === String(category?.id);
    useEffect(() => {
        if (!isHighlighted) return;
        // When a specific FAQ is being revealed (created in / moved into this
        // group), expand the group so the row is visible but DON'T flash the
        // group card — only the new FAQ header should highlight. A brand-new
        // (empty) group has no highlightFaqId, so it just flashes itself.
        if (highlightFaqId != null) {
            setCategoryExpanded(category?.id);
        } else {
            setFlashing(true);
        }
        scrollExpandedIntoView(`ctg-${category?.id}`);
    }, [isHighlighted]);
    useEffect(() => {
        if (!flashing) return;
        const t = setTimeout(() => setFlashing(false), 2000);
        return () => clearTimeout(t);
    }, [flashing]);

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

    const getItemStyle = (isDragging, draggableStyle) => ({
        boxShadow: isDragging && "0 0 5px rgba(0, 0, 0, 0.5)",
        ...draggableStyle,
    });

    return (
        <>
            <Draggable
                key={category?.id}
                draggableId={category?.id.toString()}
                index={index}
                isDragDisabled={order !== 'default'}
            >
                {(provided, snapshot) => (
                    <div
                        className={`bd-faq-ctg${flashing ? " bd-faq-ctg--highlight" : ""}`}
                        data-bd-expand-id={`ctg-${category?.id}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                        )}
                    >
                        <div className="bd-faq-ctg-head">
                            <button
                                type="button"
                                className="bd-faq-button-reset bd-faq-ctg-drag-button"
                                {...provided.dragHandleProps}
                            >
                                <Grip />
                            </button>
                            <div
                                className="bd-faq-ctg-title-wrap"
                                onClick={() => handleShow(category?.id)}
                                style={{ cursor: "pointer" }}
                            >
                                <h3 className="bd-faq-ctg-title">
                                    {decodeEntities(category?.name)}
                                </h3>
                                {typeof category?.count !== "undefined" && (
                                    <span className="bd-faq-ctg-meta">
                                        {/* `count` is the term count, i.e. PUBLISHED only. Alongside a draft
                                            count that reads as "0 questions · 3 draft", which looks like the
                                            drafts aren't being counted at all. When drafts exist, name both
                                            numbers for what they are — matching the Published / Drafts cards
                                            at the top of the page. With no drafts, "5 questions" is clearer
                                            than "5 published", so keep that. */}
                                        <span className="bd-faq-ctg-meta-count">
                                            {category?.betterdocs_draft_count > 0
                                                ? sprintf(
                                                      /* translators: %d: number of published FAQs in this group. */
                                                      __("%d published", "betterdocs"),
                                                      category?.count
                                                  )
                                                : sprintf(
                                                      /* translators: %d: number of FAQs in this group. */
                                                      _n("%d question", "%d questions", category?.count, "betterdocs"),
                                                      category?.count
                                                  )}
                                        </span>
                                        {category?.betterdocs_draft_count > 0 && (
                                            <>
                                                <span className="bd-faq-ctg-meta-sep" />
                                                <span className="bd-faq-ctg-meta-draft">
                                                    {sprintf(
                                                        /* translators: %d: number of draft FAQs in this group. */
                                                        _n("%d draft", "%d drafts", category?.betterdocs_draft_count, "betterdocs"),
                                                        category?.betterdocs_draft_count
                                                    )}
                                                </span>
                                            </>
                                        )}
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                className="bd-faq-button button-secondary"
                                onClick={() => createFaq(category?.id)}
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
                                onClick={() => deleteCategory(category?.id)}
                            >
                                <Delete />
                            </button>
                            <label
                                className="bd-faq-toggler"
                                onClick={() =>
                                    handleCategoryStatus(category?.id)
                                }
                            >
                                <input
                                    type="checkbox"
                                    checked={categoryStatus === "1"}
                                    onChange={() => handleCategoryStatus(category?.id)}
                                    className="checkbox"
                                />
                                <span className="knobs"></span>
                                <span className="layer"></span>
                            </label>
                            <button
                                type="button"
                                className={`bd-faq-accordion-icon ${
                                    categoryExpanded == category?.id
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleShow(category?.id)}
                            >
                                <DownArrow />
                            </button>
                        </div>
                        <div
                            className={`bd-faq-category-body ${
                                categoryExpanded == category?.id ? "active" : ""
                            }`}
                        >
                            <div className="bd-faq-category-body-clip">
                                <div className="bd-faq-category-body-inner">
                                    {createFaqAt === category?.id && (
                                        <CreateFaq
                                            reFetchFaqList={reFetchData?.func}
                                            createFaqAt={createFaqAt}
                                            setCreateFaqAt={setCreateFaqAt}
                                            reFetchCategories={
                                                reFetchCategories
                                            }
                                            setShowFaqAIModalForm={
                                                setShowFaqAIModalForm
                                            }
                                        />
                                    )}
                                    {categoryExpanded == category?.id ? (
                                        <FaqList
                                            category={category}
                                            order={order}
                                            allFaqCategories={allFaqCategories}
                                            changeFaqSort={changeFaqSort}
                                            reFetchFaqForCategory={
                                                reFetchFaqForCategory
                                            }
                                            createFaqAt={createFaqAt}
                                            categoriesLoading={
                                                categoriesLoading
                                            }
                                            reFetchCategories={
                                                reFetchCategories
                                            }
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
                )}
            </Draggable>
        </>
    );
};

export default Category;
