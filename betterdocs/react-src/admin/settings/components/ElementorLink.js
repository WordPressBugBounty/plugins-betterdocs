import { __ } from "@wordpress/i18n";
import React from "react";

const ElementorLink = (args, props) => {
    return (
        <div className="betterdocs-settings-customizer-link design-elementor">
            <div className="betterdocs-card-content">
                <h2>
                    {__(
                        "Instant Design in Elementor",
                        "betterdocs"
                    )}
                </h2>
                <p>
                    {__(
                        "Easily design and customize your single docs, category archive page, FAQ builder &  more using pre-made templates and widgets for Elementor & see changes in real time.",
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

export default ElementorLink;
