import { decodeEntities } from "@wordpress/html-entities";
import { __ } from "@wordpress/i18n";
import React, { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";
import ErrorMessage from "../utils/ErrorMessage";
import TextEditor from "../utils/TextEditor";
import { getToggleResponse, searchCategories, updateFaq } from "../utils/function";
import { validateFormFields } from "../utils/validations";
import { ReactComponent as BDIcon } from "./../assets/images/betterdocs-icon-white.svg";
import FaqAIModalForm from "./FaqAIModalForm";
import { getSettingsData } from "../utils/function";
import { useFAQScope } from "../context/ScopeContext";
import { useFAQ } from "../../components/FAQContext";
import { useQuery } from "@tanstack/react-query";

const EditFaq = ({
	categoriesLoading,
	allFaqCategories,
	reFetchCategories,
	reFetchFaqList,
	faq,
	faqExpanded,
	setFaqExpanded,
	setReFetchFaqForCategory,
	showFaqAIModalForm,
	setShowFaqAIModalForm,
	settings
}) => {

	const { taxonomy } = useFAQScope();
	const { setFocusTarget } = useFAQ();

	// allFaqCategories is only the current paginated page, so the group picker
	// would miss groups on other pages. Load the full group list (searchCategories
	// with empty input returns every group, hide_empty => false). Shared cache
	// key with the create form's picker.
	const { data: allGroups } = useQuery(
		["faqGroupsForPicker", taxonomy],
		() => searchCategories("", taxonomy)
	);

	// const [showFaqAIModalForm, setShowFaqAIModalForm] = useState(false);

	const [formFields, setFormFields] = useState({
		question: decodeEntities(
			faq?.title?.rendered
				? faq?.title?.rendered
				: faq?.post_title
					? faq?.post_title
					: ""
		),
		answer: faq?.content?.rendered
			? faq?.content?.rendered
			: faq?.post_content
				? faq?.post_content
				: "",
		aiAnswer: null,

	});
	const [allCats, setAllCats] = useState({
		default: { value: null, label: "Uncategorized" },
		cats: [],
	});
	const [selectedCategory, setSelectedCategory] = useState("not-set");
	const [isAjaxRunning, setIsAjaxRunning] = useState(false);
	// QA-002: guards the Update button against double submission.
	const [submitting, setSubmitting] = useState(false);
	// QA-010: bumped whenever this row (re)opens so the rich-text editor resets
	// to the FAQ's saved content instead of keeping stale/unsaved text.
	const [editorResetKey, setEditorResetKey] = useState(0);
	// "Keep It Open By default" defaults to OFF — only enabled (open) once the
	// stored meta is explicitly truthy ('1'). A loose `== 1` keeps '' / undefined
	// / '0' all OFF so an uncategorized FAQ (whose endpoint may omit the meta)
	// no longer defaults to open.
	const [toggleDropdown, setToggleDropdown] = useState(faq?.meta?.faq_open_by_default == 1);


	useEffect(() => {
		if (faqExpanded == (faq?.id || faq?.ID)) {
			setFormFields({
				question: decodeEntities(
					faq?.title?.rendered
						? faq?.title?.rendered
						: faq?.post_title
							? faq?.post_title
							: ""
				),
				answer: faq?.content?.rendered
					? faq?.content?.rendered
					: faq?.post_content
						? faq?.post_content
						: "",
			});
			// QA-010: also force the editor to reload the saved content, so a
			// reopened row never shows stale text from a prior (unsaved) edit.
			setEditorResetKey((k) => k + 1);
		}
	}, [faqExpanded]);

	useEffect(() => {
		// Prefer the full group list; fall back to the current page while it loads.
		const groupSource =
			Array.isArray(allGroups) && allGroups.length ? allGroups : allFaqCategories;
		if (groupSource?.length) {
			let def;
			if (faq?.betterdocs_faq_category) {
				let defData = groupSource?.find(
					(cat) => cat?.id == faq?.betterdocs_faq_category[0] || cat?.term_id == faq?.betterdocs_faq_category[0]
				);
				def = {
					value: defData?.id || defData?.term_id,
					label: decodeEntities(defData?.name),
				};
			} else {
				def = { value: null, label: "Uncategorized" };
			}
			let cats = groupSource?.map((cat) => ({
				value: cat?.id || cat?.term_id,
				label: decodeEntities(cat?.name),
			}));
			setAllCats({
				default: def,
				cats: [...cats],
			});
		}
	}, [allGroups, allFaqCategories, faq]);

	const [errors, setErrors] = useState({
		question: "",
		answer: "",
	});

	const handleAnswerChange = (val) => {
		setFormFields({
			...formFields,
			answer: val.replace(/^\s+/, ""),
		});
	};

	const resetFormField = () => {
		setFormFields({
			question: "",
			answer: "",
		});
	};

	const resetErrors = () => {
		setErrors({
			question: "",
			answer: "",
		});
	};

	const handleCancel = () => {
		setFaqExpanded(undefined);
		resetFormField();
		resetErrors();
		setSelectedCategory("not-set");
	};

	const validationRules = () => {
		return {
			question: {
				required: {
					value: true,
					message: __(
						"Please insert your question here.",
						"betterdocs"
					),
				},
			},
			answer: {
				minLength: {
					value: 9,
					stripHtml: true, // QA-003: measure visible text, not raw HTML
					message: __("Answer must not be Empty.", "betterdocs"),
				},
			},
		};
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// QA-002: ignore rapid re-submits while a request is in flight.
		if (submitting) {
			return;
		}
		const validated = validateFormFields(formFields, validationRules());
		if (!validated.valid) {
			setErrors(validated.errors);
			return;
		}
		if (validated.valid) {
			resetErrors();
			setSubmitting(true);
			updateFaq(
				!selectedCategory || selectedCategory == "not-set"
					? {
						post_id: faq?.id || faq?.ID,
						post_title: formFields?.question,
						post_content: formFields?.answer,
					}
					: {
						post_id: faq?.id || faq?.ID,
						post_title: formFields?.question,
						post_content: formFields?.answer,
						term_id: selectedCategory,
					},
				taxonomy
			)
				.then((res) => {
					if (res) {
						toast.success(__("FAQ updated.", "betterdocs"));
					}
				})
				.catch((err) => {
					err?.name
						? toast.error(`${err?.name} :${err?.message}`)
						: toast.error(`${err?.message}`);
				})
				.finally(() => {
					setSubmitting(false);
					// Keep the edited FAQ's accordion open after a successful
					// update instead of collapsing it (issue #45).
					reFetchCategories();
					// Pass the chosen group so callers (e.g. the Uncategorized
					// panel) can react to a FAQ moving into a group.
					reFetchFaqList(selectedCategory);
					if (selectedCategory && selectedCategory != "not-set") {
						setReFetchFaqForCategory(selectedCategory);
						// FAQ moved into a group → reveal that group (jumping
						// pages if needed) and flash the moved FAQ row itself.
						setFocusTarget({
							groupId: selectedCategory,
							faqId: faq?.id || faq?.ID,
						});
					}
				});
		}
	};

	const handleCategoryChange = (e) => {
		if (e == null) {
			setSelectedCategory("not-set");
		} else setSelectedCategory(e?.value);
	};

	const handleToggle = (faq) => {
		setToggleDropdown(!toggleDropdown);
		// QA-011: uncategorized FAQs expose `ID` (not `id`); without the fallback
		// the toggle posts faq_id=0 and the "open by default" meta never saves.
		getToggleResponse(faq?.id || faq?.ID, !toggleDropdown);
	}

	const promiseOptions = (inputValue, callback) => {
		if (!isAjaxRunning && inputValue) {
			setIsAjaxRunning(true);
			window.lastRequest = null;
			searchCategories(inputValue, taxonomy)
				.then((response) => {
					callback(
						response?.map((r) => {
							return {
								value: r?.id,
								label: r?.name,
							};
						})
					);
				})
				.catch((err) => callback([]))
				.finally(() => {
					setIsAjaxRunning(false);
					if (window.lastRequest) {
						const lr = window.lastRequest;
						window.lastRequest = null;
						promiseOptions(...lr);
					}
				});
		} else {
			window.lastRequest = [inputValue, callback];
		}
	};

	return (
		<>
			<div className="bd-faq-create-new">
				<form onSubmit={handleSubmit}>
					<div className="bd-faq-create-new-body">
						{allCats?.cats?.length ? (
							<div className="bd-faq-cgt-field">
								<label className="bd-faq-label">
									{__("FAQ Group", "betterdocs")}
								</label>
								<AsyncSelect
									cacheOptions
									className="bd-faq-select"
									classNamePrefix="bd-faq-select"
									defaultOptions={allCats?.cats}
									defaultValue={allCats?.default}
									isLoading={categoriesLoading}
									isClearable={false}
									isSearchable={true}
									name="category"
									loadOptions={promiseOptions}
									onChange={(e) => handleCategoryChange(e)}
									noOptionsMessage={() => "No FAQ Group Found!"}
									// The FAQ body now clips its content
									// (overflow:hidden) to slide open smoothly, so
									// portal the menu to <body> to keep it from
									// being cut off when it opens.
									menuPortalTarget={document.body}
									menuPosition="fixed"
									styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
								/>
							</div>
						) : (
							""
						)}
						<div className="bd-faq-cgt-field">
							<label className="bd-faq-label" required>
								{__("Question", "betterdocs")}
							</label>
							<div className="bd-faq-cgt-field-wrapper">
								<input
									type="text"
									className="bd-faq-input"
									name="faq-question"
									value={formFields?.question}
									onChange={(e) =>
										setFormFields({
											...formFields,
											question: e.target.value.replace(
												/^\s+/,
												""
											),
										})
									}
									placeholder={__("Add New Question", "betterdocs")}
								/>
								{
									(settings && (settings?.enable_faq_write_with_ai ?? true)) && (
										<button type="button" className="bd-faq-button button-success bd-write-with-ai-button" onClick={(e) => { setShowFaqAIModalForm(true) }}>
											<BDIcon />
											<span className="bd-faq-text">{__("Write With AI", "betterdocs")}</span>
										</button>
									)
								}
							</div>

							<ErrorMessage error={errors.question} />
						</div>
						<div className="bd-faq-cgt-field">
							<label className="bd-faq-label" required>
								{__("Answer", "betterdocs")}
							</label>

							<TextEditor
								value={formFields?.answer}
								aiValue={formFields?.aiAnswer}
								onChange={handleAnswerChange}
								resetKey={editorResetKey}
								placeholder={__("Write your Answer here.", "betterdocs")}
							/>
							<ErrorMessage error={errors.answer} />
						</div>
					</div>
					<div className="bd-faq-create-new-footer">
						<div className="bd-toggle-switcher-group">
							<p>{__('Keep It Open By default', 'betterdocs')}</p>
							<label
								className="bd-faq-toggler"
							>
								<input
									type="checkbox"
									checked={toggleDropdown}
									onChange={() => {
										handleToggle(faq);
									}}
									className="checkbox"
								/>
								<span className="knobs"></span>
								<span className="layer"></span>
							</label>
						</div>
						<div className="bd-faq-button-group">
							<button
								type="button"
								className="bd-faq-button button-ghost"
								onClick={() => handleCancel()}
							>
								<span className="bd-faq-text">
									{__("Cancel", "betterdocs")}
								</span>
							</button>
							<button
								type="submit"
								className="bd-faq-button button-success"
								disabled={submitting}
							>
								<span className="bd-faq-text">
									{submitting ? __("Updating…", "betterdocs") : __("Update", "betterdocs")}
								</span>
							</button>
						</div>
					</div>
				</form>
			</div>
			{(showFaqAIModalForm && settings && (settings?.enable_faq_write_with_ai ?? true)) && (
				<FaqAIModalForm
					open={true}
					setFormFields={setFormFields}
					formFields={formFields}
					setShowFaqAIModalForm={setShowFaqAIModalForm}
				/>
			)
			}
		</>
	);
};

export default EditFaq;
