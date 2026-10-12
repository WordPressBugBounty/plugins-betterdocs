import { useBlockProps } from "@wordpress/block-editor";
import { buildQueryString } from "@wordpress/url";
import { Spinner } from "@wordpress/components";
import { useMemo } from "@wordpress/element";

import Inspector from "./inspector";
import Style from "./style";
import { NotFound, SingleCategory } from "../../../components";
import {
    usePreviewDeviceType,
    useDuplicateBlockIdFix,
    useFetch,
} from "../../../hooks";

const BLOCK_PREFIX = "betterdocs-category-slate-layout";

const Edit = ({ attributes, setAttributes, isSelected, clientId }) => {
    const {
        blockId,
        selectKB,
        includeCategories,
        excludeCategories,
        gridPerPage,
        offset,
        orderBy,
        order,
        postsPerPage,
        postsOrderBy,
        postsOrder,
        categoryTitleLink,
    } = attributes;

    usePreviewDeviceType(setAttributes);
    useDuplicateBlockIdFix(BLOCK_PREFIX, blockId, clientId, setAttributes);

    const categoryApiURL = useMemo(() => {
        let query = {
            per_page: gridPerPage ? gridPerPage : 9,
            offset: offset ? offset : 0,
            orderby: orderBy,
            order: order,
            hide_empty: 0, // Show empty categories in editor mode for better preview
        };

        let knowledge_base = [];
        if (selectKB && selectKB !== "[]") {
            try {
                const kbObject = typeof selectKB === 'string' ? JSON.parse(selectKB) : selectKB;
                if (typeof kbObject === "object" && kbObject.value !== undefined) {
                    knowledge_base.push(kbObject.value);
                } else if (Array.isArray(kbObject)) {
                    knowledge_base = kbObject.map(kb => kb.value);
                }
            } catch (e) {
                console.warn('Error parsing selectKB:', e);
            }
        }

        let include = [];
        if (includeCategories && includeCategories !== "[]") {
            try {
                const includeData = typeof includeCategories === 'string' ? JSON.parse(includeCategories) : includeCategories;
                if (Array.isArray(includeData)) {
                    include = includeData.map((category) => category.value || category);
                }
            } catch (e) {
                console.warn('Error parsing includeCategories:', e);
            }
        }

        let exclude = [];
        if (excludeCategories && excludeCategories !== "[]") {
            try {
                const excludeData = typeof excludeCategories === 'string' ? JSON.parse(excludeCategories) : excludeCategories;
                if (Array.isArray(excludeData)) {
                    exclude = excludeData.map((category) => category.value || category);
                }
            } catch (e) {
                console.warn('Error parsing excludeCategories:', e);
            }
        }

        include = include.filter((item) => !exclude.includes(item));

        if (include.length > 0) {
            query["include"] = include.join(',');
        }
        if (exclude.length > 0) {
            query["exclude"] = exclude.join(',');
        }

        if (knowledge_base.length > 0) {
            query["filter[knowledgebase]"] = knowledge_base.join(",");
        }

        // Add posts query parameters
        query["posts_per_page"] = postsPerPage;
        query["posts_orderby"] = postsOrderBy;
        query["posts_order"] = postsOrder;

        return `/wp/v2/doc_category/?${buildQueryString(query)}`;
    }, [
        selectKB,
        includeCategories,
        excludeCategories,
        gridPerPage,
        offset,
        orderBy,
        order,
        postsPerPage,
        postsOrderBy,
        postsOrder,
    ]);

    const {
        data: categoriesData,
        isLoading: isCategoryLoading,
    } = useFetch(categoryApiURL);

    // Ensure categories is always an array and filter out empty categories in editor mode
    const allCategories = Array.isArray(categoriesData) ? categoriesData : [];
    const categories = allCategories.filter(category => category.count > 0);

    const blockProps = useBlockProps({
        className: `betterdocs-blocks betterdocs-category-layout-8 ${blockId}`,
    });

    return (
        <>
            {isSelected && (
                <Inspector
                    attributes={attributes}
                    setAttributes={setAttributes}
                    docCategories={categories}
                />
            )}
            <Style
                attributes={attributes}
                setAttributes={setAttributes}
                clientId={clientId}
            />
            <div {...blockProps}>
                <div className="betterdocs-category-grid-three-wrapper betterdocs-blocks-grid betterdocs-shortcode">
                    <div
                        className="betterdocs-category-grid-inner-wrapper layout-3 layout-flex docs-col-4"
                        data-column_desktop="4"
                        style={{"--column": 4}}
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
                                        layout="layout-3"
                                        attributes={{
                                            ...attributes,
                                            showCount: false,
                                            showList: true,
                                        }}
                                        categories={categories}
                                        titleLink={categoryTitleLink}
                                        {...category}
                                    />
                                ))
                        }
                    </div>
                    <div className="clearfix"></div>
                </div>
            </div>
        </>
    );
};

export default Edit;
