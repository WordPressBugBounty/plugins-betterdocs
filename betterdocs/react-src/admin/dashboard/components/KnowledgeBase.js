import React from "react";
import { decodeEntities } from "@wordpress/html-entities";

const KnowledgeBase = ({ knowledgebase }) => {
    return (
        <span className="betterdocs-dashboard-list-item-category">
            {knowledgebase.map((category, index) => (
                <React.Fragment key={index}>
                    <a href={category.term_url}>{decodeEntities(category.term_name)}</a>
                    {index < knowledgebase.length - 1 && ", "}
                </React.Fragment>
            ))}
        </span>
    );
};

export default KnowledgeBase;
