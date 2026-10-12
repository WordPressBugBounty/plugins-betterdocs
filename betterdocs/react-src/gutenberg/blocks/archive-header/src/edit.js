import { __ } from "@wordpress/i18n";
import Inspector from "./inspector";
import { useBlockProps } from "@wordpress/block-editor";
import ArchiveIcon from "./archiveIcon";
import { useStyleSheets, useDuplicateBlockIdFix, usePreviewDeviceType } from "../../../hooks";
import cssProperties from "./cssProperties";

const BLOCK_PREFIX = "archive-header";
const Edit = ({ attributes, setAttributes, isSelected, clientId }) => {
    const { blockId, titleTag } = attributes;
    const blockProps = useBlockProps({
        className: `eb-guten-block-main-parent-wrapper`,
    });

    const { styleTag } = useStyleSheets({
        properties: cssProperties({ blockId }),
        setAttributes,
        attributes,
    });

    usePreviewDeviceType(setAttributes);
    useDuplicateBlockIdFix(BLOCK_PREFIX, blockId, clientId, setAttributes);
    let TitleTag = titleTag;
    return (
        <>
            {isSelected && (
                <Inspector
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
            )}
            <div {...blockProps}>
                {styleTag()}
                <div className={`${blockId} betterdocs-main-category-folder`}>
                    <div className="betterdocs-category-header">
                        <div className="betterdocs-category-header-inner">
                            <div className="betterdocs-category-icon">
                                <span className="betterdocs-folder-icon toggle-arrow arrow-down">
                                    <ArchiveIcon/>
                                </span>
                            </div>
                            <TitleTag className="betterdocs-category-title">{ __('Category Name', 'betterdocs') }</TitleTag>
                            <div
                                data-count="1"
                                className="betterdocs-sub-category-items-counts"
                            >
                                <span>{`1 ${__('Doc', 'betterdocs')}`}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Edit;
