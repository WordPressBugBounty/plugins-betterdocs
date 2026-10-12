import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { select } from '@wordpress/data';

import Inspector from "./inspector";

import { NAVIGATION_ARROW_SIZE, NAVIGATION_BOX_PADDING, NAVIGATION_BOX_MARGIN, NAVIGATION_BOX_BORDER, NAVIGATION_ARROW_MARGIN, NAVIGATION_ARROW_PADDING } from './constants';
import { RightArrowIcon, LeftArrowIcon } from "../icons/NavigationIcons";
import { generateTypographyStyles, generateResponsiveRangeStyles, generateDimensionsControlStyles, generateBorderShadowStyles } from "../../../util/helpers";
import { NAVIGATION_TEXT_TYPO } from "./typographyPrefixConstants";
import { softMinifyCssStrings, isCssExists, duplicateBlockIdFix } from "../../../util/helpers";
import { usePreviewDeviceType } from '../../../hooks';

const edit = ({ isSelected, clientId, attributes, setAttributes }) => {

	const { resOption,  blockId, blockMeta, navigation_text_color, navigation_text_hover_color, navigation_arrow_color, navigation_box_color, navigation_arrow_bg_color } = attributes;

    const { dimensionStylesDesktop:boxStylesDesk, dimensionStylesTab:boxStylesTab, dimensionStylesMobile:boxStylesMob} = generateDimensionsControlStyles({
		controlName:NAVIGATION_BOX_PADDING,
		styleFor:"padding",
		attributes
	});

	const { dimensionStylesDesktop:boxStylesMarginDesk, dimensionStylesTab:boxStylesMarginTab, dimensionStylesMobile:boxStylesMarginMob } = generateDimensionsControlStyles({
		controlName:NAVIGATION_BOX_MARGIN,
		styleFor:"margin",
		attributes
	})

	const { stylesDesktop:borderBoxDeskStyle, stylesTab:borderBoxTabStyle, stylesMobile:borderBoxMobStyle, transitionStyle: borderBoxTransition } = generateBorderShadowStyles({
		controlName:NAVIGATION_BOX_BORDER,
		attributes
	})

    const { dimensionStylesDesktop:arrowStylesDesk, dimensionStylesTab:arrowStylesTab, dimensionStylesMobile:arrowStylesMob} = generateDimensionsControlStyles({
		controlName:NAVIGATION_ARROW_PADDING,
		styleFor:"padding",
		attributes
	});

	const { dimensionStylesDesktop:arrowStylesMarginDesk, dimensionStylesTab:arrowStylesMarginTab, dimensionStylesMobile:arrowStylesMarginMob } = generateDimensionsControlStyles({
		controlName:NAVIGATION_ARROW_MARGIN,
		styleFor:"margin",
		attributes
	})

	const blockProps = useBlockProps({
		className: `eb-guten-block-main-parent-wrapper`
	});

	//Set the default screen type value to Desktop On Every Reload
    /**
     * resOption: __experimentalPreviewDeviceType()
     * Set Responsive Option
     */
    usePreviewDeviceType(setAttributes);

	//Generate Unique Block ID For Every Block Instance
	useEffect(() => {
		const BLOCK_PREFIX = "betterdocs-doc-navigation";
		duplicateBlockIdFix({
			BLOCK_PREFIX,
			blockId,
			setAttributes,
			select,
			clientId,
		});
	});

	const { typoStylesDesktop:typoAnchorDesk, typoStylesTab:typoAnchorTab, typoStylesMobile:typoAnchorMob } = generateTypographyStyles({
		prefixConstant:NAVIGATION_TEXT_TYPO,
		defaultFontSize:15,
		attributes
	});

	const { rangeStylesDesktop:navWidthDesk, rangeStylesTab:navWidthTab, rangeStylesMobile:navWidthMob } = generateResponsiveRangeStyles({
		controlName:NAVIGATION_ARROW_SIZE,
		property:"width",
		attributes
	});

	const desktopStyles = `
        .docs-navigation.${blockId}{
			background:${navigation_box_color};
			${boxStylesDesk}
			${boxStylesMarginDesk}
			${borderBoxDeskStyle}
			transition:${borderBoxTransition}
		}
		.docs-navigation.${blockId} a {
			color:${navigation_text_color};
			${typoAnchorDesk}
		}

		.docs-navigation.${blockId} a:hover {
			color:${navigation_text_hover_color}
		}

		.docs-navigation.${blockId} a svg{
			${navWidthDesk}
			fill:${navigation_arrow_color};
		}
        .docs-navigation.${blockId} svg {
			background:${navigation_arrow_bg_color};
			${arrowStylesDesk}
			${arrowStylesMarginDesk}
			transition:${borderBoxTransition}
		}
	`;

	const tabStyles = `
        .docs-navigation.${blockId}{
			background:${navigation_box_color};
			${boxStylesTab}
			${boxStylesMarginTab}
			${borderBoxTabStyle}
		}
		.docs-navigation.${blockId} a{
			color:${navigation_text_color};
			${typoAnchorTab}
		}

		.docs-navigation.${blockId} a:hover {
			color:${navigation_text_hover_color}
		}

		.docs-navigation.${blockId} a svg{
			${navWidthTab}
			fill:${navigation_arrow_color};
		}
        .docs-navigation.${blockId} svg {
			background:${navigation_arrow_bg_color};
			${arrowStylesTab}
			${arrowStylesMarginTab}
			transition:${borderBoxTransition}
		}
	`;

	const mobileStyles = `
        .docs-navigation.${blockId}{
			background:${navigation_box_color};
			${boxStylesMob}
			${boxStylesMarginMob}
			${borderBoxMobStyle}
		}
		.docs-navigation.${blockId} a{
			color:${navigation_text_color};
			${typoAnchorMob}
		}

		.docs-navigation.${blockId} a:hover {
			color:${navigation_text_hover_color}
		}

		.docs-navigation.${blockId} a svg{
			${navWidthMob}
			fill:${navigation_arrow_color};
		}
        .docs-navigation.${blockId} svg {
			background:${navigation_arrow_bg_color};
			${arrowStylesMob}
			${arrowStylesMarginMob}
			transition:${borderBoxTransition}
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
		<div {...blockProps}>
			<style>
				{
					`
						${desktopAllStyles}

						${resOption === 'Tablet' ? tabAllStyles : ''}
						${resOption === 'Mobile' ? mobileAllStyles : ''}

						@media all and (max-width: 1024px) {
							${tabAllStyles}
						}

						@media all and (max-width: 767px) {
							${mobileAllStyles}
						}
					`
				}
			</style>
			{isSelected && <Inspector attributes={attributes} setAttributes={setAttributes}/>}
			<div className={`docs-navigation ${blockId}`}>
				<a rel={"prev"} className={"next-post"} href="#">
					<LeftArrowIcon/>
					{"Previous"}
				</a>
				<a rel={"next"} className={"next-post"} href="#">
					{"Next"}
					<RightArrowIcon/>
				</a>
			</div>
		</div>
	)
}


export default edit;
