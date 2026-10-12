import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { select } from "@wordpress/data";
import { useBlockProps } from "@wordpress/block-editor";

import Inspector from "./inspector";
import { DOC_CONTENT_MARGIN, DOC_CONTENT_PADDING } from "./constants";
import { PrintIcon } from "../icons/PrintIcon";
import { typoPrefix_Doc_content } from "./typographyPrefixConstants";
import {
    duplicateBlockIdFix,
    generateTypographyStyles,
    softMinifyCssStrings,
    isCssExists,
    generateDimensionsControlStyles,
} from "../../../util/helpers";
import { usePreviewDeviceType } from "../../../hooks";

const edit = ({ attributes, setAttributes, isSelected, clientId }) => {
    const {
        resOption,
        blockId,
        blockMeta,
        doc_content_color,
    } = attributes;

    const blockProps = useBlockProps({
        className: `bd-guten-block-main-parent-wrapper`,
    });

    const {
        typoStylesDesktop: docContentTypoDesk,
        typoStylesTab: docContentTypoTab,
        typoStylesMobile: docContentTypoMob,
    } = generateTypographyStyles({
        prefixConstant: typoPrefix_Doc_content,
        attributes: attributes,
    });

    const {
        dimensionStylesDesktop: docContentPadDesk,
        dimensionStylesTab: docContentPadTab,
        dimensionStylesMobile: docContentPadMob,
    } = generateDimensionsControlStyles({
        controlName: DOC_CONTENT_PADDING,
        styleFor: "padding",
        attributes: attributes,
    });

    const {
        dimensionStylesDesktop: docContentMarDesk,
        dimensionStylesTab: docContentMarTab,
        dimensionStylesMobile: docContentMarMob,
    } = generateDimensionsControlStyles({
        controlName: DOC_CONTENT_MARGIN,
        styleFor: "margin",
        attributes: attributes,
    });

    const desktopStyles = `
		.betterdocs-entry-content.${blockId}{
			${docContentPadDesk}
			${docContentMarDesk}
		}

		.betterdocs-entry-content.${blockId} #betterdocs-single-content{
			${docContentTypoDesk}
			color:${doc_content_color};
		}
	`;

    const tabStyles = `
		.betterdocs-entry-content.${blockId}{
			${docContentPadTab}
			${docContentMarTab}
		}

		.betterdocs-entry-content.${blockId} #betterdocs-single-content{
			${docContentTypoTab}
			${docContentPadTab}
			color:${doc_content_color};
		}
	`;

    const mobileStyles = `
		.betterdocs-entry-content.${blockId}{
			${docContentPadMob}
			${docContentMarMob}
		}

		.betterdocs-entry-content.${blockId} #betterdocs-single-content{
			${docContentPadMob}
			${docContentTypoMob}
			color:${doc_content_color};
		}
	`;

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
        const BLOCK_PREFIX = "single-doc-content";
        duplicateBlockIdFix({
            BLOCK_PREFIX,
            blockId,
            setAttributes,
            select,
            clientId,
        });
    });

    return (
        <>
            {isSelected && (
                <Inspector
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
            )}
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
                <div className={`betterdocs-entry-content ${blockId}`}>
                    <div id="betterdocs-single-content">
                        <h1>Heading 1</h1>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Duis at augue a arcu efficitur interdum. Lorem
                            ipsum dolor sit amet, consectetur adipiscing elit.
                            Duis at augue a arcu efficitur interdum. Lorem ipsum
                            dolor sit amet, consectetur adipiscing elit. Duis at
                            augue a arcu efficitur interdum.
                        </p>

                        <h2>Heading 2</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Duis at augue a arcu efficitur interdum. Lorem
                            ipsum dolor sit amet, consectetur adipiscing elit.
                            Duis at augue a arcu efficitur interdum. Lorem ipsum
                            dolor sit amet, consectetur adipiscing elit. Duis at
                            augue a arcu efficitur interdum.
                        </p>

                        <h3>Heading 3</h3>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Duis at augue a arcu efficitur interdum. Lorem
                            ipsum dolor sit amet, consectetur adipiscing elit.
                            Duis at augue a arcu efficitur interdum. Lorem ipsum
                            dolor sit amet, consectetur adipiscing elit. Duis at
                            augue a arcu efficitur interdum.
                        </p>

                        <h4>Heading 4</h4>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Duis at augue a arcu efficitur interdum. Lorem
                            ipsum dolor sit amet, consectetur adipiscing elit.
                            Duis at augue a arcu efficitur interdum. Lorem ipsum
                            dolor sit amet, consectetur adipiscing elit. Duis at
                            augue a arcu efficitur interdum.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default edit;
