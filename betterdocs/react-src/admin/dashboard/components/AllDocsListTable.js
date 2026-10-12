import React, { useState, useRef, useEffect } from "react";
import { decodeEntities } from "@wordpress/html-entities";
import {
    IconSort,
    IconSmilingFace,
    IconNeutralFace,
    IconDisappointedFace
} from "../../../icons/index";
import { __ } from "@wordpress/i18n";
import DocAuthor from "./DocAuthor.js";
import DocCategory from "./DocCategory.js";
import DocTags from "./DocTags.js";
import Pagination from "../../doc-categories/components/Pagination";
import NoDocsBody from "./NoDocsBody.js";
import ContextMenu from "./ContextMenu.js";
import { gutenbergEditScreenUrl } from "../helpers/Helpers";
import { useDashboardContext } from "../DashboardContext.js";
import ListLoader from "../loaders/ListLoader.js";
import KnowledgeBase from "./KnowledgeBase.js";
import NoDocsFound from "./NoDocsFound.js";

import { applyFilters } from "@wordpress/hooks";

const AllDocsListTable = ({ restoreIDS, setLoaderIDS, setLoading, status, onFilterSelect, docs, isLoading, totalItems, totalPages, setCurrentPage, currentPage, perPage = 20, bulkData, setBulkData, loaderIDS }) => {
    const { data: quickEdit, setData: setQuickEdit }  = useDashboardContext();
    return (
        <>
            <table className="betterdocs-dashboard-list-table">
                <thead>
                    <tr>
                        <th className="title">
                            <span className="betterdocs-dashboard-custom-checkbox">
                                <input id="check-all" type="checkbox" readOnly checked={bulkData?.length > 0 && !isLoading ? true : false} onClick={(e) => {
                                    if( bulkData?.length == 0 ) {
                                        docs?.map((doc) => {
                                            if( ! bulkData?.includes(doc?.id) ) {
                                                bulkData?.push(doc?.id);
                                            }
                                        })
                                        setBulkData([...bulkData]);
                                    } else {
                                        setBulkData([]);
                                    }
                                }}></input>
                                <label htmlFor="check-all"></label>
                            </span>
                            <span className="betterdocs-dashboard-list-header-title">
                                <button
                                    onClick={() => {
                                        onFilterSelect((state) => {
                                            if( state == undefined ){
                                                let state = {};
                                                state['order']   = 'asc';
                                                state['orderby'] = 'title';
                                            } else {
                                                state['order'] = state['order'] == 'asc' ? 'desc' :'asc';
                                                state['orderby'] = 'title';
                                            }
                                            return {...state};
                                        });
                                    }}
                                >
                                    {__("Title", "betterdocs")}
                                    <span className="betterdocs-dashboard-list-header-icon">
                                        <IconSort />
                                    </span>
                                </button>
                            </span>
                        </th>
                        <th className="author">
                            <span className="betterdocs-dashboard-list-header-title">
                                {__("Author", "betterdocs")}
                            </span>
                        </th>
                        {betterdocs_admin?.multiple_kb == 1 && applyFilters('mkb_table_header', '')}
                        <th className="doc-category">
                            <span className="betterdocs-dashboard-list-header-title">
                                {__("Doc Category", "betterdocs")}
                            </span>
                        </th>
                        <th className="doc-tag">
                            <span className="betterdocs-dashboard-list-header-title">
                                {__("Doc Tag", "betterdocs")}
                            </span>
                        </th>
                        <th className="views">
                            <span className="betterdocs-dashboard-list-header-title">
                                {__("Views", "betterdocs")}
                            </span>
                        </th>
                        <th className="reaction">
                            <span className="betterdocs-dashboard-list-header-title">
                                {__("Reaction", "betterdocs")}
                            </span>
                        </th>
                        <th className="date">
                            <span className="betterdocs-dashboard-list-header-title">
                                <button
                                    onClick={() => {
                                        onFilterSelect((state) => {
                                            if( state == undefined ){
                                                let state = {};
                                                state['order']   = 'asc';
                                                state['orderby'] = 'date';
                                            } else {
                                                state['order']   = state['order'] == 'asc' ? 'desc' :'asc';
                                                state['orderby'] = 'date';
                                            }
                                            return {...state};
                                        });
                                    }}
                                >
                                    {__("Date", "betterdocs")}
                                    <span className="betterdocs-dashboard-list-header-icon">
                                        <IconSort />
                                    </span>
                                </button>
                            </span>
                        </th>
                        <th className="action">
                            <span className="betterdocs-dashboard-list-header-title">
                                {__("Action", "betterdocs")}
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading && docs?.length > 0 &&
                        docs.map((doc, index) => {
                            let authorInfo        = doc?.author_info;
                            let docCategoryInfo   = doc?.doc_category_info;
                            let doctagInfo        = doc?.doc_tag_info;
                            let wordCount         = doc?.word_count;
                            let status            = doc?.status;
                            let totalViews        = doc?.total_views ?? 0;
                            let dateString        = new Date(doc.date).toLocaleDateString();
                            let reactions         = doc?.reactions;
                            let happy             = reactions?.happy == null ? 0 : parseInt(reactions?.happy);
                            let sad               = reactions?.sad == null ? 0 : parseInt(reactions?.sad);
                            let normal            = reactions?.normal == null ? 0 : parseInt(reactions?.normal);
                            let total_reaction    = ( happy + sad + normal );
                            let max_reaction      = ( happy > sad && happy > normal ) ? 'happy' : ( ( sad > happy && sad > normal ) ? 'sad' : ( ( normal > sad && normal > happy ) ? 'normal' : ( ( happy == sad || happy == normal ) ? 'happy' : ( ( normal == sad || normal == happy ) ? 'normal' : ( ( sad == normal || sad == happy ) ? 'sad' : 'all-equal' ) ) ) ) );
                            let knowledgebaseInfo = doc?.knowledge_base_info;

                            return <tr
                                        className={
                                            ( doc.id === quickEdit.docId && quickEdit?.isOpen )
                                                ? "quickEdit-open"
                                                : ""
                                        }
                                        key={index}
                                        onClick={(e) => {
                                            // handleTRClick(doc, quickEdit);
                                            if( quickEdit?.isListMenuOpen ) {
                                                setQuickEdit((state) => ({...state, isListMenuOpen:false, docId: doc.id }));
                                            }
                                        }}
                                    >
                                    <td>
                                        <span className="betterdocs-dashboard-list-item-title-wrap">
                                            <span className="betterdocs-dashboard-custom-checkbox">
                                                <input
                                                    id={`dashboard-list-item-${doc.id}`}
                                                    type="checkbox"
                                                    checked={bulkData?.includes(doc?.id) ? true : false}
                                                    onClick={(e) => {
                                                        if( ! bulkData?.includes(doc?.id) ) {
                                                            bulkData?.push(doc?.id);
                                                            setBulkData([...bulkData]);
                                                        } else {
                                                            let filteredData = bulkData?.filter((docID) => {
                                                                return docID != doc?.id;
                                                            });
                                                            setBulkData([...filteredData]);
                                                        }
                                                    }}
                                                    readOnly
                                                ></input>
                                                <label
                                                    htmlFor={`dashboard-list-item-${doc.id}`}
                                                ></label>
                                            </span>
                                            <span className="betterdocs-dashboard-list-item-title">
                                                <a target="_blank" href={gutenbergEditScreenUrl(doc?.id)}>
                                                    {(doc.title?.rendered == null || doc?.title?.rendered == undefined || doc?.title?.rendered?.length == 0 ) ? '(no title) ' : decodeEntities(doc.title.rendered)}
                                                </a>
                                                {status != 'publish' && <span className="status">
                                                    {`- ${status?.charAt(0).toUpperCase()}${status?.slice(1)}`}
                                                </span>}
                                                <span className="word-count">
                                                    | {wordCount}&nbsp;
                                                    <span className="word-count-tooltip">{__("Word Count", "betterdocs")}</span>
                                                </span>
                                            </span>
                                        </span>
                                    </td>
                                    <td>
                                        <DocAuthor authorInfo={authorInfo} />
                                    </td>
                                    {betterdocs_admin?.multiple_kb == 1 && applyFilters('mkb_table_data', '', [KnowledgeBase, knowledgebaseInfo])}
                                    <td>
                                        <DocCategory categories={docCategoryInfo} />
                                    </td>
                                    <td>
                                        <DocTags tags={doctagInfo} />
                                    </td>
                                    <td>
                                        <span className="betterdocs-dashboard-list-item-views">
                                            <span>{totalViews}</span>
                                        </span>
                                    </td>
                                    <td>
                                        <span className="betterdocs-dashboard-list-item-views">
                                            <span className="betterdocs-reactions">
                                                <span className="betterdocs-all-reactions">
                                                    {max_reaction == 'happy'  && <IconSmilingFace/>}
                                                    {max_reaction == 'normal' &&  <IconNeutralFace/>}
                                                    {max_reaction == 'sad'    && <IconDisappointedFace />}
                                                    {max_reaction == 'all-equal' && <>
                                                        <IconSmilingFace />
                                                    </>}
                                                </span>
                                                <span>{total_reaction}</span>
                                                <ul className="betterdocs-reactions-tooltip">
                                                    {max_reaction == 'happy' &&
                                                        <>
                                                            <li>
                                                                <IconSmilingFace />
                                                                <span>{happy}</span>
                                                            </li>
                                                            <li>
                                                                <IconNeutralFace />
                                                                <span>
                                                                    {normal}
                                                                </span>
                                                            </li>
                                                            <li>
                                                                <IconDisappointedFace />
                                                                <span>
                                                                    {sad}
                                                                </span>
                                                            </li>
                                                        </>
                                                    }
                                                    {max_reaction == 'normal' &&
                                                        <>
                                                            <li>
                                                                <IconSmilingFace />
                                                                <span>{happy}</span>
                                                            </li>
                                                            <li>
                                                                <IconNeutralFace />
                                                                <span>
                                                                    {normal}
                                                                </span>
                                                            </li>
                                                            <li>
                                                                <IconDisappointedFace />
                                                                <span>
                                                                    {sad}
                                                                </span>
                                                            </li>
                                                        </>
                                                    }
                                                    {max_reaction == 'sad' &&
                                                        <>
                                                           <li>
                                                               <IconSmilingFace />
                                                               <span>{happy}</span>
                                                           </li>
                                                           <li>
                                                               <IconNeutralFace />
                                                               <span>
                                                                   {normal}
                                                               </span>
                                                           </li>
                                                           <li>
                                                               <IconDisappointedFace />
                                                               <span>
                                                                   {sad}
                                                               </span>
                                                           </li>
                                                       </>
                                                    }
                                                    {max_reaction == 'all-equal' &&
                                                        <>
                                                           <li>
                                                                <IconSmilingFace />
                                                                <span>{happy}</span>
                                                            </li>
                                                            <li>
                                                                <IconNeutralFace />
                                                                <span>{normal}</span>
                                                            </li>
                                                            <li>
                                                                <IconDisappointedFace />
                                                                <span>{sad}</span>
                                                            </li>
                                                        </>
                                                    }
                                                </ul>
                                            </span>
                                        </span>
                                    </td>
                                    <td>
                                        <span className="betterdocs-dashboard-list-item-date">
                                            <span>
                                                {dateString}
                                            </span>
                                        </span>
                                    </td>
                                    <td>
                                        <ContextMenu key={doc.id} doc={doc} status={status}/>
                                    </td>
                                    {loaderIDS.includes(doc?.id) && <div className="delete-row"></div>}
                                    {restoreIDS.includes(doc?.id) && <div className="restore-row"></div>}
                            </tr>
                    })}
                    {isLoading && <ListLoader/>}
                    {docs?.length === 0 && !isLoading && (
                        <tr className="no-docs-found">
                            <td colSpan="100%">
                                <NoDocsFound />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* Pagination — shared custom bd-dc-pagination component (no rc-pagination). */}
            <Pagination
                total={Number(totalItems)}
                page={currentPage}
                perPage={perPage}
                onPageChange={(pageNumber) => {
                    if (bulkData?.length > 0) {
                        setBulkData([]);
                    }
                    setLoading(true);
                    setCurrentPage((prevState) => {
                        return { ...prevState, page: pageNumber };
                    });
                }}
                onPerPageChange={(newPerPage) => {
                    if (bulkData?.length > 0) {
                        setBulkData([]);
                    }
                    setLoading(true);
                    setCurrentPage((prevState) => {
                        return { ...prevState, per_page: newPerPage };
                    });
                }}
            />
        </>
    );
};

export default AllDocsListTable;
