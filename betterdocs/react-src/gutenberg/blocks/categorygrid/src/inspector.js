/**
 * WordPress dependencies
 */

import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { applyFilters } from "@wordpress/hooks";
import {
    PanelBody,
	TextControl,
	Button,
	ButtonGroup,
	BaseControl,
	ToggleControl,
	SelectControl,
	TabPanel,
	Notice,
    Placeholder
} from '@wordpress/components';
import { MediaPlaceholder } from '@wordpress/block-editor';
import upload from '../../../util/upload';
import cross from '../../../util/cross';
import { useEffect } from '@wordpress/element';
import { select, withSelect } from '@wordpress/data';

/**
 * Internal depencencies
 */

import objAttributes from "./attributes";
import Select from "react-select";
import FontIconPicker from "@fonticonpicker/react-fonticonpicker";
import faIcons from "../../../util/faIcons";

import {
	mimmikCssForResBtns,
	mimmikCssOnPreviewBtnClickWhileBlockSelected,
} from "../../../util/helpers";

import {
	ORDER_BY,
	ORDER,
	LAYOUT,
	GRID_BACKGROUND,
	COLUMNS,
	HTML_TAGS,
	GRID_MARGIN,
	GRID_PADDING,
	GRID_BORDER,
	TITLE_MARGIN,
	TITLE_PADDING,
	TITLE_BACKGROUND,
	TITLE_BORDER,
	POSTS_ORDER_BY,
	LAYOUT_MODE,
	GRID_SPACE,
	COUNT_SIZE,
	COUNT_BACKGROUND,
	COUNT_BORDER,
	LIST_MARGIN,
	LIST_PADDING,
	LIST_BACKGROUND,
	ICON_SIZE,
    ICON_WIDTH,
    ICON_HEIGHT,
	ICON_MARGIN,
	BTN_MARGIN,
	BTN_PADDING,
	BTN_BACKGROUND,
	BTN_BORDER,
	BUTTON_POSITION,
	WRAPPER_MARGIN,
    CONTAINER_SECTION_MARGIN,
    CONTAINER_SECTION_PADDING,
    CONTAINER_SECTION_BACKGROUND,
    COUNT_BACKGROUND_LAYOUT_2,
    COUNT_PADDING_LAYOUT_2,
    COUNT_MARGIN_LAYOUT_2,
    TITLE_PADDING_LAYOUT_2,
    TITLE_MARGIN_LAYOUT_2
} from "./constants";
import {
	typoPrefix_title,
	typoPrefix_count,
	typoPrefix_list,
	typoPrefix_button,
} from "./typographyPrefixConstants";
// util
import ResponsiveRangeController from "../../../util/responsive-range-control";
import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";
import TypographyDropdown from "../../../util/typography-control-v2";
import BackgroundControl from "../../../util/background-control";
import BorderShadowControl from "../../../util/border-shadow-control";
import ColorControl from "../../../util/color-control";

