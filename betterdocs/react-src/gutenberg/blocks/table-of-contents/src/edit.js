import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { useEffect } from "@wordpress/element";
import { select } from "@wordpress/data";

import Inspector from "./inspector";
import { tocTitle_typo, tocList_typo } from "./typographyPrefixConstants";
import {
    TOC_BOX_WIDTH,
    TOC_BOX_MARGIN,
    TOC_BOX_PADDING,
    TOC_BOX_BORDER_SHADOW,
    TOC_TITLE_PADDING,
    TOC_TITLE_MARGIN,
    TOC_LIST_PADDING,
    TOC_LIST_MARGIN,
    TOC_LIST_BORDER,
    TOC_LIST_BORDER_PADDING,
    TOC_ACTIVE_LIST_BORDER,
    TOC_ACTIVE_LIST_BORDER_POSITION_LEFT,
    TOC_ACTIVE_LIST_BORDER_POSITION_RIGHT,
    TOC_ACTIVE_LIST_BORDER_POSITION_BOTTOM,
    TOC_ACTIVE_LIST_BORDER_POSITION_TOP,
} from "./constants";
import {
    generateResponsiveRangeStyles,
    generateDimensionsControlStyles,
    generateBorderShadowStyles,
    generateTypographyStyles,
} from "../../../util/helpers";
import {
    softMinifyCssStrings,
    isCssExists,
    duplicateBlockIdFix,
} from "../../../util/helpers";
import { usePreviewDeviceType } from "../../../hooks";

