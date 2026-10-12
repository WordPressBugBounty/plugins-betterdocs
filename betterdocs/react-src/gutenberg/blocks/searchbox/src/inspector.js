/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    BaseControl,
    TabPanel,
    SelectControl,
    Notice,
    ToggleControl,
    RangeControl
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { select } from '@wordpress/data';

/**
 * Internal depencencies
 */
import objAttributes from "./attributes";

import {
  BOX_BACKGROUND,
  BOX_PADDING,
  FIELD_PADDING,
  FIELD_BORDER,
  RESULT_BOX_WIDTH,
  RESULT_BOX_MAXWIDTH,
  RESULT_BOX_BACKGROUND,
  RESULT_BOX_BORDER,
  HTML_TAGS,
  ITEM_PADDING,
  ITEM_BORDER,
  ICON_SIZE,
  WRAPPER_MARGIN,
  SEARCH_LAYOUT_VALUES,
  SEARCH_MODAL_LAYOUT_VALUES,
  BOX_BACKGROUND_LAYOUT_2,
  BOX_PADDING_LAYOUT_2,
  FIELD_PADDING_LAYOUT_2,
  FIELD_BORDER_LAYOUT_2,
  ICON_SIZE_LAYOUT_2,
  SEARCH_MODAL_FIELD_BACKGROUND,
  SEARCH_MODAL_CONTENT_TABS_ICON_SIZE,
  SEARCH_MODAL_CONTENT_TABS_BORDER,
  SEARCH_MODAL_CONTENT_TABS_LIST_ICON_SIZE,
  SEARCH_MODAL_CONTENT_TABS_LIST_BORDER,
  SEARCH_MODAL_CONTENT_TABS_LIST_CATEGORY_ICON_SIZE,
  SEARCH_BUTTON_BACKGROUND_LAYOUT_2,
  WRAPPER_MARGIN_LAYOUT_2,
  AI_SUGGESTION_MARGIN,
  AI_SUGGESTION_PADDING,
  AI_SUGGESTION_BUTTON_MARGIN,
  AI_SUGGESTION_BUTTON_PADDING
} from "./constants";
import {
  typoPrefix_fieldtext,
  typoPrefix_fieldtext_layout_2,
  typoPrefix_resulttext,
  SEARCH_MODAL_CONTENT_TABS_LIST_CATEGORY_TYPO,
  SEARCH_MODAL_FIELD_TYPO,
  SEARCH_MODAL_CATEGORY_FIELD_TYPO,
  SEARCH_MODAL_CONTENT_TABS_TYPO,
  SEARCH_MODAL_CONTENT_TABS_LIST_TYPO,
  SEARCH_BUTTON_LAYOUT_2_TYPO,
  AI_SUGGESTION_TITLE_TYPO,
  AI_SUGGESTION_QUERY_TYPO,
  AI_SUGGESTION_RESPONSE_TYPO,
  AI_SUGGESTION_BUTTON_TYPO,
} from "./typographyPrefixConstants";
// util
import ResponsiveRangeController from "../../../util/responsive-range-control";
import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";
import TypographyDropdown from "../../../util/typography-control-v2";
import BackgroundControl from "../../../util/background-control";
import BorderShadowControl from "../../../util/border-shadow-control";
import ColorControl from "../../../util/color-control";
import { applyFilters, doAction } from '@wordpress/hooks';

