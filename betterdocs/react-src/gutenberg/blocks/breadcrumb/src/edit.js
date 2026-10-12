import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { select } from '@wordpress/data';
import { useBlockProps } from '@wordpress/block-editor';
import { safeHTML } from '@wordpress/dom';

import Inspector from "./inspector";

import { BREADCRUMB_TITLE_MARGIN, BREADCRUMB_TITLE_PADDING, BREADCRUMB_ICON_MARGIN, BREADCRUMB_ICON_PADDING, BREADCRUMB_TITLE_MARGIN_LAYOUT_TWO, BREADCRUMB_ICON_MARGIN_LAYOUT_TWO, BREADCRUMB_ICON_PADDING_LAYOUT_TWO, BREADCRUMB_TITLE_PADDING_LAYOUT_TWO } from './constants';

import {
    typoPrefix_title,
    typoPrefix_title_two,
} from "./typographyPrefixConstants";

import {
    generateTypographyStyles,
    duplicateBlockIdFix,
    softMinifyCssStrings,
    generateDimensionsControlStyles,
    isCssExists
} from "../../../util/helpers";

import { BreadCrumbIcon1, BreadCrumbIcon2, BreadCrumbIcon3, BreadCrumbIconNew } from '../icons/breadCrumbIcon';
import { usePreviewDeviceType } from '../../../hooks';

