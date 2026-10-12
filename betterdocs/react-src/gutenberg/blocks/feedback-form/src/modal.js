import { __ } from "@wordpress/i18n";
import { safeHTML } from '@wordpress/dom';

const FeedbackModalForm = ({
    display,
    setDisplay,
    blockId,
    formTitle,
    buttonText,
	labelNameText,
	labelEmailText,
	labelMessageText
}) => {
    return (
        <div
            id="betterdocs-form-modal"
            className={`${safeHTML(blockId)} betterdocs-modalwindow`}
            style={{ display: display }}
        >
            <div className="modal-inner">
                <div className="modal-content">
                    <a
                        href="#"
                        className="close"
                        onClick={() => {
                            setDisplay("none");
                        }}
                    >
                        <svg width="16px" viewBox="0 0 50 50" version="1.1">
                            <g id="surface1">
                                <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z "></path>
                            </g>
                        </svg>
                    </a>
                    <h2 className="feedback-form-title">{formTitle}</h2>
                    <div className="modal-content-inner">
                        <div className="form-wrapper">
                            <div className="response"></div>
                            <form
                                id="betterdocs-feedback-form"
                                className="betterdocs-feedback-form"
                            >
                                <p>
                                    <label
                                        htmlFor="message_name"
                                        className="form-name"
                                    >
                                        {labelNameText} <span>*</span>
                                        <input
                                            type="text"
                                            id="message_name"
                                            name="message_name"
                                            value=""
                                        />
                                    </label>
                                </p>
                                <p>
                                    <label
                                        htmlFor="message_email"
                                        className="form-email"
                                    >
                                        {labelEmailText} <span>*</span>
                                        <input
                                            type="text"
                                            id="message_email"
                                            name="message_email"
                                            value="greendaycu20@gmail.com"
                                        />
                                    </label>
                                </p>
                                <p>
                                    <label
                                        htmlFor="message_text"
                                        className="form-message"
                                    >
                                        {labelMessageText} <span>*</span>
                                        <textarea
                                            type="text"
                                            id="message_text"
                                            name="message_text"
                                        ></textarea>
                                    </label>
                                </p>
                                <div className="feedback-from-button">
                                    <input
                                        type="hidden"
                                        name="submitted"
                                        value="1"
                                    />
                                    <input
                                        type="submit"
                                        name="submit"
                                        className="button"
                                        id="feedback_form_submit_btn"
                                        value={buttonText}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModalForm;
