import React from "react";
import Collapse from "./Collapse";
import FinishPanel from "./FinishPanel";
import Header from "./Header";
import Image from "./Image";
import Migration from "./Migration";
import PermalinkStracture from "./PermalinkStracture";
import VideoPlayer from "./VideoPlayer";
import SampleDocsGenerator from "./SampleDocsGenerator";
import LayoutCustomizer from "./LayoutCustomizer";

const Field = (r, type, props) => {
    switch (type) {
        case "header":
            return <Header {...props} />;
        case "migration":
            return <Migration {...props} />;
        case "image":
            return <Image {...props} />;
        case "finish_panel":
            return <FinishPanel {...props} />;
        case "collapse":
            return <Collapse {...props} />;
        case "video-player":
            return <VideoPlayer {...props} />;
        case "permalink_structure":
            return <PermalinkStracture {...props} />;
        case "sample_docs_generator":
            return <SampleDocsGenerator {...props} />;
        case "layout_customizer":
            return <LayoutCustomizer {...props} />;
        default:
            return <></>;
    }
};

export default Field;
