import React, { useRef, useEffect, useState } from "react";

import { __ } from "@wordpress/i18n";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { PopupVideo } from "../dashboard-overview/components/PopupVideo";

import AIChatbotImage from "./assets/images/videoThumb.svg";
import aichatborbenefits1 from "./assets/images/aichatborbenefits1.svg";
import aichatborbenefits2 from "./assets/images/aichatborbenefits2.svg";
import aichatborbenefits3 from "./assets/images/aichatborbenefits3.svg";
import aichatborbenefits4 from "./assets/images/aichatborbenefits4.svg";
import tourContentImg1 from "./assets/images/tourContentImg1.svg";
import tourContentImg2 from "./assets/images/tourContentImg2.svg";
import tourContentImg3 from "./assets/images/tourContentImg3.svg";
import AnalyticsSliderimg1 from "./assets/images/AnalyticsSliderimg1.svg";
import AnalyticsSliderimg2 from "./assets/images/AnalyticsSliderimg2.svg";
import AnalyticsSliderimg3 from "./assets/images/AnalyticsSliderimg3.svg";
import AnalyticsSliderimg4 from "./assets/images/AnalyticsSliderimg4.svg";


const sliderItems = [
	{
		id: 1,
		sliderImg: AnalyticsSliderimg1,
		sliderCardTitle: __("Full Knowledge Base Data Processing", "betterdocs"),
		sliderCardSubTitle:
			__("Get your full website analyzed by BetterDocs AI Chatbot and have all the data processed. The addon will then utilize AI to generate replies based on the processed data.", "betterdocs"),
	},
	{
		id: 2,
		sliderImg: AnalyticsSliderimg2,
		sliderCardTitle: __("Integration with OpenAI", "betterdocs"),
		sliderCardSubTitle:
			__("The chatbot addon works by integrating with the renowned OpenAI platform, which you can configure in a few, simple steps to start giving informative chat replies with AI.", "betterdocs"),
	},
	{
		id: 3,
		sliderImg: AnalyticsSliderimg3,
		sliderCardTitle: __("3 Embed Model Options", "betterdocs"),
		sliderCardSubTitle:
			__("With BetterDocs Chatbot, you have 3 different embed model options to choose from. Based on your choice, the addon will process your website data to provide replies.", "betterdocs"),
	},
	{
		id: 4,
		sliderImg: AnalyticsSliderimg4,
		sliderCardTitle: __("2 Chat Model Options", "betterdocs"),
		sliderCardSubTitle:
			__("As a BetterDocs user, you get to select from 2 chat model options for your AI-generated answers. So, you can pick your preferred chat model straight from BetterDocs plugin.", "betterdocs"),
	},


];

