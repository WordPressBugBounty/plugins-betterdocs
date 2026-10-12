/**
 * WordPress dependencies
 */

import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
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
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { select, useSelect } from '@wordpress/data';

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
	FAQ_LAYOUT,
	getFaqTaxonomyOptions,
	FAQ_LIST_BACKGROUND,
	FAQ_CONTENT_BACKGROUND,
	FAQ_LIST_MARGIN,
	FAQ_LIST_PADDING,
	FAQ_BORDER,
	FAQ_CONTENT_BORDER,
	FAQ_CONTENT_MARGIN,
	FAQ_CONTENT_PADDING,
	POSTS_ORDER_BY,
    ICON_MARGIN,
	BTN_MARGIN,
	BTN_PADDING,
	BTN_BACKGROUND,
	BTN_BORDER,
	BUTTON_POSITION,
	WRAPPER_MARGIN,
	ICON_SIZE,
    SECTION_TITLE_MARGIN,
    SECTION_TITLE_PADDING,
    GROUP_TITLE_MARGIN,
    GROUP_TITLE_PADDING,
    CONTAINER_SECTION_PADDING,
    CONTAINER_SECTION_MARGIN,
    CONTAINER_SECTION_BACKGROUND,
    FAQ_LIST_BACKGROUND_LAYOUT_3,
	GROUP_TITLE_PADDING_LAYOUT_4,
	GROUP_TITLE_MARGIN_LAYOUT_4,
	FAQ_LIST_PADDING_LAYOUT_4,
	FAQ_LIST_MARGIN_LAYOUT_4,
	FAQ_LIST_BACKGROUND_LAYOUT_4,
	FAQ_BORDER_LAYOUT_4,
	FAQ_CONTENT_PADDING_LAYOUT_4,
	FAQ_CONTENT_MARGIN_LAYOUT_4,
	FAQ_CONTENT_BACKGROUND_LAYOUT_4,
	FAQ_CONTENT_BORDER_LAYOUT_4,
	HTML_TAGS
} from "./constants";


import {
	typoPrefix_section_titele,
	typoPrefix_group_title,
	typoPrefix_faq_title,
	typoPrefix_faq_content,
    typoPrefix_section_title_layout_3,
	typoPrefix_group_title_layout_4,
	typoPrefix_faq_title_layout_4,
	typoPrefix_faq_content_layout_4
} from "./typographyPrefixConstants";
// util
import ResponsiveRangeController from "../../../util/responsive-range-control";
import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";
import TypographyDropdown from "../../../util/typography-control-v2";
import BackgroundControl from "../../../util/background-control";
import BorderShadowControl from "../../../util/border-shadow-control";
import ColorControl from "../../../util/color-control";
import { htmlToElem } from '../../../helpers/helper';

