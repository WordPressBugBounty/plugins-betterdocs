import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import EmptyCategory from "../utils/EmptyCategory";
import FaqLoader from "../utils/FaqLoader";
import { faqOrdering } from "../utils/reOrder";
import { getAllFaqBasedOnCategory, reOrderFaqList } from "./../utils/function";
import SearchedFaq from "./SearchedFaq";
import SettingsLoader from "../utils/SettingsLoader";
import { useFAQScope } from "../context/ScopeContext";

const SearchedFaqList = ({
    category,
    allFaqCategories,
    changeFaqSort,
    reFetchFaqForCategory,
    createFaqAt,
    categoriesLoading,
    reFetchCategories,
    setCreateFaqAt,
    faqExpanded,
    setFaqExpanded,
    setReFetchFaqForCategory,
    setChangeFaqSort,
    setReFetchData,
}) => {
    const { taxonomy } = useFAQScope();

    const {
        isLoading: faqLoading,
        data: allFaqList,
        refetch: reFetchFaqList,
    } = useQuery(
        ["allFaqList", category?.term_id, taxonomy],
        getAllFaqBasedOnCategory,
    );

    const [sortedFaqList, setSortedFaqList] = useState([]);

    useEffect(() => {
        reFetchFaqList();
    }, [allFaqCategories]);

    useEffect(() => {
        setReFetchData({ func: reFetchFaqList });
    }, [allFaqList]);

    useEffect(() => {
        if (!allFaqList?.length) {
            setSortedFaqList([]);
            return;
        }

        // Show only the FAQs that matched the keyword. The search endpoint
        // returns `matched_faqs` per group; when it's empty the group was
        // matched by its name alone, so fall back to the whole group.
        const matchedIds = Array.isArray(category?.matched_faqs)
            ? category.matched_faqs.map(Number)
            : [];
        const base = matchedIds.length
            ? allFaqList.filter((faq) => matchedIds.includes(faq?.id))
            : allFaqList;

        let sortingArr = [];
        if (category?.meta?._betterdocs_faq_order[0]) {
            sortingArr = category?.meta?._betterdocs_faq_order[0]
                .split(",")
                .map((str) => Number(str));
        }

        if (sortingArr.length) {
            const ordered = sortingArr
                .map((id) => base.find((faq) => faq?.id === id))
                .filter(Boolean);
            // Append matched FAQs missing from the saved order so none drop out.
            const orderedIds = new Set(ordered.map((faq) => faq?.id));
            const rest = base.filter((faq) => !orderedIds.has(faq?.id));
            setSortedFaqList([...ordered, ...rest]);
        } else {
            setSortedFaqList(base);
        }
    }, [allFaqList, category?.meta?._betterdocs_faq_order[0], category?.matched_faqs]);

    useEffect(() => {
        if (changeFaqSort?.destination?.droppableId == category?.term_id) {
            let updatedFaqsList = faqOrdering(changeFaqSort, sortedFaqList);
            setSortedFaqList(updatedFaqsList);
            reOrderFaqList(
                category?.term_id,
                updatedFaqsList?.map((data) => data?.id)?.toString(),
            ).then(() => {
                reFetchCategories();
            });
            setChangeFaqSort({});
        }
    }, [changeFaqSort]);

    useEffect(() => {
        if (
            reFetchFaqForCategory &&
            reFetchFaqForCategory == category?.term_id
        ) {
            reFetchFaqList();
            setReFetchFaqForCategory(null);
        }
    }, [reFetchFaqForCategory]);

    return (
        <div className="bd-faq-list-droppable">
            {!faqLoading ? (
                sortedFaqList?.length > 0 ? (
                    sortedFaqList?.map((faq, index) => (
                        <SearchedFaq
                            key={faq?.id}
                            data={faq}
                            index={index}
                            reFetchFaqList={reFetchFaqList}
                            category={category?.term_id}
                            categoriesLoading={categoriesLoading}
                            allFaqCategories={allFaqCategories}
                            reFetchCategories={reFetchCategories}
                            setCreateFaqAt={setCreateFaqAt}
                            faqExpanded={faqExpanded}
                            setFaqExpanded={setFaqExpanded}
                            setReFetchFaqForCategory={setReFetchFaqForCategory}
                            settings={betterdocsFaq?.betterdocs_settings}
                        />
                    ))
                ) : (
                    createFaqAt !== category?.term_id && <EmptyCategory />
                )
            ) : (
                <FaqLoader />
            )}
        </div>
    );
};

export default SearchedFaqList;
