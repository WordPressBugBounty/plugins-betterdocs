import React, { useState } from "react";
import { __ } from "@wordpress/i18n";
import { IconDotsHorizontal } from "~betterdocs/icons";
import { useDashboardContext } from "../DashboardContext";
import { gutenbergEditScreenUrl } from "../helpers/Helpers";
import { applyFilters } from "@wordpress/hooks";

const ContextMenu = (props) => {
    const { doc, status } = props;

    const { data, setData } = useDashboardContext();

    const { isListMenuOpen, docId } = data;
	const { doc_category, knowledge_base } 			= doc;

	let nonTrashButtons = applyFilters('contextMenuListTable', {
		'edit' : () => {
			return <li>
						<a
							target="_blank"
							href={gutenbergEditScreenUrl(doc.id)}
						>
							{__("Edit", "betterdocs")}
						</a>
					</li>
		},
		'quickEdit':() => {
			return  <li>
						<a
							href="#"
							onClick={() =>
								setData((state) => ({
									...state,
									isOpen: true,
									docData: doc,
								}))
							}
						>
							{__("Quick Edit", "betterdocs")}
						</a>
					</li>
		},
		'trash':() => {
			return  <li>
						<a
							href="#"
							onClick={(event) => {
								event.preventDefault();
								setData((state) => ({
									...state,
									quickAction: {
										action: "trash",
										docId: doc?.id,
									},
								}));
							}}
						>
							{__("Trash", "betterdocs")}
						</a>
					</li>
		},
		'view':() => {
			return  <li>
						<a target="_blank" href={doc.link}>
							{__("View", "betterdocs")}
						</a>
					</li>
		}
	}, doc);

    return (
        <span className="betterdocs-dashboard-list-item-action">
            <span
                className="betterdocs-dashboard-list-item-action-icon"
                onClick={() =>
                    setData((state) => ({
                        ...state,
                        isListMenuOpen: !isListMenuOpen,
                        docId: doc.id,
                    }))
                }
            >
                <IconDotsHorizontal />
            </span>

            {isListMenuOpen && docId != undefined && docId == doc?.id && (
                <ul className="betterdocs-dashboard-list-item-action-dropdown open">
                    {status != "trash" && (
                        Object.keys(nonTrashButtons)?.map((key) => {
							return nonTrashButtons[key]();
						})
                    )}
                    {status == 'trash' && <>
                            <li>
                                <a
                                    target="_blank"
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setData((state) => ({
                                            ...state,
                                            quickAction: {
                                                action: "restore",
                                                docId: doc?.id,
                                            },
                                        }));
                                    }}
                                >
                                    {__("Restore", "betterdocs")}
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setData((state) => ({
                                            ...state,
                                            quickAction: {
                                                action: "permanent-delete",
                                                docId: doc?.id,
                                            },
                                        }));
                                    }}
                                >
                                    {__("Delete Permanantly", "betterdocs")}
                                </a>
                            </li>
                    </> }
                </ul>
            )}
        </span>
    );
};

export default ContextMenu;
