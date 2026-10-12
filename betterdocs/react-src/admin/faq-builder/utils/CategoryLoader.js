import React from "react";

// Card-style skeleton matching the FAQ group rows.
const CategoryLoader = () => (
  <div className="bd-faq-skeleton">
    {Array.from({ length: 5 }).map((_, i) => (
      <div className="bd-faq-skeleton__card" key={i}>
        <span className="bd-faq-skeleton__grip" />
        <span className="bd-faq-skeleton__text">
          <span className="bd-faq-skeleton__line bd-faq-skeleton__line--title" />
          <span className="bd-faq-skeleton__line bd-faq-skeleton__line--meta" />
        </span>
        <span className="bd-faq-skeleton__btn" />
        <span className="bd-faq-skeleton__icon" />
        <span className="bd-faq-skeleton__icon" />
        <span className="bd-faq-skeleton__toggle" />
        <span className="bd-faq-skeleton__icon" />
      </div>
    ))}
  </div>
);

export default CategoryLoader;
