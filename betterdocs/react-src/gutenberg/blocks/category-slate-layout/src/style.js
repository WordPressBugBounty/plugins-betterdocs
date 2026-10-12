import { useEffect } from "@wordpress/element";
import { select } from "@wordpress/data";

import {
    generateDimensionsControlStyles,
    generateTypographyStyles,
    generateBackgroundControlStyles,
    generateBorderShadowStyles,
    generateResponsiveRangeStyles,
    duplicateBlockIdFix,
    softMinifyCssStrings,
    isCssExists
} from "../../../util/helpers";

import { usePreviewDeviceType } from '../../../hooks';

import {
    CONTAINER_MARGIN,
    CONTAINER_PADDING,
    CONTAINER_BACKGROUND,
    GRID_MARGIN,
    GRID_PADDING,
    GRID_BACKGROUND,
    GRID_BORDER,
    GRID_COLUMNS,
    GRID_SPACE,
    TITLE_MARGIN,
    TITLE_PADDING,
    TITLE_BACKGROUND,
    TITLE_BORDER,
    LIST_MARGIN,
    LIST_PADDING,
    LIST_BACKGROUND,
    LIST_BORDER,
} from './constants';

import {
    TITLE_TYPOGRAPHY,
    LIST_TYPOGRAPHY,
} from './typographyPrefixConstants';

