import React from "react";
import { useBlockProps } from "@wordpress/block-editor";
import { buildQueryString } from "@wordpress/url";
import { Spinner } from "@wordpress/components";
import { useMemo, useEffect } from "@wordpress/element";
import { safeHTML } from '@wordpress/dom';

import Inspector from "./inspector";
import { Body, NotFound, SingleCategory } from "../../../components";
import {
    usePreviewDeviceType,
    useDuplicateBlockIdFix,
    useStyleSheets,
    useFetch,
} from "../../../hooks";
import cssProperties from "./cssProperties";
import { FAQList } from "../../../components/partials/";
import { htmlToElem } from "../../../helpers/helper";
import FAQTabLayout from "../../../components/partials/FAQTabLayout";

const BLOCK_PREFIX = "betterdocs-faq";
const Edit = (props) => {
    const { attributes, setAttributes, isSelected, clientId } = props;
    const {
        blockId,
        faqLayout,
        faqSectionText,
        includeFaqGroup,
        excludeFaqGroup,
        faqGroupTitleColor,
        faqGroupTitleHoverColor,
        faqListColor,
        faqContentColor,
        faqIconColor,
        faqGroupTitleTypography,
        faqTaxonomy,
        handbookPerPage,
        orderBy,
        order,
        enableNestedSubfaq,
        layoutMode,
        layout,
    } = attributes;
    ``;
    usePreviewDeviceType(setAttributes);
    useDuplicateBlockIdFix(BLOCK_PREFIX, blockId, clientId, setAttributes);
    const { properties, htmlAttributes, styleTag } = useStyleSheets({
        properties: cssProperties({ blockId, faqLayout }),
        setAttributes,
        attributes,
    });

    const isProductAssignments = faqTaxonomy === 'product_assignments';

    // The REST slug used to fetch terms for the editor preview.
    // product_assignments has no taxonomy of its own, so preview using
    // betterdocs_product_faq_category (same terms the frontend resolver draws from).
    const previewTaxonomySlug = isProductAssignments
        ? 'betterdocs_product_faq_category'
        : (faqTaxonomy || 'betterdocs_faq_category');

    const faqApiURL = useMemo(() => {
        let query = {
            per_page: handbookPerPage ? handbookPerPage : 9,
            orderby: orderBy,
            order: order,
            hide_empty: 1,
        };

        // Include/exclude only applies in taxonomy modes, not product_assignments.
        if (!isProductAssignments) {
            let include =
                includeFaqGroup && includeFaqGroup !== "[]"
                    ? JSON.parse(includeFaqGroup).map((faq) => faq.value)
                    : [];

            let exclude =
                excludeFaqGroup && excludeFaqGroup !== "[]"
                    ? JSON.parse(excludeFaqGroup).map((faq) => faq.value)
                    : [];

            include = include.filter((item) => !exclude.includes(item));

            if (include.length > 0) {
                query["include"] = include;
            }
            if (exclude.length > 0) {
                query["exclude"] = exclude;
            }
        }

        return `/wp/v2/${previewTaxonomySlug}/?${buildQueryString(query)}`;
    }, [isProductAssignments, previewTaxonomySlug, includeFaqGroup, excludeFaqGroup, handbookPerPage, orderBy, order]);

    const {
        data: faqs,
        isLoading: isFaqLoading,
        error: faqError,
    } = useFetch(faqApiURL);

    const blockProps = useBlockProps({
        className: `bd-guten-block-main-parent-wrapper`,
    });

    let leyout = "layout-modern";
    if (faqLayout === "layout-2") {
        leyout = "layout-classic";
    }

    return (
        <>
            {isSelected && (
                <Inspector
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
            )}
            <div {...blockProps}>
                {styleTag()}
                {
                    <div
                        className={`${safeHTML(
                            blockId,
                        )}  betterdocs-faq-wrapper ${leyout} betterdocs-faq-${faqLayout} betterdocs-shortcode`}
                    >
                        <h2
                            className={`betterdocs-faq-${faqLayout} betterdocs-faq-section-title`}
                        >
                            {faqSectionText}{" "}
                        </h2>

                        <div className="betterdocs-faq-inner-wrapper">
                            {
                                isFaqLoading && <Spinner />
                            }
                            {
                                !isFaqLoading && faqs?.length == 0 && (
                                    <NotFound />
                                )
                            }
                            {
                                ( !isFaqLoading && faqLayout != 'layout-4')  &&
                                    faqs?.length > 0 &&
                                    faqs.map((faq) => (
                                        <>
                                            <div className="betterdocs-faq-title">
                                                <h2>{htmlToElem(faq.name)}</h2>
                                            </div>
                                            <FAQList
                                                key={faq.id}
                                                widgetType={"batterdocs-faq"}
                                                attributes={attributes}
                                                faqs={faqs}
                                                {...faq}
                                            />
                                        </>
                                    ))
                            }
                            {
                                (faqLayout == 'layout-4' && !isFaqLoading) &&
                                <FAQTabLayout faqCategories={faqs} attributes={attributes}/>
                            }
                        </div>
                    </div>
                }
            </div>
        </>
    );
};

export default Edit;
