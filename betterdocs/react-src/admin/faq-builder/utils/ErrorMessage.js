import React from "react";
import { decodeEntities } from "@wordpress/html-entities";

// Defensive: the error state should always be a string (see utils/aiErrorMessage),
// but coerce here too so a stray object can never render as "[object Object]".
const toText = ( error ) => {
  if ( ! error ) return "";
  if ( typeof error === "string" ) return error;
  return typeof error.message === "string" ? error.message : "";
};

const ErrorMessage = ({ error }) => {
  const text = toText( error );
  return ( text && text.length && (
    <p className="bd-error-message">{decodeEntities( text )}</p>
  ) ) || "";
};

export default ErrorMessage;
