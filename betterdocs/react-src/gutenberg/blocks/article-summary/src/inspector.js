import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { BaseControl, ButtonGroup, Button, PanelBody, TabPanel, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import {
    typoPrefix_title,
    typoPrefix_content,
    typoPrefix_loading
} from "./typographyPrefixConstants";

import {
    ARTICLE_SUMMARY_TITLE_MARGIN,
    ARTICLE_SUMMARY_TITLE_PADDING,
    ARTICLE_SUMMARY_CONTENT_MARGIN,
    ARTICLE_SUMMARY_CONTENT_PADDING,
    ARTICLE_SUMMARY_BOX_MARGIN,
    ARTICLE_SUMMARY_BOX_PADDING,
    ARTICLE_SUMMARY_TEXT_ALIGN
} from './constants';

import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";
import ColorControl from "../../../util/color-control";
import TypographyDropdown from "../../../util/typography-control-v2";
import objAttributes from './attributes';

const Inspector = ({attributes, setAttributes}) => {
    const {
        customTitle,
        showTitle,
        titleColor,
		titleBGColor,
        contentColor,
        loadingColor,
        iconColor,
        backgroundColor,
        borderColor,
        borderWidth,
        borderRadius,
        iconSize,
        resOption
    } = attributes;

    const resRequiredProps = {
        setAttributes,
        resOption,
        attributes,
        objAttributes,
    };

    return(
        <InspectorControls key="controls">
            <div className="eb-panel-control">
            <TabPanel
                className="eb-parent-tab-panel"
                activeClass="active-tab"
                tabs={[
                    {
                        name:"general",
                        title:__("General", "betterdocs"),
                        className: "eb-tab general"
                    },
                    {
                    name: "styles",
                    title: __("Styles", "betterdocs"),
                    className: "eb-tab styles",
                    }
                ]}
            >
            {
                (tab) => {
                    return(
                            <div className={"eb-tab-controls " + tab.name}>
                                {tab.name == 'general' &&
                                <PanelBody title={__("Content Settings", "betterdocs")} initialOpen={true}>
                                    <TextControl
                                        label={__("Custom Title", "betterdocs")}
                                        value={customTitle}
                                        onChange={(value) => setAttributes({ customTitle: value })}
                                        placeholder={__("Doc Summary", "betterdocs")}
                                        help={__("Leave empty to use default title", "betterdocs")}
                                    />
                                    <ToggleControl
                                        label={__("Show Title", "betterdocs")}
                                        checked={showTitle}
                                        onChange={(value) => setAttributes({ showTitle: value })}
                                    />
                                </PanelBody>}
                                {tab.name === 'styles' && (
                                    <>
                                        <PanelBody title={__("Title Style", "betterdocs")} initialOpen={false}>
                                            <TypographyDropdown
                                                baseLabel={__("Typography", "betterdocs")}
                                                typographyPrefixConstant={typoPrefix_title}
                                                resRequiredProps={resRequiredProps}
                                                defaultFontSize={16}
                                            />

											<ColorControl
                                                label={__("Background Color", "betterdocs")}
                                                color={titleBGColor}
                                                onChange={(colorValue) => {
                                                    setAttributes({titleBGColor: colorValue})
                                                }}
                                            />

                                            <ColorControl
                                                label={__("Color", "betterdocs")}
                                                color={titleColor}
                                                onChange={(colorValue) => {
                                                    setAttributes({titleColor: colorValue})
                                                }}
                                            />

                                            <ResponsiveDimensionsControl
                                                baseLabel={__("Margin", "betterdocs")}
                                                resRequiredProps={resRequiredProps}
                                                controlName={ARTICLE_SUMMARY_TITLE_MARGIN}
                                            />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__("Padding", "betterdocs")}
                                                resRequiredProps={resRequiredProps}
                                                controlName={ARTICLE_SUMMARY_TITLE_PADDING}
                                            />
                                        </PanelBody>

                                        <PanelBody title={__("Content Style", "betterdocs")} initialOpen={false}>
                                            <TypographyDropdown
                                                baseLabel={__("Typography", "betterdocs")}
                                                typographyPrefixConstant={typoPrefix_content}
                                                resRequiredProps={resRequiredProps}
                                                defaultFontSize={14}
                                            />

                                            <ColorControl
                                                label={__("Text Color", "betterdocs")}
                                                color={contentColor}
                                                onChange={(colorValue) => {
                                                    setAttributes({contentColor: colorValue})
                                                }}
                                            />

                                            <ColorControl
                                                label={__("Loading Text Color", "betterdocs")}
                                                color={loadingColor}
                                                onChange={(colorValue) => {
                                                    setAttributes({loadingColor: colorValue})
                                                }}
                                            />

                                            <ResponsiveDimensionsControl
                                                baseLabel={__("Margin", "betterdocs")}
                                                resRequiredProps={resRequiredProps}
                                                controlName={ARTICLE_SUMMARY_CONTENT_MARGIN}
                                            />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__("Padding", "betterdocs")}
                                                resRequiredProps={resRequiredProps}
                                                controlName={ARTICLE_SUMMARY_CONTENT_PADDING}
                                            />
                                        </PanelBody>

                                        <PanelBody title={__("Icon Style", "betterdocs")} initialOpen={false}>
                                            <ColorControl
                                                label={__("Arrow Color", "betterdocs")}
                                                color={iconColor}
                                                onChange={(colorValue) => {
                                                    setAttributes({iconColor: colorValue})
                                                }}
                                            />

                                            <RangeControl
                                                label={__("Arrow Size", "betterdocs")}
                                                value={iconSize}
                                                onChange={(value) => setAttributes({ iconSize: value })}
                                                min={8}
                                                max={24}
                                            />
                                        </PanelBody>

                                        <PanelBody title={__("Box Style", "betterdocs")} initialOpen={false}>
                                            <ColorControl
                                                label={__("Background Color", "betterdocs")}
                                                color={backgroundColor}
                                                onChange={(colorValue) => {
                                                    setAttributes({backgroundColor: colorValue})
                                                }}
                                            />

                                            <ColorControl
                                                label={__("Border Color", "betterdocs")}
                                                color={borderColor}
                                                onChange={(colorValue) => {
                                                    setAttributes({borderColor: colorValue})
                                                }}
                                            />

                                            <RangeControl
                                                label={__("Border Width", "betterdocs")}
                                                value={borderWidth}
                                                onChange={(value) => setAttributes({ borderWidth: value })}
                                                min={0}
                                                max={10}
                                            />

                                            <RangeControl
                                                label={__("Border Radius", "betterdocs")}
                                                value={borderRadius}
                                                onChange={(value) => setAttributes({ borderRadius: value })}
                                                min={0}
                                                max={50}
                                            />

                                            <ResponsiveDimensionsControl
                                                baseLabel={__("Margin", "betterdocs")}
                                                resRequiredProps={resRequiredProps}
                                                controlName={ARTICLE_SUMMARY_BOX_MARGIN}
                                            />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__("Padding", "betterdocs")}
                                                resRequiredProps={resRequiredProps}
                                                controlName={ARTICLE_SUMMARY_BOX_PADDING}
                                            />
                                        </PanelBody>
                                    </>
                                )}
                            </div>
                        )
                }
            }
            </TabPanel>
            </div>
        </InspectorControls>
    );
}

export default Inspector;
