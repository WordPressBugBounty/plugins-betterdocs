import { useQuery, useQueryClient, QueryCache, useMutation } from "@tanstack/react-query";
import React, { useEffect, useState, useRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { __ } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";
import useFetch from "../hooks/useFetch";
import AllDocsGridItem from "./AllDocsGridItem";
import NoDocsBody from "./NoDocsBody";
import { useOutletContext } from "react-router-dom";
import { ajaxRequest, constructFormData } from "../../utils/ajaxRequest";
import apiFetch from "@wordpress/api-fetch";
import GridLoader from '../loaders/GridLoader';
import NoDocsLoader from '../loaders/NoDocsLoader';
import { addQueryArgs } from "@wordpress/url";
import GridQuickEdit from "./GridQuickEdit";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { IconNext, IconPrev } from "../../../icons";

const AllDocsGrid = () => {
    const queryClient                                             = useQueryClient();
    const [quickEdit, setQuickEdit]                               = useState({isOpen:false});
    const [mkbFilterValue, refetch]                               = useOutletContext();
    const [isDragging, setIsDragging]                             = useState(false);
    const dragTimeoutRef                                          = useRef(null);
    const [stateManager, setStateManager] = useState({
		docCategoriesQueryParams:{
			per_page:100,
			hide_empty:false,
			orderby:'doc_category_order',
			...(mkbFilterValue != '' ? {'knowledge_base': mkbFilterValue} : {}),
			page:1
		},
	});

	const { docCategoriesQueryParams } = stateManager;
	let options						   = [];

    // Pass the admin UI language so the REST read path resolves to the same
    // language-specific meta key the drag-and-drop AJAX writes to. Without this,
    // WPML resolves REST requests to the site default language and the dashboard
    // appears to revert ordering after reload when the admin language is a secondary one.
    const langParam = betterdocs_admin?.current_admin_language ? { lang: betterdocs_admin.current_admin_language } : {};

    const {
        isLoading: docsCategoriesLoading,
        data: docsCategoriesData,
    } = useQuery(["docsCategories", docCategoriesQueryParams], ({queryKey}) => {
        let [_,params] = queryKey;
        return apiFetch({
            path: addQueryArgs('betterdocs/v1/doc-categories', { ...params, ...langParam }),
            method: "GET",
            parse: false,
        }).then((data) => {
            return data.json();
        }).then((result) => {
            return result;
        });
    },{
		refetchOnMount:false,
		cacheTime:0
	});

    const { isLoading:categoriesLoading, data:categories } =  useQuery(['docCategories',docCategoriesQueryParams], ({queryKey}) => {
        let [_,params] = queryKey;
        return apiFetch({
            path: addQueryArgs(`wp/v2/doc_category`, { ...params, ...langParam }),
            method: "GET",
            parse: false,
        }).then((data) => {
            return data.json();
        }).then((result) => {
            return result;
        });
    },{
		refetchOnMount:false,
		cacheTime:0
	});

    const { mutate, data, isLoading, variables } = useMutation({
        mutationKey:['deleteDocs'],
        mutationFn:(deleteIds) => {
            for( let termId of Object.keys(deleteIds) ) {
                const { post_id_index, term_id, post_id } = deleteIds[termId];
                return apiFetch({ path: `/wp/v2/docs/${post_id}`, method:'DELETE' } );
            }
        },
        onMutate:async(deleteIds) => {
            return deleteIds;
        },
        onSettled:(data) => {
            queryClient.invalidateQueries(['docsCategories', docCategoriesQueryParams])
        },
        onSuccess:(serverResponse, deleteIds) => {
            const previousQueryData = queryClient.getQueryData(['docsCategories', docCategoriesQueryParams]);
            for( let termId of Object.keys(deleteIds) ) {
                const { post_id_index, term_id, post_id } = deleteIds[termId];
                    previousQueryData?.data[term_id]?.splice(post_id_index, 1);
                    delete deleteIds[termId];
                    if( typeof refetch == 'function'){
                        refetch(true);
                    }
                    queryClient.setQueryData(['docsCategories'], {...previousQueryData});
            }
        }
    });

    const { mutate:dragDrop } = useMutation({
        mutationKey:['sortDocsDragDrop'],
        mutationFn:(data) => {
            return null; //not needed
        },
        onMutate:async(updatedData) => {
            await queryClient.cancelQueries(['docsCategories', docCategoriesQueryParams]);
            queryClient.setQueryData(['docsCategories', docCategoriesQueryParams], {...updatedData});
        },
        onSettled:(serverResponse) => {
            return null; //not needed
        }
    });

	const itemRender = (current, type, originalElement, totalItems) => {
        if (type === 'prev') {
          if (current === 0) {
            return React.cloneElement(originalElement, { title: '' }, <IconPrev />);
          }
          return React.cloneElement(originalElement, { title: __("Previous Page", "betterdocs") }, <IconPrev />);
        }
        if (type === 'next') {
          if (current === Math.ceil(totalItems / 20)) {
            return React.cloneElement(originalElement, { title: '' }, <IconNext />);
          }
          return React.cloneElement(originalElement, { title: __("Next Page", "betterdocs") }, <IconNext />);
        }
        return originalElement;
    };

    useEffect(() => {
        if( ! categoriesLoading && ! docsCategoriesLoading ) {
            if( mkbFilterValue != '' ) {
                setStateManager({...stateManager, docCategoriesQueryParams:{...docCategoriesQueryParams, page:1, knowledge_base:mkbFilterValue}});
            } else {
				if( docCategoriesQueryParams['knowledge_base'] != undefined ) {
					delete docCategoriesQueryParams['knowledge_base'];
				}
				setStateManager({...stateManager, docCategoriesQueryParams:{ ...docCategoriesQueryParams, page:1, per_page:10, hide_empty:false, orderby:'doc_category_order'}});
            }
        }
    }, [mkbFilterValue]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (dragTimeoutRef.current) {
                clearTimeout(dragTimeoutRef.current);
            }
        };
    }, []);


    const onDragStart = () => {
        setIsDragging(true);
        // Clear any existing timeout
        if (dragTimeoutRef.current) {
            clearTimeout(dragTimeoutRef.current);
        }
    };

    const onDragEnd = (result) => {
        setIsDragging(false);

        const { destination, source } = result;

        if( !destination ) {
            return null;
        }

        // Prevent rapid successive drag operations
        if (dragTimeoutRef.current) {
            clearTimeout(dragTimeoutRef.current);
        }

        const {droppableId:destinationCategoryId, index:destinationPostIndex} = destination;
        const {droppableId:sourceCategoryId, index:sourcePostIndex}           = source;

        // Debounce the drag operation to prevent multiple rapid calls
        dragTimeoutRef.current = setTimeout(() => {
            if( sourceCategoryId == 'uncategorized' || destinationCategoryId == 'uncategorized' ){
                let sourcePost = docsCategoriesData?.data[sourceCategoryId]?.splice(sourcePostIndex, 1);
                docsCategoriesData?.data[destinationCategoryId]?.splice(destinationPostIndex, 0, sourcePost[0]);
                dragDrop(docsCategoriesData, docsCategoriesData[parseInt(sourceCategoryId)], docsCategoriesData[parseInt(destinationCategoryId)], sourceCategoryId, destinationCategoryId, sourcePost[0]?.id);
                sendAjaxRequest(docsCategoriesData?.data[sourceCategoryId], docsCategoriesData?.data[destinationCategoryId], sourceCategoryId == 'uncategorized' ? '' : sourceCategoryId , destinationCategoryId == 'uncategorized' ? '' : destinationCategoryId, sourcePost[0]?.id);
            } else {
                let sourcePost = docsCategoriesData?.data[parseInt(sourceCategoryId)]?.splice(sourcePostIndex, 1);
                docsCategoriesData?.data[parseInt(destinationCategoryId)]?.splice(destinationPostIndex, 0, sourcePost[0]);
                dragDrop(docsCategoriesData, docsCategoriesData[parseInt(sourceCategoryId)], docsCategoriesData[parseInt(destinationCategoryId)], sourceCategoryId, destinationCategoryId, sourcePost[0]?.id);
                sendAjaxRequest(docsCategoriesData?.data[parseInt(sourceCategoryId)], docsCategoriesData?.data[parseInt(destinationCategoryId)], sourceCategoryId, destinationCategoryId, sourcePost[0]?.id);
            }
        }, 300); // 300ms debounce delay
    };

    const sendAjaxRequest = async (sourceCategories, destinationCategories, sourceCategoryId, destinationCategoryId, sourcePostId) => {
        console.log('Starting drag and drop AJAX requests:', {
            sourcePostId,
            sourceCategoryId,
            destinationCategoryId,
            sourceCategories: sourceCategories?.length,
            destinationCategories: destinationCategories?.length
        });

        try {
            // Step 1: Update document category assignment first
            console.log('Step 1: Updating document category assignment');
            let orderObject = constructFormData({
                action: 'update_docs_term',
                object_id: sourcePostId,
                prev_term_id: sourceCategoryId,
                list_term_id: destinationCategoryId,
                'doc_cat_order_nonce': betterdocs_admin?.doc_cat_order_nonce,
                // Pass language for WPML/multilingual compatibility
                ...(betterdocs_admin?.current_admin_language ? { lang: betterdocs_admin.current_admin_language } : {})
            });

            const termUpdateResult = await ajaxRequest(orderObject, betterdocs_admin?.ajaxurl, 'POST', true);
            console.log('Step 1 completed:', termUpdateResult);

            // Step 2: Update source category order (only if different from destination)
            if (sourceCategoryId !== destinationCategoryId && sourceCategories && sourceCategories.length > 0) {
                console.log('Step 2: Updating source category order');
                let sourceDataObject = constructFormData({
                    'action': 'update_doc_order_by_category',
                    'doc_cat_order_nonce': betterdocs_admin?.doc_cat_order_nonce,
                    'list_term_id': sourceCategoryId,
                    'docs_ordering_data': sourceCategories,
                    // Pass language for WPML/multilingual compatibility
                    ...(betterdocs_admin?.current_admin_language ? { lang: betterdocs_admin.current_admin_language } : {})
                });

                const sourceUpdateResult = await ajaxRequest(sourceDataObject, betterdocs_admin?.ajaxurl, 'POST', true);
                console.log('Step 2 completed:', sourceUpdateResult);
            }

            // Step 3: Update destination category order
            if (destinationCategories && destinationCategories.length > 0) {
                console.log('Step 3: Updating destination category order');
                let destinationDataObject = constructFormData({
                    'action': 'update_doc_order_by_category',
                    'doc_cat_order_nonce': betterdocs_admin?.doc_cat_order_nonce,
                    'list_term_id': destinationCategoryId,
                    'docs_ordering_data': destinationCategories,
                    // Pass language for WPML/multilingual compatibility
                    ...(betterdocs_admin?.current_admin_language ? { lang: betterdocs_admin.current_admin_language } : {})
                });

                const destUpdateResult = await ajaxRequest(destinationDataObject, betterdocs_admin?.ajaxurl, 'POST', true);
                console.log('Step 3 completed:', destUpdateResult);
            }

            console.log('All drag and drop AJAX requests completed successfully');
        } catch (error) {
            console.error('Drag and drop AJAX request failed:', error);
            // Refresh the data to restore correct state
            console.log('Refreshing data due to error...');
            queryClient.invalidateQueries(['docsCategories', docCategoriesQueryParams]);
        }
    }

	for( let i = 10; i <= 100; i+=10 ) { // set the number of terms per page option for select field
		options.push(<option value={i}>{i}</option>)
	}
	// console.log(docsCategoriesData?.total_terms);
    const hasUncategorizedDocs = docsCategoriesData?.data && docsCategoriesData.data['uncategorized'] != undefined && docsCategoriesData.data['uncategorized']?.length > 0;
    const loading = categoriesLoading || docsCategoriesLoading;
    // Genuinely-empty KB (no categories, no docs) is known server-side at page
    // load, so on the first paint we can show a skeleton shaped like the empty
    // card instead of the category-grid skeleton it would immediately replace.
    const kbEmpty = Boolean(window.betterdocs_admin?.kb_is_empty);
    // Hide the (otherwise empty) category grid section in the no-docs empty state.
    const showCategoryGrid = loading || categories?.length > 0 || hasUncategorizedDocs;
    return (
        <>
            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                {loading && kbEmpty && <NoDocsLoader />}
                {showCategoryGrid && !(loading && kbEmpty) && (
                <section className="betterdocs-dashboard-body betterdocs-dashboard-category-grid">
                    <div className="betterdocs-dashboard-container">
                        <div className="betterdocs-row">
                            {( categoriesLoading || docsCategoriesLoading ) && <GridLoader/>}
                            {(!categoriesLoading && !docsCategoriesLoading && categories?.length > 0) &&
                                categories.map((category, key) => {
                                    return  <div
                                                className="betterdocs-col betterdocs-col-md-4"
                                                key={key}
                                            >
                                                <div className="betterdocs-dashboard-category-wrap">
                                                    <div className="betterdocs-dashboard-category-header">
                                                        <h3 className="betterdocs-dashboard-category-name">
                                                            {decodeEntities(category?.name)}
                                                        </h3>
                                                    </div>
                                                    {docsCategoriesData?.data[category?.id] != undefined && <AllDocsGridItem category={category} docsData={docsCategoriesData?.data[category?.id]} deleteIds={variables == undefined ? {} : variables} isLoading={isLoading} mutate={mutate} setQuickEdit={setQuickEdit} />}
                                                    <div className="betterdocs-dashboard-category-footer">
                                                        <a
                                                            href={`post-new.php?post_type=docs&cat=${category.id}`}
                                                            className="betterdocs-dashboard-btn betterdocs-dashboard-btn-white"
                                                        >
                                                            {__("Add New Doc", "betterdocs")}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                })}
                                {!categoriesLoading && !docsCategoriesLoading && docsCategoriesData?.data['uncategorized'] != undefined && docsCategoriesData?.data['uncategorized']?.length > 0 && (
                                    <div
                                        className="betterdocs-col betterdocs-col-md-4"
                                        key={'uncategorized'}
                                    >
                                     <div className="betterdocs-dashboard-category-wrap">
                                         <div className="betterdocs-dashboard-category-header">
                                             <h3 className="betterdocs-dashboard-category-name">
                                                 {__('Uncategorized', 'betterdocs')}
                                             </h3>
                                         </div>
                                         {<AllDocsGridItem category={{
                                            'id':'uncategorized'
                                         }} docsData={docsCategoriesData?.data['uncategorized']} deleteIds={variables == undefined ? {} : variables} isLoading={isLoading} mutate={mutate} setQuickEdit={setQuickEdit} />}
                                         <div className="betterdocs-dashboard-category-footer">
                                             <a
                                                 href={`post-new.php?post_type=docs&cat=${''}`}
                                                 className="betterdocs-dashboard-btn betterdocs-dashboard-btn-white"
                                             >
                                                 {__("Add New Doc", "betterdocs")}
                                             </a>
                                         </div>
                                     </div>
                                 </div>
                                )}
                        </div>
						{(!categoriesLoading && !docsCategoriesLoading && parseInt(docsCategoriesData?.total_terms) > 100) && <div className="doc-list-pagination-wrap">
							{<div className="pagination-group"><select value={docCategoriesQueryParams?.per_page} className="number-of-categories" onChange={(e) => {
								docCategoriesQueryParams['per_page'] = e?.target?.value;
								setStateManager({...stateManager, docCategoriesQueryParams:{...docCategoriesQueryParams}});
							}}>
								{options?.map((value) => {
									return value;
								})}
							</select>
							<p>{__('category in this page', 'betterdocs')}</p></div>}
							<Pagination
								pageSize={docCategoriesQueryParams?.per_page}
								current={docCategoriesQueryParams?.page}
								total={docsCategoriesData?.total_terms}
								onChange={(value) => {
									docCategoriesQueryParams['page'] = value;
									setStateManager({...stateManager, docCategoriesQueryParams:{...docCategoriesQueryParams}});
								}}
								itemRender={(current, type, originalElement) => itemRender(current, type, originalElement, docsCategoriesData?.total_terms)}
							/>
						</div>}
                    </div>
                </section>
                )}
            </DragDropContext>
            {(!categoriesLoading && !docsCategoriesLoading && categories?.length == 0) && <NoDocsBody isDocs={docsCategoriesData?.data?.length == 0 && docsCategoriesData?.data['uncategorized'] == undefined ? false : true}/>}
            {(quickEdit?.isOpen) && <GridQuickEdit data={quickEdit?.data} setQuickEdit={setQuickEdit} setCategoriesPosts={queryClient} docCategoriesQueryParams={docCategoriesQueryParams}/>}
        </>
    );
};

export default AllDocsGrid;
