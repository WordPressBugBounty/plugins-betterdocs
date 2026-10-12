import React from "react";
import useFetch from "../hooks/useFetch";

const DocAuthor = ({ authorInfo }) => {
    return (
        <span className="betterdocs-dashboard-list-item-author">
            <a href={authorInfo?.author_url}>{authorInfo?.author_nicename}</a>
        </span>
    );
};

export default DocAuthor;
