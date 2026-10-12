import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { GenericInput, Input } from "quickbuilder";
import { withLabel } from "quickbuilder";

function Migration(props) {
    const componentClasses = classNames(
        "wprf-checkbox-wrap wprf-name-migration_step",
        props?.classes,
    );
    return (
        <div className={componentClasses}>
            <GenericInput {...{ ...props, type: "checkbox" }} />
            <label htmlFor={props.id}>{props.label}</label>
        </div>
    );
}

export default withLabel(Migration);
