import { useEffect } from "@wordpress/element";
import { select } from "@wordpress/data";

import {
    ARTICLE_SUMMARY_TITLE_MARGIN,
    ARTICLE_SUMMARY_TITLE_PADDING,
    ARTICLE_SUMMARY_CONTENT_MARGIN,
    ARTICLE_SUMMARY_CONTENT_PADDING,
    ARTICLE_SUMMARY_BOX_MARGIN,
    ARTICLE_SUMMARY_BOX_PADDING,
} from './constants';

import {
    typoPrefix_title,
    typoPrefix_content,
    typoPrefix_loading
} from "./typographyPrefixConstants";

import {
    generateTypographyStyles,
    duplicateBlockIdFix,
    softMinifyCssStrings,
    generateDimensionsControlStyles,
    isCssExists
} from "../../../util/helpers";

import { usePreviewDeviceType } from '../../../hooks';

const Style = ({ attributes, setAttributes, clientId }) => {
    const {
        blockId,
        blockMeta,
        resOption,
        titleColor,
		titleBGColor,
        contentColor,
        loadingColor,
        iconColor,
        backgroundColor,
        borderColor,
        borderWidth,
        borderRadius,
        iconSize,
    } = attributes;

    // Generate typography styles
    const { typoStylesDesktop: titleTypoDesk, typoStylesTab: titleTypoTab, typoStylesMobile: titleTypoMobile } = generateTypographyStyles({
        attributes,
        defaultFontSize: 16,
        prefixConstant: typoPrefix_title,
    });

    const { typoStylesDesktop: contentTypoDesk, typoStylesTab: contentTypoTab, typoStylesMobile: contentTypoMobile } = generateTypographyStyles({
        attributes,
        defaultFontSize: 14,
        prefixConstant: typoPrefix_content,
    });

    // Generate dimension styles
    const { dimensionStylesDesktop: titleMarginDesk, dimensionStylesMobile: titleMarginMob, dimensionStylesTab: titleMarginTab } = generateDimensionsControlStyles({
        controlName: ARTICLE_SUMMARY_TITLE_MARGIN,
        styleFor: 'margin',
        attributes
    });

    const { dimensionStylesDesktop: titlePaddingDesk, dimensionStylesMobile: titlePaddingMob, dimensionStylesTab: titlePaddingTab } = generateDimensionsControlStyles({
        controlName: ARTICLE_SUMMARY_TITLE_PADDING,
        styleFor: 'padding',
        attributes
    });

    const { dimensionStylesDesktop: contentMarginDesk, dimensionStylesMobile: contentMarginMob, dimensionStylesTab: contentMarginTab } = generateDimensionsControlStyles({
        controlName: ARTICLE_SUMMARY_CONTENT_MARGIN,
        styleFor: 'margin',
        attributes
    });

    const { dimensionStylesDesktop: contentPaddingDesk, dimensionStylesMobile: contentPaddingMob, dimensionStylesTab: contentPaddingTab } = generateDimensionsControlStyles({
        controlName: ARTICLE_SUMMARY_CONTENT_PADDING,
        styleFor: 'padding',
        attributes
    });

    const { dimensionStylesDesktop: boxMarginDesk, dimensionStylesMobile: boxMarginMob, dimensionStylesTab: boxMarginTab } = generateDimensionsControlStyles({
        controlName: ARTICLE_SUMMARY_BOX_MARGIN,
        styleFor: 'margin',
        attributes
    });

    const { dimensionStylesDesktop: boxPaddingDesk, dimensionStylesMobile: boxPaddingMob, dimensionStylesTab: boxPaddingTab } = generateDimensionsControlStyles({
        controlName: ARTICLE_SUMMARY_BOX_PADDING,
        styleFor: 'padding',
        attributes
    });

    // Generate CSS styles
    const desktopStyles = `
        .betterdocs-article-summary.${blockId} {
            background-color: ${backgroundColor};
            border: ${borderWidth}px solid ${borderColor};
            border-radius: ${borderRadius}px;
            ${boxMarginDesk}
            ${boxPaddingDesk}
        }

		.betterdocs-article-summary.${blockId} .betterdocs-summary-header {
            background-color: ${titleBGColor};
			${titleMarginDesk}
            ${titlePaddingDesk}
        }

        .betterdocs-article-summary.${blockId} .betterdocs-summary-title {
            ${titleTypoDesk ? titleTypoDesk.trim() : ''}
            color: ${titleColor};
        }

        .betterdocs-article-summary.${blockId} .betterdocs-summary-arrow .angle-icon {
            width: ${iconSize}px;
            height: ${iconSize}px;
        }

        .betterdocs-article-summary.${blockId} .betterdocs-summary-arrow .angle-icon path {
            stroke: ${iconColor};
        }

        .betterdocs-article-summary.${blockId} .betterdocs-summary-title img {
            width: 20px;
            height: 20px;
            margin-right: 8px;
        }

        .betterdocs-article-summary.${blockId} .betterdocs-summary-loading img {
            width: 20px;
            height: 20px;
            margin-right: 8px;
        }

        /* Always show Article Summary as expanded in Gutenberg editor */
        .betterdocs-article-summary.${blockId}.betterdocs-editor-mode .betterdocs-summary-content {
            display: block !important;
        }
        .betterdocs-article-summary.${blockId}.betterdocs-editor-mode .angle-icon.angle-right {
            display: none !important;
        }
        .betterdocs-article-summary.${blockId}.betterdocs-editor-mode .angle-icon.angle-down {
            display: block !important;
        }

        .betterdocs-article-summary.${blockId} .betterdocs-summary-content {
            ${contentMarginDesk}
            ${contentPaddingDesk}
        }

        .betterdocs-article-summary.${blockId} .betterdocs-summary-preview,
        .betterdocs-article-summary.${blockId} .betterdocs-summary-text,
        .betterdocs-article-summary.${blockId} .betterdocs-summary-text .summary-content p {
            ${contentTypoDesk ? contentTypoDesk.trim() : ''}
            color: ${contentColor};
        }

        .betterdocs-article-summary.${blockId} .betterdocs-summary-loading {
            color: ${loadingColor};
        }
    `;

    const tabStyles = `
        .betterdocs-article-summary.${blockId} .betterdocs-summary-title {
            ${titleTypoTab ? titleTypoTab.trim() : ''}
            ${titleMarginTab}
            ${titlePaddingTab}
        }

        .betterdocs-article-summary.${blockId} .betterdocs-summary-content {
            ${contentMarginTab}
            ${contentPaddingTab}
        }

        .betterdocs-article-summary.${blockId} .betterdocs-summary-preview,
        .betterdocs-article-summary.${blockId} .betterdocs-summary-text,
        .betterdocs-article-summary.${blockId} .betterdocs-summary-text .summary-content p {
            ${contentTypoTab ? contentTypoTab.trim() : ''}
        }

        .betterdocs-article-summary.${blockId} {
            ${boxMarginTab}
            ${boxPaddingTab}
        }
    `;

    const mobileStyles = `
        .betterdocs-article-summary.${blockId} .betterdocs-summary-title {
            ${titleTypoMobile ? titleTypoMobile.trim() : ''}
            ${titleMarginMob}
            ${titlePaddingMob}
        }

        .betterdocs-article-summary.${blockId} .betterdocs-summary-content {
            ${contentMarginMob}
            ${contentPaddingMob}
        }

        .betterdocs-article-summary.${blockId} .betterdocs-summary-preview,
        .betterdocs-article-summary.${blockId} .betterdocs-summary-text,
        .betterdocs-article-summary.${blockId} .betterdocs-summary-text .summary-content p {
            ${contentTypoMobile ? contentTypoMobile.trim() : ''}
        }

        .betterdocs-article-summary.${blockId} {
            ${boxMarginMob}
            ${boxPaddingMob}
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
        const BLOCK_PREFIX = "betterdocs-article-summary";
        duplicateBlockIdFix({
            BLOCK_PREFIX,
            blockId,
            setAttributes,
            select,
            clientId,
        });
    });

    return (
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
    );
};

export default Style;
