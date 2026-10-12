import { __ } from "@wordpress/i18n";
import React from "react";

const GutenbergLink = (args, props) => {
    return (
        <div className="betterdocs-settings-customizer-link design-gutenberg">
            <div className="betterdocs-card-content">
                <h2>
                    {__(
                        "Full Site Editing in Gutenberg",
                        "betterdocs"
                    )}
                </h2>
                <p>
                    {__(
                        "Effortlessly design and customize your docs category archive, single docs, ready patterns & more with full site editing (FSE) compatibility in Gutenberg.",
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

export default GutenbergLink;
