import React from 'react'
import { useMemo } from '@wordpress/element';
import { buildQueryString } from '@wordpress/url';
import { decodeEntities } from '@wordpress/html-entities';

import { useFetch } from '../../hooks';
import ListIcon from './ListIcon';
import NestedCategories from '../NestedCategories';

import { docIcon } from '../../blocks/sidebar/icons/Icons';


const DocList = ({ className = 'betterdocs-articles-list', attributes, categories, ...props }) => {
    const { postsPerPage, postsOrderBy, postsOrder, listIcon, enableNestedSubcategory, listIconImageUrl='' } = attributes;

    const docsByCatIDURL = useMemo(() => {
        let query = {
            per_page: postsPerPage ? postsPerPage : 0,
            orderby: postsOrderBy,
            order: postsOrder,
            doc_category: props.id
        };

        const baseURL = query.orderby === "betterdocs_order" ? '/betterdocs/v1/order_docs' : '/wp/v2/docs';

        return `${baseURL}?${buildQueryString(query)}`;
    }, [categories, postsPerPage, postsOrderBy, postsOrder, props.id]);

    const { data: docs, isLoading: isDocsLoading, error: docsError } = useFetch(docsByCatIDURL);
    return (
        <ul className={className}>
            {
                !isDocsLoading &&
                docs.length > 0 && docs.map(doc => (
                    <li key={doc.id}>
                        {props?.showDocIcon && docIcon()}
                        {listIcon?.length == 0 && listIconImageUrl?.length == 0 && betterDocsBlocksHelper?.docsIcon?.length > 0 && <img src={betterDocsBlocksHelper?.docsIcon}/>}
                        {(listIcon?.length > 0 && listIconImageUrl?.length == 0) && <ListIcon icon={listIcon} />}
                        {listIconImageUrl?.length > 0 && <img src={listIconImageUrl}/>}
                        <a href={void 0}>
                            {decodeEntities(doc.title.rendered)}
                        </a>
                    </li>
                ))
            }

            {
                Boolean(enableNestedSubcategory) &&
                <NestedCategories
                    {...props}
                    attributes={attributes}
                />
            }
        </ul>
    )
}

export default DocList
