import * as PRINT_CONSTANTS from "./constants";
import { addProperty } from "../../../helpers/helper";

export default ({ blockId, layout }) => {
    const printSelector = `.${blockId}.betterdocs-print-pdf`;
    const printSelectorLayoutTwo = `.${blockId}.betterdocs-print-pdf-2`;
    const printSelectorLayoutTwoSecondWrapper = `.${blockId}.betterdocs-print-pdf-2 .betterdocs-print-btn-2`;

    return [
        addProperty("alignment", layout == 'layout-1' ? "print_icon_alignment" : "print_icon_alignment_layout_2", {
            args:layout == 'layout-1' ? { alignProperty: 'float' } : { alignProperty: 'text-align' },
            cssSelector: layout == 'layout-1' ? printSelector : printSelectorLayoutTwo,
        }),

        addProperty("dimension", layout == 'layout-1' ? PRINT_CONSTANTS.PRINT_ICON_MARGIN : PRINT_CONSTANTS.PRINT_ICON_MARGIN_LAYOUT_2, {
            args: { styleFor: "margin" },
            cssSelector:  layout == 'layout-1' ? printSelector : printSelectorLayoutTwoSecondWrapper,
        }),

        addProperty("dimension",  layout == 'layout-1' ? PRINT_CONSTANTS.PRINT_ICON_PADDING : PRINT_CONSTANTS.PRINT_ICON_PADDING_LAYOUT_2, {
            args: { styleFor: "padding" },
            cssSelector: layout == 'layout-1'  ? printSelector : printSelectorLayoutTwoSecondWrapper,
        }),

        addProperty('background', PRINT_CONSTANTS.BACKGROUND_LAYOUT_2, {
            args: { noOverlay: true },
            cssSelector: printSelectorLayoutTwoSecondWrapper
        }),
    ];
};
