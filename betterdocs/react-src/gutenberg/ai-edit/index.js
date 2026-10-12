import { registerPlugin } from "@wordpress/plugins";

import "./store";
import "./format";
import "./highlight-format";
import "./block-control";
import AIEditModal from "./AIEditModal";

registerPlugin("betterdocs-ai-edit", {
    render: AIEditModal,
});
