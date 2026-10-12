import { decodeEntities } from "@wordpress/html-entities";
import { __ } from "@wordpress/i18n";
import React, { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { createFAQ, deleteFaq, faqStatusChange, scrollExpandedIntoView } from "../utils/function";
import EditFaq from "./EditFaq";
import { useFAQScope } from "../context/ScopeContext";

// icons
import { ReactComponent as Grip } from "./../assets/images/grip.svg";
import { ReactComponent as Delete } from "./../assets/images/delete.svg";
import { ReactComponent as DownArrow } from "./../assets/images/down-arrow.svg";
import { ReactComponent as Duplicate } from "./../assets/images/duplicate.svg";
import { ReactComponent as Edit } from "./../assets/images/edit.svg";
import { ReactComponent as Magic } from "./../assets/images/magic.svg";

const SearchedFaq = ({
    data,
    index,
    category,
    categoriesLoading,
    allFaqCategories,
    reFetchCategories,
    reFetchFaqList,
    setCreateFaqAt,
    faqExpanded,
    setFaqExpanded,
    setReFetchFaqForCategory,
    settings,
}) => {
    const { taxonomy } = useFAQScope();
    const [faqStatus, setFaqStatus] = useState(data?.status);
    const [showFaqAIModalForm, setShowFaqAIModalForm] = useState(false);

    useEffect(() => {
        setFaqStatus(data?.status);
    }, [data]);

    useEffect(() => {
        if (faqExpanded !== undefined) {
            setCreateFaqAt(null);
        }
    }, [faqExpanded]);

    const handleUpdate = (post) => {
        setFaqExpanded(post?.id);
    };

    const handleExpanded = (post) => {
        if (faqExpanded === post?.id) {
            setFaqExpanded(undefined);
        } else {
            setFaqExpanded(post?.id);
            scrollExpandedIntoView(`faq-${post?.id}`);
        }
    };

    const handleDuplicate = () => {
        Swal.fire({
            title: __("Duplicate this FAQ?", "betterdocs"),
            icon: "info",
            showConfirmButton: true,
            showCancelButton:true,
            confirmButtonText: __('Yes', 'betterdocs'),
            cancelButtonText: __('No', 'betterdocs'),
            customClass: {
                popup: 'betterdocs-bulk-action-popup'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                createFAQ(
                    {
                        term_id: category,
                        post_title: "Copy " + data?.title?.rendered,
                        post_content: data?.content?.rendered,
                    },
                    taxonomy,
                )
                    .then((res) => {
                        if (res) {
                            reFetchFaqList();
                            reFetchCategories();
                            toast.success(__("FAQ duplicated.", "betterdocs"));
                        }
                    })
                    .catch((err) => {
                        err?.name
                            ? toast.error(`${err?.name} :${err?.message}`)
                            : toast.error(`${err?.message}`);
                    });
            }
        });
    };

    const handleDelete = (post_id) => {
        Swal.fire({
            title: __("Delete this FAQ?", "betterdocs"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: __("Yes, delete it!", "betterdocs"),
            cancelButtonText: __("Cancel", "betterdocs"),
            customClass: {
              popup: 'betterdocs-bulk-action-popup'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteFaq(post_id)
                    .then(() => {
                        reFetchFaqList();
                        reFetchCategories();
                        toast.success(__("FAQ deleted.", "betterdocs"));
                    })
                    .catch((err) => {
                        err?.name
                            ? toast.error(`${err?.name} :${err?.message}`)
                            : toast.error(`${err?.message}`);
                    });
            }
        });
    };

    const handleFaqStatus = (post_id) => {
        faqStatusChange(post_id, faqStatus === "publish" ? "draft" : "publish")
            .then(() => {
                setFaqStatus(faqStatus === "publish" ? "draft" : "publish");
                faqStatus === "publish"
                    ? toast.error(__("FAQ Disabled.", "betterdocs"))
                    : toast.success(__("FAQ Enabled.", "betterdocs"));
            })
            .catch((err) => {
                err?.name
                    ? toast.error(`${err?.name} :${err?.message}`)
                    : toast.error(`${err?.message}`);
            });
    };

    const getItemStyle = (isDragging, draggableStyle) => ({
        boxShadow: isDragging && "0 0 5px rgba(0, 0, 0, 0.5)",
        ...draggableStyle,
    });

    return (
        <>
            <div className="bd-faq" data-bd-expand-id={`faq-${data?.id}`}>
                <div className="bd-faq-head">
                    <button
                        type="button"
                        className="bd-faq-button-reset bd-faq-drag-button"
                    >
                        <Grip />
                    </button>
                    <div
                        className="bd-faq-title-wrap"
                        onClick={() => handleExpanded(data)}
                        style={{ cursor: "pointer" }}
                    >
                        <h3 className="bd-faq-title">
                            {decodeEntities(data?.title?.rendered)}
                        </h3>
                        {faqStatus === "draft" && (
                            <span className="bd-faq-status-badge">
                                {__("Drafted", "betterdocs")}
                            </span>
                        )}
                    </div>

                    <label
                        className="bd-faq-toggler"
                    >
                        <input
                            type="checkbox"
                            checked={faqStatus === "publish"}
                            onChange={() => handleFaqStatus(data?.id)}
                            className="checkbox"
                        />
                        <span className="knobs"></span>
                        <span className="layer"></span>
                    </label>
                    <button
                        type="button"
                        className="bd-faq-button-reset bd-faq-action-button"
                        onClick={() => handleUpdate(data)}
                    >
                        <Edit />
                    </button>
                    {settings &&
                        (settings?.enable_faq_write_with_ai ?? true) && (
                            <button
                                type="button"
                                className="bd-faq-button-reset bd-faq-action-button magic-icon"
                                onClick={() => {
                                    handleUpdate(data);
                                    setShowFaqAIModalForm(true);
                                }}
                            >
                                <Magic />
                            </button>
                        )}
                    <button
                        type="button"
                        className="bd-faq-button-reset bd-faq-action-button"
                        onClick={() => handleDuplicate()}
                    >
                        <Duplicate />
                    </button>
                    <button
                        type="button"
                        className="bd-faq-button-reset bd-faq-action-button delete-icon"
                        onClick={() => handleDelete(data?.id)}
                    >
                        <Delete />
                    </button>
                    <button
                        type="button"
                        className={`bd-faq-accordion-icon ${
                            faqExpanded === data?.id ? "active" : ""
                        }`}
                        onClick={() => handleExpanded(data)}
                    >
                        <DownArrow />
                    </button>
                </div>
                <div
                    className={`bd-faq-body ${
                        faqExpanded === data?.id ? "active" : ""
                    }`}
                >
                    <div className="bd-faq-body-inner">
                        {
                            <EditFaq
                                categoriesLoading={categoriesLoading}
                                allFaqCategories={allFaqCategories}
                                reFetchCategories={reFetchCategories}
                                faq={data}
                                reFetchFaqList={reFetchFaqList}
                                faqExpanded={faqExpanded}
                                setFaqExpanded={setFaqExpanded}
                                setReFetchFaqForCategory={
                                    setReFetchFaqForCategory
                                }
                                showFaqAIModalForm={showFaqAIModalForm}
                                setShowFaqAIModalForm={setShowFaqAIModalForm}
                                settings={settings}
                            />
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchedFaq;
