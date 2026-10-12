import React from "react";
import { __ } from "@wordpress/i18n";
import AllDocsFilterItem from "./AllDocsFilterItem";
import useAuthorsQuery from "../hooks/useAuthorsQuery";

import {
    IconOrder,
    IconArticle,
    IconCalendar,
    IconCategory,
    IconUser,
} from "../../../icons/index";

const AllDocsFilter = ({ onFilterSelect }) => {
    const { usersLoading, authors, authorParams, setAuthorParams, isNextPageAvailable } = useAuthorsQuery('authors-list-filter', {
        per_page:10,
        page:1
    });

    return (
        <ul className="betterdocs-dashboard-filter-list">
            <AllDocsFilterItem
                name="order"
                filterIcon={IconOrder}
                placeholder="Order"
                onFilterSelect={onFilterSelect}
                options={[
                    {
                        value: "asc",
                        label: __('Ascending', 'betterdocs'),
                    },
                    {
                        value: "desc",
                        label: __('Descending', 'betterdocs'),
                    },
                ]}
            />
            <AllDocsFilterItem
                name="year_month"
                filterIcon={IconCalendar}
                placeholder= {__('All Dates', 'betterdocs')}
                path="/betterdocs/v1/months-with-posts"
                onFilterSelect={onFilterSelect}
            />
            <AllDocsFilterItem
                options={authors}
                name="author"
                filterIcon={IconUser}
                placeholder={__('All Authors', 'betterdocs')}
                onMenuScrollToBottom={(e) => {
                    if(e != null && isNextPageAvailable){
                        setAuthorParams((prev) => {
                            return {...prev, page:authorParams.page + 1}
                        })
                    }
                }}
                onFilterSelect={onFilterSelect}
            />
            <AllDocsFilterItem
                name="doc_category"
                filterIcon={IconCategory}
                placeholder={__('All Categories', 'betterdocs')}
                path="/wp/v2/doc_category?per_page=100"
                onFilterSelect={onFilterSelect}
            />
            <AllDocsFilterItem
                name="status"
                filterIcon={IconArticle}
                placeholder={__('Doc Status', 'betterdocs')}
                onFilterSelect={onFilterSelect}
                options={[
                    {
                        value: "publish",
                        label: __('Publish', 'betterdocs'),
                    },
                    {
                        value: "pending",
                        label: __('Pending', 'betterdocs'),
                    },
                    {
                        value: "draft",
                        label: __('Draft', 'betterdocs'),
                    },
                    {
                        value: "auto-draft",
                        label: __('Auto Draft', 'betterdocs'),
                    },
                    {
                        value: "future",
                        label: "Future",
                    },
                    {
                        value: "private",
                        label: __('Private', 'betterdocs'),
                    },
                    {
                        value: "inherit",
                        label: __('Inherit', 'betterdocs'),
                    },
                ]}
            />
        </ul>
    );
};

export default AllDocsFilter;
