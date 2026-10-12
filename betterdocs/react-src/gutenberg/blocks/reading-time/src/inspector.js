import { PanelBody, TabPanel, TextControl, ToggleControl } from "@wordpress/components";
import { InspectorControls } from '@wordpress/block-editor';
import objAttributes from './attributes';
import { __ } from "@wordpress/i18n";
import {
    WRAPPER_BACKGROUND,
    WRAPPER_BORDER,
    WRAPPER_PADDING,
    WRAPPER_MARGIN,
    READING_TIME_SIZE,
    AI_ACTIONS_PADDING,
    AI_ACTIONS_BACKGROUND,
    AI_ACTIONS_BORDER,
    AI_ACTIONS_ICON_SIZE,
    LISTEN_PADDING,
    LISTEN_BACKGROUND,
    LISTEN_BORDER,
    LISTEN_ICON_SIZE
} from "./constants";
import { typoPrefix_reading_time, typoPrefix_ai_actions, typoPrefix_listen } from "./typographyPrefixConstants";
import { AI_ACTION_TOGGLES } from "./aiActions";
import { settingFlag } from "./settingDefaults";
import ColorControl from "../../../util/color-control";
import TypographyDropdown from "../../../util/typography-control-v2";
import ResponsiveRangeController from "../../../util/responsive-range-control";
import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";
import BorderShadowControl from "../../../util/border-shadow-control";
import BackgroundControl from "../../../util/background-control";

