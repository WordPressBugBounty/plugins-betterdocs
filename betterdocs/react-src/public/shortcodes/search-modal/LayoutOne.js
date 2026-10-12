import React from 'react';

const LayoutOne = (props) => {
    const { placeholder, heading, subheading, headingTag: HeadingTag = 'h2', subheadingTag: SubheadingTag = 'h3', buttonText, searchButton } = props;
    return (
        <div className="betterdocs-search-layout-1">
            {(heading || subheading) && (
                <div className="betterdocs-search-heading">
                    {heading && <HeadingTag className="heading">{heading}</HeadingTag>}
                    {subheading && <SubheadingTag className="subheading">{subheading}</SubheadingTag>}
                </div>
            )}
            <div className="search-bar" onClick={props.handleSearchFieldClick}>
                <div className="search-input-wrapper">
                    <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_7075_27802)">
                            <path d="M14.4631 13.6407L17.8394 17.0162L16.724 18.1317L13.3485 14.7554C12.0925 15.7622 10.5303 16.3098 8.92061 16.3075C5.00435 16.3075 1.82593 13.1291 1.82593 9.21285C1.82593 5.29658 5.00435 2.11816 8.92061 2.11816C12.8369 2.11816 16.0153 5.29658 16.0153 9.21285C16.0176 10.8226 15.47 12.3848 14.4631 13.6407ZM12.8818 13.0558C13.8823 12.027 14.441 10.6479 14.4387 9.21285C14.4387 6.16371 11.969 3.69476 8.92061 3.69476C5.87147 3.69476 3.40252 6.16371 3.40252 9.21285C3.40252 12.2612 5.87147 14.7309 8.92061 14.7309C10.3557 14.7332 11.7347 14.1745 12.7636 13.174L12.8818 13.0558Z" fill="#98A2B3"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_7075_27802">
                                <rect width="18.9192" height="18.9192" fill="white" transform="translate(0.248535 0.540039)"/>
                            </clipPath>
                        </defs>
                    </svg>
                    {placeholder && <span className="search-input">{placeholder}</span>}
                </div>
                {(buttonText && searchButton) && <span className="search-button">{buttonText}</span>}
            </div>
        </div>
    );
};

export default LayoutOne;
