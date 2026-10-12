import { PanelBody, TabPanel, TextControl } from "@wordpress/components";
import { InspectorControls } from '@wordpress/block-editor';
import objAttributes from './attributes';
import { __ } from "@wordpress/i18n";
import { typoPrefix_author, typoPrefix_updated_time } from "./typographyPrefixConstants";
import ColorControl from "../../../util/color-control";
import TypographyDropdown from "../../../util/typography-control-v2";
import ResponsiveRangeController from "../../../util/responsive-range-control";
import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";
import BorderShadowControl from "../../../util/border-shadow-control";
import BackgroundControl from "../../../util/background-control";
import { AUTHOR_BOX_BACKGROUND, AUTHOR_BOX_BORDER, AUTHOR_BOX_SIZE, AUTHOR_BOX_WRAPPER_MARGIN, AUTHOR_BOX_WRAPPER_PADDING } from "./constants";

const Inspector = ({attributes, setAttributes}) => {
    const { resOption, docAuthorColor, updatedTimeColor  } = attributes;
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
                    name:"styles",
                    title:__("Styles", "betterdocs"),
                    className:"eb-tab styles"
                }
            ]}>
                {
                    (tab) => {
                        return (
                            <div className={"eb-tab-controls " + tab.name}>
                                {tab.name === "styles" && (
                                     <>
                                        <PanelBody title={__("Author Box", "betterdocs")}>
                                            <BackgroundControl
                                                controlName={
                                                    AUTHOR_BOX_BACKGROUND
                                                }
                                                resRequiredProps={resRequiredProps}
                                                noOverlay={true}
                                            />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__("Padding", "betterdocs")}
                                                resRequiredProps={resRequiredProps}
                                                controlName={AUTHOR_BOX_WRAPPER_PADDING}
										    />
                                            <ResponsiveDimensionsControl
                                                baseLabel={__("Margin", "betterdocs")}
                                                resRequiredProps={resRequiredProps}
                                                controlName={AUTHOR_BOX_WRAPPER_MARGIN}
										    />
                                            <BorderShadowControl
                                                controlName={AUTHOR_BOX_BORDER}
                                                noShadow={true}
                                                resRequiredProps={resRequiredProps}
										    />
                                            <ResponsiveRangeController
                                                baseLabel={__("Size", "betterdocs")}
                                                controlName={AUTHOR_BOX_SIZE}
                                                resRequiredProps={resRequiredProps}
                                                min={1}
                                                max={100}
                                                step={1}
										    />
                                            <ColorControl
                                                label={__("Color", "betterdocs")}
                                                color={docAuthorColor}
                                                onChange={(docAuthorColor) => setAttributes({ docAuthorColor })}
										    />
                                            <TypographyDropdown
                                                baseLabel={__("Typography", "betterdocs")}
                                                typographyPrefixConstant={typoPrefix_author}
                                                resRequiredProps={resRequiredProps}
                                                defaultFontSize={16}
										    />
                                        </PanelBody>
                                        <PanelBody title={__("Updated Time", "betterdocs")}>
                                            <ColorControl
                                                label={__("Color", "betterdocs")}
                                                color={updatedTimeColor}
                                                onChange={(updatedTimeColor) => setAttributes({ updatedTimeColor })}
										    />
                                            <TypographyDropdown
                                                baseLabel={__("Typography", "betterdocs")}
                                                typographyPrefixConstant={typoPrefix_updated_time}
                                                resRequiredProps={resRequiredProps}
                                                defaultFontSize={16}
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
