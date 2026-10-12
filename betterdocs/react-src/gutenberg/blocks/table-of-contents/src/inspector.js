import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import {
    PanelBody,
    TextControl,
    BaseControl,
    TabPanel,
    ButtonGroup,
    Button,
    ToggleControl,
    SelectControl,
} from "@wordpress/components";

import Select from "react-select";
import objAttributes from "./attributes";
import { tocTitle_typo, tocList_typo } from "./typographyPrefixConstants";
import {
    TOC_BOX_WIDTH,
    TOC_BOX_PADDING,
    TOC_BOX_MARGIN,
    TOC_BOX_BORDER_SHADOW,
    TOC_TITLE_PADDING,
    TOC_TITLE_MARGIN,
    TOC_LIST_PADDING,
    TOC_LIST_MARGIN,
    TOC_LIST_BORDER,
    TOC_LIST_BORDER_PADDING,
    TOC_ACTIVE_LIST_BORDER,
    TOC_ACTIVE_LIST_BORDER_POSITION_LEFT,
    TOC_ACTIVE_LIST_BORDER_POSITION_TOP,
    TOC_ACTIVE_LIST_BORDER_POSITION_RIGHT,
    TOC_ACTIVE_LIST_BORDER_POSITION_BOTTOM,
} from "./constants";
import ColorControl from "../../../util/color-control";
import ResponsiveRangeController from "../../../util/responsive-range-control";
import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";
import BorderShadowControl from "../../../util/border-shadow-control";
import TypographyDropdown from "../../../util/typography-control-v2";

