import React from "react";
import { useBlockProps } from "@wordpress/block-editor";
import { buildQueryString } from "@wordpress/url";
import { Spinner } from "@wordpress/components";
import { useMemo, useEffect } from "@wordpress/element";
import { safeHTML } from '@wordpress/dom';

import Inspector from "./inspector";
import { NotFound, SingleCategory } from "../../../components";
import {
    usePreviewDeviceType,
    useDuplicateBlockIdFix,
    useStyleSheets,
    useFetch,
} from "../../../hooks";
import cssProperties from "./cssProperties";
import masonryGrider from "./helper";

const BLOCK_PREFIX = "betterdocs-categorygrid";
const Edit = ({ attributes, setAttributes, isSelected, clientId }) => {
    const {
        blockId,
        selectKB,
        includeCategories,
        excludeCategories,
        gridPerPage,
        orderBy,
        order,
        enableNestedSubcategory,
        layoutMode,
        layout,
        categoryTitleLink,
    } = attributes;
    usePreviewDeviceType(setAttributes);
    useDuplicateBlockIdFix(BLOCK_PREFIX, blockId, clientId, setAttributes);
    const { properties, htmlAttributes, styleTag } = useStyleSheets({
        properties: cssProperties({ blockId, layoutMode, layout }),
        setAttributes,
        attributes,
    });

    const categoryApiURL = useMemo(() => {
        let query = {
            per_page: gridPerPage ? gridPerPage : 9,
            orderby: orderBy,
            order: order,
            hide_empty: 1,
        };

        let knowledge_base = [];
        if (selectKB && selectKB !== "[]") {
            // Parse the JSON string to convert it into an object
            const kbObject = JSON.parse(selectKB);

            // If the parsed value is an object and has a 'value' property, extract it
            if (typeof kbObject === "object" && kbObject.value !== undefined) {
                knowledge_base.push(kbObject.value);
            } else if (Array.isArray(kbObject)) {
                knowledge_base = kbObject.map((kb) => kb.value);
            }
        }

        let include =
            includeCategories && includeCategories !== "[]"
                ? JSON.parse(includeCategories).map(
                      (category) => category.value,
                  )
                : [];

        let exclude =
            excludeCategories && excludeCategories !== "[]"
                ? JSON.parse(excludeCategories).map(
                      (category) => category.value,
                  )
                : [];

        include = include.filter((item) => !exclude.includes(item));

        if (include.length > 0) {
            query["include"] = include;
        }
        if (exclude.length > 0) {
            query["exclude"] = exclude;
        }

        if (enableNestedSubcategory) {
            query["parent"] = 0;
            query["nested_subcategory"] = true;
        }

        if (knowledge_base.length > 0) {
            query["filter[knowledgebase]"] = knowledge_base.join(",");
        }

        return `/wp/v2/doc_category/?${buildQueryString(query)}`;
    }, [
        selectKB,
        includeCategories,
        excludeCategories,
        gridPerPage,
        orderBy,
        order,
        enableNestedSubcategory,
    ]);

    const {
        data: categories,
        isLoading: isCategoryLoading,
        error: categoryError,
    } = useFetch(categoryApiURL);

    const blockProps = useBlockProps({
        className: `bd-guten-block-main-parent-wrapper`,
    });

    useEffect(() => {
        masonryGrider();
    }, [layoutMode, categories]);

    const clearMasonryGrider = setTimeout(() => {
        masonryGrider();
        clearTimeout(clearMasonryGrider);
    }, 0);

    useEffect(() => {
        if( layout == 'default' ) {
            setAttributes({prefix:''});
            setAttributes({suffix:''});
            setAttributes({suffixSingular: ''});
        }
    }, [layout]);
    return (
        <>
            {isSelected && (
                <Inspector
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
            )}
            <div {...blockProps}>
                {styleTag()}
                <div
                    className={`betterdocs-category-grid-wrapper betterdocs-blocks ${safeHTML(
                        blockId,
                    )} `}
                >
                    <div
                        className={`betterdocs-category-grid-inner-wrapper layout-flex ${layoutMode} ${layout} ${properties?.col?.classNames}`}
                        {...htmlAttributes}
                    >
                        {
                            /**
                             * If item is not loaded yet
                             */
                            isCategoryLoading && <Spinner />
                        }
                        {
                            /**
                             * If no item is found.
                             */
                            !isCategoryLoading && categories?.length == 0 && (
                                <NotFound />
                            )
                        }
                        {
                            /**
                             * If items are loaded.
                             */
                            !isCategoryLoading &&
                                categories?.length > 0 &&
                                categories.map((category) => (
                                    <SingleCategory
                                        key={category.id}
                                        widgetType="category-grid"
                                        attributes={attributes}
                                        categories={categories}
                                        titleLink={categoryTitleLink}
                                        {...category}
                                    />
                                ))
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default Edit;
