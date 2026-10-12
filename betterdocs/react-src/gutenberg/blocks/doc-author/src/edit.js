import { useBlockProps } from "@wordpress/block-editor";
import { timeIcon } from "../icons/icons";
import Inspector from "./inspector";
import {
    usePreviewDeviceType,
    useDuplicateBlockIdFix,
    useStyleSheets,
} from "../../../hooks";
import cssProperties from "./cssProperties";
import { getCurrentDate } from "./helpers";

const BLOCK_PREFIX = "betterdocs-doc-author";
const Edit = ({ attributes, setAttributes, isSelected, clientId }) => {
    const { blockId } = attributes;

    const blockProps = useBlockProps({
        className: `eb-guten-block-main-parent-wrapper`,
    });

    usePreviewDeviceType(setAttributes);
    useDuplicateBlockIdFix(BLOCK_PREFIX, blockId, clientId, setAttributes);

    const { casecadeStyles, styleTag } = useStyleSheets({
        properties: cssProperties({ blockId }),
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
                <div className={blockId}>
                    <div className="betterdocs-author-date">
                        <div className="betterdocs-author">
                            <div className="author-avatar">
                                <img
                                    alt=""
                                    src="http://0.gravatar.com/avatar/?s=40&amp;d=mm&amp;r=g"
                                    srcset="http://2.gravatar.com/avatar/?s=80&amp;d=mm&amp;r=g 2x"
                                    class="avatar avatar-40 photo avatar-default"
                                    height="40"
                                    width="40"
                                    decoding="async"
                                />
                            </div>
                            <span>User Name</span>
                        </div>
                        <div className="update-date">{getCurrentDate()}</div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Edit;