const SparkleIcon = () => (
	<svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g filter="url(#filter0_d_11660_40617)">
			<path
				d="M5 8.99819C5 8.73939 5.2104 8.53206 5.46793 8.50653C7.68223 8.28699 9.44321 6.526 9.66275 4.31168C9.68828 4.05415 9.89561 3.84375 10.1544 3.84375C10.4132 3.84375 10.6205 4.05415 10.6461 4.31168C10.8656 6.52599 12.6266 8.28699 14.8409 8.50653C15.0984 8.53206 15.3088 8.73939 15.3088 8.99819C15.3088 9.25698 15.0984 9.46431 14.8409 9.48984C12.6266 9.70939 10.8656 11.4704 10.6461 13.6847C10.6205 13.9422 10.4132 14.1526 10.1544 14.1526C9.89561 14.1526 9.68828 13.9422 9.66275 13.6847C9.44321 11.4704 7.68223 9.70939 5.46793 9.48984C5.2104 9.46431 5 9.25698 5 8.99819Z"
				fill="url(#paint0_linear_11660_40617)"
			/>
		</g>
		<g filter="url(#filter1_d_11660_40617)">
			<path
				d="M14.2773 3.32758C14.2773 3.24994 14.3405 3.18774 14.4177 3.18008C15.082 3.11422 15.6103 2.58592 15.6762 1.92163C15.6838 1.84437 15.746 1.78125 15.8237 1.78125C15.9013 1.78125 15.9635 1.84437 15.9712 1.92163C16.037 2.58592 16.5653 3.11422 17.2296 3.18008C17.3069 3.18774 17.37 3.24994 17.37 3.32758C17.37 3.40522 17.3069 3.46742 17.2296 3.47508C16.5653 3.54094 16.037 4.06924 15.9712 4.73354C15.9635 4.81079 15.9013 4.87391 15.8237 4.87391C15.746 4.87391 15.6838 4.81079 15.6762 4.73354C15.6103 4.06924 15.082 3.54094 14.4177 3.47508C14.3405 3.46742 14.2773 3.40522 14.2773 3.32758Z"
				fill="url(#paint1_linear_11660_40617)"
			/>
		</g>
		<g filter="url(#filter2_d_11660_40617)">
			<path
				d="M13.25 14.1555C13.25 14.052 13.3342 13.9691 13.4372 13.9589C14.3229 13.871 15.0273 13.1666 15.1151 12.2809C15.1253 12.1779 15.2082 12.0938 15.3118 12.0938C15.4153 12.0938 15.4982 12.1779 15.5084 12.2809C15.5962 13.1666 16.3006 13.871 17.1863 13.9589C17.2894 13.9691 17.3735 14.052 17.3735 14.1555C17.3735 14.259 17.2894 14.342 17.1863 14.3522C16.3006 14.44 15.5962 15.1444 15.5084 16.0301C15.4982 16.1331 15.4153 16.2173 15.3118 16.2173C15.2082 16.2173 15.1253 16.1331 15.1151 16.0301C15.0273 15.1444 14.3229 14.44 13.4372 14.3522C13.3342 14.342 13.25 14.259 13.25 14.1555Z"
				fill="url(#paint2_linear_11660_40617)"
			/>
		</g>
		<defs>
			<filter id="filter0_d_11660_40617" x="0.876464" y="2.81287" width="18.5557" height="18.5596" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feColorMatrix in="SourceAlpha" type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
				<feOffset dy="3.09265" />
				<feGaussianBlur stdDeviation="2.06177" />
				<feComposite in2="hardAlpha" operator="out" />
				<feColorMatrix type="matrix"
					values="0 0 0 0 0 0 0 0 0 0.00392157 0 0 0 0 0.137255 0 0 0 0.13 0" />
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_11660_40617" />
				<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_11660_40617" result="shape" />
			</filter>
			<filter id="filter1_d_11660_40617" x="10.1538" y="0.750366" width="11.3408" height="11.3408" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feColorMatrix in="SourceAlpha" type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
				<feOffset dy="3.09265" />
				<feGaussianBlur stdDeviation="2.06177" />
				<feComposite in2="hardAlpha" operator="out" />
				<feColorMatrix type="matrix"
					values="0 0 0 0 0 0 0 0 0 0.00392157 0 0 0 0 0.137255 0 0 0 0.13 0" />
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_11660_40617" />
				<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_11660_40617" result="shape" />
			</filter>
			<filter id="filter2_d_11660_40617" x="9.12646" y="11.0629" width="12.3721" height="12.3721" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feColorMatrix in="SourceAlpha" type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
				<feOffset dy="3.09265" />
				<feGaussianBlur stdDeviation="2.06177" />
				<feComposite in2="hardAlpha" operator="out" />
				<feColorMatrix type="matrix"
					values="0 0 0 0 0 0 0 0 0 0.00392157 0 0 0 0 0.137255 0 0 0 0.13 0" />
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_11660_40617" />
				<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_11660_40617" result="shape" />
			</filter>
			<linearGradient id="paint0_linear_11660_40617" x1="10.1544" y1="3.84375" x2="10.1544" y2="14.1526" gradientUnits="userSpaceOnUse">
				<stop stopColor="#CD93FF" />
				<stop offset="1" stopColor="#A741FF" />
			</linearGradient>
			<linearGradient id="paint1_linear_11660_40617" x1="15.8237" y1="1.78125" x2="15.8237" y2="4.87391" gradientUnits="userSpaceOnUse">
				<stop stopColor="#D099FF" />
				<stop offset="1" stopColor="#CE96FF" />
			</linearGradient>
			<linearGradient id="paint2_linear_11660_40617" x1="15.3118" y1="12.0938" x2="15.3118" y2="16.2173" gradientUnits="userSpaceOnUse">
				<stop stopColor="#D099FF" />
				<stop offset="1" stopColor="#CE96FF" />
			</linearGradient>
		</defs>
	</svg>
);


