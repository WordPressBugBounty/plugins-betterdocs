import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { select } from '@wordpress/data';
import { useBlockProps } from '@wordpress/block-editor';

import { ReactionIcon, ReactionIcon2, ReactionIcon3, ReactionIconLayout2Happy, ReactionIconLayout2Neutral, ReactionIconLayout2Sad, ReactionIconLayout3Happy, ReactionIconLayout3Neutral, ReactionIconLayout3Sad } from "../icons/reactionIcon";
import { generateTypographyStyles, generateResponsiveRangeStyles, duplicateBlockIdFix, softMinifyCssStrings, isCssExists, generateDimensionsControlStyles, generateBorderShadowStyles } from "../../../util/helpers";
import { typoPrefix_reaction_icon_text_layout_3, typoPrefix_title, typoPrefix_title_layout_2, typoPrefix_title_layout_3 } from "./typographyPrefixConstants";
import { REACTION_ICON_WIDTH, REACTION_TITLE_PADDING, REACTION_TITLE_MARGIN, REACTION_ICON_HEIGHT, REACTION_ICON_BORDER, REACTION_BOX_PADDING, REACTION_BOX_MARGIN, REACTION_BOX_BORDER, REACTION_ICON_WIDTH_LAYOUT_2, REACTION_ICON_HEIGHT_LAYOUT_2, REACTION_TITLE_PADDING_LAYOUT_2, REACTION_TITLE_MARGIN_LAYOUT_2, REACTION_ICON_BORDER_LAYOUT_2, REACTION_BOX_PADDING_LAYOUT_2, REACTION_BOX_MARGIN_LAYOUT_2, REACTION_BOX_BORDER_LAYOUT_2, REACTION_ICON_WIDTH_LAYOUT_3, REACTION_ICON_HEIGHT_LAYOUT_3, REACTION_TITLE_PADDING_LAYOUT_3, REACTION_TITLE_MARGIN_LAYOUT_3, REACTION_ICON_BORDER_LAYOUT_3, REACTION_BOX_PADDING_LAYOUT_3, REACTION_BOX_MARGIN_LAYOUT_3, REACTION_BOX_BORDER_LAYOUT_3 } from './constants';
import Inspector from "./inspector";
import { usePreviewDeviceType } from '../../../hooks';

