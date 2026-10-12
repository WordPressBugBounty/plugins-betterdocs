import React from "react";
import { __ } from "@wordpress/i18n";
import { PopupVideo } from "./PopupVideo"
import { useState } from "react";

const Video = () => {

	const [isOpen, setIsOpen] = useState(false);

	const openPopup = () => setIsOpen(true);
	const closePopup = () => setIsOpen(false);

	return (
		<>
			<div className="betterdocs-video-section">
				<div className="betterdocs-row">
					<div className="betterdocs-overview-col betterdocs-content-left betterdocs-col-6 ">
						<h2 className="betterdocs-section-title">{__("Welcome To BetterDocs", "betterdocs")}</h2>
						<p className="betterdocs-section-sub-title"><span className="betterdocs-bold-title">{__("40,000+ businesses", "betterdocs")} </span> 
							{__("are accelerating their growth by creating content-rich documentation and knowledge base with BetterDocs.","betterdocs")}
						</p>
						<a href="https://www.youtube.com/watch?v=pwT6WMM7vRY&list=PLWHp1xKHCfxDOGyziODrJ1qYNOC8pbVYA" className="betterdocs-video-button">
							<span>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g clipPath="url(#clip0_11564_17895)">
										<path
											d="M5 3.33357V16.6669C4.99996 16.8152 5.03948 16.9608 5.11448 17.0887C5.18949 17.2166 5.29726 17.3222 5.42669 17.3945C5.55611 17.4669 5.70249 17.5034 5.85074 17.5003C5.99898 17.4972 6.14371 17.4546 6.27 17.3769L17.1033 10.7102C17.2247 10.6357 17.3249 10.5313 17.3944 10.407C17.4639 10.2827 17.5004 10.1426 17.5004 10.0002C17.5004 9.85783 17.4639 9.71779 17.3944 9.5935C17.3249 9.4692 17.2247 9.36479 17.1033 9.29024L6.27 2.62357C6.14371 2.54587 5.99898 2.50328 5.85074 2.50018C5.70249 2.49709 5.55611 2.5336 5.42669 2.60595C5.29726 2.67831 5.18949 2.78388 5.11448 2.91179C5.03948 3.03969 4.99996 3.18529 5 3.33357Z"
											fill="#00B884"
										/>
									</g>
									<defs>
										<clipPath id="clip0_11564_17895">
											<rect width="20" height="20" fill="white" />
										</clipPath>
									</defs>
								</svg>
							</span>
							<span>{__("Watch Tutorials", "betterdocs")}</span>
						</a>
					</div>
					<div className="betterdocs-overview-col betterdocs-content-right betterdocs-col-6 ">
						<div className="popup-trigger" onClick={openPopup}>
							<img src={`${betterdocs_admin.dir_url}assets/static/admin/images/videoThumb.png`} />
						</div>
					</div>
				</div>

				{isOpen && (
					<div className="betterdocs-popup-overlay" onClick={closePopup}>
						<div
							className="betterdocs-popup-wrapper"
							onClick={(e) => e.stopPropagation()}
						>
							<PopupVideo closePopup={closePopup} />
						</div>
					</div>
				)}

			</div>
		</>
	);
};

export default Video;
