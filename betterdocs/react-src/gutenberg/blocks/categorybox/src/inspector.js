/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { applyFilters } from "@wordpress/hooks";
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, BaseControl, ToggleControl, SelectControl, TabPanel } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { select, withSelect } from '@wordpress/data';

/**
 * Internal depencencies
 */

import objAttributes from "./attributes";
import { ORDER_BY, ORDER, LAYOUT, BOX_BACKGROUND, LAST_UPDATED_BACKGROUND_COLOR_LAYOUT_4, LAST_UPDATED_PADDING, LAST_UPDATED_MARGIN, WRAPPER_PADDING, ICON_IMAGE_WIDTH_LAYOUT_4, ICON_IMAGE_HEIGHT_LAYOUT_4 } from "./constants";
import Select from "react-select";

import {
    COLUMNS,
    HTML_TAGS,
    BOX_MARGIN,
    BOX_PADDING,
    BOX_BORDER,
    TITLE_MARGIN,
    COUNT_MARGIN,
    ICON_AREA,
    ICON_SIZE,
    ICON_BACKGROUND,
    ICON_BORDER,
    ICON_PADDING,
    ICON_MARGIN,
    WRAPPER_MARGIN,
    COLUMNS_LAYOUT_4,
    BOX_MARGIN_LAYOUT_4,
    BOX_PADDING_LAYOUT_4,
    BOX_BORDER_LAYOUT_4,
    TITLE_MARGIN_LAYOUT_4,
    COUNT_MARGIN_LAYOUT_4,
    ICON_AREA_LAYOUT_4,
    ICON_SIZE_LAYOUT_4,
    ICON_BACKGROUND_LAYOUT_4,
    BOX_BACKGROUND_LAYOUT_4,
    ICON_BORDER_LAYOUT_4,
    ICON_PADDING_LAYOUT_4,
    ICON_MARGIN_LAYOUT_4,
    WRAPPER_MARGIN_LAYOUT_4,
    CONTAINER_SECTION_MARGIN_LAYOUT_4,
    CONTAINER_SECTION_PADDING_LAYOUT_4,
    CONTAINER_SECTION_BACKGROUND_LAYOUT_4
} from "./constants";
import {
    typoPrefix_title,
    typoPrefix_count,
    typoPrefix_title_layout_4,
    typoPrefix_count_layout_4,
    typoPrefix_last_updated_time
} from "./typographyPrefixConstants";

import ResponsiveRangeController from "../../../util/responsive-range-control";
import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";
import TypographyDropdown from "../../../util/typography-control-v2";
import BackgroundControl from "../../../util/background-control";
import BorderShadowControl from "../../../util/border-shadow-control";
import ColorControl from "../../../util/color-control";
import { RangeControl } from '@wordpress/components';

