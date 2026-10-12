import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiFetch from "@wordpress/api-fetch";
import { __, _n, sprintf } from "@wordpress/i18n";
import AllDocsFilter from "./AllDocsFilter.js";
import AllDocsListTable from "./AllDocsListTable.js";
import AllDocsSearch from "./AllDocsSearch.js";
import NoDocsBody from "./NoDocsBody.js";
import NoDocsLoader from "../loaders/NoDocsLoader.js";
import QuickEdit from "./QuickEdit.js";
import { useDashboardContext } from "../DashboardContext";
import { addQueryArgs } from "@wordpress/url";
import { toast } from "react-toastify";

import { useOutletContext } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { makeRouteURL } from "../../../utils/history.js";

import { objectDifference } from "../helpers/Helpers.js";

import useFetch from "../hooks/useFetch";
import useDebounce from "../hooks/useDebounce.js";

import Swal from "sweetalert2";

const AllDocsList = ( { post_status } ) => {
    const [mkbFilterValue, refetch]           = useOutletContext();
    const [bulkData, setBulkData]             = useState([]);
    const { data, setData }                   = useDashboardContext();
    const [filterOptions, setFilterOptions]   = useState(undefined);
    let   [restoreIDS, setRestoreIDS]         = useState([]);
    let   [LoaderIDS, setLoaderIDS]           = useState([]);
    const [searchKeyword, setSearchKeyword]   = useState('');
    const debouncedKeyword                    = useDebounce(searchKeyword);
    const [queryParams, setQueryParams]       = useState({
        per_page:20,
        // Default the "All Docs" panel to every status (drafts included), not just
        // published — otherwise generated sample docs, which are inserted as drafts,
        // aren't counted (totalItems stays 0 → isEmptyKB → "No Category Found") and
        // don't appear in the list until one is published.
        status:post_status || 'any',
        page:1,
        ...(mkbFilterValue != '' ? {'knowledge_base_slug': mkbFilterValue} : {})
    });

    const { data: docs, isLoading, error, totalPages, totalItems, setRefetch, setIsLoading, setData:setDocsData} = useFetch({
        path: addQueryArgs(`/wp/v2/docs`, queryParams),
        parse: false
    });

    // Doc-category count — the empty state must agree with the grid view (and with the
    // server's kb_is_empty(), which is "no categories AND no docs"). A knowledge base
    // with categories but no docs yet is NOT empty: the grid shows those categories, so
    // the list must show the table (which renders its own "No Docs Found") rather than
    // the onboarding panel. Only the term count is needed, hence per_page=1 + the header.
    const langParam = betterdocs_admin?.current_admin_language ? { lang: betterdocs_admin.current_admin_language } : {};
    const { isLoading: categoriesLoading, data: categoryCount } = useQuery(
        ["docCategoriesCount", langParam],
        () =>
            apiFetch({
                path: addQueryArgs("wp/v2/doc_category", { per_page: 1, hide_empty: false, _fields: "id", ...langParam }),
                method: "GET",
                parse: false,
            }).then((response) => Number(response.headers.get("x-wp-total") || 0)),
        { refetchOnMount: false, cacheTime: 0 }
    );

    const navigate = useNavigate();

    const { quickAction, docId } = data;

    /**
     * This Effect Runs When Keyword Has Been Placed
     */
    useEffect(() => {
        if( ! isLoading ) {
            let defaultParams;
            if( debouncedKeyword != '' ) {
                defaultParams = {
                    ...(filterOptions != '' ? filterOptions : {} ),
                    page:1,
                    per_page:20,
                    status:'any',
                    search:debouncedKeyword
                };
            } else {
                defaultParams = {
                    ...(filterOptions != '' ? filterOptions : {} ),
                    page:1,
                    status:'any',
                    per_page:20,
                }
            }
            setIsLoading(true);
            setQueryParams({...defaultParams});
        }
    }, [debouncedKeyword]);

    /**
     * If The Post Status Is Changes Set The Current Page to 1 For Trash/Any
     */
    useEffect(() => {
        if( ! isLoading ) {
            let defaultParams = {
                page:1,
                status:post_status || 'any',
                per_page:20,
                page:1
            };
            setQueryParams((prevState) => {
                setIsLoading(true);
                return {...defaultParams};
            });
        }
        if( bulkData?.length > 0 ){
            setBulkData([]);
        }
    }, [post_status]);

    /**
     * This Effect Runs for mkb filter and search value are not empty
     */
    useEffect(() => {
        if( ! isLoading ) {
            if( post_status != 'trash' ) {
                setQueryParams((prevState) => {
                    if( mkbFilterValue == '' ){
                        if( prevState['knowledge_base_slug'] != undefined ){
                            setIsLoading(true);
                            delete prevState['knowledge_base_slug'];
                        }
                    } else {
                        setIsLoading(true);
                        prevState['knowledge_base_slug'] = mkbFilterValue;
                    }

                    return {...queryParams, ...prevState};
                });
            }
        }
    }, [mkbFilterValue, post_status]);

    useEffect(() => {
        if( quickAction != undefined ) {
            let { action, docId, forceDelete } = quickAction;

            if( action == 'trash' ){
                LoaderIDS.push(docId);
                setLoaderIDS([...LoaderIDS]);
                wp.apiFetch({ path: `/wp/v2/docs/${docId}`, method:'DELETE'} ).then((result) => {
                    if( result != undefined ){
                        let docsUpdated = docs?.filter((doc) => {
                            return doc?.id != docId;
                        });
                        if(typeof refetch == 'function'){ //refetch when trash is initiated
                            refetch(true);
                        }
                        setDocsData([...docsUpdated]);
                        setTimeout(() => {
                            setLoaderIDS([]);
                        }, 1000);
                        setData((data) => {
                            return {...data, quickAction:{}};
                        });
                        if( docsUpdated?.length == 0 ) { //when docs are zero in list and post_type 'any', set loading to true and refetch
                            setIsLoading(true);
                            setRefetch(true);
                        }
                    }
                }).catch((error) => {
                    setData((data) => {
                        return {...data, quickAction:{}};
                    });
                    setTimeout(() => {
                        setLoaderIDS([]);
                    }, 1000);
                });
            }

            if( action == 'permanent-delete' ) {
                Swal.fire({
                    title: __("Are you sure you want to permanently delete this post?", "betterdocs"),
                    icon: "warning",
                    showConfirmButton: true,
                    showCancelButton:true,
                    confirmButtonText: __('Yes', 'betterdocs'),
                    cancelButtonText: __('No', 'betterdocs'),
                    customClass: {
                        popup: 'betterdocs-bulk-action-popup'
                    }
                }).then((result) => {
                    if(result?.isConfirmed){
                        LoaderIDS.push(docId);
                        setLoaderIDS([...LoaderIDS]);
                        wp.apiFetch({ path: `/wp/v2/docs/${docId}`, method:'DELETE', data:{'force':true}} ).then((result) => {
                            if( result != undefined ){
                                let docsUpdated = docs?.filter((doc) => {
                                    return doc?.id != docId;
                                });
                                if(typeof refetch == 'function'){ //refetch when permanent-delete is initiated
                                    refetch(true);
                                }
                                setDocsData([...docsUpdated]);
                                setTimeout(() => {
                                    setLoaderIDS([]);
                                }, 1000);
                                setData((data) => {
                                    return {...data, quickAction:{}};
                                });
                                if( docsUpdated?.length == 0 && totalPages == 1 ) { //when docs are zero, set default query params and redirect to post_type 'any'
                                    setQueryParams((prevState) => {
                                        return {...prevState, status:'any', page:1};
                                    })
                                    navigate(makeRouteURL("betterdocs-admin", {
                                        mode: "list",
                                        post_status: "any",
                                    }));
                                } else if ( docsUpdated?.length == 0 ) { //refetch when docs are zero
                                    setIsLoading(true);
                                    setRefetch(true);
                                }
                            }
                        }).catch((error) => {
                            toast.error(__('Failed To Delete Permanently', 'betterdocs'));
                            setData((data) => {
                                return {...data, quickAction:{}};
                            });
                            setTimeout(() => {
                                setLoaderIDS([]);
                            }, 1000);
                        });
                    }
                });
            }

            if( action == 'bulk-delete' ){
                let data = {};
                let docsUpdated    = docs;
                let updatedLoaders = LoaderIDS;
                if( forceDelete != undefined ) {
                    data['force'] = forceDelete ? true : false;
                }
                //delete bulk data
                for( let id of bulkData ) {
                    wp.apiFetch({ path: `/wp/v2/docs/${id}`, method:'DELETE', data:data } ).then((result) => {
                       if(result != undefined){
                            docsUpdated = docsUpdated?.filter((doc) => {
                                return doc?.id != id;
                            });
                            updatedLoaders = updatedLoaders?.filter((docId) => {
                                return docId != id;
                            });
                            if(typeof refetch == 'function' && post_status == 'any' || typeof refetch == 'function' && post_status == 'trash' || typeof refetch == 'function' && post_status == undefined){ //refetch the trash count whenever bulk delete is initiated
                                refetch(true);
                            }
                            setDocsData([...docsUpdated]);
                            setLoaderIDS([...updatedLoaders]);
                            if(docsUpdated?.length == 0 && post_status == 'any'){ //when list is empty refetch for more docs, and initiate loading effect
                                setIsLoading(true);
                                setRefetch(true);
                            }
                            if(docsUpdated?.length == 0 && post_status == 'trash' && totalPages == 1){ //when docs are zero in the list for bulk-delete & has only a single page, set default query params and redirect to post type 'any'
                                setQueryParams((prevState) => {
                                    return {...prevState, status:'any', page:1};
                                });
                                navigate(makeRouteURL("betterdocs-admin", {
                                    mode: "list",
                                    post_status: "any",
                                }));
                            } else if (docsUpdated?.length == 0 && post_status == 'trash') { //refetch when docs are zero and post_status is trash
                                setIsLoading(true);
                                setRefetch(true);
                            }
                       }
                    });
                }
                setBulkData([]);
                setData((data) => {
                    return {...data, quickAction:{}};
                });
            }

            if( action =='restore' ) {
                let statusUpdatedDoc = {'status':'publish'};
                restoreIDS.push(docId);
                setRestoreIDS([...restoreIDS]);
                wp.apiFetch({
                    path: `/wp/v2/docs/${docId}`,
                    method: "POST",
                    data: statusUpdatedDoc,
                }).then((result) => {
                    if(result != undefined){
                        let docsUpdated = docs?.filter((doc) => {
                            return doc?.id != docId;
                        });
                        if(typeof refetch == 'function'){ //refetch when restore is initiated
                            refetch(true);
                        }
                        setDocsData([...docsUpdated]);
                        setData((data) => {
                            return {...data, quickAction:{}};
                        });
                        setTimeout(() => {
                            setRestoreIDS([])
                        }, 1000);
                        if(docsUpdated?.length == 0 && totalPages == 1) { //when docs are zero in the list for bulk-delete and total pages are 1, set default query params and redirect to post type 'any'
                            setQueryParams((prevState) => {
                                return {...prevState, status:'any', page:1};
                            });
                            navigate(makeRouteURL("betterdocs-admin", {
                                mode: "list",
                                post_status: "any",
                            }));
                        } else if ( docsUpdated?.length == 0 ) { //refetch when docs are zero
                            setIsLoading(true);
                            setRefetch(true);
                        }
                    }
                }).catch((error) => {
                    setTimeout(() => {
                        setRestoreIDS([])
                    }, 1000);
                    setData((data) => {
                        return {...data, quickAction:{}};
                    });
                });
            }

            if( action == 'bulk-restore' ){
                let statusUpdatedDoc = {'status':'publish'};
                let docsUpdated      = docs;
                let updatedLoaders   = restoreIDS;
                for( let id of bulkData ) {
                    wp.apiFetch({
                        path: `/wp/v2/docs/${id}`,
                        method: "POST",
                        data: statusUpdatedDoc,
                    }).then((result) => {
                        if(result != undefined){
                            docsUpdated = docsUpdated?.filter((doc) => {
                                return doc?.id != id;
                            });
                            updatedLoaders = updatedLoaders?.filter((docId) => {
                                return docId != id;
                            });
                            if(typeof refetch == 'function'){ //refetch when bulk-restore is initiated
                                refetch(true);
                            }
                            setDocsData([...docsUpdated]);
                            setRestoreIDS([...updatedLoaders]);
                            if( docsUpdated?.length == 0 && post_status == 'trash' && totalPages == 1 ){ //when docs are zero in the list for bulk-restore & total pages are 1, set default query params and redirect to post type 'any'
                                setQueryParams((prevState) => {
                                    return {...prevState, status:'any', page:1};
                                });
                                navigate(makeRouteURL("betterdocs-admin", {
                                    mode: "list",
                                    post_status: "any",
                                }));
                            } else if ( docsUpdated?.length == 0 && post_status == 'trash' ) { //refetch when docs are zero and post_status is trash
                                setIsLoading(true);
                                setRefetch(true);
                            }
                        }
                    })
                }
                setBulkData([]);
                setData((data) => {
                    return {...data, quickAction:{}};
                });
            }
        }
    }, [quickAction]);

    /**
     * Effect Runs When Filters Are Triggered
     */
    useEffect(() => {
        let defaultParams = {
            ...queryParams,
            page:1,
            per_page:20,
            status:'any',
        }
        setQueryParams((prevState) => {
            if( filterOptions != undefined && Object.keys(filterOptions)?.length > 0 ) {
                defaultParams = objectDifference(prevState, filterOptions, ['author', 'doc_category', 'year_month', 'status', 'order']);
                setIsLoading(true);
                return {...defaultParams, ...filterOptions};
            }
            if( filterOptions != undefined && Object.keys(filterOptions)?.length == 0 ) {
                defaultParams = objectDifference(prevState, filterOptions, ['author', 'doc_category', 'year_month', 'status', 'order']);
                setIsLoading(true);
                return {...defaultParams, status:'any'};
            }
            return prevState;
        });
    }, [filterOptions]);

    // Empty knowledge base: no docs at all, default view, no search / MKB filter.
    // Show the sample-doc generation panel only (hide the filter bar + table),
    // matching the grid view's empty state.
    const defaultView = post_status !== 'trash'
        && !searchKeyword?.trim()
        && (mkbFilterValue == null || mkbFilterValue === '');
    // Genuinely-empty KB is known server-side at page load, so during the initial
    // fetch show a skeleton shaped like the No Category Found card instead of the
    // row skeleton it would immediately replace.
    const showEmptyLoader = (isLoading || categoriesLoading) && defaultView && Boolean(window.betterdocs_admin?.kb_is_empty);
    // No docs AND no categories — otherwise the categories the grid view happily shows
    // would be hidden here behind the onboarding panel.
    const isEmptyKB = !isLoading
        && !categoriesLoading
        && Number(totalItems) === 0
        && Number(categoryCount || 0) === 0
        && defaultView;

    return (
        <section className="betterdocs-dashboard-body betterdocs-dashboard-category-list" onClick={(e) => {
            if( data?.isListMenuOpen ) {
                setData((state) => ({...state, isListMenuOpen:false}));
            }
        }}>
            <div className="betterdocs-dashboard-container">
                {showEmptyLoader && <NoDocsLoader />}
                {isEmptyKB && <NoDocsBody isDocs={false} />}
                {!isEmptyKB && !showEmptyLoader && post_status != 'trash' && <div className="betterdocs-dashboard-category-list-filter">
                    <div className="betterdocs-row">
                        <div className="betterdocs-col betterdocs-col-md-3">
                            <AllDocsSearch
                                setSearchKeyword={setSearchKeyword}
                            />
                        </div>
                        <div className="betterdocs-col betterdocs-col-md-9">
                            <div className="betterdocs-dashboard-filter-wrap">
                                <AllDocsFilter
                                    onFilterSelect={setFilterOptions}
                                />
                            </div>
                        </div>
                    </div>
                </div>}
                {bulkData?.length > 0 && <div className="betterdocs-dashboard-bulk-option">
                    <div className="betterdocs-row">
                        <div className="betterdocs-col betterdocs-col-md-6">
                            {/* <span className="betterdocs-dashboard-custom-checkbox">
                                <input id="bulk-items" type="checkbox" checked={bulkData?.length > 0 ? true : false} onClick={(e) => {
                                    setBulkData([]);
                                }}></input>
                                <label For="bulk-items"></label>
                            </span> */}
                            <h5 className="bulk-option-item-count">
                                <span>{sprintf(_n('%d Item Selected', '%d Items Selected', bulkData?.length, 'betterdocs'), bulkData?.length)}</span>
                            </h5>
                        </div>
                        <div className="betterdocs-col betterdocs-col-md-6">
                            <div className="betterdocs-dashboard-bulk-option-actions">
                                <button
                                    className="bulk-option-action-btn"
                                    type="button"
                                    onClick={(e) => {
                                        Swal.fire({
                                            text: post_status == 'any' 
                                                ? sprintf(_n("Are you sure you want to move %d Doc to the trash?", "Are you sure you want to move %d Docs to the trash?", bulkData?.length, "betterdocs"), bulkData?.length) 
                                                : sprintf(_n("Are you sure you want to permanently delete %d Doc?", "Are you sure you want to permanently delete %d Docs?", bulkData?.length, "betterdocs"), bulkData?.length),
                                            icon: "warning",
                                            showConfirmButton: true,
                                            showCancelButton:true,
                                            confirmButtonText: __('Yes', 'betterdocs'),
                                            cancelButtonText: __('No', 'betterdocs'),
                                            customClass: {
                                                popup: 'betterdocs-bulk-action-popup'
                                            }
                                        }).then((result) => {
                                            if( result?.isConfirmed ) {
                                                setLoaderIDS([...bulkData]);
                                                setData((state) => {
                                                    return {...state, quickAction:{action:'bulk-delete', forceDelete:post_status == 'trash' ? true : false}}
                                                });
                                            }
                                        });
                                    }}
                                >
                                {post_status == 'trash' ? __('Delete Permanently', 'betterdocs') : __("Move to Trash", 'betterdocs')}
                                </button>
                                {post_status == 'trash' && <button
                                    className="bulk-option-action-btn"
                                    type="button"
                                    onClick={(e) => {
                                        Swal.fire({
                                            text: sprintf(_n("Are you sure you want to restore %d Doc?", "Are you sure you want to restore %d Docs?", bulkData?.length, "betterdocs"), bulkData?.length),
                                            icon: "warning",
                                            showConfirmButton: true,
                                            showCancelButton:true,
                                            confirmButtonText: __('Yes', 'betterdocs'),
                                            cancelButtonText: __('No', 'betterdocs'),
                                            customClass: {
                                                popup: 'betterdocs-bulk-action-popup'
                                            }
                                        }).then((result) => {
                                            if( result?.isConfirmed ) {
                                                setRestoreIDS([...bulkData]);
                                                setData((state) => {
                                                    return {...state, quickAction:{action:'bulk-restore'}}
                                                });
                                            }
                                        });
                                    }}
                                >
                                   {__('Restore', 'betterdocs')}
                                </button>}
                            </div>
                        </div>
                    </div>
                </div>}
                {!isEmptyKB && !showEmptyLoader && <div className="betterdocs-dashboard-item-list-wrap">
                    <AllDocsListTable
                        setLoading={setIsLoading}
                        onFilterSelect={setFilterOptions}
                        docs={docs}
                        totalItems={totalItems}
                        totalPages={totalPages}
                        setCurrentPage={setQueryParams}
                        currentPage={queryParams?.page}
                        perPage={queryParams?.per_page}
                        bulkData={bulkData}
                        setBulkData={setBulkData}
                        status={post_status}
                        setLoaderIDS={setLoaderIDS}
                        loaderIDS={LoaderIDS}
                        isLoading={isLoading}
                        restoreIDS={restoreIDS}
                    />
                    {data?.isOpen && <QuickEdit setDocuments={setDocsData}/>}
                </div>}
            </div>
        </section>
    );
};

export default AllDocsList;