const AIChatbot = () => {
	// popup
	const [isOpen, setIsOpen] = useState(false);
	const openPopup = () => setIsOpen(true);
	const closePopup = () => setIsOpen(false);
	const sectionRef = useRef(null);
	const [oneFourth, setOneFourth] = useState(300);
	const [isYearly, setIsYearly] = useState(false);

	useEffect(() => {
		if (sectionRef.current) {
			const fullWidth = sectionRef.current.offsetWidth;
			const oneFourthValue = fullWidth / 4;
			setOneFourth(`${oneFourthValue}px`);
		}

		console.log("oneFourthValue", oneFourth);
	}, []);



	const settings = {
        // className: "center",
        centerPadding: oneFourth,
        centerMode: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        arrows: true,
        dots: false,
        responsive: [
            {
                breakpoint: 1024, // For tablets and small desktops
                settings: {
                    slidesToShow: 1,
                    centerPadding: "60px",
                },
            },
            {
                breakpoint: 600,
                settings: {
                    arrows: true,
                    autoplay: true,
                    slidesToShow: 1,
                    centerPadding: "40px",
                },
            }
        ]
    };

	return (
		<div className="betterdocs-chatbot-container">
			<div className="betterdocs-overview-section betterdocs-chatbot-video-section">
				<div className="betterdocs-row align-items-center">
					<div className=" betterdocs-overview-col betterdocs-col-6  betterdocs-content-left">
						<div className="betterdocs-flex align-items-center betterdocs-chatbot-video-section-tag ">
							<span className="betterdocs-svg-icon">
								<SparkleIcon />
							</span>
							<span className="card-title">{__("AI Chatbot Addon", "betterdocs")}</span>
						</div>
						<h2 className="betterdocs-section-title">
							<span className="betterdocs-title-style">{__("AI Chatbot Addon", "betterdocs")}</span>
							<span>
								{__("Instantly Respond to Web Visitors’ Queries", "betterdocs")}
							</span>
						</h2>
						<p className="betterdocs-section-description">{__("Give quick & accurate answers to visitors’ queries collecting data from your entire website with our AI-powered chatbot addon.", "betterdocs")}</p>
						<a href="https://betterdocs.co/dashboard-purchase-ai-chatbot" className="betterdocs-chatbot-section-btn betterdocs-video-btn">{__("Get AI Chatbot", "betterdocs")}</a>
					</div>

					<div className=" betterdocs-overview-col betterdocs-col-6  betterdocs-content-right">

						<div class="popup-trigger" onClick={openPopup}>
							<img src={AIChatbotImage} />
						</div>
						{isOpen && (
							<div className="betterdocs-popup-overlay" onClick={closePopup}>
								<div
									className="betterdocs-popup-wrapper"
									onClick={(e) => e.stopPropagation()}
								>
									<PopupVideo closePopup={closePopup} />
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="betterdocs-overview-section betterdocs-benefits-chatbot-section">
				<div className="betterdocs-chatbot-section-header">
					<h2 className="betterdocs-section-title">
						<span>{__("Why Use BetterDocs", "betterdocs")}</span> <span className="betterdocs-title-style">{__("AI Chatbot", "betterdocs")}</span>
					</h2>
					<p className="betterdocs-section-sub-title">{__("Discover the benefits of using our AI-powered chatbot on your website.", "betterdocs")}</p>
				</div>

				<div className="betterdocs-chatbot-section-content">
					<div className="betterdocs-row">
						<div className="betterdocs-overview-col betterdocs-col-6  ">
							<div className="betterdocs-benefits-card">
								<div className="benefits-card-left-bg benefits-card-img-wrapper">
									<img src={aichatborbenefits1} />
								</div>
								<div className="benefits-card-header-wrapper">
									<h4 className="betterdocs-overview-card-header">{__("Easier Knowledge Base Navigation", "betterdocs")}</h4>
								</div>
							</div>
						</div>
						<div className="betterdocs-overview-col betterdocs-col-6">
							<div className="betterdocs-benefits-card">
								<div className="benefits-card-right-bg benefits-card-img-wrapper">
									<img src={aichatborbenefits2} />
								</div>
								<div className="benefits-card-header-wrapper">
									<h4 className="betterdocs-overview-card-header">{__("Instant Answers for All Queries", "betterdocs")}</h4>
								</div>
							</div>
						</div>
						<div className="betterdocs-overview-col betterdocs-col-6 ">
							<div className="betterdocs-benefits-card">
								<div className="benefits-card-left-bg benefits-card-img-wrapper">
									<img src={aichatborbenefits3} />
								</div>
								<div className="benefits-card-header-wrapper">
									<h4 className="betterdocs-overview-card-header">{__("Reduced Load for Your Support Team", "betterdocs")}</h4>
								</div>
							</div>
						</div>
						<div className="betterdocs-overview-col betterdocs-col-6 ">
							<div className="betterdocs-benefits-card">
								<div className="benefits-card-right-bg benefits-card-img-wrapper">
									<img src={aichatborbenefits4} />
								</div>
								<div className="benefits-card-header-wrapper">
									<h4 className="betterdocs-overview-card-header">{__("Improved Visitor Experience", "betterdocs")}</h4>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* slider section  */}
			<div className="betterdocs-overview-section betterdocs-analytics-reporting-section" ref={sectionRef}>
				<div className="betterdocs-chatbot-section-header">
					<h2 className="betterdocs-section-title">
						<span className="betterdocs-title-style">{__("Advanced Features", "betterdocs")}</span> <span>{__("You Are Getting", "betterdocs")}</span>
					</h2>
					<p className="betterdocs-section-sub-title">{__("Find out more about the versatile functionalities of the addon.", "betterdocs")}</p>
				</div>

				<div className="betterdocs-chatbot-section-content">
					<div className="betterdocs-slider-wrapper">

						<div className="slider-container" >
							<Slider {...settings}>
								{sliderItems.map((item) => (
									<div className="betterdocs-slider-item-wrapper" key={item.count}>
										<div className="betterdocs-slider-item">
											<div className="benefits-card-img-wrapper">
												<img
													src={item.sliderImg}
													alt="Slider Visual"
												/>
											</div>
											<div className="benefits-card-header-wrapper">
												<h4 className="betterdocs-overview-card-header">
													{item.sliderCardTitle}
												</h4>
												<p className="betterdocs-section-sub-title">
													{item.sliderCardSubTitle}
												</p>
											</div>
										</div>
									</div>
								))}
							</Slider>
						</div>

					</div>
				</div>
			</div>


			<div className="betterdocs-overview-section betterdocs-tour__section">
				<div className="betterdocs-chatbot-section-header">
					<h2 className="betterdocs-section-title">
						<span>{__("How to Enable AI Chatbot: ", "betterdocs")}</span>
						<span className="betterdocs-title-style">{__("A Quick Tour", "betterdocs")}</span>
					</h2>
					<p className="betterdocs-section-sub-title">{__("Set up the chatbot for your knowledge base built using BetterDocs.", "betterdocs")}</p>
				</div>

				<div className="betterdocs-chatbot-section-content">
					<div className="betterdocs-row">
						<div className="betterdocs-overview-col betterdocs-col-4 ">
							<div className="betterdocs-tour-card">
								<div className="tour-card-img-wrapper">
									<img src={tourContentImg1} />
								</div>
								<div className="tour-card-header-wrapper">
									<h4 className="betterdocs-tour-card-header">
										<span className="betterdocs-step-badge">{__("1", "betterdocs")}</span>
										<span>{__("Unlock BetterDocs PRO & AI Chatbot addon", "betterdocs")}</span>
									</h4>
								</div>
							</div>
						</div>
						<div className="betterdocs-overview-col betterdocs-col-4 ">
							<div className="betterdocs-tour-card">
								<div className="tour-card-img-wrapper">
									<img src={tourContentImg2} />
								</div>
								<div className="tour-card-header-wrapper">
									<h4 className="betterdocs-tour-card-header">
										<span className="betterdocs-step-badge">{__("2", "betterdocs")}</span>
										<span>{__("Activate BetterDocs PRO & AI Chatbot with your license key", "betterdocs")}</span>
									</h4>
								</div>
							</div>
						</div>
						<div className="betterdocs-overview-col betterdocs-col-4 ">
							<div className="betterdocs-tour-card">
								<div className="tour-card-img-wrapper">
									<img src={tourContentImg3} />
								</div>
								<div className="tour-card-header-wrapper">
									<h4 className="betterdocs-tour-card-header">
										<span className="betterdocs-step-badge">{__("3", "betterdocs")}</span>
										<span>{__("Enable BetterDocs AI Chatbot on your site & start using it", "betterdocs")}</span>
									</h4>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>

			<div className="betterdocs-overview-section betterdocs-chatbot-promo-section">
				<div className="betterdocs-row align-items-center">
					<div className=" betterdocs-overview-col betterdocs-col-6 ">
						<div className="betterdocs-flex justify-content-space-between  align-items-center">
							<div className="betterdocs-svg-icon">
								<svg width="69" height="76" viewBox="0 0 69 76" fill="none" xmlns="http://www.w3.org/2000/svg">
									<g filter="url(#filter0_d_11660_69361)">
										<path d="M14 28.0014C14 27.1407 14.6997 26.4512 15.5562 26.3663C22.9203 25.6362 28.7767 19.7797 29.5068 12.4155C29.5917 11.5591 30.2812 10.8594 31.1419 10.8594C32.0026 10.8594 32.6921 11.5591 32.777 12.4155C33.5071 19.7797 39.3636 25.6362 46.7276 26.3663C47.5841 26.4512 48.2838 27.1407 48.2838 28.0014C48.2838 28.8621 47.5841 29.5516 46.7276 29.6365C39.3636 30.3666 33.5071 36.2232 32.777 43.5873C32.6921 44.4437 32.0026 45.1434 31.1419 45.1434C30.2812 45.1434 29.5917 44.4437 29.5068 43.5873C28.7767 36.2232 22.9203 30.3666 15.5562 29.6365C14.6997 29.5516 14 28.8621 14 28.0014Z" fill="url(#paint0_linear_11660_69361)" />
									</g>
									<g filter="url(#filter1_d_11660_69361)">
										<path d="M44.8555 9.14261C44.8555 8.88441 45.0654 8.67756 45.3223 8.65208C47.5315 8.43305 49.2885 6.67609 49.5075 4.46685C49.533 4.20992 49.7398 4 49.998 4C50.2562 4 50.4631 4.20991 50.4886 4.46685C50.7076 6.67609 52.4646 8.43304 54.6738 8.65208C54.9307 8.67756 55.1406 8.88441 55.1406 9.14261C55.1406 9.40081 54.9307 9.60766 54.6738 9.63314C52.4646 9.85218 50.7076 11.6091 50.4886 13.8184C50.4631 14.0753 50.2562 14.2852 49.998 14.2852C49.7398 14.2852 49.533 14.0753 49.5075 13.8184C49.2885 11.6091 47.5315 9.85218 45.3223 9.63314C45.0654 9.60766 44.8555 9.40081 44.8555 9.14261Z" fill="url(#paint1_linear_11660_69361)" />
									</g>
									<g filter="url(#filter2_d_11660_69361)">
										<path d="M41.4297 45.1459C41.4297 44.8016 41.7096 44.5258 42.0522 44.4918C44.9978 44.1998 47.3404 41.8572 47.6324 38.9115C47.6664 38.5689 47.9422 38.2891 48.2864 38.2891C48.6307 38.2891 48.9065 38.5689 48.9405 38.9115C49.2325 41.8572 51.5751 44.1998 54.5207 44.4918C54.8633 44.5258 55.1432 44.8016 55.1432 45.1459C55.1432 45.4901 54.8633 45.7659 54.5207 45.7999C51.5751 46.092 49.2325 48.4346 48.9405 51.3802C48.9065 51.7228 48.6307 52.0027 48.2864 52.0027C47.9422 52.0027 47.6664 51.7228 47.6324 51.3802C47.3404 48.4346 44.9978 46.092 42.0522 45.7999C41.7096 45.7659 41.4297 45.4901 41.4297 45.1459Z" fill="url(#paint2_linear_11660_69361)" />
									</g>
									<defs>
										<filter id="filter0_d_11660_69361" x="0.286422" y="7.43098" width="61.7123" height="61.7084" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
											<feFlood floodOpacity="0" result="BackgroundImageFix" />
											<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
											<feOffset dy="10.2852" />
											<feGaussianBlur stdDeviation="6.85679" />
											<feComposite in2="hardAlpha" operator="out" />
											<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.00392157 0 0 0 0 0.137255 0 0 0 0.13 0" />
											<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_11660_69361" />
											<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_11660_69361" result="shape" />
										</filter>
										<filter id="filter1_d_11660_69361" x="31.1419" y="0.571606" width="37.7123" height="37.7162" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
											<feFlood floodOpacity="0" result="BackgroundImageFix" />
											<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
											<feOffset dy="10.2852" />
											<feGaussianBlur stdDeviation="6.85679" />
											<feComposite in2="hardAlpha" operator="out" />
											<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.00392157 0 0 0 0 0.137255 0 0 0 0.13 0" />
											<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_11660_69361" />
											<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_11660_69361" result="shape" />
										</filter>
										<filter id="filter2_d_11660_69361" x="27.7161" y="34.8607" width="41.142" height="41.1381" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
											<feFlood floodOpacity="0" result="BackgroundImageFix" />
											<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
											<feOffset dy="10.2852" />
											<feGaussianBlur stdDeviation="6.85679" />
											<feComposite in2="hardAlpha" operator="out" />
											<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.00392157 0 0 0 0 0.137255 0 0 0 0.13 0" />
											<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_11660_69361" />
											<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_11660_69361" result="shape" />
										</filter>
										<linearGradient id="paint0_linear_11660_69361" x1="31.1419" y1="10.8594" x2="31.1419" y2="45.1434" gradientUnits="userSpaceOnUse">
											<stop stopColor="#CD93FF" />
											<stop offset="1" stopColor="#A741FF" />
										</linearGradient>
										<linearGradient id="paint1_linear_11660_69361" x1="49.998" y1="4" x2="49.998" y2="14.2852" gradientUnits="userSpaceOnUse">
											<stop stopColor="#D099FF" />
											<stop offset="1" stopColor="#CE96FF" />
										</linearGradient>
										<linearGradient id="paint2_linear_11660_69361" x1="48.2864" y1="38.2891" x2="48.2864" y2="52.0027" gradientUnits="userSpaceOnUse">
											<stop stopColor="#D099FF" />
											<stop offset="1" stopColor="#CE96FF" />
										</linearGradient>
									</defs>
								</svg>
							</div>
							<div>
								<svg
									width="216"
									height="69"
									viewBox="0 0 216 69"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M215.182 10.6014C215.68 10.3636 215.892 9.76668 215.654 9.26823L211.778 1.1454C211.54 0.646942 210.944 0.435655 210.445 0.673477C209.947 0.911298 209.735 1.50817 209.973 2.00663L213.418 9.22692L206.198 12.6718C205.699 12.9096 205.488 13.5065 205.726 14.005C205.964 14.5034 206.561 14.7147 207.059 14.4769L215.182 10.6014ZM81.6403 18.4862L82.0409 19.4024L81.6403 18.4862ZM47.9868 45.8912L46.9868 45.8879L47.9868 45.8912ZM73.2178 49.8495L72.9919 48.8753L73.2178 49.8495ZM89.3672 39.8037L90.3132 39.4796L89.3672 39.8037ZM52.1505 33.6007L52.0078 32.6109L52.1505 33.6007ZM0.933862 66.8024C0.716856 67.3102 0.952643 67.8979 1.46051 68.1149C1.96837 68.3319 2.556 68.0961 2.773 67.5882L0.933862 66.8024ZM215.085 8.75616C173.978 -5.79535 120.44 0.428125 81.2396 17.57L82.0409 19.4024C120.899 2.41055 173.901 -3.7008 214.418 10.6415L215.085 8.75616ZM81.2396 17.57C76.6869 19.5608 68.2048 23.1547 60.8582 27.9142C57.1844 30.2944 53.7473 32.9953 51.2164 35.9726C48.6868 38.9483 46.999 42.2769 46.9868 45.8879L48.9868 45.8946C48.9968 42.9265 50.384 40.0396 52.7402 37.2679C55.0951 34.4978 58.3544 31.9194 61.9457 29.5928C69.1294 24.9387 77.4518 21.4092 82.0409 19.4024L81.2396 17.57ZM46.9868 45.8879C46.9821 47.2924 47.3511 48.4936 48.051 49.4835C48.7447 50.4646 49.7195 51.1766 50.8337 51.6872C53.034 52.6954 55.9269 52.9853 58.8327 52.9384C64.6732 52.8441 71.0855 51.3704 73.4436 50.8236L72.9919 48.8753C70.621 49.425 64.4014 50.8482 58.8004 50.9387C55.9855 50.9841 53.4553 50.6884 51.6668 49.8689C50.7866 49.4656 50.1255 48.9533 49.684 48.3289C49.2488 47.7133 48.9833 46.9281 48.9868 45.8946L46.9868 45.8879ZM73.4436 50.8236C74.7374 50.5237 79.3331 49.4062 83.3803 47.6355C85.3929 46.755 87.3584 45.6757 88.7082 44.3956C90.0632 43.1106 90.9793 41.4243 90.3132 39.4796L88.4211 40.1277C88.7214 41.0042 88.4228 41.9099 87.3319 42.9444C86.2358 43.9839 84.5242 44.952 82.5786 45.8032C78.7094 47.4961 74.264 48.5804 72.9919 48.8753L73.4436 50.8236ZM90.3132 39.4796C89.3789 36.7522 86.6696 35.0312 83.4522 33.9263C80.189 32.8056 76.1254 32.221 72.0264 31.9544C63.8203 31.4205 55.2239 32.1472 52.0078 32.6109L52.2932 34.5905C55.3973 34.1429 63.8526 33.4268 71.8965 33.9501C75.9224 34.2121 79.7834 34.781 82.8026 35.8179C85.8677 36.8705 87.7988 38.3109 88.4211 40.1277L90.3132 39.4796ZM52.0078 32.6109C30.1779 35.7583 9.11328 47.6599 0.933862 66.8024L2.773 67.5882C10.5825 49.3115 30.8727 37.6788 52.2932 34.5905L52.0078 32.6109Z"
										fill="url(#paint0_linear_11660_69359)"
									/>
									<defs>
										<linearGradient
											id="paint0_linear_11660_69359"
											x1="214.998"
											y1="-0.00148794"
											x2="-5.00195"
											y2="78.9985"
											gradientUnits="userSpaceOnUse"
										>
											<stop stopColor="#ADD0BB" />
											<stop offset="1" stopColor="#F0FBF8" />
										</linearGradient>
									</defs>
								</svg>

							</div>
						</div>
						<div className=" betterdocs-content-left">

							<h2 className="betterdocs-section-title">
								{__("Try BetterDocs", "betterdocs")}
								<span className="betterdocs-flex">
									<span className="betterdocs-title-style">  {__("AI Chatbot", "betterdocs")} </span>
									{__("Now!", "betterdocs")}
								</span>
							</h2>
							<p className="betterdocs-section-sub-title">
								{__("Ready to add an AI-powered chatbot to your website? Start addressing visitor queries with our powerful addon now.", "betterdocs")}
							</p>
						</div>
					</div>

					<div className=" betterdocs-overview-col betterdocs-col-6  ">
						<div className="betterdocs-content-right">
							<div className="betterdocs-pricing-card">
								<div className="betterdocs-pricing-card-content">
									<span className="card-name">{__("AI Chatbot", "betterdocs")}</span>
									<div className="betterdocs-flex justify-content-space-between flex-wrap ">
									<div className="betterdocs-price">
										<span className="price">
											{isYearly ? __("$69", "betterdocs") : __("$8.99", "betterdocs")}
										</span>
										<span className="form-data-name-control">
											{isYearly ? __("/Yearly", "betterdocs") : __("/Monthly", "betterdocs")}
										</span>
										</div>

										<form className="betterdocs-flex align-items-center betterdocs-price-toggle-switch">
											<label className="form-data-name-control">{__("Monthly", "betterdocs")}</label>
											<label class="switch">
												<input 
													type="checkbox" 
													checked={isYearly}
													onChange={() => setIsYearly(!isYearly)}
												/>
												<span class="slider round"></span>
											</label>
											<label className="form-data-name-control">{__("Yearly", "betterdocs")}</label>
										</form>
									</div>
								</div>
								<div className="betterdocs-pricing-card-content">
									<ul className="betterdocs-pricing-features-list">

										<li className="betterdocs-pricing-features-list-item">
											<span className="betterdocs-features-list-svg-icon">
												<svg
													width="20"
													height="21"
													viewBox="0 0 20 21"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<g clipPath="url(#clip0_11660_69317)">
														<path
															d="M2.5 10.5C2.5 11.4849 2.69399 12.4602 3.0709 13.3701C3.44781 14.2801 4.00026 15.1069 4.6967 15.8033C5.39314 16.4997 6.21993 17.0522 7.12987 17.4291C8.03982 17.806 9.01509 18 10 18C10.9849 18 11.9602 17.806 12.8701 17.4291C13.7801 17.0522 14.6069 16.4997 15.3033 15.8033C15.9997 15.1069 16.5522 14.2801 16.9291 13.3701C17.306 12.4602 17.5 11.4849 17.5 10.5C17.5 9.51509 17.306 8.53982 16.9291 7.62987C16.5522 6.71993 15.9997 5.89314 15.3033 5.1967C14.6069 4.50026 13.7801 3.94781 12.8701 3.5709C11.9602 3.19399 10.9849 3 10 3C9.01509 3 8.03982 3.19399 7.12987 3.5709C6.21993 3.94781 5.39314 4.50026 4.6967 5.1967C4.00026 5.89314 3.44781 6.71993 3.0709 7.62987C2.69399 8.53982 2.5 9.51509 2.5 10.5Z"
															stroke="#86838C"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M7.5 10.5026L9.16667 12.1693L12.5 8.83594"
															stroke="#86838C"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</g>
													<defs>
														<clipPath id="clip0_11660_69317">
															<rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
														</clipPath>
													</defs>
												</svg>
											</span>
											<span>
												{__("Instant Answers for All Queries", "betterdocs")}
											</span>
										</li>
										<li className="betterdocs-pricing-features-list-item">
											<span className="betterdocs-features-list-svg-icon">
												<svg
													width="20"
													height="21"
													viewBox="0 0 20 21"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<g clipPath="url(#clip0_11660_69317)">
														<path
															d="M2.5 10.5C2.5 11.4849 2.69399 12.4602 3.0709 13.3701C3.44781 14.2801 4.00026 15.1069 4.6967 15.8033C5.39314 16.4997 6.21993 17.0522 7.12987 17.4291C8.03982 17.806 9.01509 18 10 18C10.9849 18 11.9602 17.806 12.8701 17.4291C13.7801 17.0522 14.6069 16.4997 15.3033 15.8033C15.9997 15.1069 16.5522 14.2801 16.9291 13.3701C17.306 12.4602 17.5 11.4849 17.5 10.5C17.5 9.51509 17.306 8.53982 16.9291 7.62987C16.5522 6.71993 15.9997 5.89314 15.3033 5.1967C14.6069 4.50026 13.7801 3.94781 12.8701 3.5709C11.9602 3.19399 10.9849 3 10 3C9.01509 3 8.03982 3.19399 7.12987 3.5709C6.21993 3.94781 5.39314 4.50026 4.6967 5.1967C4.00026 5.89314 3.44781 6.71993 3.0709 7.62987C2.69399 8.53982 2.5 9.51509 2.5 10.5Z"
															stroke="#86838C"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M7.5 10.5026L9.16667 12.1693L12.5 8.83594"
															stroke="#86838C"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</g>
													<defs>
														<clipPath id="clip0_11660_69317">
															<rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
														</clipPath>
													</defs>
												</svg>
											</span>
											<span>
												{__("Integration with OpenAI", "betterdocs")}
											</span>
										</li>
										<li className="betterdocs-pricing-features-list-item">
											<span className="betterdocs-features-list-svg-icon">
												<svg
													width="20"
													height="21"
													viewBox="0 0 20 21"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<g clipPath="url(#clip0_11660_69317)">
														<path
															d="M2.5 10.5C2.5 11.4849 2.69399 12.4602 3.0709 13.3701C3.44781 14.2801 4.00026 15.1069 4.6967 15.8033C5.39314 16.4997 6.21993 17.0522 7.12987 17.4291C8.03982 17.806 9.01509 18 10 18C10.9849 18 11.9602 17.806 12.8701 17.4291C13.7801 17.0522 14.6069 16.4997 15.3033 15.8033C15.9997 15.1069 16.5522 14.2801 16.9291 13.3701C17.306 12.4602 17.5 11.4849 17.5 10.5C17.5 9.51509 17.306 8.53982 16.9291 7.62987C16.5522 6.71993 15.9997 5.89314 15.3033 5.1967C14.6069 4.50026 13.7801 3.94781 12.8701 3.5709C11.9602 3.19399 10.9849 3 10 3C9.01509 3 8.03982 3.19399 7.12987 3.5709C6.21993 3.94781 5.39314 4.50026 4.6967 5.1967C4.00026 5.89314 3.44781 6.71993 3.0709 7.62987C2.69399 8.53982 2.5 9.51509 2.5 10.5Z"
															stroke="#86838C"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M7.5 10.5026L9.16667 12.1693L12.5 8.83594"
															stroke="#86838C"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</g>
													<defs>
														<clipPath id="clip0_11660_69317">
															<rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
														</clipPath>
													</defs>
												</svg>
											</span>
											<span>
												{__("3 Embed Model Options", "betterdocs")}
											</span>
										</li>
										<li className="betterdocs-pricing-features-list-item">
											<span className="betterdocs-features-list-svg-icon">
												<svg
													width="20"
													height="21"
													viewBox="0 0 20 21"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<g clipPath="url(#clip0_11660_69317)">
														<path
															d="M2.5 10.5C2.5 11.4849 2.69399 12.4602 3.0709 13.3701C3.44781 14.2801 4.00026 15.1069 4.6967 15.8033C5.39314 16.4997 6.21993 17.0522 7.12987 17.4291C8.03982 17.806 9.01509 18 10 18C10.9849 18 11.9602 17.806 12.8701 17.4291C13.7801 17.0522 14.6069 16.4997 15.3033 15.8033C15.9997 15.1069 16.5522 14.2801 16.9291 13.3701C17.306 12.4602 17.5 11.4849 17.5 10.5C17.5 9.51509 17.306 8.53982 16.9291 7.62987C16.5522 6.71993 15.9997 5.89314 15.3033 5.1967C14.6069 4.50026 13.7801 3.94781 12.8701 3.5709C11.9602 3.19399 10.9849 3 10 3C9.01509 3 8.03982 3.19399 7.12987 3.5709C6.21993 3.94781 5.39314 4.50026 4.6967 5.1967C4.00026 5.89314 3.44781 6.71993 3.0709 7.62987C2.69399 8.53982 2.5 9.51509 2.5 10.5Z"
															stroke="#86838C"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M7.5 10.5026L9.16667 12.1693L12.5 8.83594"
															stroke="#86838C"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</g>
													<defs>
														<clipPath id="clip0_11660_69317">
															<rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
														</clipPath>
													</defs>
												</svg>
											</span>
											<span>
												{__("2 Chat Model options", "betterdocs")}
											</span>
										</li>
										<li className="betterdocs-pricing-features-list-item">
											<span className="betterdocs-features-list-svg-icon">
												<svg
													width="20"
													height="21"
													viewBox="0 0 20 21"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<g clipPath="url(#clip0_11660_69317)">
														<path
															d="M2.5 10.5C2.5 11.4849 2.69399 12.4602 3.0709 13.3701C3.44781 14.2801 4.00026 15.1069 4.6967 15.8033C5.39314 16.4997 6.21993 17.0522 7.12987 17.4291C8.03982 17.806 9.01509 18 10 18C10.9849 18 11.9602 17.806 12.8701 17.4291C13.7801 17.0522 14.6069 16.4997 15.3033 15.8033C15.9997 15.1069 16.5522 14.2801 16.9291 13.3701C17.306 12.4602 17.5 11.4849 17.5 10.5C17.5 9.51509 17.306 8.53982 16.9291 7.62987C16.5522 6.71993 15.9997 5.89314 15.3033 5.1967C14.6069 4.50026 13.7801 3.94781 12.8701 3.5709C11.9602 3.19399 10.9849 3 10 3C9.01509 3 8.03982 3.19399 7.12987 3.5709C6.21993 3.94781 5.39314 4.50026 4.6967 5.1967C4.00026 5.89314 3.44781 6.71993 3.0709 7.62987C2.69399 8.53982 2.5 9.51509 2.5 10.5Z"
															stroke="#86838C"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M7.5 10.5026L9.16667 12.1693L12.5 8.83594"
															stroke="#86838C"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</g>
													<defs>
														<clipPath id="clip0_11660_69317">
															<rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
														</clipPath>
													</defs>
												</svg>
											</span>
											<span>
												{__("1 Website", "betterdocs")}
											</span>
										</li>
									</ul>
								</div>
								<div className="betterdocs-pricing-card-content">
									<a href="https://betterdocs.co/dashboard-purchase-ai-chatbot" className="betterdocs-chatbot-section-btn betterdocs-pricing-card-btn">
										{__("Get Started", "betterdocs")}
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AIChatbot;
