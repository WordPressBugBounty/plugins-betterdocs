import React from "react";
import { __ } from "@wordpress/i18n";

// icons
import { ReactComponent as BTDLogo } from "./../assets/images/betterdocs-logo.svg";
import { ReactComponent as AddNew } from "./../assets/images/add-new.svg";

const BetterDocsFaqHeader = ({ isEmptyDashboard, setShowCategoryModal }) => {
  return (
    <div className="bd-faq-header">
      <div className="bd-faq-header-left">
        <div className="betterdocs-admin-logo-inline">
          <BTDLogo />
        </div>
        <h2 className="title">{__("| ", "betterdocs")}</h2>
        <h2 className="title title-label">{__("FAQ Builder", "betterdocs")}</h2>
      </div>
      <div className="bd-faq-header-right">
        {!isEmptyDashboard ? (
          <button
            type="button"
            className="bd-faq-button button-success"
            onClick={() => setShowCategoryModal(true)}
          >
            <span className="bd-faq-icon">
              <AddNew />
            </span>
            <span className="bd-faq-text">
              {__("Create a New FAQ Group", "betterdocs")}
            </span>
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default BetterDocsFaqHeader;
