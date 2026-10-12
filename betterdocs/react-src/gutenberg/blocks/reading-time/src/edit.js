import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { timeIcon } from "../icons/icons";
import AIActionsPreview from "./aiActionsPreview";
import ListenPreview from "./listenPreview";
import { settingFlag, settingNumber } from "./settingDefaults";
import Inspector from "./inspector";
import { usePreviewDeviceType, useDuplicateBlockIdFix, useStyleSheets } from "../../../hooks";
import cssProperties from "./cssProperties";

const BLOCK_PREFIX = "betterdocs-reading-time";
const Edit = ({ attributes, setAttributes, isSelected, clientId }) => {
    const {
        readingTimeTitle,
        readingTimeText,
        blockId,
        enableReadingTime,
        enableAIActions,
        enableListen
    } = attributes;

    // `enable_ai_actions` is a hard kill switch on the server — Core\AIActions
    // lets a surface switch its own instance off but never on — so a block saved
    // with the toggle on before the feature was switched off site-wide renders
    // nothing. Mirror that here, or the editor promises a button the reader will
    // never see.
    const showAIActions = enableAIActions && settingFlag("enable_ai_actions");
    // Same kill switch, same reason.
    const showListen = enableListen && settingFlag("enable_listen");

    // The player's total duration, estimated from the post the author is editing
    // rather than from a placeholder, so the pill they are sizing against their
    // layout is the width it will actually have. `core/editor` is absent in the
    // site editor and in a pattern, where 900 words — five minutes at the default
    // 180 wpm — stands in.
    const words = useSelect((select) => {
        const content = select("core/editor")?.getEditedPostContent?.();

        if (typeof content !== "string") {
            return 900;
        }

        // Tags and shortcodes out first. This is the browser's rough equivalent of
        // what Core\Listen::word_count() does with the same content server-side;
        // the two will not agree to the word, and neither has to — the number only
        // feeds a duration estimate.
        const text = content
            .replace(/<[^>]*>/g, " ")
            .replace(/\[[^\]]*\]/g, " ");

        return text.split(/\s+/).filter(Boolean).length;
    }, []);

    const wpm = settingNumber("listen_words_per_minute", 180);

    const blockProps = useBlockProps({
        className: `eb-guten-block-main-parent-wrapper`,
    });

    usePreviewDeviceType(setAttributes);
    useDuplicateBlockIdFix(BLOCK_PREFIX, blockId, clientId, setAttributes);

    const { styleTag } = useStyleSheets({
        properties: cssProperties({ blockId }),
        setAttributes,
        attributes
    });

    return (
        <>
            {isSelected && <Inspector attributes={attributes} setAttributes={setAttributes}/>}
            <div {...blockProps}>
                {styleTag()}
                <div className={`${blockId}`}>
                    {/*
                      * The very wrapper the classic meta row emits
                      * (views/templates/parts/doc-meta.php), reused verbatim: the
                      * leading and trailing groups land on opposite edges, every
                      * child's block margins are neutralised so all three controls
                      * sit on one centre line, and this block needs no layout CSS of
                      * its own.
                      */}
                    <div className="betterdocs-doc-meta">
                        {/*
                          * ONE leading box holding both pills, matching what
                          * Blocks\ReadingTime::render() emits. Two boxes would look
                          * right and space wrong: the 8px gap between the pills is
                          * the leading box's own, while the row's gap is 16px.
                          */}
                        {(enableReadingTime || showListen) && (
                            <div className="betterdocs-doc-meta-start">
                                {enableReadingTime && (
                                    <div className="reading-time betterdocs">
                                        <p style={{margin:'0px'}}>
                                            {timeIcon()}
                                            {`${readingTimeTitle?.length > 0 ? readingTimeTitle +': ' : ''}2 ${readingTimeText}`}
                                        </p>
                                    </div>
                                )}
                                {showListen && (
                                    <ListenPreview attributes={attributes} words={words} wpm={wpm} />
                                )}
                            </div>
                        )}
                        {showAIActions && (
                            <div className="betterdocs-doc-meta-end">
                                {/*
                                  * The real menu, built from the same registry the
                                  * frontend renders from, so the action toggles show
                                  * their effect here. Inert by design — see
                                  * ./aiActionsPreview.js.
                                  */}
                                <AIActionsPreview attributes={attributes} />
                            </div>
                        )}
                    </div>
                    {/*
                      * A block that renders nothing cannot be clicked, so it cannot be
                      * switched back on or removed. Say so instead.
                      */}
                    {!enableReadingTime && !showAIActions && !showListen && (
                        <p style={{ margin: 0, color: "#757575", fontStyle: "italic" }}>
                            {__(
                                "Reading Time, Listen and AI Action — every part is switched off, so nothing will be shown on the frontend.",
                                "betterdocs"
                            )}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};
export default Edit;
