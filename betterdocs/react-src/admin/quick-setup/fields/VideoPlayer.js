import React from "react";

const VideoPlayer = (props) => {
    return (
        <div
            className="wprf-control-wrapper wprf-video-player"
            dangerouslySetInnerHTML={{ __html: props?.video }}
        />
    );
};

export default VideoPlayer;
