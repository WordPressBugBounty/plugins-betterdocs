import {
    WRAPPER_MARGIN,
    WRAPPER_BACKGROUND,
    WRAPPER_PADDING,
    WRAPPER_BORDER,
    READING_TIME_SIZE,
    AI_ACTIONS_PADDING,
    AI_ACTIONS_BACKGROUND,
    AI_ACTIONS_BORDER,
    AI_ACTIONS_ICON_SIZE,
    LISTEN_PADDING,
    LISTEN_BACKGROUND,
    LISTEN_BORDER,
    LISTEN_ICON_SIZE
} from "./constants";
import { generateBackgroundAttributes, generateDimensionsAttributes, generateResponsiveRangeAttributes, generateBorderShadowAttributes, generateTypographyAttributes } from "../../../util/helpers";
import * as typoPrefixs from "./typographyPrefixConstants";
import { settingFlag, settingText } from "./settingDefaults";

const attributes = {
    // the following 4 attributes is must required for responsive options and asset generation for frontend
    // responsive control attributes ⬇
    resOption: {
        type: "string",
        default: "Desktop",
    },
    // blockId attribute for making unique className and other uniqueness ⬇
    blockId: {
        type: "string",
    },
    blockRoot: {
        type: "string",
        default: "better_docs",
    },
    // blockMeta is for keeping all the styles ⬇
    blockMeta: {
        type: "object",
    },

    // ── Reading Time ─────────────────────────────────────────────────────────
    // Defaults come from the Settings panel rather than from literals, so an
    // untouched control mirrors the site-wide value. See ./settingDefaults.js for
    // why that also makes an untouched instance keep tracking later changes.
    enableReadingTime: {
        type: "boolean",
        default: settingFlag("enable_estimated_reading_time"),
    },
    readingTimeTitle:{
        type:"string",
        default: settingText("estimated_reading_time_title"),
    },
    readingTimeText:{
        type:"string",
        default: settingText("estimated_reading_time_text", "min read"),
    },
    singularReadingTimeText:{
        type:"string",
        default: settingText("singular_estimated_reading_time_text", "min read"),
    },
    readingTimeTextColor:{
        type:"string",
        default:"#667085"
    },

    // ── AI Actions ───────────────────────────────────────────────────────────
    // Perplexity and Grok ship off by default; the rest ship on. The fallbacks
    // mirror Core\Settings::get_default() so the two halves cannot drift.
    enableAIActions: {
        type: "boolean",
        default: settingFlag("enable_ai_actions"),
    },
    aiButtonLabel: {
        type: "string",
        default: settingText("ai_actions_button_label", "Copy page"),
    },
    aiPromptTemplate: {
        type: "string",
        default: settingText(
            "ai_actions_prompt_template",
            "Read from {URL} so I can ask questions about it."
        ),
    },
    aiCopyPage: {
        type: "boolean",
        default: settingFlag("ai_actions_copy_page"),
    },
    aiViewMarkdown: {
        type: "boolean",
        default: settingFlag("ai_actions_view_markdown"),
    },
    aiChatGPT: {
        type: "boolean",
        default: settingFlag("ai_actions_chatgpt"),
    },
    aiClaude: {
        type: "boolean",
        default: settingFlag("ai_actions_claude"),
    },
    aiGemini: {
        type: "boolean",
        default: settingFlag("ai_actions_gemini"),
    },
    aiPerplexity: {
        type: "boolean",
        default: settingFlag("ai_actions_perplexity", false),
    },
    aiGrok: {
        type: "boolean",
        default: settingFlag("ai_actions_grok", false),
    },
    aiActionsTextColor: {
        type: "string",
        default: "#667085",
    },
    // Separate from the label colour: every icon in the button is stroked with
    // `currentColor`, so one value covers the copy glyph and the caret, and the
    // two can be tinted independently the way the Customizer allows.
    aiActionsIconColor: {
        type: "string",
        default: "#667085",
    },

    // ── Listen ───────────────────────────────────────────────────────────────
    // The player is the browser's own `speechSynthesis`, so there is nothing to
    // configure about the audio itself — only the label, whether the speed control
    // is offered, and how the pill looks.
    enableListen: {
        type: "boolean",
        default: settingFlag("enable_listen"),
    },
    listenButtonLabel: {
        type: "string",
        default: settingText("listen_button_label", "Listen"),
    },
    listenShowSpeed: {
        type: "boolean",
        default: settingFlag("listen_show_speed"),
    },
    listenTextColor: {
        type: "string",
        default: "#667085",
    },
    listenIconColor: {
        type: "string",
        default: "#667085",
    },
    // The play button's fill, the progress bar's fill and the scrubber's ring, all
    // three of which read one custom property — see listen.scss. One control
    // because three would be three chances to end up with a play button that does
    // not match its own progress bar.
    listenAccentColor: {
        type: "string",
        default: "#1D2939",
    },

    ...generateBackgroundAttributes(WRAPPER_BACKGROUND, {
        defaultFillColor: "#F9FAFB",
        noOverlay: true,
    }),
    ...generateDimensionsAttributes(WRAPPER_MARGIN, {
        top: 0,
        right: 0,
        bottom: 24,
        left: 0,
        isLinked: false,
    }),
    ...generateDimensionsAttributes(WRAPPER_PADDING, {
        top: 5,
        right: 10,
        bottom: 5,
        left: 10,
        isLinked: false,
    }),
    ...generateBorderShadowAttributes(WRAPPER_BORDER, { noShadow: true, noShdowHover:true }),
    ...generateTypographyAttributes(Object.values(typoPrefixs)),
    ...generateResponsiveRangeAttributes(READING_TIME_SIZE, {
        defaultRange: 14,
    }),

    // The AI Actions half starts from the same numbers as the Wrapper controls
    // above, because the two halves of the meta row are the same kind of pill and
    // a control that opens empty gives the author nothing to adjust *from*.
    //
    // The border itself stays unset — the button ships without one — but the
    // radius is stated, at the same 16px as the stylesheet and the reading-time
    // pill, so the control opens on the corner the button actually has.
    ...generateBackgroundAttributes(AI_ACTIONS_BACKGROUND, {
        defaultFillColor: "#F9FAFB",
        noOverlay: true,
    }),
    ...generateDimensionsAttributes(AI_ACTIONS_PADDING, {
        top: 5,
        right: 10,
        bottom: 5,
        left: 10,
        isLinked: false,
    }),
    ...generateBorderShadowAttributes(AI_ACTIONS_BORDER, {
        rdsDefaults: {
            top: 16,
            right: 16,
            bottom: 16,
            left: 16,
        },
        noShadow: true,
        noShdowHover: true,
    }),
    ...generateResponsiveRangeAttributes(AI_ACTIONS_ICON_SIZE, {
        defaultRange: 14,
    }),

    // The Listen half starts from the same numbers again. All three controls in the
    // meta row are the same kind of pill, and a control that opens empty gives the
    // author nothing to adjust *from*.
    ...generateBackgroundAttributes(LISTEN_BACKGROUND, {
        defaultFillColor: "#F9FAFB",
        noOverlay: true,
    }),
    ...generateDimensionsAttributes(LISTEN_PADDING, {
        top: 5,
        right: 10,
        bottom: 5,
        left: 10,
        isLinked: false,
    }),
    ...generateBorderShadowAttributes(LISTEN_BORDER, {
        rdsDefaults: {
            top: 16,
            right: 16,
            bottom: 16,
            left: 16,
        },
        noShadow: true,
        noShdowHover: true,
    }),
    ...generateResponsiveRangeAttributes(LISTEN_ICON_SIZE, {
        defaultRange: 14,
    }),
};

export default attributes;
