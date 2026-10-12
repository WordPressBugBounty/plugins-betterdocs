import React from 'react';

const LayoutSidebar = ({ placeholder }) => {
    return (
        <div className="betterdocs-live-search betterdocs-sidebar-search betterdocs-search-popup">
            <form className="betterdocs-searchform betterdocs-advance-searchform" onSubmit={(e) => e.preventDefault()}>
                <div className="betterdocs-searchform-input-wrap">
                    <svg className="doc-search-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_7196_25183)">
                            <path d="M19.0266 17.8469L22.5958 21.4152L21.4166 22.5943L17.8483 19.0252C16.5206 20.0895 14.8691 20.6684 13.1675 20.666C9.02748 20.666 5.66748 17.306 5.66748 13.166C5.66748 9.02602 9.02748 5.66602 13.1675 5.66602C17.3075 5.66602 20.6675 9.02602 20.6675 13.166C20.6699 14.8677 20.091 16.5191 19.0266 17.8469ZM17.355 17.2285C18.4126 16.1409 19.0032 14.683 19.0008 13.166C19.0008 9.94268 16.39 7.33268 13.1675 7.33268C9.94415 7.33268 7.33415 9.94268 7.33415 13.166C7.33415 16.3885 9.94415 18.9993 13.1675 18.9993C14.6845 19.0017 16.1424 18.4111 17.23 17.3535L17.355 17.2285Z" fill="#98A2B3"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_7196_25183">
                                <rect width="20" height="20" fill="white" transform="translate(4 4)"/>
                            </clipPath>
                        </defs>
                    </svg>
                    {placeholder && <span className="betterdocs-search-command">{placeholder}</span>}
                </div>
                <span className="command-key">⌘ K</span>
            </form>
        </div>
    );
};

export default LayoutSidebar;
