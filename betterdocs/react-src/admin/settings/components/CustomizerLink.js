import { __ } from "@wordpress/i18n";
import React from "react";

const CustomizerLink = (args, props) => {
    return (
        <div className="betterdocs-settings-customizer-link design-customizer">
            <div className="betterdocs-card-content">
                <h2>
                    {__(
                        "Legacy Customizer",
                        "betterdocs"
                    )}
                </h2>
                <p>
                    {__(
                        "Create and personalize your templates and pages effortlessly with the live customizer. Make your adjustments the way you want and see the changes in action.",
                        "betterdocs"
                    )}
                </p>
                <a className="betterdocs-customize-button" href={props.url}>
                    {props.button}
                </a>
            </div>
            <div className="betterdocs-card-icon">
                <img
                    src={props.customizer_img}
                    alt="betterdocs-documentation"
                />
            </div>
        </div>
    );
};

export default CustomizerLink;
