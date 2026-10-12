import { useState, useEffect } from "@wordpress/element";
import { useBlockProps } from "@wordpress/block-editor";
import Inspector from "./inspector";
import { MessageIcon } from "./icons";
import FeedbackModalForm from "./modal";
import { safeHTML } from '@wordpress/dom';
import {
    usePreviewDeviceType,
    useStyleSheets,
    useDuplicateBlockIdFix,
} from "../../../hooks";
import cssProperties from "./cssProperties";

const BLOCK_PREFIX = "betterdocs-feedback-form";
const edit = ({ isSelected, clientId, attributes, setAttributes }) => {
    const {
        resOption,
        blockId,
        blockMeta,
        formContent,
        formTitle,
        buttonText,
        formContentColor,
        feedbackFormHeadingColor,
		feedbackFormNameLabelText,
		feedbackFormEmailLabelText,
		feedbackFormMessageLabelText
    } = attributes;

    const [display, setDisplay] = useState("none");

    usePreviewDeviceType(setAttributes);
    useDuplicateBlockIdFix(BLOCK_PREFIX, blockId, clientId, setAttributes);
    const { properties, htmlAttributes, styleTag } = useStyleSheets({
        properties: cssProperties({ blockId }),
        setAttributes,
        attributes,
    });

    const blockProps = useBlockProps({
        className: `eb-guten-block-main-parent-wrapper`,
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
                <div className={`${safeHTML(blockId)}  feedback-form`}>
                    <a
                        className="feedback-form-link"
                        href="#betterdocs-form-modal"
                        name="betterdocs-form-modal"
                        onClick={() => {
                            setDisplay("block");
                        }}
                    >
                        <span className="feedback-form-icon">
                            <MessageIcon />
                        </span>
                        {formContent}
                    </a>
                </div>
                <FeedbackModalForm
                    display={display}
                    setDisplay={setDisplay}
                    blockId={blockId}
                    formTitle={formTitle}
                    buttonText={buttonText}
					labelNameText={feedbackFormNameLabelText}
					labelEmailText={feedbackFormEmailLabelText}
					labelMessageText={feedbackFormMessageLabelText}
                />
            </div>
        </>
    );
};

export default edit;
