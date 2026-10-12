import { __ } from "@wordpress/i18n";
import React, { useEffect, useState } from "react";
import { withLabel, validFieldProps } from "quickbuilder";

const SettingsUploader = (props) => {
	const validProps = validFieldProps(props, [
		"is_pro",
		"visible",
		"trigger",
		"disable",
		"parentIndex",
		"context",
		"copyOnClick",
	]);

	const [uploadedFile, setUploadedFile] = useState(null);

	const handleChange = (e) => {
		if (!e.target.files.length) {
			return;
		}

		const file = e.target.files[0];

		if(file?.size == 0){
			props.context.alerts.toast('error', __('File can\'t be empty.', 'betterdocs'));
			return;
		}
		else if(file?.type != 'application/json' && file?.type != 'text/json'){
			props.context.alerts.toast('error', __('Invalid file type.', 'betterdocs'));
			return;
		}

		setUploadedFile(file);

		let reader = new FileReader();
		const self = this;
		reader.onload = (event) => {
			const json = event?.target?.result;
			props.onChange({
				target: {
					type: 'jsonuploader',
					name: props.name,
					value: json,
				}
			});
		};
		reader.readAsText(file);
	};

	const removeFile = () => {
		setUploadedFile(null);
		props.onChange({
			target: {
				type: 'jsonuploader',
				name: props.name,
				value: null,
			}
		});
	}

	useEffect(() => {
		if(!props?.value){
			setUploadedFile(null);
		}
	}, [props?.value])

	return (
        <div className="wprf-control-field wprf-importer-upload-field">
            <span className="wprf-json-uploader">
                {!uploadedFile && (
                    <label className="wprf-importer-upload-button">
                        <span className="icon">
                            <i className="btd-icon btd-upload"></i>
                        </span>
                        <span>{__("Click to upload", "betterdocs")}</span>
                        <input
                            type="file"
                            accept="application/JSON"
                            onChange={(e) => {
                                handleChange(e);
                            }}
                        />
                    </label>
                )}
                {uploadedFile && uploadedFile?.name && (
                    <span className="wpfr-json-file-name-wrapper">
                        <span className="wpfr-json-file-name">
                            {uploadedFile?.name.length > 20
                                ? `${uploadedFile?.name.substr(
                                        0,
                                        9
                                )}...${uploadedFile?.name.substr(
                                        uploadedFile?.name.length - 7
                                )}`
                                : uploadedFile?.name}
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
                )}
            </span>
        </div>
	);
};

export default withLabel(React.memo(SettingsUploader));
