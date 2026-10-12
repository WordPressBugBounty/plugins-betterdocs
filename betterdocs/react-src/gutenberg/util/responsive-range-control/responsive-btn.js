const { dispatch } = wp.data;
import {
    handleDesktopBtnClick,
    handleTabBtnClick,
    handleMobileBtnClick,
} from "../helpers";

export default function WithResBtns({
    children,
    resRequiredProps,
    label,
    controlName,
    onReset,
    noUnits,
}) {
    const editorType = window?.betterDocsBlocksHelper?.editorType ?? editorType;
    const { setAttributes, resOption, objAttributes } = resRequiredProps;
    onReset = () => {
        if (noUnits) {
            resOption == "Desktop"
                ? setAttributes({
                      [`${controlName}Range`]:
                          objAttributes[`${controlName}Range`].default,
                  })
                : "";
            resOption == "Tablet"
                ? setAttributes({
                      [`TAB${controlName}Range`]:
                          objAttributes[`TAB${controlName}Range`].default,
                  })
                : "";
            resOption == "Mobile"
                ? setAttributes({
                      [`MOB${controlName}Range`]:
                          objAttributes[`MOB${controlName}Range`].default,
                  })
                : "";
        } else {
            resOption == "Desktop"
                ? setAttributes({
                      [`${controlName}Range`]:
                          objAttributes[`${controlName}Range`].default,
                      [`${controlName}Unit`]:
                          objAttributes[`${controlName}Unit`].default || "px",
                  })
                : "";
            resOption == "Tablet"
                ? setAttributes({
                      [`TAB${controlName}Range`]:
                          objAttributes[`TAB${controlName}Range`].default,
                      [`TAB${controlName}Unit`]:
                          objAttributes[`TAB${controlName}Unit`].default ||
                          "px",
                  })
                : "";
            resOption == "Mobile"
                ? setAttributes({
                      [`MOB${controlName}Range`]:
                          objAttributes[`MOB${controlName}Range`].default,
                      [`MOB${controlName}Unit`]:
                          objAttributes[`MOB${controlName}Unit`].default ||
                          "px",
                  })
                : "";
        }
    };
    return (
        <div className={`responsive-btn-wrapper`}>
            <div className="responsive-btn">
                <span className="responsive-btn-label components-base-control__label">
                    {label}
                </span>
                <span
                    onClick={() =>
                        handleDesktopBtnClick({
                            setPreviewDeviceType:
                                dispatch(editorType)
                                    .__experimentalSetPreviewDeviceType,
                            setAttributes,
                        })
                    }
                    className={`typoResButton dashicons dashicons-desktop ${
                        resOption === "Desktop" ? "active" : " "
                    }`}
                ></span>
                <span
                    onClick={() =>
                        handleTabBtnClick({
                            setPreviewDeviceType:
                                dispatch(editorType)
                                    .__experimentalSetPreviewDeviceType,
                            setAttributes,
                        })
                    }
                    className={`typoResButton dashicons dashicons-tablet ${
                        resOption === "Tablet" ? "active" : " "
                    }`}
                ></span>
                <span
                    onClick={() =>
                        handleMobileBtnClick({
                            setPreviewDeviceType:
                                dispatch(editorType)
                                    .__experimentalSetPreviewDeviceType,
                            setAttributes,
                        })
                    }
                    className={`typoResButton dashicons dashicons-smartphone ${
                        resOption === "Mobile" ? "active" : " "
                    }`}
                ></span>
            </div>
            <div className="eb-component-wrapper">
                {children}
                <button className="eb-range-reset-button" onClick={onReset}>
                    <span className="dashicon dashicons dashicons-image-rotate"></span>
                </button>
            </div>
        </div>
    );
}
