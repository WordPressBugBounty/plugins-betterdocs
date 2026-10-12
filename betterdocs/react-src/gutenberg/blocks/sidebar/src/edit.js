import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';

import { usePreviewDeviceType, useDuplicateBlockIdFix, useStyleSheets, useFetch } from '../../../hooks';
import cssProperties from './cssProperties';
import { SingleCategory } from '../../../components';
import { buildQueryString } from '@wordpress/url';


import Inspector from "./inspector";
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import SearchField from '../../../../public/shortcodes/search-modal/SearchField';

const BLOCK_PREFIX = "betterdocs-sidebar";
const edit = ( { attributes, setAttributes, isSelected, clientId } ) => {

	const {
		blockId,
        terms_per_page,
		terms_order,
		terms_orderby,
        postsOrder,
        postsOrderBy,
        sidebar_layout,
        selectKB,
        includeCategories,
        excludeCategories,
        enableNestedSubcategory,
        enableLazyLoad,
        listIcon,
        listIconImageUrl,
        initialDocsQueryNumber,
        initialFAQQueryNumber,
        searchModalQueryDocIds,
        searchModalQueryTermIds,
        searchModalQueriesFaqGroupIds,
        docQueryType,
        faqQueryType
    } = attributes;

    const [ activeClassID, setActiveClassID ] = useState('');

	const blockProps = useBlockProps({
		className: `eb-guten-block-main-parent-wrapper`,
	});

    usePreviewDeviceType(setAttributes);
    useDuplicateBlockIdFix(BLOCK_PREFIX, blockId, clientId, setAttributes);
    const { casecadeStyles, styleTag } = useStyleSheets({
        properties: cssProperties({ blockId, listIcon, sidebar_layout }),
        setAttributes,
        attributes
    });


    const ApiUrl = useMemo(() => {
        let termParams = {
            per_page: -1,
            orderby: terms_orderby,
            order: terms_order,
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
                knowledge_base = kbObject.map(kb => kb.value);
            }
        }

        let include = includeCategories && includeCategories !== "[]"
            ? JSON.parse(includeCategories).map((category) => category.value)
            : [];

        let exclude = excludeCategories && excludeCategories !== "[]"
            ? JSON.parse(excludeCategories).map((category) => category.value)
            : [];

        include = include.filter((item) => !exclude.includes(item));

        if (include.length > 0) {
            termParams["include"] = include;
        }

        if (exclude.length > 0) {
            termParams["exclude"] = exclude;
        }

        if(enableNestedSubcategory) {
            termParams["parent"] = 0;
            termParams["nested_subcategory"] = true;
        }

        if (knowledge_base.length > 0) {
            termParams["filter[knowledgebase]"] = knowledge_base.join(',');
        }

        return `/wp/v2/doc_category/?${buildQueryString(termParams)}`;

    }, [terms_order, terms_orderby, enableNestedSubcategory, selectKB, includeCategories, excludeCategories, postsOrderBy, postsOrder]);

    const { data: docCategories, isLoading: isCategoryLoading, error: categoryError } = useFetch(ApiUrl);


    const primaryWrapper    = sidebar_layout == 'layout-1' ?
                                {className:`${blockId} betterdocs-toc-block betterdocs-sidebar betterdocs-sidebar-layout-1`, id:'betterdocs-sidebar'} :
                                ( sidebar_layout == 'layout-2' ? {className:`${blockId} betterdocs-toc-block betterdocs-sidebar betterdocs-full-sidebar-left betterdocs-sidebar-layout-4 betterdocs-background`, id:'betterdocs-sidebar betterdocs-sidebar-left betterdocs-height'} :
                                ( sidebar_layout == 'layout-3' ? {className:`${blockId} betterdocs-toc-block betterdocs-sidebar betterdocs-full-sidebar-left betterdocs-sidebar-layout-5 betterdocs-background`, id:'betterdocs-full-sidebar-left'} :
                                ( sidebar_layout == 'layout-4' ? {className:`${blockId} betterdocs-toc-block betterdocs-sidebar betterdocs-full-sidebar-left betterdocs-sidebar-layout-2`, id:'betterdocs-sidebar-left'} :
                                ( sidebar_layout == 'layout-5' ? {className:`${blockId} betterdocs-toc-block betterdocs-sidebar betterdocs-full-sidebar-left betterdocs-sidebar-layout-3 betterdocs-background`, id:'betterdocs-sidebar-left'} :
                                ( sidebar_layout == 'layout-6' ? {className:`${blockId} betterdocs-toc-block betterdocs-sidebar betterdocs-sidebar-layout-6`, id:'betterdocs-sidebar'} :
                                ( sidebar_layout == 'layout-7' ? {className:`${blockId} betterdocs-sidebar betterdocs-full-sidebar-left betterdocs-sidebar-layout-7 betterdocs-background`, id:'betterdocs-full-sidebar-left'} :
                                {className:`${blockId} betterdocs-sidebar betterdocs-full-sidebar-left betterdocs-sidebar-layout-8 betterdocs-background`, id:'betterdocs-full-sidebar-left'} ) ) ) ) ) );

    const secondaryWrapper  = sidebar_layout == 'layout-1' ?
                                {className:'betterdocs-sidebar-content betterdocs-category-sidebar'} :
                                ( sidebar_layout == 'layout-2' ? {className:'betterdocs-sidebar-content betterdocs-height'} :
                                (sidebar_layout == 'layout-3' ? {className:'betterdocs-sidebar-content betterdocs-category-sidebar betterdocs-height'} :
                                ( sidebar_layout == 'layout-4' ? {className:'betterdocs-sidebar-content betterdocs-category-sidebar'} :
                                ( sidebar_layout == 'layout-5' ? {className:'betterdocs-sidebar-content betterdocs-category-sidebar betterdocs-height'} :
                                ( sidebar_layout == 'layout-6' ? {className:'betterdocs-sidebar-content betterdocs-category-sidebar'} :
                                ( sidebar_layout == 'layout-7' ? {className:'betterdocs-sidebar-content betterdocs-category-sidebar betterdocs-height'} :
                                {className:'betterdocs-sidebar-content betterdocs-height'} ) ) ) ) ) );

    const tertiaryWrapper   = sidebar_layout == 'layout-1' ?
                                {className:'betterdocs-category-grid-wrapper'} :
                                ( sidebar_layout == 'layout-2' ? {className:'betterdocs-category-grid-wrapper'} :
                                (sidebar_layout == 'layout-3' ? {className:'betterdocs-category-grid-wrapper'} :
                                ( sidebar_layout == 'layout-4' ? {className:'betterdocs-category-list-wrapper'} :
                                ( sidebar_layout == 'layout-5' ? {className:'betterdocs-category-grid-wrapper'} :
                                ( sidebar_layout == 'layout-6' ? {className:'betterdocs-sidebar-list-wrapper betterdocs-pro'} :
                                ( sidebar_layout == 'layout-7' ? {className:'betterdocs-category-grid-wrapper betterdocs-shortcode'} :
                                {className:'betterdocs-category-grid-wrapper sidebar-8'} ) ) ) ) ) );

    const quaternaryWrapper = sidebar_layout == 'layout-1' ?
                                {className:'betterdocs-category-grid-inner-wrapper layout-1'} :
                                ( sidebar_layout == 'layout-2' ? {className:'betterdocs-category-grid-inner-wrapper layout-1'} :
                                (sidebar_layout == 'layout-3' ? {className:'betterdocs-category-grid-inner-wrapper layout-1'} :
                                (sidebar_layout == 'layout-4' ? {className:'betterdocs-category-list-inner-wrapper'} :
                                (sidebar_layout == 'layout-5' ? {className:'betterdocs-category-grid-inner-wrapper layout-1'} :
                                (sidebar_layout == 'layout-6' ? {className:'betterdocs-sidebar-list-inner'} :
                                (sidebar_layout == 'layout-7' ? {className:'betterdocs-category-grid-inner-wrapper layout-1'} :
                                (sidebar_layout == 'layout-8' ? {className:'betterdocs-category-grid-inner-wrapper layout-1'} :
                                {className:'betterdocs-category-grid-inner-wrapper layout-1 layout-flex docs-col-1'} ) ) ) ) ) ) );

    const extraProps = sidebar_layout == 'layout-1' ? {showIcon:true, showCount:true} :
                       (sidebar_layout == 'layout-2' ? {showIcon:false, showCount:false, showArrow:true} :
                       ( sidebar_layout == 'layout-3' ? {showIcon:false, showCount:false, showArrow:true} :
                       ( sidebar_layout == 'layout-4' ? {showIcon:false, showCount:false, showArrow:true} :
                       (  sidebar_layout == 'layout-5' ? {showIcon:false, showCount:false, showArrow:true} :
                       ( sidebar_layout == 'layout-7' ? { layout: 'layout-7' } :
                       ( sidebar_layout == 'layout-8' ? {showIcon:false, showCount:false, showArrow:true} :
                       {showIcon:true, showCount:true} ) ) ) ) ) );

    useEffect(() => {
        if( sidebar_layout == 'layout-4' || sidebar_layout == 'layout-8' ){
            setAttributes({...attributes, showDocIcon:false, listIcon:'', listIconImageUrl:''});
        } else {
            if( listIcon != '' ) {
                setAttributes({...attributes, showDocIcon:false});
            } else {
                setAttributes({...attributes, showDocIcon:true});
            }
            if( listIconImageUrl != '' ) {
                setAttributes({...attributes, showDocIcon:false});
            }
            if( betterDocsBlocksHelper?.docsIcon?.length > 0 ) {
                setAttributes({...attributes, showDocIcon:false});
            }
        }
    }, [sidebar_layout, listIcon, listIconImageUrl, betterDocsBlocksHelper?.docsIcon]);

    useEffect(() => {
        if( docQueryType == 'popular-docs' ) {
            setAttributes({ searchModalQueryTermIds: '', searchModalQueryDocIds:'' });
        }

        if( docQueryType == 'specific-doc-ids' ) {
            setAttributes({ searchModalQueryTermIds: '' });
        }

        if( docQueryType == 'specific-doc-term-ids' ){
            setAttributes({ searchModalQueryDocIds: '' });
        }

        if( faqQueryType == 'default' ) {
            setAttributes({searchModalQueriesFaqGroupIds: ''});
        }
    }, [docQueryType, faqQueryType]);

    //for sidebar layout 7
    let sidebarTopRef = useRef(null);

	return(
		<>
			{isSelected && (
				<Inspector attributes={attributes} setAttributes={setAttributes} docCategories={docCategories}/>
			)}
			<div {...blockProps}>
				{styleTag()}
				<>
                    <aside {...primaryWrapper}>
                        <div {...secondaryWrapper}>
                            {sidebar_layout == 'layout-7' && <div className="betterdocs-search-modal-layout-1" id="betterdocs-search-modal" data-numberofdocs={initialDocsQueryNumber} data-numberoffaqs={initialFAQQueryNumber} data-doc_ids={searchModalQueryDocIds} data-doc_categories_ids={searchModalQueryTermIds} data-faq_categories_ids={searchModalQueriesFaqGroupIds} data-categorysearch="true" data-popularsearch="true" ref={sidebarTopRef}><SearchField topWrapperRef={sidebarTopRef} placeholder={__('Search...', 'betterdocs')} layout={'betterdocs-search-modal-sidebar'}/></div>}
                            <div {...tertiaryWrapper}>
                                <div {...quaternaryWrapper}>
                                    {
                                        isCategoryLoading && <Spinner/>
                                    }
                                    {
                                        ! isCategoryLoading && docCategories?.length > 0 &&
                                            docCategories.map((category) => {
                                                return <SingleCategory key={category?.id} showDocIcon={attributes?.showDocIcon} widgetType={'category-grid'} attributes={{...attributes, layout:'default', showList:true, ...extraProps}} categories={docCategories} {...category} onClick={() => setActiveClassID(category?.id)} activeId={activeClassID}/>
                                            })
                                    }
                                </div>
                            </div>
                        </div>
                    </aside>
				</>
			</div>
		</>
	);
}

