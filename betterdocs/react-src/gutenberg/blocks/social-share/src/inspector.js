import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    BaseControl,
    TabPanel,
    ButtonGroup,
    Button,
    ToggleControl,
    SelectControl
} from '@wordpress/components';

import { SOCIAL_SHARE_TITLE_PADDING, SOCIAL_SHARE_TITLE_MARGIN, SOCIAL_SHARE_BOX_HEIGHT, SOCIAL_SHARE_BOX_WIDTH, SOCIAL_SHARE_BOX_PADDING, SOCIAL_SHARE_BOX_MARGIN, SOCIAL_SHARE_BOX_BORDER, SOCIAL_SHARE_CONTENT_ALIGN, SOCIAL_SHARE_ICON_PADDING, SOCIAL_SHARE_ICON_MARGIN, BETTERDOCS_SOCIAL_SHARE_LAYOUTS, SOCIAL_SHARE_TITLE_PADDING_LAYOUT_2, SOCIAL_SHARE_TITLE_MARGIN_LAYOUT_2, SOCIAL_SHARE_BOX_HEIGHT_LAYOUT_2, SOCIAL_SHARE_BOX_WIDTH_LAYOUT_2, SOCIAL_SHARE_BOX_PADDING_LAYOUT_2, SOCIAL_SHARE_BOX_MARGIN_LAYOUT_2, SOCIAL_SHARE_BOX_BORDER_LAYOUT_2, SOCIAL_SHARE_ICON_PADDING_LAYOUT_2, SOCIAL_SHARE_ICON_MARGIN_LAYOUT_2, SOCIAL_SHARE_ICON_WIDTH_LAYOUT_2, SOCIAL_SHARE_ICON_HEIGHT_LAYOUT_2, SOCIAL_SHARE_ICON_OUTER_HEIGHT_LAYOUT_2, SOCIAL_SHARE_ICON_OUTER_WIDTH_LAYOUT_2 } from './constants';
import { typoShareTitle, typoShareTitle_Layout_2 } from './typographyPrefixConstants';
import ColorControl from "../../../util/color-control";
import objAttributes from './attributes';
import ResponsiveRangeController from '../../../util/responsive-range-control';
import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";
import BorderShadowControl from '../../../util/border-shadow-control';
import TypographyDropdown from '../../../util/typography-control-v2';

