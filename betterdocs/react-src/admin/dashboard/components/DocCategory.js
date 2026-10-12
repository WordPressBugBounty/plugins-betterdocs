import React from "react";
import { decodeEntities } from "@wordpress/html-entities";
import useFetch from "../hooks/useFetch";

const DocCategory = ({ categories }) => {
    return (
        <span className="betterdocs-dashboard-list-item-category">
            {categories.map((category, index) => (
                <React.Fragment key={index}>
                    <a href={category.term_url}>{decodeEntities(category.term_name)}</a>
                    {index < categories.length - 1 && ", "}
                </React.Fragment>
            ))}
        </span>
    );
};

export default DocCategory;