const Inspector = ({ attributes = {}, setAttributes = () => {} }) => {
  const {
    resOption,
    placeholderText,
    fieldBackgroundColor,
    fieldBackgroundColorLayout2,
    fieldTextColor,
    fieldTextColorLayout2,
    searchIconColor,
    searchIconColorLayout2,
    closeIconColor,
    closeBorderColor,
    itemColor,
    itemHoverColor,
    searchLayout,
    searchModalLayout,
    searchModalWidth,
    searchModalWidthUnit,
    searchModalPosition,
    searchModalMagnifierColor,
    searchModalFieldColor,
    searchModalFieldPlaceholderColor,
    searchModalCategoryColor,
    searchModalContentTabsListColor,
    searchModalContentTabsListCategoryColor,
    searchHeading,
    searchSubHeading,
    initialFAQNumber,
    initialDocsNumber,
    searchButtonLayout2Color,
    docQueryType,
    faqQueryType,
    searchModalQueryTermIds,
    searchModalQueryDocIds,
    searchModalQueriesFaqGroupIds,
    // AI Search Suggestions attributes
    enable_ai_powered_search,
    ai_suggestion_background_color,
    ai_suggestion_hover_background_color,
    ai_suggestion_title_color,
    ai_suggestion_query_color,
    ai_suggestion_response_color,
    ai_suggestion_button_color,
    ai_suggestion_button_bg_color
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

	const isAISearchEnabled = () => {
		try {
			// Safety check for window object
			if (typeof window === 'undefined') {
				return false;
			}

			if (typeof window.betterDocsBlocksHelper !== 'undefined' && window.betterDocsBlocksHelper) {
				// Use the combined flag for simplicity (handle both boolean and numeric values)
				return window.betterDocsBlocksHelper.AI_SEARCH_SUGGESTIONS_ENABLED == true ||
					   window.betterDocsBlocksHelper.AI_SEARCH_SUGGESTIONS_ENABLED === 1;
			}

			return false;
		} catch (error) {
			return false;
		}
	};

  return (
    <InspectorControls key="controls">
      <div className="eb-panel-control">
        <TabPanel
          className="eb-parent-tab-panel"
          activeClass="active-tab"
          tabs={[
            {
                name:"general",
                title:__('General', 'betterdocs'),
                className:"eb-tab style"
            },
            {
              name: "style",
              title: __("Style", "betterdocs"),
              className: "eb-tab style",
            }
          ]}
        >
          {(tab) => (
            <div className={"eb-tab-controls " + tab.name}>
              {tab.name == 'general' && (
                <>
                    <PanelBody
                        title={__("General", "betterdocs")}
                        initialOpen={true}
                    >
                        <SelectControl
                            label={__("Select layout", "betterdocs")}
                            value={searchLayout}
                            options={SEARCH_LAYOUT_VALUES}
                            onChange={(newLayout) =>
                                setAttributes({
                                    searchLayout: newLayout,
                                })
                            }
                        />
                        {searchLayout == 'layout-2' && (
                            <>
                                <SelectControl
                                    label={__("Search Modal Layout", "betterdocs")}
                                    value={searchModalLayout}
                                    options={SEARCH_MODAL_LAYOUT_VALUES}
                                    onChange={(newLayout) =>
                                        setAttributes({
                                            searchModalLayout: newLayout,
                                        })
                                    }
                                />
                                {(searchModalLayout === 'docs-archive' || searchModalLayout === 'sidebar') && (
                                    <>
                                        <RangeControl
                                            label={__("Width (%)", "betterdocs")}
                                            value={searchModalWidth}
                                            onChange={(value) =>
                                                setAttributes({
                                                    searchModalWidth: value,
                                                })
                                            }
                                            min={10}
                                            max={100}
                                            step={1}
                                        />
                                        <SelectControl
                                            label={__("Position", "betterdocs")}
                                            value={searchModalPosition}
                                            options={[
                                                { label: __("Left", "betterdocs"), value: "left" },
                                                { label: __("Right", "betterdocs"), value: "right" },
                                            ]}
                                            onChange={(value) =>
                                                setAttributes({
                                                    searchModalPosition: value,
                                                })
                                            }
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </PanelBody>
                    {searchLayout == 'layout-2' &&
                            <PanelBody
                                title={__("Modal Query", "betterdocs")}
                                initialOpen={false}
                            >
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
                                value={initialDocsNumber}
                                onChange={(value) => {
                                    setAttributes({
                                        initialDocsNumber: parseInt(value),
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
                            {
                                docQueryType == 'specific-doc-term-ids' &&  <TextControl
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
                                label={__("Number of FAQ's", "betterdocs")}
                                type="number"
                                value={initialFAQNumber}
                                onChange={(value) => {
                                    setAttributes({
                                        initialFAQNumber: parseInt(value),
                                    });
                                }}
                            />}
                            {faqQueryType == 'specific-faq-group-ids' &&
                                <TextControl
                                    label={__("Faq Group Id's", "betterdocs")}
                                    type="text"
                                    value={searchModalQueriesFaqGroupIds}
                                    placeholder={__('E.g: 5, 6')}
                                    onChange={(value) => {
                                        setAttributes({
                                            searchModalQueriesFaqGroupIds: value,
                                        });
                                    }}
                                />
                            }
                            <Notice status="info" isDismissible={false}>
                                {__(
                                    "Please note that these query changes will be applicable on the front end only",
                                    "betterdocs"
                                )}
                            </Notice>
                            </PanelBody>
                    }
                    <PanelBody
                        title={__("Search Content", "betterdocs")}
                        initialOpen={false}
                    >
					{(searchLayout == 'layout-1' || (searchLayout == 'layout-2' && searchModalLayout == 'layout-1')) && (
						<><TextControl
							label={__("Search Heading", "betterdocs")}
							value={searchHeading}
							onChange={(value) => {
								setAttributes({
									searchHeading: value,
								});
							}}
						/>
						<TextControl
							label={__("Search Sub Heading", "betterdocs")}
							value={searchSubHeading}
							onChange={(value) => {
								setAttributes({
									searchSubHeading: value,
								});
							}}
						/>
						<SelectControl
							label={__("Heading Tag", "betterdocs")}
							value={attributes.searchHeadingTag}
							options={HTML_TAGS}
							onChange={(value) => {
								setAttributes({
									searchHeadingTag: value,
								});
							}}
						/>
						<SelectControl
							label={__("Subheading Tag", "betterdocs")}
							value={attributes.searchSubHeadingTag}
							options={HTML_TAGS}
							onChange={(value) => {
								setAttributes({
									searchSubHeadingTag: value,
								});
							}}
						/></>
					)}
                    {searchLayout == 'layout-2' && applyFilters('advancedSearchModal', '', [setAttributes, attributes, resOption, objAttributes])}
                    </PanelBody>
                </>
              )}
              {tab.name === "style" && (
                <>
				  {(searchLayout == 'layout-1' || (searchLayout == 'layout-2' && searchModalLayout == 'layout-1')) && (
                  <PanelBody title={__("Search Box", "betterdocs")} initialOpen={true}>
                    <>
                      <BaseControl>
                        <h3 className="eb-control-title">
                          {__("Background", "betterdocs")}
                        </h3>
                      </BaseControl>
                      <BackgroundControl
                        controlName={searchLayout == 'layout-1' ? BOX_BACKGROUND : BOX_BACKGROUND_LAYOUT_2}
                        resRequiredProps={resRequiredProps}
                        noOverlay={true}
                      />
                      <ResponsiveDimensionsControl
                        baseLabel={__("Padding", "betterdocs")}
                        resRequiredProps={resRequiredProps}
                        controlName={searchLayout == 'layout-1' ? BOX_PADDING : BOX_PADDING_LAYOUT_2}
                      />
                    <ResponsiveDimensionsControl
                        baseLabel={__("Margin", "betterdocs")}
                        resRequiredProps={resRequiredProps}
                        controlName={searchLayout == 'layout-1' ? WRAPPER_MARGIN : WRAPPER_MARGIN_LAYOUT_2}
                    />
                    </>
                  </PanelBody>
				  )}
                  <PanelBody
                    title={__("Search Field", "betterdocs")}
                    initialOpen={false}
                  >
                    <>
                      <TextControl
                        label={__("Placeholder", "betterdocs")}
                        value={placeholderText}
                        onChange={(value) => {
                          setAttributes({
                            placeholderText: value,
                          });
                        }}
                      />
                      <ColorControl
                        label={__("Field Background Color", "betterdocs")}
                        color={searchLayout == 'layout-1' ? fieldBackgroundColor : fieldBackgroundColorLayout2}
                        onChange={(value) => {
                            if( searchLayout == 'layout-1' ) {
                                setAttributes({
                                    fieldBackgroundColor:value
                                })
                            } else {
                                setAttributes({
                                    fieldBackgroundColorLayout2:value
                                })
                            }
                        }}
                      />
                      <ColorControl
                        label={__("Text Color", "betterdocs")}
                        color={searchLayout == 'layout-1' ? fieldTextColor : fieldTextColorLayout2}
                        onChange={(value) =>{
                            if( searchLayout == 'layout-1' ){
                                setAttributes({
                                    fieldTextColor:value
                                })
                            } else {
                                setAttributes({
                                    fieldTextColorLayout2:value
                                })
                            }
                        }}
                      />
                      <TypographyDropdown
                        baseLabel={__("Typography", "betterdocs")}
                        typographyPrefixConstant={searchLayout == 'layout-1' ? typoPrefix_fieldtext : typoPrefix_fieldtext_layout_2}
                        resRequiredProps={resRequiredProps}
                        defaultFontSize={14}
                      />
                      <ResponsiveDimensionsControl
                        baseLabel={__("Field Padding", "betterdocs")}
                        resRequiredProps={resRequiredProps}
                        controlName={searchLayout == 'layout-1' ? FIELD_PADDING : FIELD_PADDING_LAYOUT_2}
                      />
                      <BaseControl>
                        <h3 className="eb-control-title">
                          {__("Border", "betterdocs")}
                        </h3>
                      </BaseControl>
                      <BorderShadowControl
                        controlName={ searchLayout == 'layout-1' ? FIELD_BORDER : FIELD_BORDER_LAYOUT_2}
                        resRequiredProps={resRequiredProps}
                        noShadow={true}
                      />
                      <hr />
                      <BaseControl>
                        <h3 className="eb-control-title">
                          {__("Search Icon", "betterdocs")}
                        </h3>
                      </BaseControl>
                      <ColorControl
                        label={__("Color", "betterdocs")}
                        color={searchLayout == 'layout-1' ? searchIconColor : searchIconColorLayout2}
                        onChange={(value) => {
                            if( searchLayout == 'layout-1' ) {
                                setAttributes({
                                    searchIconColor:value
                                })
                            } else {
                                setAttributes({
                                    searchIconColorLayout2:value
                                })
                            }
                        }}
                      />
                      <ResponsiveRangeController
                        baseLabel={__("Icon Size", "betterdocs")}
                        controlName={searchLayout == 'layout-1' ? ICON_SIZE : ICON_SIZE_LAYOUT_2}
                        resRequiredProps={resRequiredProps}
                        min={1}
                        max={500}
                        step={1}
                      />
                      {searchLayout != 'layout-2' && <><BaseControl>
                        <h3 className="eb-control-title">
                          {__("Close Icon", "betterdocs")}
                        </h3>
                      </BaseControl>
                      <ColorControl
                        label={__("Color", "betterdocs")}
                        color={closeIconColor}
                        onChange={(closeIconColor) =>
                          setAttributes({
                            closeIconColor,
                          })
                        }
                      />
                      <ColorControl
                        label={__("Border Color", "betterdocs")}
                        color={closeBorderColor}
                        onChange={(closeBorderColor) =>
                          setAttributes({
                            closeBorderColor,
                          })
                        }
                      /></>}
                    </>
                  </PanelBody>
                  {searchLayout == 'layout-2' && (
                        <>
						{/* AI Search Suggestions Panel - Only show if AI Chatbot is enabled */}
						{isAISearchEnabled() && (
							<PanelBody
								title={__("AI-Powered Smart Modal Search", "betterdocs")}
								initialOpen={false}
							>
								<ToggleControl
									label={__("Enable AI Search Suggestions", "betterdocs")}
									checked={!!enable_ai_powered_search}
									onChange={(value) => setAttributes && setAttributes({ enable_ai_powered_search: !!value })}
									__nextHasNoMarginBottom={true}
								/>

								{enable_ai_powered_search && (
									<>
										<ColorControl
											label={__("Background Color", "betterdocs")}
											color={ai_suggestion_background_color}
											onChange={(value) => {
												setAttributes && setAttributes({ ai_suggestion_background_color: value });
											}}
										/>

										<ColorControl
											label={__("Hover Background Color", "betterdocs")}
											color={ai_suggestion_hover_background_color}
											onChange={(value) => {
												setAttributes && setAttributes({ ai_suggestion_hover_background_color: value });
											}}
										/>

										<ResponsiveDimensionsControl
											baseLabel={__("Margin", "betterdocs")}
											controlName={AI_SUGGESTION_MARGIN}
											resRequiredProps={resRequiredProps}
										/>
										<ResponsiveDimensionsControl
											baseLabel={__("Padding", "betterdocs")}
											controlName={AI_SUGGESTION_PADDING}
											resRequiredProps={resRequiredProps}
										/>

										<BaseControl>
											<h3 className="eb-control-title">
												{__("Title", "betterdocs")}
											</h3>
										</BaseControl>

										<TypographyDropdown
											baseLabel={__("Title Typography", "betterdocs")}
											typographyPrefixConstant={AI_SUGGESTION_TITLE_TYPO}
											resRequiredProps={resRequiredProps}
										/>

										<ColorControl
											label={__("Title Color", "betterdocs")}
											color={ai_suggestion_title_color}
											onChange={(value) => {
												setAttributes && setAttributes({ ai_suggestion_title_color: value });
											}}
										/>

										<BaseControl>
											<h3 className="eb-control-title">
												{__("Query", "betterdocs")}
											</h3>
										</BaseControl>

										<TypographyDropdown
											baseLabel={__("Query Typography", "betterdocs")}
											typographyPrefixConstant={AI_SUGGESTION_QUERY_TYPO}
											resRequiredProps={resRequiredProps}
										/>

										<ColorControl
											label={__("Query Text Color", "betterdocs")}
											color={ai_suggestion_query_color}
											onChange={(value) => {
												setAttributes && setAttributes({ ai_suggestion_query_color: value });
											}}
										/>

										<BaseControl>
											<h3 className="eb-control-title">
												{__("Response", "betterdocs")}
											</h3>
										</BaseControl>

										<TypographyDropdown
											baseLabel={__("Response Typography", "betterdocs")}
											typographyPrefixConstant={AI_SUGGESTION_RESPONSE_TYPO}
											resRequiredProps={resRequiredProps}
										/>

										<ColorControl
											label={__("Response Text Color", "betterdocs")}
											color={ai_suggestion_response_color}
											onChange={(value) => {
												setAttributes && setAttributes({ ai_suggestion_response_color: value });
											}}
										/>

										<BaseControl>
											<h3 className="eb-control-title">
												{__("Continue Chat Button", "betterdocs")}
											</h3>
										</BaseControl>

										<TypographyDropdown
											baseLabel={__("Button Typography", "betterdocs")}
											typographyPrefixConstant={AI_SUGGESTION_BUTTON_TYPO}
											resRequiredProps={resRequiredProps}
										/>

										<ColorControl
											label={__("Button Text Color", "betterdocs")}
											color={ai_suggestion_button_color}
											onChange={(value) => {
												setAttributes && setAttributes({ ai_suggestion_button_color: value });
											}}
										/>

										<ColorControl
											label={__("Button Background Color", "betterdocs")}
											color={ai_suggestion_button_bg_color}
											onChange={(value) => {
												setAttributes && setAttributes({ ai_suggestion_button_bg_color: value });
											}}
										/>

										<ResponsiveDimensionsControl
											baseLabel={__("Button Padding", "betterdocs")}
											controlName={AI_SUGGESTION_BUTTON_PADDING}
											resRequiredProps={resRequiredProps}
										/>

										<ResponsiveDimensionsControl
											baseLabel={__("Button Margin", "betterdocs")}
											controlName={AI_SUGGESTION_BUTTON_MARGIN}
											resRequiredProps={resRequiredProps}
										/>
									</>
								)}
							</PanelBody>
						)}
                        <PanelBody
                            title={__("Search Modal", "betterdocs")}
                            initialOpen={false}
                        >
                        <BaseControl>
                            <h3 className="eb-control-title">
                                {__("Search Field", "betterdocs")}
                            </h3>
                        </BaseControl>
                        <ColorControl
                            label={__("Magnifier Color", "betterdocs")}
                            color={searchModalMagnifierColor}
                            onChange={(value) => {
                                setAttributes({searchModalMagnifierColor:value})
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
                            color={searchModalFieldColor}
                            onChange={(value) => {
                                setAttributes({searchModalFieldColor:value})
                            }}
                        />
                        <ColorControl
                            label={__("Field Placeholder Color", "betterdocs")}
                            color={searchModalFieldPlaceholderColor}
                            onChange={(value) => {
                                setAttributes({searchModalFieldPlaceholderColor:value})
                            }}
                        />
                        <BaseControl>
                            <h3 className="eb-control-title">
                                {__("Search Category", "betterdocs")}
                            </h3>
                        </BaseControl>
                        <ColorControl
                            label={__("Color", "betterdocs")}
                            color={searchModalCategoryColor}
                            onChange={(value) => {
                                setAttributes({searchModalCategoryColor:value})
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
                            baseLabel={__("Icon Size", "betterdocs")}
                            controlName={SEARCH_MODAL_CONTENT_TABS_ICON_SIZE}
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
                            color={searchModalContentTabsListColor}
                            onChange={(value) => {
                                setAttributes({searchModalContentTabsListColor:value})
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
                            color={searchModalContentTabsListCategoryColor}
                            onChange={(value) => {
                                setAttributes({searchModalContentTabsListCategoryColor:value})
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
                    <PanelBody
                            title={__("Search Button", "betterdocs")}
                            initialOpen={false}
                    >
                        <ColorControl
                            label={__("Color", "betterdocs")}
                            color={searchButtonLayout2Color}
                            onChange={(value) => {
                                setAttributes({searchButtonLayout2Color:value})
                            }}
                        />
                        <BackgroundControl
                            controlName={SEARCH_BUTTON_BACKGROUND_LAYOUT_2}
                            resRequiredProps={resRequiredProps}
                            noOverlay={true}
                        />
                        <TypographyDropdown
                            baseLabel={__("Typography", "betterdocs")}
                            typographyPrefixConstant={SEARCH_BUTTON_LAYOUT_2_TYPO}
                            resRequiredProps={resRequiredProps}
                        />
                    </PanelBody>
                    </>
                  )}
                  {searchLayout != 'layout-2' && <PanelBody
                    title={__("Search Result Box", "betterdocs")}
                    initialOpen={false}
                  >
                    <ResponsiveRangeController
                      baseLabel={__("Width", "betterdocs")}
                      controlName={RESULT_BOX_WIDTH}
                      resRequiredProps={resRequiredProps}
                      min={1}
                      max={100}
                      step={1}
                    />
                    <ResponsiveRangeController
                      baseLabel={__("Max Width", "betterdocs")}
                      controlName={RESULT_BOX_MAXWIDTH}
                      resRequiredProps={resRequiredProps}
                      min={1}
                      max={1600}
                      step={1}
                    />
                    <BaseControl>
                      <h3 className="eb-control-title">
                        {__("Background", "betterdocs")}
                      </h3>
                    </BaseControl>
                    <BackgroundControl
                      controlName={RESULT_BOX_BACKGROUND}
                      resRequiredProps={resRequiredProps}
                      noOverlay={true}
                    />
                    <BaseControl>
                      <h3 className="eb-control-title">
                        {__("Border", "betterdocs")}
                      </h3>
                    </BaseControl>
                    <BorderShadowControl
                      controlName={RESULT_BOX_BORDER}
                      noShadow={true}
                      resRequiredProps={resRequiredProps}
                    />
                  </PanelBody>}
                  {searchLayout != 'layout-2' && <PanelBody
                    title={__("Search Result List", "betterdocs")}
                    initialOpen={false}
                  >
                    <TypographyDropdown
                      baseLabel={__("Typography", "betterdocs")}
                      typographyPrefixConstant={typoPrefix_resulttext}
                      resRequiredProps={resRequiredProps}
                    />
                    <ColorControl
                      label={__("Item Color", "betterdocs")}
                      color={itemColor}
                      onChange={(itemColor) =>
                        setAttributes({
                          itemColor,
                        })
                      }
                    />
                    <ColorControl
                      label={__("Item Hover Color", "betterdocs")}
                      color={itemHoverColor}
                      onChange={(itemHoverColor) =>
                        setAttributes({
                          itemHoverColor,
                        })
                      }
                    />
                    <ResponsiveDimensionsControl
                      baseLabel={__("Padding", "betterdocs")}
                      resRequiredProps={resRequiredProps}
                      controlName={ITEM_PADDING}
                    />
                    <BaseControl>
                      <h3 className="eb-control-title">
                        {__("Border", "betterdocs")}
                      </h3>
                    </BaseControl>
                    <BorderShadowControl
                      controlName={ITEM_BORDER}
                      noShadow={true}
                      resRequiredProps={resRequiredProps}
                    />
                  </PanelBody>}
                  {searchLayout != 'layout-2' && applyFilters('advancedSearchPanel', '', [setAttributes, attributes, resOption, objAttributes])}
                </>
              )}
              {/* {tab.name === "advance" && (
                <PanelBody>
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

export default Inspector;