const Inspector = ({ docCategories, attributes, setAttributes }) => {
    const {
        resOption,
        includeCategories,
        excludeCategories,
        boxPerPage,
        orderBy,
        order,
        layout,
        showIcon,
        showTitle,
        titleTag,
        showCount,
        showLastUpdatedTime,
        prefix,
        suffix,
        suffixSingular,
        titleColor,
        titleColorLayout4,
        titleHoverColor,
        titleHoverColorLayout4,
        countColor,
        countColorLayout4,
        countHoverColor,
        countHoverColorLayout4,
        lastUpdatedTimeColor,
        lastUpdatedTimeHoverColor,
        layout4Col
    } = attributes;

    const editorStoreForGettingPreivew =
        betterdocs_style_handler.editor_type === "edit-site"
            ? "core/edit-site"
            : "core/edit-post";

    useEffect(() => {
        // this is for setting the resOption attribute to desktop/tab/mobile depending on the added 'eb-res-option-' class only the first time once
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
                        <div className={"eb-tab-controls " + tab.name}>
                            {tab.name === "general" && (
                                <>
                                    <PanelBody title={__("Query", "better-docs")}>
                                        <>
                                            {applyFilters("selectKnowledgeBase", '', attributes, setAttributes)}
                                            <BaseControl>
                                                <h3 className="eb-control-title">
                                                    {__("Include", "better-docs")}
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
                                                label={__("Box Per Page", "betterdocs")}
                                                type="number"
                                                value={boxPerPage}
                                                onChange={(value) => {
                                                    setAttributes({
                                                        boxPerPage: parseInt(value),
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
                                                __next40pxDefaultSize
                                                __nextHasNoMarginBottom
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
                                                __next40pxDefaultSize
                                                __nextHasNoMarginBottom
                                            />}
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
                                                __next40pxDefaultSize
                                                __nextHasNoMarginBottom
                                            />
                                            {layout != 'layout-4' && <ResponsiveRangeController
                                                baseLabel={__("Box Column", "betterdocs")}
                                                controlName={COLUMNS}
                                                resRequiredProps={resRequiredProps}
                                                min={1}
                                                max={6}
                                                step={1}
                                                noUnits
                                            />}
                                            {
                                                layout == 'layout-4' && <RangeControl
                                                                            label="Columns"
                                                                            value={ layout4Col }
                                                                            onChange={ ( layout4Col ) => {
                                                                                setAttributes( {layout4Col} )
                                                                            }}
                                                                            min={ 2 }
                                                                            max={ 5 }
                                                                        />
                                            }
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
                                                __next40pxDefaultSize
                                                __nextHasNoMarginBottom
                                            />
                                            {layout == 'layout-4' &&
                                                <ToggleControl
                                                     label={__("Show Last Updated Time", "betterdocs")}
                                                     checked={showLastUpdatedTime}
                                                     onChange={() => {
                                                         setAttributes({
                                                            showLastUpdatedTime: !showLastUpdatedTime,
                                                         });
                                                     }}
                                                 />
                                            }
                                            <ToggleControl
                                                label={__("Show Count", "betterdocs")}
                                                checked={showCount}
                                                onChange={() => {
                                                    setAttributes({
                                                        showCount: !showCount,
                                                    });
                                                }}
                                            />
                                            {layout === "default" && showCount && (
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
                                            )}
                                        </>
                                    </PanelBody>
                                </>
                            )}
                            {tab.name === "styles" && (
                                <>
                                    <PanelBody
                                        title={__("Wrapper", "betterdocs")}
                                        initialOpen={true}
                                    >
                                        <ResponsiveDimensionsControl
                                            baseLabel={__("Margin", "betterdocs")}
                                            resRequiredProps={resRequiredProps}
                                            controlName={WRAPPER_MARGIN}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__("Padding", "betterdocs")}
                                            resRequiredProps={resRequiredProps}
                                            controlName={WRAPPER_PADDING}
                                        />
                                    </PanelBody>
                                    <PanelBody title={__("Box", "betterdocs")} initialOpen={false}>
                                        <ResponsiveDimensionsControl
                                            baseLabel={__("Margin", "betterdocs")}
                                            resRequiredProps={resRequiredProps}
                                            controlName={layout != 'layout-4' ? BOX_MARGIN : BOX_MARGIN_LAYOUT_4}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__("Padding", "betterdocs")}
                                            resRequiredProps={resRequiredProps}
                                            controlName={layout != 'layout-4' ? BOX_PADDING : BOX_PADDING_LAYOUT_4}
                                        />
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Background", "betterdocs")}
                                            </h3>
                                        </BaseControl>
                                        <BackgroundControl
                                            controlName={layout != 'layout-4' ? BOX_BACKGROUND : BOX_BACKGROUND_LAYOUT_4}
                                            resRequiredProps={resRequiredProps}
                                            noOverlay={true}
                                        />
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Border", "betterdocs")}
                                            </h3>
                                        </BaseControl>
                                        <BorderShadowControl
                                            controlName={layout != 'layout-4' ? BOX_BORDER : BOX_BORDER_LAYOUT_4}
                                            resRequiredProps={resRequiredProps}
                                        />
                                    </PanelBody>
                                    <PanelBody
                                        title={__("Icon", "betterdocs")}
                                        initialOpen={false}
                                    >
                                        <>
                                            <ResponsiveRangeController
                                                baseLabel={__("Icon Area", "betterdocs")}
                                                controlName={layout != 'layout-4' ? ICON_AREA : ICON_AREA_LAYOUT_4}
                                                resRequiredProps={resRequiredProps}
                                                min={1}
                                                max={500}
                                                step={1}
                                            />
                                            <ResponsiveRangeController
                                                baseLabel={__("Icon Size", "betterdocs")}
                                                controlName={layout != 'layout-4' ? ICON_SIZE : ICON_SIZE_LAYOUT_4}
                                                resRequiredProps={resRequiredProps}
                                                min={1}
                                                max={500}
                                                step={1}
                                            />
                                            {layout == 'layout-4' && <><ResponsiveRangeController
                                                baseLabel={__("Icon Image Width", "betterdocs")}
                                                controlName={ICON_IMAGE_WIDTH_LAYOUT_4}
                                                resRequiredProps={resRequiredProps}
                                                min={1}
                                                max={500}
                                                step={1}
                                            />
                                            <ResponsiveRangeController
                                                baseLabel={__("Icon Image Height", "betterdocs")}
                                                controlName={ICON_IMAGE_HEIGHT_LAYOUT_4}
                                                resRequiredProps={resRequiredProps}
                                                min={1}
                                                max={500}
                                                step={1}
                                            /></>}
                                            <BaseControl>
                                                <h3 className="eb-control-title">
                                                    {__("Background", "betterdocs")}
                                                </h3>
                                            </BaseControl>
                                            <BackgroundControl
                                                controlName={layout != 'layout-4' ? ICON_BACKGROUND : ICON_BACKGROUND_LAYOUT_4}
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
                                                controlName={layout != 'layout-4' ? ICON_BORDER : ICON_BORDER_LAYOUT_4}
                                                resRequiredProps={resRequiredProps}
                                                noShadow={true}
                                            />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__("Padding", "betterdocs")}
                                                resRequiredProps={resRequiredProps}
                                                controlName={layout != 'layout-4' ? ICON_PADDING : ICON_PADDING_LAYOUT_4}
                                            />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__("Margin", "betterdocs")}
                                                resRequiredProps={resRequiredProps}
                                                controlName={layout != 'layout-4' ? ICON_MARGIN : ICON_MARGIN_LAYOUT_4}
                                            />
                                        </>
                                    </PanelBody>
                                    <PanelBody
                                        title={__("Title", "betterdocs")}
                                        initialOpen={false}
                                    >
                                        <TypographyDropdown
                                            baseLabel={__("Typography", "betterdocs")}
                                            typographyPrefixConstant={layout != 'layout-4' ? typoPrefix_title : typoPrefix_title_layout_4}
                                            resRequiredProps={resRequiredProps}
                                            defaultFontSize={20}
                                        />
                                        <ColorControl
                                            label={__("Color", "betterdocs")}
                                            color={layout != 'layout-4' ? titleColor : titleColorLayout4}
                                            onChange={(titleColor) => {
                                                    if( layout != 'layout-4' ) {
                                                        setAttributes({ titleColor:titleColor });
                                                    } else {
                                                        setAttributes({ titleColorLayout4:titleColor });
                                                    }
                                                }
                                            }
                                        />
                                        <ColorControl
                                            label={__("Hover Color", "betterdocs")}
                                            color={layout != 'layout-4' ? titleHoverColor : titleHoverColorLayout4}
                                            onChange={(titleHoverColor) => {
                                                if( layout != 'layout-4' ) {
                                                    setAttributes({
                                                        titleHoverColor:titleHoverColor,
                                                    })
                                                } else {
                                                    setAttributes({
                                                        titleHoverColorLayout4:titleHoverColor,
                                                    })
                                                }
                                            }}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__("Spacing", "betterdocs")}
                                            resRequiredProps={resRequiredProps}
                                            controlName={layout != 'layout-4' ? TITLE_MARGIN : TITLE_MARGIN_LAYOUT_4}
                                        />
                                    </PanelBody>
                                    <PanelBody
                                        title={__("Count", "betterdocs")}
                                        initialOpen={false}
                                    >
                                        <TypographyDropdown
                                            baseLabel={__("Typography", "betterdocs")}
                                            typographyPrefixConstant={layout != 'layout-4' ? typoPrefix_count : typoPrefix_count_layout_4}
                                            resRequiredProps={resRequiredProps}
                                            defaultFontSize={15}
                                        />
                                        <ColorControl
                                            label={__("Color", "betterdocs")}
                                            color={layout != 'layout-4' ? countColor : countColorLayout4}
                                            onChange={(countColor) => {
                                                if( layout != 'layout-4' ) {
                                                    setAttributes({ countColor:countColor });
                                                } else {
                                                    setAttributes({ countColorLayout4:countColor });
                                                }
                                            }}
                                        />
                                        <ColorControl
                                            label={__("Hover Color", "betterdocs")}
                                            color={layout != 'layout-4' ? countHoverColor : countHoverColorLayout4}
                                            onChange={(countHoverColor) => {
                                                if( layout != 'layout-4' ){
                                                    setAttributes({
                                                        countHoverColor:countHoverColor,
                                                    });
                                                } else {
                                                    setAttributes({
                                                        countHoverColorLayout4:countHoverColor,
                                                    });
                                                }
                                            }}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__("Spacing", "betterdocs")}
                                            resRequiredProps={resRequiredProps}
                                            controlName={layout != 'layout-4' ? COUNT_MARGIN : COUNT_MARGIN_LAYOUT_4}
                                        />
                                    </PanelBody>
                                    {layout == 'layout-4' &&
                                        <PanelBody
                                            title={__("Last Updated Time", "betterdocs")}
                                            initialOpen={false}
                                        >
                                        <TypographyDropdown
                                            baseLabel={__("Typography", "betterdocs")}
                                            typographyPrefixConstant={typoPrefix_last_updated_time}
                                            resRequiredProps={resRequiredProps}
                                            defaultFontSize={12}
                                        />
                                        <ColorControl
                                            label={__("Color", "betterdocs")}
                                            color={lastUpdatedTimeColor}
                                            onChange={(lastUpdatedTimeColor) => {
                                                setAttributes({ lastUpdatedTimeColor:lastUpdatedTimeColor });
                                            }}
                                        />
                                        <ColorControl
                                            label={__("Hover Color", "betterdocs")}
                                            color={lastUpdatedTimeHoverColor}
                                            onChange={(lastUpdatedTimeHoverColor) => {
                                                setAttributes({
                                                    lastUpdatedTimeHoverColor:lastUpdatedTimeHoverColor,
                                                });
                                            }}
                                        />
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Background", "betterdocs")}
                                            </h3>
                                        </BaseControl>
                                        <BackgroundControl
                                            controlName={LAST_UPDATED_BACKGROUND_COLOR_LAYOUT_4}
                                            resRequiredProps={resRequiredProps}
                                            noOverlay={true}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__("Padding", "betterdocs")}
                                            resRequiredProps={resRequiredProps}
                                            controlName={LAST_UPDATED_PADDING}
                                        />
                                         <ResponsiveDimensionsControl
                                            baseLabel={__("Margin", "betterdocs")}
                                            resRequiredProps={resRequiredProps}
                                            controlName={LAST_UPDATED_MARGIN}
                                        />
                                    </PanelBody>
                                 }
                                </>
                            )}
                            {/* {tab.name === "advance" && (

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
