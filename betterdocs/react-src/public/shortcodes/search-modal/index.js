import React from 'react';
import { createRoot } from 'react-dom/client';
import SearchField from './SearchField'; // Adjust the path as necessary

document.addEventListener('DOMContentLoaded', () => {
    const searchDiv = document.querySelectorAll('[id=betterdocs-search-modal]');
    if (searchDiv) {
        for( let node of searchDiv ) {
            const className = node?.className;
            const dataAttributes = {
                placeholder: node.getAttribute('data-placeholder'),
                heading: node.getAttribute('data-heading'),
                subheading: node.getAttribute('data-subheading'),
                headingTag: node.getAttribute('data-headingtag'),
                subheadingTag: node.getAttribute('data-subheadingtag'),
                buttonText: node.getAttribute('data-buttontext'),
                numberofdocs:node.getAttribute('data-numberofdocs'),
                numberoffaqs:node.getAttribute('data-numberoffaqs'),
                docterms:node.getAttribute('data-docterms'),
                faqterms:node.getAttribute('data-faqterms'),
                searchButton:node.getAttribute('data-searchbutton'),
                doc_ids:node.getAttribute('data-doc_ids'),
                doc_categories_ids:node.getAttribute('data-doc_categories_ids'),
                faq_categories_ids:node.getAttribute('data-faq_categories_ids'),
				enable_faq_search:node.getAttribute('data-enable_faq_search'),
				enable_docs_search:node.getAttribute('data-enable_docs_search'),
				enable_ai_powered_search:node.getAttribute('data-enable_ai_powered_search'),
				kbBasedSearch:node.getAttribute('data-kb_based_search')
            };
            const root = createRoot(node);
            root.render(<SearchField layout={className} {...dataAttributes} />);
        }
    }
});
