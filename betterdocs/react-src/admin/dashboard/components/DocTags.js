import React from "react";
import { decodeEntities } from "@wordpress/html-entities";
import useFetch from "../hooks/useFetch";

const DocTags = ({ tags }) => {
    return (
        <span className="betterdocs-dashboard-list-item-tag">
            {tags.map((tag, index) => (
                <a key={index} href={tag?.term_url} target="_blank">
                    {decodeEntities(tag.term_name)}
                </a>
            ))}
        </span>
    );
};

export default DocTags;
