import classNames from "classnames";
import React, { useState } from "react";

const Collapse = (props) => {
    const [showSteps, setShowSteps] = useState(false);

    return (
        <div
            className={classNames(
                "wprf-control",
                "wprf-collapse",
                `wprf-${props.name}-collapse`,
                props?.classes
            )}
        >
            <div
                className={`wprf-collapse-header ${
                    showSteps ? "show" : "hide"
                }`}
            >
                <h4 className={`wprf-collapse-title`}>{props?.label}</h4>
                <h5
                    className="wprf-collapse-collapser"
                    onClick={() => setShowSteps(!showSteps)}
                >
                    {props?.collapse_title}
                </h5>
            </div>
            <div
                className={`wprf-collapse-body ${showSteps ? "show" : "hide"}`}
            >
                <span className="wprf-collapse-body-inner">
                    {props?.collapse_message}
                </span>
            </div>
        </div>
    );
};

export default Collapse;
