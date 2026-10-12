import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { __ } from "@wordpress/i18n";
import {
	NoDocsImg,
} from "../../../icons/index";
import GridItem from "./GridItem";

const AllDocsGridItem = ({ docsData, category, deleteIds, mutate, isLoading, setQuickEdit }) => {
	if (docsData.length === 0) {
		return (
			<Droppable droppableId={category?.id?.toString()} key={category.id}>
				{(provided, snapshot) => (
					<div className="betterdocs-dashboard-category-body"
						ref={provided.innerRef}
						{...provided.droppableProps}
					>
						<div className="empty-cat-img"

						>
							{(!snapshot.isDragging) && <><NoDocsImg />
								<h3 className="empty-cat-title">{__("No Docs Found", "betterdocs")}</h3></>}
						</div>
						<ul className="custom-placeholder">{provided.placeholder}</ul>
					</div>
				)}
			</Droppable>
		);
	}

	return (
		<Droppable droppableId={category?.id?.toString()} key={category.id}>
			{(provided, snapshot) => (
				<>
					<div className="betterdocs-dashboard-category-body">
						<ul
							className="betterdocs-dashboard-category-list"
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							{docsData.map((doc, index) => (
								<GridItem doc={doc} index={index} key={index} deleteIds={deleteIds} isLoading={isLoading} mutate={mutate} termId={category?.id} setQuickEdit={setQuickEdit} term={category} />
							))}
						</ul>
						<ul className="custom-placeholder">{provided.placeholder}</ul>
					</div>
				</>
			)}
		</Droppable>
	);
};

export default AllDocsGridItem;
