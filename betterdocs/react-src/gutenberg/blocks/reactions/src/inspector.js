import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
    TabPanel,
    PanelBody,
    TextControl,
    BaseControl,
    SelectControl,
    ToggleControl,
    Button
} from '@wordpress/components';

import { MediaPlaceholder } from '@wordpress/block-editor';
import upload from '../../../util/upload';
import cross from '../../../util/cross';
import objAttributes from './attributes';
import ColorControl from '../../../util/color-control';
import ResponsiveRangeController from '../../../util/responsive-range-control';
import ResponsiveDimensionsControl from '../../../util/dimensions-control-v2';
import TypographyDropdown from '../../../util/typography-control-v2';
import BorderShadowControl from '../../../util/border-shadow-control';
import { typoPrefix_reaction_icon_text_layout_3, typoPrefix_title, typoPrefix_title_layout_2, typoPrefix_title_layout_3 } from './typographyPrefixConstants';
import { REACTION_ICON_WIDTH, REACTION_TITLE_PADDING, REACTION_TITLE_MARGIN, REACTION_ICON_HEIGHT, REACTION_ICON_BORDER, REACTION_BOX_PADDING, REACTION_BOX_MARGIN, REACTION_BOX_BORDER, LAYOUT, REACTION_TITLE_PADDING_LAYOUT_2, REACTION_TITLE_MARGIN_LAYOUT_2, REACTION_ICON_WIDTH_LAYOUT_2, REACTION_ICON_HEIGHT_LAYOUT_2, REACTION_ICON_BORDER_LAYOUT_2, REACTION_BOX_PADDING_LAYOUT_2, REACTION_BOX_MARGIN_LAYOUT_2, REACTION_BOX_BORDER_LAYOUT_2, REACTION_TITLE_PADDING_LAYOUT_3, REACTION_TITLE_MARGIN_LAYOUT_3, REACTION_ICON_WIDTH_LAYOUT_3, REACTION_ICON_HEIGHT_LAYOUT_3, REACTION_ICON_BORDER_LAYOUT_3, REACTION_BOX_PADDING_LAYOUT_3, REACTION_BOX_MARGIN_LAYOUT_3, REACTION_BOX_BORDER_LAYOUT_3 } from './constants';

