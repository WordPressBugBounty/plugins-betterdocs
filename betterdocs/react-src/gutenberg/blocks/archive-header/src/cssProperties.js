import { HEADER_ICON_SIZE, HEADER_BACKGROUND_COLOR, HEADER_MARGIN, HEADER_PADDING, HEADER_ICON_INNER_HEIGHT, HEADER_ICON_INNER_WIDTH } from "./constants";
import { header_title_typo, header_doc_count_typo } from "./typographyPrefixConstants";
import { addProperty } from "../../../helpers/helper";

export default ({ blockId }) => {
    const selector1 = `.${blockId}.betterdocs-main-category-folder`;
    const selector2 = `.${blockId}.betterdocs-main-category-folder .betterdocs-category-header-inner .betterdocs-category-icon .betterdocs-folder-icon`;
    const selector3 = `.${blockId}.betterdocs-main-category-folder .betterdocs-category-header-inner .betterdocs-category-title`;
    const selector4 = `.${blockId}.betterdocs-main-category-folder .betterdocs-category-header-inner .betterdocs-sub-category-items-counts`;
    const selector5 = `.${blockId}.betterdocs-main-category-folder .betterdocs-category-header-inner .betterdocs-category-icon .betterdocs-folder-icon .betterdocs-category-folder-img`;

    return [
        addProperty("dimension", HEADER_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: selector1,
        }),
        addProperty("dimension", HEADER_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: selector1,
        }),
        addProperty('background', HEADER_BACKGROUND_COLOR, {
            args: { noOverlay: true },
            cssSelector: selector1
        }),
        addProperty('responsive', HEADER_ICON_SIZE, {
            args: { property: "width" },
            cssSelector: selector2
        }),
        addProperty('responsive', HEADER_ICON_INNER_WIDTH, {
            args: { property: "width" },
            cssSelector: selector5
        }),
        addProperty('responsive', HEADER_ICON_INNER_HEIGHT, {
            args: { property: "height" },
            cssSelector: selector5
        }),
        addProperty('color', 'archiveHeaderTitleColor', {
            cssSelector: selector3,
        }),
        addProperty('color', 'archiveHeaderDocCountColor', {
            cssSelector: selector4,
        }),
        addProperty('typography', header_title_typo, {
            args: {
                defaultFontSize: 32,
                prefixConstant: header_title_typo,
            },
            cssSelector: selector3
        }),
        addProperty('typography', header_doc_count_typo, {
            args: {
                defaultFontSize: 18,
                prefixConstant: header_doc_count_typo,
            },
            cssSelector: selector4
        })
    ]
}