const Inspector = ({attributes, setAttributes}) => {
    const {
        enableReadingTime,
        readingTimeTitle,
        readingTimeText,
        resOption,
        readingTimeTextColor,
        singularReadingTimeText,
        enableAIActions,
        aiButtonLabel,
        aiPromptTemplate,
        aiActionsTextColor,
        aiActionsIconColor,
        enableListen,
        listenButtonLabel,
        listenShowSpeed,
        listenTextColor,
        listenIconColor,
        listenAccentColor
    } = attributes;
    const resRequiredProps = {
		setAttributes,
		resOption,
		attributes,
		objAttributes
	};

    return (
        <InspectorControls key="controls">
            <div className="eb-panel-control">
            <TabPanel className="eb-parent-tab-panel" activeClass="active-tab" tabs={[
                {
                    name: "general",
                    title: __("General", "betterdocs"),
                    className: "eb-tab styles",
                },
                {
                    name:"styles",
                    title:__("Styles", "betterdocs"),
                    className:"eb-tab styles"
                }
            ]}>
                {
                    (tab) => {
                        return (
                            <div className={"eb-tab-controls " + tab.name}>
                                {tab.name === "general" && (
                                    <>
                                    <PanelBody
                                        title={__("Reading Time", "betterdocs")}
                                        initialOpen={true}
                                    >
                                        <ToggleControl
                                            label={__("Enable Reading Time", "betterdocs")}
                                            checked={enableReadingTime}
                                            onChange={() => {
                                                setAttributes({
                                                    enableReadingTime: !enableReadingTime,
                                                });
                                            }}
                                        />
                                        {enableReadingTime && (
                                            <>
                                                <TextControl
                                                    label={__("Reading Time Title", "betterdocs")}
                                                    value={readingTimeTitle}
                                                    onChange={(value) => {
                                                        setAttributes({
                                                            readingTimeTitle: value,
                                                        });
                                                    }}
                                                />
                                                <TextControl
                                                    label={__("Reading Time Text", "betterdocs")}
                                                    value={readingTimeText}
                                                    onChange={(value) => {
                                                        setAttributes({
                                                            readingTimeText: value,
                                                        });
                                                    }}
                                                />
                                                <TextControl
                                                    label={__("Singular Reading Time Text", "betterdocs")}
                                                    value={singularReadingTimeText}
                                                    onChange={(value) => {
                                                        setAttributes({
                                                            singularReadingTimeText: value,
                                                        });
                                                    }}
                                                />
                                            </>
                                        )}
                                    </PanelBody>
                                    <PanelBody
                                        title={__("AI Actions", "betterdocs")}
                                        initialOpen={false}
                                    >
                                        {/*
                                          * The site-wide switch is a hard kill switch:
                                          * Core\AIActions lets a block switch its own
                                          * instance off but never on. Without this the
                                          * toggle below looks broken — on, yet nothing
                                          * renders on either side.
                                          */}
                                        {!settingFlag("enable_ai_actions") && (
                                            <p style={{ color: "#cc1818" }}>
                                                {__(
                                                    "AI Actions is switched off in BetterDocs → Settings, so nothing below will render. Turn it on there first.",
                                                    "betterdocs"
                                                )}
                                            </p>
                                        )}
                                        <ToggleControl
                                            label={__("Enable AI Actions", "betterdocs")}
                                            help={__(
                                                'Adds a "Copy page" button that copies the doc as Markdown, or hands it to ChatGPT, Claude or another assistant as context.',
                                                "betterdocs"
                                            )}
                                            checked={enableAIActions}
                                            onChange={() => {
                                                setAttributes({
                                                    enableAIActions: !enableAIActions,
                                                });
                                            }}
                                        />
                                        {enableAIActions && (
                                            <>
                                                <TextControl
                                                    label={__("Button Label", "betterdocs")}
                                                    value={aiButtonLabel}
                                                    onChange={(value) => {
                                                        setAttributes({
                                                            aiButtonLabel: value,
                                                        });
                                                    }}
                                                />
                                                <TextControl
                                                    label={__("AI Prompt Template", "betterdocs")}
                                                    help={__(
                                                        "Sent to the AI assistant when a reader opens this doc there. Use {URL} for the doc address.",
                                                        "betterdocs"
                                                    )}
                                                    value={aiPromptTemplate}
                                                    onChange={(value) => {
                                                        setAttributes({
                                                            aiPromptTemplate: value,
                                                        });
                                                    }}
                                                />
                                                {AI_ACTION_TOGGLES.map(({ attribute, label }) => (
                                                    <ToggleControl
                                                        key={attribute}
                                                        label={label}
                                                        checked={!!attributes[attribute]}
                                                        onChange={() => {
                                                            setAttributes({
                                                                [attribute]: !attributes[attribute],
                                                            });
                                                        }}
                                                    />
                                                ))}
                                            </>
                                        )}
                                    </PanelBody>
                                    <PanelBody
                                        title={__("Listen", "betterdocs")}
                                        initialOpen={false}
                                    >
                                        {/*
                                          * The site-wide switch is a hard kill
                                          * switch, exactly as for AI Actions:
                                          * Core\Listen lets a block switch its own
                                          * instance off but never on. Without this
                                          * the toggle below looks broken — on, yet
                                          * nothing renders on either side.
                                          */}
                                        {!settingFlag("enable_listen") && (
                                            <p style={{ color: "#cc1818" }}>
                                                {__(
                                                    "Listen is switched off in BetterDocs → Settings, so nothing below will render. Turn it on there first.",
                                                    "betterdocs"
                                                )}
                                            </p>
                                        )}
                                        <ToggleControl
                                            label={__("Enable Listen", "betterdocs")}
                                            help={__(
                                                "Adds a button that turns into a small player and reads the doc aloud using the visitor's own browser — no audio files and no third-party service.",
                                                "betterdocs"
                                            )}
                                            checked={enableListen}
                                            onChange={() => {
                                                setAttributes({
                                                    enableListen: !enableListen,
                                                });
                                            }}
                                        />
                                        {enableListen && (
                                            <>
                                                <TextControl
                                                    label={__("Button Label", "betterdocs")}
                                                    value={listenButtonLabel}
                                                    onChange={(value) => {
                                                        setAttributes({
                                                            listenButtonLabel: value,
                                                        });
                                                    }}
                                                />
                                                <ToggleControl
                                                    label={__("Speed Control", "betterdocs")}
                                                    help={__(
                                                        "Let readers cycle the playback speed between 0.75× and 2×.",
                                                        "betterdocs"
                                                    )}
                                                    checked={listenShowSpeed}
                                                    onChange={() => {
                                                        setAttributes({
                                                            listenShowSpeed: !listenShowSpeed,
                                                        });
                                                    }}
                                                />
                                            </>
                                        )}
                                    </PanelBody>
                                    </>
                                )}
                                {tab.name === "styles" && (
                                     <>
                                        <PanelBody title={__("Wrapper", "betterdocs")}>
                                            <ResponsiveDimensionsControl
                                                baseLabel={__("Padding", "betterdocs")}
                                                resRequiredProps={resRequiredProps}
                                                controlName={WRAPPER_PADDING}
                                            />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__("Margin", "betterdocs")}
                                                resRequiredProps={resRequiredProps}
                                                controlName={WRAPPER_MARGIN}
                                            />
                                            <BackgroundControl
                                                controlName={WRAPPER_BACKGROUND}
                                                resRequiredProps={resRequiredProps}
                                                noOverlay={true}
                                            />
                                            <BorderShadowControl
                                                controlName={WRAPPER_BORDER}
                                                resRequiredProps={resRequiredProps}
                                                noShadow={true}
                                                noShdowHover={true}
                                            />
                                        </PanelBody>
                                        <PanelBody title={__("Reading Time", "betterdocs")}>
                                            <ColorControl
                                                label={__("Reading Time Color", "betterdocs")}
                                                color={readingTimeTextColor}
                                                onChange={(value) => {
                                                    setAttributes({readingTimeTextColor:value})
                                                }}
                                            />
                                            <TypographyDropdown
                                                baseLabel={__("Typography", "betterdocs")}
                                                typographyPrefixConstant={typoPrefix_reading_time}
                                                resRequiredProps={resRequiredProps}
                                            />
                                            <ResponsiveRangeController
                                                baseLabel={__("Icon Size", "betterdocs")}
                                                controlName={READING_TIME_SIZE}
                                                resRequiredProps={resRequiredProps}
                                                min={1}
                                                max={500}
                                                step={1}
                                            />
                                        </PanelBody>
                                        <PanelBody title={__("AI Actions", "betterdocs")} initialOpen={false}>
                                            <ColorControl
                                                label={__("Text Color", "betterdocs")}
                                                color={aiActionsTextColor}
                                                onChange={(value) => {
                                                    setAttributes({aiActionsTextColor:value})
                                                }}
                                            />
                                            <ColorControl
                                                label={__("Icon Color", "betterdocs")}
                                                color={aiActionsIconColor}
                                                onChange={(value) => {
                                                    setAttributes({aiActionsIconColor:value})
                                                }}
                                            />
                                            <TypographyDropdown
                                                baseLabel={__("Typography", "betterdocs")}
                                                typographyPrefixConstant={typoPrefix_ai_actions}
                                                resRequiredProps={resRequiredProps}
                                            />
                                            <ResponsiveRangeController
                                                baseLabel={__("Icon Size", "betterdocs")}
                                                controlName={AI_ACTIONS_ICON_SIZE}
                                                resRequiredProps={resRequiredProps}
                                                min={8}
                                                max={64}
                                                step={1}
                                            />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__("Padding", "betterdocs")}
                                                resRequiredProps={resRequiredProps}
                                                controlName={AI_ACTIONS_PADDING}
                                            />
                                            <BackgroundControl
                                                controlName={AI_ACTIONS_BACKGROUND}
                                                resRequiredProps={resRequiredProps}
                                                noOverlay={true}
                                            />
                                            <BorderShadowControl
                                                controlName={AI_ACTIONS_BORDER}
                                                resRequiredProps={resRequiredProps}
                                                noShadow={true}
                                                noShdowHover={true}
                                            />
                                        </PanelBody>
                                        <PanelBody title={__("Listen", "betterdocs")} initialOpen={false}>
                                            <ColorControl
                                                label={__("Text Color", "betterdocs")}
                                                color={listenTextColor}
                                                onChange={(value) => {
                                                    setAttributes({listenTextColor:value})
                                                }}
                                            />
                                            <ColorControl
                                                label={__("Icon Color", "betterdocs")}
                                                color={listenIconColor}
                                                onChange={(value) => {
                                                    setAttributes({listenIconColor:value})
                                                }}
                                            />
                                            {/*
                                              * One control for three things — the play
                                              * button, the progress bar and its handle
                                              * — because listen.scss publishes them as
                                              * a single custom property. Three controls
                                              * would be three chances to end up with a
                                              * play button that does not match its own
                                              * progress bar.
                                              */}
                                            <ColorControl
                                                label={__("Player Accent Color", "betterdocs")}
                                                color={listenAccentColor}
                                                onChange={(value) => {
                                                    setAttributes({listenAccentColor:value})
                                                }}
                                            />
                                            <TypographyDropdown
                                                baseLabel={__("Typography", "betterdocs")}
                                                typographyPrefixConstant={typoPrefix_listen}
                                                resRequiredProps={resRequiredProps}
                                            />
                                            <ResponsiveRangeController
                                                baseLabel={__("Icon Size", "betterdocs")}
                                                controlName={LISTEN_ICON_SIZE}
                                                resRequiredProps={resRequiredProps}
                                                min={8}
                                                max={64}
                                                step={1}
                                            />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__("Padding", "betterdocs")}
                                                resRequiredProps={resRequiredProps}
                                                controlName={LISTEN_PADDING}
                                            />
                                            <BackgroundControl
                                                controlName={LISTEN_BACKGROUND}
                                                resRequiredProps={resRequiredProps}
                                                noOverlay={true}
                                            />
                                            <BorderShadowControl
                                                controlName={LISTEN_BORDER}
                                                resRequiredProps={resRequiredProps}
                                                noShadow={true}
                                                noShdowHover={true}
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
