import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useEffect, useState } from '@wordpress/element';
import { select } from '@wordpress/data';

import { duplicateBlockIdFix, generateDimensionsControlStyles, generateResponsiveRangeStyles, generateBorderShadowStyles, generateTypographyStyles } from '../../../util/helpers';
import { softMinifyCssStrings, isCssExists } from '../../../util/helpers';
import { SOCIAL_SHARE_TITLE_PADDING, SOCIAL_SHARE_TITLE_MARGIN, SOCIAL_SHARE_BOX_HEIGHT, SOCIAL_SHARE_BOX_WIDTH, SOCIAL_SHARE_BOX_PADDING, SOCIAL_SHARE_BOX_MARGIN, SOCIAL_SHARE_BOX_BORDER, SOCIAL_SHARE_ICON_PADDING, SOCIAL_SHARE_ICON_MARGIN, SOCIAL_SHARE_TITLE_PADDING_LAYOUT_2, SOCIAL_SHARE_TITLE_MARGIN_LAYOUT_2, SOCIAL_SHARE_BOX_HEIGHT_LAYOUT_2, SOCIAL_SHARE_BOX_PADDING_LAYOUT_2, SOCIAL_SHARE_ICON_PADDING_LAYOUT_2, SOCIAL_SHARE_BOX_MARGIN_LAYOUT_2, SOCIAL_SHARE_BOX_WIDTH_LAYOUT_2, SOCIAL_SHARE_BOX_BORDER_LAYOUT_2, SOCIAL_SHARE_ICON_MARGIN_LAYOUT_2, SOCIAL_SHARE_ICON_WIDTH_LAYOUT_2, SOCIAL_SHARE_ICON_HEIGHT_LAYOUT_2, SOCIAL_SHARE_ICON_OUTER_WIDTH_LAYOUT_2, SOCIAL_SHARE_ICON_OUTER_HEIGHT_LAYOUT_2 } from './constants';
import { typoShareTitle, typoShareTitle_Layout_2 } from './typographyPrefixConstants';
import facebook from '../icons/facebook.svg';
import twitter from '../icons/twitter.svg';
import linkedin from '../icons/linkedIn.svg';
import pinterest from '../icons/pinterest.svg';
import Inspector from './inspector';
import shareIcon2 from '../icons/share-icon-2.svg';
import facebook2 from '../icons/facebook-2.svg';
import twitter2 from '../icons/twitter-2.svg';
import linkedin2 from '../icons/linkedin-2.svg';
import pinintrest2 from '../icons/pinterest-2.svg';
import { usePreviewDeviceType } from '../../../hooks';

