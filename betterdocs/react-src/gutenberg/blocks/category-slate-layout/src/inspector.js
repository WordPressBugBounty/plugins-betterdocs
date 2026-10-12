import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    ToggleControl,
    RangeControl,
    TabPanel,
    BaseControl,
} from '@wordpress/components';
import { withSelect } from '@wordpress/data';

import {
    ORDER_BY_OPTIONS,
    ORDER_OPTIONS,
    POSTS_ORDER_BY_OPTIONS,
    TITLE_TAG_OPTIONS,
} from './constants';

import objAttributes from './attributes';
import Select from "react-select";
import { applyFilters } from "@wordpress/hooks";

import ColorControl from "../../../util/color-control";
import TypographyDropdown from "../../../util/typography-control-v2";
import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";
import BorderShadowControl from "../../../util/border-shadow-control";
import ResponsiveRangeController from "../../../util/responsive-range-control";

import {
    TITLE_TYPOGRAPHY,
    LIST_TYPOGRAPHY,
} from './typographyPrefixConstants';

import {
    CONTAINER_PADDING,
    CONTAINER_MARGIN,
    GRID_PADDING,
    GRID_MARGIN,
    GRID_BORDER,
    GRID_COLUMNS,
    GRID_SPACE,
    TITLE_PADDING,
    TITLE_MARGIN,
    TITLE_BORDER,
    LIST_PADDING,
    LIST_MARGIN,
    LIST_BORDER,
} from './constants';

