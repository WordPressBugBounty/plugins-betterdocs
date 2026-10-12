import { __ } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";
import { InspectorControls } from "@wordpress/block-editor";
import Select from "react-select";
import {
    PanelBody,
    BaseControl,
    ToggleControl,
    SelectControl,
    TabPanel,
    TextControl,
    Button,
    Notice
} from "@wordpress/components";
import { applyFilters } from "@wordpress/hooks";
import { withSelect } from "@wordpress/data";

import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";
import ResponsiveRangeController from "../../../util/responsive-range-control";
import BorderShadowControl from "../../../util/border-shadow-control";
import ColorControl from "../../../util/color-control";
import TypographyDropdown from "../../../util/typography-control-v2";
import { MediaPlaceholder } from '@wordpress/block-editor';
import upload from '../../../util/upload';
import cross from '../../../util/cross';
import {
    CONTAINER_PADDING,
    CONTAINER_MARGIN,
    CONTAINER_BACKGROUND,
    CONTAINER_HEIGHT,
    CONTAINER_WIDTH,
    BETTERDOCS_SIDEBAR_TERMS_ORDERBY,
    BETTERDOCS_SIDEBAR_TERMS_ORDER,
    BOX_PADDING_LAYOUT_1,
    BOX_MARGIN_LAYOUT_1,
    BOX_HEIGHT_LAYOUT_1,
    BOX_WIDTH_LAYOUT_1,
    BOX_TITLE_BACKGROUND_LAYOUT_1,
    BOX_TITLE_BACKGROUND,
    BOX_ACTIVE_TITLE_BACKGROUND,
    BOX_SHADOW_LAYOUT_1,
    BOX_IMG_SIZE_LAYOUT_1,
    BOX_TITLE_PADDING_LAYOUT_1,
    BOX_TITLE_MARGIN_LAYOUT_1,
    BOX_TITLE_BORDER_LAYOUT_1,
    BOX_COUNT_BORDER_LAYOUT_1,
    BOX_COUNT_BORDER_LAYOUT_6,
    BOX_COUNT_BACKGROUND_LAYOUT_1,
    BOX_DOC_LIST_PADDING_LAYOUT_1,
    BOX_DOC_LIST_MARGIN_LAYOUT_1,
    BOX_DOC_LIST_ICON_SIZE_LAYOUT_1,
    BOX_DOC_LIST_ICON_SPACING_LAYOUT_1,
    BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_1,
    BETTERDOCS_SIDEBAR_LAYOUTS,
    BOX_COUNT_BACKGROUND_LAYOUT_6,
    BOX_COUNT_ACTIVE_BACKGROUND_COLOR_LAYOUT_6,
    BOX_ACTIVE_TITLE_BORDER_WIDTH_LAYOUT_6,
    BOX_ACTIVE_LIST_BORDER_WIDTH_LAYOUT_6,
    STICKY_TOC_WIDTH,
    BOX_PADDING_LAYOUT_7,
    BOX_MARGIN_LAYOUT_7,
    BOX_WIDTH_LAYOUT_7,
    BOX_IMG_SIZE_LAYOUT_7,
    BOX_TITLE_BACKGROUND_LAYOUT_7,
    BOX_SHADOW_LAYOUT_7,
    BOX_TITLE_BACKGROUND_7,
    TITLE_BACKGROUND_LAYOUT_8,
    BOX_TITLE_PADDING_LAYOUT_7,
    BOX_TITLE_MARGIN_LAYOUT_7,
    BOX_TITLE_BORDER_LAYOUT_7,
    BOX_DOC_LIST_PADDING_LAYOUT_7,
    BOX_DOC_LIST_MARGIN_LAYOUT_7,
    BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_7,
    BOX_COUNT_BACKGROUND_LAYOUT_7,
    BOX_COUNT_BORDER_LAYOUT_7,
    SIDEBAR_SEARCH_BACKGROUND_LAYOUT_7,
    SIDEBAR_SEARCH_MAGNIFIER_SEARCH_LAYOUT_7_HEIGHT,
    SIDEBAR_SEARCH_MAGNIFIER_SEARCH_LAYOUT_7_WIDTH,
    SEARCH_MODAL_FIELD_BACKGROUND,
    SEARCH_MODAL_CONTENT_TABS_ICON_SIZE_HEIGHT,
    SEARCH_MODAL_CONTENT_TABS_BORDER,
    SEARCH_MODAL_CONTENT_TABS_LIST_ICON_SIZE,
    SEARCH_MODAL_CONTENT_TABS_LIST_BORDER,
    SEARCH_MODAL_CONTENT_TABS_LIST_CATEGORY_ICON_SIZE,
    SIDEBAR_SEARCH_IMAGE_SIZE_WIDTH_LAYOUT_7,
    SIDEBAR_SEARCH_IMAGE_SIZE_HEIGHT_LAYOUT_7,
    BOX_IMG_SIZE_LAYOUT_7_HEIGHT,
    BOX_DOC_LIST_ICON_SIZE_LAYOUT_7,
    SEARCH_MODAL_CONTENT_TABS_ICON_SIZE_WIDTH,
    BOX_PADDING_LAYOUT_8,
    BOX_MARGIN_LAYOUT_8,
    BOX_WIDTH_LAYOUT_8,
    BOX_IMG_SIZE_LAYOUT_8,
    BOX_TITLE_BACKGROUND_LAYOUT_8,
    BOX_SHADOW_LAYOUT_8,
    BOX_TITLE_PADDING_LAYOUT_8,
    BOX_TITLE_MARGIN_LAYOUT_8,
    BOX_DOC_LIST_PADDING_LAYOUT_8,
    BOX_DOC_LIST_MARGIN_LAYOUT_8,
    BOX_DOC_LIST_ICON_SIZE_LAYOUT_8,
    BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_8,
    BOX_COUNT_BACKGROUND_LAYOUT_8,
    TITLE_ARROW_ICON_SIZE_LAYOUT_2,
    TITLE_ARROW_ICON_SIZE_LAYOUT_3,
    TITLE_ARROW_ICON_SIZE_LAYOUT_8,
    DOC_SUB_LIST_ARROW_ICON_SIZE,
    POSTS_ORDER_BY,
    POSTS_ORDER,
	BOX_DOC_LIST_BACKGROUND_COLOR
} from "./constants";

import {
    BOX_TITLE_TYPO_LAYOUT_1,
    BOX_COUNT_TYPO_LAYOUT_1,
    BOX_DOC_LIST_TYPO_LAYOUT_1,
    BOX_DOC_SUB_LIST_TITLE_TYPO_LAYOUT_1,
    BOX_DOC_SUB_LIST_TYPO_LAYOUT_1,
    BOX_TITLE_TYPO_LAYOUT_7,
    BOX_DOC_LIST_TYPO_LAYOUT_7,
    BOX_DOC_SUB_LIST_TITLE_TYPO_LAYOUT_7,
    BOX_DOC_SUB_LIST_TYPO_LAYOUT_7,
    BOX_COUNT_TYPO_LAYOUT_7,
    BOX_TITLE_TYPO_LAYOUT_8,
    BOX_DOC_LIST_TYPO_LAYOUT_8,
    BOX_DOC_SUB_LIST_TITLE_TYPO_LAYOUT_8,
    BOX_DOC_SUB_LIST_TYPO_LAYOUT_8,
    BOX_COUNT_TYPO_LAYOUT_8,
    SIDEBAR_SEARCH_LAYOUT_7_TYPO,
    SEARCH_MODAL_FIELD_TYPO,
    SEARCH_MODAL_CATEGORY_FIELD_TYPO,
    SEARCH_MODAL_CONTENT_TABS_TYPO,
    SEARCH_MODAL_CONTENT_TABS_LIST_TYPO,
    SEARCH_MODAL_CONTENT_TABS_LIST_CATEGORY_TYPO,
} from "./typographyPrefixConstants";
import BackgroundControl from "../../../util/background-control";
import objAttributes from "./attributes";

