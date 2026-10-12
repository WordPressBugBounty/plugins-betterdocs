import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../doc-categories/components/Pagination";
import { IconPlus } from "../../../icons";
import CategoryLoader from "../utils/CategoryLoader";
import CreateFaqLoader from "../utils/CreateFaqLoader";
import { getAllCategories, getSearchedFaqCategories, findCategoryPage } from "../utils/function";
import EmptyDashboard from "./../utils/EmptyDashboard";
import CategoryList from "./CategoryList";
import CategoryModal from "./CategoryModal";
import CreateFaq from "./CreateFaq";
import FaqStats from "./FaqStats";
import { useFAQ } from "../../components/FAQContext";
import { useFAQScope } from "../context/ScopeContext";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { makeRouteURL, history } from "../../../utils/history";
import SearchedCategoryList from "./SearchedCategoryList";
import { __ } from "@wordpress/i18n";


const BetterDocsFaqRoot = () => {
    const {
        categories,
        setCategories,
        reFetchCategories,
        setReFetchCategories,
        focusTarget,
        setFocusTarget,
        highlightGroupId,
        setHighlightGroupId,
        highlightFaqId,
        setHighlightFaqId,
    } = useFAQ();
    const { taxonomy, isProduct } = useFAQScope();
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [, , , faqKeyword, faqOrder = 'default'] = useOutletContext();
    // "Add New FAQ" from the dashboard header lands here with ?faq_action=create
    // and opens an inline create form at the top of the group list (once).
    const [searchParams] = useSearchParams();
    const [showCreateFaqTop, setShowCreateFaqTop] = useState(
        searchParams.get("faq_action") === "create"
    );
    const closeCreateFaqTop = () => {
        setShowCreateFaqTop(false);
        // Drop ?faq_action=create via the admin router's URL builder so the
        // address stays a proper admin.php URL. (React Router's setSearchParams
        // would rebuild a broken SPA-style path from the custom history's
        // page-derived pathname, e.g. /betterdocs-faq?page=betterdocs-faq.)
        if (searchParams.get("faq_action")) {
            history.replace(makeRouteURL("betterdocs-faq", null, ["faq_action"]));
        }
    };
    // Search runs against the active scope's taxonomy, so it works on both the
    // General builder and the WooCommerce Product FAQ Groups sub-tab.
    const searchMode = Boolean(faqKeyword?.length);

    // Reset to page 1 whenever the sort order changes.
    const prevFaqOrder = React.useRef(faqOrder);
    useEffect(() => {
        if (prevFaqOrder.current !== faqOrder) {
            prevFaqOrder.current = faqOrder;
            setCurrentPage(1);
        }
    }, [faqOrder]);

    // After a FAQ is created (?faq_action=create) or moved into a group via
    // Edit, reveal the destination group (jump to the page it lives on + expand
    // it) and arm the flash for the FAQ row itself. The create/move handler
    // sets `focusTarget` only after its API call resolves, so locating the page
    // off a fresh server query is accurate even for the "most questions" order
    // (whose position depends on the count that just changed). "uncategorized"
    // lives in its own (unpaginated) panel, so it only needs the expand.
    useEffect(() => {
        if (!focusTarget) return;
        const { groupId, faqId } = focusTarget;
        setFocusTarget(null);
        setHighlightFaqId(faqId != null ? String(faqId) : null);

        if (groupId === "uncategorized") {
            setHighlightGroupId("uncategorized");
            return;
        }

        findCategoryPage({ taxonomy, orderKey: faqOrder, perPage, targetId: groupId })
            .then((page) => {
                setCurrentPage((cur) => (page && page !== cur ? page : cur));
                setHighlightGroupId(String(groupId));
            })
            .catch(() => setHighlightGroupId(String(groupId)));
    }, [focusTarget]);

    // The group only needs the expand trigger briefly — once a Category reads
    // it and opens, the open state persists on its own. Clear so a later manual
    // collapse isn't re-opened by a stale value.
    useEffect(() => {
        if (highlightGroupId == null) return;
        const t = setTimeout(() => setHighlightGroupId(null), 2500);
        return () => clearTimeout(t);
    }, [highlightGroupId]);

    // The FAQ row consumes highlightFaqId the moment it renders (it may take a
    // beat for the group to expand and its FAQ list to load). This is just a
    // fallback so the signal doesn't linger if that row never mounts.
    useEffect(() => {
        if (highlightFaqId == null) return;
        const t = setTimeout(() => setHighlightFaqId(null), 6000);
        return () => clearTimeout(t);
    }, [highlightFaqId]);

    const {
        isLoading: categoriesLoading,
        isFetching: categoriesFetching,
        data: allFaqCategories,
        refetch,
    } = useQuery(["allFaqCategories", perPage, currentPage, faqOrder, taxonomy], getAllCategories, {
        keepPreviousData: true,
        enabled: !searchMode ? true : false,
    });

    const {
        isLoading: searchedFaqResultsLoading,
        data: faqSearchedData,
        isPreviousData: searchedFaqIsPreviousData,
        refetch:refetchSearchedFaq
    } = useQuery(["allFaqSearchedData", faqKeyword, taxonomy], getSearchedFaqCategories, {
        keepPreviousData: true,
        enabled: searchMode ? true : false,
    });

    // `keepPreviousData` keeps the previous keyword's results on screen while the
    // new keyword fetches — which makes the list visibly "jump" when the fresh
    // results swap in. Show the skeleton loader for that transition instead.
    // `isPreviousData` is true only while stale data is being served for a new
    // query key, so a same-keyword background refetch (e.g. after editing a FAQ
    // within the results) won't flash the skeleton.
    const searchedFaqResultsLoadingOrStale =
        searchMode && (searchedFaqResultsLoading || searchedFaqIsPreviousData);

    useEffect(() => {
        setReFetchCategories(() => refetch);
    }, [refetch]);

    useEffect(() => {
        if (allFaqCategories?.data) {
            setCategories(allFaqCategories.data);
        }
    }, [allFaqCategories]);

    const [uncategorizedLoading, setUncategorizedLoading] = useState(true);
    const [uncategorizedEmpty, setUncategorizedEmpty] = useState(true);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [updateCategory, setUpdateCategory] = useState(null);

    const isLoading = useMemo(
        () => categoriesLoading || uncategorizedLoading,
        [categoriesLoading, uncategorizedLoading]
    );

    const isEmptyDashboard = useMemo(
        () => !categories.length && uncategorizedEmpty,
        [categories, uncategorizedEmpty]
    );

    return (
        <>
            {searchedFaqResultsLoadingOrStale && <CategoryLoader />}
            {searchMode && !searchedFaqResultsLoadingOrStale && (
                <SearchedCategoryList
                    isLoading={searchedFaqResultsLoading}
                    categoriesLoading={searchedFaqResultsLoading}
                    allFaqCategories={faqSearchedData}
                    reFetchCategories={refetchSearchedFaq}
                    setUpdateCategory={setUpdateCategory}
                    setUncategorizedLoading={setUncategorizedLoading}
                    setUncategorizedEmpty={setUncategorizedEmpty}
                />
            )}
            {(searchMode && !searchedFaqResultsLoadingOrStale && faqSearchedData?.length == 0) && (
                <EmptyDashboard
                    reFetchCategories={refetch}
                    setShowCategoryModal={setShowCategoryModal}
                    showFaqActionButtons={false}
                    showNewFaqText={false}
                />
            )}
            {!searchMode && isLoading && <CategoryLoader />}
            {!searchMode && !isLoading && isEmptyDashboard && !showCreateFaqTop && (
                <EmptyDashboard
                    reFetchCategories={refetch}
                    setShowCategoryModal={setShowCategoryModal}
                    showSampleFaqButton={true}
                    contentType={isProduct ? "product_faq" : "faq"}
                />
            )}
            {!searchMode && !isLoading && !isEmptyDashboard && (
                <FaqStats
                    groupsTotal={allFaqCategories?.total}
                    refreshSignal={allFaqCategories}
                />
            )}
            {!searchMode && showCreateFaqTop && (
                isLoading ? (
                    <CreateFaqLoader />
                ) : (
                    <CreateFaq
                        topLevel
                        groups={categories}
                        reFetchFaqList={refetch}
                        reFetchCategories={refetch}
                        setCreateFaqAt={() => {}}
                        onClose={closeCreateFaqTop}
                    />
                )
            )}
            {!searchMode && (
                <CategoryList
                    isLoading={isLoading}
                    categoriesLoading={categoriesLoading}
                    categoriesFetching={categoriesFetching}
                    allFaqCategories={categories}
                    reFetchCategories={refetch}
                    setUpdateCategory={setUpdateCategory}
                    setUncategorizedLoading={setUncategorizedLoading}
                    setUncategorizedEmpty={setUncategorizedEmpty}
                    perPage={perPage}
                    currentPage={currentPage}
                    order={faqOrder}
                    highlightGroupId={highlightGroupId}
                />
            )}
            {!searchMode && (
                <Pagination
                    total={Number(allFaqCategories?.total)}
                    page={currentPage}
                    perPage={perPage}
                    onPageChange={(p) => setCurrentPage(p)}
                    onPerPageChange={(pp) => setPerPage(pp)}
                />
            )}
            {showCategoryModal || updateCategory !== null ? (
                <CategoryModal
                    open={true}
                    reFetchCategories={refetch}
                    setShowCategoryModal={setShowCategoryModal}
                    updateCategory={updateCategory}
                    setUpdateCategory={setUpdateCategory}
                />
            ) : (
                ""
            )}
        </>
    );
};

export default BetterDocsFaqRoot;
