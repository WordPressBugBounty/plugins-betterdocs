import { addProperty } from "../../../helpers/helper";
import { AUTHOR_BOX_WRAPPER_PADDING, AUTHOR_BOX_BACKGROUND, AUTHOR_BOX_SIZE, AUTHOR_BOX_WRAPPER_MARGIN, AUTHOR_BOX_BORDER } from "./constants";
import { typoPrefix_author, typoPrefix_updated_time } from "./typographyPrefixConstants";

export default ( { blockId } ) => {
    const wrapperSelector              = `.${blockId} .betterdocs-author-date`;
    const authorTextWrapperSelector    = `.${blockId} .betterdocs-author-date .betterdocs-author > span`;
    const authorIconWrapper            = `.${blockId} .betterdocs-author-date .betterdocs-author .author-avatar img`;
    const authorUpdatedTimeWrapper     = `.${blockId} .betterdocs-author-date .update-date`;

    return [
        addProperty('background', AUTHOR_BOX_BACKGROUND, {
            args: { noOverlay: true },
            cssSelector: wrapperSelector
        }),
        addProperty('dimension', AUTHOR_BOX_WRAPPER_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: wrapperSelector
        }),
        addProperty('dimension', AUTHOR_BOX_WRAPPER_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: wrapperSelector
        }),
        addProperty('color', 'docAuthorColor', {
            args: { hover: 'docAuthorColor' },
            cssSelector: authorTextWrapperSelector
        }),,
        addProperty('responsive', AUTHOR_BOX_SIZE, {
            args: { property: "width" },
            cssSelector: authorIconWrapper
        }),
        addProperty('typography', typoPrefix_author, {
            args: {
                defaultFontSize: 16,
                prefixConstant: typoPrefix_author,
            },
            cssSelector: authorTextWrapperSelector
        }),
        addProperty('color', 'updatedTimeColor', {
            args: { hover: 'updatedTimeColor' },
            cssSelector: authorUpdatedTimeWrapper
        }),
        addProperty('typography', typoPrefix_updated_time, {
            args: {
                defaultFontSize: 14,
                prefixConstant: typoPrefix_updated_time,
            },
            cssSelector: authorUpdatedTimeWrapper
        }),
        addProperty('border', AUTHOR_BOX_BORDER, {
            args: { noShadow: true },
            cssSelector: wrapperSelector
        }),
    ];
}
