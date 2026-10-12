import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import EmptyCategory from "../utils/EmptyCategory";
import FaqLoader from "../utils/FaqLoader";
import { faqOrdering } from "../utils/reOrder";
import { getAllFaqBasedOnCategory, reOrderFaqList } from "./../utils/function";
import Faq from "./Faq";
import SettingsLoader from "../utils/SettingsLoader";
import { useFAQScope } from "../context/ScopeContext";


const FaqList = ({
	category,
	order,
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
	} = useQuery(["allFaqList", category?.id, taxonomy], getAllFaqBasedOnCategory);

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

		if (order === 'a_to_z') {
			setSortedFaqList(
				[...allFaqList].sort((a, b) =>
					(a.title?.rendered ?? '').localeCompare(b.title?.rendered ?? '')
				)
			);
			return;
		}
		if (order === 'z_to_a') {
			setSortedFaqList(
				[...allFaqList].sort((a, b) =>
					(b.title?.rendered ?? '').localeCompare(a.title?.rendered ?? '')
				)
			);
			return;
		}
		if (order === 'most_recent') {
			setSortedFaqList([...allFaqList].sort((a, b) => b.id - a.id));
			return;
		}
		if (order === 'least_recent') {
			setSortedFaqList([...allFaqList].sort((a, b) => a.id - b.id));
			return;
		}

		// default / most_questions: use the manual drag-drop order stored in meta.
		const sortingArr = (category?.meta?._betterdocs_faq_order[0] || '')
			.split(',')
			.filter(Boolean)
			.map(Number);

		if (sortingArr.length) {
			const ordered = sortingArr
				.map((id) => allFaqList.find((faq) => faq.id === id))
				.filter(Boolean);
			// Append any FAQs missing from the saved order — e.g. a FAQ created
			// in a group that had no order meta yet (the backend seeds the meta
			// with just the new id), which would otherwise hide every existing
			// FAQ even though the count still includes them.
			const orderedIds = new Set(ordered.map((faq) => faq.id));
			const rest = allFaqList.filter((faq) => !orderedIds.has(faq.id));
			setSortedFaqList([...ordered, ...rest]);
		} else {
			setSortedFaqList(allFaqList);
		}
	}, [allFaqList, order, category?.meta?._betterdocs_faq_order[0]]);

	useEffect(() => {
		if (changeFaqSort?.destination?.droppableId == category?.id) {
			let updatedFaqsList = faqOrdering(changeFaqSort, sortedFaqList);
			setSortedFaqList(updatedFaqsList);
			reOrderFaqList(
				category?.id,
				updatedFaqsList?.map((data) => data?.id)?.toString()
			).then(() => {
				reFetchCategories();
			});
			setChangeFaqSort({});
		}
	}, [changeFaqSort]);

	useEffect(() => {
		if (reFetchFaqForCategory && reFetchFaqForCategory == category?.id) {
			reFetchFaqList();
			setReFetchFaqForCategory(null);
		}
	}, [reFetchFaqForCategory]);

	return (
		<Droppable droppableId={category?.id.toString()} type="FAQ">
			{(provided) => (
				<div
					{...provided.droppableProps}
					ref={provided.innerRef}
					className="bd-faq-list-droppable"
				>
					{!faqLoading ? (
						sortedFaqList?.length > 0 ? (
							sortedFaqList?.map((faq, index) => (
								<Faq
                                    key={faq?.id}
                                    data={faq}
                                    index={index}
                                    order={order}
                                    reFetchFaqList={reFetchFaqList}
                                    category={category?.id}
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
						) : (
							createFaqAt !== category?.id && <EmptyCategory />
						)
					) : (
						<FaqLoader
							count={
								(Number(category?.count) || 0) +
								(Number(category?.betterdocs_draft_count) || 0)
							}
						/>
					)}
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	);
};

export default FaqList;
