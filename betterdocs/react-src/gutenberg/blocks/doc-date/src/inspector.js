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
	Notice
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { select, withSelect } from '@wordpress/data';

import objAttributes from "./attributes";
import { DOC_DATE_ALIGNMENT, DOC_DATE_BACKGROUND, DOC_DATE_BORDER, DOC_DATE_MARGIN, DOC_DATE_PADDING } from "./constants";
import TypographyDropdown from "../../../util/typography-control-v2";
import ResponsiveDimensionsControl from '../../../util/dimensions-control-v2';
import BorderShadowControl from '../../../util/border-shadow-control';
import BackgroundControl from "../../../util/background-control";
import ColorControl from "../../../util/color-control";
import { DOC_DATE_TYPO } from './typographyPrefixConstants';

const Inspector = ({attributes, setAttributes}) => {

	const { resOption, doc_date_color, doc_date_align } = attributes;

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
					{(tab) => (
						<div className={"eb-tab-controls " + tab.name}>
							{( tab.name === "styles" ) && (
								<PanelBody title={__("Date Style", "betterdocs")} initialOpen={true}>
									<>
                                        <ResponsiveDimensionsControl
                                            baseLabel={__("Padding", "betterdocs")}
                                            resRequiredProps={resRequiredProps}
                                            controlName={DOC_DATE_PADDING}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__("Margin", "betterdocs")}
                                            resRequiredProps={resRequiredProps}
                                            controlName={DOC_DATE_MARGIN}
                                        />
                                         <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__("Border", "betterdocs")}
                                            </h3>
                                        </BaseControl>
                                        <BorderShadowControl
                                            controlName={DOC_DATE_BORDER}
                                            resRequiredProps={resRequiredProps}
                                        />
                                        <BackgroundControl
                                            controlName={DOC_DATE_BACKGROUND}
                                            resRequiredProps={resRequiredProps}
                                            noOverlay={true}
                                        />
										<TypographyDropdown
											baseLabel={__("Typography", "betterdocs")}
											typographyPrefixConstant={DOC_DATE_TYPO}
											resRequiredProps={resRequiredProps}
										/>
										<ColorControl
											label={__("Color", "betterdocs")}
											color={doc_date_color}
											onChange={(value) => {
												setAttributes({doc_date_color:value})
											}}
										/>
										<BaseControl label={__("Alignment", "betterdocs")} id="eb-advance-heading-alignment">
												<ButtonGroup id="eb-advance-heading-alignment">
													{DOC_DATE_ALIGNMENT.map((item, key) => (
														<Button
															key={key}
															// isLarge
															isPrimary={doc_date_align === item.value}
															isSecondary={doc_date_align !== item.value}
															onClick={() =>
																setAttributes({
																	doc_date_align: item.value,
																})
															}
														>
															{item.label}
														</Button>
													))}
												</ButtonGroup>
										</BaseControl>
									</>
								</PanelBody>
							)}
						</div>
					)}
				</TabPanel>
			</div>
		</InspectorControls>
	);
}

export default Inspector;
