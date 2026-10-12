import categoryGrid from '../utils/categoryGrid';
import selectMkb from '../utils/selectMkb';
import { createRoot } from 'react-dom/client';
import SearchField from '../public/shortcodes/search-modal/SearchField';

jQuery(window).on("elementor/frontend/init", function () {
    elementorFrontend.hooks.addAction("frontend/element_ready/betterdocs-category-grid.default", categoryGrid);
    elementorFrontend.hooks.addAction("frontend/element_ready/betterdocs-category-grid.default", selectMkb);
    elementorFrontend.hooks.addAction("frontend/element_ready/betterdocs-sidebar.default", () => {
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
                    doc_ids:node.getAttribute('data-doc_ids'),
                    doc_categories_ids:node.getAttribute('data-doc_categories_ids'),
                    faq_categories_ids:node.getAttribute('data-faq_categories_ids')
                };
                createRoot(node).render(<SearchField layout={className} {...dataAttributes}/>);
            }
        }
    });
	if( elementorFrontend != undefined && elementorFrontend.isEditMode() ) {
		elementorFrontend.hooks.addAction("frontend/element_ready/betterdocs-search-form.default", () => {
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
						faq_categories_ids:node.getAttribute('data-faq_categories_ids')
					};
					createRoot(node).render(
						<SearchField layout={className} {...dataAttributes} />
					);
				}
			}
		});
	}
});
