import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { getAllUncategorizedFaq, reOrderCategories } from "../utils/function";
import { categoryOrdering } from "../utils/reOrder";
import Category from "./Category";
import UncategorizedFaqList from "./UncategorizedFaqList";
import CategoryLoader from "../utils/CategoryLoader";
import { useFAQScope } from "../context/ScopeContext";

const CategoryList = ({
	isLoading,
	categoriesLoading,
	categoriesFetching,
	allFaqCategories,
	reFetchCategories,
	setUpdateCategory,
	setUncategorizedLoading,
	setUncategorizedEmpty,
	setShowFaqAIModalForm,
	perPage,
	currentPage,
	order,
	highlightGroupId,
}) => {
	const { isProduct, taxonomy } = useFAQScope();

	const {
		isLoading: uncategorizedFaqLoadingRaw,
		isFetching: uncategorizedFaqFetching,
		data: allUncategorizedFaq,
		refetch: setFetchUncategorizedFaq,
	} = useQuery(["uncategorizedFaq", taxonomy], getAllUncategorizedFaq, {
		// Both tabs have an "Uncategorized" bucket now: a Product FAQ can lose its group
		// (the group is deleted without its FAQs) or be created without one, and it must
		// stay visible on its own tab rather than surfacing under General. The endpoint
		// scopes the bucket by taxonomy; the key does the same so the two tabs' results
		// never bleed into each other.
	});
	const uncategorizedFaqLoading = uncategorizedFaqLoadingRaw;

	const [createFaqAt, setCreateFaqAt] = useState(null);
	const [faqExpanded, setFaqExpanded] = useState(undefined);
	const [categoryExpanded, setCategoryExpanded] = useState(undefined);
	const [sortableCategories, setSortableCategories] = useState([]);
	const [changeFaqSort, setChangeFaqSort] = useState({});
	const [reFetchFaqForCategory, setReFetchFaqForCategory] = useState(null);

	useEffect(() => {
		if (!allFaqCategories?.length) {
			setSortableCategories([]);
			return;
		}
		const sorted = [...allFaqCategories];
		// For every sort mode the server already returns this page in the right
		// order (FAQBuilder::faq_category_orderby_meta), so the whole list is
		// ordered and paginated consistently. Only re-sort in "default" mode,
		// where drag-and-drop mutates meta.order locally and we need the list to
		// reflect the new positions immediately without a refetch.
		if (order === 'default') {
			sorted.sort((a, b) => (a?.meta?.order[0] ?? 0) - (b?.meta?.order[0] ?? 0));
		}
		setSortableCategories(sorted);
	}, [allFaqCategories, order]);

	useEffect(() => {
		if (allUncategorizedFaq?.length) {
			setUncategorizedEmpty(false);
		} else {
			setUncategorizedEmpty(true);
		}
	}, [allUncategorizedFaq]);

	useEffect(() => {
		setUncategorizedLoading(uncategorizedFaqLoading);
	}, [uncategorizedFaqLoading]);

	const onDragEnd = (result) => {
		if (!result.destination) {
			return;
		}
		// Manual reordering only applies in the "default" order. Any other sort
		// (A→Z, Most Recent, …) is read-only — the grip stays visible but the
		// Draggables are disabled, so this is just a safety net.
		if (order !== 'default') {
			return;
		}
		if (result.type == "category") {
			const updatedCategories = categoryOrdering(
				result,
				sortableCategories,
                currentPage,
                perPage
			);
			reOrderCategories(updatedCategories);
			setCategoryExpanded(undefined);
			setSortableCategories(
				sortableCategories
					.map((category) => {
						return {
							...category,
							meta: {
								...category?.meta,
								order: [
									updatedCategories.find(
										(cat) => cat?.id === category?.id
									)?.updated_position,
								],
							},
						};
					})
					.sort(function (a, b) {
						return a?.meta?.order[0] - b?.meta?.order[0];
					})
			);
		} else {
			setChangeFaqSort(result);
		}
	};

	return (
		<>
			{!isLoading ? (
				<DragDropContext onDragEnd={onDragEnd}>
					<div className="bd-faq-ctg-list">
						<Droppable
							droppableId="bdCategoryList"
							type={"category"}
						>
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className="bd-faq-ctg-list-droppable"
								>
									{categoriesLoading ? (
										<CategoryLoader />
									) : sortableCategories?.map(
											(category, index) => (
												<Category
                                                    key={category.id}
													index={index}
													category={category}
													order={order}
													categoriesLoading={
														categoriesLoading
													}
													allFaqCategories={
														allFaqCategories
													}
													reFetchCategories={
														reFetchCategories
													}
													createFaqAt={
														createFaqAt
													}
													setFetchUncategorizedFaq={
														setFetchUncategorizedFaq
													}
													setUpdateCategory={
														setUpdateCategory
													}
													categoryExpanded={
														categoryExpanded
													}
													setCategoryExpanded={
														setCategoryExpanded
													}
													setCreateFaqAt={
														setCreateFaqAt
													}
													faqExpanded={
														faqExpanded
													}
													setFaqExpanded={
														setFaqExpanded
													}
													changeFaqSort={
														changeFaqSort
													}
													setChangeFaqSort={
														setChangeFaqSort
													}
													reFetchFaqForCategory={
														reFetchFaqForCategory
													}
													setReFetchFaqForCategory={
														setReFetchFaqForCategory
													}
													setShowFaqAIModalForm={setShowFaqAIModalForm}
													highlightGroupId={highlightGroupId}
												/>
											)
									)}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
						{/* Shown on both tabs — each lists only its own ungrouped FAQs. */}
							{(allUncategorizedFaq?.length || uncategorizedFaqLoading) ? (
							<UncategorizedFaqList
								categoriesLoading={categoriesLoading}
								allFaqCategories={allFaqCategories}
								reFetchCategories={reFetchCategories}
								allUncategorizedFaq={allUncategorizedFaq}
								setFetchUncategorizedFaq={
									setFetchUncategorizedFaq
								}
								categoryExpanded={categoryExpanded}
								setCategoryExpanded={setCategoryExpanded}
								setCreateFaqAt={setCreateFaqAt}
								faqExpanded={faqExpanded}
								setFaqExpanded={setFaqExpanded}
								setReFetchFaqForCategory={
									setReFetchFaqForCategory
								}
								uncategorizedFaqLoading={uncategorizedFaqLoading}
								uncategorizedFaqFetching={uncategorizedFaqFetching}
								highlightGroupId={highlightGroupId}
							/>
						) : (
							""
						)}
					</div>
				</DragDropContext>
			) : (
				""
			)}
		</>
	);
};

export default React.memo(CategoryList);
