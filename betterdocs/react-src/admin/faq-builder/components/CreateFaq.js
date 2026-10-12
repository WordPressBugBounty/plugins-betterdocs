import React, { useEffect, useCallback, useState } from "react";
import { __ } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";
import Select from "react-select";
import { toast } from "react-toastify";
import TextEditor from "../utils/TextEditor";
import ErrorMessage from "../utils/ErrorMessage";
import { validateFormFields } from "../utils/validations";
import { createFAQ, searchCategories, getStickyTopOffset } from "./../utils/function";
import { ReactComponent as BDIcon } from "./../assets/images/betterdocs-icon-white.svg";
import FaqAIModalForm from "./FaqAIModalForm";
import { getSettingsData } from "../utils/function";
import { useFAQ } from "../../components/FAQContext";
import { useFAQScope } from "../context/ScopeContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const CreateFaq = ({
  reFetchFaqList,
  createFaqAt,
  setCreateFaqAt,
  reFetchCategories,
  // Top-level mode: rendered above the group list (via "Add New FAQ"), with a
  // group picker since there is no parent category context. `onClose` closes
  // the top form; `groups` are the loaded FAQ categories.
  topLevel = false,
  groups = [],
  onClose,
}) => {
  const [showFaqAIModalForm, setShowFaqAIModalForm] = useState(false);
  const { bumpStats, setFocusTarget } = useFAQ();
  const { taxonomy } = useFAQScope();
  const queryClient = useQueryClient();

  // Top-level mode is the dashboard "Add New FAQ" flow — scroll so the FORM's
  // first field (FAQ Group) lands just below the WP admin bar. The rich editor's
  // core (wp-tinymce) loads late and its init balloons the form mid-layout; if we
  // scroll before that, the late layout shift/focus drags the view down onto the
  // editor. So we scroll from the editor's `onReady` (see <TextEditor onReady>),
  // with a fallback timeout in case TinyMCE never loads. Runs once.
  const formRef = React.useRef(null);
  const didScrollRef = React.useRef(false);
  const scrollFormIntoView = useCallback(() => {
    if (!topLevel || didScrollRef.current) return;
    const el = formRef.current;
    if (!el) return;
    didScrollRef.current = true;
    const doScroll = () => {
      if (!formRef.current) return;
      const offset = getStickyTopOffset();
      const top =
        window.scrollY + formRef.current.getBoundingClientRect().top - offset;
      window.scrollTo({ top, behavior: "smooth" });
    };
    // Scroll now, then re-assert once — the editor can focus-scroll itself a beat
    // after init (notably on SPA navigation from the dashboard), so the second
    // pass guarantees the form top wins.
    requestAnimationFrame(doScroll);
    setTimeout(doScroll, 350);
  }, [topLevel]);

  useEffect(() => {
    if (!topLevel) return;
    // Fallback only — the editor's onReady is the primary trigger.
    const t = setTimeout(scrollFormIntoView, 800);
    return () => clearTimeout(t);
  }, [topLevel, scrollFormIntoView]);

  // Selected group for top-level mode ("" = Uncategorized).
  const [selectedGroup, setSelectedGroup] = useState("");

  // The `groups` prop is only the current paginated page of the builder, so it
  // omits groups on other pages — including freshly created (still empty) ones,
  // which sort last. Load the full group list for the picker via the search
  // endpoint (hide_empty => false, returns every group). Fall back to the
  // paginated prop while it loads.
  const { data: allGroups } = useQuery(
    ["faqGroupsForPicker", taxonomy],
    () => searchCategories("", taxonomy),
    { enabled: topLevel }
  );
  const pickerGroups =
    topLevel && Array.isArray(allGroups) && allGroups.length ? allGroups : groups;
  const groupOptions = [
    { value: "", label: __("Uncategorized", "betterdocs") },
    ...(pickerGroups || []).map((group) => ({
      value: group?.id,
      label: decodeEntities(group?.name),
    })),
  ];

  const closeForm = () => {
    if (topLevel) {
      onClose?.();
    } else {
      setCreateFaqAt(null);
    }
  };

  const [formFields, setFormFields] = useState({
    question: "",
    answer: "",
    aiAnswer: null,
  });
  const [errors, setErrors] = useState({
    question: "",
    answer: "",
  });

  const [settings, setSettings] = useState(null);
  // QA-002: guards the Create button against double submission.
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getSettingsData().then((getSettings) => {
      setSettings(getSettings);
    }).catch(function (error) {
      console.log(error);
    });
  }, []);


  const handleAnswerChange = (val) => {
    setFormFields({
      ...formFields,
      answer: val,
    });


  };
  const handleCancel = () => {
    closeForm();
  };

  const validationRules = () => {
    return {
      question: {
        required: {
          value: true,
          message: __("Please insert your question here.", "betterdocs"),
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
    // QA-002: ignore repeat submits while a request is in flight.
    if (submitting) {
      return;
    }
    const validated = validateFormFields(formFields, validationRules());
    if (!validated.valid) {
      setErrors(validated.errors);
      return;
    }
    if (validated.valid) {
      setErrors({
        question: "",
        answer: "",
      });
      setSubmitting(true);

      createFAQ({
        term_id: topLevel ? (selectedGroup || null) : createFaqAt,
        post_title: formFields?.question,
        post_content: formFields?.answer,
      }, taxonomy)
        .then((res) => {
          reFetchFaqList();
          reFetchCategories();
          bumpStats();
          if (res) {
            toast.success(__("FAQ created.", "betterdocs"));
            // create_post returns the new FAQ's post id. Reveal its group
            // (page-jump + expand) and flash the new FAQ row itself. Top-level
            // create can target any group (or Uncategorized); the in-group form
            // already sits inside its open group, so reuse createFaqAt there.
            const newFaqId = typeof res === "object" ? (res?.id ?? res?.ID) : res;
            if (topLevel) {
              if (selectedGroup) {
                setFocusTarget({ groupId: selectedGroup, faqId: newFaqId });
              } else {
                // New uncategorized FAQ: refresh that panel's list, then flash it.
                queryClient.invalidateQueries(["uncategorizedFaq", taxonomy]);
                setFocusTarget({ groupId: "uncategorized", faqId: newFaqId });
              }
            } else if (createFaqAt) {
              setFocusTarget({ groupId: createFaqAt, faqId: newFaqId });
            }
          }
        })
        .catch((err) => {
          err?.name
            ? toast.error(`${err?.name} :${err?.message}`)
            : toast.error(`${err?.message}`);
        })
        .finally(() => {
          setSubmitting(false);
          closeForm();
        });
    }
  };

  return (
    <>
      <div className="bd-faq-create-new" ref={formRef}>
        <form onSubmit={handleSubmit}>
          <div className="bd-faq-create-new-body">
            {topLevel && (
              <div className="bd-faq-cgt-field">
                <label className="bd-faq-label">
                  {__("FAQ Group", "betterdocs")}
                </label>
                <Select
                  className="bd-faq-select"
                  classNamePrefix="bd-faq-select"
                  isClearable={false}
                  options={groupOptions}
                  value={
                    groupOptions.find((o) => o.value === selectedGroup) ||
                    groupOptions[0]
                  }
                  onChange={(opt) => setSelectedGroup(opt?.value ?? "")}
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
                  menuPlacement="auto"
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  placeholder={__("Select a FAQ group…", "betterdocs")}
                />
              </div>
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
                      question: e.target.value.replace(/^\s+/, ""),
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
                placeholder={__("Write your Answer here.", "betterdocs")}
                onReady={topLevel ? scrollFormIntoView : undefined}
              />
              <ErrorMessage error={errors.answer} />
            </div>
          </div>
          <div className="bd-faq-create-new-footer">
            <div className="bd-faq-button-group">
              <button
                type="button"
                className="bd-faq-button button-ghost"
                onClick={() => handleCancel()}
              >
                <span className="bd-faq-text">{__("Cancel", "betterdocs")}</span>
              </button>
              <button type="submit" className="bd-faq-button button-success" disabled={submitting}>
                <span className="bd-faq-text">{submitting ? __("Creating…", "betterdocs") : __("Create", "betterdocs")}</span>
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

export default CreateFaq;