const Inspector = ({ attributes, setAttributes }) => {
    const {
        resOption,
        toc_supported_tags,
        toc_title_text,
        toc_list_heirarchy,
        toc_list_number,
        toc_collapsible_small_devices,
        toc_container_back_color,
        toc_title_color,
        toc_list_color,
        toc_list_hover_color,
        toc_list_hover_bg_color,
    } = attributes;

    const resRequiredProps = {
        setAttributes,
        resOption,
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
                            className: "eb-tab styles",
                        },
                        {
                            name: "style",
                            title: __("Style", "betterdocs"),
                            className: "eb-tab styles",
                        }
                    ]}
                >
                    {(tab) => {
                        return (
                            <div className={"eb-tab-controls " + tab.name}>
                                {tab.name === "general" && (
                                    <PanelBody
                                        title={__("Controls", "betterdocs")}
                                        initialOpen={true}
                                    >
                                        <TextControl
                                            label={__(
                                                "TOC Title",
                                                "betterdocs",
                                            )}
                                            value={toc_title_text}
                                            onChange={(title_text) => {
                                                setAttributes({
                                                    toc_title_text: title_text,
                                                });
                                            }}
                                        />
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__(
                                                    "Supported Heading Tags",
                                                    "betterdocs",
                                                )}
                                            </h3>
                                        </BaseControl>
                                        <Select
                                            name="supported_toc_tags"
                                            value={toc_supported_tags}
                                            onChange={(headings) => {
                                                setAttributes({
                                                    toc_supported_tags:
                                                        headings,
                                                });
                                            }}
                                            options={[
                                                { value: "1", label: "H1" },
                                                { value: "2", label: "H2" },
                                                { value: "3", label: "H3" },
                                                { value: "4", label: "H4" },
                                                { value: "5", label: "H5" },
                                            ]}
                                            isMulti="true"
                                        />
                                        <ToggleControl
                                            label={__(
                                                "List Heirarchy",
                                                "betterdocs",
                                            )}
                                            checked={toc_list_heirarchy}
                                            onChange={() => {
                                                setAttributes({
                                                    toc_list_heirarchy:
                                                        !toc_list_heirarchy,
                                                });
                                            }}
                                        />
                                        {toc_list_heirarchy && (
                                            <ToggleControl
                                                label={__(
                                                    "List Number",
                                                    "betterdocs",
                                                )}
                                                checked={toc_list_number}
                                                onChange={() => {
                                                    setAttributes({
                                                        toc_list_number:
                                                            !toc_list_number,
                                                    });
                                                }}
                                            />
                                        )}
                                        <ToggleControl
                                            label={__(
                                                "Collapsible On Small Devices",
                                                "betterdocs",
                                            )}
                                            checked={
                                                toc_collapsible_small_devices
                                            }
                                            onChange={() => {
                                                setAttributes({
                                                    toc_collapsible_small_devices:
                                                        !toc_collapsible_small_devices,
                                                });
                                            }}
                                        />
                                    </PanelBody>
                                )}
                                {tab.name === "style" && (
                                    <>
                                        <PanelBody
                                            title={__(
                                                "TOC Container",
                                                "betterdocs",
                                            )}
                                            initialOpen={true}
                                        >
                                            <ColorControl
                                                label={__(
                                                    "Background Color",
                                                    "betterdocs",
                                                )}
                                                color={toc_container_back_color}
                                                onChange={(color) => {
                                                    setAttributes({
                                                        toc_container_back_color:
                                                            color,
                                                    });
                                                }}
                                            />
                                            <ResponsiveRangeController
                                                baseLabel={__(
                                                    "Width",
                                                    "betterdocs",
                                                )}
                                                controlName={TOC_BOX_WIDTH}
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                                min={1}
                                                max={1000}
                                                step={1}
                                                // noUnits
                                            />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__(
                                                    "Padding",
                                                    "betterdocs",
                                                )}
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                                controlName={TOC_BOX_PADDING}
                                            />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__(
                                                    "Margin",
                                                    "betterdocs",
                                                )}
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                                controlName={TOC_BOX_MARGIN}
                                            />
                                            <BorderShadowControl
                                                controlName={
                                                    TOC_BOX_BORDER_SHADOW
                                                }
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                                noBdrHover={true}
                                                noShadow={true}
                                                noShdowHover={true}
                                            />
                                        </PanelBody>
                                        <PanelBody
                                            title={__(
                                                "TOC Title",
                                                "betterdocs",
                                            )}
                                            initialOpen={true}
                                        >
                                            <TypographyDropdown
                                                baseLabel={__(
                                                    "Typography",
                                                    "betterdocs",
                                                )}
                                                typographyPrefixConstant={
                                                    tocTitle_typo
                                                }
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                                defaultFontSize={18}
                                            />
                                            <ColorControl
                                                label={__(
                                                    "Color",
                                                    "betterdocs",
                                                )}
                                                color={toc_title_color}
                                                onChange={(color) => {
                                                    setAttributes({
                                                        toc_title_color: color,
                                                    });
                                                }}
                                            />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__(
                                                    "Padding",
                                                    "betterdocs",
                                                )}
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                                controlName={TOC_TITLE_PADDING}
                                            />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__(
                                                    "Margin",
                                                    "betterdocs",
                                                )}
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                                controlName={TOC_TITLE_MARGIN}
                                            />
                                        </PanelBody>
                                        <PanelBody
                                            title={__("TOC List", "betterdocs")}
                                            initialOpen={true}
                                        >
                                            <TypographyDropdown
                                                baseLabel={__(
                                                    "Typography",
                                                    "betterdocs",
                                                )}
                                                typographyPrefixConstant={
                                                    tocList_typo
                                                }
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                            />
                                            <ColorControl
                                                label={__(
                                                    "Color",
                                                    "betterdocs",
                                                )}
                                                color={toc_list_color}
                                                onChange={(color) => {
                                                    setAttributes({
                                                        toc_list_color: color,
                                                    });
                                                }}
                                            />
                                            <ColorControl
                                                label={__(
                                                    "Hover Color",
                                                    "betterdocs",
                                                )}
                                                color={toc_list_hover_color}
                                                onChange={(color) => {
                                                    setAttributes({
                                                        toc_list_hover_color:
                                                            color,
                                                    });
                                                }}
                                            />
											<ColorControl
                                                label={__(
                                                    "Hover Background Color",
                                                    "betterdocs",
                                                )}
                                                color={toc_list_hover_bg_color}
                                                onChange={(color) => {
                                                    setAttributes({
                                                        toc_list_hover_bg_color:
                                                            color,
                                                    });
                                                }}
                                            />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__(
                                                    "Padding",
                                                    "betterdocs",
                                                )}
                                                controlName={TOC_LIST_PADDING}
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                            />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__(
                                                    "Margin",
                                                    "betterdocs",
                                                )}
                                                controlName={TOC_LIST_MARGIN}
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                            />
                                            {toc_list_heirarchy && (
                                                <BorderShadowControl
                                                    controlName={
                                                        TOC_LIST_BORDER
                                                    }
                                                    resRequiredProps={
                                                        resRequiredProps
                                                    }
                                                    noBdrHover={true}
                                                    noShadow={true}
                                                    noShdowHover={true}
                                                />
                                            )}
                                            {toc_list_heirarchy && (
                                                <ResponsiveDimensionsControl
                                                    baseLabel={__(
                                                        "Left Border Spacing",
                                                        "betterdocs",
                                                    )}
                                                    controlName={
                                                        TOC_LIST_BORDER_PADDING
                                                    }
                                                    resRequiredProps={
                                                        resRequiredProps
                                                    }
                                                />
                                            )}
                                            {toc_list_heirarchy && (
                                                <>
                                                    <BorderShadowControl
                                                        controlName={
                                                            TOC_ACTIVE_LIST_BORDER
                                                        }
                                                        resRequiredProps={
                                                            resRequiredProps
                                                        }
                                                        noBdrHover={true}
                                                        noShadow={true}
                                                        noShdowHover={true}
                                                    />
                                                    <ResponsiveRangeController
                                                        baseLabel={__(
                                                            "Active Border Top",
                                                            "betterdocs",
                                                        )}
                                                        controlName={TOC_ACTIVE_LIST_BORDER_POSITION_TOP}
                                                        resRequiredProps={
                                                            resRequiredProps
                                                        }
                                                        min={"-1000"}
                                                        max={1000}
                                                        step={1}
                                                    />
                                                     <ResponsiveRangeController
                                                        baseLabel={__(
                                                            "Active Border Right",
                                                            "betterdocs",
                                                        )}
                                                        controlName={TOC_ACTIVE_LIST_BORDER_POSITION_RIGHT}
                                                        resRequiredProps={
                                                            resRequiredProps
                                                        }
                                                        min={"-1000"}
                                                        max={1000}
                                                        step={1}
                                                    />
                                                    <ResponsiveRangeController
                                                        baseLabel={__(
                                                            "Active Border Bottom",
                                                            "betterdocs",
                                                        )}
                                                        controlName={TOC_ACTIVE_LIST_BORDER_POSITION_BOTTOM}
                                                        resRequiredProps={
                                                            resRequiredProps
                                                        }
                                                        min={"-1000"}
                                                        max={1000}
                                                        step={1}
                                                    />
                                                    <ResponsiveRangeController
                                                        baseLabel={__(
                                                            "Active Border Left",
                                                            "betterdocs",
                                                        )}
                                                        controlName={TOC_ACTIVE_LIST_BORDER_POSITION_LEFT}
                                                        resRequiredProps={
                                                            resRequiredProps
                                                        }
                                                        min={"-1000"}
                                                        max={1000}
                                                        step={1}
                                                    />
                                                </>
                                            )}
                                        </PanelBody>
                                    </>
                                )}
                            </div>
                        );
                    }}
                </TabPanel>
            </div>
        </InspectorControls>
    );
};

export default Inspector;
