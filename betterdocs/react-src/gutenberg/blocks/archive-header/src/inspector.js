import objAttributes from "./attributes";
import { InspectorControls } from "@wordpress/block-editor";
import { TabPanel, PanelBody, BaseControl, SelectControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { HEADER_BACKGROUND_COLOR, HEADER_ICON_INNER_HEIGHT, HEADER_ICON_INNER_WIDTH, HEADER_ICON_SIZE, HEADER_MARGIN, HEADER_PADDING } from "./constants";
import { header_doc_count_typo, header_title_typo } from "./typographyPrefixConstants";
import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";
import ColorControl from "../../../util/color-control";
import ResponsiveRangeController from "../../../util/responsive-range-control";
import BackgroundControl from "../../../util/background-control";
import TypographyDropdown from "../../../util/typography-control-v2";

const Inspector = ({ attributes, setAttributes }) => {
    const { resOption, archiveHeaderTitleColor, archiveHeaderDocCountColor, titleTag } = attributes;

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
                            className: "eb-tab general",
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
                                {tab.name === 'general' &&  (
                                    <PanelBody
                                        title={__("Settings", "betterdocs")}
                                        initialOpen={true}
                                    >
                                        <SelectControl
                                            label={__(
                                                "Archive Title Tag",
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
                                            ]}
                                            onChange={(newTag) =>
                                                setAttributes({
                                                    titleTag: newTag,
                                                })
                                            }
                                        />
                                    </PanelBody>
                                )}
                                {tab.name === "style" && (
                                    <PanelBody
                                        title={__("Header", "betterdocs")}
                                        initialOpen={false}
                                    >
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Archive Header", "betterdocs")}
                                            </h3>
                                        </BaseControl>
                                        <ResponsiveDimensionsControl
                                            baseLabel={__("Padding", "betterdocs")}
                                            resRequiredProps={resRequiredProps}
                                            controlName={HEADER_PADDING}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__("Margin", "betterdocs")}
                                            resRequiredProps={resRequiredProps}
                                            controlName={HEADER_MARGIN}
                                        />
                                        <BackgroundControl
                                            controlName={HEADER_BACKGROUND_COLOR}
                                            resRequiredProps={resRequiredProps}
                                            noOverlay={true}
                                        />
                                        <ResponsiveRangeController
                                            baseLabel={__("Icon Size", "betterdocs")}
                                            controlName={HEADER_ICON_SIZE}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={500}
                                            step={1}
                                        />
                                        <ResponsiveRangeController
                                            baseLabel={__("Inner Image Width", "betterdocs")}
                                            controlName={HEADER_ICON_INNER_WIDTH}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={500}
                                            step={1}
                                        />
                                         <ResponsiveRangeController
                                            baseLabel={__("Inner Image Height", "betterdocs")}
                                            controlName={HEADER_ICON_INNER_HEIGHT}
                                            resRequiredProps={resRequiredProps}
                                            min={1}
                                            max={500}
                                            step={1}
                                        />
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Archive Doc Count", "betterdocs")}
                                            </h3>
                                        </BaseControl>
                                        <ColorControl
                                            label={__("Color", "betterdocs")}
                                            color={archiveHeaderTitleColor}
                                            onChange={(value) =>{
                                                setAttributes({
                                                    archiveHeaderTitleColor:value
                                                })
                                            }}
                                        />
                                        <TypographyDropdown
                                            baseLabel={__("Typography", "betterdocs")}
                                            typographyPrefixConstant={header_doc_count_typo}
                                            resRequiredProps={resRequiredProps}
                                            defaultFontSize={32}
                                        />
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Archive Doc Title", "betterdocs")}
                                            </h3>
                                        </BaseControl>
                                        <ColorControl
                                            label={__("Color", "betterdocs")}
                                            color={archiveHeaderTitleColor}
                                            onChange={(value) =>{
                                                setAttributes({
                                                    archiveHeaderDocCountColor:value
                                                })
                                            }}
                                        />
                                        <TypographyDropdown
                                            baseLabel={__("Typography", "betterdocs")}
                                            typographyPrefixConstant={header_title_typo}
                                            resRequiredProps={resRequiredProps}
                                            defaultFontSize={32}
                                        />
                                    </PanelBody>
                                )}
                            </div>
                        )
                    }}
                </TabPanel>
            </div>
        </InspectorControls>
    );
};

export default Inspector;