const Inspector = ({
	faqs,
	attributes,
	setAttributes,
}) => {
	const {
		resOption,
		faqLayout,
		faqTaxonomy,
		faqOrder,
		faqSectionText,
		faqSectionTitleTag,
		faqGroupTitleTag,
		includeFaqGroup,
		excludeFaqGroup,
		faqSectionTitleColor,
		faqSectionTitleHoverColor,
		faqGroupTitleColor,
		faqGroupTitleLayout4Color,
		faqGroupTitleLayout4HoverColor,
		faqListLayout4Color,
		faqContentLayout4Color,
		faqGroupTitleHoverColor,
		faqListColor,
		faqContentColor,
		faqIconColor,
		faqGroupTitleTypography,

		postCategories,
		faqPerPage,
		orderBy,
		order,
		postsPerPage,
		postsOrderBy,
		postsOrder,
		enableNestedSubcategory,
		postPerSubcategory,
		layout,
		layoutMode,
		showHeader,
		showIcon,
		showTitle,
		showThumbnail,
		showDescription,
		titleTag,
		showCount,
		showList,
		listIcon,
		showButton,
		buttonText,
		titleColor,
		titleHoverColor,
		descriptionColor,
		descriptionHoverColor,
		countColor,
		countHoverColor,
		listColor,
		listHoverColor,
		iconColor,
		showButtonIcon,
		buttonIcon,
		buttonColor,
		buttonColorLayout4,
		buttonHoverColor,
		buttonPosition,
	} = attributes;



	const docFaqs = useSelect( ( sel ) => {
		return sel( 'core' ).getEntityRecords( 'taxonomy', faqTaxonomy || 'betterdocs_faq_category', { per_page: -1 } );
	}, [ faqTaxonomy ] );

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

	// handle include faqs
	const handleIncludeCategories = (faqs) => {
		setAttributes({
			includeFaqGroup: faqs ? JSON.stringify(faqs) : null,
		});
	};
	// handle exclude faqs
	const handleExcludeCategories = (faqs) => {
		setAttributes({
			excludeFaqGroup: faqs ? JSON.stringify(faqs) : null,
		});
	};

	// Define a function to generate options
	const faqOptions = (docFaqs) => {
		if (!docFaqs) return [];

		return docFaqs.map((faq) => ({
			value: faq.id,
			label: faq.name,
		}));
	};



	// control POSTS_ORDER_BY for pro plugin
	let posts_order_by =
		Boolean(betterDocsBlocksHelper.is_pro_active) === true
			? [
				...POSTS_ORDER_BY,
				{
					label: __("BetterDocs Order", "betterdocs-pro"),
					value: "betterdocs_order",
				},
			]
			: [...POSTS_ORDER_BY];

	return (
		<InspectorControls key="controls">
			<div className="eb-panel-control">
				<TabPanel
					className="eb-parent-tab-panel"
					activeClass="active-tab"
					tabs={[
						{
							name: "general",
							title: __("General", "betterdocs-pro"),
							className: "eb-tab general",
						},
						{
							name: "styles",
							title: __("Style", "betterdocs-pro"),
							className: "eb-tab styles",
						}
					]}
				>
					{(tab) => (
						<div key={tab.name} className={"eb-tab-controls " + tab.name}>
							{tab.name === "general" && (
								<>
									<PanelBody title={__("Layout Options", "betterdocs-pro")} initialOpen={true}>
										<>
											<SelectControl
												label={__("FAQ Type", "betterdocs")}
												value={faqTaxonomy}
												options={getFaqTaxonomyOptions()}
												onChange={(faqTaxonomy) => setAttributes({ faqTaxonomy, includeFaqGroup: null, excludeFaqGroup: null })}
											/>
											<SelectControl
												label={__("Select Layout", "betterdocs-pro")}
												value={faqLayout}
												options={FAQ_LAYOUT}
												onChange={(faqLayout) => setAttributes({ faqLayout })}
											/>
											<SelectControl
												label={__("FAQ Order", "betterdocs")}
												value={faqOrder}
												help={__("Overrides the global FAQ Builder order for this block only.", "betterdocs")}
												options={[
													{ label: __("Default (global)", "betterdocs"), value: "" },
													{ label: __("Manual (drag & drop)", "betterdocs"), value: "default" },
													{ label: __("Newest first", "betterdocs"), value: "most_recent" },
													{ label: __("Oldest first", "betterdocs"), value: "least_recent" },
													{ label: __("Title A → Z", "betterdocs"), value: "a_to_z" },
													{ label: __("Title Z → A", "betterdocs"), value: "z_to_a" },
													{ label: __("Most questions", "betterdocs"), value: "most_questions" },
												]}
												onChange={(faqOrder) => setAttributes({ faqOrder })}
											/>
											<TextControl
												label={__("FAQ Section", "betterdocs-pro")}
												type="text"
												value={faqSectionText}
												onChange={(faqSectionText) => setAttributes({ faqSectionText })}
											/>
											<SelectControl
												label={__("Section Title Tag", "betterdocs")}
												value={faqSectionTitleTag}
												options={HTML_TAGS}
												onChange={(faqSectionTitleTag) =>
													setAttributes({
														faqSectionTitleTag: faqSectionTitleTag,
													})
												}
											/>
											<SelectControl
												label={__("Group Title Tag", "betterdocs")}
												value={faqGroupTitleTag}
												options={HTML_TAGS}
												onChange={(faqGroupTitleTag) =>
													setAttributes({
														faqGroupTitleTag: faqGroupTitleTag,
													})
												}
											/>

											{ faqTaxonomy === 'product_assignments' ? (
												<Notice
													status="info"
													isDismissible={ false }
													style={ { marginTop: '8px' } }
												>
													{ __( 'Groups are resolved automatically per product: a per-product assignment is shown if set, otherwise the groups assigned to the product’s categories. Manage assignments on each group in FAQ Builder → WooCommerce → Product FAQ Groups.', 'betterdocs' ) }
												</Notice>
											) : (
												<>
													<BaseControl>
														<label class="components-base-control__label" for="inspector-text-control-2">{__("Include FAQ Groups", "betterdocs-pro")}</label>
														<Select
															name="include_faqs"
															value={
																includeFaqGroup && JSON.parse(includeFaqGroup)
															}
															onChange={handleIncludeCategories}
															options={faqOptions(docFaqs)}
															isMulti="true"
														/>
													</BaseControl>

													<BaseControl>
														<label class="components-base-control__label" for="inspector-text-control-2">{__("Exclude FAQ Groups", "betterdocs-pro")}</label>
														<Select
															name="exclude_faqs"
															value={
																excludeFaqGroup && JSON.parse(excludeFaqGroup)
															}
															onChange={handleExcludeCategories}
															options={faqOptions(docFaqs)}
															isMulti="true"
														/>
													</BaseControl>
												</>
											) }


										</>
									</PanelBody>

								</>
							)}
							{tab.name === "styles" && (
								<>
                                	<PanelBody title={__("Container Section", "betterdocs-pro")} initialOpen={true}>
                                        <BackgroundControl
                                            controlName={CONTAINER_SECTION_BACKGROUND}
                                            resRequiredProps={resRequiredProps}
                                            noOverlay={true}
                                        />
                                        <ResponsiveDimensionsControl
											baseLabel={__("Padding", "betterdocs-pro")}
											resRequiredProps={resRequiredProps}
											controlName={CONTAINER_SECTION_PADDING}
										/>
                                        <ResponsiveDimensionsControl
											baseLabel={__("Margin", "betterdocs-pro")}
											resRequiredProps={resRequiredProps}
											controlName={CONTAINER_SECTION_MARGIN}
										/>
                                    </PanelBody>
									<PanelBody title={__("FAQ Section Title", "betterdocs-pro")} initialOpen={true}>
										<ColorControl
											label={__("Color", "betterdocs-pro")}
											color={faqSectionTitleColor}
											onChange={(faqSectionTitleColor) => setAttributes({ faqSectionTitleColor })}
										/>

										<TypographyDropdown
											baseLabel={__("Typography", "betterdocs-pro")}
											typographyPrefixConstant={faqLayout == 'layout-3' ?  typoPrefix_section_title_layout_3 : typoPrefix_section_titele}
											resRequiredProps={resRequiredProps}
											defaultFontSize={30}
										/>
                                        <ResponsiveDimensionsControl
											baseLabel={__("Padding", "betterdocs-pro")}
											resRequiredProps={resRequiredProps}
											controlName={SECTION_TITLE_PADDING}
										/>
                                         <ResponsiveDimensionsControl
											baseLabel={__("Margin", "betterdocs-pro")}
											resRequiredProps={resRequiredProps}
											controlName={SECTION_TITLE_MARGIN}
										/>
									</PanelBody>
									<PanelBody title={__("FAQ Group Title", "betterdocs-pro")} initialOpen={false}>
										<ColorControl
											label={__("Color", "betterdocs-pro")}
											color={faqLayout == 'layout-4' ? faqGroupTitleLayout4Color : faqGroupTitleColor}
											onChange={(faqGroupTitleColor) => {
												if( faqLayout == 'layout-4' ) {
													setAttributes({ faqGroupTitleLayout4Color: faqGroupTitleColor });
												} else {
													setAttributes({ faqGroupTitleColor: faqGroupTitleColor });
												}
											}}
										/>

										<ColorControl
											label={__("Hover Color", "betterdocs-pro")}
											color={faqLayout == 'layout-4' ? faqGroupTitleLayout4HoverColor : faqGroupTitleHoverColor}
											onChange={(faqGroupTitleHoverColor) => {
												if( faqLayout == 'layout-4' ) {
													setAttributes({ faqGroupTitleLayout4HoverColor: faqGroupTitleHoverColor })
												} else {
													setAttributes({ faqGroupTitleHoverColor: faqGroupTitleHoverColor })
												}
											}}
										/>

										<TypographyDropdown
											baseLabel={__("Typography", "betterdocs-pro")}
											typographyPrefixConstant={faqLayout == 'layout-4' ? typoPrefix_group_title_layout_4 : typoPrefix_group_title}
											resRequiredProps={resRequiredProps}
											defaultFontSize={25}
										/>
                                          <ResponsiveDimensionsControl
											baseLabel={__("Padding", "betterdocs-pro")}
											resRequiredProps={resRequiredProps}
											controlName={faqLayout == 'layout-4' ? GROUP_TITLE_PADDING_LAYOUT_4 : GROUP_TITLE_PADDING}
										/>
                                         <ResponsiveDimensionsControl
											baseLabel={__("Margin", "betterdocs-pro")}
											resRequiredProps={resRequiredProps}
											controlName={faqLayout == 'layout-4' ? GROUP_TITLE_MARGIN_LAYOUT_4 : GROUP_TITLE_MARGIN}
										/>
									</PanelBody>
									<PanelBody title={__("FAQ List", "betterdocs-pro")} initialOpen={false}>
										<ResponsiveDimensionsControl
											baseLabel={__("Padding", "betterdocs-pro")}
											resRequiredProps={resRequiredProps}
											controlName={faqLayout == 'layout-4' ? FAQ_LIST_PADDING_LAYOUT_4 : FAQ_LIST_PADDING}
										/>
										<ResponsiveDimensionsControl
											baseLabel={__("Margin", "betterdocs-pro")}
											resRequiredProps={resRequiredProps}
											controlName={faqLayout == 'layout-4' ? FAQ_LIST_MARGIN_LAYOUT_4 : FAQ_LIST_MARGIN}
										/>
										<hr />
										<BaseControl>
											<h3 className="eb-control-title">
												{__("Background", "betterdocs-pro")}
											</h3>
										</BaseControl>
										<BackgroundControl
											controlName={faqLayout == 'layout-3' ? FAQ_LIST_BACKGROUND_LAYOUT_3 : ( faqLayout == 'layout-4' ? FAQ_LIST_BACKGROUND_LAYOUT_4 : FAQ_LIST_BACKGROUND )}
											resRequiredProps={resRequiredProps}
											noOverlay={true}
										/>

										<TypographyDropdown
											baseLabel={__("Typography", "betterdocs-pro")}
											typographyPrefixConstant={faqLayout == 'layout-4' ? typoPrefix_faq_title_layout_4 : typoPrefix_faq_title}
											resRequiredProps={resRequiredProps}
											defaultFontSize={17}
										/>
										<ColorControl
											label={__("Color", "betterdocs-pro")}
											color={faqLayout == 'layout-4' ? faqListLayout4Color : faqListColor}
											onChange={(faqListColor) => {
												if(faqLayout == 'layout-4'){
													setAttributes({ faqListLayout4Color:faqListColor })
												} else {
													setAttributes({ faqListColor:faqListColor })
												}
											}}
										/>

										<BaseControl>
											<h3 className="eb-control-title">
												{__("Border", "betterdocs-pro")}
											</h3>
										</BaseControl>
										<BorderShadowControl
											controlName={faqLayout == 'layout-4' ? FAQ_BORDER_LAYOUT_4 : FAQ_BORDER}
											resRequiredProps={resRequiredProps}
										/>

									</PanelBody>
									<PanelBody title={__("FAQ Content", "betterdocs-pro")} initialOpen={false}>
										<ResponsiveDimensionsControl
											baseLabel={__("Padding", "betterdocs-pro")}
											resRequiredProps={resRequiredProps}
											controlName={faqLayout == 'layout-4' ? FAQ_CONTENT_PADDING_LAYOUT_4 : FAQ_CONTENT_PADDING}
										/>
										<ResponsiveDimensionsControl
											baseLabel={__("Margin", "betterdocs-pro")}
											resRequiredProps={resRequiredProps}
											controlName={faqLayout == 'layout-4' ? FAQ_CONTENT_MARGIN_LAYOUT_4 : FAQ_CONTENT_MARGIN}
										/>
										<hr />
										<BaseControl>
											<h3 className="eb-control-title">
												{__("Background", "betterdocs-pro")}
											</h3>
										</BaseControl>
										<BackgroundControl
											controlName={faqLayout == 'layout-4' ? FAQ_CONTENT_BACKGROUND_LAYOUT_4 : FAQ_CONTENT_BACKGROUND}
											resRequiredProps={resRequiredProps}
											noOverlay={true}
										/>

										<TypographyDropdown
											baseLabel={__("Typography", "betterdocs-pro")}
											typographyPrefixConstant={faqLayout == 'layout-4' ? typoPrefix_faq_content_layout_4: typoPrefix_faq_content}
											resRequiredProps={resRequiredProps}
											defaultFontSize={16}
										/>
										<ColorControl
											label={__("Color", "betterdocs-pro")}
											color={faqLayout == 'layout-4' ? faqContentLayout4Color : faqContentColor}
											onChange={(faqContentColor) => {
												if( faqLayout == 'layout-4' ) {
													setAttributes({ faqContentLayout4Color:faqContentColor });
												}else {
													setAttributes({ faqContentColor:faqContentColor });
												}
											}}
										/>

										<BaseControl>
											<h3 className="eb-control-title">
												{__("Border", "betterdocs-pro")}
											</h3>
										</BaseControl>
										<BorderShadowControl
											controlName={faqLayout == 'layout-4' ? FAQ_CONTENT_BORDER_LAYOUT_4 : FAQ_CONTENT_BORDER}
											resRequiredProps={resRequiredProps}
                                            noShadow={true}
										/>

									</PanelBody>

									<PanelBody
										title={__("FAQ List Icon", "betterdocs-pro")}
										initialOpen={false}
									>
										<ToggleControl
											label={__("Show/Hide", "betterdocs-pro")}
											checked={showButtonIcon}
											onChange={() => {
												setAttributes({
													showButtonIcon: !showButtonIcon,
												});
											}}
										/>
										{showButtonIcon && (
											<>
												<ResponsiveRangeController
													baseLabel={__("Icon Size", "betterdocs")}
													controlName={ICON_SIZE}
													resRequiredProps={resRequiredProps}
													min={1}
													max={200}
													step={1}
													noUnits
												/>
                                                <ResponsiveDimensionsControl
                                                    baseLabel={__("Margin", "betterdocs-pro")}
                                                    resRequiredProps={resRequiredProps}
                                                    controlName={ICON_MARGIN}
									            />
											</>
										)}

										<ColorControl
											label={__("Color", "betterdocs-pro")}
											color={faqLayout == 'layout-4' ? buttonColorLayout4 : buttonColor}
											onChange={(buttonColor) => {
												if( faqLayout == 'layout-4' ) {
													setAttributes({ buttonColorLayout4:buttonColor });
												} else {
													setAttributes({ buttonColor:buttonColor });
												}
											}}
										/>


									</PanelBody>
								</>
							)}
							{/* {tab.name === "advance" && (
								<PanelBody title={__("Wrapper", "betterdocs-pro")}>
									<ResponsiveDimensionsControl
										baseLabel={__("Margin", "betterdocs-pro")}
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

export default Inspector;
