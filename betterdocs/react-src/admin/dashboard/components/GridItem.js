import { memo } from "@wordpress/element";
import { Draggable } from "react-beautiful-dnd";
import { __ } from "@wordpress/i18n";
import { IconDrag, IconDelete, IconOpen, IconEdit } from "../../../icons";
import { gutenbergEditScreenUrl } from "../helpers/Helpers";
import { decodeEntities } from "@wordpress/html-entities";
import { applyFilters } from "@wordpress/hooks";

const GridItem = ({ doc, index, deleteIds, isLoading, termId, setQuickEdit, mutate, term }) => {
    return (
        <Draggable key={doc?.unique_id} draggableId={doc?.unique_id?.toString()} index={index}>
            {(provided, snapshot) => {
				const actions = applyFilters('dashboardGridViewItem',{
					editAction:() => {
						return <a
								className="betterdocs-dashboard-doc-action-edit"
								title={__("Quick Edit", "betterdocs")}
								href={gutenbergEditScreenUrl(doc.id)}
								onClick={(e) => {
									e.preventDefault();
									setQuickEdit((prevState) => {
										return {...prevState, isOpen: !prevState.isOpen, data:{docData:doc, termId:termId, docId:doc?.id}}
									})
								}}
							>
								<IconEdit />
							</a>
					},
					viewAction:() => {
						return <a
									className="betterdocs-dashboard-doc-action-open"
									target="_blank"
									title={__("View", "betterdocs")}
									href={doc?.link}
								>
									<IconOpen />
								</a>
					},
					deleteAction:() => {
						return <button
									className="betterdocs-dashboard-doc-action-delete"
									type="button"
									title={__("Trash", "betterdocs")}
									onClick={(e) => {
										deleteIds[termId] = {
											post_id_index:index,
											term_id:termId,
											post_id:doc.id
										}
										mutate(deleteIds);
									}}
								>
									<IconDelete />
								</button>
					},
					editDoc: <a href={gutenbergEditScreenUrl(doc?.id)}>{decodeEntities(doc?.title)}{doc?.status != 'publish' && <span className="status">{` - ${doc?.status?.charAt(0).toUpperCase()}${doc?.status?.slice(1)}`}</span>}</a>
				}, doc, term, termId);

				return	<li
							className={`${snapshot.isDragging ? 'is-dragging' : ''}`}
							ref={provided.innerRef}
							{...provided.draggableProps}
							{...provided.dragHandleProps}
							style={{
								cursor:snapshot.isDragging ? 'move' : 'move',
								...provided.draggableProps.style
							}}
						>
							{((deleteIds[termId]?.post_id == doc?.id && isLoading)) && <div className="delete-row"></div>}
							<span
								className="betterdocs-dashboard-doc-drag"
							>
								<IconDrag />
							</span>
							{actions['editDoc']}
							{Object.values(actions)?.length > 0 && <span className="betterdocs-dashboard-doc-actions">
								{Object.keys(actions)?.map((key) => {
									if( key != 'editDoc' ) {
										return actions[key]();
									}
								})}
							</span>}
						</li>
			}}
        </Draggable>
    );
};

export default memo(GridItem);