const edit = ({ clientId, isSelected, attributes, setAttributes }) => {
    const {
        toc_container_back_color,
        toc_list_number,
        toc_list_heirarchy,
        toc_collapsible_small_devices,
        toc_title_text,
        resOption,
        blockId,
        toc_title_color,
        toc_list_color,
        toc_list_hover_color,
        toc_list_hover_bg_color,
        blockMeta,
    } = attributes;

    const { rangeStylesDesktop, rangeStylesTab, rangeStylesMobile } =
        generateResponsiveRangeStyles({
            controlName: TOC_BOX_WIDTH,
            property: "width",
            attributes,
        });

    const {
        dimensionStylesDesktop: tocBoxPadDesk,
        dimensionStylesTab: tocBoxPadTab,
        dimensionStylesMobile: tocBoxPadMob,
    } = generateDimensionsControlStyles({
        controlName: TOC_BOX_PADDING,
        styleFor: "padding",
        attributes,
    });

    const {
        dimensionStylesDesktop: tocBoxMarDesk,
        dimensionStylesTab: tocBoxMarTab,
        dimensionStylesMobile: tocBoxMarMob,
    } = generateDimensionsControlStyles({
        controlName: TOC_BOX_MARGIN,
        styleFor: "margin",
        attributes,
    });

    const {
        stylesDesktop: tocBoxShadowDesk,
        stylesTab: tocBoxShadowTab,
        stylesMobile: tocBoxShadowMob,
    } = generateBorderShadowStyles({
        controlName: TOC_BOX_BORDER_SHADOW,
        attributes: attributes,
        noShadow: true,
    });

    const {
        typoStylesDesktop: tocTitleTypoDesk,
        typoStylesTab: tocTitleTypoTab,
        typoStylesMobile: tocTitleTypoMob,
    } = generateTypographyStyles({
        prefixConstant: tocTitle_typo,
        defaultFontSize: 18,
        attributes,
    });

    const {
        dimensionStylesDesktop: tocTitlePadDesk,
        dimensionStylesTab: tocTitlePadTab,
        dimensionStylesMobile: tocTitlePadMob,
    } = generateDimensionsControlStyles({
        controlName: TOC_TITLE_PADDING,
        styleFor: "padding",
        attributes,
    });

    const {
        dimensionStylesDesktop: tocTitleMarDesk,
        dimensionStylesTab: tocTitleMarTab,
        dimensionStylesMobile: tocTitleMarMob,
    } = generateDimensionsControlStyles({
        controlName: TOC_TITLE_MARGIN,
        styleFor: "margin",
        attributes,
    });

    const {
        typoStylesDesktop: tocListTypoDesk,
        typoStylesTab: tocListTypoTab,
        typoStylesMobile: tocListTypoMob,
    } = generateTypographyStyles({
        prefixConstant: tocList_typo,
        defaultFontSize: 14,
        attributes,
    });

    const {
        dimensionStylesDesktop: tocListPadDesk,
        dimensionStylesTab: tocListPadTab,
        dimensionStylesMobile: tocListPadMob,
    } = generateDimensionsControlStyles({
        controlName: TOC_LIST_PADDING,
        styleFor: "padding",
        attributes,
    });

    const {
        dimensionStylesDesktop: tocListMarDesk,
        dimensionStylesTab: tocListMarTab,
        dimensionStylesMobile: tocListMarMob,
    } = generateDimensionsControlStyles({
        controlName: TOC_LIST_MARGIN,
        styleFor: "margin",
        attributes,
    });

    const {
        stylesDesktop: tocListShadowDesk,
        stylesTab: tocListShadowTab,
        stylesMobile: tocListShadowMob,
    } = generateBorderShadowStyles({
        controlName: TOC_LIST_BORDER,
        attributes: attributes,
        noShadow: true,
    });

    const {
        dimensionStylesDesktop: tocListSpacingDesk,
        dimensionStylesTab: tocListSpacingTab,
        dimensionStylesMobile: tocListSpacingMob,
    } = generateDimensionsControlStyles({
        controlName: TOC_LIST_BORDER_PADDING,
        styleFor: "padding",
        attributes,
    });

    const {
        stylesDesktop: tocActiveListBorderDesk,
        stylesTab: tocActiveListBorderTab,
        stylesMobile: tocActiveListBorderMob,
    } = generateBorderShadowStyles({
        controlName: TOC_ACTIVE_LIST_BORDER,
        attributes: attributes,
        noShadow: true,
    });

    const { rangeStylesDesktop:activeListBorderPostionLeftDesktop, rangeStylesTab:activeListBorderPostionLeftTab, rangeStylesMobile:activeListBorderPostionLeftMobile } =
    generateResponsiveRangeStyles({
        controlName: TOC_ACTIVE_LIST_BORDER_POSITION_LEFT,
        property: "left",
        attributes,
    });

    const { rangeStylesDesktop:activeListBorderPostionRightDesktop, rangeStylesTab:activeListBorderPostionRightTab, rangeStylesMobile:activeListBorderPostionRightMobile } =
    generateResponsiveRangeStyles({
        controlName: TOC_ACTIVE_LIST_BORDER_POSITION_RIGHT,
        property: "right",
        attributes,
    });

    const { rangeStylesDesktop:activeListBorderPostionBottomDesktop, rangeStylesTab:activeListBorderPostionBottomTab, rangeStylesMobile:activeListBorderPostionBottomMobile } =
    generateResponsiveRangeStyles({
        controlName: TOC_ACTIVE_LIST_BORDER_POSITION_BOTTOM,
        property: "bottom",
        attributes,
    });

    const { rangeStylesDesktop:activeListBorderPostionTopDesktop, rangeStylesTab:activeListBorderPostionTopTab, rangeStylesMobile:activeListBorderPostionTopMobile } =
    generateResponsiveRangeStyles({
        controlName: TOC_ACTIVE_LIST_BORDER_POSITION_TOP,
        property: "top",
        attributes,
    });

    const blockProps = useBlockProps({
        className: `eb-guten-block-main-parent-wrapper`,
    });

    const desktopStyles = `
        .betterdocs-toc-block.${blockId} {
            ${rangeStylesDesktop}
        }

		.betterdocs-toc-block.${blockId} .betterdocs-toc, .sticky-toc-container.toc-sticky .betterdocs-toc {
				background-color:${toc_container_back_color};
				${tocBoxPadDesk}
				${tocBoxMarDesk}
				${tocBoxShadowDesk}
		}


		.betterdocs-toc-block.${blockId} .betterdocs-toc > .toc-title, .sticky-toc-container.toc-sticky .toc-title {
			${tocTitleTypoDesk}
			color:${toc_title_color};
			${tocTitlePadDesk}
			${tocTitleMarDesk}
		}

		.betterdocs-toc-block.${blockId} .betterdocs-toc > .toc-list li a, .sticky-toc-container.toc-sticky .betterdocs-toc .toc-list li a{
			${tocListTypoDesk}
			color:${toc_list_color};
			${tocListPadDesk}
			${tocListMarDesk}
		}

		.betterdocs-toc-block.${blockId} .betterdocs-toc ul.betterdocs-hierarchial-toc {
			${tocListShadowDesk}
			${tocListSpacingDesk}
            position: relative;
		}

		.betterdocs-toc-block.${blockId} .betterdocs-toc ul.betterdocs-hierarchial-toc a.active:after{
			${tocActiveListBorderDesk}
			width: 0px;
			content: "";
			position: absolute;
			height: 1.6em;
			left: -1px;
            ${activeListBorderPostionLeftDesktop}
            ${activeListBorderPostionRightDesktop}
            ${activeListBorderPostionTopDesktop}
            ${activeListBorderPostionBottomDesktop}
			background-color: #528fff;
		}

		.betterdocs-toc-block.${blockId} .betterdocs-toc > .toc-list li a:hover, .sticky-toc-container.toc-sticky .betterdocs-toc .toc-list li a:hover{
			color:${toc_list_hover_color};
		}
		.betterdocs-toc-block.${blockId} .betterdocs-toc > .toc-list li a:hover, .sticky-toc-container.toc-sticky .betterdocs-toc .toc-list li a:hover,
		.betterdocs-toc-block.${blockId} .betterdocs-toc > .toc-list li a.active, .sticky-toc-container.toc-sticky .betterdocs-toc .toc-list li a.active{
			background-color:${toc_list_hover_bg_color};
		}
	`;

    const tabStyles = `
        .betterdocs-toc-block.${blockId} {
            ${rangeStylesTab}
        }

		.betterdocs-toc-block.${blockId} .betterdocs-toc, .sticky-toc-container.toc-sticky .betterdocs-toc {
			background-color:${toc_container_back_color};
			${tocBoxPadTab}
			${tocBoxMarTab}
			${tocBoxShadowTab}
		}

		.betterdocs-toc-block.${blockId} .betterdocs-toc > .toc-title, .sticky-toc-container.toc-sticky .toc-title {
			${tocTitleTypoTab}
			color:${toc_title_color};
			${tocTitlePadTab}
			${tocTitleMarTab}
		}

		.betterdocs-toc-block.${blockId} .betterdocs-toc > .toc-list li a, .sticky-toc-container.toc-sticky .betterdocs-toc .toc-list li a{
			${tocListTypoTab}
			color:${toc_list_color};
			${tocListPadTab}
			${tocListMarTab}
		}

		.betterdocs-toc-block.${blockId} .betterdocs-toc ul.betterdocs-hierarchial-toc {
			${tocListShadowTab}
			${tocListSpacingTab}
            position: relative;
		}

		.betterdocs-toc-block.${blockId} .betterdocs-toc ul.betterdocs-hierarchial-toc a.active:after{
			${tocActiveListBorderTab}
			width: 0px;
			content: "";
			position: absolute;
			height: 1.6em;
			left: -1px;
            ${activeListBorderPostionLeftTab}
            ${activeListBorderPostionRightTab}
            ${activeListBorderPostionTopTab}
            ${activeListBorderPostionBottomTab}
			background-color: #528fff;
		}

		.betterdocs-toc-block.${blockId} .betterdocs-toc > .toc-list li a:hover, .sticky-toc-container.toc-sticky .betterdocs-toc .toc-list li a:hover{
			color:${toc_list_hover_color};
		}
	`;

    const mobileStyles = `
        .betterdocs-toc-block.${blockId} {
            ${rangeStylesMobile}
        }

		.betterdocs-toc-block.${blockId} .betterdocs-toc, .sticky-toc-container.toc-sticky .betterdocs-toc {
			background-color:${toc_container_back_color};
			${tocBoxPadMob}
			${tocBoxMarMob}
			${tocBoxShadowMob}
		}

		.betterdocs-toc-block.${blockId} .betterdocs-toc > .toc-title, .sticky-toc-container.toc-sticky .toc-title {
			${tocTitleTypoMob}
			color:${toc_title_color};
			${tocTitlePadMob}
			${tocTitleMarMob}
		}

		.betterdocs-toc-block.${blockId} .betterdocs-toc > .toc-list li a, .sticky-toc-container.toc-sticky .betterdocs-toc .toc-list li a{
			${tocListTypoMob}
			color:${toc_list_color};
			${tocListPadMob}
			${tocListMarMob}
		}

		.betterdocs-toc-block.${blockId} .betterdocs-toc ul.betterdocs-hierarchial-toc {
			${tocListShadowMob}
			${tocListSpacingMob}
            position: relative;
		}

		.betterdocs-toc-block.${blockId} .betterdocs-toc ul.betterdocs-hierarchial-toc a.active:after{
			${tocActiveListBorderMob}
			width: 0px;
			content: "";
			position: absolute;
			height: 1.6em;
			left: -1px;
             ${activeListBorderPostionLeftMobile}
            ${activeListBorderPostionRightMobile}
            ${activeListBorderPostionTopMobile}
            ${activeListBorderPostionBottomMobile}
			background-color: #528fff;
		}

		.betterdocs-toc-block.${blockId} .betterdocs-toc > .toc-list li a:hover, .sticky-toc-container.toc-sticky .betterdocs-toc .toc-list li a:hover{
			color:${toc_list_hover_color};
		}
	`;

    const desktopAllStyles = softMinifyCssStrings(`
		${isCssExists(desktopStyles) ? desktopStyles : ""}
	`);

    const tabAllStyles = softMinifyCssStrings(`
		${isCssExists(tabStyles) ? tabStyles : ""}
	`);

    const mobileAllStyles = softMinifyCssStrings(`
		${isCssExists(mobileStyles) ? mobileStyles : ""}
	`);

    useEffect(() => {
        const BLOCK_PREFIX = "betterdocs-table-of-contents";
        duplicateBlockIdFix({
            BLOCK_PREFIX,
            blockId,
            setAttributes,
            select,
            clientId,
        });
    });

    /**
     * resOption: __experimentalPreviewDeviceType()
     * Set Responsive Option
     */
    usePreviewDeviceType(setAttributes);

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

    return (
        <div {...blockProps}>
            <style>
                {`
					${desktopAllStyles}

					${resOption === "Tablet" ? tabAllStyles : ""}
					${resOption === "Mobile" ? mobileAllStyles : ""}

					@media all and (max-width: 1024px) {
						${tabAllStyles}
					}

					@media all and (max-width: 767px) {
						${mobileAllStyles}
					}
				`}
            </style>
            {isSelected && (
                <Inspector
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
            )}
            <div className={`betterdocs-toc-block ${blockId}`}>
                <div
                    className={`betterdocs-toc${
                        toc_collapsible_small_devices ? " collapsible-sm" : ""
                    }${toc_list_number ? " toc-list-number" : ""}`}
                >
                    <span className="toc-title">{toc_title_text}</span>
                    {toc_list_heirarchy ? (
                        <ul className="toc-list betterdocs-hierarchial-toc">
                            <li className="betterdocs-toc-heading-level-1">
                                <a href="#0-toc-title" className="active">
                                    Heading 1
                                </a>
                                <ul className="betterdocs-toc-list-level-2">
                                    <li className="betterdocs-toc-heading-level-2">
                                        <a href="#1-toc-title">Heading 2</a>
                                        <ul className="betterdocs-toc-list-level-3">
                                            <li className="betterdocs-toc-heading-level-3">
                                                <a href="#2-toc-title">
                                                    Heading 3
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="betterdocs-toc-heading-level-2">
                                        <a href="#3-toc-title">Heading 4</a>
                                        <ul className="betterdocs-toc-list-level-3">
                                            <li className="betterdocs-toc-heading-level-3">
                                                <a href="#4-toc-title">
                                                    Heading 5
                                                </a>
                                                <ul className="betterdocs-toc-list-level-4">
                                                    <li className="betterdocs-toc-heading-level-4">
                                                        <a href="#5-toc-title">
                                                            Heading 6
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    ) : (
                        <ul className="toc-list">
                            <li className="betterdocs-toc-heading-level-1">
                                <a href="#0-toc-title">Heading 1</a>
                            </li>
                            <li className="betterdocs-toc-heading-level-2">
                                <a href="#1-toc-title">Heading 2</a>
                            </li>
                            <li className="betterdocs-toc-heading-level-3">
                                <a href="#2-toc-title">Heading 3</a>
                            </li>
                            <li className="betterdocs-toc-heading-level-4">
                                <a href="#3-toc-title">Heading 4</a>
                            </li>
                            <li className="betterdocs-toc-heading-level-5">
                                <a href="#4-toc-title">Heading 5</a>
                            </li>
                            <li className="betterdocs-toc-heading-level-6">
                                <a href="#5-toc-title">Heading 6</a>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default edit;
