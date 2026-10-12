import React, { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import { validFieldProps, isObject } from "quickbuilder";

// This component will send form data on submit
const ImporterUpload = (props) => {
    const validProps = validFieldProps(props, [
        "is_pro",
        "visible",
        "trigger",
        "disable",
        "parentIndex",
        "context",
        "copyOnClick",
        "description",
        "label",
        "help",
        "style",
    ]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [existingSlugs, setExistingSlugs] = useState([]);
    const [selectedAction, setSelectedAction] = useState("ignore");

    // from withLabel field
    let {
        label,
        label_subtitle,
        id,
        name,
        type,
        style: prevStyle,
        is_pro,
        badge,
        value,
        enable_disable_text_active = false,
        ...rest
    } = props;
    // const instanceId = useInstanceId(withLabel);

    if (id == undefined) {
        id = name;
    }

    const styles = {
        description: {
            position: "right",
        },
        ...prevStyle,
    };

    const classNames = (...args) => args.filter(Boolean).join(" ");

    const styleClasses = classNames({
        [`wprf-style-${styles?.type}`]: styles?.type || false,
        "wprf-label-none":
            label === undefined || label === "" || label.length === 0,
        [`wprf-${styles?.label?.position || "inline"}-label`]:
            (styles?.label?.position ?? true) && label != undefined,
    });

    if (type === "hidden") {
        return <WrappedComponent {...props} id={id} />;
    }

    const componentClasses = classNames(
        "wprf-control-wrapper",
        `wprf-type-${type}`,
        styleClasses,
        props?.classes,
        {
            [`wprf-name-${name}`]: name,
        },
    );

    const handleRadioChange = (e) => {
        setSelectedAction(e.target.value);
    };

    const handleFileChange = (e) => {
        if (!e.target.files.length) {
            return;
        }
        const file = e.target.files[0];

        if (file?.size == 0) {
            props.context.alerts.toast(
                "error",
                __('File can\'t be empty.', "betterdocs"),
            );
            return;
        } else if (
            file?.type !== "application/json" &&
            file?.type !== "text/json" &&
            file?.type !== "application/xml" && // MIME type for XML
            file?.type !== "text/xml" &&
            file?.type !== "text/csv" &&
            file?.type !== "application/csv" &&
            file?.type !== "application/vnd.ms-excel" // MIME types for CSV
        ) {
            props.context.alerts.toast(
                "error",
                __('Invalid file type.', "betterdocs"),
            );
            return;
        }

        setSelectedFile(file);

        // Check file type and call respective functions
        if (file.type === "application/xml" || file.type === "text/xml") {
            let reader = new FileReader();

            reader.onload = function (e) {
                // e.target.result contains the file data
                const fileData = e.target.result;

                // Parse the XML string
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(fileData, "text/xml");

                // Define the WordPress namespace
                const wpNamespace = "http://wordpress.org/export/1.2/";

                // Use XPath to extract wp:post_name values
                let data = {};
                const postSlugs = [];
                const nodes = xmlDoc.evaluate(
                    "//wp:post_name",
                    xmlDoc,
                    (prefix) => {
                        return prefix === "wp" ? wpNamespace : null;
                    },
                    XPathResult.ANY_TYPE,
                    null,
                );

                let node = nodes.iterateNext();
                while (node) {
                    postSlugs.push(node.textContent);
                    node = nodes.iterateNext();
                }
                if (postSlugs) {
                    data["posts"] = postSlugs;
                }

                apiFetch({
                    path: "/betterdocs/v1/parse-xml",
                    method: "POST",
                    data: data,
                })
                    .then((response) => {
                        if (response.status === "success" && response.data) {
                            setExistingSlugs(Object.values(response.data));
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            };

            // Read the file as text or binary, depending on your needs
            reader.readAsText(file);
        } else if (
            file.type === "text/csv" ||
            file.type === "application/csv" ||
            file.type === "application/vnd.ms-excel"
        ) {
            handleCSVFile(file);
        }
    };

    const handleCSVFile = (file) => {
        const formData = new FormData();
        formData.append("file", file);
        apiFetch({
            path: "/betterdocs/v1/parse-csv",
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (response.status === "success" && response.data) {
                    setExistingSlugs(Object.values(response.data));
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleUpload = () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        // Add other form data to the FormData object
        {
            existingSlugs.length > 0 &&
                formData.append("existing_slug", existingSlugs.join(","));
        }

        const selectedAction = document.querySelector(
            'input[name="action"]:checked',
        );

        if (selectedAction) {
            formData.append("action", selectedAction.value);
        }

        apiFetch({
            path: props.ajax.api,
            method: "POST",
            body: formData,
        })
            .then((response) => {
                setIsLoading(false);

                if (response.status === "failed") {
                    throw new Error();
                }

                if (response.status === "success") {
                    setSelectedFile(null);

                    if (!props.ajax?.hideSwal) {
                        const type = props.ajax?.swal?.icon || "success";
                        const message = props.ajax?.swal?.text || "Complete";
                        props.context.alerts.toast(type, message, {
                            autoClose: props.ajax?.swal?.autoClose,
                        });
                    }
                    if (props.ajax?.reload) {
                        setTimeout(() => window.location.reload(), 1000);
                    }
                }
            })
            .catch((error) => {
                setIsLoading(true);
                if (!props.ajax?.hideSwal) {
                    props.context.alerts.toast(
                        "error",
                        error?.message ||
                            __("Something went wrong.", "betterdocs"),
                    );
                }
            });
    };
    const removeFile = () => {
        setSelectedFile(null);
        props.onChange({
            target: {
                type: "importerupload",
                name: props.name,
                value: null,
            },
        });
    };
    return (
        <>
            <div className={componentClasses}>
                <div className="wprf-control-label">
                    {label && <label htmlFor={id}>{label}</label>}
                    {label_subtitle && (
                        <p
                            className="wprf-label-subtitle"
                            dangerouslySetInnerHTML={{
                                __html: label_subtitle,
                            }}
                        ></p>
                    )}
                </div>
                <div className="wprf-control-field wprf-importer-upload-field">
                    <span className="wprf-json-uploader">
                        {selectedFile === null ? (
                            <label className="wprf-importer-upload-button">
                                <span className="icon">
                                    <i className="btd-icon btd-upload"></i>
                                </span>
                                <span>
                                    {__("Click to upload", "betterdocs")}
                                </span>
                                <input
                                    type="file"
                                    accept={props.file_type}
                                    onChange={handleFileChange}
                                />
                            </label>
                        ) : (
                            selectedFile.name && (
                                <>
                                    <span className="wpfr-json-file-name-wrapper">
                                        <span className="wpfr-json-file-name">
                                            {selectedFile.name.length > 20
                                                ? `${selectedFile.name.substr(
                                                      0,
                                                      9,
                                                  )}...${selectedFile.name.substr(
                                                      selectedFile.name.length -
                                                          7,
                                                  )}`
                                                : selectedFile.name}
                                        </span>
                                        <span
                                            className="wprf-json-file-delete-button"
                                            onClick={removeFile}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <mask
                                                    id="mask0_2475_21238"
                                                    mask-type="alpha"
                                                    maskUnits="userSpaceOnUse"
                                                    x="0"
                                                    y="0"
                                                    width="24"
                                                    height="24"
                                                >
                                                    <rect
                                                        width="24"
                                                        height="24"
                                                        fill="#D9D9D9"
                                                    />
                                                </mask>
                                                <g mask="url(#mask0_2475_21238)">
                                                    <path
                                                        d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                                                        fill="#475467"
                                                    />
                                                </g>
                                            </svg>
                                        </span>
                                    </span>
                                    {existingSlugs.length > 0 && (
                                        <>
                                            <div className="data-exists">
                                                <input
                                                    type="hidden"
                                                    name="existing_slug"
                                                    id="existing_slug"
                                                />
                                                <div className="error">
                                                    {props?.text
                                                        ?.exists_notice && (
                                                        <p className="exists-notice">
                                                            {
                                                                props?.text
                                                                    ?.exists_notice
                                                            }
                                                        </p>
                                                    )}
                                                    <label htmlFor="ignore-radio">
                                                        <input
                                                            type="radio"
                                                            name="action"
                                                            value="ignore"
                                                            id="ignore-radio"
                                                            checked={
                                                                selectedAction ===
                                                                "ignore"
                                                            }
                                                            onChange={
                                                                handleRadioChange
                                                            }
                                                        />
                                                        {__(
                                                            "Ignore",
                                                            "betterdocs",
                                                        )}
                                                    </label>
                                                    <label htmlFor="keepboth-radio">
                                                        <input
                                                            type="radio"
                                                            name="action"
                                                            value="keepboth"
                                                            id="keepboth-radio"
                                                            checked={
                                                                selectedAction ===
                                                                "keepboth"
                                                            }
                                                            onChange={
                                                                handleRadioChange
                                                            }
                                                        />
                                                        {__(
                                                            "Keep Both",
                                                            "betterdocs",
                                                        )}
                                                    </label>
                                                    <label htmlFor="replace-radio">
                                                        <input
                                                            type="radio"
                                                            name="action"
                                                            value="replace"
                                                            id="replace-radio"
                                                            checked={
                                                                selectedAction ===
                                                                "replace"
                                                            }
                                                            onChange={
                                                                handleRadioChange
                                                            }
                                                        />
                                                        {__(
                                                            "Replace",
                                                            "betterdocs",
                                                        )}
                                                    </label>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )
                        )}
                    </span>
                </div>
            </div>
            {selectedFile && (
                <div className="wprf-submit wprf-importer-submit">
                    <button
                        {...validProps}
                        type="submit"
                        disabled={isLoading}
                        onClick={handleUpload}
                        className="wprf-submit-button"
                    >
                        {isObject(props?.text) && props?.ajax
                            ? isLoading
                                ? props?.text?.loading
                                : props.value
                                ? props?.text?.saved
                                : props?.text?.normal
                            : props?.text}
                    </button>
                </div>
            )}
        </>
    );
};

export default ImporterUpload;
