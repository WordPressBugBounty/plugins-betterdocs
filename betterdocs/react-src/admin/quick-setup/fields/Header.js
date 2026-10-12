import React from "react";

const Header = (props) => {
    return (
        <div
            className={`wprf-control-wrapper wprf-section-header wprf-direction-${props?.direction}`}
        >
            {props?.icon ? (
                <div
                    className="wprf-icon header-icon"
                    dangerouslySetInnerHTML={{ __html: props?.icon }}
                />
            ) : (
                ""
            )}
            <div className="wprf-content">
                <h4
                    className="wprf-title"
                    dangerouslySetInnerHTML={{ __html: props.title }}
                />
                <p
                    className="wprf-description"
                    dangerouslySetInnerHTML={{ __html: props.description }}
                />
            </div>
            {props?.links ? (
                <div className="wprf-link-wrapper">
                    {props?.links?.map((link) => (
                        <a
                            href={link?.url}
                            target="_blank"
                            dangerouslySetInnerHTML={{ __html: link?.label }}
                        />
                    ))}
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

export default Header;