const Inspector = ({attributes, setAttributes}) => {
	const { share_title, share_title_tag, share_title_color, share_title_hover_color, share_title_color_layout_2, share_title_hover_color_layout_2, share_content_align_layout_2, share_box_wrapper_color_layout_2, resOption, share_box_wrapper_color, share_content_align, show_facebook_icon, show_twitter_icon, show_linkedin_icon, show_pinterest_icon, layout } = attributes;
	const resRequiredProps = {
		setAttributes,
		resOption,
		attributes,
		objAttributes
	};

	return (  <InspectorControls key="controls">
				<div className="eb-panel-control">
					<TabPanel className="eb-parent-tab-panel" activeClass="active-tab" tabs={[
						{
							name:"general",
							title:__("General", "betterdocs"),
							className:"eb-tab styles"
						},
                        {
							name:"styles",
							title:__("Styles", "betterdocs"),
							className:"eb-tab styles"
						}
					]}>
						{
							(tab) =>  {
								return (
									<div className={"eb-tab-controls " + tab.name}>
                                        {
                                            tab?.name == 'general' && (
                                                <PanelBody title={__("General", "betterdocs")} initialOpen={true}>
                                                    <SelectControl
                                                        label={__(
                                                            "Select Layout",
                                                            "betterdocs",
                                                        )}
                                                        value={layout}
                                                        options={BETTERDOCS_SOCIAL_SHARE_LAYOUTS}
                                                        onChange={(newLayout) =>
                                                            setAttributes({
                                                                layout: newLayout,
                                                            })
                                                        }
                                                    />
                                                </PanelBody>
                                            )
                                        }
										{
											( tab.name === "styles" && (
												<>
													<PanelBody title={__("Social Share Title", "betterdocs")} initialOpen={true}>
														<TextControl
															label={(__("Share Title Content", "betterdocs"))}
															value={share_title}
															onChange={((value) => setAttributes({share_title:value}))}
														/>
														<SelectControl
															label={__("Title Tag", "betterdocs")}
															value={share_title_tag}
															options={[
																{ label: 'H1', value: 'h1' },
																{ label: 'H2', value: 'h2' },
																{ label: 'H3', value: 'h3' },
																{ label: 'H4', value: 'h4' },
																{ label: 'H5', value: 'h5' },
																{ label: 'H6', value: 'h6' },
															]}
															onChange={(value) => setAttributes({share_title_tag: value})}
														/>
														<TypographyDropdown
															baseLabel={__("Title Typography", "betterdocs")}
															resRequiredProps={resRequiredProps}
															typographyPrefixConstant={layout== 'layout-1' ? typoShareTitle : typoShareTitle_Layout_2}
															defaultFontSize={layout== 'layout-1' ? 15 : 32}
														/>
														<BaseControl label={__("Content Alignment", "betterdocs")} id="eb-advance-heading-alignment">
															<ButtonGroup id="eb-advance-heading-alignment">
																{SOCIAL_SHARE_CONTENT_ALIGN.map((item, key) => (
																	<Button
																		key={key}
																		isPrimary={layout == 'layout-1' ? share_content_align === item.value : typoShareTitle_Layout_2 == item.value}
																		isSecondary={layout == 'layout-1' ? share_content_align !== item.value : typoShareTitle_Layout_2 != item.value}
																		onClick={() => {
                                                                            if( layout == 'layout-1' ) {
                                                                                setAttributes({
                                                                                    share_content_align: item.value,
                                                                                })
                                                                            } else {
                                                                                setAttributes({
                                                                                    share_content_align_layout_2: item.value,
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
															label={__('Title Color', 'betterdocs')}
															color={layout == 'layout-1' ? share_title_color : share_title_color_layout_2}
															onChange={(color) => {
                                                                if( layout == 'layout-1')  {
                                                                    setAttributes({share_title_color: color})
                                                                }else {
                                                                    setAttributes({share_title_color_layout_2: color})
                                                                }
                                                            }}
														/>
														<ColorControl
															label={__('Title Hover Color', 'betterdocs')}
															color={layout == 'layout-1' ? share_title_hover_color : share_title_hover_color_layout_2}
															onChange={(color) => {
                                                                if( layout == 'layout-1')  {
                                                                    setAttributes({share_title_hover_color: color})
                                                                }else {
                                                                    setAttributes({share_title_hover_color_layout_2: color})
                                                                }
                                                            }}
														/>
														<ResponsiveDimensionsControl
															baseLabel={__("Title Padding", "betterdocs")}
															resRequiredProps={resRequiredProps}
															controlName={layout == 'layout-1' ? SOCIAL_SHARE_TITLE_PADDING : SOCIAL_SHARE_TITLE_PADDING_LAYOUT_2}
														/>
														<ResponsiveDimensionsControl
															baseLabel={__("Title Margin", "betterdocs")}
															resRequiredProps={resRequiredProps}
															controlName={layout == 'layout-1' ? SOCIAL_SHARE_TITLE_MARGIN : SOCIAL_SHARE_TITLE_MARGIN_LAYOUT_2}
														/>
													</PanelBody>
													<PanelBody title={__("Social Box Wrapper", "betterdocs")} initialOpen={false}>
														<ColorControl
															label={__("Box Background Color")}
															color={layout == 'layout-1' ? share_box_wrapper_color : share_box_wrapper_color_layout_2}
															onChange={(color) => {
                                                                if( layout == 'layout-1' ) {
                                                                    setAttributes({share_box_wrapper_color:color})
                                                                } else {
                                                                    setAttributes({share_box_wrapper_color_layout_2:color})
                                                                }
                                                            }}
														/>
														<ResponsiveRangeController
															baseLabel={__("Box Height", "betterdocs")}
															resRequiredProps={resRequiredProps}
															controlName={layout == 'layout-1' ? SOCIAL_SHARE_BOX_HEIGHT : SOCIAL_SHARE_BOX_HEIGHT_LAYOUT_2}
															min={0}
															max={500}
															step={1}
														/>
														<ResponsiveRangeController
															baseLabel={__("Box Width", "betterdocs")}
															resRequiredProps={resRequiredProps}
															controlName={layout == 'layout-1' ? SOCIAL_SHARE_BOX_WIDTH : SOCIAL_SHARE_BOX_WIDTH_LAYOUT_2}
															min={0}
															max={1000}
															step={1}
														/>
														<ResponsiveDimensionsControl
															baseLabel={__("Box Padding", "betterdocs")}
															resRequiredProps={resRequiredProps}
															controlName={layout == 'layout-1' ? SOCIAL_SHARE_BOX_PADDING : SOCIAL_SHARE_BOX_PADDING_LAYOUT_2}
														/>
														<ResponsiveDimensionsControl
															baseLabel={__("Box Margin", "betterdocs")}
															resRequiredProps={resRequiredProps}
															controlName={layout == 'layout-1' ? SOCIAL_SHARE_BOX_MARGIN : SOCIAL_SHARE_BOX_MARGIN_LAYOUT_2}
														/>
														<BorderShadowControl
															controlName={layout == 'layout-1' ? SOCIAL_SHARE_BOX_BORDER : SOCIAL_SHARE_BOX_BORDER_LAYOUT_2}
															resRequiredProps={resRequiredProps}
														/>
													</PanelBody>
													<PanelBody title={__("Social Icons", "betterdocs")} initialOpen={false}>
														<ToggleControl
															label={__("Show Facebook Icon", "betterdocs")}
															checked={show_facebook_icon}
															onChange={() => {
																setAttributes({
																	show_facebook_icon: !show_facebook_icon
																});
															}}
														/>
														<ToggleControl
															label={__("Show Twitter Icon", "betterdocs")}
															checked={show_twitter_icon}
															onChange={() => {
																setAttributes({
																	show_twitter_icon: !show_twitter_icon
																});
															}}
														/>
														<ToggleControl
															label={__("Show LinkedIn Icon", "betterdocs")}
															checked={show_linkedin_icon}
															onChange={() => {
																setAttributes({
																	show_linkedin_icon: !show_linkedin_icon
																});
															}}
														/>
														<ToggleControl
															label={__("Show Pinterest Icon", "betterdocs")}
															checked={show_pinterest_icon}
															onChange={() => {
																setAttributes({
																	show_pinterest_icon: !show_pinterest_icon
																});
															}}
														/>
														<ResponsiveDimensionsControl
															baseLabel={__("Icon Padding", "betterdocs")}
															resRequiredProps={resRequiredProps}
															controlName={layout == 'layout-1' ? SOCIAL_SHARE_ICON_PADDING : SOCIAL_SHARE_ICON_PADDING_LAYOUT_2}
														/>
														<ResponsiveDimensionsControl
															baseLabel={__("Icon Margin", "betterdocs")}
															resRequiredProps={resRequiredProps}
															controlName={layout == 'layout-1' ? SOCIAL_SHARE_ICON_MARGIN : SOCIAL_SHARE_ICON_MARGIN_LAYOUT_2}
														/>
                                                        {layout == 'layout-2' && <>
                                                            <ResponsiveRangeController
                                                                baseLabel={__('Icon Width', 'betterdocs')}
                                                                controlName={SOCIAL_SHARE_ICON_WIDTH_LAYOUT_2}
                                                                resRequiredProps={resRequiredProps}
                                                                min={0}
                                                                max={100}
                                                                step={1}
                                                            />
                                                            <ResponsiveRangeController
                                                                baseLabel={__('Icon Height', 'betterdocs')}
                                                                controlName={SOCIAL_SHARE_ICON_HEIGHT_LAYOUT_2}
                                                                resRequiredProps={resRequiredProps}
                                                                min={0}
                                                                max={100}
                                                                step={1}
                                                            />
                                                            <ResponsiveRangeController
                                                                baseLabel={__('Icon Outer Width', 'betterdocs')}
                                                                controlName={SOCIAL_SHARE_ICON_OUTER_WIDTH_LAYOUT_2}
                                                                resRequiredProps={resRequiredProps}
                                                                min={0}
                                                                max={100}
                                                                step={1}
                                                            />
                                                            <ResponsiveRangeController
                                                                baseLabel={__('Icon Outer Height', 'betterdocs')}
                                                                controlName={SOCIAL_SHARE_ICON_OUTER_HEIGHT_LAYOUT_2}
                                                                resRequiredProps={resRequiredProps}
                                                                min={0}
                                                                max={100}
                                                                step={1}
                                                            />
                                                        </>}
													</PanelBody>
												</>
												)
											)
										}
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
