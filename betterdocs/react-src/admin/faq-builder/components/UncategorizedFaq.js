import { __ } from "@wordpress/i18n";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { createFAQ, deleteFaq, faqStatusChange, scrollExpandedIntoView } from "../utils/function";
import EditFaq from "./EditFaq";
import { useFAQ } from "../../components/FAQContext";
import { useFAQScope } from "../context/ScopeContext";
import { useQueryClient } from "@tanstack/react-query";

// icons
import { ReactComponent as Delete } from "./../assets/images/delete.svg";
import { ReactComponent as DownArrow } from "./../assets/images/down-arrow.svg";
import { ReactComponent as Duplicate } from "./../assets/images/duplicate.svg";
import { ReactComponent as Edit } from "./../assets/images/edit.svg";
import { ReactComponent as Magic } from "./../assets/images/magic.svg";
import FaqAIModalForm from "./FaqAIModalForm";

const UncategorizedFaq = ({
    data,
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
    const [faqStatus, setFaqStatus] = useState(data?.post_status);
    const [showFaqAIModalForm, setShowFaqAIModalForm] = useState(false);
    const { bumpStats, highlightFaqId, setHighlightFaqId } = useFAQ();
    const { taxonomy } = useFAQScope();
    const queryClient = useQueryClient();

    // Flash this row when it's the FAQ just created in the Uncategorized panel.
    const [flashing, setFlashing] = useState(false);
    const isHighlighted =
        highlightFaqId != null && String(highlightFaqId) === String(data?.ID);
    useEffect(() => {
        if (!isHighlighted) return;
        setFlashing(true);
        scrollExpandedIntoView(`faq-${data?.ID}`);
        setHighlightFaqId(null);
    }, [isHighlighted]);
    useEffect(() => {
        if (!flashing) return;
        const t = setTimeout(() => setFlashing(false), 2000);
        return () => clearTimeout(t);
    }, [flashing]);

    useEffect(() => {
        if (faqExpanded !== undefined) {
            setCreateFaqAt(null);
        }
    }, [faqExpanded]);

    const handleUpdate = (post) => {
        setFaqExpanded(post?.ID);
    };

    // Called by EditFaq after a save. If the FAQ was moved into a group it no
    // longer belongs in the Uncategorized bucket — drop it from the cache (like
    // delete) instead of reloading the whole panel. Otherwise refresh in place.
    const handleEditFaqRefetch = (selectedCategory) => {
        if (selectedCategory && selectedCategory !== "not-set") {
            queryClient.setQueryData(
                ["uncategorizedFaq", taxonomy],
                (old) => (old || []).filter((faq) => faq?.ID !== data?.ID)
            );
        } else if (typeof reFetchFaqList === "function") {
            reFetchFaqList();
        }
    };

    const handleExpanded = (post) => {
        if (faqExpanded === post?.ID) {
            setFaqExpanded(undefined);
        } else {
            setFaqExpanded(post?.ID);
            scrollExpandedIntoView(`faq-${post?.ID}`);
        }
    };

    // useEffect(() => {
    //   setIsMagicIcon(true);
    //   if (faqExpanded !== undefined && faqExpanded === data?.ID) {
    //     if (isMagicIcon) {
    //       setShowFaqAIModalForm(true);
    //     }
    //   }
    // }, [faqExpanded]);

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
                createFAQ({
                    term_id: null,
                    post_title: "Copy " + data?.post_title,
                    post_content: data?.post_content,
                })
                    .then((res) => {
                        if (res) {
                            toast.success(__("FAQ duplicated.", "betterdocs"));
                            reFetchFaqList();
                            bumpStats();
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
                        toast.success(__("FAQ deleted.", "betterdocs"));
                        // Just drop the deleted FAQ from the cached list (like
                        // the group FaqList) — no full refetch of the bucket.
                        queryClient.setQueryData(
                            ["uncategorizedFaq", taxonomy],
                            (old) => (old || []).filter((faq) => faq?.ID !== post_id)
                        );
                        bumpStats();
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
                // Refresh stat counts (published/draft) after the status flip.
                reFetchCategories && reFetchCategories();
                bumpStats();
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

    return (
        <div
            className={`bd-faq${flashing ? " bd-faq--highlight" : ""}`}
            data-bd-expand-id={`faq-${data?.ID}`}
        >
            <div className="bd-faq-head">
                <h3
                    className="bd-faq-title"
                    onClick={() => handleExpanded(data)}
                >
                    {data?.post_title}
                </h3>
                <label
                    className="bd-faq-toggler"
                    onClick={() => handleFaqStatus(data?.ID)}
                >
                    <input
                        type="checkbox"
                        checked={faqStatus === "publish" ? true : false}
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
                {settings && (settings?.enable_faq_write_with_ai ?? true) && (
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
                    onClick={() => handleDelete(data?.ID)}
                >
                    <Delete />
                </button>
                <button
                    type="button"
                    className={`bd-faq-accordion-icon ${
                        faqExpanded === data?.ID ? "active" : ""
                    }`}
                    onClick={() => {
                        handleExpanded(data);
                    }}
                >
                    <DownArrow />
                </button>
            </div>
            <div
                className={`bd-faq-body ${
                    faqExpanded === data?.ID ? "active" : ""
                }`}
            >
                <div className="bd-faq-body-inner">
                    {
                        <EditFaq
                            faq={data}
                            reFetchFaqList={handleEditFaqRefetch}
                            categoriesLoading={categoriesLoading}
                            allFaqCategories={allFaqCategories}
                            reFetchCategories={reFetchCategories}
                            faqExpanded={faqExpanded}
                            setFaqExpanded={setFaqExpanded}
                            setReFetchFaqForCategory={setReFetchFaqForCategory}
                            showFaqAIModalForm={showFaqAIModalForm}
                            setShowFaqAIModalForm={setShowFaqAIModalForm}
                            settings={settings}
                        />
                    }
                </div>
            </div>
        </div>
    );
};

export default UncategorizedFaq;
