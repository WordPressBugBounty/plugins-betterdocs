import React, { useEffect, useState } from "react";
import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import { useFAQ } from "../../components/FAQContext";
import { useFAQScope } from "../context/ScopeContext";

/**
 * FAQ Builder summary stat cards (FAQ Groups / Total FAQs / Published / Drafts).
 *
 * Design-only addition: the counts are derived from data the app already has —
 * `groupsTotal` is the FAQ-category total, and the FAQ publish/draft split comes
 * from the existing `docs-faq-count` REST endpoint (no new functionality).
 */

// Stroke icons matching the standalone design mockup.
const Icon = ({ size = 20, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const IconBook = () => (
  <Icon>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
  </Icon>
);
const IconFAQ = () => (
  <Icon>
    <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" />
    <path d="M9.5 9a2.5 2.5 0 0 1 5 .25c0 1.5-2.5 2-2.5 3.75M12 16.5h.01" />
  </Icon>
);
const IconCheck = () => (
  <Icon>
    <path d="M5 12l5 5L20 7" />
  </Icon>
);
const IconEdit = () => (
  <Icon>
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </Icon>
);

// Soft blurred-triangle glow in the top-left corner — the exact SVG the dashboard
// overview cards (`.betterdocs-card-wrapper.created-docs`) use, with this card's
// tint injected as the gradient start color so the FAQ cards share that design
// system (132×88, opacity 0.2, positioned `left top`).
const glowSvg = (tint) =>
  `url("data:image/svg+xml,%3Csvg width='132' height='88' viewBox='0 0 132 88' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.2' filter='url(%23bdFaqBlur)'%3E%3Cpath d='M96 -3.50001L-0.750021 52.3586L-0.750016 -59.3586L96 -3.50001Z' fill='url(%23bdFaqGrad)'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='bdFaqBlur' x='-35.9468' y='-94.5562' width='167.144' height='182.112' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/%3E%3CfeGaussianBlur stdDeviation='17.5984' result='effect1_foregroundBlur'/%3E%3C/filter%3E%3ClinearGradient id='bdFaqGrad' x1='96' y1='-3.50001' x2='-33' y2='-3.50001' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='${encodeURIComponent(
    tint
  )}'/%3E%3Cstop offset='1' stop-color='%23FFE600' stop-opacity='0'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E")`;

// "#00B884" -> "0, 184, 132" for rgba(var(--rgb), a) backgrounds.
const hexToRgb = (hex) => {
  const h = String(hex).replace("#", "");
  return `${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}`;
};

const StatCard = ({ value, label, tint, icon }) => (
  <div
    className="bd-faq-stat-card"
    style={{ backgroundImage: glowSvg(tint) }}
  >
    <div className="bd-faq-stat-card__body">
      <h3 className="bd-faq-stat-card__value">{value}</h3>
      <p className="bd-faq-stat-card__label">{label}</p>
    </div>
    <span
      className="bd-faq-stat-card__icon"
      style={{ "--bd-icon-tint": tint, "--bd-icon-tint-rgb": hexToRgb(tint) }}
    >
      {icon}
    </span>
  </div>
);

const FaqStats = ({ groupsTotal = 0, refreshSignal }) => {
  const [counts, setCounts] = useState({});
  const { statsVersion } = useFAQ();
  const { isProduct } = useFAQScope();

  // Re-derive whenever the FAQ list changes (add / delete / draft toggle all
  // run the builder's category refetch, which updates `refreshSignal`), so the
  // stat cards stay live with the rest of the page.
  useEffect(() => {
    let active = true;
    apiFetch({ path: "/betterdocs/v1/docs-faq-count" })
      .then((res) => {
        if (active && res) {
          setCounts(res);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [refreshSignal, statsVersion]);

  const createdKey = isProduct ? "created_product_faq" : "created_faq";
  const publishedKey = isProduct ? "published_product_faq" : "published_faq";
  const total = parseInt(counts[createdKey], 10) || 0;
  const published = parseInt(counts[publishedKey], 10) || 0;
  const drafts = Math.max(total - published, 0);
  // Real FAQ groups only. "Uncategorized" is not a group — it's the bucket for FAQs
  // that have none — so counting it made the card disagree with the group list (e.g.
  // "3 Groups" next to 2 groups + Uncategorized). The FAQs inside it are still counted
  // by the Total / Published / Drafts cards.
  const groups = parseInt(groupsTotal, 10) || 0;

  return (
    <div className="bd-faq-stats">
      <StatCard
        value={groups}
        label={__(
          isProduct ? "Product FAQ Groups" : "General FAQ Groups",
          "betterdocs"
        )}
        tint="#00B884"
        icon={<IconBook />}
      />
      <StatCard
        value={total}
        label={__("Total FAQs", "betterdocs")}
        tint="#F59E0B"
        icon={<IconFAQ />}
      />
      <StatCard
        value={published}
        label={__("Published", "betterdocs")}
        tint="#3B82F6"
        icon={<IconCheck />}
      />
      <StatCard
        value={drafts}
        label={__("Drafts", "betterdocs")}
        tint="#8B5CF6"
        icon={<IconEdit />}
      />
    </div>
  );
};

export default FaqStats;
