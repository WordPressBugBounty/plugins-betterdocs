import { useEffect } from "@wordpress/element";
import { select } from "@wordpress/data";

import {
    generateDimensionsControlStyles,
    generateTypographyStyles,
    duplicateBlockIdFix,
    softMinifyCssStrings,
    isCssExists
} from "../../../util/helpers";

import { usePreviewDeviceType } from '../../../hooks';

import {
    CODE_SNIPPET_WRAPPER_MARGIN,
    CODE_SNIPPET_WRAPPER_PADDING,
    CODE_SNIPPET_HEADER_PADDING,
    CODE_SNIPPET_LINE_NUMBERS_PADDING,
    CODE_SNIPPET_CODE_PADDING,
} from './constants';

import {
    typoPrefix_fileName
} from "./typographyPrefixConstants";

const Style = ({ attributes, setAttributes, clientId }) => {
    const {
        blockId,
        blockMeta,
        resOption,
        lineNumberColor,
        lineNumberBgColor,
        lineNumberBorderColor,
        lineNumberBorderWidth,
        wrapperBackgroundColor,
        wrapperBorderColor,
        wrapperBorderWidth,
        wrapperBorderRadius,
        headerBackgroundColor,
        headerBorderColor,
        headerBorderWidth,
        fileNameColor,
        copyButtonColor,
        copyButtonBorderColor,
        codeBackgroundColor,
    } = attributes;

    // Generate wrapper dimension styles
    const { dimensionStylesDesktop: wrapperMarginDesk, dimensionStylesMobile: wrapperMarginMob, dimensionStylesTab: wrapperMarginTab } = generateDimensionsControlStyles({
        controlName: CODE_SNIPPET_WRAPPER_MARGIN,
        styleFor: 'margin',
        attributes
    });

    const { dimensionStylesDesktop: wrapperPaddingDesk, dimensionStylesMobile: wrapperPaddingMob, dimensionStylesTab: wrapperPaddingTab } = generateDimensionsControlStyles({
        controlName: CODE_SNIPPET_WRAPPER_PADDING,
        styleFor: 'padding',
        attributes
    });

    // Generate header dimension styles
    const { dimensionStylesDesktop: headerPaddingDesk, dimensionStylesMobile: headerPaddingMob, dimensionStylesTab: headerPaddingTab } = generateDimensionsControlStyles({
        controlName: CODE_SNIPPET_HEADER_PADDING,
        styleFor: 'padding',
        attributes
    });

    // Generate line numbers dimension styles
    const { dimensionStylesDesktop: lineNumbersPaddingDesk, dimensionStylesMobile: lineNumbersPaddingMob, dimensionStylesTab: lineNumbersPaddingTab } = generateDimensionsControlStyles({
        controlName: CODE_SNIPPET_LINE_NUMBERS_PADDING,
        styleFor: 'padding',
        attributes
    });

    // Generate code content dimension styles
    const { dimensionStylesDesktop: codePaddingDesk, dimensionStylesMobile: codePaddingMob, dimensionStylesTab: codePaddingTab } = generateDimensionsControlStyles({
        controlName: CODE_SNIPPET_CODE_PADDING,
        styleFor: 'padding',
        attributes
    });

    // Generate file name typography styles
    const { typoStylesDesktop: fileNameTypoDesk, typoStylesTab: fileNameTypoTab, typoStylesMobile: fileNameTypoMobile } = generateTypographyStyles({
        attributes,
        defaultFontSize: 14,
        prefixConstant: typoPrefix_fileName,
    });

    // Generate CSS styles
    const desktopStyles = `
        .betterdocs-code-snippet-wrapper.${blockId} {
            ${wrapperMarginDesk}
            ${wrapperPaddingDesk}
            ${wrapperBackgroundColor ? `background-color: ${wrapperBackgroundColor} !important;` : ''}
            ${wrapperBorderColor ? `border-color: ${wrapperBorderColor} !important;` : ''}
            ${wrapperBorderWidth !== undefined ? `border-width: ${wrapperBorderWidth}px !important;` : ''}
            ${wrapperBorderWidth > 0 ? `border-style: solid !important;` : ''}
            ${wrapperBorderRadius !== undefined ? `border-radius: ${wrapperBorderRadius}px !important;` : ''}
        }

        .betterdocs-code-snippet-wrapper.${blockId} .betterdocs-code-snippet-header.betterdocs-file-preview-header {
            ${headerPaddingDesk}
            ${headerBackgroundColor ? `background-color: ${headerBackgroundColor} !important;` : ''}
            ${headerBorderColor ? `border-bottom-color: ${headerBorderColor} !important;` : ''}
            ${headerBorderWidth !== undefined ? `border-bottom-width: ${headerBorderWidth}px !important;` : ''}
            ${headerBorderWidth > 0 ? `border-bottom-style: solid !important;` : ''}
        }

        .betterdocs-code-snippet-wrapper.${blockId} .betterdocs-code-snippet-header .betterdocs-file-name .file-name-text {
            ${fileNameTypoDesk ? fileNameTypoDesk.trim() : ''}
			${fileNameColor ? `color: ${fileNameColor}; !important;` : ''}
        }

        .betterdocs-code-snippet-wrapper.${blockId} .betterdocs-code-snippet-header .betterdocs-code-snippet-copy-button {
            ${copyButtonColor ? `color: ${copyButtonColor} !important;` : ''}
            ${copyButtonBorderColor ? `border-color: ${copyButtonBorderColor} !important;` : ''}
        }

        .betterdocs-code-snippet-wrapper.${blockId} .betterdocs-code-snippet-content .betterdocs-code-snippet-line-numbers {
            ${lineNumbersPaddingDesk}
            ${lineNumberBgColor ? `background-color: ${lineNumberBgColor} !important;` : ''}
            ${lineNumberBorderColor ? `border-right-color: ${lineNumberBorderColor} !important;` : ''}
            ${lineNumberBorderWidth !== undefined ? `border-right-width: ${lineNumberBorderWidth}px !important;` : ''}
            ${lineNumberBorderWidth > 0 ? `border-right-style: solid !important;` : ''}
        }

        .betterdocs-code-snippet-wrapper.${blockId} .betterdocs-code-snippet-content .betterdocs-code-snippet-line-numbers .line-number {
            ${lineNumberColor ? `color: ${lineNumberColor} !important;` : ''}
        }

        .betterdocs-code-snippet-wrapper.${blockId} .betterdocs-code-snippet-code {
            ${codePaddingDesk}
            ${codeBackgroundColor ? `background-color: ${codeBackgroundColor} !important;` : ''}
        }
    `;

    const tabStyles = `
        .betterdocs-code-snippet-wrapper.${blockId} {
            ${wrapperMarginTab}
            ${wrapperPaddingTab}
        }

        .betterdocs-code-snippet-wrapper.${blockId} .betterdocs-code-snippet-header.betterdocs-file-preview-header {
            ${headerPaddingTab}
        }

        .betterdocs-code-snippet-wrapper.${blockId} .betterdocs-code-snippet-header .betterdocs-file-name .file-name-text {
            ${fileNameTypoTab ? fileNameTypoTab.trim() : ''}
        }

        .betterdocs-code-snippet-wrapper.${blockId} .betterdocs-code-snippet-content .betterdocs-code-snippet-line-numbers {
            ${lineNumbersPaddingTab}
        }

        .betterdocs-code-snippet-wrapper.${blockId} .betterdocs-code-snippet-code {
            ${codePaddingTab}
        }
    `;

    const mobileStyles = `
        .betterdocs-code-snippet-wrapper.${blockId} {
            ${wrapperMarginMob}
            ${wrapperPaddingMob}
        }

        .betterdocs-code-snippet-wrapper.${blockId} .betterdocs-code-snippet-header.betterdocs-file-preview-header {
            ${headerPaddingMob}
        }

        .betterdocs-code-snippet-wrapper.${blockId} .betterdocs-code-snippet-header .betterdocs-file-name .file-name-text {
            ${fileNameTypoMobile ? fileNameTypoMobile.trim() : ''}
        }

        .betterdocs-code-snippet-wrapper.${blockId} .betterdocs-code-snippet-content .betterdocs-code-snippet-line-numbers {
            ${lineNumbersPaddingMob}
        }

        .betterdocs-code-snippet-wrapper.${blockId} .betterdocs-code-snippet-code {
            ${codePaddingMob}
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
        const BLOCK_PREFIX = "betterdocs-code-snippet";
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
