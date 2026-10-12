import React from "react";
import { useMemo } from "@wordpress/element";
import { buildQueryString } from "@wordpress/url";

import { useFetch } from "../../hooks";
import { htmlToElem } from "../../helpers/helper";
import { DownChevronIcon, Minus1, Minus2, Plus1, Plus2, UpChevronIcon } from "../icons/FaqIcons";

const FAQList = ({
    className = "betterfaqs-articles-list",
    attributes,
    faqs,
    widgetType,
    ...props
}) => {
    const {
        postsPerPage,
        postsOrderBy,
        postsOrder,
        faqLayout,
        listIcon,
        enableNestedSubcategory,
        showButtonIcon,
        buttonIcon,
        buttonIconPosition,
        buttonColor,
        buttonHoverColor,
        faqTaxonomy,
    } = attributes;

    // Map faqTaxonomy to the WP REST filter param for betterdocs_faq posts.
    const faqTermParam = (faqTaxonomy === 'betterdocs_product_faq_category' || faqTaxonomy === 'product_assignments')
        ? 'betterdocs_product_faq_category'
        : 'betterdocs_faq_category';

    const faqsByCatIDURL = useMemo(() => {
        let query = {
            posts_per_page: -1,
            orderby: postsOrderBy,
            order: postsOrder,
            [faqTermParam]: props.id,
        };

        const baseURL =
            query.orderby === "betterfaqs_order"
                ? "/betterdocs/order_faqs"
                : "/wp/v2/betterdocs_faq";

        return `${baseURL}?${buildQueryString(query)}`;
    }, [faqs, postsPerPage, postsOrderBy, postsOrder, props.id, faqTermParam]);

    const {
        data: betterdocs_faq,
        isLoading: isFAQLoading,
        error: faqsError,
    } = useFetch(faqsByCatIDURL);

    return (
        <ul class="betterdocs-faq-list">
            {!isFAQLoading &&
                betterdocs_faq.length > 0 &&
                betterdocs_faq.map((faq) => (
                    <li>
                        <div className={`betterdocs-faq-group`}>
                            <div className="betterdocs-faq-post">
                                {showButtonIcon && faqLayout == "layout-2" && (
                                    <div className="betterdocs-faq-post-icon-group">
                                        <Minus2
                                            buttonColor={buttonColor}
                                            buttonHoverColor={buttonHoverColor}
                                        />
                                        <Plus2
                                            buttonColor={buttonColor}
                                            buttonHoverColor={buttonHoverColor}
                                        />
                                    </div>
                                )}
                                <span className="betterdocs-faq-post-name">
                                    {faq.title.rendered}
                                </span>

                                {showButtonIcon && faqLayout == "layout-1" && (
                                    <>
                                        <Minus1
                                            buttonColor={buttonColor}
                                            buttonHoverColor={buttonHoverColor}
                                        />
                                        <Plus1
                                            buttonColor={buttonColor}
                                            buttonHoverColor={buttonHoverColor}
                                        />
                                    </>
                                )}
                                {showButtonIcon && faqLayout == 'layout-3' && (
                                    <>
                                        <UpChevronIcon/>
                                        <DownChevronIcon/>
                                    </>
                                )}
                            </div>
                            <div className="betterdocs-faq-main-content">
                                {htmlToElem(faq.content.rendered)}
                            </div>
                        </div>
                    </li>
                ))}
        </ul>
    );
};

export default FAQList;
