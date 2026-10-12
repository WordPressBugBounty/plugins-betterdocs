import { __ } from '@wordpress/i18n';
import { useSelect, select } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { safeHTML } from '@wordpress/dom';

import { duplicateBlockIdFix, isCssExists, softMinifyCssStrings, generateTypographyStyles } from "../../../util/helpers";
import Inspector from "./inspector";
import { DOC_DATE_TYPO } from './typographyPrefixConstants';
import { usePreviewDeviceType } from '../../../hooks';

import { DOC_DATE_BACKGROUND, DOC_DATE_ALIGNMENT, DOC_DATE_BORDER, DOC_DATE_MARGIN, DOC_DATE_PADDING } from './constants';
import { generateDimensionsControlStyles, generateBackgroundControlStyles, generateBorderShadowStyles } from '../../../util/helpers';

const edit = ({attributes, setAttributes, isSelected, clientId}) => {

	const { blockId, blockMeta, resOption, doc_date_color, doc_date_align } = attributes;

	const { typoStylesDesktop:docDateTypoDesk, typoStylesTab:docDateTypoTab, typoStylesMobile:docDateTypoMob } = generateTypographyStyles({
		prefixConstant:DOC_DATE_TYPO,
		defaultFontSize:'',
		attributes
	});

	const { dimensionStylesDesktop:docDatePaddingDesk, dimensionStylesTab:docDatePaddingTab, dimensionStylesMobile:docDatePaddingMob } = generateDimensionsControlStyles({
		controlName:DOC_DATE_PADDING,
		styleFor:"padding",
		attributes
	});

    const { dimensionStylesDesktop:docDateMarginDesk, dimensionStylesTab:docDateMarginTab, dimensionStylesMobile:docDateMarginMob } = generateDimensionsControlStyles({
		controlName:DOC_DATE_MARGIN,
		styleFor:"padding",
		attributes
	});

    const { stylesDesktop:docDateBorderDesk, stylesTab:docDateBorderTab, stylesMobile:docDateBorderMob, transitionStyle: docDateBorderTrans } = generateBorderShadowStyles({
		controlName:DOC_DATE_BORDER,
		attributes
	});

    const {
        backgroundStylesDesktop: docDateBackgroundDesk,
        hoverBackgroundStylesDesktop: docDateBackgroundHoverColorDesk,
        backgroundStylesTab: docDateBackgroundTab,
        hoverBackgroundStylesTab: docDateBackgroundHoverTab,
        backgroundStylesMobile: docDateBackgroundMob,
        hoverBackgroundStylesMobile: docDateBackgroundHoverMob,
        bgTransitionStyle: docDateTransitionStyle,
    } = generateBackgroundControlStyles({
        attributes,
        controlName: DOC_DATE_BACKGROUND,
        noOverlay: true,
    });

	const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	const blockProps = useBlockProps({
		className: `bd-guten-block-main-parent-wrapper`,
	});

	const current_post_data = useSelect((select) => {
		return select('core/editor').getCurrentPost();
	}, []);

	const desktopStyles = `
		.update-date.${blockId} {
			${doc_date_align != undefined ? `display:flex; justify-content:${doc_date_align};` : '' }
			${docDateTypoDesk}
			color:${doc_date_color};
            ${docDatePaddingDesk}
            ${docDateMarginDesk}
            transition:${docDateBorderTrans};
            ${docDateBorderDesk}
            ${docDateBackgroundDesk}
		}

        .update-date.${blockId}:hover {
            ${docDateBackgroundHoverColorDesk}
        }
	`;

	const tabStyles = `
		.update-date.${blockId} {
			${docDateTypoTab}
			color:${doc_date_color};
            ${docDatePaddingTab}
            ${docDateMarginTab}
            ${docDateBorderTab}
            ${docDateBackgroundTab}
		}

        .update-date.${blockId}:hover {
            ${docDateBackgroundHoverTab}
        }
	`;

	const mobileStyles = `
		.update-date.${blockId} {
			${docDateTypoMob}
			color:${doc_date_color};
            ${docDatePaddingMob}
            ${docDateMarginMob}
            ${docDateBorderMob}
            ${docDateBackgroundMob}
		}

        .update-date.${blockId}:hover {
            ${docDateBackgroundHoverMob}
        }
	`;

    /**
     * resOption: __experimentalPreviewDeviceType()
     * Set Responsive Option
     */
    usePreviewDeviceType(setAttributes);

	// this useEffect is for creating an unique id for each block's unique className by a random unique number
	useEffect(() => {
		const BLOCK_PREFIX = "betterdocs-date";
		duplicateBlockIdFix({
			BLOCK_PREFIX,
			blockId,
			setAttributes,
			select,
			clientId,
		});
	}, []);

	 // all css styles for large screen width (desktop/laptop) in strings ⬇
	 const desktopAllStyles = softMinifyCssStrings(`
	 	${isCssExists(desktopStyles) ? desktopStyles : " "}
 	`);

	// all css styles for Tab in strings ⬇
	const tabAllStyles = softMinifyCssStrings(`
		${isCssExists(tabStyles) ? tabStyles : " "}
	`);

	// all css styles for Mobile in strings ⬇
	const mobileAllStyles = softMinifyCssStrings(`
		${isCssExists(mobileStyles) ? mobileStyles : " "}
	`);

	// Set All Style in "blockMeta" Attribute
	useEffect(() => {
		const styleObject = {
			desktop: desktopAllStyles,
			tab: tabAllStyles,
			mobile: mobileAllStyles,
		};
		if (JSON.stringify(blockMeta) != JSON.stringify(styleObject)) {
			setAttributes({ blockMeta: styleObject });
		}
	}, [attributes]);

	const dateString = current_post_data.modified_gmt == undefined ? new Date() : new Date( current_post_data.modified_gmt );
	let date 		 = dateString.getDate();
	let month		 = Months[dateString.getMonth()];
	let year	     = dateString.getFullYear();
	let updateString = `Updated on ${date}, ${month} ${year}`;

	return (
			<>
				{isSelected && (
        			<Inspector attributes={attributes} setAttributes={setAttributes} />
      			)}
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
				<div {...blockProps}>
					<div className={`update-date ${safeHTML(blockId)} `}>
						{updateString}
					</div>
				</div>
			</>
		   );

}

export default edit;
