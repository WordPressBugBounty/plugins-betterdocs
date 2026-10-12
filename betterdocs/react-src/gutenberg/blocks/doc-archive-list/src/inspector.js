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
import { ARCHIVE_DOC_ORDERBY, ARCHIVE_DOC_ORDER, ARCHIVE_ICON_WIDTH, ARCHIVE_ICON_HEIGHT, LIST_TWO_ICON_WIDTH, LIST_TWO_ICON_HEIGHT, LAYOUT_OPTIONS, LIST_THREE_ICON_WIDTH, LIST_THREE_ICON_HEIGHT, LAST_UPDATED_BACKGROUND_LAYOUT_THREE, LIST_ICON_BACKGROUND_LAYOUT_THREE, PAGINATION_BACKGROUND_COLOR_LAYOUT_1, PAGINATION_BACKGROUND_COLOR_LAYOUT_3, PAGINATION_HEIGHT_LAYOUT_1_3, PAGINATION_WIDTH_LAYOUT_1_3, PAGINATION_PADDING_1_3, PAGINATION_MARGIN_1_3, ALIGNMENT_VALUES, ARCHIVE_LIST_WRAPPER_BACKGROUND, ARCHIVE_LIST_WRAPPER_BACKGROUND_LAYOUT_2, ARCHIVE_LIST_WRAPPER_BACKGROUND_LAYOUT_3, LAYOUT_2_WRAPPER_PADDING, LAYOUT_2_WRAPPER_MARGIN, CONTAINER_PADDING, CONTAINER_MARGIN, LIST_ITEM_SPACING, LIST_AREA_PADDING, TITLE_MARGIN, TITLE_PADDING, EXCERPT_MARGIN, EXCERPT_PADDING, DATE_MARGIN, DATE_PADDING } from './constants';
import TypographyDropdown from '../../../util/typography-control-v2';
import { TYPO_ARCHIVE_LIST, TYPO_DESCRIPTION, TYPO_ARCHIVE_TITLE, TYPO_ARCHIVE_LIST_TITLE_TWO, TYPO_DESCRIPTION_TWO, TYPO_ARCHIVE_LIST_TITLE_THREE, TYPO_EXCEPRT_LAYOUT_THREE, LAST_UPDATED_TIME_TYPO, TYPO_PAGINATION } from './typographyPrefixConstants';
import ColorControl from "../../../util/color-control";
import ResponsiveRangeController from "../../../util/responsive-range-control";
import FontIconPicker from "@fonticonpicker/react-fonticonpicker";
import faIcons from '../../../util/faIcons';
import { applyFilters } from '@wordpress/hooks';
import cross from '../../../util/cross';
import upload from '../../../util/upload';
import BackgroundControl from "../../../util/background-control";
import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";

import { MediaPlaceholder } from '@wordpress/block-editor';


