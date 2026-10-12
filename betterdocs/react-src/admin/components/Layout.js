import React, { useEffect, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import useFetch from "../dashboard/hooks/useFetch";
import { addQueryArgs } from "@wordpress/url";
import Header from './Header';
import { saveFaqOrder } from '../faq-builder/utils/function';

const Layout = () => {
    const [searchParams]                                    = useSearchParams();
    const [mkbFilter, setMkbFilterValue]                    = useState('');
    const [callRefetch, setCallRefetch]                     = useState(false);
    let { isLoading, totalPages, totalItems, setRefetch }   = useFetch({
        path: addQueryArgs(`/wp/v2/docs`, {
            status:'trash',
        }),
        parse: false
    });
    const post_status = searchParams.get('post_status');
    const [faqKeywordSearch, setFaqKeywordSearch] = useState('');
    const [debouncedFaqKeyword, setDebouncedFaqKeywordSearch] = useState('');
    const [docCategoriesKeyword, setDocCategoriesKeyword] = useState('');
    const [debouncedDocCategoriesKeyword, setDebouncedDocCategoriesKeyword] = useState('');
    const [docTagsKeyword, setDocTagsKeyword] = useState('');
    const [debouncedDocTagsKeyword, setDebouncedDocTagsKeyword] = useState('');
    // Seed from the saved preference (option `betterdocs_faq_order`) so the
    // builder opens on the same order the front end is currently using.
    const [faqOrder, setFaqOrder] = useState(betterdocs_admin?.faq_order || 'default');
    // Update the dropdown immediately, then persist so the front end mirrors it.
    const handleFaqOrderChange = (order) => {
        setFaqOrder(order);
        saveFaqOrder(order).catch(() => {});
    };
    const debounceDelay = 500;
    const page = searchParams.get('page');

    useEffect(() => {
        const handler = setTimeout(() => {
            if (page == 'betterdocs-faq') {
                setDebouncedFaqKeywordSearch(faqKeywordSearch);
            } else if (page == 'betterdocs-doc-categories') {
                setDebouncedDocCategoriesKeyword(docCategoriesKeyword);
            } else if (page == 'betterdocs-doc-tags') {
                setDebouncedDocTagsKeyword(docTagsKeyword);
            }
        }, debounceDelay);

        return () => { clearTimeout(handler); };
    }, [page, faqKeywordSearch, docCategoriesKeyword, docTagsKeyword]);

    useEffect(() => {
        setFaqKeywordSearch('');
        setDebouncedFaqKeywordSearch('');
        setDocCategoriesKeyword('');
        setDebouncedDocCategoriesKeyword('');
        setDocTagsKeyword('');
        setDebouncedDocTagsKeyword('');
    }, [page]);

    useEffect(() => {
        if( !isLoading ){
            if( searchParams?.size >= 1 || searchParams?.get('mode') == 'grid' ){
                setCallRefetch(true);
            } else if ( searchParams?.get('mode') == 'list' && post_status == 'any' ) {
                setCallRefetch(true);
            } else if( searchParams.get('mode') == 'list' && post_status == 'trash' ) {
                setCallRefetch(true);
            }
        }
    }, [isLoading, totalItems, setRefetch, post_status, searchParams]);

    return (
        <div>
            <Header
                page={page}
                postStatus={searchParams.get('post_status')}
                filter={[mkbFilter, setMkbFilterValue]}
                docs={[isLoading, totalItems]}
                mode={betterdocs_admin?.dashboard_mode != undefined && betterdocs_admin?.dashboard_mode != '' ? betterdocs_admin?.dashboard_mode : searchParams.get('mode')}
                faqSearchKeyword={faqKeywordSearch}
                handleFAQSearch={(e) => setFaqKeywordSearch(e?.target?.value)}
                faqOrder={faqOrder}
                onFaqOrderChange={handleFaqOrderChange}
                docCategoriesKeyword={docCategoriesKeyword}
                handleDocCategoriesSearch={(e) => setDocCategoriesKeyword(e?.target?.value)}
                docTagsKeyword={docTagsKeyword}
                handleDocTagsSearch={(e) => setDocTagsKeyword(e?.target?.value)}
            />
            {/* Slot 2 used to carry the glossary search keyword. Glossaries moved to
                Pro, which owns its own search field via `betterdocs_admin_header_search`,
                so it is reserved here purely to keep the positional indices below stable. */}
            <Outlet context={[mkbFilter, (callRefetch ? setRefetch : null), null, debouncedFaqKeyword, faqOrder, debouncedDocCategoriesKeyword, debouncedDocTagsKeyword]}/>
        </div>
    );
};

export default Layout;
