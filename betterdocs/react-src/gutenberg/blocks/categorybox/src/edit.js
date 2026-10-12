import React, { useEffect, useState } from "react";
import { useBlockProps } from "@wordpress/block-editor";
import { buildQueryString } from "@wordpress/url";
import { Spinner } from "@wordpress/components";
import { useMemo } from "@wordpress/element";
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

const BLOCK_PREFIX = "betterdocs-categorybox";
const Edit = ({ attributes, setAttributes, isSelected, clientId }) => {
    const [layout4Styles, setLayout4Styles] = useState({});

    const {
        blockId,
        selectKB,
        includeCategories,
        excludeCategories,
        boxPerPage,
        orderBy,
        order,
        layout,
        layout4Col
    } = attributes;
    usePreviewDeviceType(setAttributes);
    useDuplicateBlockIdFix(BLOCK_PREFIX, blockId, clientId, setAttributes);
    const { properties, htmlAttributes, styleTag } = useStyleSheets({
        properties: cssProperties({ blockId, layout }),
        setAttributes,
        attributes,
    });

    const categoryApiURL = useMemo(() => {
        let query = {
            per_page: boxPerPage ? boxPerPage : 8,
            orderby: orderBy,
            order: order,
            hide_empty: true,
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

        if (knowledge_base.length > 0) {
            query["filter[knowledgebase]"] = knowledge_base.join(",");
        }

        return `/wp/v2/doc_category/?${buildQueryString(query)}`;
    }, [
        selectKB,
        includeCategories,
        excludeCategories,
        boxPerPage,
        orderBy,
        order,
    ]);

    const {
        data: categories,
        isLoading: isCategoryLoading,
        error: categoryError,
    } = useFetch(categoryApiURL);

    const blockProps = useBlockProps({
        className: `eb-guten-block-main-parent-wrapper`,
    });

    useEffect(() => {
        if( categories?.length > 0 && layout == 'layout-4' ) {
            let termCount = categories?.length;
            let reminder  = termCount % layout4Col;
            let styles    = {};
            styles['--column'] = layout4Col;
            styles['--count'] = termCount;
            styles['--reminder'] = reminder;
            setLayout4Styles(styles);
        } else {
            setLayout4Styles({});
        }
    }, [categories, layout, layout4Col]);

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
                    className={`betterdocs-category-box-wrapper betterdocs-blocks ${safeHTML(
                        blockId,
                    )}  betterdocs-box-${layout}`}
                >
                    <div
                        className={`betterdocs-category-box-inner-wrapper layout-flex ${
                            layout === "default" ? "layout-1" : layout
                        } ${properties?.col?.classNames} ${layout == 'layout-4' ? ' betterdocs-categories-folder layout-4' : ''}`}
                        {...htmlAttributes}
                        style={layout4Styles}
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
                                        widgetType="category-box"
                                        attributes={attributes}
                                        categories={categories}
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