import FontIconPicker from "@fonticonpicker/react-fonticonpicker";
import faIcons from "../../../util/faIcons";

const Inspector = ({ docCategories, attributes, setAttributes }) => {
    const {
        enableNestedSubcategory,
        enableLazyLoad,
        enableStickyTOC,
        includeCategories,
        excludeCategories,
        titleTag,
        terms_order,
        terms_orderby,
        postsOrderBy,
        postsOrder,
        sidebar_layout,
        resOption,
        stickyTOCZIndex,
        box_title_color_layout_1,
        box_title_active_color_layout_1,
        box_title_active_border_color_layout_1,
        box_layout_1_count_color,
        box_layout_6_count_color,
        box_layout_7_count_color,
        box_layout_8_count_color,
        box_layout_6_count_active_color,
        box_title_color_layout_7,
        box_title_color_layout_8,
        box_doc_List_color_layout_1,
        box_doc_List_color_layout_7,
        box_doc_List_color_layout_8,
        box_doc_List_hover_color_layout_1,
        box_doc_List_hover_color_layout_7,
        box_doc_List_hover_color_layout_8,
        box_doc_List_icon_color_layout_1,
        box_doc_sub_List_title_color_layout_1,
        box_doc_sub_List_title_color_layout_7,
        box_doc_sub_List_title_color_layout_8,
        box_doc_sub_List_title_hover_color_layout_1,
        box_doc_sub_List_title_hover_color_layout_7,
        box_doc_sub_List_title_hover_color_layout_8,
        box_doc_sub_List_color_layout_1,
        box_doc_sub_List_color_layout_7,
        box_doc_sub_List_color_layout_8,
        box_doc_sub_List_hover_color_layout_1,
        box_doc_sub_List_hover_color_layout_7,
        box_doc_sub_List_hover_color_layout_8,
        box_doc_List_hover_bg_color_layout_8,
        title_arrow_color_layout_2,
        title_arrow_hover_color_layout_2,
        title_arrow_color_layout_3,
        title_arrow_hover_color_layout_3,
        title_arrow_color_layout_8,
        title_arrow_hover_color_layout_8,
        doc_sub_list_arrow_color,
        doc_sub_list_arrow_hover_color,
        listIcon,
        listIconImageUrl,
        sidebar_search_layout_7_placeholder_color,
        sidebarSearchModalContentTabsListCategoryColor,
        sidebarSearchModalMagnifierColor,
        sidebarSearchModalFieldColor,
        sidebarSearchModalFieldPlaceholderColor,
        sidebarSearchModalCategoryColor,
        sidebarSearchModalContentTabsListColor,
        initialDocsQueryNumber,
        initialFAQQueryNumber,
        docQueryType,
        faqQueryType,
        searchModalQueryTermIds,
        searchModalQueryDocIds,
        searchModalQueriesFaqGroupIds
    } = attributes;
    const resRequiredProps = {
        setAttributes,
        resOption,
        attributes,
        objAttributes,
    };

    // handle include categories
    const handleIncludeCategories = (categories) => {
        setAttributes({
            includeCategories: categories ? JSON.stringify(categories) : null,
        });
    };

    //handle exclude categories
    const handleExcludeCategories = (categories) => {
        setAttributes({
            excludeCategories: categories ? JSON.stringify(categories) : null,
        });
    };

    return (
        <InspectorControls key="controls">
            <div className="eb-panel-control">
                <TabPanel
                    className="eb-parent-tab-panel"
                    activeClass="active-tab"
                    tabs={[
                        {
                            name: "general",
                            title: __("General", "betterdocs"),
                            className: "eb-tab general",
                        },
                        {
                            name: "styles",
                            title: __("Style", "betterdocs"),
                            className: "eb-tab styles",
                        },
                    ]}
                >
                    {(tab) => (
                        <div className={"eb-tab-controls " + tab.name}>
                            {tab.name === "general" && (
                                <>
                                    <PanelBody
                                        title={__("Query", "betterdocs")}
                                    >
                                        {applyFilters("selectKnowledgeBase", '', attributes, setAttributes)}
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Include", "betterdocs")}
                                            </h3>
                                        </BaseControl>
                                        <Select
                                            name="include_categories"
                                            value={
                                                includeCategories &&
                                                JSON.parse(includeCategories)
                                            }
                                            onChange={handleIncludeCategories}
                                            options={
                                                docCategories &&
                                                docCategories.map(
                                                    (category) => ({
                                                        value: category.id,
                                                        label: decodeEntities(category.name),
                                                    }),
                                                )
                                            }
                                            isMulti="true"
                                        />
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Exclude", "betterdocs")}
                                            </h3>
                                        </BaseControl>
                                        <Select
                                            name="exclude_categories"
                                            value={
                                                excludeCategories &&
                                                JSON.parse(excludeCategories)
                                            }
                                            onChange={handleExcludeCategories}
                                            options={
                                                docCategories &&
                                                docCategories.map(
                                                    (category) => ({
                                                        value: category.id,
                                                        label: decodeEntities(category.name),
                                                    }),
                                                )
                                            }
                                            isMulti="true"
                                        />
                                        {/* <TextControl
                                            label={__(
                                                "Terms Per Page",
                                                "betterdocs"
                                            )}
                                            type="number"
                                            value={terms_per_page}
                                            onChange={(value) => {
                                                setAttributes({
                                                    terms_per_page:
                                                        value != ""
                                                            ? parseInt(value)
                                                            : 10,
                                                });
                                            }}
                                        /> */}
                                        <SelectControl
                                            label={__(
                                                "Terms Order By",
                                                "betterdocs",
                                            )}
                                            value={terms_orderby}
                                            options={
                                                BETTERDOCS_SIDEBAR_TERMS_ORDERBY
                                            }
                                            onChange={(value) => {
                                                setAttributes({
                                                    terms_orderby: value,
                                                    // postsOrderBy:
                                                    //     value != "name" &&
                                                    //     value != "count" &&
                                                    //     value !=
                                                    //         "doc_category_order"
                                                    //         ? value
                                                    //         : "title",
                                                });
                                                if( value == 'doc_category_order' ){
                                                    setAttributes({
                                                        terms_order:'asc'
                                                    })
                                                }
                                            }}
                                        />
                                        {terms_orderby !='doc_category_order' && <SelectControl
                                            label={__(
                                                "Terms Order",
                                                "betterdocs",
                                            )}
                                            value={terms_order}
                                            options={
                                                BETTERDOCS_SIDEBAR_TERMS_ORDER
                                            }
                                            onChange={(value) =>
                                                {terms_orderby == 'doc_category_order'? setAttributes({
                                                    terms_order: 'asc',
                                                    postsOrder: 'asc',
                                                }) : setAttributes({
                                                    terms_order: value,
                                                    postsOrder: value,
                                                })}
                                            }
                                        />}
                                        <SelectControl
                                            label={__("Order By", "betterdocs")}
                                            value={postsOrderBy}
                                            options={POSTS_ORDER_BY}
                                            onChange={(newPostsOrderBy) =>
                                                setAttributes({
                                                    postsOrderBy: newPostsOrderBy,
                                                })
                                            }
                                        />
                                        {postsOrderBy != 'betterdocs_order' && <SelectControl
                                            label={__("Order", "betterdocs")}
                                            value={postsOrder}
                                            options={POSTS_ORDER}
                                            onChange={(newPostsOrder) =>
                                                setAttributes({
                                                    postsOrder: newPostsOrder,
                                                })
                                            }
                                        />}
                                        <ToggleControl
                                            label={__(
                                                "Enable Nested Subcategory",
                                                "betterdocs",
                                            )}
                                            checked={enableNestedSubcategory}
                                            onChange={(value) => {
                                                setAttributes({
                                                    enableNestedSubcategory:
                                                        value,
                                                });
                                            }}
                                        />
                                        <ToggleControl
                                            label={__(
                                                "Lazy Load Docs & Subcategories",
                                                "betterdocs",
                                            )}
                                            help={__(
                                                "Render only the active category upfront; fetch the rest on click (or scroll for the Memphis layout).",
                                                "betterdocs",
                                            )}
                                            checked={enableLazyLoad}
                                            onChange={(value) => {
                                                setAttributes({
                                                    enableLazyLoad: value,
                                                });
                                            }}
                                        />
                                        {/* <TextControl
												label={__("Docs Per Page", "betterdocs")}
												type="number"
												value={docs_per_page}
												onChange={(value) => {
													setAttributes({
														docs_per_page: value != '' ? parseInt(value) : 10,
													});
												}}
											/>
											<SelectControl
												label={__("Docs Order By", "betterdocs")}
												value={docs_orderby}
												options={BETTERDOCS_SIDEBAR_DOCS_ORDERBY}
												onChange={(value) =>
													setAttributes({
														docs_orderby: value,
													})
												}
											/>
											<SelectControl
												label={__("Docs Order", "betterdocs")}
												value={docs_order}
												options={BETTERDOCS_SIDEBAR_DOCS_ORDER}
												onChange={(value) =>
													setAttributes({
														docs_order: value,
													})
												}
											/>
											*/}
                                        {/* { enable_nested_subcategory && (
												<TextControl
													label={__("Docs Per Subcategory", "betterdocs")}
													type="number"
													value={docs_per_subcategory}
													onChange={(value) => {
														setAttributes({
															docs_per_subcategory: parseInt(value)
														});
													}}
												/>
											)} */}
                                    </PanelBody>
                                    <PanelBody
                                        title={__(
                                            "Layout Setting",
                                            "betterdocs",
                                        )}
                                    >
                                        <SelectControl
                                            label={__(
                                                "Select Layout",
                                                "betterdocs",
                                            )}
                                            value={sidebar_layout}
                                            options={BETTERDOCS_SIDEBAR_LAYOUTS}
                                            onChange={(newLayout) =>
                                                setAttributes({
                                                    sidebar_layout: newLayout,
                                                })
                                            }
                                        />
                                        <SelectControl
                                            label={__(
                                                "Category Title Tag",
                                                "betterdocs",
                                            )}
                                            value={titleTag}
                                            options={[
                                                {
                                                    label: __(
                                                        "H1",
                                                        "betterdocs",
                                                    ),
                                                    value: "h1",
                                                },
                                                {
                                                    label: __(
                                                        "H2",
                                                        "betterdocs",
                                                    ),
                                                    value: "h2",
                                                },
                                                {
                                                    label: __(
                                                        "H3",
                                                        "betterdocs",
                                                    ),
                                                    value: "h3",
                                                },
                                                {
                                                    label: __(
                                                        "H4",
                                                        "betterdocs",
                                                    ),
                                                    value: "h4",
                                                },
                                                {
                                                    label: __(
                                                        "H5",
                                                        "betterdocs",
                                                    ),
                                                    value: "h5",
                                                },
                                                {
                                                    label: __(
                                                        "H6",
                                                        "betterdocs",
                                                    ),
                                                    value: "h6",
                                                },
                                                {
                                                    label: __(
                                                        "Div",
                                                        "betterdocs",
                                                    ),
                                                    value: "div",
                                                },
                                                {
                                                    label: __(
                                                        "Nav",
                                                        "betterdocs",
                                                    ),
                                                    value: "nav",
                                                },
                                                {
                                                    label: __(
                                                        "P",
                                                        "betterdocs",
                                                    ),
                                                    value: "p",
                                                },
                                            ]}
                                            onChange={(newTag) =>
                                                setAttributes({
                                                    titleTag: newTag,
                                                })
                                            }
                                        />
                                    </PanelBody>
                                    {sidebar_layout == 'layout-7' && <PanelBody  title={__(
                                            "Search Box Initial Query",
                                            "betterdocs",
                                        )}>
                                        <SelectControl
                                            label={__("Select Docs Type", "betterdocs")}
                                            value={docQueryType}
                                            options={ [
                                                { label: __("Popular Docs", "betterdocs"), value: "popular-docs" },
                                                { label: __("Specific Doc Id's", "betterdocs"), value: "specific-doc-ids" },
                                                { label: __("Specific Doc Term Id's", "betterdocs"), value: "specific-doc-term-ids" },
                                            ]}
                                            onChange={(newLayout) =>
                                                setAttributes({
                                                    docQueryType: newLayout,
                                                })
                                            }
                                        />
                                        {docQueryType == 'popular-docs' && <TextControl
                                            label={__("Number of Docs", "betterdocs")}
                                            type="number"
                                            value={initialDocsQueryNumber}
                                            min={1}
                                            onChange={(value) => {
                                                setAttributes({
                                                    initialDocsQueryNumber: parseInt(value),
                                                });
                                            }}
										/>}
                                        {docQueryType == 'specific-doc-ids' &&
                                            <TextControl
                                                label={__("Doc Id's", "betterdocs")}
                                                type="text"
                                                value={searchModalQueryDocIds}
                                                placeholder={__('E.g: 15, 16')}
                                                onChange={(value) => {
                                                    setAttributes({
                                                        searchModalQueryDocIds: value,
                                                    });
                                                }}
                                            />
                                        }
                                        {docQueryType == 'specific-doc-term-ids' && <TextControl
                                                label={__("Doc Term Id's", "betterdocs")}
                                                type="text"
                                                value={searchModalQueryTermIds}
                                                placeholder={__('E.g: 15, 16')}
                                                onChange={(value) => {
                                                    setAttributes({
                                                        searchModalQueryTermIds: value,
                                                    });
                                                }}
                                            />
                                        }
                                        <SelectControl
                                            label={__("Select FAQ Type", "betterdocs")}
                                            value={faqQueryType}
                                            options={ [
                                                { label: __("Default", "betterdocs"), value: "default" },
                                                { label: __("Specific FAQ Id's", "betterdocs"), value: "specific-faq-group-ids" }
                                            ]}
                                            onChange={(newLayout) =>
                                                setAttributes({
                                                    faqQueryType: newLayout,
                                                })
                                            }
                                        />
                                        {faqQueryType == 'default' && <TextControl
                                            label={__("Number of FAQ", "betterdocs")}
                                            type="number"
                                            min={1}
                                            value={initialFAQQueryNumber}
                                            onChange={(value) => {
                                                setAttributes({
                                                    initialFAQQueryNumber: parseInt(value),
                                                });
                                            }}
										/>}
                                        {faqQueryType == 'specific-faq-group-ids' &&
                                            <TextControl
                                                label={__("Faq Group Id's", "betterdocs")}
                                                type="text"
                                                value={searchModalQueriesFaqGroupIds}
                                                placeholder={__('E.g: 8, 9')}
                                                onChange={(value) => {
                                                    setAttributes({
                                                        searchModalQueriesFaqGroupIds: value,
                                                    });
                                                }}
                                            />
                                        }
                                        <Notice status="info" isDismissible={false}>
                                            {__(
                                                "Please note that these query changes will apply to the front end only.",
                                                "betterdocs"
                                            )}
                                        </Notice>
                                        <hr />
                                    </PanelBody>}
                                </>
                            )}
                            {tab.name === "styles" && (
                                <>
                                    <PanelBody title={__("Container Section", "betterdocs")}>
                                        <ResponsiveDimensionsControl
                                            baseLabel={__(
                                                "Padding",
                                                "betterdocs",
                                            )}
                                            resRequiredProps={resRequiredProps}
                                            controlName={CONTAINER_PADDING}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__(
                                                "Margin",
                                                "betterdocs",
                                            )}
                                            resRequiredProps={resRequiredProps}
                                            controlName={CONTAINER_MARGIN}
                                        />
                                        <BackgroundControl
                                            controlName={
                                                CONTAINER_BACKGROUND
                                            }
                                            resRequiredProps={resRequiredProps}
                                            noOverlay={true}
                                        />
                                         {/* <ResponsiveRangeController
                                            baseLabel={__(
                                                "Container Height",
                                                "betterdocs",
                                            )}
                                            controlName={CONTAINER_HEIGHT}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={1000}
                                            step={1}
                                        /> */}
                                        <ResponsiveRangeController
                                            baseLabel={__(
                                                "Container Width",
                                                "betterdocs",
                                            )}
                                            controlName={CONTAINER_WIDTH}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={1000}
                                            step={1}
                                        />
                                    </PanelBody>
                                    <PanelBody title={__("Box", "betterdocs")}>
                                        <ResponsiveDimensionsControl
                                            baseLabel={__(
                                                "Box Padding",
                                                "betterdocs",
                                            )}
                                            resRequiredProps={resRequiredProps}
                                            controlName={sidebar_layout == 'layout-7' ? BOX_PADDING_LAYOUT_7 : (sidebar_layout == 'layout-8' ? BOX_PADDING_LAYOUT_8 : BOX_PADDING_LAYOUT_1)}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__(
                                                "Box Margin",
                                                "betterdocs",
                                            )}
                                            resRequiredProps={resRequiredProps}
                                            controlName={sidebar_layout == 'layout-7' ? BOX_MARGIN_LAYOUT_7 : (sidebar_layout == 'layout-8' ? BOX_MARGIN_LAYOUT_8 : BOX_MARGIN_LAYOUT_1)}
                                        />
                                        {/* <ResponsiveRangeController
                                            baseLabel={__(
                                                "Box Height",
                                                "betterdocs",
                                            )}
                                            controlName={BOX_HEIGHT_LAYOUT_1}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={1000}
                                            step={1}
                                        /> */}
                                        <ResponsiveRangeController
                                            baseLabel={__(
                                                "Box Width",
                                                "betterdocs",
                                            )}
                                            controlName={sidebar_layout == 'layout-7' ? BOX_WIDTH_LAYOUT_7 : (sidebar_layout == 'layout-8' ? BOX_WIDTH_LAYOUT_8 : BOX_WIDTH_LAYOUT_1)}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={1000}
                                            step={1}
                                        />
                                        {sidebar_layout !== 'layout-8' && <ResponsiveRangeController
                                            baseLabel={sidebar_layout != 'layout-7' ? __("Box Icon Size", "betterdocs") : __("Outer Width", "betterdocs")}
                                            controlName={sidebar_layout != 'layout-7' ? BOX_IMG_SIZE_LAYOUT_1 : BOX_IMG_SIZE_LAYOUT_7}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={100}
                                            step={1}
                                        />}
                                        {sidebar_layout == 'layout-7' && <ResponsiveRangeController
                                            baseLabel={__("Outer Height", "betterdocs")}
                                            controlName={BOX_IMG_SIZE_LAYOUT_7_HEIGHT}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={100}
                                            step={1}
                                        />}
                                        {
                                            sidebar_layout == 'layout-7' &&
                                            <>
                                                <ResponsiveRangeController
                                                    baseLabel={__(
                                                        "Inner Width",
                                                        "betterdocs",
                                                    )}
                                                    controlName={
                                                        SIDEBAR_SEARCH_IMAGE_SIZE_WIDTH_LAYOUT_7
                                                    }
                                                    resRequiredProps={resRequiredProps}
                                                />
                                                <ResponsiveRangeController
                                                    baseLabel={__(
                                                        "Inner Height",
                                                        "betterdocs",
                                                    )}
                                                    controlName={
                                                        SIDEBAR_SEARCH_IMAGE_SIZE_HEIGHT_LAYOUT_7
                                                    }
                                                    resRequiredProps={resRequiredProps}
                                                />
                                            </>
                                        }
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Background", "betterdocs")}
                                            </h3>
                                        </BaseControl>
                                        <BackgroundControl
                                            controlName={
                                                sidebar_layout == 'layout-7' ? BOX_TITLE_BACKGROUND_LAYOUT_7 : (sidebar_layout == 'layout-8' ? BOX_TITLE_BACKGROUND_LAYOUT_8 : BOX_TITLE_BACKGROUND_LAYOUT_1)
                                            }
                                            resRequiredProps={resRequiredProps}
                                            noOverlay={true}
                                        />
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Border", "betterdocs")}
                                            </h3>
                                        </BaseControl>
                                        <BorderShadowControl
                                            controlName={ sidebar_layout == 'layout-7' ? BOX_SHADOW_LAYOUT_7 : (sidebar_layout == 'layout-8' ? BOX_SHADOW_LAYOUT_8 : BOX_SHADOW_LAYOUT_1)}
                                            noShadow={true}
                                            resRequiredProps={resRequiredProps}
                                        />
                                    </PanelBody>
                                    <PanelBody
                                        title={__("Title", "betterdocs")}
                                    >
                                        <ColorControl
                                            label={__("Color", "betterdocs")}
                                            color={sidebar_layout == 'layout-7' ? box_title_color_layout_7 : (sidebar_layout == 'layout-8' ? box_title_color_layout_8 : box_title_color_layout_1)}
                                            onChange={(value) => {
                                                if( sidebar_layout == 'layout-7' ) {
                                                    setAttributes({
                                                        box_title_color_layout_7:
                                                            value,
                                                    })
                                                } else if( sidebar_layout == 'layout-8' ) {
                                                    setAttributes({
                                                        box_title_color_layout_8:
                                                            value,
                                                    })
                                                } else {
                                                    setAttributes({
                                                        box_title_color_layout_1:
                                                            value,
                                                    })
                                                }
                                            }}
                                        />
                                        {(sidebar_layout == 'layout-1' || sidebar_layout == 'layout-3' || sidebar_layout == 'layout-5') &&
                                        <>
                                            <BaseControl>
                                                <h3 className="eb-control-title">
                                                    {__("Active Background", "betterdocs")}
                                                </h3>
                                            </BaseControl>
                                            <BackgroundControl
                                                controlName={
                                                    BOX_ACTIVE_TITLE_BACKGROUND
                                                }
                                                resRequiredProps={resRequiredProps}
                                                noOverlay={true}
                                            />
                                        </>
                                        }
                                        {(sidebar_layout == 'layout-1' || sidebar_layout == 'layout-5') && <ColorControl
                                            label={__(
                                                "Active Border Color",
                                                "betterdocs",
                                            )}
                                            color={
                                                box_title_active_border_color_layout_1
                                            }
                                            onChange={(value) =>
                                                setAttributes({
                                                    box_title_active_border_color_layout_1:
                                                        value,
                                                })
                                            }
                                        />}
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Background", "betterdocs")}
                                            </h3>
                                        </BaseControl>
                                        <BackgroundControl
                                                controlName={
													sidebar_layout == 'layout-7' ? BOX_TITLE_BACKGROUND_7 : (sidebar_layout == 'layout-8' ? TITLE_BACKGROUND_LAYOUT_8 : BOX_TITLE_BACKGROUND)
                                                }
                                                resRequiredProps={resRequiredProps}
                                                noOverlay={true}
										/>
                                        <TypographyDropdown
                                            baseLabel={__(
                                                "Typography",
                                                "betterdocs",
                                            )}
                                            typographyPrefixConstant={
                                                sidebar_layout == 'layout-7' ? BOX_TITLE_TYPO_LAYOUT_7 : (sidebar_layout == 'layout-8' ? BOX_TITLE_TYPO_LAYOUT_8 : BOX_TITLE_TYPO_LAYOUT_1)
                                            }
                                            resRequiredProps={resRequiredProps}
                                            defaultFontSize={16}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__(
                                                "Title Padding",
                                                "betterdocs",
                                            )}
                                            resRequiredProps={resRequiredProps}
                                            controlName={
                                                sidebar_layout == 'layout-7' ? BOX_TITLE_PADDING_LAYOUT_7 : (sidebar_layout == 'layout-8' ? BOX_TITLE_PADDING_LAYOUT_8 : BOX_TITLE_PADDING_LAYOUT_1)
                                            }
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__(
                                                "Title Margin",
                                                "betterdocs",
                                            )}
                                            resRequiredProps={resRequiredProps}
                                            controlName={
                                                sidebar_layout == 'layout-7' ? BOX_TITLE_MARGIN_LAYOUT_7 : (sidebar_layout == 'layout-8' ? BOX_TITLE_MARGIN_LAYOUT_8 : BOX_TITLE_MARGIN_LAYOUT_1)
                                            }
                                        />
                                        {sidebar_layout != 'layout-8' && <>
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Border", "betterdocs")}
                                            </h3>
                                        </BaseControl>
                                        <BorderShadowControl
                                            controlName={
                                                sidebar_layout == 'layout-7' ? BOX_TITLE_BORDER_LAYOUT_7 : BOX_TITLE_BORDER_LAYOUT_1
                                            }
                                            resRequiredProps={resRequiredProps}
                                            noShadow={true}
                                            noShdowHover={true}
                                        />
                                        </>}
                                        {sidebar_layout == 'layout-6' &&
                                            <>
                                                <BaseControl>
                                                    <h3 className="eb-control-title">
                                                        {__("Active Title Border", "betterdocs")}
                                                    </h3>
                                                </BaseControl>
                                                <BorderShadowControl
                                                    controlName={
                                                        BOX_ACTIVE_TITLE_BORDER_WIDTH_LAYOUT_6
                                                    }
                                                    resRequiredProps={resRequiredProps}
                                                    noShadow={true}
                                                    noShdowHover={true}
                                                    noBdrHover={true}
                                                />
                                                <BaseControl>
                                                    <h3 className="eb-control-title">
                                                        {__("Active List Border", "betterdocs")}
                                                    </h3>
                                                </BaseControl>
                                                <BorderShadowControl
                                                    controlName={
                                                        BOX_ACTIVE_LIST_BORDER_WIDTH_LAYOUT_6
                                                    }
                                                    resRequiredProps={resRequiredProps}
                                                    noShadow={true}
                                                    noShdowHover={true}
                                                    noBdrHover={true}
                                                />
                                            </>
                                        }
                                    </PanelBody>

                                    {/* Title Arrow Section for layouts 2, 3, and 8 */}
                                    {(sidebar_layout == 'layout-2' || sidebar_layout == 'layout-3' || sidebar_layout == 'layout-8') && <PanelBody
                                        title={__("Title Arrow", "betterdocs")}
                                        initialOpen={true}
                                    >
                                        <ResponsiveRangeController
                                            baseLabel={__("Arrow Size", "betterdocs")}
                                            controlName={sidebar_layout == 'layout-2' ? TITLE_ARROW_ICON_SIZE_LAYOUT_2 : (sidebar_layout == 'layout-3' ? TITLE_ARROW_ICON_SIZE_LAYOUT_3 : TITLE_ARROW_ICON_SIZE_LAYOUT_8)}
                                            resRequiredProps={resRequiredProps}
                                            min={10}
                                            max={50}
                                            step={1}
                                        />
                                        <ColorControl
                                            label={__("Arrow Color", "betterdocs")}
                                            color={sidebar_layout == 'layout-2' ? title_arrow_color_layout_2 : (sidebar_layout == 'layout-3' ? title_arrow_color_layout_3 : title_arrow_color_layout_8)}
                                            onChange={(value) => {
                                                if (sidebar_layout == 'layout-2') {
                                                    setAttributes({ title_arrow_color_layout_2: value });
                                                } else if (sidebar_layout == 'layout-3') {
                                                    setAttributes({ title_arrow_color_layout_3: value });
                                                } else {
                                                    setAttributes({ title_arrow_color_layout_8: value });
                                                }
                                            }}
                                        />
                                        <ColorControl
                                            label={__("Arrow Hover Color", "betterdocs")}
                                            color={sidebar_layout == 'layout-2' ? title_arrow_hover_color_layout_2 : (sidebar_layout == 'layout-3' ? title_arrow_hover_color_layout_3 : title_arrow_hover_color_layout_8)}
                                            onChange={(value) => {
                                                if (sidebar_layout == 'layout-2') {
                                                    setAttributes({ title_arrow_hover_color_layout_2: value });
                                                } else if (sidebar_layout == 'layout-3') {
                                                    setAttributes({ title_arrow_hover_color_layout_3: value });
                                                } else {
                                                    setAttributes({ title_arrow_hover_color_layout_8: value });
                                                }
                                            }}
                                        />
                                    </PanelBody>}

                                    {(sidebar_layout == 'layout-1' || sidebar_layout == 'layout-6' || sidebar_layout == 'layout-7') && <PanelBody
                                        title={__("Count", "betterdocs")}
                                    >
                                        <TypographyDropdown
                                            baseLabel={__(
                                                "Typography",
                                                "betterdocs",
                                            )}
                                            typographyPrefixConstant={
                                                sidebar_layout == 'layout-7' ? BOX_COUNT_TYPO_LAYOUT_7 : (sidebar_layout == 'layout-8' ? BOX_COUNT_TYPO_LAYOUT_8 : BOX_COUNT_TYPO_LAYOUT_1)
                                            }
                                            resRequiredProps={resRequiredProps}
                                        />
                                        <BackgroundControl
                                            controlName={
                                                (sidebar_layout == 'layout-1' ? BOX_COUNT_BACKGROUND_LAYOUT_1 : ( sidebar_layout == 'layout-6' ? BOX_COUNT_BACKGROUND_LAYOUT_6 : ( sidebar_layout == 'layout-7' ? BOX_COUNT_BACKGROUND_LAYOUT_7 : BOX_COUNT_BACKGROUND_LAYOUT_8 )))
                                            }
                                            resRequiredProps={resRequiredProps}
                                            noOverlay={true}
                                        />
                                        {sidebar_layout == 'layout-6' &&
                                            <>
                                                <BaseControl>
                                                    <h3 className="eb-control-title">
                                                        {__("Active Background Color", "betterdocs")}
                                                    </h3>
                                                </BaseControl>
                                                <BackgroundControl
                                                    controlName={
                                                        BOX_COUNT_ACTIVE_BACKGROUND_COLOR_LAYOUT_6
                                                    }
                                                    resRequiredProps={resRequiredProps}
                                                    noOverlay={true}
                                                />
                                            </>
                                        }
                                        <ColorControl
                                            label={__("Color", "betterdocs")}
                                            color={sidebar_layout == 'layout-1' ? box_layout_1_count_color : ( sidebar_layout == 'layout-6' ? box_layout_6_count_color : ( sidebar_layout == 'layout-7' ? box_layout_7_count_color : box_layout_8_count_color )) }
                                            onChange={(value) => {
                                                if(sidebar_layout == 'layout-1') {
                                                    setAttributes({
                                                        box_layout_1_count_color:
                                                            value,
                                                    });
                                                } else if( sidebar_layout == 'layout-6' ) {
                                                    setAttributes({
                                                        box_layout_6_count_color:
                                                            value,
                                                    });
                                                } else if( sidebar_layout == 'layout-7' ) {
                                                    setAttributes({
                                                        box_layout_7_count_color:
                                                            value,
                                                    });
                                                } else {
                                                    setAttributes({
                                                        box_layout_8_count_color:
                                                            value,
                                                    });
                                                }
                                            }}
                                        />
                                        {sidebar_layout == 'layout-6' && <ColorControl
                                            label={__("Active Color", "betterdocs")}
                                            color={box_layout_6_count_active_color}
                                            onChange={(value) => {
                                                    setAttributes({
                                                        box_layout_6_count_active_color:
                                                            value,
                                                    });
                                            }}
                                        />}
                                        {sidebar_layout != 'layout-8' && <BorderShadowControl
                                            controlName={
                                               sidebar_layout == 'layout-1' ? BOX_COUNT_BORDER_LAYOUT_1 : ( sidebar_layout == 'layout-6' ? BOX_COUNT_BORDER_LAYOUT_6 : BOX_COUNT_BORDER_LAYOUT_7 )
                                            }
                                            resRequiredProps={resRequiredProps}
                                            noShadow={true}
                                            noShdowHover={true}
                                        />}
                                    </PanelBody>}
                                    <PanelBody
                                        title={__("Doc List", "betterdocs")}
                                    >
                                        <TypographyDropdown
                                            baseLabel={__(
                                                "Typography",
                                                "betterdocs",
                                            )}
                                            typographyPrefixConstant={
                                                sidebar_layout == 'layout-7' ? BOX_DOC_LIST_TYPO_LAYOUT_7 : (sidebar_layout == 'layout-8' ? BOX_DOC_LIST_TYPO_LAYOUT_8 : BOX_DOC_LIST_TYPO_LAYOUT_1)
                                            }
                                            resRequiredProps={resRequiredProps}
                                        />
										 <BackgroundControl
                                            controlName={
                                                BOX_DOC_LIST_BACKGROUND_COLOR
                                            }
                                            resRequiredProps={resRequiredProps}
                                            noOverlay={true}
                                        />
                                        <ColorControl
                                            label={__(
                                                "List Color",
                                                "betterdocs",
                                            )}
                                            color={ sidebar_layout == 'layout-7' ? box_doc_List_color_layout_7 : (sidebar_layout == 'layout-8' ? box_doc_List_color_layout_8 : box_doc_List_color_layout_1)}
                                            onChange={(value) =>{
                                                if( sidebar_layout == 'layout-7' ) {
                                                    setAttributes({
                                                        box_doc_List_color_layout_7:
                                                            value,
                                                    })
                                                } else if( sidebar_layout == 'layout-8' ) {
                                                    setAttributes({
                                                        box_doc_List_color_layout_8:
                                                            value,
                                                    })
                                                } else {
                                                    setAttributes({
                                                        box_doc_List_color_layout_1:
                                                            value,
                                                    })
                                                }
                                            }}
                                        />
                                        <ColorControl
                                            label={__(
                                                "List Hover Color",
                                                "betterdocs",
                                            )}
                                            color={
                                                sidebar_layout == 'layout-7' ? box_doc_List_hover_color_layout_7 : (sidebar_layout == 'layout-8' ? box_doc_List_hover_color_layout_8 : box_doc_List_hover_color_layout_1)
                                            }
                                            onChange={(value) => {
                                                if( sidebar_layout == 'layout-7' ) {
                                                    setAttributes({
                                                        box_doc_List_hover_color_layout_7:
                                                            value,
                                                    })
                                                } else if( sidebar_layout == 'layout-8' ) {
                                                    setAttributes({
                                                        box_doc_List_hover_color_layout_8:
                                                            value,
                                                    })
                                                } else {
                                                    setAttributes({
                                                        box_doc_List_hover_color_layout_1:
                                                            value,
                                                    })
                                                }
                                            }}
                                        />
										{sidebar_layout == 'layout-8' && <ColorControl
                                            label={__(
                                                "List Hover Background Color",
                                                "betterdocs",
                                            )}
                                            color={box_doc_List_hover_bg_color_layout_8}
                                            onChange={(value) => {
                                                setAttributes({
                                                    box_doc_List_hover_bg_color_layout_8: value,
                                                })
                                            }}
                                        />}
                                        <ResponsiveDimensionsControl
                                            baseLabel={__(
                                                "List Padding",
                                                "betterdocs",
                                            )}
                                            resRequiredProps={resRequiredProps}
                                            controlName={
                                                sidebar_layout == 'layout-7' ? BOX_DOC_LIST_PADDING_LAYOUT_7 : (sidebar_layout == 'layout-8' ? BOX_DOC_LIST_PADDING_LAYOUT_8 : BOX_DOC_LIST_PADDING_LAYOUT_1)
                                            }
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__(
                                                "List Margin",
                                                "betterdocs",
                                            )}
                                            resRequiredProps={resRequiredProps}
                                            controlName={
                                                sidebar_layout == 'layout-7' ? BOX_DOC_LIST_MARGIN_LAYOUT_7 : (sidebar_layout == 'layout-8' ? BOX_DOC_LIST_MARGIN_LAYOUT_8 : BOX_DOC_LIST_MARGIN_LAYOUT_1)
                                            }
                                        />
                                        {(sidebar_layout != 'layout-7' && sidebar_layout != 'layout-8') && <MediaPlaceholder
                                            onSelect={(image) => {
                                                setAttributes({
                                                    listIconImageUrl:image?.url
                                                })
                                            }}
                                            value={listIconImageUrl}
                                            accept="image/*"
                                            allowedTypes={["image"]}
                                            mediaLibraryButton={({ open }) => {
                                                return (
                                                    <>
                                                        <Button
                                                            icon={upload}
                                                            variant="primary"
                                                            label={__('Add image from media')}
                                                            showTooltip
                                                            tooltipPosition="top center"
                                                            onClick={() => {
                                                                open();
                                                            }}
                                                        />
                                                        {listIconImageUrl?.length > 0 && <div className="preview-wrapper-controller" style={{position:'relative'}}>
                                                            <img src={listIconImageUrl} />
                                                            <div className="preview-wrapper" style={{position:'absolute', top:'0px', right:'0px', height:'30px', width:'30px', backgroundColor:'#1e1e1e', borderRadius:'5px', cursor:'pointer'}} onClick={(e) => {
                                                                 setAttributes({
                                                                    listIconImageUrl:''
                                                                })
                                                            }}>
                                                                {cross()}
                                                            </div>
                                                        </div>}
                                                    </>
                                                );
                                            }}
                                            labels={{
                                                title: "Upload Image",
                                                instructions:
                                                    "Drag media file, upload or select image from your library.",
                                            }}
                                        />}
                                        {listIconImageUrl?.length == 0 && (sidebar_layout != 'layout-7' && sidebar_layout != 'layout-8') && <><BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("List Icon", "betterdocs")}
                                            </h3>
                                        </BaseControl>
										<FontIconPicker
											icons={faIcons}
											value={listIcon}
											onChange={(listIcon) => setAttributes({ listIcon })}
											appendTo="body"
											closeOnSelect
										/>
                                        <ColorControl
                                            label={__(
                                                "Icon Color",
                                                "betterdocs",
                                            )}
                                            color={
                                                box_doc_List_icon_color_layout_1
                                            }
                                            onChange={(value) =>
                                                setAttributes({
                                                    box_doc_List_icon_color_layout_1:
                                                        value,
                                                })
                                            }
                                        /></>}
                                        {sidebar_layout == 'layout-7' && <ResponsiveRangeController
                                            baseLabel={__(
                                                "Icon Size",
                                                "betterdocs",
                                            )}
                                            controlName={
                                                BOX_DOC_LIST_ICON_SIZE_LAYOUT_7
                                            }
                                            resRequiredProps={resRequiredProps}
                                        />}
                                        {(sidebar_layout != 'layout-7' && sidebar_layout != 'layout-8') && <><ResponsiveRangeController
                                            baseLabel={__(
                                                "Icon Size",
                                                "betterdocs",
                                            )}
                                            controlName={
                                                BOX_DOC_LIST_ICON_SIZE_LAYOUT_1
                                            }
                                            resRequiredProps={resRequiredProps}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__(
                                                "Icon Spacing",
                                                "betterdocs",
                                            )}
                                            resRequiredProps={resRequiredProps}
                                            controlName={
                                                BOX_DOC_LIST_ICON_SPACING_LAYOUT_1
                                            }
                                        /></>}
                                    </PanelBody>
                                    {enableNestedSubcategory && (
                                        <PanelBody
                                            title={__(
                                                "Nested Sub Category",
                                                "betterdocs",
                                            )}
                                        >
                                            <BaseControl>
                                                <h3 className="eb-control-title">
                                                    {__(
                                                        "Nested Sub Category Title",
                                                        "betterdocs",
                                                    )}
                                                </h3>
                                            </BaseControl>
                                            <ColorControl
                                                label={__(
                                                    "Color",
                                                    "betterdocs",
                                                )}
                                                color={
                                                   sidebar_layout == 'layout-7' ? box_doc_sub_List_title_color_layout_7 : (sidebar_layout == 'layout-8' ? box_doc_sub_List_title_color_layout_8 : box_doc_sub_List_title_color_layout_1)
                                                }
                                                onChange={(value) => {
                                                    if( sidebar_layout == 'layout-7' ) {
                                                        setAttributes({
                                                            box_doc_sub_List_title_color_layout_7:
                                                                value,
                                                        })
                                                    } else if( sidebar_layout == 'layout-8' ) {
                                                        setAttributes({
                                                            box_doc_sub_List_title_color_layout_8:
                                                                value,
                                                        })
                                                    } else {
                                                        setAttributes({
                                                            box_doc_sub_List_title_color_layout_1:
                                                                value,
                                                        })
                                                    }
                                                }}
                                            />
                                            <ColorControl
                                                label={__(
                                                    "Hover Color",
                                                    "betterdocs",
                                                )}
                                                color={
                                                    sidebar_layout == 'layout-7' ? box_doc_sub_List_title_hover_color_layout_7 : (sidebar_layout == 'layout-8' ? box_doc_sub_List_title_hover_color_layout_8 : box_doc_sub_List_title_hover_color_layout_1)
                                                }
                                                onChange={(value) => {
                                                    if( sidebar_layout == 'layout-7' ){
                                                        setAttributes({
                                                            box_doc_sub_List_title_hover_color_layout_7:
                                                                value,
                                                        })
                                                    } else if( sidebar_layout == 'layout-8' ){
                                                        setAttributes({
                                                            box_doc_sub_List_title_hover_color_layout_8:
                                                                value,
                                                        })
                                                    } else {
                                                        setAttributes({
                                                            box_doc_sub_List_title_hover_color_layout_1:
                                                                value,
                                                        })
                                                    }
                                                }}
                                            />
                                            <TypographyDropdown
                                                baseLabel={__(
                                                    "Typography",
                                                    "betterdocs",
                                                )}
                                                typographyPrefixConstant={
                                                    sidebar_layout == 'layout-7' ? BOX_DOC_SUB_LIST_TITLE_TYPO_LAYOUT_7 : (sidebar_layout == 'layout-8' ? BOX_DOC_SUB_LIST_TITLE_TYPO_LAYOUT_8 : BOX_DOC_SUB_LIST_TITLE_TYPO_LAYOUT_1)
                                                }
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                            />
                                            <BaseControl>
                                                <h3 className="eb-control-title">
                                                    {__(
                                                        "Nested Subcategory List",
                                                        "betterdocs",
                                                    )}
                                                </h3>
                                            </BaseControl>
                                            <TypographyDropdown
                                                baseLabel={__(
                                                    "Typography",
                                                    "betterdocs",
                                                )}
                                                typographyPrefixConstant={
                                                    sidebar_layout == 'layout-7' ? BOX_DOC_SUB_LIST_TYPO_LAYOUT_7 : (sidebar_layout == 'layout-8' ? BOX_DOC_SUB_LIST_TYPO_LAYOUT_8 : BOX_DOC_SUB_LIST_TYPO_LAYOUT_1)
                                                }
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                            />
                                            <ColorControl
                                                label={__(
                                                    "Sub List Color",
                                                    "betterdocs",
                                                )}
                                                color={
                                                    sidebar_layout == 'layout-7' ? box_doc_sub_List_color_layout_7 : (sidebar_layout == 'layout-8' ? box_doc_sub_List_color_layout_8 : box_doc_sub_List_color_layout_1)
                                                }
                                                onChange={(value) => {
                                                    if( sidebar_layout == 'layout-7' ) {
                                                        setAttributes({
                                                            box_doc_sub_List_color_layout_7:
                                                                value,
                                                        })
                                                    } else if( sidebar_layout == 'layout-8' ) {
                                                        setAttributes({
                                                            box_doc_sub_List_color_layout_8:
                                                                value,
                                                        })
                                                    } else {
                                                        setAttributes({
                                                            box_doc_sub_List_color_layout_1:
                                                                value,
                                                        })
                                                    }
                                                }}
                                            />
                                            <ColorControl
                                                label={__(
                                                    "Sub List Hover Color",
                                                    "betterdocs",
                                                )}
                                                color={
                                                    sidebar_layout == 'layout-7' ? box_doc_sub_List_hover_color_layout_7 : (sidebar_layout == 'layout-8' ? box_doc_sub_List_hover_color_layout_8 : box_doc_sub_List_hover_color_layout_1)
                                                }
                                                onChange={(value) => {
                                                    if( sidebar_layout == 'layout-7' ){
                                                        setAttributes({
                                                            box_doc_sub_List_hover_color_layout_7:
                                                                value,
                                                        })
                                                    } else if( sidebar_layout == 'layout-8' ){
                                                        setAttributes({
                                                            box_doc_sub_List_hover_color_layout_8:
                                                                value,
                                                        })
                                                    } else {
                                                        setAttributes({
                                                            box_doc_sub_List_hover_color_layout_1:
                                                                value,
                                                        })
                                                    }
                                                }}
                                            />
                                            <ResponsiveRangeController
                                                baseLabel={__(
                                                    "Icon Size",
                                                    "betterdocs",
                                                )}
                                                controlName={
                                                    sidebar_layout == 'layout-7' ? BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_7 : (sidebar_layout == 'layout-8' ? BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_8 : BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_1)
                                                }
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                                min={1}
                                                max={100}
                                                step={1}
                                            />
                                            <BaseControl>
                                                <h3 className="eb-control-title">
                                                    {__("Nested Subcategory Arrow", "betterdocs")}
                                                </h3>
                                            </BaseControl>
                                            <ResponsiveRangeController
                                                baseLabel={__("Arrow Size", "betterdocs")}
                                                controlName={DOC_SUB_LIST_ARROW_ICON_SIZE}
                                                resRequiredProps={resRequiredProps}
                                                min={8}
                                                max={30}
                                                step={1}
                                            />
                                            <ColorControl
                                                label={__("Arrow Color", "betterdocs")}
                                                color={doc_sub_list_arrow_color}
                                                onChange={(value) =>
                                                    setAttributes({
                                                        doc_sub_list_arrow_color: value,
                                                    })
                                                }
                                            />
                                            <ColorControl
                                                label={__("Arrow Hover Color", "betterdocs")}
                                                color={doc_sub_list_arrow_hover_color}
                                                onChange={(value) =>
                                                    setAttributes({
                                                        doc_sub_list_arrow_hover_color: value,
                                                    })
                                                }
                                            />
                                        </PanelBody>
                                    )}
                                    {(sidebar_layout != 'layout-7' && sidebar_layout != 'layout-8') && <PanelBody title={__("Sticky TOC", "betterdocs")}>
                                        <ToggleControl
                                            label={__(
                                                "Enable Sticky TOC",
                                                "betterdocs"
                                            )}
                                            checked={enableStickyTOC}
                                            onChange={(value) => {
                                                setAttributes({
                                                    enableStickyTOC:
                                                        value,
                                                });
                                            }}
                                        />
                                        <ResponsiveRangeController
                                            baseLabel={__("TOC Width", "betterdocs")}
                                            controlName={STICKY_TOC_WIDTH}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={500}
                                            step={1}
                                        />
                                        <TextControl
                                            label={__("Z-Index", "betterdocs")}
                                            type="number"
                                            value={stickyTOCZIndex}
                                            onChange={(value) => {
                                                setAttributes({
                                                    stickyTOCZIndex: parseInt(value),
                                                });
                                            }}
                                        />
                                    </PanelBody>}
                                    {sidebar_layout == 'layout-7' && <>
                                    <PanelBody
                                        title={__("Sidebar Search", "betterdocs")}
                                    >
                                         <TypographyDropdown
                                            baseLabel={__(
                                                "Typography",
                                                "betterdocs",
                                            )}
                                            typographyPrefixConstant={
                                                SIDEBAR_SEARCH_LAYOUT_7_TYPO
                                            }
                                            resRequiredProps={resRequiredProps}
                                            defaultFontSize={16}
                                        />
                                        <ColorControl
                                            label={__(
                                                "Color",
                                                "betterdocs",
                                            )}
                                            color={
                                                sidebar_search_layout_7_placeholder_color
                                            }
                                            onChange={(value) => {
                                                    setAttributes({
                                                        sidebar_search_layout_7_placeholder_color:
                                                            value,
                                                    })
                                            }}
                                        />
                                        <BackgroundControl
                                            controlName={
                                                SIDEBAR_SEARCH_BACKGROUND_LAYOUT_7
                                            }
                                            resRequiredProps={resRequiredProps}
                                            noOverlay={true}
                                        />
                                        <ResponsiveRangeController
                                            baseLabel={__("Height", "betterdocs")}
                                            controlName={SIDEBAR_SEARCH_MAGNIFIER_SEARCH_LAYOUT_7_HEIGHT}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={100}
                                            step={1}
                                        />
                                        <ResponsiveRangeController
                                            baseLabel={__("Width", "betterdocs")}
                                            controlName={SIDEBAR_SEARCH_MAGNIFIER_SEARCH_LAYOUT_7_WIDTH}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={100}
                                            step={1}
                                        />
                                    </PanelBody>
                                    <PanelBody
                                        title={__("Sidebar Search Modal", "betterdocs")}
                                    >
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Search Field", "betterdocs")}
                                            </h3>
										</BaseControl>
                                        <ColorControl
                                            label={__("Magnifier Color", "betterdocs")}
                                            color={sidebarSearchModalMagnifierColor}
                                            onChange={(value) => {
                                                setAttributes({sidebarSearchModalMagnifierColor:value})
                                            }}
                                        />
                                        <BackgroundControl
                                            controlName={
                                                SEARCH_MODAL_FIELD_BACKGROUND
                                            }
                                            resRequiredProps={resRequiredProps}
                                            noOverlay={true}
                                        />
                                        <TypographyDropdown
                                            baseLabel={__(
                                                "Typography",
                                                "betterdocs",
                                            )}
                                            typographyPrefixConstant={
                                                SEARCH_MODAL_FIELD_TYPO
                                            }
                                            resRequiredProps={resRequiredProps}
                                            defaultFontSize={16}
                                        />
                                        <ColorControl
                                            label={__("Field Color", "betterdocs")}
                                            color={sidebarSearchModalFieldColor}
                                            onChange={(value) => {
                                                setAttributes({sidebarSearchModalFieldColor:value})
                                            }}
                                        />
                                        <ColorControl
                                            label={__("Field Placeholder Color", "betterdocs")}
                                            color={sidebarSearchModalFieldPlaceholderColor}
                                            onChange={(value) => {
                                                setAttributes({sidebarSearchModalFieldPlaceholderColor:value})
                                            }}
                                        />
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Search Category", "betterdocs")}
                                            </h3>
										</BaseControl>
                                        <ColorControl
                                            label={__("Color", "betterdocs")}
                                            color={sidebarSearchModalCategoryColor}
                                            onChange={(value) => {
                                                setAttributes({sidebarSearchModalCategoryColor:value})
                                            }}
                                        />
                                         <TypographyDropdown
                                            baseLabel={__(
                                                "Typography",
                                                "betterdocs",
                                            )}
                                            typographyPrefixConstant={
                                                SEARCH_MODAL_CATEGORY_FIELD_TYPO
                                            }
                                            resRequiredProps={resRequiredProps}
                                            defaultFontSize={16}
                                        />
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Content Tabs", "betterdocs")}
                                            </h3>
										</BaseControl>
                                        <TypographyDropdown
                                            baseLabel={__(
                                                "Typography",
                                                "betterdocs",
                                            )}
                                            typographyPrefixConstant={
                                                SEARCH_MODAL_CONTENT_TABS_TYPO
                                            }
                                            resRequiredProps={resRequiredProps}
                                            defaultFontSize={16}
                                        />
                                        <ResponsiveRangeController
                                            baseLabel={__("Icon Height", "betterdocs")}
                                            controlName={SEARCH_MODAL_CONTENT_TABS_ICON_SIZE_HEIGHT}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={100}
                                            step={1}
                                        />
                                          <ResponsiveRangeController
                                            baseLabel={__("Icon Width", "betterdocs")}
                                            controlName={SEARCH_MODAL_CONTENT_TABS_ICON_SIZE_WIDTH}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={100}
                                            step={1}
                                        />
                                          <BorderShadowControl
                                            controlName={SEARCH_MODAL_CONTENT_TABS_BORDER}
                                            resRequiredProps={resRequiredProps}
                                            noShadow={true}
                                            noShdowHover={true}
                                        />
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Content List", "betterdocs")}
                                            </h3>
										</BaseControl>
                                        <TypographyDropdown
                                            baseLabel={__(
                                                "Typography",
                                                "betterdocs",
                                            )}
                                            typographyPrefixConstant={
                                                SEARCH_MODAL_CONTENT_TABS_LIST_TYPO
                                            }
                                            resRequiredProps={resRequiredProps}
                                            defaultFontSize={16}
                                        />
                                        <ColorControl
                                            label={__("Color", "betterdocs")}
                                            color={sidebarSearchModalContentTabsListColor}
                                            onChange={(value) => {
                                                setAttributes({sidebarSearchModalContentTabsListColor:value})
                                            }}
                                        />
                                         <ResponsiveRangeController
                                            baseLabel={__("Icon Size", "betterdocs")}
                                            controlName={SEARCH_MODAL_CONTENT_TABS_LIST_ICON_SIZE}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={100}
                                            step={1}
                                        />
                                        <BorderShadowControl
                                            controlName={SEARCH_MODAL_CONTENT_TABS_LIST_BORDER}
                                            resRequiredProps={resRequiredProps}
                                            noShadow={true}
                                            noShdowHover={true}
                                        />
                                         <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Content List Category", "betterdocs")}
                                            </h3>
										</BaseControl>
                                        <TypographyDropdown
                                            baseLabel={__(
                                                "Typography",
                                                "betterdocs",
                                            )}
                                            typographyPrefixConstant={
                                                SEARCH_MODAL_CONTENT_TABS_LIST_CATEGORY_TYPO
                                            }
                                            resRequiredProps={resRequiredProps}
                                            defaultFontSize={16}
                                        />
                                        <ColorControl
                                            label={__("Color", "betterdocs")}
                                            color={sidebarSearchModalContentTabsListCategoryColor}
                                            onChange={(value) => {
                                                setAttributes({sidebarSearchModalContentTabsListCategoryColor:value})
                                            }}
                                        />
                                          <ResponsiveRangeController
                                            baseLabel={__("Icon Size", "betterdocs")}
                                            controlName={SEARCH_MODAL_CONTENT_TABS_LIST_CATEGORY_ICON_SIZE}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={100}
                                            step={1}
                                        />
                                    </PanelBody>
                                    </>}
                                </>
                            )}
                        </div>
                    )}
                </TabPanel>
            </div>
        </InspectorControls>
    );
};

export default withSelect((select) => {
    return {
        docCategories: select("core").getEntityRecords(
            "taxonomy",
            "doc_category",
            {
                per_page: -1,
            },
        ),
    };
})(Inspector);
