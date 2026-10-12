import React from "react";
import { __ } from "@wordpress/i18n";

import { ReactComponent as EmptyFile } from "./../assets/images/empty-faq.svg";

const EmptyCategory = () => {
  return (
    <div className="bd-empty-faq-category">
      <div className="bd-faq-empty-icon">
        <EmptyFile />
      </div>
      <h2 className="bd-faq-empty-title">
        {__("No FAQ Found!", "betterdocs")}
      </h2>
    </div>
  );
};

export default EmptyCategory;