const edit = ({ attributes, setAttributes, isSelected, clientId }) => {
	const { resOption, reaction_text, reaction_text_tag, blockId, blockMeta, reaction_text_color, reaction_icon_text_color_layout_3, reaction_icon_color, reaction_icon_hover_color, reaction_inner_icon_color, reaction_inner_icon_hover_color, reaction_box_color, reaction_box_hover_color, layout, reaction_text_color_layout_2, reaction_box_color_layout_2, reaction_box_hover_color_layout_2, reaction_text_color_layout_3, reaction_box_color_layout_3, reaction_box_hover_color_layout_3, show_happy_icon, happy_icon_url, show_neutral_icon, neutral_icon_url, show_sad_icon, sad_icon_url } = attributes;

	const blockProps = useBlockProps({
		className: `eb-guten-block-main-parent-wrapper`
	});

	const { typoStylesDesktop:titleTypoDesk, typoStylesTab:titleTypoTab, typoStylesMobile:titleTypoMobile } = generateTypographyStyles({
		attributes,
		prefixConstant:layout == 'layout-1' ? typoPrefix_title : ( layout == 'layout-2' ? typoPrefix_title_layout_2 : typoPrefix_title_layout_3 )
	});

	const { rangeStylesDesktop:iconWidthDesk, rangeStylesTab:iconWidthTab, rangeStylesMobile:iconWidthMob } = generateResponsiveRangeStyles({
		controlName:layout == 'layout-1' ? REACTION_ICON_WIDTH : ( layout == 'layout-2' ? REACTION_ICON_WIDTH_LAYOUT_2 : REACTION_ICON_WIDTH_LAYOUT_3 ),
		property:"width",
		attributes
	});

	const { rangeStylesDesktop:iconHeightDesk, rangeStylesTab:iconHeightTab, rangeStylesMobile:iconHeightMob } = generateResponsiveRangeStyles({
		controlName:layout == 'layout-1' ? REACTION_ICON_HEIGHT : (  layout == 'layout-2' ? REACTION_ICON_HEIGHT_LAYOUT_2 : REACTION_ICON_HEIGHT_LAYOUT_3 ),
		property:"height",
		attributes
	});

	const { dimensionStylesDesktop:titlePaddingDesk, dimensionStylesTab:titlePaddingTab, dimensionStylesMobile:titlePaddingMob } = generateDimensionsControlStyles({
		controlName:layout == 'layout-1' ? REACTION_TITLE_PADDING : ( layout == 'layout-2' ? REACTION_TITLE_PADDING_LAYOUT_2 : REACTION_TITLE_PADDING_LAYOUT_3 ),
		styleFor:"padding",
		attributes
	});

	const { dimensionStylesDesktop:titleMarginDesk, dimensionStylesTab:titleMarginTab, dimensionStylesTab:titleMarginMob } = generateDimensionsControlStyles({
		controlName:layout == 'layout-1' ? REACTION_TITLE_MARGIN : ( layout == 'layout-2' ? REACTION_TITLE_MARGIN_LAYOUT_2 :  REACTION_TITLE_MARGIN_LAYOUT_3 ),
		styleFor:"margin",
		attributes
	})

	const { stylesDesktop:borderIconDeskStyle, stylesTab:borderIconTabStyle, stylesMobile:borderIconMobStyle, stylesHoverDesktop:borderIconHovDeskStyle, stylesHoverTab:borderIconHovTabStyle, stylesHoverMobile:borderIconHovMobStyle, transitionStyle: borderIconTransition } = generateBorderShadowStyles({
		controlName:layout == 'layout-1' ? REACTION_ICON_BORDER : ( layout == 'layout-2' ? REACTION_ICON_BORDER_LAYOUT_2 : REACTION_ICON_BORDER_LAYOUT_3 ),
		attributes
	});

	const { dimensionStylesDesktop:boxStylesDesk, dimensionStylesTab:boxStylesTab, dimensionStylesMobile:boxStylesMob} = generateDimensionsControlStyles({
		controlName:layout == 'layout-1' ? REACTION_BOX_PADDING : ( layout == 'layout-2' ? REACTION_BOX_PADDING_LAYOUT_2 : REACTION_BOX_PADDING_LAYOUT_3 ),
		styleFor:"padding",
		attributes
	});

	const { dimensionStylesDesktop:boxStylesMarginDesk, dimensionStylesTab:boxStylesMarginTab, dimensionStylesMobile:boxStylesMarginMob } = generateDimensionsControlStyles({
		controlName:layout == 'layout-1' ? REACTION_BOX_MARGIN : ( layout == 'layout-2' ? REACTION_BOX_MARGIN_LAYOUT_2 : REACTION_BOX_MARGIN_LAYOUT_3 ),
		styleFor:"margin",
		attributes
	})

	const { stylesDesktop:borderBoxDeskStyle, stylesTab:borderBoxTabStyle, stylesMobile:borderBoxMobStyle, stylesHoverDesktop:borderBoxHovDeskStyle, stylesHoverTab:borderBoxHovTabStyle, stylesHoverMobile:borderBoxHovMobStyle, transitionStyle: borderBoxTransition } = generateBorderShadowStyles({
		controlName:layout == 'layout-1'  ? REACTION_BOX_BORDER : (layout == 'layout-2' ? REACTION_BOX_BORDER_LAYOUT_2 : REACTION_BOX_BORDER_LAYOUT_3 ),
		attributes
	})

	const { typoStylesDesktop:reactionIconTextTypoDeskLayout3, typoStylesTab:reactionIconTextTypoTabLayout3, typoStylesMobile:reactionIconTextTypoMobLayout3 } = generateTypographyStyles({
		attributes,
		prefixConstant:typoPrefix_reaction_icon_text_layout_3
	});

	//Set the default screen type value to Desktop On Every Reload
    /**
     * resOption: __experimentalPreviewDeviceType()
     * Set Responsive Option
     */
    usePreviewDeviceType(setAttributes);

	//Generate Unique Block ID For Every Block Instance
	useEffect(() => {
		const BLOCK_PREFIX = "betterdocs-reactions";
		duplicateBlockIdFix({
		  BLOCK_PREFIX,
		  blockId,
		  setAttributes,
		  select,
		  clientId,
		});
	});

	const desktopStyles = `
		.betterdocs-article-reactions.${blockId}{
			background:${reaction_box_color};
			${boxStylesDesk}
			${boxStylesMarginDesk}
			${borderBoxDeskStyle}
			transition:${borderBoxTransition}
		}

		.betterdocs-article-reactions.${blockId}:hover{
			background:${reaction_box_hover_color};
			${borderBoxHovDeskStyle}
		}

		.betterdocs-article-reactions.${blockId} .betterdocs-article-reactions-heading .betterdocs-reactions-title-tag {
			${titlePaddingDesk}
			${titleMarginDesk}
			color:${reaction_text_color};
			${titleTypoDesk}
		}

		.betterdocs-article-reactions.${blockId} .betterdocs-article-reaction-links li a{
			${iconWidthDesk}
			${iconHeightDesk}
			background:${reaction_icon_color}
		}

		.betterdocs-article-reactions.${blockId} .betterdocs-article-reaction-links li a:hover{
			background:${reaction_icon_hover_color}
		}

		.betterdocs-article-reactions .betterdocs-article-reaction-links li a{
			${borderIconDeskStyle}
			transition:${borderIconTransition}
		}

		.betterdocs-article-reactions .betterdocs-article-reaction-links li a:hover{
			${borderIconHovDeskStyle}
		}

		.betterdocs-article-reactions .betterdocs-article-reaction-links li a svg path{
			fill:${reaction_inner_icon_color}
		}

		.betterdocs-article-reactions .betterdocs-article-reaction-links li a:hover svg path{
			fill:${reaction_inner_icon_hover_color}
		}

        .${blockId} .betterdocs-article-reactions-box{
			background:${reaction_box_color_layout_2};
			${boxStylesDesk}
			${boxStylesMarginDesk}
			${borderBoxDeskStyle}
			transition:${borderBoxTransition}
		}

		.${blockId} .betterdocs-article-reactions-box:hover{
			background:${reaction_box_hover_color_layout_2};
			${borderBoxHovDeskStyle}
		}

		.${blockId} .betterdocs-article-reactions-box p {
			${titlePaddingDesk}
			${titleMarginDesk}
			color:${reaction_text_color_layout_2};
			${titleTypoDesk}
		}

		.${blockId} .betterdocs-article-reactions-box .layout-2 li a.betterdocs-emoji{
			${iconWidthDesk}
			${iconHeightDesk}
		}

		.${blockId} .betterdocs-article-reactions-box .layout-2 li a.betterdocs-emoji{
			${borderIconDeskStyle}
			transition:${borderIconTransition}
		}

		.${blockId} .betterdocs-article-reactions-box .layout-2 li a.betterdocs-emoji:hover{
			${borderIconHovDeskStyle}
		}

        .${blockId}.betterdocs-article-reactions-blocks{
			background:${reaction_box_color_layout_3};
			${boxStylesDesk}
			${boxStylesMarginDesk}
			${borderBoxDeskStyle}
			transition:${borderBoxTransition}
		}

		.${blockId}.betterdocs-article-reactions-blocks:hover{
			background:${reaction_box_hover_color_layout_3};
			${borderBoxHovDeskStyle}
		}

		.${blockId}.betterdocs-article-reactions-blocks .betterdocs-article-reactions-sidebar .betterdocs-reactions-title-tag {
			${titlePaddingDesk}
			${titleMarginDesk}
			color:${reaction_text_color_layout_3};
			${titleTypoDesk}
		}

		.${blockId}.betterdocs-article-reactions-blocks .betterdocs-article-reactions-sidebar .betterdocs-article-reaction-links li a svg{
			${iconWidthDesk}
			${iconHeightDesk}
		}

		.${blockId}.betterdocs-article-reactions-blocks .betterdocs-article-reactions-sidebar .betterdocs-article-reaction-links li a svg{
			${borderIconDeskStyle}
			transition:${borderIconTransition}
		}

		.${blockId}.betterdocs-article-reactions-blocks .betterdocs-article-reactions-sidebar .betterdocs-article-reaction-links li a svg:hover{
			${borderIconHovDeskStyle}
		}

        .${blockId}.betterdocs-article-reactions-blocks .betterdocs-article-reactions-sidebar .betterdocs-article-reaction-links li .betterdocs-tooltip{
            color:${reaction_icon_text_color_layout_3};
            ${reactionIconTextTypoDeskLayout3}
        }
	`;

	const tabStyles = `
		.betterdocs-article-reactions.${blockId}{
			background:${reaction_box_color};
			${boxStylesTab}
			${boxStylesMarginTab}
			${borderBoxTabStyle}
		}

		.betterdocs-article-reactions.${blockId}:hover{
			background:${reaction_box_hover_color};
			${borderBoxHovTabStyle}
		}

		.betterdocs-article-reactions.${blockId} .betterdocs-article-reactions-heading .betterdocs-reactions-title-tag {
			${titlePaddingTab}
			${titleMarginTab}
			color:${reaction_text_color};
			${titleTypoTab}
		}

		.betterdocs-article-reactions.${blockId} .betterdocs-article-reaction-links li a{
			${iconWidthTab}
			${iconHeightTab}
			background:${reaction_icon_color}
		}

		.betterdocs-article-reactions .betterdocs-article-reaction-links li a{
			${borderIconTabStyle}
			${borderIconTransition}
		}

		.betterdocs-article-reactions .betterdocs-article-reaction-links li a:hover{
			${borderIconHovTabStyle}
		}

		.betterdocs-article-reactions.${blockId} .betterdocs-article-reaction-links li a:hover{
			background:${reaction_icon_hover_color}
			fill:${reaction_inner_icon_color}
		}


		.betterdocs-article-reactions .betterdocs-article-reaction-links li a:hover svg path{
			fill:${reaction_inner_icon_hover_color}
		}

        .${blockId} .betterdocs-article-reactions-box{
			${boxStylesTab}
			${boxStylesMarginTab}
			${borderBoxTabStyle}
		}

		.${blockId} .betterdocs-article-reactions-box:hover{
			${borderBoxHovTabStyle}
		}

		.${blockId} .betterdocs-article-reactions-box p {
			${titlePaddingTab}
			${titleMarginTab}
			${titleTypoTab}
		}

		.${blockId} .betterdocs-article-reactions-box .layout-2 li a.betterdocs-emoji{
			${iconWidthTab}
			${iconHeightTab}
		}

		.${blockId} .betterdocs-article-reactions-box .layout-2 li a.betterdocs-emoji{
			${borderIconTabStyle}
		}

		.${blockId} .betterdocs-article-reactions-box .layout-2 li a.betterdocs-emoji:hover{
			${borderIconHovTabStyle}
		}

        .${blockId}.betterdocs-article-reactions-blocks{
			background:${reaction_box_color_layout_3};
			${boxStylesTab}
			${boxStylesMarginTab}
			${borderBoxTabStyle}
		}

		.${blockId}.betterdocs-article-reactions-blocks:hover{
			${borderBoxHovTabStyle}
		}

		.${blockId}.betterdocs-article-reactions-blocks .betterdocs-article-reactions-sidebar h5 {
			${titlePaddingTab}
			${titleMarginTab}
			${titleTypoTab}
		}

		.${blockId}.betterdocs-article-reactions-blocks .betterdocs-article-reactions-sidebar .betterdocs-article-reaction-links li a svg{
			${iconWidthTab}
			${iconHeightTab}
		}

		.${blockId}.betterdocs-article-reactions-blocks .betterdocs-article-reactions-sidebar .betterdocs-article-reaction-links li a svg{
			${borderIconTabStyle}
		}

		.${blockId}.betterdocs-article-reactions-blocks .betterdocs-article-reactions-sidebar .betterdocs-article-reaction-links li a svg:hover{
			${borderIconHovTabStyle}
		}

        .${blockId}.betterdocs-article-reactions-blocks .betterdocs-article-reactions-sidebar .betterdocs-article-reaction-links li .betterdocs-tooltip{
            ${reactionIconTextTypoTabLayout3}
        }
	`;

	const mobileStyles = `
		.betterdocs-article-reactions.${blockId}{
			background:${reaction_box_color};
			${boxStylesMob}
			${boxStylesMarginMob}
			${borderBoxMobStyle}
		}

		.betterdocs-article-reactions.${blockId}:hover{
			background:${reaction_box_hover_color};
			${borderBoxHovMobStyle}
		}

		.betterdocs-article-reactions.${blockId} .betterdocs-article-reactions-heading .betterdocs-reactions-title-tag {
			${titlePaddingMob}
			${titleMarginMob}
			color:${reaction_text_color};
			${titleTypoMobile}
		}

		.betterdocs-article-reactions.${blockId} .betterdocs-article-reaction-links li a{
			${iconWidthMob}
			${iconHeightMob}
			background:${reaction_icon_color}
		}

		.betterdocs-article-reactions .betterdocs-article-reaction-links li a{
			${borderIconMobStyle}
			${borderIconTransition}
		}

		.betterdocs-article-reactions .betterdocs-article-reaction-links li a:hover{
			${borderIconHovMobStyle}
		}

		.betterdocs-article-reactions.${blockId} .betterdocs-article-reaction-links li a:hover{
			background:${reaction_icon_hover_color}
			fill:${reaction_inner_icon_color}
		}

		.betterdocs-article-reactions .betterdocs-article-reaction-links li a:hover svg path{
			fill:${reaction_inner_icon_hover_color}
		}

        .${blockId} .betterdocs-article-reactions-box{
			${boxStylesMob}
			${boxStylesMarginMob}
			${borderBoxMobStyle}
		}

		.${blockId} .betterdocs-article-reactions-box:hover{
			${borderBoxHovMobStyle}
		}

		.${blockId} .betterdocs-article-reactions-box p {
			${titlePaddingMob}
			${titleMarginMob}
			${titleTypoMobile}
		}

		.${blockId} .betterdocs-article-reactions-box .layout-2 li a.betterdocs-emoji{
			${iconWidthMob}
			${iconHeightMob}
		}

		.${blockId} .betterdocs-article-reactions-box .layout-2 li a.betterdocs-emoji{
			${borderIconMobStyle}
		}

		.${blockId} .betterdocs-article-reactions-box .layout-2 li a.betterdocs-emoji:hover{
			${borderIconHovMobStyle}
		}

        .${blockId}.betterdocs-article-reactions-blocks{
			background:${reaction_box_color_layout_3};
			${boxStylesMob}
			${boxStylesMarginMob}
			${borderBoxMobStyle}
		}

		.${blockId}.betterdocs-article-reactions-blocks:hover{
			${borderBoxHovMobStyle}
		}

		.${blockId}.betterdocs-article-reactions-blocks .betterdocs-article-reactions-sidebar h5 {
			${titlePaddingMob}
			${titleMarginMob}
			${titleTypoMobile}
		}

		.${blockId}.betterdocs-article-reactions-blocks .betterdocs-article-reactions-sidebar .betterdocs-article-reaction-links li a svg{
			${iconWidthMob}
			${iconHeightMob}
		}

		.${blockId}.betterdocs-article-reactions-blocks .betterdocs-article-reactions-sidebar .betterdocs-article-reaction-links li a svg{
			${borderIconMobStyle}
		}

		.${blockId}.betterdocs-article-reactions-blocks .betterdocs-article-reactions-sidebar .betterdocs-article-reaction-links li a svg:hover{
			${borderIconHovMobStyle}
		}

        .${blockId}.betterdocs-article-reactions-blocks .betterdocs-article-reactions-sidebar .betterdocs-article-reaction-links li .betterdocs-tooltip{
            ${reactionIconTextTypoMobLayout3}
        }
	`;

	const desktopAllStyles = softMinifyCssStrings(`
		${isCssExists(desktopStyles) ? desktopStyles : ''}
	`);

	const tabAllStyles = softMinifyCssStrings(`
		${isCssExists(tabStyles) ? tabStyles : ''}
	`)

	const mobileAllStyles = softMinifyCssStrings(`
		${isCssExists(mobileStyles) ? mobileStyles : ''}
	`)

	useEffect( () => {
		const styleObject = {
			desktop: desktopAllStyles,
			tab: tabAllStyles,
			mobile: mobileAllStyles
		};

		if( JSON.stringify(blockMeta) != JSON.stringify( styleObject ) ) {
			setAttributes({blockMeta:styleObject})
		}
	}, [attributes]);

	return (
		<>
		    <div {...blockProps}>
				<style>
					{`
						${desktopAllStyles}

						${resOption === 'Tablet' ? tabAllStyles : ''}
						${resOption === 'Mobile' ? mobileAllStyles : ''}

						@media all and (max-width: 1024px) {
							${tabAllStyles}
						}

						@media all and (max-width: 767px) {
							${mobileAllStyles}
						}
					`}
				</style>
			    {isSelected && <Inspector attributes={attributes} setAttributes={setAttributes}/>}
			    {layout == 'layout-1' && <div className={`betterdocs-article-reactions ${blockId}`}>
					<div className={"betterdocs-article-reactions-heading"}>
						{React.createElement(reaction_text_tag, { className: "betterdocs-reactions-title-tag" }, reaction_text)}
					</div>
					<ul className={"betterdocs-article-reaction-links"}>
						{show_happy_icon && <li>
							<a className={"betterdocs-feelings"} data-feelings="happy" href="#">
								{happy_icon_url?.length > 0 ? <img src={happy_icon_url}/> : <ReactionIcon/>}
							</a>
						</li>}
						{show_neutral_icon && <li>
							<a className={"betterdocs-feelings"} data-feelings="happy" href="#">
								{neutral_icon_url?.length > 0 ? <img src={neutral_icon_url}/>  : <ReactionIcon2/>}
							</a>
						</li>}
						{ show_sad_icon && <li>
							<a className={"betterdocs-feelings"} data-feelings="happy" href="#">
								{sad_icon_url?.length > 0 ? <img src={sad_icon_url}/> : <ReactionIcon3/>}
							</a>
						</li> }
				   </ul>
			   </div>}
               {layout == 'layout-2' && <>
                    <div className={`${blockId}`}>
                        <div className="betterdocs-article-reactions-box">
                            <p className="betterdocs-article-reactions-subheading">{reaction_text}</p>
                            <ul className="betterdocs-article-reaction-links layout-2">
                                {show_happy_icon && <li>
                                    <a className="betterdocs-emoji" data-feelings="happy" href="#">
                                        {happy_icon_url?.length > 0 ? <img src={happy_icon_url}/> : <ReactionIconLayout2Happy/>}
                                    </a>
                                    <span class="betterdocs-tooltip">Happy</span>
                                </li>}
                                {show_neutral_icon && <li>
                                    <a class="betterdocs-emoji" data-feelings="normal" href="#">
                                        {neutral_icon_url?.length > 0 ? <img src={neutral_icon_url}/> : <ReactionIconLayout2Neutral/>}
                                    </a>
                                    <span class="betterdocs-tooltip">Normal</span>
                                </li>}
                                {show_sad_icon && <li>
                                    <a class="betterdocs-emoji" data-feelings="sad" href="#">
                                        {sad_icon_url?.length > 0 ? <img src={sad_icon_url}/> : <ReactionIconLayout2Sad/>}
                                    </a>
                                    <span class="betterdocs-tooltip">Sad</span>
                                </li>}
                            </ul>
                        </div>
                    </div>
               </>}
               {layout == 'layout-3' && <>
                    <div className={`${blockId} betterdocs-article-reactions-blocks`}>
                        <div className="betterdocs-article-reactions-sidebar">
                            {React.createElement(reaction_text_tag, { className: "betterdocs-reactions-title-tag" }, reaction_text)}
                            <ul className="betterdocs-article-reaction-links layout-3" style={{padding:'0px', margin:"0px"}}>
                                {show_happy_icon && <li>
                                    <a className="betterdocs-emoji" data-feelings="happy" href="#">
                                    {happy_icon_url?.length > 0 ? <img src={happy_icon_url}/> : <ReactionIconLayout3Happy/>}
                                        <span className="betterdocs-tooltip">Happy</span>
                                    </a>
                                </li>}
                                {show_neutral_icon && <li>
                                    <a className="betterdocs-emoji" data-feelings="normal" href="#">
                                        {neutral_icon_url?.length > 0 ? <img src={neutral_icon_url}/> : <ReactionIconLayout3Neutral/>}
                                        <span className="betterdocs-tooltip">Normal</span>
                                    </a>
                                </li>}
                                {show_sad_icon && <li>
                                    <a className="betterdocs-emoji" data-feelings="sad" href="#">
                                        {sad_icon_url?.length > 0 ? <img src={sad_icon_url}/> : <ReactionIconLayout3Sad/>}
                                        <span className="betterdocs-tooltip">Sad</span>
                                    </a>
                                </li>}
                            </ul>
                        </div>
                    </div>
               </>}
		    </div>
		</>
	)
}

export default edit;
