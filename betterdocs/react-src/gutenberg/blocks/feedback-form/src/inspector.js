import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import {
    TabPanel,
    PanelBody,
    TextControl,
    BaseControl,
    ButtonGroup,
    Button,
} from "@wordpress/components";
import ColorControl from "../../../util/color-control";
import TypographyDropdown from "../../../util/typography-control-v2";
import ResponsiveRangeController from "../../../util/responsive-range-control";
import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";

import {
    ICON_SIZE,
    FORM_WIDTH,
    FORM_HEIGHT,
    FORM_HEADING_ALIGN,
    FORM_BUTTON_WIDTH,
    FORM_BUTTON_PADDING,
    FORM_BUTTON_ALIGN,
} from "./constants";
import {
    formTitleTypo,
    feedBackFormHeadingtypo,
    feedbackFormLabelTypo,
    feedbackFormButtonTextTypo,
} from "./typographyPrefixConstants";
import objAttributes from "./attributes";

const Inspector = ({ attributes, setAttributes }) => {
    const {
        formContent,
        formTitle,
        buttonText,
        formContentColor,
        resOption,
        iconColor,
        feedbackFormHeadingColor,
        feedbackFormHeadingAlignment,
        feedbackFormLabelColor,
        feedbackFormButtonBackColor,
        feedbackFormButtonTextColor,
        feedbackFormButtonAlignment,
		feedbackFormNameLabelText,
		feedbackFormEmailLabelText,
		feedbackFormMessageLabelText
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
                            name: "content",
                            title: __("Content", "betterdocs"),
                            className: "eb-tab styles",
                        },
                        {
                            name: "styles",
                            title: __("Styles", "betterdocs"),
                            className: "eb-tab styles",
                        },
                    ]}
                >
                    {(tab) => {
                        return (
                            <div className={"eb-tab-controls " + tab.name}>
                                {tab.name === "content" && (
                                    <PanelBody
                                        title={__("General", "betterdocs")}
                                        initialOpen={true}
                                    >
										<TextControl
                                            label={__("Label Name Text", "betterdocs")}
                                            type="text"
                                            value={feedbackFormNameLabelText}
                                            onChange={(value) => {
                                                setAttributes({
                                                    feedbackFormNameLabelText:
                                                        value.toString(),
                                                });
                                            }}
                                        />
										<TextControl
                                            label={__("Label Email Text", "betterdocs")}
                                            type="text"
                                            value={feedbackFormEmailLabelText}
                                            onChange={(value) => {
                                                setAttributes({
                                                    feedbackFormEmailLabelText:
                                                        value.toString(),
                                                });
                                            }}
                                        />
										<TextControl
                                            label={__("Label Message Text", "betterdocs")}
                                            type="text"
                                            value={feedbackFormMessageLabelText}
                                            onChange={(value) => {
                                                setAttributes({
                                                    feedbackFormMessageLabelText:
                                                        value.toString(),
                                                });
                                            }}
                                        />
                                        <TextControl
                                            label={__("Content", "betterdocs")}
                                            type="text"
                                            value={formContent}
                                            onChange={(value) => {
                                                setAttributes({
                                                    formContent:
                                                        value.toString(),
                                                });
                                            }}
                                        />
                                        <TextControl
                                            label={__(
                                                "Feedback Form Title",
                                                "betterdocs"
                                            )}
                                            type="text"
                                            value={formTitle}
                                            onChange={(value) => {
                                                setAttributes({
                                                    formTitle: value.toString(),
                                                });
                                            }}
                                        />
                                        <TextControl
                                            label={__(
                                                "Button Text",
                                                "betterdocs"
                                            )}
                                            type="text"
                                            value={buttonText}
                                            onChange={(value) => {
                                                setAttributes({
                                                    buttonText:
                                                        value.toString(),
                                                });
                                            }}
                                        />
                                    </PanelBody>
                                )}
                                {tab.name === "styles" && (
                                    <>
                                        <PanelBody
                                            title={__("Text", "betterdocs")}
                                            initialOpen={false}
                                        >
                                            <ColorControl
                                                label={__(
                                                    "Color",
                                                    "betterdocs"
                                                )}
                                                defaultColor={formContentColor}
                                                onChange={(value) => {
                                                    setAttributes({
                                                        formContentColor: value,
                                                    });
                                                }}
                                            />
                                            <TypographyDropdown
                                                baseLabel={__(
                                                    "Typography",
                                                    "betterdocs"
                                                )}
                                                typographyPrefixConstant={
                                                    formTitleTypo
                                                }
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                            />
                                        </PanelBody>
                                        <PanelBody
                                            title={__("Icon", "betterdocs")}
                                            initialOpen={false}
                                        >
                                            <ColorControl
                                                label={__(
                                                    "Color",
                                                    "betterdocs"
                                                )}
                                                defaultColor={iconColor}
                                                onChange={(value) => {
                                                    setAttributes({
                                                        iconColor: value,
                                                    });
                                                }}
                                            />
                                            <ResponsiveRangeController
                                                baseLabel={__(
                                                    "Size",
                                                    "betterdocs"
                                                )}
                                                controlName={ICON_SIZE}
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                                min={1}
                                                max={1000}
                                                step={1}
                                            />
                                        </PanelBody>
                                        <PanelBody
                                            title={__(
                                                "Feedback Form",
                                                "betterdocs"
                                            )}
                                            initialOpen={false}
                                        >
                                            <ResponsiveRangeController
                                                baseLabel={__(
                                                    "Width",
                                                    "betterdocs"
                                                )}
                                                controlName={FORM_WIDTH}
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                                min={1}
                                                max={1000}
                                                step={1}
                                            />
                                            <ResponsiveRangeController
                                                baseLabel={__(
                                                    "Height",
                                                    "betterdocs"
                                                )}
                                                controlName={FORM_HEIGHT}
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                                min={1}
                                                max={1000}
                                                step={1}
                                            />

                                            <ColorControl
                                                label={__(
                                                    "Heading Color",
                                                    "betterdocs"
                                                )}
                                                defaultColor={
                                                    feedbackFormHeadingColor
                                                }
                                                onChange={(value) => {
                                                    setAttributes({
                                                        feedbackFormHeadingColor:
                                                            value,
                                                    });
                                                }}
                                            />
                                            <TypographyDropdown
                                                baseLabel={"Heading Typography"}
                                                typographyPrefixConstant={
                                                    feedBackFormHeadingtypo
                                                }
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                            />
                                            <BaseControl
                                                label={__(
                                                    "Heading Alignment",
                                                    "betterdocs"
                                                )}
                                                id="eb-advance-heading-alignment"
                                            >
                                                <ButtonGroup id="eb-advance-heading-alignment">
                                                    {FORM_HEADING_ALIGN.map(
                                                        (item, key) => (
                                                            <Button
                                                                key={key}
                                                                isPrimary={
                                                                    feedbackFormHeadingAlignment ===
                                                                    item.value
                                                                }
                                                                isSecondary={
                                                                    feedbackFormHeadingAlignment !==
                                                                    item.value
                                                                }
                                                                onClick={() =>
                                                                    setAttributes(
                                                                        {
                                                                            feedbackFormHeadingAlignment:
                                                                                item.value,
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                {item.label}
                                                            </Button>
                                                        )
                                                    )}
                                                </ButtonGroup>
                                            </BaseControl>
                                            <ColorControl
                                                label={__(
                                                    "Label Color",
                                                    "betterdocs"
                                                )}
                                                defaultColor={
                                                    feedbackFormLabelColor
                                                }
                                                onChange={(value) => {
                                                    setAttributes({
                                                        feedbackFormLabelColor:
                                                            value,
                                                    });
                                                }}
                                            />
                                            <TypographyDropdown
                                                baseLabel={__(
                                                    "Label Typography",
                                                    "betterdocs"
                                                )}
                                                typographyPrefixConstant={
                                                    feedbackFormLabelTypo
                                                }
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                            />
                                            <ColorControl
                                                label={__(
                                                    "Button Background Color",
                                                    "betterdocs"
                                                )}
                                                defaultColor={
                                                    feedbackFormButtonBackColor
                                                }
                                                onChange={(value) => {
                                                    setAttributes({
                                                        feedbackFormButtonBackColor:
                                                            value,
                                                    });
                                                }}
                                            />
                                            <ColorControl
                                                label={__(
                                                    "Button Text Color",
                                                    "betterdocs"
                                                )}
                                                defaultColor={
                                                    feedbackFormButtonTextColor
                                                }
                                                onChange={(value) => {
                                                    setAttributes({
                                                        feedbackFormButtonTextColor:
                                                            value,
                                                    });
                                                }}
                                            />
                                            <TypographyDropdown
                                                baseLabel={__(
                                                    "Button Text Typography",
                                                    "betterdocs"
                                                )}
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                                typographyPrefixConstant={
                                                    feedbackFormButtonTextTypo
                                                }
                                            />
                                            <ResponsiveRangeController
                                                baseLabel={__(
                                                    "Button Width",
                                                    "betterdocs"
                                                )}
                                                controlName={FORM_BUTTON_WIDTH}
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                                min={1}
                                                max={1000}
                                                step={1}
                                            />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__(
                                                    "Button Padding",
                                                    "betterdocs"
                                                )}
                                                resRequiredProps={
                                                    resRequiredProps
                                                }
                                                controlName={
                                                    FORM_BUTTON_PADDING
                                                }
                                            />
                                            <BaseControl
                                                label={__(
                                                    "Button Alignment",
                                                    "betterdocs"
                                                )}
                                                id="eb-advance-heading-alignment"
                                            >
                                                <ButtonGroup id="eb-advance-heading-alignment">
                                                    {FORM_BUTTON_ALIGN.map(
                                                        (item, key) => (
                                                            <Button
                                                                key={key}
                                                                isPrimary={
                                                                    feedbackFormButtonAlignment ===
                                                                    item.value
                                                                }
                                                                isSecondary={
                                                                    feedbackFormButtonAlignment !==
                                                                    item.value
                                                                }
                                                                onClick={() =>
                                                                    setAttributes(
                                                                        {
                                                                            feedbackFormButtonAlignment:
                                                                                item.value,
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                {item.label}
                                                            </Button>
                                                        )
                                                    )}
                                                </ButtonGroup>
                                            </BaseControl>
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
