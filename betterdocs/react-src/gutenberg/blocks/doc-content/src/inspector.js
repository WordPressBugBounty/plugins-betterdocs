import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, TabPanel, ToggleControl } from "@wordpress/components";

import { DOC_CONTENT_PADDING, DOC_CONTENT_MARGIN } from "./constants";
import { typoPrefix_Doc_content } from "./typographyPrefixConstants";
import objAttributes from "./attributes";
import ColorControl from "../../../util/color-control";
import TypographyDropdown from "../../../util/typography-control-v2";
import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";

const Inspector = ({ attributes, setAttributes }) => {
    const { resOption, doc_content_color } = attributes;

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
                            name: "style",
                            title: __("Style", "betterdocs"),
                            className: "eb-tab styles",
                        }
                    ]}
                >
                    {(tab) => {
                        return (
                            <div className={"eb-tab-controls " + tab.name}>
                                {tab.name === "style" && (
                                    <PanelBody
                                        title={__("Doc Content", "betterdocs")}
                                        initialOpen={true}
                                    >
                                        <TypographyDropdown
                                            baseLabel={__(
                                                "Typography",
                                                "betterdocs",
                                            )}
                                            typographyPrefixConstant={
                                                typoPrefix_Doc_content
                                            }
                                            resRequiredProps={resRequiredProps}
                                            defaultFontSize={15}
                                        />
                                        <ColorControl
                                            label={__(
                                                "Doc Content Color",
                                                "betterdocs",
                                            )}
                                            color={doc_content_color}
                                            onChange={(color) => {
                                                setAttributes({
                                                    doc_content_color: color,
                                                });
                                            }}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__(
                                                "Content Padding",
                                                "betterdocs",
                                            )}
                                            resRequiredProps={resRequiredProps}
                                            controlName={DOC_CONTENT_PADDING}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__(
                                                "Content Margin",
                                                "betterdocs",
                                            )}
                                            resRequiredProps={resRequiredProps}
                                            controlName={DOC_CONTENT_MARGIN}
                                        />
                                    </PanelBody>
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
