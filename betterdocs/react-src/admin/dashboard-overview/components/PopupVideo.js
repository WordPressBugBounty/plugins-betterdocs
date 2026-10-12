
export function PopupVideo({ closePopup }) {
    const CloseIcon = () => (
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_1382_24431"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="25"
            height="24"
          >
            <rect x="0.296875" width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_1382_24431)">
            <path
              d="M6.69687 19L5.29688 17.6L10.8969 12L5.29688 6.4L6.69687 5L12.2969 10.6L17.8969 5L19.2969 6.4L13.6969 12L19.2969 17.6L17.8969 19L12.2969 13.4L6.69687 19Z"
              fill="#475467"
            />
          </g>
        </svg>
      );


    return (
        <>
            <div  className="betterdocs-popup-video-content">
                <button className="betterdocs-popu-close-btn" onClick={closePopup}><CloseIcon /></button>
                <div className="betterdocs-popup-video">
					<iframe
						src="https://www.youtube.com/embed/aazpfsyrPH8"
						title="YouTube video player"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerPolicy="strict-origin-when-cross-origin"
						allowFullScreen
					></iframe>
                </div>
            </div>
        </>
    )
}
