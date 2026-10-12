import { addProperty } from "../../../helpers/helper";
import * as TAGS_CONSTANTS from "./constants";
import * as TAGS_TYPO from "./typographyPrefixConstants";
import attributes from "./attributes";

export default ({ blockId }) => {
    const docsTagWrapper = `.${blockId}.betterdocs-tags`;
    const docsTagWrapperTwo = `.${blockId}.betterdocs-tags a`;

    return [
        addProperty('dimension', TAGS_CONSTANTS.WRAPPER_TAGS_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: docsTagWrapper
        }),
        addProperty('dimension', TAGS_CONSTANTS.WRAPPER_TAGS_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: docsTagWrapper
        }),
        addProperty('background', TAGS_CONSTANTS.WRAPPER_TAGS_BACKGROUND, {
            args: { noOverlay: true },
            cssSelector: docsTagWrapper
        }),
        addProperty('typography', TAGS_TYPO.TAGS_TYPO, {
            args: {
                defaultFontSize: 16,
                prefixConstant: TAGS_TYPO.TAGS_TYPO,
            },
            cssSelector: docsTagWrapperTwo
        }),
        addProperty('dimension', TAGS_CONSTANTS.TAGS_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: docsTagWrapperTwo
        }),
        addProperty('dimension', TAGS_CONSTANTS.TAGS_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: docsTagWrapperTwo
        }),
        addProperty('background', TAGS_CONSTANTS.TAGS_BACKGROUND, {
            args: { noOverlay: true },
            cssSelector: docsTagWrapperTwo
        }),
        addProperty('border', TAGS_CONSTANTS.TAGS_BORDER, {
            cssSelector: docsTagWrapperTwo
        }),
        addProperty('color', 'tagsColor', {
            args: { hover: 'tagsColor' },
            cssSelector: docsTagWrapperTwo
        }),
    ];

};
