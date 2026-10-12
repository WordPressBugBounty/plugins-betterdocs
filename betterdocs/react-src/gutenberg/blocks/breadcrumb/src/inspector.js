import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { BaseControl, ButtonGroup, Button, PanelBody, TabPanel, SelectControl } from '@wordpress/components';

import {
	typoPrefix_title,
    typoPrefix_title_two
} from "./typographyPrefixConstants";
import { BREADCRUMB_ICON_PADDING_LAYOUT_TWO, BREADCRUMB_TEXT_ALIGN, BREADCRUMB_TITLE_MARGIN_LAYOUT_TWO, BREADCRUMB_TITLE_PADDING_LAYOUT_TWO, LAYOUT } from './constants';
import { BREADCRUMB_TITLE_MARGIN, BREADCRUMB_TITLE_PADDING, BREADCRUMB_ICON_MARGIN, BREADCRUMB_ICON_PADDING } from './constants';
import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";
import ColorControl from "../../../util/color-control";
import TypographyDropdown from "../../../util/typography-control-v2";
import objAttributes from './atttributes';

const Inspector = ({attributes, setAttributes}) => {
	const {align, align_layout_two, wrapper_background_color_layout_two, breadcrumb_title_color_layout_two, resOption, breadcrumb_title_color, breadcrumb_icon_color, breadcrumb_icon_color_two, layout} = attributes;

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
                        className: "eb-tab styles"
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
                                <PanelBody title={__("General", "betterdocs")} initialOpen={true}>
                                    <SelectControl
                                        label={__("Select layout", "betterdocs")}
                                        value={layout}
                                        options={LAYOUT}
                                        onChange={(newLayout) =>
                                            setAttributes({
                                                layout: newLayout,
                                            })
                                        }
                                        __next40pxDefaultSize
                                        __nextHasNoMarginBottom
									/>
                                </PanelBody>}
								{tab.name === 'styles' && (
									<>
										<PanelBody title={__("Breadcrumb Title", "betterdocs")} initialOpen={false}>
											<>
												<TypographyDropdown
													baseLabel={__("Typography", "betterdocs")}
													typographyPrefixConstant={layout == 'layout-1' ? typoPrefix_title : typoPrefix_title_two}
													resRequiredProps={resRequiredProps}
													defaultFontSize={layout == 'layout-1' ? 15: 12}
												/>

												<BaseControl label={__("Alignment", "betterdocs")} id="eb-advance-heading-alignment">
													<ButtonGroup id="eb-advance-heading-alignment">
														{BREADCRUMB_TEXT_ALIGN.map((item, key) => (
															<Button
																key={key}
																// isLarge
																isPrimary={layout == 'layout-1' ? align === item.value : align_layout_two == item.value}
																isSecondary={layout == 'layout-1' ? align !== item.value : align_layout_two != item.value}
																onClick={() => {
                                                                    if( layout == 'layout-1' ){
                                                                        setAttributes({
                                                                            align: item.value,
                                                                        })
                                                                    } else {
                                                                        setAttributes({
                                                                            align_layout_two: item.value,
                                                                        })
                                                                    }
																}}
															>
																{item.label}
															</Button>
														))}
													</ButtonGroup>
												</BaseControl>

												<ColorControl
													label={__("Color", "betterdocs")}
													color={layout == 'layout-1' ? breadcrumb_title_color : breadcrumb_title_color_layout_two}
													onChange={(colorValue) => {
                                                        if( layout == 'layout-1' ) {
                                                            setAttributes({breadcrumb_title_color:colorValue})
                                                        } else {
                                                            setAttributes({breadcrumb_title_color_layout_two:colorValue})
                                                        }
                                                    }}
												/>

                                                {layout == 'layout-2' && <ColorControl
													label={__("Wrapper Background Color", "betterdocs")}
													color={wrapper_background_color_layout_two}
													onChange={(colorValue) => {
                                                        setAttributes({wrapper_background_color_layout_two:colorValue});
                                                    }}
												/>}
											</>
											<ResponsiveDimensionsControl
												baseLabel={__("Margin", "betterdocs")}
												resRequiredProps={resRequiredProps}
												controlName={layout == 'layout-1' ? BREADCRUMB_TITLE_MARGIN : BREADCRUMB_TITLE_MARGIN_LAYOUT_TWO}
                    						/>
											<ResponsiveDimensionsControl
												baseLabel={__("Padding", "betterdocs")}
												resRequiredProps={resRequiredProps}
												controlName={layout == 'layout-1' ? BREADCRUMB_TITLE_PADDING : BREADCRUMB_TITLE_PADDING_LAYOUT_TWO}
                    						/>
										</PanelBody>
										<PanelBody title={__("Breadcrumb Icon", "betterdocs")} initialOpen={false}>
											<ColorControl
												label={__("Color", "betterdocs")}
												color={layout == 'layout-1' ? breadcrumb_icon_color : breadcrumb_icon_color_two}
												onChange={(colorValue) =>{
                                                    if( layout == 'layout-1' ) {
                                                        setAttributes({breadcrumb_icon_color:colorValue})
                                                    } else {
                                                        setAttributes({breadcrumb_icon_color_two:colorValue})}
                                                    }
                                                }
											/>
											<ResponsiveDimensionsControl
												baseLabel={__("Margin", "betterdocs")}
												resRequiredProps={resRequiredProps}
												controlName={layout == 'layout-1' ? BREADCRUMB_ICON_MARGIN : BREADCRUMB_TITLE_MARGIN_LAYOUT_TWO}
                    						/>
											<ResponsiveDimensionsControl
												baseLabel={__("Padding", "betterdocs")}
												resRequiredProps={resRequiredProps}
												controlName={layout == 'layout-1' ? BREADCRUMB_ICON_PADDING : BREADCRUMB_ICON_PADDING_LAYOUT_TWO}
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