const Style = ({ attributes, setAttributes, clientId }) => {
    const {
        blockId,
        blockMeta,
        resOption,
        // Layout Options
        gridColumns,
        gridSpace,
        // Colors
        titleColor,
        titleHoverColor,
        listColor,
        listHoverColor,
        // Background Colors (for backward compatibility)
        containerBgColor,
        gridBgColor,
    } = attributes;

    // Generate container styles
    const { dimensionStylesDesktop: containerMarginDesk, dimensionStylesMobile: containerMarginMob, dimensionStylesTab: containerMarginTab } = generateDimensionsControlStyles({
        controlName: CONTAINER_MARGIN,
        styleFor: 'margin',
        attributes
    });

    const { dimensionStylesDesktop: containerPaddingDesk, dimensionStylesMobile: containerPaddingMob, dimensionStylesTab: containerPaddingTab } = generateDimensionsControlStyles({
        controlName: CONTAINER_PADDING,
        styleFor: 'padding',
        attributes
    });

    const { backgroundStylesDesktop: containerBgDesk, backgroundStylesTab: containerBgTab, backgroundStylesMobile: containerBgMob } = generateBackgroundControlStyles({
        attributes,
        controlName: CONTAINER_BACKGROUND,
    });

    // Generate grid styles
    const { dimensionStylesDesktop: gridMarginDesk, dimensionStylesMobile: gridMarginMob, dimensionStylesTab: gridMarginTab } = generateDimensionsControlStyles({
        controlName: GRID_MARGIN,
        styleFor: 'margin',
        attributes
    });

    const { dimensionStylesDesktop: gridPaddingDesk, dimensionStylesMobile: gridPaddingMob, dimensionStylesTab: gridPaddingTab } = generateDimensionsControlStyles({
        controlName: GRID_PADDING,
        styleFor: 'padding',
        attributes
    });

    const { backgroundStylesDesktop: gridBgDesk, backgroundStylesTab: gridBgTab, backgroundStylesMobile: gridBgMob } = generateBackgroundControlStyles({
        attributes,
        controlName: GRID_BACKGROUND,
    });

    const { stylesDesktop: gridBorderDesk, stylesTab: gridBorderTab, stylesMobile: gridBorderMob } = generateBorderShadowStyles({
        controlName: GRID_BORDER,
        attributes,
    });



    // Generate responsive range styles for grid space
    const { rangeStylesDesktop: gridSpaceDesk, rangeStylesTab: gridSpaceTab, rangeStylesMobile: gridSpaceMob } = generateResponsiveRangeStyles({
        controlName: GRID_SPACE,
        property: 'gap',
        attributes,
        customUnit: 'px',
    });

    // Generate grid columns styles manually
    const gridColumnsRange = attributes[`${GRID_COLUMNS}Range`] || 3;
    const tabGridColumnsRange = attributes[`TAB${GRID_COLUMNS}Range`] || gridColumnsRange;
    const mobGridColumnsRange = attributes[`MOB${GRID_COLUMNS}Range`] || gridColumnsRange;

    const gridColumnsDesk = gridColumnsRange ? `grid-template-columns: repeat(${gridColumnsRange}, 1fr);` : '';
    const gridColumnsTab = tabGridColumnsRange ? `grid-template-columns: repeat(${tabGridColumnsRange}, 1fr);` : '';
    const gridColumnsMob = mobGridColumnsRange ? `grid-template-columns: repeat(${mobGridColumnsRange}, 1fr);` : '';

    // Generate title styles
    const { typoStylesDesktop: titleTypoDesk, typoStylesTab: titleTypoTab, typoStylesMobile: titleTypoMob } = generateTypographyStyles({
        attributes,
        prefixConstant: TITLE_TYPOGRAPHY,
    });

    const { dimensionStylesDesktop: titleMarginDesk, dimensionStylesMobile: titleMarginMob, dimensionStylesTab: titleMarginTab } = generateDimensionsControlStyles({
        controlName: TITLE_MARGIN,
        styleFor: 'margin',
        attributes
    });

    const { dimensionStylesDesktop: titlePaddingDesk, dimensionStylesMobile: titlePaddingMob, dimensionStylesTab: titlePaddingTab } = generateDimensionsControlStyles({
        controlName: TITLE_PADDING,
        styleFor: 'padding',
        attributes
    });

    const { backgroundStylesDesktop: titleBgDesk, backgroundStylesTab: titleBgTab, backgroundStylesMobile: titleBgMob } = generateBackgroundControlStyles({
        attributes,
        controlName: TITLE_BACKGROUND,
    });

    const { stylesDesktop: titleBorderDesk, stylesTab: titleBorderTab, stylesMobile: titleBorderMob } = generateBorderShadowStyles({
        controlName: TITLE_BORDER,
        attributes,
    });

    // Generate list styles
    const { typoStylesDesktop: listTypoDesk, typoStylesTab: listTypoTab, typoStylesMobile: listTypoMob } = generateTypographyStyles({
        attributes,
        prefixConstant: LIST_TYPOGRAPHY,
    });

    const { dimensionStylesDesktop: listMarginDesk, dimensionStylesMobile: listMarginMob, dimensionStylesTab: listMarginTab } = generateDimensionsControlStyles({
        controlName: LIST_MARGIN,
        styleFor: 'margin',
        attributes
    });

    const { dimensionStylesDesktop: listPaddingDesk, dimensionStylesMobile: listPaddingMob, dimensionStylesTab: listPaddingTab } = generateDimensionsControlStyles({
        controlName: LIST_PADDING,
        styleFor: 'padding',
        attributes
    });

    const { backgroundStylesDesktop: listBgDesk, backgroundStylesTab: listBgTab, backgroundStylesMobile: listBgMob } = generateBackgroundControlStyles({
        attributes,
        controlName: LIST_BACKGROUND,
    });

    const { stylesDesktop: listBorderDesk, stylesTab: listBorderTab, stylesMobile: listBorderMob } = generateBorderShadowStyles({
        controlName: LIST_BORDER,
        attributes,
    });

    // Generate CSS styles
    const desktopStyles = `
        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-grid-inner-wrapper {
            ${containerMarginDesk || ''}
            ${containerPaddingDesk || ''}
            ${containerBgDesk || ''}
            ${containerBgColor ? `background-color: ${containerBgColor};` : ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-grid-inner-wrapper.layout-flex {
            display: grid;
            ${gridSpaceDesk || ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-grid-inner-wrapper.layout-flex {
            ${gridColumnsDesk || ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-single-category-wrapper {
            ${gridMarginDesk || ''}
            ${gridPaddingDesk || ''}
            ${gridBgDesk || ''}
            ${gridBorderDesk || ''}
            ${gridBgColor ? `background-color: ${gridBgColor};` : ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-title:not(:has(a)),
		.${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-title a {
            ${titleTypoDesk || ''}
            ${titleMarginDesk || ''}
            ${titlePaddingDesk || ''}
            ${titleBgDesk || ''}
            ${titleBorderDesk || ''}
            ${titleColor ? `color: ${titleColor};` : ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-title:not(:has(a)):hover,
		.${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-title a:hover {
            ${titleHoverColor ? `color: ${titleHoverColor};` : ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-single-category-wrapper .betterdocs-articles-list {
            ${listMarginDesk || ''}
            ${listPaddingDesk || ''}
            ${listBgDesk || ''}
            ${listBorderDesk || ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-single-category-wrapper .betterdocs-articles-list li {
            ${listTypoDesk || ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-single-category-wrapper .betterdocs-articles-list li a {
            ${listColor ? `color: ${listColor};` : ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-single-category-wrapper .betterdocs-articles-list li a:hover {
            ${listHoverColor ? `color: ${listHoverColor};` : ''}
        }


    `;

    const tabStyles = `
        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-grid-inner-wrapper {
            ${containerMarginTab || ''}
            ${containerPaddingTab || ''}
            ${containerBgTab || ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-grid-inner-wrapper.layout-flex {
            display: grid;
            ${gridSpaceTab || ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-grid-inner-wrapper.layout-flex {
            ${gridColumnsTab || ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-single-category-wrapper {
            ${gridMarginTab || ''}
            ${gridPaddingTab || ''}
            ${gridBgTab || ''}
            ${gridBorderTab || ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-title:not(:has(a)),
		.${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-title a {
            ${titleTypoTab || ''}
            ${titleMarginTab || ''}
            ${titlePaddingTab || ''}
            ${titleBgTab || ''}
            ${titleBorderTab || ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-single-category-wrapper .betterdocs-articles-list {
            ${listMarginTab || ''}
            ${listPaddingTab || ''}
            ${listBgTab || ''}
            ${listBorderTab || ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-single-category-wrapper .betterdocs-articles-list li {
            ${listTypoTab || ''}
        }
    `;

    const mobileStyles = `
        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-grid-inner-wrapper {
            ${containerMarginMob || ''}
            ${containerPaddingMob || ''}
            ${containerBgMob || ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-grid-inner-wrapper.layout-flex {
            display: grid;
            ${gridSpaceMob || ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-grid-inner-wrapper.layout-flex {
            ${gridColumnsMob || ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-single-category-wrapper {
            ${gridMarginMob || ''}
            ${gridPaddingMob || ''}
            ${gridBgMob || ''}
            ${gridBorderMob || ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-title:not(:has(a)),
		.${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-title a {
            ${titleTypoMob || ''}
            ${titleMarginMob || ''}
            ${titlePaddingMob || ''}
            ${titleBgMob || ''}
            ${titleBorderMob || ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-single-category-wrapper .betterdocs-articles-list {
            ${listMarginMob || ''}
            ${listPaddingMob || ''}
            ${listBgMob || ''}
            ${listBorderMob || ''}
        }

        .${blockId} .betterdocs-category-grid-three-wrapper .betterdocs-single-category-wrapper .betterdocs-articles-list li {
            ${listTypoMob || ''}
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
        const BLOCK_PREFIX = "betterdocs-category-slate-layout";
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