const Inspector = ({ docCategories, attributes, setAttributes }) => {
    const {
        // Query Options
        selectKB,
        includeCategories,
        excludeCategories,
        gridPerPage,
        offset,
        orderBy,
        order,
        // Grid List Docs Options
        postsPerPage,
        postsOrderBy,
        postsOrder,
        // Layout Options
        showIcon,
        showTitle,
        titleTag,
        categoryTitleLink,
        // Style attributes
        titleColor,
        titleHoverColor,
        listColor,
        listHoverColor,
        containerBgColor,
        gridBgColor,
    } = attributes;

    // Handle include categories
    const handleIncludeCategories = (categories) => {
        setAttributes({
            includeCategories: categories ? JSON.stringify(categories) : null,
        });
    };

    // Handle exclude categories
    const handleExcludeCategories = (categories) => {
        setAttributes({
            excludeCategories: categories ? JSON.stringify(categories) : null,
        });
    };

    // Required props for responsive controls
    const resRequiredProps = {
        setAttributes,
        resOption: attributes.resOption,
        attributes,
        objAttributes,
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
                            className: "eb-tab general"
                        },
                        {
                            name: "styles",
                            title: __("Styles", "betterdocs"),
                            className: "eb-tab styles",
                        }
                    ]}
                >
                    {(tab) => (
                        <div className={"eb-tab-controls " + tab.name}>
                            {tab.name === 'general' && (
                                <>
                                    {/* Query Controls */}
                                    <PanelBody title={__('Query', 'betterdocs')} initialOpen={true}>
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
                                                        label: category.name,
                                                    }),
                                                )
                                            }
                                            isMulti={true}
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
                                                        label: category.name,
                                                    }),
                                                )
                                            }
                                            isMulti={true}
                                        />
                                        <RangeControl
                                            label={__('Box Per Page', 'betterdocs')}
                                            value={gridPerPage}
                                            onChange={(gridPerPage) => setAttributes({ gridPerPage })}
                                            min={1}
                                            max={50}
                                        />
                                        <RangeControl
                                            label={__('Offset', 'betterdocs')}
                                            value={offset}
                                            onChange={(offset) => setAttributes({ offset })}
                                            min={0}
                                            max={50}
                                        />
                                        <SelectControl
                                            label={__('Order by', 'betterdocs')}
                                            value={orderBy}
                                            options={ORDER_BY_OPTIONS}
                                            onChange={(orderBy) => setAttributes({ orderBy })}
                                        />
                                        {orderBy != 'doc_category_order' && <SelectControl
                                            label={__('Order', 'betterdocs')}
                                            value={order}
                                            options={ORDER_OPTIONS}
                                            onChange={(order) => setAttributes({ order })}
                                        />}
                                        <hr />
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                <strong>{__('Grid List Docs', 'betterdocs')}</strong>
                                            </h3>
                                        </BaseControl>
                                        <RangeControl
                                            label={__('Docs Per Page', 'betterdocs')}
                                            value={postsPerPage}
                                            onChange={(postsPerPage) => setAttributes({ postsPerPage })}
                                            min={1}
                                            max={50}
                                        />
                                        <SelectControl
                                            label={__('Order By', 'betterdocs')}
                                            value={postsOrderBy}
                                            options={POSTS_ORDER_BY_OPTIONS}
                                            onChange={(postsOrderBy) => setAttributes({ postsOrderBy })}
                                        />
                                         {postsOrderBy != 'betterdocs_order' && <SelectControl
                                            label={__('Order', 'betterdocs')}
                                            value={postsOrder}
                                            options={ORDER_OPTIONS}
                                            onChange={(postsOrder) => setAttributes({ postsOrder })}
                                        />}
                                    </PanelBody>

                                    {/* Layout Options */}
                                    <PanelBody title={__('Layout Options', 'betterdocs')} initialOpen={false}>
                                        <ResponsiveRangeController
                                            baseLabel={__('Grid Column', 'betterdocs')}
                                            controlName={GRID_COLUMNS}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={6}
                                            step={1}
                                            noUnits
                                        />
                                        <ResponsiveRangeController
                                            baseLabel={__('Grid Space', 'betterdocs')}
                                            controlName={GRID_SPACE}
                                            resRequiredProps={resRequiredProps}
                                            min={0}
                                            max={100}
                                            step={1}
                                            noUnits
                                        />
                                        <ToggleControl
                                            label={__('Show Category Icon', 'betterdocs')}
                                            checked={showIcon}
                                            onChange={(showIcon) => setAttributes({ showIcon })}
                                        />
                                        <SelectControl
                                            label={__('Select Tag', 'betterdocs')}
                                            value={titleTag}
                                            options={TITLE_TAG_OPTIONS}
                                            onChange={(titleTag) => setAttributes({ titleTag })}
                                        />
                                        <ToggleControl
                                            label={__('Category Title Link', 'betterdocs')}
                                            checked={categoryTitleLink}
                                            onChange={(categoryTitleLink) => setAttributes({ categoryTitleLink })}
                                        />
                                    </PanelBody>
                                </>
                            )}

                            {tab.name === 'styles' && (
                                <>
                                    {/* Container Style */}
                                    <PanelBody title={__('Container', 'betterdocs')} initialOpen={true}>
                                        <ColorControl
                                            label={__('Background Color', 'betterdocs')}
                                            color={containerBgColor}
                                            onChange={(containerBgColor) => setAttributes({ containerBgColor })}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__('Padding', 'betterdocs')}
                                            resRequiredProps={resRequiredProps}
                                            controlName={CONTAINER_PADDING}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__('Margin', 'betterdocs')}
                                            resRequiredProps={resRequiredProps}
                                            controlName={CONTAINER_MARGIN}
                                        />
                                    </PanelBody>

                                    {/* Grid Style */}
                                    <PanelBody title={__('Grid', 'betterdocs')} initialOpen={false}>
                                        <ColorControl
                                            label={__('Background Color', 'betterdocs')}
                                            color={gridBgColor}
                                            onChange={(gridBgColor) => setAttributes({ gridBgColor })}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__('Padding', 'betterdocs')}
                                            resRequiredProps={resRequiredProps}
                                            controlName={GRID_PADDING}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__('Margin', 'betterdocs')}
                                            resRequiredProps={resRequiredProps}
                                            controlName={GRID_MARGIN}
                                        />
                                        <BorderShadowControl
                                            controlName={GRID_BORDER}
                                            resRequiredProps={resRequiredProps}
                                        />
                                    </PanelBody>

                                    {/* Title Style */}
                                    <PanelBody title={__('Title', 'betterdocs')} initialOpen={false}>
                                        <TypographyDropdown
                                            baseLabel={__('Typography', 'betterdocs')}
                                            typographyPrefixConstant={TITLE_TYPOGRAPHY}
                                            resRequiredProps={resRequiredProps}
                                        />
                                        <ColorControl
                                            label={__('Color', 'betterdocs')}
                                            color={titleColor}
                                            onChange={(titleColor) => setAttributes({ titleColor })}
                                        />
                                        <ColorControl
                                            label={__('Hover Color', 'betterdocs')}
                                            color={titleHoverColor}
                                            onChange={(titleHoverColor) => setAttributes({ titleHoverColor })}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__('Padding', 'betterdocs')}
                                            resRequiredProps={resRequiredProps}
                                            controlName={TITLE_PADDING}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__('Margin', 'betterdocs')}
                                            resRequiredProps={resRequiredProps}
                                            controlName={TITLE_MARGIN}
                                        />
                                        <BorderShadowControl
                                            controlName={TITLE_BORDER}
                                            resRequiredProps={resRequiredProps}
                                        />
                                    </PanelBody>

                                    {/* List Style */}
                                    <PanelBody title={__('List', 'betterdocs')} initialOpen={false}>
                                        <TypographyDropdown
                                            baseLabel={__('Typography', 'betterdocs')}
                                            typographyPrefixConstant={LIST_TYPOGRAPHY}
                                            resRequiredProps={resRequiredProps}
                                        />
                                        <ColorControl
                                            label={__('Color', 'betterdocs')}
                                            color={listColor}
                                            onChange={(listColor) => setAttributes({ listColor })}
                                        />
                                        <ColorControl
                                            label={__('Hover Color', 'betterdocs')}
                                            color={listHoverColor}
                                            onChange={(listHoverColor) => setAttributes({ listHoverColor })}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__('Padding', 'betterdocs')}
                                            resRequiredProps={resRequiredProps}
                                            controlName={LIST_PADDING}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__('Margin', 'betterdocs')}
                                            resRequiredProps={resRequiredProps}
                                            controlName={LIST_MARGIN}
                                        />
                                        <BorderShadowControl
                                            controlName={LIST_BORDER}
                                            resRequiredProps={resRequiredProps}
                                        />
                                    </PanelBody>
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
        docCategories: select("core").getEntityRecords("taxonomy", "doc_category", {
            per_page: 100,
            hide_empty: false,
        }),
    };
})(Inspector);
