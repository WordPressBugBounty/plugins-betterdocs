import React from "react";
import { __ } from "@wordpress/i18n";
import Title from "./Title";
import HTML from "./HTML";
import PermalinkStracture from "./PermalinkStracture";
import Image from "./Image";
import ImporterUpload from "./ImporterUpload";
import SettingsUploader from "./SettingsUploader";
import Migration from "./Migration";
import Header from "./Header";
import EmbedModelSelect from "./EmbedModelSelect";
import PlatformModelSelect from "./PlatformModelSelect";
import ReembedConfirmButton from "./ReembedConfirmButton";
import ReembedNotice from "./ReembedNotice";
import BetterRepeater from "./BetterRepeater";
import MinTokenNumber from "./MinTokenNumber";
import WwaInstructions from "./WwaInstructions";
import EditAIActions from "./EditAIActions";
const Field = (r, type, props) => {
    switch (type) {
        case "title":
            return <Title {...props} />;
        case "image":
            return <Image {...props} />;
        case "html":
            return <HTML {...props} />;
        case "permalink_structure":
            return <PermalinkStracture {...props} />;
        case "importerupload":
            return <ImporterUpload {...props} />;
        case "settingsuploader":
            return <SettingsUploader {...props} />;
        case "migration":
            return <Migration {...props} />;
        case "header":
            return <Header {...props} />;
        case "embed_model_select":
            return <EmbedModelSelect {...props} />;
        case "platform_model_select":
            return <PlatformModelSelect {...props} />;
        case "reembed_confirm_button":
            return <ReembedConfirmButton {...props} />;
        case "reembed_notice":
            return <ReembedNotice {...props} />;
        case "min_token_number":
            return <MinTokenNumber {...props} />;
        case "wwa_instructions":
            return <WwaInstructions {...props} />;
        case "ai_edit_actions":
            return <EditAIActions {...props} />;
		case 'better-repeater':
			return <BetterRepeater {...props}/>
        default:
            return <></>;
    }
};

export default Field;
