import React from "react";
import { __ } from "@wordpress/i18n";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Counts from "./components/Counts";
import Video from "./components/Video";
import RecentDocs from "./components/RecentDocs";
import RecentFaq from "./components/RecentFaq";
import AIChatbot from "./components/AIChatbot";

const DashboardOverview = () => {
	const docCount = betterdocs_admin?.count_all_docs;
	const faqCount = betterdocs_admin?.count_all_faq;
	const hasDocs = docCount > 0;
	const hasFaqs = faqCount > 0;

    return (
        <>
            <div className="betterdocs-dashboard-container">
                <Counts />

                <div className="betterdocs-overview-content">
                    <div className="betterdocs-row">
                        <div className="betterdocs-overview-col  betterdocs-col-9 ">
                            <Video />

                            <div className="betterdocs-recent-section">
                                <div className="betterdocs-row">
									{hasDocs && <RecentDocs />}
									{hasFaqs && <RecentFaq />}
                                </div>
                            </div>

                            <AIChatbot />
                        </div>
                        <div className="betterdocs-overview-col  betterdocs-col-3">
                            <div className="betterdocs-card features-list-bg">
                                <span className="betterdocs-card-icon">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <ellipse cx="16.0008" cy="16" rx="16.0008" ry="16" fill="#FEF0C7" />
                                        <g clipPath="url(#clip0_11426_51082)">
                                            <path
                                                d="M25.8767 11.4385C25.677 11.2635 25.4296 11.152 25.1663 11.1185C24.9029 11.0849 24.6355 11.1308 24.3983 11.2501L20.4897 13.1985L17.1562 7.65763C17.0368 7.45938 16.8682 7.29536 16.6667 7.1815C16.4651 7.06765 16.2376 7.00781 16.0062 7.00781C15.7747 7.00781 15.5472 7.06765 15.3457 7.1815C15.1442 7.29536 14.9755 7.45938 14.8561 7.65763L11.5226 13.1985L7.61323 11.251C7.37629 11.1326 7.10963 11.087 6.84684 11.1199C6.58404 11.1529 6.33686 11.2628 6.13645 11.436C5.93604 11.6091 5.79135 11.8377 5.72061 12.0929C5.64988 12.3481 5.65626 12.6185 5.73896 12.8701L8.82246 22.316C8.8689 22.4583 8.9467 22.5883 9.05011 22.6966C9.15353 22.8048 9.27993 22.8884 9.41998 22.9413C9.56003 22.9942 9.71017 23.0149 9.85931 23.002C10.0085 22.9891 10.1528 22.9429 10.2817 22.8668C10.3017 22.8551 12.3701 21.6743 16.0045 21.6743C19.6389 21.6743 21.7073 22.8568 21.7231 22.866C21.852 22.9431 21.9967 22.9902 22.1463 23.0037C22.2959 23.0173 22.4466 22.997 22.5873 22.9443C22.7279 22.8916 22.8549 22.8079 22.9588 22.6994C23.0627 22.5909 23.1408 22.4604 23.1874 22.3176L26.2709 12.8768C26.356 12.6251 26.3639 12.3536 26.2937 12.0974C26.2235 11.8411 26.0783 11.6116 25.8767 11.4385ZM21.6323 20.6343C20.5197 20.2076 18.6046 19.6743 16.0045 19.6743C13.4044 19.6743 11.4893 20.2093 10.3767 20.636L8.12659 13.7435L11.1709 15.2576C11.4734 15.4071 11.821 15.4378 12.145 15.3435C12.469 15.2492 12.7459 15.0369 12.921 14.7485L16.0045 9.6243L19.088 14.7493C19.2632 15.0376 19.5402 15.2497 19.8642 15.3439C20.1882 15.438 20.5357 15.4072 20.8381 15.2576L23.8816 13.741L21.6323 20.6343ZM19.993 18.051C19.9566 18.287 19.837 18.5021 19.6557 18.6576C19.4744 18.813 19.2435 18.8985 19.0047 18.8985C18.9531 18.8983 18.9015 18.8944 18.8505 18.8868C16.9627 18.6023 15.043 18.6023 13.1552 18.8868C12.893 18.9272 12.6256 18.8619 12.4116 18.7052C12.1977 18.5484 12.0547 18.3131 12.0143 18.051C11.9738 17.7888 12.0392 17.5214 12.1959 17.3074C12.3527 17.0935 12.588 16.9506 12.8502 16.9101C14.9401 16.5946 17.0656 16.5946 19.1555 16.9101C19.2854 16.93 19.4102 16.9752 19.5227 17.0433C19.6351 17.1114 19.733 17.201 19.8108 17.3069C19.8886 17.4129 19.9447 17.5331 19.976 17.6608C20.0073 17.7885 20.0131 17.9211 19.993 18.051Z"
                                                fill="#FDB022"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_11426_51082">
                                                <rect
                                                    width="21.3345"
                                                    height="21.3333"
                                                    fill="white"
                                                    transform="translate(5.33789 5.33594)"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </span>

                                <h4 className="betterdocs-card-title">
                                    {betterdocs_admin?.betterdocs_pro_plugin
                                        ? __('These are the Features you are getting👇🏻', 'betterdocs')
                                        : __('Want Advanced Features?', 'betterdocs')
                                    }
                                </h4>
                                <ul className="betterdocs-card-list">
                                    <li className="betterdocs-card-list-item">
                                        <span className="card-list-icon">
                                            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1 3.88L2.67619 5.8L6.86667 1"
                                                    stroke="white"
                                                    strokeWidth="1.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span className="card-list-title">
                                            {__('Write with AI Auto Writer', 'betterdocs')}
                                        </span>
                                    </li>
                                    <li className="betterdocs-card-list-item">
                                        <span className="card-list-icon">
                                            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1 3.88L2.67619 5.8L6.86667 1"
                                                    stroke="white"
                                                    strokeWidth="1.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span className="card-list-title">
                                            {__('Multiple Knowledge Base', 'betterdocs')}
                                        </span>
                                    </li>
                                    <li className="betterdocs-card-list-item">
                                        <span className="card-list-icon">
                                            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1 3.88L2.67619 5.8L6.86667 1"
                                                    stroke="white"
                                                    strokeWidth="1.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span className="card-list-title">
                                            {__('Instant Answer Bot', 'betterdocs')}
                                        </span>
                                    </li>
                                    <li className="betterdocs-card-list-item">
                                        <span className="card-list-icon">
                                            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1 3.88L2.67619 5.8L6.86667 1"
                                                    stroke="white"
                                                    strokeWidth="1.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span className="card-list-title">
                                            {__('Insightful Analytics', 'betterdocs')}
                                        </span>
                                    </li>
                                    <li className="betterdocs-card-list-item">
                                        <span className="card-list-icon">
                                            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1 3.88L2.67619 5.8L6.86667 1"
                                                    stroke="white"
                                                    strokeWidth="1.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span className="card-list-title">
                                            {__('Internal Knowledge Base', 'betterdocs')}
                                        </span>
                                    </li>
                                    <li className="betterdocs-card-list-item">
                                        <span className="card-list-icon">
                                            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1 3.88L2.67619 5.8L6.86667 1"
                                                    stroke="white"
                                                    strokeWidth="1.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span className="card-list-title">
                                            {__('Glossary & Encyclopedia', 'betterdocs')}
                                        </span>
                                    </li>
                                    <li className="betterdocs-card-list-item">
                                        <span className="card-list-icon">
                                            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1 3.88L2.67619 5.8L6.86667 1"
                                                    stroke="white"
                                                    strokeWidth="1.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span className="card-list-title">
											{__('AI Chatbot Addon', 'betterdocs')}
                                        </span>
                                    </li>
                                </ul>
								{betterdocs_admin?.betterdocs_pro_plugin == false && (
								<div className="betterdocs-goto-pro-section">
									<a href="https://betterdocs.co/dashboard-upgrade-to-pro" className="betterdocs-goto-pro-button">
										<span className="pro-btn-icon">
											<svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M15.9067 3.57281C15.757 3.44156 15.5715 3.358 15.3739 3.33283C15.1764 3.30767 14.9758 3.34205 14.798 3.43157L11.8667 4.89274L9.36672 0.737339C9.27716 0.588656 9.15068 0.46565 8.99955 0.380261C8.84843 0.294872 8.6778 0.25 8.50422 0.25C8.33064 0.25 8.16 0.294872 8.00888 0.380261C7.85776 0.46565 7.73128 0.588656 7.64172 0.737339L5.14172 4.89274L2.20984 3.4322C2.03215 3.34344 1.83217 3.30925 1.63508 3.33393C1.43799 3.35862 1.25262 3.44108 1.10232 3.57093C0.952016 3.70077 0.843505 3.8722 0.790457 4.0636C0.737409 4.255 0.742197 4.45782 0.804217 4.64651L3.11672 11.7305C3.15155 11.8372 3.20989 11.9348 3.28745 12.0159C3.36501 12.0971 3.4598 12.1598 3.56484 12.1995C3.66987 12.2391 3.78247 12.2547 3.89432 12.245C4.00617 12.2354 4.11442 12.2007 4.21109 12.1436C4.22609 12.1349 5.77734 11.2493 8.50297 11.2493C11.2286 11.2493 12.7798 12.1361 12.7917 12.143C12.8884 12.2008 12.9969 12.2361 13.109 12.2463C13.2212 12.2565 13.3343 12.2412 13.4398 12.2017C13.5453 12.1622 13.6405 12.0994 13.7184 12.0181C13.7964 11.9367 13.8549 11.8389 13.8898 11.7318L16.2023 4.65151C16.2662 4.46272 16.2721 4.25916 16.2195 4.06696C16.1668 3.87477 16.0579 3.70269 15.9067 3.57281ZM12.7236 10.4693C11.8892 10.1493 10.453 9.74936 8.50297 9.74936C6.55297 9.74936 5.11672 10.1506 4.28234 10.4706L2.59484 5.30147L4.87797 6.43704C5.10484 6.54915 5.36551 6.57213 5.60851 6.50144C5.8515 6.43074 6.05916 6.27151 6.19047 6.05518L8.50297 2.21226L10.8155 6.05581C10.9469 6.27203 11.1546 6.43113 11.3976 6.5017C11.6405 6.57228 11.9012 6.54921 12.128 6.43704L14.4105 5.2996L12.7236 10.4693ZM11.4942 8.53193C11.4669 8.70892 11.3772 8.87029 11.2412 8.98687C11.1052 9.10344 10.9321 9.16752 10.753 9.16752C10.7143 9.16738 10.6756 9.16445 10.6373 9.15877C9.22158 8.94544 7.78185 8.94544 6.36609 9.15877C6.1695 9.1891 5.96891 9.1401 5.80845 9.02254C5.64799 8.90499 5.5408 8.72851 5.51047 8.53193C5.48013 8.33534 5.52914 8.13477 5.6467 7.97431C5.76426 7.81386 5.94075 7.70668 6.13734 7.67635C7.70471 7.4397 9.29873 7.4397 10.8661 7.67635C10.9635 7.69122 11.0571 7.72515 11.1414 7.77621C11.2258 7.82727 11.2992 7.89446 11.3575 7.97392C11.4159 8.05338 11.458 8.14357 11.4814 8.23932C11.5049 8.33507 11.5092 8.4345 11.4942 8.53193Z" fill="#FDB022" />
											</svg>
										</span>
										<span> Upgrade to PRO </span>
									</a>
								</div>
								)}
                            </div>

                            <div className="betterdocs-card betterdocs-notice-board">

                                <div className="features-list-header">
                                    <span className="betterdocs-card-icon">
                                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M10.2241 11L12.4991 9.625L14.7741 11L14.1741 8.4L16.1741 6.675L13.5491 6.45L12.4991 4L11.4491 6.45L8.82409 6.675L10.8241 8.4L10.2241 11ZM3.69909 20.375C3.14909 20.4583 2.65326 20.3292 2.21159 19.9875C1.76992 19.6458 1.51576 19.2 1.44909 18.65L0.124089 7.725C0.0574219 7.175 0.190755 6.68333 0.524089 6.25C0.857422 5.81667 1.29909 5.56667 1.84909 5.5L2.99909 5.35V13.5C2.99909 14.6 3.39076 15.5417 4.17409 16.325C4.95742 17.1083 5.89909 17.5 6.99909 17.5H16.2991C16.1991 17.9 15.9991 18.2458 15.6991 18.5375C15.3991 18.8292 15.0324 19 14.5991 19.05L3.69909 20.375ZM6.99909 15.5C6.44909 15.5 5.97826 15.3042 5.58659 14.9125C5.19492 14.5208 4.99909 14.05 4.99909 13.5V2.5C4.99909 1.95 5.19492 1.47917 5.58659 1.0875C5.97826 0.695833 6.44909 0.5 6.99909 0.5H17.9991C18.5491 0.5 19.0199 0.695833 19.4116 1.0875C19.8033 1.47917 19.9991 1.95 19.9991 2.5V13.5C19.9991 14.05 19.8033 14.5208 19.4116 14.9125C19.0199 15.3042 18.5491 15.5 17.9991 15.5H6.99909Z"
                                                fill="#2E90FA"
                                            />
                                        </svg>
                                    </span>

                                    <h4 className="betterdocs-card-title">{__("What's New?", 'betterdocs')}</h4>
                                </div>

                                <ul className="betterdocs-card-list">
                                    <li className="betterdocs-card-list-item">
                                        <span className="card-list-icon">
                                            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1 3.88L2.67619 5.8L6.86667 1"
                                                    stroke="#00B884"
                                                    strokeWidth="1.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span className="card-list-title">
                                            {__('AI Chatbot Addon', 'betterdocs')}
                                        </span>
                                    </li>
                                    <li className="betterdocs-card-list-item">
                                        <span className="card-list-icon">
                                            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1 3.88L2.67619 5.8L6.86667 1"
                                                    stroke="#00B884"
                                                    strokeWidth="1.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span className="card-list-title">
                                            {__('Git Sync', 'betterdocs')}
                                        </span>
                                    </li>
                                    <li className="betterdocs-card-list-item">
                                        <span className="card-list-icon">
                                            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1 3.88L2.67619 5.8L6.86667 1"
                                                    stroke="#00B884"
                                                    strokeWidth="1.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span className="card-list-title">
                                            {__('New FAQ Retro Layout', 'betterdocs')}
                                        </span>
                                    </li>
                                    <li className="betterdocs-card-list-item">
                                        <span className="card-list-icon">
                                            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1 3.88L2.67619 5.8L6.86667 1"
                                                    stroke="#00B884"
                                                    strokeWidth="1.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span className="card-list-title">
                                            {__('Author template', 'betterdocs')}
                                        </span>
                                    </li>
                                    <li className="betterdocs-card-list-item">
                                        <span className="card-list-icon">
                                            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1 3.88L2.67619 5.8L6.86667 1"
                                                    stroke="#00B884"
                                                    strokeWidth="1.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span className="card-list-title">
                                            {__('Docs order option for Elementor', 'betterdocs')}
                                        </span>
                                    </li>
                                </ul>

                                <div className="betterdocs-admin-block-btn betterdocs-learn-more-button">
                                    <a rel="nofollow" href="https://betterdocs.co/changelog/" target="_blank">{__('Learn More', 'betterdocs')}</a>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M15.1393 7.52959L10.4726 2.86292C10.3469 2.74148 10.1785 2.67429 10.0037 2.67581C9.8289 2.67733 9.66169 2.74744 9.53809 2.87104C9.41448 2.99465 9.34437 3.16186 9.34285 3.33666C9.34133 3.51145 9.40853 3.67985 9.52997 3.80559L13.0586 7.33426H1.33464C1.15782 7.33426 0.988255 7.40449 0.863231 7.52952C0.738207 7.65454 0.667969 7.82411 0.667969 8.00092C0.667969 8.17773 0.738207 8.3473 0.863231 8.47233C0.988255 8.59735 1.15782 8.66759 1.33464 8.66759H13.0586L9.52997 12.1963C9.4663 12.2578 9.41551 12.3313 9.38057 12.4127C9.34563 12.494 9.32724 12.5815 9.32647 12.67C9.3257 12.7585 9.34257 12.8463 9.37609 12.9282C9.40961 13.0102 9.45911 13.0846 9.5217 13.1472C9.5843 13.2098 9.65873 13.2593 9.74067 13.2928C9.8226 13.3263 9.91038 13.3432 9.9989 13.3424C10.0874 13.3417 10.1749 13.3233 10.2562 13.2883C10.3376 13.2534 10.4111 13.2026 10.4726 13.1389L15.1393 8.47226C15.2643 8.34724 15.3345 8.1777 15.3345 8.00092C15.3345 7.82415 15.2643 7.65461 15.1393 7.52959Z" fill="#00B884"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </>
    );
};

export default DashboardOverview;