const Inspector = ({attributes, setAttributes}) => {

	const { resOption, reaction_text, reaction_text_tag, reaction_text_color, reaction_text_color_layout_2, reaction_icon_color, reaction_icon_text_color_layout_3, reaction_icon_hover_color, reaction_inner_icon_color, reaction_inner_icon_hover_color, reaction_box_color, reaction_box_color_layout_2, reaction_box_hover_color, layout, reaction_box_hover_color_layout_2, reaction_text_color_layout_3, reaction_box_color_layout_3, reaction_box_hover_color_layout_3, show_happy_icon, happy_icon_url, show_neutral_icon, neutral_icon_url, show_sad_icon, sad_icon_url } = attributes;

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
                            name: "styles",
							title: __("Styles", "betterdocs"),
							className: "eb-tab styles",
                        }
					]}>
						{
							(tab) => {
								return (
									<div className={"eb-tab-controls " + tab.name}>
                                        { tab.name === 'general' && (
                                            <PanelBody title={__("Layout", "betterdocs")} initialOpen={true}>
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
                                            </PanelBody>
                                        )}
										{
											tab.name === 'styles' && (
												<>
                                                    <PanelBody title={__("Reaction Box", "betterdocs")} initialOpen={true}>
                                                        <ColorControl
                                                            label={__("Background Color", "betterdocs")}
                                                            color={layout == 'layout-1' ? reaction_box_color : ( layout == 'layout-2' ? reaction_box_color_layout_2 : reaction_box_color_layout_3 )}
                                                            onChange={((color) =>{
                                                                if( layout == 'layout-1' ) {
                                                                    setAttributes({reaction_box_color:color});
                                                                }else if( layout == 'layout-2') {
                                                                    setAttributes({reaction_box_color_layout_2:color});
                                                                } else {
                                                                    setAttributes({reaction_box_color_layout_3:color});
                                                                }
                                                            })}
                                                        />
                                                        <ColorControl
                                                            label={__("Background Hover Color", "betterdocs")}
                                                            color={layout == 'layout-1' ? reaction_box_hover_color : ( layout == 'layout-2' ? reaction_box_hover_color_layout_2 : reaction_box_hover_color_layout_3 )}
                                                            onChange={((color) =>{
                                                                if( layout == 'layout-1' ) {
                                                                    setAttributes({reaction_box_hover_color:color})
                                                                } else if( layout == 'layout-2' ) {
                                                                    setAttributes({reaction_box_hover_color_layout_2:color})
                                                                } else {
                                                                    setAttributes({reaction_box_hover_color_layout_3:color})
                                                                }
                                                            })}
                                                        />
                                                        <ResponsiveDimensionsControl
                                                            baseLabel={__("Box Padding", "betterdocs")}
                                                            resRequiredProps={resRequiredProps}
                                                            controlName={layout == 'layout-1' ? REACTION_BOX_PADDING : ( layout == 'layout-2' ? REACTION_BOX_PADDING_LAYOUT_2 : REACTION_BOX_PADDING_LAYOUT_3 )}
                                                        />
                                                        <ResponsiveDimensionsControl
                                                            baseLabel={__("Box Margin", "betterdocs")}
                                                            resRequiredProps={resRequiredProps}
                                                            controlName={layout == 'layout-1' ? REACTION_BOX_MARGIN : ( layout == 'layout-2' ? REACTION_BOX_MARGIN_LAYOUT_2 :  REACTION_BOX_MARGIN_LAYOUT_3 )}
                                                        />
                                                        <BaseControl>
                                                            <h3 className='eb-control-title'>
                                                                {__("Border", "betterdocs")}
                                                            </h3>
                                                        </BaseControl>
                                                        <BorderShadowControl
                                                            controlName={layout == 'layout-1' ? REACTION_BOX_BORDER : ( layout == 'layout-2' ? REACTION_BOX_BORDER_LAYOUT_2 : REACTION_BOX_BORDER_LAYOUT_3)}
                                                            resRequiredProps={resRequiredProps}
                                                        />
													</PanelBody>
													<PanelBody title={__("Reaction Title", "betterdocs")} initialOpen={false}>
														<TextControl
															label={__("Title Content", "betterdocs")}
															value={reaction_text}
															onChange={(value) =>
																setAttributes({
																	reaction_text:value,
																})
															}
														>
														</TextControl>
														<SelectControl
															label={__("Title Tag", "betterdocs")}
															value={reaction_text_tag}
															options={[
																{ label: 'H1', value: 'h1' },
																{ label: 'H2', value: 'h2' },
																{ label: 'H3', value: 'h3' },
																{ label: 'H4', value: 'h4' },
																{ label: 'H5', value: 'h5' },
																{ label: 'H6', value: 'h6' },
															]}
															onChange={(value) => setAttributes({reaction_text_tag: value})}
														/>
														<ColorControl
															label={__('Title Color', 'betterdocs')}
															color={layout == 'layout-1' ? reaction_text_color : ( layout == 'layout-2' ? reaction_text_color_layout_2 : reaction_text_color_layout_3 )}
															onChange={((color) => {
                                                                if( layout == 'layout-1' ) {
                                                                    setAttributes({reaction_text_color: color});
                                                                } else if( layout == 'layout-2' ) {
                                                                    setAttributes({reaction_text_color_layout_2:color})
                                                                } else {
                                                                    setAttributes({reaction_text_color_layout_3:color})
                                                                }
                                                            })}
														/>
														<TypographyDropdown
															baseLabel={__('Typography', 'betterdocs')}
															typographyPrefixConstant={layout == 'layout-1' ? typoPrefix_title : ( layout == 'layout-2' ? typoPrefix_title_layout_2 : typoPrefix_title_layout_3  )}
															resRequiredProps={resRequiredProps}
															defaultFontSize={layout == 'layout-1' ? 15 : (layout == 'layout-2' ? 18 : 15)}
														/>
														<ResponsiveDimensionsControl
															baseLabel={__("Title Padding", "betterdocs")}
															resRequiredProps={resRequiredProps}
															controlName={layout == 'layout-1' ? REACTION_TITLE_PADDING : ( layout == 'layout-2' ?  REACTION_TITLE_PADDING_LAYOUT_2 : REACTION_TITLE_PADDING_LAYOUT_3)}
														/>
														<ResponsiveDimensionsControl
															baseLabel={__("Title Margin", "betterdocs")}
															resRequiredProps={resRequiredProps}
															controlName={layout == 'layout-1' ? REACTION_TITLE_MARGIN : ( layout == 'layout-2' ? REACTION_TITLE_MARGIN_LAYOUT_2 : REACTION_TITLE_MARGIN_LAYOUT_3 )}
														/>
													</PanelBody>
													<PanelBody title={__('Reaction Icon', 'betterdocs')} initialOpen={false}>
														<ResponsiveRangeController
															baseLabel={__('Icon Width', 'betterdocs')}
															controlName={layout == 'layout-1' ? REACTION_ICON_WIDTH : (layout == 'layout-2' ?  REACTION_ICON_WIDTH_LAYOUT_2 : REACTION_ICON_WIDTH_LAYOUT_3 )}
															resRequiredProps={resRequiredProps}
															min={0}
															max={100}
															step={1}
														/>
														<ResponsiveRangeController
															baseLabel={__('Icon Height', 'betterdocs')}
															controlName={layout == 'layout-1' ? REACTION_ICON_HEIGHT : ( layout == 'layout-2' ? REACTION_ICON_HEIGHT_LAYOUT_2 : REACTION_ICON_HEIGHT_LAYOUT_3 )}
															resRequiredProps={resRequiredProps}
															min={0}
															max={100}
															step={1}
														/>
														{layout == 'layout-1' && <><ColorControl
															label={__("Icon Color", "betterdocs")}
															color={reaction_icon_color}
															onChange={((color) => setAttributes({reaction_icon_color:color}))}
														/>
														<ColorControl
															label={__("Icon Hover Color", "betterdocs")}
															color={reaction_icon_hover_color}
															onChange={((color) => setAttributes({reaction_icon_hover_color:color}))}
														/>
														<ColorControl
															label={__("Inner Icon Color", "betterdocs")}
															color={reaction_inner_icon_color}
															onChange={((color) => setAttributes({reaction_inner_icon_color:color}))}
														/>
														<ColorControl
															label={__("Inner Icon Hover Color", "betterdocs")}
															color={reaction_inner_icon_hover_color}
															onChange={((color) => setAttributes({reaction_inner_icon_hover_color:color}))}
														/></>}
														<BaseControl>
															<h3 className='eb-control-title'>
																{__("Border", "betterdocs")}
															</h3>
														</BaseControl>
														<BorderShadowControl
															controlName={layout == 'layout-1' ? REACTION_ICON_BORDER : ( layout == 'layout-2' ? REACTION_ICON_BORDER_LAYOUT_2 : REACTION_ICON_BORDER_LAYOUT_3 )}
															resRequiredProps={resRequiredProps}
														/>
                                                        {layout == 'layout-3' &&
                                                            <>
                                                               <ColorControl
                                                                    label={__("Icon Text Color", "betterdocs")}
                                                                    color={reaction_icon_text_color_layout_3}
                                                                    onChange={((color) => setAttributes({reaction_icon_text_color_layout_3:color}))}
														       />
                                                               <TypographyDropdown
                                                                    baseLabel={__('Typography', 'betterdocs')}
                                                                    typographyPrefixConstant={typoPrefix_reaction_icon_text_layout_3}
                                                                    resRequiredProps={resRequiredProps}
                                                                    defaultFontSize={14}
														       />
                                                            </>
                                                        }
                                                        {
                                                            ( layout == 'layout-1' || layout == 'layout-2' || layout == 'layout-3' ) &&
                                                            <>
                                                                <ToggleControl
                                                                    label={__("Enable Happy", "betterdocs")}
                                                                    checked={show_happy_icon}
                                                                    onChange={() => {
                                                                        setAttributes({
                                                                            show_happy_icon: !show_happy_icon,
                                                                        });
                                                                    }}
                                                                />
                                                                {show_happy_icon && <>
                                                                    <MediaPlaceholder
                                                                        onSelect={(image) => {
                                                                            setAttributes({
                                                                                happy_icon_url:image?.url
                                                                            })
                                                                        }}
                                                                        value={happy_icon_url}
                                                                        accept="image/*"
                                                                        allowedTypes={["image"]}
                                                                        mediaLibraryButton={({ open }) => {
                                                                            return (
                                                                                <>
                                                                                    <Button
                                                                                        icon={upload}
                                                                                        variant="primary"
                                                                                        label={__('Add image from media')}
                                                                                        showTooltip
                                                                                        tooltipPosition="top center"
                                                                                        onClick={() => {
                                                                                            open();
                                                                                        }}
                                                                                    />
                                                                                    {happy_icon_url?.length > 0 && <div className="preview-wrapper-controller" style={{position:'relative'}}>
                                                                                        <img src={happy_icon_url} />
                                                                                        <div className="preview-wrapper" style={{position:'absolute', top:'0px', right:'0px', height:'30px', width:'30px', backgroundColor:'#1e1e1e', borderRadius:'5px', cursor:'pointer'}} onClick={(e) => {
                                                                                            setAttributes({
                                                                                                happy_icon_url:''
                                                                                            })
                                                                                        }}>
                                                                                            {cross()}
                                                                                        </div>
                                                                                    </div>}
                                                                                </>
                                                                            );
                                                                        }}
                                                                    />
                                                                </>}
                                                                <ToggleControl
                                                                    label={__("Enable Neutral", "betterdocs")}
                                                                    checked={show_neutral_icon}
                                                                    onChange={() => {
                                                                        setAttributes({
                                                                            show_neutral_icon: !show_neutral_icon,
                                                                        });
                                                                    }}
                                                                />
                                                                {show_neutral_icon && <>
                                                                    <MediaPlaceholder
                                                                        onSelect={(image) => {
                                                                            setAttributes({
                                                                                neutral_icon_url:image?.url
                                                                            })
                                                                        }}
                                                                        value={neutral_icon_url}
                                                                        accept="image/*"
                                                                        allowedTypes={["image"]}
                                                                        mediaLibraryButton={({ open }) => {
                                                                            return (
                                                                                <>
                                                                                    <Button
                                                                                        icon={upload}
                                                                                        variant="primary"
                                                                                        label={__('Add image from media')}
                                                                                        showTooltip
                                                                                        tooltipPosition="top center"
                                                                                        onClick={() => {
                                                                                            open();
                                                                                        }}
                                                                                    />
                                                                                    {neutral_icon_url?.length > 0 && <div className="preview-wrapper-controller" style={{position:'relative'}}>
                                                                                        <img src={neutral_icon_url} />
                                                                                        <div className="preview-wrapper" style={{position:'absolute', top:'0px', right:'0px', height:'30px', width:'30px', backgroundColor:'#1e1e1e', borderRadius:'5px', cursor:'pointer'}} onClick={(e) => {
                                                                                            setAttributes({
                                                                                                neutral_icon_url:''
                                                                                            })
                                                                                        }}>
                                                                                            {cross()}
                                                                                        </div>
                                                                                    </div>}
                                                                                </>
                                                                            );
                                                                        }}
                                                                    />
                                                                </>}
                                                                <ToggleControl
                                                                    label={__("Enable Sad", "betterdocs")}
                                                                    checked={show_sad_icon}
                                                                    onChange={() => {
                                                                        setAttributes({
                                                                            show_sad_icon: !show_sad_icon,
                                                                        });
                                                                    }}
                                                                />
                                                                {show_sad_icon && <>
                                                                    <MediaPlaceholder
                                                                        onSelect={(image) => {
                                                                            setAttributes({
                                                                                sad_icon_url:image?.url
                                                                            })
                                                                        }}
                                                                        value={sad_icon_url}
                                                                        accept="image/*"
                                                                        allowedTypes={["image"]}
                                                                        mediaLibraryButton={({ open }) => {
                                                                            return (
                                                                                <>
                                                                                    <Button
                                                                                        icon={upload}
                                                                                        variant="primary"
                                                                                        label={__('Add image from media')}
                                                                                        showTooltip
                                                                                        tooltipPosition="top center"
                                                                                        onClick={() => {
                                                                                            open();
                                                                                        }}
                                                                                    />
                                                                                    {sad_icon_url?.length > 0 && <div className="preview-wrapper-controller" style={{position:'relative'}}>
                                                                                        <img src={sad_icon_url} />
                                                                                        <div className="preview-wrapper" style={{position:'absolute', top:'0px', right:'0px', height:'30px', width:'30px', backgroundColor:'#1e1e1e', borderRadius:'5px', cursor:'pointer'}} onClick={(e) => {
                                                                                            setAttributes({
                                                                                                sad_icon_url:''
                                                                                            })
                                                                                        }}>
                                                                                            {cross()}
                                                                                        </div>
                                                                                    </div>}
                                                                                </>
                                                                            );
                                                                        }}
                                                                    />
                                                                </>}
                                                            </>
                                                        }
													</PanelBody>
												</>
											)
										}
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
