import * as FEEDBACK from "./constants";
import * as FEEDBACK_TYPO from "./typographyPrefixConstants";
import { addProperty } from "../../../helpers/helper";

export default ({ blockId }) => {
    const formContentTextSelector = `.${blockId}.feedback-form .feedback-form-link`;
    const formContentIconSelectorPath = `.${blockId}.feedback-form .feedback-form-link .feedback-form-icon svg path`;
    const formContentIconSelectorSvg = `.${blockId}.feedback-form .feedback-form-link .feedback-form-icon svg`;
    const feedbackFormModalSelector = `#betterdocs-form-modal.${blockId}.betterdocs-modalwindow .modal-inner .modal-content`;
    const feedbackFormModalHeading = `#betterdocs-form-modal.${blockId}.betterdocs-modalwindow .modal-inner .modal-content .feedback-form-title`;
    const feedbackFormModalLabelSelector = `#betterdocs-form-modal.${blockId}.betterdocs-modalwindow .betterdocs-feedback-form label`;
    const feedbackFormModalButtonSelector = `#betterdocs-form-modal.${blockId}.betterdocs-modalwindow .betterdocs-feedback-form #feedback_form_submit_btn`;
    const feedbackFormModalButtonSelectorRoot = `#betterdocs-form-modal.${blockId}.betterdocs-modalwindow .feedback-from-button`;

    return [
        addProperty("color", "formContentColor", {
            args: { hover: 'formContentColor' },
            cssSelector: formContentTextSelector,
        }),

        addProperty("typography", FEEDBACK_TYPO.formTitleTypo, {
            args: {
                prefixConstant: FEEDBACK_TYPO.formTitleTypo,
            },
            cssSelector: formContentTextSelector,
        }),

        addProperty("fill", "iconColor", {
            cssSelector: formContentIconSelectorPath,
        }),

        addProperty("responsive", "feedbackIconSize", {
            args: { property: "width", controlName: FEEDBACK.ICON_SIZE },
            cssSelector: formContentIconSelectorSvg,
        }),

        addProperty("responsive", "feedbackFormWidth", {
            args: { property: "max-width", controlName: FEEDBACK.FORM_WIDTH },
            cssSelector: feedbackFormModalSelector,
        }),

        addProperty("responsive", "feedbackFormHeight", {
            args: {
                property: "height",
                controlName: FEEDBACK.FORM_HEIGHT,
            },
            cssSelector: feedbackFormModalSelector,
        }),

        addProperty("color", "feedbackFormHeadingColor", {
            args: { property: "color" },
            cssSelector: feedbackFormModalHeading,
        }),

        addProperty("typography", FEEDBACK_TYPO.feedBackFormHeadingtypo, {
            args: {
                prefixConstant: FEEDBACK_TYPO.feedBackFormHeadingtypo,
            },
            cssSelector: feedbackFormModalHeading,
        }),

        addProperty("alignment", "feedbackFormHeadingAlignment", {
            cssSelector: feedbackFormModalHeading,
        }),

        addProperty("color", "feedbackFormLabelColor", {
            args: { property: "color" },
            cssSelector: feedbackFormModalLabelSelector,
        }),

        addProperty("typography", FEEDBACK_TYPO.feedbackFormLabelTypo, {
            args: {
                prefixConstant: FEEDBACK_TYPO.feedbackFormLabelTypo,
            },
            cssSelector: feedbackFormModalHeading,
        }),

        addProperty("background-color", "feedbackFormButtonBackColor", {
            args: { property: "background-color" },
            cssSelector: feedbackFormModalButtonSelector,
        }),

        addProperty("color", "feedbackFormButtonTextColor", {
            args: { property: "color" },
            cssSelector: feedbackFormModalButtonSelector,
        }),

        addProperty("typography", FEEDBACK_TYPO.feedbackFormButtonTextTypo, {
            args: {
                prefixConstant: FEEDBACK_TYPO.feedbackFormButtonTextTypo,
            },
            cssSelector: feedbackFormModalButtonSelector,
        }),

        addProperty("responsive", FEEDBACK.FORM_BUTTON_WIDTH, {
            args: { property: "width" },
            cssSelector: feedbackFormModalButtonSelector,
        }),

        addProperty("dimension", FEEDBACK.FORM_BUTTON_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: feedbackFormModalButtonSelector,
        }),

        addProperty("alignment", "feedbackFormButtonAlignment", {
            cssSelector: feedbackFormModalButtonSelectorRoot,
        }),

    ];
};
