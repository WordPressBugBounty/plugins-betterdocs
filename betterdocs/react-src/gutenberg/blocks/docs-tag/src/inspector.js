import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  TextControl,
  Button,
  ButtonGroup,
  BaseControl,
  ToggleControl,
  SelectControl,
  TabPanel,
  Notice,
} from '@wordpress/components';

import objAttributes from "./attributes";
import ResponsiveDimensionsControl from '../../../util/dimensions-control-v2';
import BorderShadowControl from "../../../util/border-shadow-control";
import BackgroundControl from "../../../util/background-control";
import ColorControl from "../../../util/color-control";
import TypographyDropdown from "../../../util/typography-control-v2";
import { TAGS_BACKGROUND, TAGS_BORDER, TAGS_MARGIN, TAGS_PADDING, WRAPPER_TAGS_BACKGROUND, WRAPPER_TAGS_MARGIN, WRAPPER_TAGS_PADDING } from './constants';
import { TAGS_TYPO } from './typographyPrefixConstants';


const Inspector = ( { attributes, setAttributes }) => {

	let { resOption, tagsColor } = attributes;

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
                            name: "styles",
                            title: __("Style", "betterdocs"),
                            className: "eb-tab styles",
						}
					]}
				>
					{(tab) => {
						return (
							<div className={"eb-tab-controls " + tab.name}>
								{
									tab.name == 'styles' && (
										<>
											<PanelBody title={__("Wrapper", "betterdocs")}>
                                                <ResponsiveDimensionsControl
                                                    baseLabel={__("Wrapper Padding", "betterdocs")}
                                                    resRequiredProps={resRequiredProps}
                                                    controlName={WRAPPER_TAGS_PADDING}
                                                />
                                                <ResponsiveDimensionsControl
                                                    baseLabel={__("Wrapper Margin", "betterdocs")}
                                                    resRequiredProps={resRequiredProps}
                                                    controlName={WRAPPER_TAGS_MARGIN}
                                                />
                                                <BackgroundControl
                                                    controlName={WRAPPER_TAGS_BACKGROUND}
                                                    resRequiredProps={resRequiredProps}
                                                    noOverlay={true}
                                                />
                                            </PanelBody>
                                            <PanelBody title={__("Tags", "betterdocs")}>
                                                <TypographyDropdown
                                                    baseLabel={__("Typography", "betterdocs")}
                                                    typographyPrefixConstant={TAGS_TYPO}
                                                    resRequiredProps={resRequiredProps}
                                                    defaultFontSize={14}
                                                />
                                                <ResponsiveDimensionsControl
                                                    baseLabel={__("Padding", "betterdocs")}
                                                    resRequiredProps={resRequiredProps}
                                                    controlName={TAGS_PADDING}
                                                />
                                                <ResponsiveDimensionsControl
                                                    baseLabel={__("Margin", "betterdocs")}
                                                    resRequiredProps={resRequiredProps}
                                                    controlName={TAGS_MARGIN}
                                                />
                                                <BackgroundControl
                                                    controlName={TAGS_BACKGROUND}
                                                    resRequiredProps={resRequiredProps}
                                                    noOverlay={true}
                                                />
                                                <BorderShadowControl
                                                    controlName={TAGS_BORDER}
                                                    resRequiredProps={resRequiredProps}
										        />
                                                <ColorControl
                                                    label={__("Color", "betterdocs")}
                                                    color={tagsColor}
                                                    onChange={(tagsColor) => setAttributes({ tagsColor })}
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
	)
}

export default Inspector;