const Inspector = ( { attributes, setAttributes }) => {
	let { orderby, order, pagination_color, pagination_active_color, pagination_active_border_color, nested_subcategory, pagination, postsPerPageLayoutTwo, last_updated_time_color, resOption, list_color, layout, list_hover_color, list_icon_color, list_icon_hover_color, list_description_color, list_title_color, list_color_layout_two, list_exceprt_color_layout_three, list_title_color_layout_three, list_title_hover_color_layout_three, list_icon_color_layout_three, list_icon_hover_color_layout_three, list_hover_color_layout_two, list_icon_color_layout_two, list_icon_hover_color_two, list_description_color_layout_two, list_icon, listIconImageUrl, pagination_alignment_layout_1, pagination_alignment_layout_3, listTitleTag, listEntryHeadingTag } = attributes;

    let layoutOptions = [...LAYOUT_OPTIONS];

    if( betterDocsBlocksHelper?.is_pro_active !='1' ) {
        layoutOptions = layoutOptions?.filter((value) => {
            return value?.value != 'layout-2';
        });
    }

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
						name: "styles",
						title: __("Style", "betterdocs"),
						className: "eb-tab styles",
						}
					]}
				>
					{(tab) => {
						return (
							<div className={"eb-tab-controls " + tab.name}>
								{tab.name === "general" && (
									<>
										{layout === 'layout-1' && (
											<PanelBody title={__("Entry Heading", "betterdocs")}>
												<SelectControl
													label={__("Entry Heading Tag", "betterdocs")}
													value={listEntryHeadingTag}
													options={[
														{ label: 'H1', value: 'h1' },
														{ label: 'H2', value: 'h2' },
														{ label: 'H3', value: 'h3' },
														{ label: 'H4', value: 'h4' },
														{ label: 'H5', value: 'h5' },
														{ label: 'H6', value: 'h6' },
														{ label: 'P', value: 'p' }
													]}
													onChange={(value) => {
														setAttributes({
															listEntryHeadingTag: value,
														});
													}}
												/>
											</PanelBody>
										)}
										<PanelBody title={__("Query", "betterdocs")}>
										<>
											 <SelectControl
												label={__("Order By", "betterdocs")}
												value={orderby}
												options={ARCHIVE_DOC_ORDERBY}
												onChange={(newOrderby) =>
													setAttributes({
														orderby: newOrderby,
													})
												}
											/>
											{orderby != 'betterdocs_order' && <SelectControl
												label={__("Order", "betterdocs")}
												value={order}
												options={ARCHIVE_DOC_ORDER}
												onChange={(newOrder) =>
													setAttributes({
														order: newOrder,
													})
												}
											/>}
                                            <SelectControl
                                                label={__("Select Layout", "betterdocs")}
                                                value={layout}
                                                options={layoutOptions}
                                                onChange={(newLayout) =>
                                                    setAttributes({
                                                        layout: newLayout,
                                                    })
                                                }
                                            />
											{(layout == 'layout-2' || layout == 'layout-3' || layout == 'layout-4') && <SelectControl
												label={__("Title Tag", "betterdocs")}
												value={listTitleTag}
												options={[
													{ label: 'H1', value: 'h1' },
													{ label: 'H2', value: 'h2' },
													{ label: 'H3', value: 'h3' },
													{ label: 'H4', value: 'h4' },
													{ label: 'H5', value: 'h5' },
													{ label: 'H6', value: 'h6' },
													{ label: 'P', value: 'p' }
												]}
												onChange={(value) => {
													setAttributes({
														listTitleTag: value,
													});
												}}
											/>}
                                            {
												//applyFilters('archiveLayoutMode', '', [setAttributes, attributes])
											}
											{layout == 'layout-1' && <ToggleControl
												label={__("Nested Subcategory", "betterdocs")}
												checked={nested_subcategory}
												onChange={() => {
												setAttributes({
													nested_subcategory: !nested_subcategory,
												});
												}}
											/>}
                                            <ToggleControl
												label={__("Enable Pagination", "betterdocs")}
												checked={pagination}
												onChange={() => {
                                                    setAttributes({
                                                        pagination: !pagination,
                                                    });
												}}
											/>
											{pagination &&
												<TextControl
												label={__("Posts Per Page", "betterdocs")}
												type="number"
												value={postsPerPageLayoutTwo}
												onChange={(value) => {
													setAttributes({
														postsPerPageLayoutTwo: parseInt(value),
													});
												}}
											/>}
										</>
									</PanelBody>
									</>
								)}
								{
									tab.name == 'styles' && (
										<>
                                            {/* Container Section */}
                                            <PanelBody title={__("Container Section", "betterdocs")}>
                                                <ResponsiveDimensionsControl
                                                    baseLabel={__("Padding", "betterdocs")}
                                                    controlName={CONTAINER_PADDING}
                                                    resRequiredProps={resRequiredProps}
                                                />
                                                <ResponsiveDimensionsControl
                                                    baseLabel={__("Margin", "betterdocs")}
                                                    controlName={CONTAINER_MARGIN}
                                                    resRequiredProps={resRequiredProps}
                                                />
                                            </PanelBody>

											<PanelBody title={__("List Style", "betterdocs")}>
                                            {layout != 'layout-2' && layout != 'layout-3' && layout != 'layout-4' && <MediaPlaceholder
                                                onSelect={(image) => {
                                                    setAttributes({
                                                        listIconImageUrl:image?.url
                                                    })
                                                }}
                                                value={listIconImageUrl}
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
                                                            {listIconImageUrl?.length > 0 && <div className="preview-wrapper-controller" style={{position:'relative'}}>
                                                                <img src={listIconImageUrl} />
                                                                <div className="preview-wrapper" style={{position:'absolute', top:'0px', right:'0px', height:'30px', width:'30px', backgroundColor:'#1e1e1e', borderRadius:'5px', cursor:'pointer'}} onClick={(e) => {
                                                                    setAttributes({
                                                                        listIconImageUrl:''
                                                                    })
                                                                }}>
                                                                    {cross()}
                                                                </div>
                                                            </div>}
                                                        </>
                                                    );
                                                }}
                                            />}
                                                {listIconImageUrl?.length == 0 && layout != 'layout-2' && layout != 'layout-3' && layout != 'layout-4' && <><BaseControl>
                                                    <h3 className="eb-control-title">
                                                        {__("Icon", "betterdocs")}
                                                    </h3>
                                                </BaseControl>
                                                <FontIconPicker
                                                    icons={faIcons}
                                                    value={list_icon}
                                                    onChange={(list_icon) => setAttributes({ list_icon })}
                                                    appendTo="body"
                                                    closeOnSelect
                                                /></>}
												<TypographyDropdown
													baseLabel={__("Typography", "betterdocs")}
													typographyPrefixConstant={layout == 'layout-1' ? TYPO_ARCHIVE_LIST : ( layout == 'layout-2' ? TYPO_ARCHIVE_LIST_TITLE_TWO : TYPO_ARCHIVE_LIST_TITLE_THREE )}
													resRequiredProps={resRequiredProps}
												/>
                                                {layout == 'layout-2' && <>
                                                    <ResponsiveDimensionsControl
                                                        baseLabel={__("Padding", "betterdocs")}
                                                        resRequiredProps={resRequiredProps}
                                                        controlName={LAYOUT_2_WRAPPER_PADDING}
                                                    />
                                                    <ResponsiveDimensionsControl
                                                        baseLabel={__("Margin", "betterdocs")}
                                                        resRequiredProps={resRequiredProps}
                                                        controlName={LAYOUT_2_WRAPPER_MARGIN}
                                                    />
                                                </>}
                                                {(layout == 'layout-3' || layout == 'layout-4') && <>
                                                    <ResponsiveDimensionsControl
                                                        baseLabel={__("Title Margin", "betterdocs")}
                                                        controlName={TITLE_MARGIN}
                                                        resRequiredProps={resRequiredProps}
                                                    />
                                                    <ResponsiveDimensionsControl
                                                        baseLabel={__("Title Padding", "betterdocs")}
                                                        controlName={TITLE_PADDING}
                                                        resRequiredProps={resRequiredProps}
                                                    />
                                                </>}

												{layout == 'layout-1' && <ColorControl
													label={__("Color", "betterdocs")}
													color={list_color}
													onChange={(color) => {
                                                        setAttributes({list_color:color})
													}}
												/>}

												{layout == 'layout-2' && <ColorControl
													label={__("Color", "betterdocs")}
													color={list_color_layout_two}
													onChange={(color) => {
                                                        setAttributes({list_color_layout_two:color})
													}}
												/>}
												{layout == 'layout-3' || layout == 'layout-4' && <ColorControl
													label={__("Color", "betterdocs")}
													color={list_title_color_layout_three}
													onChange={(color) => {
                                                        setAttributes({list_title_color_layout_three:color})
													}}
												/>}
												<BackgroundControl
													controlName={
														layout == 'layout-1' ? ARCHIVE_LIST_WRAPPER_BACKGROUND : ( layout == 'layout-2' ?  ARCHIVE_LIST_WRAPPER_BACKGROUND_LAYOUT_2 : ARCHIVE_LIST_WRAPPER_BACKGROUND_LAYOUT_3 )
													}
													resRequiredProps={resRequiredProps}
													noOverlay={true}
												/>
												<ColorControl
													label={__("Hover Color", "betterdocs")}
													color={layout == 'layout-1' ? list_hover_color : (layout == 'layout-2' ? list_hover_color_layout_two : list_title_hover_color_layout_three)}
													onChange={(color) => {
                                                        if( layout == 'layout-1' ) {
														    setAttributes({list_hover_color:color})
                                                        } else if( layout == 'layout-2' ){
                                                            setAttributes({list_hover_color_layout_two:color})
                                                        } else {
                                                            setAttributes({list_title_hover_color_layout_three:color})
                                                        }
													}}
												/>
												<ColorControl
													label={__("Icon Color", "betterdocs")}
													color={layout == 'layout-1' ? list_icon_color : ( layout == 'layout-2' ? list_icon_color_layout_two : list_icon_color_layout_three)}
													onChange={(color) => {
                                                        if( layout == 'layout-1' ) {
														    setAttributes({list_icon_color:color});
                                                        } else if( layout == 'layout-2'){
                                                            setAttributes({list_icon_color_layout_two:color});
                                                        } else {
                                                            setAttributes({list_icon_color_layout_three: color});
                                                        }
													}}
												/>
												<ColorControl
													label={__("Icon Hover Color", "betterdocs")}
													color={layout == 'layout-1' ? list_icon_hover_color : ( layout == 'layout-2' ? list_icon_hover_color_two : list_icon_hover_color_layout_three)}
													onChange={(color) => {
                                                        if( layout == 'layout-1' ) {
														    setAttributes({list_icon_hover_color:color})
                                                        } else if( layout == 'layout-2' ) {
                                                            setAttributes({list_icon_hover_color_two:color})
                                                        } else {
                                                            setAttributes({list_icon_hover_color_layout_three:color})
                                                        }
													}}
												/>
												<ResponsiveRangeController
													baseLabel={__("Icon Width", "betterdocs")}
													controlName={layout == 'layout-1' ? ARCHIVE_ICON_WIDTH : (layout == 'layout-2' ? LIST_TWO_ICON_WIDTH : LIST_THREE_ICON_WIDTH)}
													resRequiredProps={resRequiredProps}
													min={1}
													max={100}
													step={1}
												/>
												<ResponsiveRangeController
													baseLabel={__("Icon Height", "betterdocs")}
													controlName={layout == 'layout-1' ? ARCHIVE_ICON_HEIGHT : ( layout == 'layout-2' ? LIST_TWO_ICON_HEIGHT : LIST_THREE_ICON_HEIGHT )}
													resRequiredProps={resRequiredProps}
													min={1}
													max={100}
													step={1}
												/>
                                                {layout == 'layout-3' && <BackgroundControl
                                                    controlName={LIST_ICON_BACKGROUND_LAYOUT_THREE}
                                                    resRequiredProps={resRequiredProps}
                                                    noOverlay={true}
										        />}
                                                {layout == 'layout-4' && <ResponsiveRangeController
													baseLabel={__("Icon Width", "betterdocs")}
													controlName={LIST_THREE_ICON_WIDTH}
													resRequiredProps={resRequiredProps}
													min={1}
													max={100}
													step={1}
												/>}
                                                {layout == 'layout-4' && <ResponsiveRangeController
													baseLabel={__("Icon Height", "betterdocs")}
													controlName={LIST_THREE_ICON_HEIGHT}
													resRequiredProps={resRequiredProps}
													min={1}
													max={100}
													step={1}
												/>}
                                                {layout == 'layout-4' && <BackgroundControl
                                                    controlName={LIST_ICON_BACKGROUND_LAYOUT_THREE}
                                                    resRequiredProps={resRequiredProps}
                                                    noOverlay={true}
										        />}

												<BaseControl>
													<h3 className="eb-control-title">
														{ layout == 'layout-1' || layout == 'layout-2' ?__("Description", "betterdocs") : __('Excerpt', 'betterdocs')}
													</h3>
												</BaseControl>
												<ColorControl
													label={layout == 'layout-1' || layout == 'layout-2' ? __("Description Color", "betterdocs") : __('Excerpt Color', "betterdocs")}
													color={layout == 'layout-1' ? list_description_color : (layout == 'layout-2' ? list_description_color_layout_two : list_exceprt_color_layout_three )}
													onChange={(color) => {
                                                        if( layout == 'layout-1' ){
														    setAttributes({list_description_color:color})
                                                        } else if( layout == 'layout-2' ) {
                                                            setAttributes({list_description_color_layout_two:color})
                                                        } else {
                                                            setAttributes({list_exceprt_color_layout_three:color})
                                                        }
													}}
												/>
												<TypographyDropdown
													baseLabel={layout == 'layout-1' || layout == 'layout-2' ? __("Description Typography", "betterdocs") : __("Excerpt Typography", "betterdocs")}
													typographyPrefixConstant={layout == 'layout-1' ? TYPO_DESCRIPTION : ( layout == 'layout-2' ? TYPO_DESCRIPTION_TWO : TYPO_EXCEPRT_LAYOUT_THREE )}
													resRequiredProps={resRequiredProps}
												/>

                                                {/* Excerpt Spacing Controls for Layout 3 & 4 */}
                                                {(layout == 'layout-3' || layout == 'layout-4') && <>
                                                    <ResponsiveDimensionsControl
                                                        baseLabel={__("Excerpt Margin", "betterdocs")}
                                                        controlName={EXCERPT_MARGIN}
                                                        resRequiredProps={resRequiredProps}
                                                    />
                                                    <ResponsiveDimensionsControl
                                                        baseLabel={__("Excerpt Padding", "betterdocs")}
                                                        controlName={EXCERPT_PADDING}
                                                        resRequiredProps={resRequiredProps}
                                                    />
                                                </>}

                                                {/* List Spacing Controls for Layout 3 & 4 */}
                                                {(layout == 'layout-3' || layout == 'layout-4') && <>
                                                    <ResponsiveDimensionsControl
                                                        baseLabel={__("List Item Spacing", "betterdocs")}
                                                        controlName={LIST_ITEM_SPACING}
                                                        resRequiredProps={resRequiredProps}
                                                    />
                                                    <ResponsiveDimensionsControl
                                                        baseLabel={__("List Area Padding", "betterdocs")}
                                                        controlName={LIST_AREA_PADDING}
                                                        resRequiredProps={resRequiredProps}
                                                    />
                                                </>}
											</PanelBody>
											{layout == 'layout-1' && <PanelBody title={__("List Title", "betterdocs")}>
												<TypographyDropdown
													baseLabel={__("Typography", "betterdocs")}
													typographyPrefixConstant={TYPO_ARCHIVE_TITLE}
													resRequiredProps={resRequiredProps}
												/>
												<ColorControl
													label={__("Color", "betterdocs")}
													color={list_title_color}
													onChange={(color) => {
														setAttributes({list_title_color:color})
													}}
												/>
											</PanelBody>}
                                            {(layout == 'layout-3' || layout == 'layout-4') && <PanelBody title={__("Last Updated Time", "betterdocs")}>
												<TypographyDropdown
													baseLabel={__("Typography", "betterdocs")}
													typographyPrefixConstant={LAST_UPDATED_TIME_TYPO}
													resRequiredProps={resRequiredProps}
												/>
												<ColorControl
													label={__("Color", "betterdocs")}
													color={last_updated_time_color}
													onChange={(color) => {
														setAttributes({last_updated_time_color:color})
													}}
												/>
                                                {(layout == 'layout-3' || layout == 'layout-4') && <BackgroundControl
                                                    controlName={LAST_UPDATED_BACKGROUND_LAYOUT_THREE}
                                                    resRequiredProps={resRequiredProps}
                                                    noOverlay={true}
										        />}
                                                <ResponsiveDimensionsControl
                                                    baseLabel={__("Date Margin", "betterdocs")}
                                                    controlName={DATE_MARGIN}
                                                    resRequiredProps={resRequiredProps}
                                                />
                                                <ResponsiveDimensionsControl
                                                    baseLabel={__("Date Padding", "betterdocs")}
                                                    controlName={DATE_PADDING}
                                                    resRequiredProps={resRequiredProps}
                                                />
											</PanelBody>}
                                            {(( pagination && layout == 'layout-1' ) || ( pagination && layout == 'layout-3' ) || ( pagination && layout == 'layout-4' )) && <PanelBody title={__("Pagination", "betterdocs")}>
                                                <ResponsiveDimensionsControl
                                                    baseLabel={__("Padding", "betterdocs")}
                                                    resRequiredProps={resRequiredProps}
                                                    controlName={PAGINATION_PADDING_1_3}
                                                />
                                                <ResponsiveDimensionsControl
                                                    baseLabel={__("Margin", "betterdocs")}
                                                    resRequiredProps={resRequiredProps}
                                                    controlName={PAGINATION_MARGIN_1_3}
                                                />
                                                <BaseControl
                                                    label={__("Alignment")}
                                                    id="eb-button-group-alignment"
										        >
                                                    {layout == 'layout-1' && <ButtonGroup id="eb-button-group-alignment">
                                                        {ALIGNMENT_VALUES.map((item) => (
                                                            <Button
                                                                key={item.value}
                                                                isLarge
                                                                isPrimary={pagination_alignment_layout_1 === item.value}
                                                                isSecondary={pagination_alignment_layout_1 !== item.value}
                                                                onClick={() =>
                                                                    setAttributes({
                                                                        pagination_alignment_layout_1: item.value,
                                                                    })
                                                                }
                                                            >
                                                            {item.label}
                                                            </Button>
                                                        ))}
                                                    </ButtonGroup>}
                                                    {layout == 'layout-3' && <ButtonGroup id="eb-button-group-alignment">
                                                        {ALIGNMENT_VALUES.map((item) => (
                                                            <Button
                                                                key={item.value}
                                                                isLarge
                                                                isPrimary={pagination_alignment_layout_3 === item.value}
                                                                isSecondary={pagination_alignment_layout_3 !== item.value}
                                                                onClick={() =>
                                                                    setAttributes({
                                                                        pagination_alignment_layout_3: item.value,
                                                                    })
                                                                }
                                                            >
                                                            {item.label}
                                                            </Button>
                                                        ))}
                                                    </ButtonGroup>}
										        </BaseControl>
                                                <ColorControl
													label={__("Color", "betterdocs")}
													color={pagination_color}
													onChange={(color) => {
														setAttributes({pagination_color:color})
													}}
												/>
                                                <ColorControl
													label={__("Active Color", "betterdocs")}
													color={pagination_active_color}
													onChange={(color) => {
														setAttributes({pagination_active_color:color})
													}}
												/>
                                                <BackgroundControl
                                                    controlName={layout == 'layout-1' ? PAGINATION_BACKGROUND_COLOR_LAYOUT_1 : PAGINATION_BACKGROUND_COLOR_LAYOUT_3}
                                                    resRequiredProps={resRequiredProps}
                                                    noOverlay={true}
										        />
                                                <ResponsiveRangeController
													baseLabel={__("Height", "betterdocs")}
													controlName={PAGINATION_HEIGHT_LAYOUT_1_3}
													resRequiredProps={resRequiredProps}
													min={1}
													max={100}
													step={1}
												/>
                                                <ResponsiveRangeController
													baseLabel={__("Width", "betterdocs")}
													controlName={PAGINATION_WIDTH_LAYOUT_1_3}
													resRequiredProps={resRequiredProps}
													min={1}
													max={100}
													step={1}
												/>
                                                <ColorControl
													label={__("Active Border Color", "betterdocs")}
													color={pagination_active_border_color}
													onChange={(color) => {
														setAttributes({pagination_active_border_color:color})
													}}
												/>
                                                <TypographyDropdown
													baseLabel={__("Typography", "betterdocs")}
													typographyPrefixConstant={TYPO_PAGINATION}
													resRequiredProps={resRequiredProps}
												/>
                                            </PanelBody>}
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