const edit = ({ attributes, setAttributes, isSelected, clientId }) => {

    const { align, align_layout_two, wrapper_background_color_layout_two, blockMeta, resOption, blockId, breadcrumb_title_color, breadcrumb_title_color_layout_two, breadcrumb_icon_color, breadcrumb_icon_color_two, layout } = attributes;

    const { dimensionStylesDesktop: breadcrumbMarginDesk, dimensionStylesMobile: breadcrumbMarginMob, dimensionStylesTab: breadcrumbMarginTab } = generateDimensionsControlStyles({
        controlName: layout == 'layout-1' ? BREADCRUMB_TITLE_MARGIN : BREADCRUMB_TITLE_MARGIN_LAYOUT_TWO,
        styleFor: 'margin',
        attributes
    });

    const { dimensionStylesDesktop: breadcrumbPaddingDesk, dimensionStylesMobile: breadcrumbPaddingMob, dimensionStylesTab: breadcrumbPaddingTab } = generateDimensionsControlStyles({
        controlName: layout == 'layout-1' ? BREADCRUMB_TITLE_PADDING : BREADCRUMB_TITLE_PADDING_LAYOUT_TWO,
        styleFor: 'padding',
        attributes
    });

    const { typoStylesDesktop: titleTypoDesk, typoStylesTab: titleTypoTab, typoStylesMobile: titleTypoMobile } = generateTypographyStyles({
        attributes,
        defaultFontSize: layout == 'layout-1' ? 16 : 12,
        prefixConstant: layout == 'layout-1' ? typoPrefix_title : typoPrefix_title_two,
    });

    const { dimensionStylesDesktop: breadcrumbIconMarDesk, dimensionStylesMobile: breadcrumbIconMarMob, dimensionStylesTab: breadcrumbIconMarTab } = generateDimensionsControlStyles({
        controlName: layout == 'layout-1' ? BREADCRUMB_ICON_MARGIN : BREADCRUMB_ICON_MARGIN_LAYOUT_TWO,
        styleFor: 'margin',
        attributes
    });

    const { dimensionStylesDesktop: breadcrumbIconPadDesk, dimensionStylesMobile: breadcrumbIconPadMob, dimensionStylesTab: breadcrumbIconPadTab } = generateDimensionsControlStyles({
        controlName: layout == 'layout-1' ? BREADCRUMB_ICON_PADDING : BREADCRUMB_ICON_PADDING_LAYOUT_TWO,
        styleFor: 'padding',
        attributes
    });

    const desktopStyles = `
		.betterdocs-breadcrumb.${blockId} {
			${align ? `display:flex; justify-content:${align}` : ''}
		}

		.betterdocs-breadcrumb.${blockId} .betterdocs-breadcrumb-list .betterdocs-breadcrumb-item a, .betterdocs-breadcrumb.${blockId} .betterdocs-breadcrumb-list .betterdocs-breadcrumb-item span{
			${titleTypoDesk ? titleTypoDesk.trim() : ''}
			${breadcrumbPaddingDesk}
			${breadcrumbMarginDesk}
			color:${breadcrumb_title_color};
		}

		.betterdocs-breadcrumb.${blockId} .breadcrumb-delimiter .breadcrumb-delimiter-icon{
			${breadcrumbIconMarDesk}
			${breadcrumbIconPadDesk}
			color:${breadcrumb_icon_color}
		}

        .betterdocs-breadcrumb.${blockId}.layout-2 {
			${align_layout_two ? `display:flex; justify-content:${align_layout_two}` : ''}
		}

		.betterdocs-breadcrumb.${blockId}.layout-2 .betterdocs-breadcrumb-list .betterdocs-breadcrumb-item a, .betterdocs-breadcrumb.${blockId}.layout-2 .betterdocs-breadcrumb-list .betterdocs-breadcrumb-item span{
			${titleTypoDesk ? titleTypoDesk.trim() : ''}
			${breadcrumbPaddingDesk}
			${breadcrumbMarginDesk}
			color:${breadcrumb_title_color_layout_two};
		}

		.betterdocs-breadcrumb.${blockId}.layout-2 .breadcrumb-delimiter .breadcrumb-delimiter-icon path{
			${breadcrumbIconMarDesk}
			${breadcrumbIconPadDesk}
			color:${breadcrumb_icon_color_two} !important;
		}

        .betterdocs-breadcrumb.${blockId}.layout-2 ul.betterdocs-breadcrumb-list {
            background:${wrapper_background_color_layout_two};
        }
	`;

    const tabStyles = `
		.betterdocs-breadcrumb.${blockId} .betterdocs-breadcrumb-list .betterdocs-breadcrumb-item a,  .betterdocs-breadcrumb.${blockId} .betterdocs-breadcrumb-list .betterdocs-breadcrumb-item span{
			${titleTypoTab ? titleTypoTab.trim() : ''}
			${breadcrumbPaddingTab}
			${breadcrumbMarginTab}
			color:${breadcrumb_title_color}
		}

		.betterdocs-breadcrumb.${blockId} .breadcrumb-delimiter .breadcrumb-delimiter-icon{
			${breadcrumbIconMarMob}
			${breadcrumbIconPadTab}
			color:${breadcrumb_icon_color}
		}

        .betterdocs-breadcrumb.${blockId}.layout-2 .betterdocs-breadcrumb-list .betterdocs-breadcrumb-item a, .betterdocs-breadcrumb.${blockId}.layout-2 .betterdocs-breadcrumb-list .betterdocs-breadcrumb-item span{
			${titleTypoTab ? titleTypoTab.trim() : ''}
			${breadcrumbPaddingTab}
			${breadcrumbMarginTab}
			color:${breadcrumb_title_color}
		}

		.betterdocs-breadcrumb.${blockId}.layout-2 .breadcrumb-delimiter .breadcrumb-delimiter-icon path{
			${breadcrumbIconMarMob}
			${breadcrumbIconPadTab}
			color:${breadcrumb_icon_color}
		}
	`;

    const mobileStyles = `
		.betterdocs-breadcrumb.${blockId} .betterdocs-breadcrumb-list .betterdocs-breadcrumb-item a, .betterdocs-breadcrumb.${blockId} .betterdocs-breadcrumb-list .betterdocs-breadcrumb-item span{
			${titleTypoMobile ? titleTypoMobile.trim() : ''}
			${breadcrumbPaddingMob}
			${breadcrumbMarginMob}
			color:${breadcrumb_title_color}
		}

		.betterdocs-breadcrumb.${blockId} .breadcrumb-delimiter .breadcrumb-delimiter-icon{
			${breadcrumbIconMarTab}
			${breadcrumbIconPadMob}
			color:${breadcrumb_icon_color}
		}

        .betterdocs-breadcrumb.${blockId}.layout-2 .betterdocs-breadcrumb-list .betterdocs-breadcrumb-item a, .betterdocs-breadcrumb.${blockId}.layout-2 .betterdocs-breadcrumb-list .betterdocs-breadcrumb-item span{
			${titleTypoMobile ? titleTypoMobile.trim() : ''}
			${breadcrumbPaddingMob}
			${breadcrumbMarginMob}
			color:${breadcrumb_title_color_layout_two}
		}

		.betterdocs-breadcrumb.${blockId}.layout-2 .breadcrumb-delimiter .breadcrumb-delimiter-icon path{
			${breadcrumbIconMarTab}
			${breadcrumbIconPadMob}
			color:${breadcrumb_icon_color_two} !important;
		}
	`;

    //Desktop CSS Styles
    const desktopAllStyles = softMinifyCssStrings(`
		${isCssExists(desktopStyles) ? desktopStyles : ''}
	`);

    //Tablet CSS Styles
    const tabAllStyles = softMinifyCssStrings(`
		${isCssExists(tabStyles) ? tabStyles : ''}
	`);

    //Mobile CSS Styles
    const mobileAllStyles = softMinifyCssStrings(`
		${isCssExists(mobileStyles) ? mobileStyles : ''}
	`);

    //Save Styles In An Object Form On Block Meta Attribute
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

    /**
     * resOption: __experimentalPreviewDeviceType()
     * Set Responsive Option
     */
    usePreviewDeviceType(setAttributes);

    //Generate Unique Block ID For Every Block Instance
    useEffect(() => {
        const BLOCK_PREFIX = "betterdocs-breadcrumb";
        duplicateBlockIdFix({
            BLOCK_PREFIX,
            blockId,
            setAttributes,
            select,
            clientId,
        });
    });

    //Current Block Default Parent Wrapper
    const blockProps = useBlockProps({
        className: `eb-guten-block-main-parent-wrapper`,
    });

    //Render The Main Content Of The Block
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
                {isSelected && (<Inspector attributes={attributes} setAttributes={setAttributes} />)}
                <nav id="betterdocs-breadcrumb" className={`betterdocs-breadcrumb ${layout == 'layout-2' ? 'layout-2' : ''} ${safeHTML(blockId)}`}>
                    <ul className={'betterdocs-breadcrumb-list'}>
                        <li className={'betterdocs-breadcrumb-item item-home'}>
                            <a className={'bread-link bread-home'} href='#' title="Home">Home</a>
                        </li>
                        <li className={'betterdocs-breadcrumb-item breadcrumb-delimiter'}>
                            <span className={'icon-container'}>
                                {layout == 'layout-1' ? <BreadCrumbIcon1 /> : <BreadCrumbIconNew/>}
                            </span>
                        </li>
                        <li className="betterdocs-breadcrumb-item item-cat item-custom-post-type-docs"><a className="bread-cat bread-custom-post-type-docs" href="#" title="Docs Man">Taxonomy-1</a>
                        </li>
                        <li className={'betterdocs-breadcrumb-item breadcrumb-delimiter'}>
                            <span className={'icon-container'}>
                                {layout == 'layout-1' ? <BreadCrumbIcon2 /> : <BreadCrumbIconNew/>}
                            </span>
                        </li>
                        <li className="betterdocs-breadcrumb-item">
                            <a href="#">Taxonomy-2</a>
                        </li>
                        <li className={'betterdocs-breadcrumb-item breadcrumb-delimiter'}>
                            <span className={'icon-container'}>
                            {layout == 'layout-1' ? <BreadCrumbIcon3 /> : <BreadCrumbIconNew/>}
                            </span>
                        </li>
                        <li className="betterdocs-breadcrumb-item">
                            <a href="#">Taxonomy-3</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default edit;
