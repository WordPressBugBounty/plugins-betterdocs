import React from "react";

// Form-shaped skeleton for the top-level "Add New FAQ" create form. Mirrors the
// real .bd-faq-create-new layout (FAQ Group select, Question input, Answer
// editor, footer buttons) and matches its ~670px desktop height so there's no
// jump when the real form replaces it.
const CreateFaqLoader = () => (
  <div className="bd-faq-skeleton bd-faq-skeleton--create">
    <div className="bd-faq-skeleton__form-body">
      <div className="bd-faq-skeleton__field">
        <span className="bd-faq-skeleton__line bd-faq-skeleton__line--label" />
        <span className="bd-faq-skeleton__field-box bd-faq-skeleton__field-box--select" />
      </div>
      <div className="bd-faq-skeleton__field">
        <span className="bd-faq-skeleton__line bd-faq-skeleton__line--label" />
        <span className="bd-faq-skeleton__field-box bd-faq-skeleton__field-box--input" />
      </div>
      <div className="bd-faq-skeleton__field bd-faq-skeleton__field--grow">
        <span className="bd-faq-skeleton__line bd-faq-skeleton__line--label" />
        <span className="bd-faq-skeleton__field-box bd-faq-skeleton__field-box--editor" />
      </div>
    </div>
    <div className="bd-faq-skeleton__form-footer">
      <span className="bd-faq-skeleton__btn bd-faq-skeleton__btn--ghost" />
      <span className="bd-faq-skeleton__btn" />
    </div>
  </div>
);

export default CreateFaqLoader;
