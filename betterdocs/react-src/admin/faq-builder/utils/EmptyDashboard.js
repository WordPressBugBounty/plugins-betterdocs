import React from "react";
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { generateSampleData } from "./function";
import SampleDocsFlow from "../../sample-docs/SampleDocsFlow";
import { sampleDocsEnabled } from "../../sample-docs/api";
import { AiBadge, GenerateBtn } from "../../sample-docs/Pieces";
import { FaqIllustration } from "../../sample-docs/icons";

const EmptyDashboard = ({
  reFetchCategories,
  setShowCategoryModal,
  showNewFaqText = true,
  showFaqActionButtons = true,
  showSampleFaqButton = true,
  contentType = "faq",
}) => {
  const [flowOpen, setFlowOpen] = useState(false);
  const [text, setText] = useState(__("Generate Sample FAQs", "betterdocs"));
  const aiEnabled = sampleDocsEnabled();
  const isProductFaq = contentType === "product_faq";

  // The classic CSV/sample-data fallback seeds the General FAQ taxonomy, so it
  // is only valid for the General tab. On the WooCommerce (Product FAQ) tab we
  // only offer the AI/store-aware flow — never the CSV button.
  const showSampleButton = showSampleFaqButton && (aiEnabled || !isProductFaq);

  // Tier-3 fallback (AI disabled): the classic CSV/sample-data generator.
  const handleSampleDataCreate = () => {
    setText(__("Generating...", "betterdocs"));
    generateSampleData()
      .then(() => {
        toast.success(__("Sample data generated.", "betterdocs"));
        reFetchCategories();
      })
      .catch((err) => {
        setText(__("Generate Sample FAQs", "betterdocs"));
        err?.name
          ? toast.error(`${err?.name} :${err?.message}`)
          : toast.error(`${err?.message}`);
      });
  };

  return (
    <section className="betterdocs-dashboard-body">
      <div className="betterdocs-no-docs-wrapper betterdocs-sd-empty-card">
        <div className="betterdocs-no-docs-img-wrap">
          <FaqIllustration />
        </div>

        <div className="betterdocs-no-docs-content">
          <h3 className="betterdocs-no-docs-title">
            {isProductFaq
              ? __("No Product FAQ Found!", "betterdocs")
              : __("No FAQ Found!", "betterdocs")}
          </h3>

          {showNewFaqText && (
            <p className="betterdocs-no-docs-text">
              {aiEnabled && showSampleButton
                ? isProductFaq
                  ? __("Create a product FAQ group to get started — or let AI build a store-ready FAQ set from your store details.", "betterdocs")
                  : __("Create a new FAQ group to get started — or let AI build a starter set of FAQs for you.", "betterdocs")
                : isProductFaq
                  ? __("Please create a product FAQ group to get started.", "betterdocs")
                  : __("Please create a new FAQ group to get started.", "betterdocs")}
            </p>
          )}

          {showFaqActionButtons && (
            <>
              <div className="betterdocs-sd-empty-actions">
                <button
                  type="button"
                  className="betterdocs-sd-create-btn"
                  onClick={() => setShowCategoryModal(true)}
                >
                  {isProductFaq
                    ? __("Create a Product FAQ Group", "betterdocs")
                    : __("Create a New FAQ Group", "betterdocs")}
                </button>

                {showSampleButton && (
                  aiEnabled ? (
                    <GenerateBtn block onClick={() => setFlowOpen(true)}>
                      {isProductFaq
                        ? __("Generate Sample Product FAQs", "betterdocs")
                        : __("Generate Sample FAQs", "betterdocs")}
                    </GenerateBtn>
                  ) : (
                    <button type="button" className="betterdocs-dashboard-btn" onClick={handleSampleDataCreate}>
                      {text}
                    </button>
                  )
                )}
              </div>

              {showSampleButton && aiEnabled && (
                <div className="betterdocs-sd-empty-badge">
                  <AiBadge />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {flowOpen && (
        <SampleDocsFlow
          contentType={contentType}
          onClose={() => setFlowOpen(false)}
          onComplete={() => {
            setFlowOpen(false);
            reFetchCategories();
          }}
        />
      )}
    </section>
  );
};

export default EmptyDashboard;