const Inspector = ({
	docCategories,
	categories,
	attributes,
	setAttributes,
}) => {
	const {
		resOption,
		includeCategories,
		excludeCategories,
		postCategories,
		gridPerPage,
		orderBy,
		order,
		postsPerPage,
		postsOrderBy,
		postsOrder,
		enableNestedSubcategory,
		enableLazyLoad,
		postPerSubcategory,
        subCategoryPerGrid,
		layout,
		layoutMode,
		showHeader,
		showIcon,
		showTitle,
		titleTag,
		showCount,
		showList,
		listIcon,
		showButton,
        categoryTitleLink,
		buttonText,
		titleColor,
		titleHoverColor,
		countColor,
		countHoverColor,
		listColor,
		listHoverColor,
		iconColor,
		showButtonIcon,
		buttonIcon,
		buttonIconPosition,
		buttonColor,
		buttonHoverColor,
		buttonPosition,
        listIconImageUrl,
        prefix,
        suffix,
        suffixSingular,
        tickerBackgroundColor
	} = attributes;

	const editorStoreForGettingPreivew =
		betterdocs_style_handler.editor_type === "edit-site"
			? "core/edit-site"
			: "core/edit-post";

	// this useEffect is for setting the resOption attribute to desktop/tab/mobile depending on the added 'eb-res-option-' class only the first time once
	useEffect(() => {
		setAttributes({
			resOption: select(
				editorStoreForGettingPreivew
			).__experimentalGetPreviewDeviceType(),
		});
	}, []);

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
	// handle exclude categories
	const handleExcludeCategories = (categories) => {
		setAttributes({
			excludeCategories: categories ? JSON.stringify(categories) : null,
		});
	};

	// POSTS_ORDER_BY already ends with "BetterDocs Order"; appending it again
	// listed the option twice (#304).
	let posts_order_by = [...POSTS_ORDER_BY];

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
						}
					]}
				>
					{(tab) => (
						<div key={tab.name} className={"eb-tab-controls " + tab.name}>
							{tab.name === "general" && (
								<>
									<PanelBody title={__("Query", "betterdocs")}>
										<>
                                            {applyFilters("selectKnowledgeBase", '', attributes, setAttributes)}
											<BaseControl>
												<h3 className="eb-control-title">
													{__("Include", "betterdocs")}
												</h3>
											</BaseControl>
											<Select
												name="include_categories"
												value={
													includeCategories && JSON.parse(includeCategories)
												}
												onChange={handleIncludeCategories}
												options={
													docCategories &&
													docCategories.map((category) => ({
														value: category.id,
														label: category.name,
													}))
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
													excludeCategories && JSON.parse(excludeCategories)
												}
												onChange={handleExcludeCategories}
												options={
													docCategories &&
													docCategories.map((category) => ({
														value: category.id,
														label: category.name,
													}))
												}
												isMulti="true"
											/>
											<TextControl
												label={__("Grid Per Page", "betterdocs")}
												type="number"
												value={gridPerPage}
												onChange={(value) => {
													setAttributes({
														gridPerPage: parseInt(value),
													});
												}}
											/>
											<SelectControl
												label={__("Order By", "betterdocs")}
												value={orderBy}
												options={ORDER_BY}
												onChange={(newOrderby) =>
													setAttributes({
														orderBy: newOrderby,
													})
												}
											/>
											{orderBy != 'doc_category_order' && <SelectControl
												label={__("Order", "betterdocs")}
												value={order}
												options={ORDER}
												onChange={(newOrder) =>
													setAttributes({
														order: newOrder,
													})
												}
											/>}
											<hr />
											<BaseControl>
												<h3 className="eb-control-title">
													<strong>{__("Grid List Docs", "betterdocs")}</strong>
												</h3>
											</BaseControl>
											<TextControl
												label={__("Docs Per Page", "betterdocs")}
												type="number"
												value={postsPerPage}
												onChange={(value) => {
													setAttributes({
														postsPerPage: parseInt(value),
													});
												}}
											/>
											<SelectControl
												label={__("Order By", "betterdocs")}
												value={postsOrderBy}
												options={posts_order_by}
												onChange={(newPostsOrderBy) =>
													setAttributes({
														postsOrderBy: newPostsOrderBy,
													})
												}
											/>
											{postsOrderBy != 'betterdocs_order' && <SelectControl
												label={__("Order", "betterdocs")}
												value={postsOrder}
												options={ORDER}
												onChange={(newPostsOrder) =>
													setAttributes({
														postsOrder: newPostsOrder,
													})
												}
											/>}
											<ToggleControl
												label={__("Enable Nested Subcategory", "betterdocs")}
												checked={enableNestedSubcategory}
												onChange={() => {
													setAttributes({
														enableNestedSubcategory: !enableNestedSubcategory,
													});
												}}
											/>
											<ToggleControl
												label={__("Lazy Load Docs & Subcategories", "betterdocs")}
												help={__("Render only the active category upfront; fetch the rest on click (or scroll for the Memphis layout).", "betterdocs")}
												checked={enableLazyLoad}
												onChange={() => {
													setAttributes({
														enableLazyLoad: !enableLazyLoad,
													});
												}}
											/>
											{enableNestedSubcategory && (
                                                <>
                                                    <TextControl
                                                        label={__("Subcategory Per Grid", "betterdocs")}
                                                        type="number"
                                                        min={0}
                                                        max={100}
                                                        value={subCategoryPerGrid}
                                                        onChange={(value) => {
                                                            setAttributes({
                                                                subCategoryPerGrid: parseInt(value),
                                                            });
                                                        }}
                                                    />
                                                    <TextControl
                                                        label={__("Doc Per Subcategory", "betterdocs")}
                                                        type="number"
                                                        min={0}
                                                        max={100}
                                                        value={postPerSubcategory}
                                                        onChange={(value) => {
                                                            setAttributes({
                                                                postPerSubcategory: parseInt(value),
                                                            });
                                                        }}
                                                    />
                                                </>
											)}
										</>
									</PanelBody>
									<PanelBody title={__("Settings", "betterdocs")}>
										<>
											<SelectControl
												label={__("Select layout", "betterdocs")}
												value={layout}
												options={LAYOUT}
												onChange={(newLayout) =>
													setAttributes({
														layout: newLayout,
													})
												}
											/>
											<SelectControl
												label={__("Layout Mode", "betterdocs")}
												value={layoutMode}
												options={LAYOUT_MODE}
												onChange={(newLayoutMode) =>
													setAttributes({
														layoutMode: newLayoutMode,
													})
												}
											/>
											{layoutMode === "masonry" && (
												<>
													<Notice status="info" isDismissible={false}>
														{__(
															"Please save and reload the view page to get the effect of column and space on masonry layout",
															"betterdocs"
														)}
													</Notice>
													<hr />
												</>
											)}
											<ResponsiveRangeController
												baseLabel={__("Grid Column", "betterdocs")}
												controlName={COLUMNS}
												resRequiredProps={resRequiredProps}
												min={1}
												max={6}
												step={1}
												noUnits
											/>
											{layoutMode === "masonry" && (
												<ResponsiveRangeController
													baseLabel={__("Grid Space", "betterdocs")}
													controlName={GRID_SPACE}
													resRequiredProps={resRequiredProps}
													min={1}
													max={100}
													step={1}
													noUnits
												/>
											)}
											<ToggleControl
												label={__("Show header bar", "betterdocs")}
												checked={showHeader}
												onChange={() => {
													setAttributes({
														showHeader: !showHeader,
													});
												}}
											/>
											<ToggleControl
												label={__("Show Icon", "betterdocs")}
												checked={showIcon}
												onChange={() => {
													setAttributes({
														showIcon: !showIcon,
													});
												}}
											/>
											<ToggleControl
												label={__("Show Title", "betterdocs")}
												checked={showTitle}
												onChange={() => {
													setAttributes({
														showTitle: !showTitle,
													});
												}}
											/>
											<SelectControl
												label={__("Select Tag", "betterdocs")}
												value={titleTag}
												options={HTML_TAGS}
												onChange={(newTitleTag) =>
													setAttributes({
														titleTag: newTitleTag,
													})
												}
											/>
											<ToggleControl
												label={__("Show Count", "betterdocs")}
												checked={showCount}
												onChange={() => {
													setAttributes({
														showCount: !showCount,
													});
												}}
											/>
											<ToggleControl
												label={__("Show List", "betterdocs")}
												checked={showList}
												onChange={() => {
													setAttributes({
														showList: !showList,
													});
												}}
											/>
											<ToggleControl
												label={__("Show Button", "betterdocs")}
												checked={showButton}
												onChange={() => {
													setAttributes({
														showButton: !showButton,
													});
												}}
											/>
                                            <ToggleControl
												label={__("Category Title Link", "betterdocs")}
												checked={categoryTitleLink}
												onChange={(value) => {
													setAttributes({
														categoryTitleLink: !categoryTitleLink,
													});
												}}
											/>
											{showButton && (
												<TextControl
													label={__("Button Text", "betterdocs")}
													value={buttonText}
													onChange={(value) => {
														setAttributes({
															buttonText: value,
														});
													}}
												/>
											)}
                                            {layout == 'layout-2' &&
                                                <>
                                                    <TextControl
                                                        label={__("Prefix", "betterdocs")}
                                                        value={prefix}
                                                        onChange={(prefix) =>
                                                            setAttributes({
                                                                prefix,
                                                            })
                                                        }
                                                    />
                                                    <TextControl
                                                        label={__("Suffix", "betterdocs")}
                                                        value={suffix}
                                                        onChange={(suffix) =>
                                                            setAttributes({
                                                                suffix,
                                                            })
                                                        }
                                                    />
                                                    <TextControl
                                                        label={__("Suffix Singular", "betterdocs")}
                                                        value={suffixSingular}
                                                        onChange={(suffixSingular) =>
                                                            setAttributes({
                                                                suffixSingular,
                                                            })
                                                        }
                                                    />
                                                </>
                                            }
										</>
									</PanelBody>
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
                                            controlName={CONTAINER_SECTION_PADDING}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__(
                                                "Margin",
                                                "betterdocs",
                                            )}
                                            resRequiredProps={resRequiredProps}
                                            controlName={CONTAINER_SECTION_MARGIN}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__("Inner Margin", "betterdocs")}
                                            resRequiredProps={resRequiredProps}
                                            controlName={WRAPPER_MARGIN}
									    />
                                        <BackgroundControl
                                            controlName={
                                                CONTAINER_SECTION_BACKGROUND
                                            }
                                            resRequiredProps={resRequiredProps}
                                            noOverlay={true}
                                        />
                                    </PanelBody>
									<PanelBody title={__("Grid", "betterdocs")}>
										<ResponsiveDimensionsControl
											baseLabel={__("Grid Padding", "betterdocs")}
											resRequiredProps={resRequiredProps}
											controlName={GRID_PADDING}
										/>
										<ResponsiveDimensionsControl
											baseLabel={__("Grid Margin", "betterdocs")}
											resRequiredProps={resRequiredProps}
											controlName={GRID_MARGIN}
										/>
										<hr />
										<BaseControl>
											<h3 className="eb-control-title">
												{__("Background", "betterdocs")}
											</h3>
										</BaseControl>
										<BackgroundControl
											controlName={GRID_BACKGROUND}
											resRequiredProps={resRequiredProps}
											noOverlay={true}
										/>
										<BaseControl>
											<h3 className="eb-control-title">
												{__("Border", "betterdocs")}
											</h3>
										</BaseControl>
										<BorderShadowControl
											controlName={GRID_BORDER}
											resRequiredProps={resRequiredProps}
										/>
									</PanelBody>
									<PanelBody
										title={__("Title", "betterdocs")}
										initialOpen={false}
									>
										<TypographyDropdown
											baseLabel={__("Typography", "betterdocs")}
											typographyPrefixConstant={typoPrefix_title}
											resRequiredProps={resRequiredProps}
											defaultFontSize={20}
										/>
										<ColorControl
											label={__("Color", "betterdocs")}
											color={titleColor}
											onChange={(titleColor) => setAttributes({ titleColor })}
										/>
										<ColorControl
											label={__("Hover Color", "betterdocs")}
											color={titleHoverColor}
											onChange={(titleHoverColor) =>
												setAttributes({
													titleHoverColor,
												})
											}
										/>
										<ResponsiveDimensionsControl
											baseLabel={__("Padding", "betterdocs")}
											resRequiredProps={resRequiredProps}
											controlName={layout == 'default' ? TITLE_PADDING : TITLE_PADDING_LAYOUT_2}
										/>
										<ResponsiveDimensionsControl
											baseLabel={__("Margin", "betterdocs")}
											resRequiredProps={resRequiredProps}
											controlName={layout == 'default' ? TITLE_MARGIN : TITLE_MARGIN_LAYOUT_2}
										/>
										<hr />
										<BaseControl>
											<h3 className="eb-control-title">
												{__("Background", "betterdocs")}
											</h3>
										</BaseControl>
										<BackgroundControl
											controlName={TITLE_BACKGROUND}
											resRequiredProps={resRequiredProps}
											noOverlay={true}
											noMainBgi={true}
										/>
										<BaseControl>
											<h3 className="eb-control-title">
												{__("Border", "betterdocs")}
											</h3>
										</BaseControl>
										<BorderShadowControl
											controlName={TITLE_BORDER}
											noShadow={true}
											resRequiredProps={resRequiredProps}
										/>
									</PanelBody>
									<PanelBody
										title={__("Count", "betterdocs")}
										initialOpen={false}
									>
										<TypographyDropdown
											baseLabel={__("Typography", "betterdocs")}
											typographyPrefixConstant={typoPrefix_count}
											resRequiredProps={resRequiredProps}
											defaultFontSize={15}
										/>
										<ColorControl
											label={__("Color", "betterdocs")}
											color={countColor}
											onChange={(countColor) => setAttributes({ countColor })}
										/>
										<ColorControl
											label={__("Hover Color", "betterdocs")}
											color={countHoverColor}
											onChange={(countHoverColor) =>
												setAttributes({
													countHoverColor,
												})
											}
										/>
										{layout == 'default' && <ResponsiveRangeController
											baseLabel={__("Size", "betterdocs")}
											controlName={COUNT_SIZE}
											resRequiredProps={resRequiredProps}
											min={1}
											max={100}
											step={1}
										/>}
                                        {layout == 'layout-2'  && <><ResponsiveDimensionsControl
											baseLabel={__("Padding", "betterdocs")}
											resRequiredProps={resRequiredProps}
											controlName={COUNT_PADDING_LAYOUT_2}
										/>
                                        <ResponsiveDimensionsControl
											baseLabel={__("Margin", "betterdocs")}
											resRequiredProps={resRequiredProps}
											controlName={COUNT_MARGIN_LAYOUT_2}
										/>
                                        </>}
                                        {layout == 'layout-2' && <ColorControl
											label={__("Ticker Background Color", "betterdocs")}
											color={tickerBackgroundColor}
											onChange={(tickerBackgroundColor) => setAttributes({ tickerBackgroundColor })}
										/>}
										<hr />
										<BaseControl>
											<h3 className="eb-control-title">
												{__("Background", "betterdocs")}
											</h3>
										</BaseControl>
										<BackgroundControl
											controlName={layout == 'default' ? COUNT_BACKGROUND : COUNT_BACKGROUND_LAYOUT_2}
											resRequiredProps={resRequiredProps}
											noOverlay={true}
											noMainBgi={true}
										/>
										<BaseControl>
											<h3 className="eb-control-title">
												{__("Border", "betterdocs")}
											</h3>
										</BaseControl>
										<BorderShadowControl
											controlName={COUNT_BORDER}
											noShadow={true}
											resRequiredProps={resRequiredProps}
										/>
									</PanelBody>
									<PanelBody
										title={__("List", "betterdocs")}
										initialOpen={false}
									>
										<TypographyDropdown
											baseLabel={__("Typography", "betterdocs")}
											typographyPrefixConstant={typoPrefix_list}
											resRequiredProps={resRequiredProps}
											defaultFontSize={15}
										/>
										<ColorControl
											label={__("Color", "betterdocs")}
											color={listColor}
											onChange={(listColor) => setAttributes({ listColor })}
										/>
										<ColorControl
											label={__("Hover Color", "betterdocs")}
											color={listHoverColor}
											onChange={(listHoverColor) =>
												setAttributes({
													listHoverColor,
												})
											}
										/>
										<ResponsiveDimensionsControl
											baseLabel={__("List Item Spacing", "betterdocs")}
											resRequiredProps={resRequiredProps}
											controlName={LIST_MARGIN}
										/>
										<ResponsiveDimensionsControl
											baseLabel={__("List Area Padding", "betterdocs")}
											resRequiredProps={resRequiredProps}
											controlName={LIST_PADDING}
										/>
										<BaseControl>
											<h3 className="eb-control-title">
												{__("Background", "betterdocs")}
											</h3>
										</BaseControl>
										<BackgroundControl
											controlName={LIST_BACKGROUND}
											resRequiredProps={resRequiredProps}
											noOverlay={true}
											noMainBgi={true}
										/>
										<hr />
                                        <MediaPlaceholder
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
                                        />
										{listIconImageUrl == '' && <><BaseControl>
											<h3 className="eb-control-title">
												{__("Icon", "betterdocs")}
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
											label={__("Color", "betterdocs")}
											color={iconColor}
											onChange={(iconColor) =>
												setAttributes({
													iconColor,
												})
											}
										/>
										<ResponsiveRangeController
											baseLabel={__("Size", "betterdocs")}
											controlName={ICON_SIZE}
											resRequiredProps={resRequiredProps}
											min={1}
											max={100}
											step={1}
										/></>}
                                        {listIconImageUrl != '' && <>
                                            <ResponsiveRangeController
                                                baseLabel={__("Height", "betterdocs")}
                                                controlName={ICON_HEIGHT}
                                                resRequiredProps={resRequiredProps}
                                                min={1}
                                                max={100}
                                                step={1}
                                            />
                                            <ResponsiveRangeController
                                                baseLabel={__("Width", "betterdocs")}
                                                controlName={ICON_WIDTH}
                                                resRequiredProps={resRequiredProps}
                                                min={1}
                                                max={100}
                                                step={1}
                                            />
                                        </>}
										<ResponsiveDimensionsControl
											baseLabel={__("Space", "betterdocs")}
											resRequiredProps={resRequiredProps}
											controlName={ICON_MARGIN}
										/>
									</PanelBody>
									<PanelBody
										title={__("Button", "betterdocs")}
										initialOpen={false}
									>
										<ToggleControl
											label={__("Show Icon", "betterdocs")}
											checked={showButtonIcon}
											onChange={() => {
												setAttributes({
													showButtonIcon: !showButtonIcon,
												});
											}}
										/>
										{showButtonIcon && (
											<>
												<BaseControl label={__("Icon", "betterdocs")}>
													<FontIconPicker
														icons={faIcons}
														value={buttonIcon}
														onChange={(buttonIcon) =>
															setAttributes({
																buttonIcon,
															})
														}
														appendTo="body"
														closeOnSelect
													/>
												</BaseControl>
												<SelectControl
													label={__("Icon Positon", "betterdocs")}
													value={buttonIconPosition}
													options={[
														{
															value: "after",
															label: __("After", "betterdocs"),
														},
														{
															value: "before",
															label: __("Before", "betterdocs"),
														},
													]}
													onChange={(newButtonIconPosition) =>
														setAttributes({
															buttonIconPosition: newButtonIconPosition,
														})
													}
												/>
											</>
										)}
										<TypographyDropdown
											baseLabel={__("Typography", "betterdocs")}
											typographyPrefixConstant={typoPrefix_button}
											resRequiredProps={resRequiredProps}
											defaultFontSize={16}
										/>
										<ColorControl
											label={__("Color", "betterdocs")}
											color={buttonColor}
											onChange={(buttonColor) => setAttributes({ buttonColor })}
										/>
										<ColorControl
											label={__("Hover Color", "betterdocs")}
											color={buttonHoverColor}
											onChange={(buttonHoverColor) =>
												setAttributes({
													buttonHoverColor,
												})
											}
										/>
										<ResponsiveDimensionsControl
											baseLabel={__("Padding", "betterdocs")}
											resRequiredProps={resRequiredProps}
											controlName={BTN_PADDING}
										/>
										<ResponsiveDimensionsControl
											baseLabel={__("Margin", "betterdocs")}
											resRequiredProps={resRequiredProps}
											controlName={BTN_MARGIN}
										/>
										<BaseControl>
											<h3 className="eb-control-title">{__("Background")}</h3>
										</BaseControl>
										<BackgroundControl
											controlName={BTN_BACKGROUND}
											resRequiredProps={resRequiredProps}
											noOverlay={true}
											noMainBgi={true}
										/>
										<BaseControl>
											<h3 className="eb-control-title">
												{__("Border", "betterdocs")}
											</h3>
										</BaseControl>
										<BorderShadowControl
											controlName={BTN_BORDER}
											noShadow={true}
											resRequiredProps={resRequiredProps}
										/>
										<BaseControl
											label={__("Alignment")}
											id="eb-button-group-alignment"
										>
											<ButtonGroup id="eb-button-group-alignment">
												{BUTTON_POSITION.map((item) => (
													<Button
                                                        key={item.value}
														isLarge
														isPrimary={buttonPosition === item.value}
														isSecondary={buttonPosition !== item.value}
														onClick={() =>
															setAttributes({
																buttonPosition: item.value,
															})
														}
													>
														{item.label}
													</Button>
												))}
											</ButtonGroup>
										</BaseControl>
									</PanelBody>
								</>
							)}
							{/* {tab.name === "advance" && (
								<PanelBody title={__("Wrapper", "betterdocs")}>
									<ResponsiveDimensionsControl
										baseLabel={__("Margin", "betterdocs")}
										resRequiredProps={resRequiredProps}
										controlName={WRAPPER_MARGIN}
									/>
								</PanelBody>
							)} */}
						</div>
					)}
				</TabPanel>
			</div>
		</InspectorControls>
	);
};

export default withSelect((select) => {
	return {
		docCategories: select("core").getEntityRecords("taxonomy", "doc_category", {
			per_page: -1,
		}),
	};
})(Inspector);
