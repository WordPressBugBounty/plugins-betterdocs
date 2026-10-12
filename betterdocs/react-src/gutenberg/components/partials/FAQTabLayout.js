import { decodeEntities } from "@wordpress/html-entities";
import { useState, useEffect, useMemo } from "react";
import { buildQueryString } from "@wordpress/url";
import apiFetch from "@wordpress/api-fetch";
import { DownChevronIcon } from "../icons/FaqIcons";
import { Spinner } from "@wordpress/components";

const FAQTabLayout = ({ faqCategories, attributes }) => {
	const [termContents, setTermContents]  = useState({});
	const [selectedFaq, setSelectedFaq]    = useState(undefined);

	let { showButtonIcon, faqTaxonomy } = attributes;

	const faqTermParam = (faqTaxonomy === 'betterdocs_product_faq_category' || faqTaxonomy === 'product_assignments')
		? 'betterdocs_product_faq_category'
		: 'betterdocs_faq_category';

	useEffect(() => {
		if( faqCategories?.length > 0 ) {
			setSelectedFaq(faqCategories[0]?.id); //set the index to 0 for the first time, so that the fist faq group is selected
			faqCategories?.map((category) => {
				const {
					postsPerPage,
					postsOrderBy,
					postsOrder
				} = attributes;

				let query = {
					posts_per_page: -1,
					orderby: postsOrderBy,
					order: postsOrder,
					[faqTermParam]: category?.id,
				};

				let baseURL = query.orderby === "betterfaqs_order" ? "/betterdocs/order_faqs" : "/wp/v2/betterdocs_faq";

				let faqsByCatIDURL = `${baseURL}?${buildQueryString(query)}`;

				apiFetch({
					path:faqsByCatIDURL
				}).then((result) => {
					setTermContents((previousState) => {
						previousState[category.id] = result?.length > 0 ? result : [];
						return {...previousState};
					})
				});
			});
		}
	}, [faqCategories, attributes]);

	const tabSvgIcon = (
		<>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={24}
				height={24}
				fill="none"
			>
				<g
					stroke="#C4C4C4"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					clipPath="url(#a)"
				>
					<path d="M19.875 6.27c.7.398 1.13 1.143 1.125 1.948v7.284c0 .809-.443 1.555-1.158 1.948l-6.75 4.27a2.27 2.27 0 0 1-2.184 0l-6.75-4.27A2.225 2.225 0 0 1 3 15.502V8.217c0-.81.443-1.554 1.158-1.947l6.75-3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033ZM12 16v.01" />
					<path d="M12 13a2 2 0 0 0 .914-3.782A1.98 1.98 0 0 0 10.5 9.7" />
				</g>
				<defs>
					<clipPath id="a">
						<path fill="#fff" d="M0 0h24v24H0z" />
					</clipPath>
				</defs>
			</svg>
		</>
	);

	return (
			<>
				<div className="betterdocs-faq-tab-wrapper">
					{faqCategories?.map((faq, index) => {
						return (
							<>
								<div
									className={`betterdocs-faq-tab${selectedFaq == faq?.id ? ' active' : ''}`}
									data-term-id={faq?.id}
									onClick={(e) => {
										setSelectedFaq(faq?.id);
									}}
								>
									{faq?.meta?.faq_group_icon?.length > 0 ? <><img src={faq?.meta?.faq_group_icon[0]} width={24} height={24} className='faq-group-image'/></> : <><span className="faq-tab-icon">
										{tabSvgIcon}
									</span></>}
									<span className="faq-tab-title">
										{decodeEntities(faq?.name)}
									</span>
								</div>
							</>
						);
					})}
				</div>
				<div className="betterdocs-faq-list-wrapper">
					<div className="betterdocs-faq-list-content">
						<ul className="betterdocs-faq-list">
							{(termContents[selectedFaq] == undefined && <Spinner/>)}
							{( termContents[selectedFaq] != undefined && termContents[selectedFaq]?.length > 0 ) && <>
									{
										termContents[selectedFaq]?.map((value) => {
											return <>
														<li>
															<div className="betterdocs-faq-group">
																<div className="betterdocs-faq-post">
																	<span className="betterdocs-faq-post-name">{decodeEntities(value?.title?.rendered)}</span>
																	{showButtonIcon && <DownChevronIcon/>}
																</div>
															</div>
														</li>
												   </>
										})
									}
							</>}
						</ul>
					</div>
				</div>
			</>
	);
};

export default FAQTabLayout;
