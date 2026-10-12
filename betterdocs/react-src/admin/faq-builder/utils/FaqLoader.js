import React from "react";

// Card-style skeleton matching the FAQ list rows. Renders roughly as many rows
// as the group actually has (`count`) so the accordion opens straight to ~its
// final height — otherwise a large group animates open to a fixed 3-row
// skeleton and then jumps when the taller real list swaps in. Capped at 10 so
// it never overshoots the body's ~575px scroll area.
const FaqLoader = ({ count }) => {
  const rows = Math.min(Math.max(Number(count) || 3, 1), 10);
  return (
  <div className="bd-faq-skeleton bd-faq-skeleton--faq">
    {Array.from({ length: rows }).map((_, i) => (
      <div className="bd-faq-skeleton__card" key={i}>
        <span className="bd-faq-skeleton__grip" />
        <span className="bd-faq-skeleton__text">
          <span className="bd-faq-skeleton__line bd-faq-skeleton__line--title" />
        </span>
        <span className="bd-faq-skeleton__toggle" />
        <span className="bd-faq-skeleton__icon" />
        <span className="bd-faq-skeleton__icon" />
        <span className="bd-faq-skeleton__icon" />
      </div>
    ))}
  </div>
  );
};

export default FaqLoader;