const edit = ( { clientId, isSelected, attributes, setAttributes } ) => {

	const { resOption, blockId, share_box_wrapper_color_layout_2, blockMeta, share_title, share_title_tag, share_title_color_layout_2, share_title_color, share_title_hover_color, share_title_hover_color_layout_2, share_box_wrapper_color, share_content_align, share_content_align_layout_2, show_facebook_icon, show_twitter_icon, show_linkedin_icon, show_pinterest_icon, layout } = attributes;

	const blockProps = useBlockProps({
		className: `eb-guten-block-main-parent-wrapper`
	});

	const { dimensionStylesDesktop:socialSharePaddingDesk, dimensionStylesTab:socialSharePaddingTab, dimensionStylesMobile:socialSharePaddingMob } =
	generateDimensionsControlStyles({
		controlName:layout == 'layout-1' ? SOCIAL_SHARE_TITLE_PADDING : SOCIAL_SHARE_TITLE_PADDING_LAYOUT_2,
		styleFor:"padding",
		attributes:attributes
	});

	const { typoStylesDesktop:titleTypoDesk, typoStylesTab:titleTypoTab, typoStylesMobile:titleTypoMob } = generateTypographyStyles({
		prefixConstant:layout == 'layout-1' ? typoShareTitle : typoShareTitle_Layout_2,
		attributes
	})

	const { dimensionStylesDesktop:socialShareMarginDesk, dimensionStylesTab:socialShareMarginTab, dimensionStylesMobile:socialShareMarginMob } =
	generateDimensionsControlStyles({
		controlName:layout == 'layout-1' ? SOCIAL_SHARE_TITLE_MARGIN : SOCIAL_SHARE_TITLE_MARGIN_LAYOUT_2,
		styleFor:"margin",
		attributes:attributes
	});

	const { rangeStylesDesktop:boxHeightDesk, rangeStylesTab:boxHeightTab, rangeStylesMobile:boxHeightMob } =
	generateResponsiveRangeStyles({
		controlName:layout == 'layout-1' ? SOCIAL_SHARE_BOX_HEIGHT : SOCIAL_SHARE_BOX_HEIGHT_LAYOUT_2,
		property:"height",
		attributes
	});

	const { dimensionStylesDesktop: boxPaddingDesk, dimensionStylesTab:boxPaddingTab, dimensionStylesMobile: boxPaddingMob } =
	generateDimensionsControlStyles({
		controlName:layout == 'layout-1' ? SOCIAL_SHARE_BOX_PADDING : SOCIAL_SHARE_BOX_PADDING_LAYOUT_2,
		styleFor:"padding",
		attributes
	});
	const { dimensionStylesDesktop:iconPaddingDesk, dimensionStylesTab:iconPaddingTab, dimensionStylesMobile:iconPaddingMob } =
	generateDimensionsControlStyles({
		controlName:layout == 'layout-1' ? SOCIAL_SHARE_ICON_PADDING : SOCIAL_SHARE_ICON_PADDING_LAYOUT_2,
		styleFor:"padding",
		attributes
	})

	const { dimensionStylesDesktop: boxMarginDesk, dimensionStylesTab:boxMarginTab, dimensionStylesMobile: boxMarginMob } =
	generateDimensionsControlStyles({
		controlName:layout == 'layout-1' ? SOCIAL_SHARE_BOX_MARGIN : SOCIAL_SHARE_BOX_MARGIN_LAYOUT_2,
		styleFor:"margin",
		attributes
	})

	const { rangeStylesDesktop:boxWidthDesk, rangeStylesTab:boxWidthTab, rangeStylesMobile:boxWidthMob } =
	generateResponsiveRangeStyles({
		controlName:layout == 'layout-1' ? SOCIAL_SHARE_BOX_WIDTH : SOCIAL_SHARE_BOX_WIDTH_LAYOUT_2,
		property:"width",
		attributes
	});

	const { stylesDesktop:borderStylesDesk, stylesTab:borderStylesTab, stylesMobile:borderStylesMob, stylesHoverDesktop:borderStylesHovDesk, stylesHoverTab:borderStylesHovTab, stylesHoverMobile:borderStylesHovMov, transitionStyle:borderStylesTransition } =
	generateBorderShadowStyles({controlName:layout == 'layout-1' ? SOCIAL_SHARE_BOX_BORDER : SOCIAL_SHARE_BOX_BORDER_LAYOUT_2, attributes});

	const { dimensionStylesDesktop:iconMarginDesk, dimensionStylesTab:iconMarginTab, dimensionStylesMobile:iconMarginMob } =
	generateDimensionsControlStyles({
		controlName:layout == 'layout-1' ? SOCIAL_SHARE_ICON_MARGIN : SOCIAL_SHARE_ICON_MARGIN_LAYOUT_2,
		styleFor:"margin",
		attributes
	});

    const { rangeStylesDesktop:socialShareIconWidthLayout2Desk, rangeStylesTab:socialShareIconWidthLayout2Tab, rangeStylesMobile:socialShareIconWidthLayout2Mob } = generateResponsiveRangeStyles({
		controlName:SOCIAL_SHARE_ICON_WIDTH_LAYOUT_2,
		property:"width",
		attributes
	});

    const { rangeStylesDesktop:socialShareIconHeightLayout2Desk, rangeStylesTab:socialShareIconHeightLayout2Tab, rangeStylesMobile:socialShareIconHeightLayout2Mob } = generateResponsiveRangeStyles({
		controlName:SOCIAL_SHARE_ICON_HEIGHT_LAYOUT_2,
		property:"height",
		attributes
	});

    const { rangeStylesDesktop:socialShareIconOuterWidthLayout2Desk, rangeStylesTab:socialShareIconOuterWidthLayout2Tab, rangeStylesMobile:socialShareIconOuterWidthLayout2Mob } = generateResponsiveRangeStyles({
		controlName:SOCIAL_SHARE_ICON_OUTER_WIDTH_LAYOUT_2,
		property:"width",
		attributes
	});

    const { rangeStylesDesktop:socialShareIconOuterHeightLayout2Desk, rangeStylesTab:socialShareIconOuterHeightLayout2Tab, rangeStylesMobile:socialShareIconOuterHeightLayout2Mob } = generateResponsiveRangeStyles({
		controlName:SOCIAL_SHARE_ICON_OUTER_HEIGHT_LAYOUT_2,
		property:"height",
		attributes
	});


	const desktopStyles = `
		.betterdocs-social-share.${blockId}{
			${share_content_align ? `display:flex; justify-content:${share_content_align};` : ''}
			${boxMarginDesk}
			${boxPaddingDesk}
			${boxHeightDesk}
			${boxWidthDesk}
			${borderStylesDesk}
			transition:${borderStylesTransition};
			background:${share_box_wrapper_color};
		}

		.betterdocs-social-share.${blockId}:hover{
			${borderStylesHovDesk}
		}

		.betterdocs-social-share.${blockId} .betterdocs-social-share-heading .betterdocs-social-share-title-tag{
			${socialSharePaddingDesk}
			${socialShareMarginDesk}
			color:${share_title_color};
			${titleTypoDesk}
		}

		.betterdocs-social-share.${blockId} .betterdocs-social-share-heading .betterdocs-social-share-title-tag:hover{
			color:${share_title_hover_color}
		}

		.betterdocs-social-share.${blockId} .betterdocs-social-share-links li a img{
			${iconPaddingDesk}
			${iconMarginDesk}
		}

        .betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-links{
			${boxMarginDesk}
			${boxPaddingDesk}
			${boxHeightDesk}
			${boxWidthDesk}
			${borderStylesDesk}
			transition:${borderStylesTransition};
			background:${share_box_wrapper_color_layout_2};
		}

        .betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-heading {
        	${share_content_align_layout_2 ? `justify-content:${share_content_align_layout_2};` : ''}
        }

		.betterdocs-social-share.layout-2.${blockId}:hover{
			${borderStylesHovDesk}
		}

		.betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-heading.layout-2 .betterdocs-social-share-title-tag{
			${socialSharePaddingDesk}
			${socialShareMarginDesk}
			color:${share_title_color_layout_2};
			${titleTypoDesk}
		}

		.betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-heading.layout-2 .betterdocs-social-share-title-tag:hover{
			color:${share_title_hover_color_layout_2}
		}

		.betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-links li a img, .betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-links li img{
			${iconPaddingDesk}
			${iconMarginDesk}
		}

        .betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-links li a img, .betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-links li img{
            ${socialShareIconWidthLayout2Desk}
            ${socialShareIconHeightLayout2Desk}
        }

        .betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-links li a{
            ${socialShareIconOuterWidthLayout2Desk}
            ${socialShareIconOuterHeightLayout2Desk}
        }
	`;

	const tabStyles = `
		.betterdocs-social-share.${blockId}{
			${boxMarginTab}
			${boxPaddingTab}
			${boxHeightTab}
			${boxWidthTab}
			${borderStylesTab}
			background:${share_box_wrapper_color};
		}

		.betterdocs-social-share.${blockId}:hover{
			${borderStylesHovTab}
		}

		.betterdocs-social-share.${blockId} .betterdocs-social-share-heading .betterdocs-social-share-title-tag{
			${socialSharePaddingTab}
			${socialShareMarginTab}
			color:${share_title_color};
			${titleTypoTab}
		}

		.betterdocs-social-share.${blockId} .betterdocs-social-share-heading .betterdocs-social-share-title-tag:hover{
			color:${share_title_hover_color}
		}

		.betterdocs-social-share.${blockId} .betterdocs-social-share-links li a img{
			${iconPaddingTab}
			${iconMarginTab}
		}

        .betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-links{
			${boxMarginTab}
			${boxPaddingTab}
			${boxHeightTab}
			${boxWidthTab}
			${borderStylesTab}
			background:${share_box_wrapper_color_layout_2};
		}

		.betterdocs-social-share.layout-2.${blockId}:hover{
			${borderStylesHovTab}
		}

		.betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-heading.layout-2 h5{
			${socialSharePaddingTab}
			${socialShareMarginTab}
			color:${share_title_color_layout_2};
			${titleTypoTab}
		}

		.betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-heading.layout-2 h5:hover{
			color:${share_title_hover_color_layout_2}
		}

		.betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-links li a img{
			${iconPaddingTab}
			${iconMarginTab}
		}

        .betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-links li a img, .betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-links li img{
            ${socialShareIconWidthLayout2Tab}
            ${socialShareIconHeightLayout2Tab}
        }

        .betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-links li a{
            ${socialShareIconOuterWidthLayout2Tab}
            ${socialShareIconOuterHeightLayout2Tab}
        }
	`;

	const mobileStyles = `
		.betterdocs-social-share.${blockId}{
			${boxMarginMob}
			${boxPaddingMob}
			${boxHeightMob}
			${boxWidthMob}
			${borderStylesMob}
			background:${share_box_wrapper_color};
		}

		.betterdocs-social-share.${blockId}:hover{
			${borderStylesHovMov}
		}

		.betterdocs-social-share.${blockId} .betterdocs-social-share-heading .betterdocs-social-share-title-tag{
			${socialSharePaddingMob}
			${socialShareMarginMob}
			color:${share_title_color};
			${titleTypoMob}
		}

		.betterdocs-social-share.${blockId} .betterdocs-social-share-heading .betterdocs-social-share-title-tag:hover{
			color:${share_title_hover_color}
		}

		.betterdocs-social-share.${blockId} .betterdocs-social-share-links li a img{
			${iconPaddingMob}
			${iconMarginMob}
		}

        .betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-links{
			${boxMarginMob}
			${boxPaddingMob}
			${boxHeightMob}
			${boxWidthMob}
			${borderStylesMob}
			background:${share_box_wrapper_color_layout_2};
		}

		.betterdocs-social-share.layout-2.${blockId}:hover{
			${borderStylesHovMov}
		}

		.betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-heading.layout-2 h5{
			${socialSharePaddingMob}
			${socialShareMarginMob}
			color:${share_title_color_layout_2};
			${titleTypoMob}
		}

		.betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-heading.layout-2 h5:hover{
			color:${share_title_hover_color_layout_2}
		}

		.betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-links li a img{
			${iconPaddingMob}
			${iconMarginMob}
		}

        .betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-links li a img, .betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-links li img{
            ${socialShareIconWidthLayout2Mob}
            ${socialShareIconHeightLayout2Mob}
        }

        .betterdocs-social-share.layout-2.${blockId} .betterdocs-social-share-links li a{
            ${socialShareIconOuterWidthLayout2Mob}
            ${socialShareIconOuterHeightLayout2Mob}
        }
	`;

	const desktopAllStyles = softMinifyCssStrings(`
		${isCssExists(desktopStyles) ? desktopStyles : ''}
	`);

	const tabAllStyles = softMinifyCssStrings(`
		${isCssExists(tabStyles) ? tabStyles : ''}
	`);

	const mobileAllStyles = softMinifyCssStrings(`
		${isCssExists(mobileStyles) ? mobileStyles : ''}
	`);

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

    /**
     * resOption: __experimentalPreviewDeviceType()
     * Set Responsive Option
     */
    usePreviewDeviceType(setAttributes);

	useEffect(() => {
		const BLOCK_PREFIX = "betterdocs-social-share";
		duplicateBlockIdFix({
		  BLOCK_PREFIX,
		  blockId,
		  setAttributes,
		  select,
		  clientId,
		});
	});

	return(
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
			{layout == 'layout-1' && <div className={`betterdocs-social-share ${blockId}`}>
				<div className={"betterdocs-social-share-heading"}>
					{React.createElement(share_title_tag, { className: "betterdocs-social-share-title-tag" }, share_title)}
				</div>
				<ul className={"betterdocs-social-share-links"}>
					{show_facebook_icon && (
						<li>
							<a href="#">
								<img src={facebook}/>
							</a>
						</li>
					)}
					{ show_twitter_icon && (
						<li>
							<a href="#">
								<img src={twitter}/>
							</a>
						</li>
					)}
					{show_linkedin_icon && (
						<li>
							<a href="#">
								<img src={linkedin}/>
							</a>
						</li>
					)}
					{show_pinterest_icon && (
						<li>
							<a href="#">
								<img src={pinterest}/>
							</a>
						</li>
					)}
				</ul>
			</div>}
            {layout == 'layout-2' &&
                <div class={`${blockId} betterdocs-social-share layout-2`}>
                    <div class="betterdocs-social-share-heading layout-2">
                        {React.createElement(share_title_tag, { className: "betterdocs-social-share-title-tag" }, share_title)}
                    </div>

                    <ul class="betterdocs-social-share-links layout-2">
                        <li>
                            <img src={shareIcon2} alt=""/>
                        </li>
                        {show_facebook_icon && <li>
                            <a title="Facebook" href="#" target="_blank">
                                <img src={facebook2} alt="Facebook"/>
                            </a>
                        </li>}
                        {show_twitter_icon && <li>
                            <a title="X" href="#" target="_blank">
                                <img src={twitter2} alt="X"/>
                            </a>
                        </li>}
                        {show_linkedin_icon && <li>
                            <a title="LinkedIn" href="#" target="_blank">
                                <img src={linkedin2} target="_blank"/>
                            </a>
                        </li>}
                        {show_pinterest_icon && <li>
                            <a title='Pinterest' href="#" target="_blank">
                                <img src={pinintrest2} alt="Pinterest"/>
                            </a>
                        </li>}
                    </ul>
                </div>
            }
		</div>
	);
}

export default edit;
