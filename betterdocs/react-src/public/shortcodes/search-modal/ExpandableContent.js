import React, { useState } from 'react';

const ExpandableContent = ({ content = '', wordLimit }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const truncateContent = (content, wordLimit) => {
        if (!content) return ''; // Handle case where content is not defined
        const words = content.split(/\s+/);
        return words.slice(0, wordLimit).join(' ') + (words.length > wordLimit ? '...' : '');
    };

    const stripPTags = (html) => {
        if (!html) return ''; // Handle case where html is not defined
        return html.replace(/<\/?p[^>]*>/g, '');
    };

    const wordCount = (text) => {
        if (!text) return 0; // Handle case where text is not defined
        return text.trim().split(/\s+/).length;
    };

    const displayedContent = isExpanded ? stripPTags(content) : stripPTags(truncateContent(content, wordLimit));
    const wordCountExceeded = wordCount(content) > wordLimit;

    return (
        <div className="content-sub">
            <p>
                <span dangerouslySetInnerHTML={{ __html: displayedContent }} />
                <span onClick={toggleExpand} className="show-more-btn" style={{ cursor: 'pointer' }}>
                    {(wordCountExceeded && !isExpanded) && 'Show More'}
                    {isExpanded && 'Show Less'}
                </span>
            </p>
        </div>
    );
};

export default ExpandableContent;
