import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import DocIconSleek from "../icon/DocIconSleek";

import Inspector from "./inspector";


import {
    usePreviewDeviceType,
    useDuplicateBlockIdFix,
    useStyleSheets,
} from "../../../hooks";
import cssProperties from "./cssProperties";

const BLOCK_PREFIX = "betterdocs-docs-tag";
const edit = ({ attributes, setAttributes, isSelected, clientId }) => {
    let { blockId } = attributes;

    usePreviewDeviceType(setAttributes);
    useDuplicateBlockIdFix(BLOCK_PREFIX, blockId, clientId, setAttributes);
    const { properties, htmlAttributes, styleTag } = useStyleSheets({
        properties: cssProperties({ blockId }),
        setAttributes,
        attributes,
    });

    const blockProps = useBlockProps({
        className: `bd-guten-block-main-parent-wrapper`,
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
                {styleTag()}
                <div className={`betterdocs-tags ${blockId}`}>
                    <a href="#">Tag 1</a>,
                    <a href="#">Tag 2</a>,
                    <a href="#">Tag 3</a>,
                    <a href="#">Tag 4</a>
                </div>
            </div>
        </>
    );
};

export default edit;
