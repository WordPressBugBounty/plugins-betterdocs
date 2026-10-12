import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import { normalizeAIError } from "../../../utils/aiErrorMessage";
import Modal from "react-modal";

import { getSettingsData, generateFaqAnswer } from "../utils/function";

// Custom modal styles
const customStyles = {
	overlay: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(35, 40, 45, 0.5)",
		zIndex: 9990,
		padding: 50,
		paddingTop: 70,
		display: "flex",
		flexDirection: "column",
		overflow: "auto",
	},
	content: {
		width: "40rem",
		maxWidth: "90%",
		position: "static",
		height: "auto",
		overflow: "initial",
		margin: "auto",
	},
};
const FaqAIModalForm = ({
	open,
	setShowFaqAIModalForm,
	// reFetchCategories,
	// setShowCategoryModal,
	// updateCategory,
	// setUpdateCategory,
	setFormFields,
	formFields,
	// handleAnswerChange
}) => {
	const [generatedResponse, setGeneratedResponse] = useState(formFields);
	const [generatedAnswer, setGeneratedAnswer] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [contentGenerated, setContentGenerated] = useState(false);

	const [settings, setSettings] = useState(null);

	useEffect(() => {
		getSettingsData().then((getSettings) => {
			setSettings(getSettings);
		}).catch(function (error) {
			console.log(error);
		});
	}, []);

	const resetErrors = () => {
		setError(null);
	};

	const handleCancel = () => {
		resetErrors();
		// setShowCategoryModal(false);
		setShowFaqAIModalForm(false);
		// setUpdateCategory(null);
	};


	const highlightKeywords = (inputString, keywords) => {
		let modifiedString = inputString.replace(/<(h\d)(.*?)>(.*?)<\/\1>/g, '<$1$2><span className="highlight">$3</span></$1>');

		const keywordArray = keywords.split(',').map(keyword => keyword.trim());

		keywordArray.forEach(keyword => {
			modifiedString = modifiedString.replace(new RegExp(`\\b(${keyword})\\b`, 'gi'), '<span className="highlight">$1</span>');
		});

		return modifiedString;
	}

	const getAPIKey = (settings) => {
		if (!settings) {
			return '';
		}

		// Mirror the server-side ProviderFactory::key_field_for(): the key lives in
		// the field for the *selected* AI platform, not always OpenAI. OpenAI keeps
		// the legacy `ai_autowrite_api_key`; every other platform (gemini, claude,
		// deepseek, …) uses `ai_api_key_<platform>`. Checking only the OpenAI field
		// blocked "Write with AI" whenever another provider was configured.
		const platform = settings.ai_platform || 'openai';
		const field = platform === 'openai' ? 'ai_autowrite_api_key' : `ai_api_key_${platform}`;

		return settings[field] || '';
	}

	const handleSubmit = async (event) => {
		event.preventDefault();

		const question = document.getElementById('betterdocs-ai-title').value;
		const keywords = document.getElementById('betterdocs-ai-keyword').value;

		try {
			setIsLoading(true);
			setError(null);

			// The prompt build, model selection and "Answer:" cleanup now happen
			// server-side; the OpenAI API key never leaves the server.
			const res = await generateFaqAnswer({ question, keywords });
			const answer = res?.data?.answer || "";

			setIsLoading(false);

			if (!answer) {
				setContentGenerated(false);
				setError(__("The AI returned no answer. Try again or rephrase your question.", "betterdocs"));
				return;
			}

			setContentGenerated(true);
			setGeneratedResponse(state => ({
				...state,
				question: question,
				aiAnswer: answer,
			}));
			setGeneratedAnswer(answer);
		} catch (error) {
			setIsLoading(false);
			setContentGenerated(false);
			setError(normalizeAIError(error));
		}
	};


	const handleKeep = () => {
		// Set `answer` (the field actually saved as post_content) directly to the AI
		// answer — do NOT rely on the editor's async aiValue effect to copy it across.
		// If that effect races the editor's init or the answer is unchanged, `answer`
		// stayed empty and the FAQ saved blank ("content not being saved"). aiAnswer is
		// kept so the editor still renders the content visually.
		setFormFields({
			...generatedResponse,
			answer: generatedResponse?.aiAnswer || generatedResponse?.answer || "",
		});
		handleCancel();
	};

	return (
		<Modal
			isOpen={open}
			className="bd-faq-ctg-modal"
			onRequestClose={() => handleCancel()}
			style={customStyles}
		>
			<form
				className={settings && !getAPIKey(settings) ? "disabled-input-field" : ""}
				onSubmit={handleSubmit}
			>
				<div className="bd-faq-ctg-header">
					<span
						className="bd-faq-stat-card__icon"
						style={{ "--bd-icon-tint": "#7f56d9", "--bd-icon-tint-rgb": "127, 86, 217" }}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={17}
							height={17}
							viewBox="0 0 32 32"
							fill="none"
						>
							<path
								d="M15.8322 30.1765L8.97508 30.7708L9.56936 23.9136L23.8322 9.74219C24.0451 9.52448 24.2993 9.3515 24.58 9.23341C24.8606 9.11531 25.162 9.05447 25.4665 9.05447C25.771 9.05447 26.0724 9.11531 26.3531 9.23341C26.6337 9.3515 26.8879 9.52448 27.1008 9.74219L30.0037 12.6679C30.2176 12.8805 30.3874 13.1334 30.5033 13.4119C30.6192 13.6904 30.6788 13.9891 30.6788 14.2908C30.6788 14.5924 30.6192 14.8911 30.5033 15.1696C30.3874 15.4481 30.2176 15.701 30.0037 15.9136L15.8322 30.1765ZM1.92593 9.07933C1.12365 8.9399 1.12365 7.7879 1.92593 7.64848C3.34647 7.40124 4.6612 6.73658 5.70251 5.73923C6.74382 4.74188 7.46455 3.45703 7.77279 2.04848L7.82079 1.82676C7.99451 1.03591 9.12365 1.02905 9.30651 1.82219L9.36365 2.07819C9.68319 3.48048 10.4099 4.75709 11.4526 5.74772C12.4953 6.73834 13.8074 7.39881 15.2242 7.64619C16.0311 7.78333 16.0311 8.94219 15.2242 9.0839C13.8073 9.33071 12.4949 9.99066 11.4518 10.9809C10.4087 11.9711 9.68146 13.2474 9.36136 14.6496L9.30193 14.9079C9.12136 15.6988 7.99222 15.6942 7.81851 14.901L7.77279 14.6793C7.46424 13.2702 6.74284 11.9849 5.70064 10.9874C4.65845 9.99003 3.34273 9.32574 1.92136 9.07933H1.92593Z"
								stroke="currentColor"
								strokeWidth="2.28571"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</span>
					<div className="bd-faq-ctg-heading">
						<h3 className="bd-faq-ctg-title">
							{__("Write FAQ with BetterDocs AI", "betterdocs")}
						</h3>
						<p className="bd-faq-ctg-subtitle">
							{__("Generate FAQs effortlessly with BetterDocs AI. Input your question and relevant keywords and let the system generate FAQs tailored to your needs.", "betterdocs")}
						</p>
					</div>
				</div>

				<div className="bd-faq-ctg-body">
					{settings && !getAPIKey(settings) && (
						<div id="betterdocs-ai-message">
							<div className="warning-message">
								<span className="dashicons dashicons-warning"></span>
								<div>
									{__("Please insert your", "betterdocs")}{" "}
									<a
										target="_blank"
										href="/wp-admin/admin.php?page=betterdocs-settings#betterdocs-ai"
									>
										{__("AI API Key", "betterdocs")}
									</a>{" "}
									{__('to use this "Write with AI" feature.', "betterdocs")}
								</div>
							</div>
						</div>
					)}

					{error && (
						<div id="betterdocs-ai-error-message">
							<div className="warning-message">
								<span className="dashicons dashicons-warning"></span>
								<div className="footer-message">{error}</div>
							</div>
						</div>
					)}

					<div className="bd-faq-cgt-field">
						<label className="bd-faq-label" htmlFor="betterdocs-ai-title">
							{__("Question", "betterdocs")}
						</label>
						<input
							type="text"
							className="bd-faq-input"
							placeholder={__("Insert your question to generate a relevant response.", "betterdocs")}
							id="betterdocs-ai-title"
							name="betterdocs-ai-title"
							required
							value={formFields?.question}
							onChange={(e) =>
								setFormFields((state) => ({
									...state,
									question: e.target.value.replace(/^\s+/, ""),
								}))
							}
						/>
					</div>

					<div className="bd-faq-cgt-field">
						<label className="bd-faq-label" htmlFor="betterdocs-ai-keyword">
							{__("Keywords", "betterdocs")}
						</label>
						<input
							type="text"
							className="bd-faq-input"
							placeholder={__("Add keywords to generate precise and relevant FAQs (comma-separated).", "betterdocs")}
							id="betterdocs-ai-keyword"
							name="betterdocs-ai-keyword"
							required
						/>
					</div>

					{generatedAnswer && (
						<div className="bd-faq-cgt-field generated-answer">
							<label className="bd-faq-label">
								{__("Generated FAQ", "betterdocs")}
							</label>
							<div className="betterdocs-ai-content-wrapper">
								<p className="betterdocs-ai-content" dangerouslySetInnerHTML={{ __html: generatedAnswer }} />
							</div>
						</div>
					)}
				</div>

				<div className="bd-faq-ctg-footer">
					<button
						type="submit"
						className={`bd-faq-button ${contentGenerated ? "button-ghost" : "button-success"}`}
						disabled={isLoading}
					>
						<span className="bd-faq-text">
							{isLoading ? __("Generating…", "betterdocs") : contentGenerated ? __("Regenerate FAQ", "betterdocs") : __("Generate FAQ", "betterdocs")}
						</span>
					</button>

					{contentGenerated && (
						<button
							type="button"
							className="bd-faq-button button-success"
							onClick={() => handleKeep(generatedResponse)}
						>
							<span className="bd-faq-text">{__("Keep", "betterdocs")}</span>
						</button>
					)}
				</div>
			</form>

			<button
				type="button"
				className="bd-faq-modal-close-button"
				onClick={() => handleCancel()}
			>
				<svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M1.69687 14L0.296875 12.6L5.89687 7L0.296875 1.4L1.69687 0L7.29688 5.6L12.8969 0L14.2969 1.4L8.69688 7L14.2969 12.6L12.8969 14L7.29688 8.4L1.69687 14Z" fill="currentColor" />
				</svg>
			</button>
		</Modal>
	);
};

//Modal.setAppElement("#betterdocsFaqBuilder");

export default FaqAIModalForm;
