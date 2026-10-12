import React from "react";
import { IconSearch } from "../../../icons/index";

const AllDocsSearch = ({setSearchKeyword}) => {
    return (
        <div className="betterdocs-dashboard-search-wrap">
            <div className="betterdocs-dashboard-search-form">
                <button className="betterdocs-dashboard-search-btn">
                    <IconSearch />
                </button>
                <input
                    className="betterdocs-dashboard-search-field"
                    type="text"
                    placeholder="Search Doc"
                    onChange={(e) => {
                        setSearchKeyword(e?.target?.value);
                    }}
                />
            </div>
        </div>
    );
};

export default AllDocsSearch;