// Add editor script for nested category toggle functionality using jQuery like categoryGrid.js
const addNestedCategoryToggle = () => {
    if (typeof window !== 'undefined' && typeof jQuery !== 'undefined') {
        const $ = jQuery;

        const initNestedToggle = () => {
            // Use selectors that match the actual HTML structure
            let nestedCatTitle = $(".betterdocs-nested-category-title");
            let nestedCatTitleA = $(".betterdocs-nested-category-title a");

            // Remove existing handlers to prevent duplicates
            nestedCatTitle.off('click');
            nestedCatTitleA.off('click');

            // Prevent anchor clicks
            nestedCatTitleA.on('click', function(e) {
                e.preventDefault();
            });

            // Add toggle functionality - updated for the actual HTML structure
            nestedCatTitle.on("click", function (e) {
                e.preventDefault();

                // Toggle SVG arrow (since there's no .toggle-arrow class, we toggle the SVG)
                $(this).children("svg").toggle();

                // Toggle the nested list
                const nestedList = $(this).next(".betterdocs-nested-category-list");
                if (nestedList.hasClass('active')) {
                    nestedList.slideUp('fast', 'swing', function() {
                        $(this).removeClass('active');
                    });
                } else {
                    nestedList.slideDown('fast', 'swing', function() {
                        $(this).addClass('active');
                    });
                }
            });
        };

        // Initialize with multiple triggers for reliability
        const initWithDelay = () => {
            setTimeout(initNestedToggle, 100);
            setTimeout(initNestedToggle, 500);
            setTimeout(initNestedToggle, 1000);
        };

        // Initialize on DOM ready
        $(document).ready(function() {
            initWithDelay();
        });

        // Initialize on window load
        $(window).on('load', function() {
            initWithDelay();
        });

        // Watch for DOM changes
        const observer = new MutationObserver(function(mutations) {
            let shouldReinit = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.querySelector) {
                            if (node.querySelector('.betterdocs-nested-category-title') ||
                                node.classList.contains('betterdocs-nested-category-title')) {
                                shouldReinit = true;
                            }
                        }
                    });
                }
            });

            if (shouldReinit) {
                setTimeout(initNestedToggle, 100);
            }
        });

        // Start observing
        const targetNode = document.querySelector('.wp-block-betterdocs-sidebar') || document.body;
        if (targetNode) {
            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
        }
    }
};

// Initialize the nested category toggle
addNestedCategoryToggle();

export default edit;
