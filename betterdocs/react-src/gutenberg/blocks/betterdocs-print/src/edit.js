import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { safeHTML } from '@wordpress/dom';
import {
    usePreviewDeviceType,
    useDuplicateBlockIdFix,
    useStyleSheets,
} from "../../../hooks";
import cssProperties from "./cssProperties";

import { printIcon, printIconLayout2 } from "./icons";
import Inspector from "./inspector";

const BLOCK_PREFIX = "betterdocs-printicon";
const Edit = ({ attributes, setAttributes, isSelected, clientId }) => {
    const { blockId, layout } = attributes;

    const blockProps = useBlockProps({
        className: `eb-guten-block-main-parent-wrapper`,
    });

    usePreviewDeviceType(setAttributes);
    useDuplicateBlockIdFix(BLOCK_PREFIX, blockId, clientId, setAttributes);

    const { styleTag } = useStyleSheets({
        properties: cssProperties({ blockId, layout }),
        setAttributes,
        attributes,
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
                {layout == 'layout-1' && <div className={`${safeHTML(blockId)}  betterdocs-print-pdf`}>
                    <div className="betterdocs-print-btn">{printIcon()}</div>
                </div>}
                {layout == 'layout-2' &&
                    <div className={`${safeHTML(blockId)} betterdocs-print-pdf-2`}>
                        <span className="betterdocs-print-btn-2">
                            {printIconLayout2()}
                        </span>
                    </div>
                }
            </div>
        </>
    );
};

export default Edit;
