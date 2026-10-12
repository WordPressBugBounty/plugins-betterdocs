import React from 'react'
import { buildQueryString } from '@wordpress/url';
import { decodeEntities } from '@wordpress/html-entities';
import { useMemo } from '@wordpress/element';

import { useFetch } from '../hooks';
import { DocList } from './partials';
import { Spinner } from '@wordpress/components';
import { ArrowIcon } from './icons';
import IconLayoutTwo from './partials/IconLayoutTwo';

const NestedCategories = ({ id: parentCatID, attributes }) => {
    const nestedCatAPIURL = useMemo(() => {
        let query = {
            parent: parentCatID,
            hide_empty: true,
            orderby:attributes?.orderBy,
            order:attributes?.order
        };

        return `/wp/v2/doc_category/?${buildQueryString(query)}`;
    }, [parentCatID]);

    const { data: nestedCategories, isLoading: isCategoryLoading, error: categoryError } = useFetch(nestedCatAPIURL);

    return (
        <>
            { isCategoryLoading && <Spinner /> }
            {
                !isCategoryLoading &&
                nestedCategories.length > 0 &&
                nestedCategories.map(category => (
                    <li key={category.id} className='betterdocs-nested-category-wrapper'>
                        <span className='betterdocs-nested-category-title'>
                            {attributes?.sidebar_layout != 'layout-7' && <ArrowIcon/>}
                            {attributes?.sidebar_layout == 'layout-7' && <IconLayoutTwo/> }
                            <a href={void 0}>
                                {decodeEntities(category?.name)}
                            </a>
                        </span>

                        <DocList
                            {...category}
                            className='betterdocs-nested-category-list'
                            attributes={attributes}
                            categories={nestedCategories}
                        />
                    </li>
                ))
            }
        </>
    )
}

export default NestedCategories
