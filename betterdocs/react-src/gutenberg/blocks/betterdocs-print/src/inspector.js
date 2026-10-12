import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import {
    PanelBody,
    TabPanel,
    BaseControl,
    ButtonGroup,
    Button,
    SelectControl,
} from "@wordpress/components";

import { PRINT_ICON_MARGIN, PRINT_ICON_PADDING, PRINT_ICON_ALIGNMENT, LAYOUT, PRINT_ICON_PADDING_LAYOUT_2, PRINT_ICON_MARGIN_LAYOUT_2, PRINT_ICON_ALIGNMENT_LAYOUT_2_VALUES, BACKGROUND_LAYOUT_2 } from "./constants";

import objAttributes from "./attributes";
import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";
import BackgroundControl from "../../../util/background-control";

const Inspector = ({ attributes, setAttributes }) => {
    const { resOption, print_icon_alignment, print_icon_alignment_layout_2, layout } = attributes;

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
                                {tab.name === "general" && (
                                    <PanelBody
                                        title={__("General", "betterdocs")}
                                        initialOpen={true}
                                    >
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
                                    </PanelBody>
                                )}
                                {tab.name === "style" && (
                                    <PanelBody
                                        title={__("Print", "betterdocs")}
                                        initialOpen={true}
                                    >
                                        <BaseControl
                                            label={__(
                                                "Alignment",
                                                "betterdocs"
                                            )}
                                            id="eb-advance-heading-alignment"
                                        >
                                            {layout == 'layout-1' && <ButtonGroup id="eb-advance-heading-alignment">
                                                {PRINT_ICON_ALIGNMENT.map(
                                                    (item, key) => (
                                                        <Button
                                                            key={key}
                                                            // isLarge
                                                            isPrimary={
                                                                print_icon_alignment ===
                                                                item.value
                                                            }
                                                            isSecondary={
                                                                print_icon_alignment !==
                                                                item.value
                                                            }
                                                            onClick={() =>
                                                                setAttributes({
                                                                    print_icon_alignment: item.value,
                                                                })
                                                            }
                                                        >
                                                            {item.label}
                                                        </Button>
                                                    )
                                                )}
                                            </ButtonGroup>}
                                            {layout == 'layout-2' && <ButtonGroup id="eb-advance-heading-alignment">
                                                {PRINT_ICON_ALIGNMENT_LAYOUT_2_VALUES.map(
                                                    (item, key) => (
                                                        <Button
                                                            key={key}
                                                            // isLarge
                                                            isPrimary={print_icon_alignment_layout_2 ===  item.value}
                                                            isSecondary={print_icon_alignment_layout_2 !== item.value}
                                                            onClick={() => {
                                                                setAttributes({
                                                                    print_icon_alignment_layout_2: item.value,
                                                                });
                                                            }}
                                                        >
                                                            {item.label}
                                                        </Button>
                                                    )
                                                )}
                                            </ButtonGroup>}
                                        </BaseControl>
                                        {layout == 'layout-2' && <BackgroundControl
                                            controlName={BACKGROUND_LAYOUT_2}
                                            resRequiredProps={resRequiredProps}
                                            noOverlay={true}
                                        />}
                                        <ResponsiveDimensionsControl
                                            baseLabel={__(
                                                "Padding",
                                                "betterdocs"
                                            )}
                                            resRequiredProps={resRequiredProps}
                                            controlName={layout == 'layout-1' ? PRINT_ICON_PADDING : PRINT_ICON_PADDING_LAYOUT_2}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__(
                                                "Margin",
                                                "betterdocs"
                                            )}
                                            resRequiredProps={resRequiredProps}
                                            controlName={layout == 'layout-1' ? PRINT_ICON_MARGIN : PRINT_ICON_MARGIN_LAYOUT_2}
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
