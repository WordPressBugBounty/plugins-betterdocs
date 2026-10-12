export default ({ buttonColor, buttonHoverColor }) => {
    return (
        <svg
            className="betterdocs-faq-iconminus faq-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth={2}
        >
            <g
                fill="none"
                stroke={buttonColor}
                strokeLinecap="round"
                strokeMiterlimit={10}
                strokeLinejoin="round"
            >
                <path d="M17 12H7" />
                <circle cx={12} cy={12} r={11} />
            </g>
        </svg>
    );
};

export const Minus1 = ({ buttonColor, buttonHoverColor }) => {
    return (
        <svg
            className="betterdocs-faq-iconminus"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth={2}
        >
            <g
                fill="none"
                stroke={buttonColor}
                strokeLinecap="round"
                strokeMiterlimit={10}
                strokeLinejoin="round"
            >
                <path d="M17 12H7" />
                <circle cx={12} cy={12} r={11} />
            </g>
        </svg>
    );
};

export const Minus2 = ({ buttonColor, buttonHoverColor }) => {
    return (
        <svg
            className="betterdocs-faq-iconminus faq-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <path fill={buttonColor} d="M6 10h12v4H6z" />
        </svg>
    );
};

export const Plus1 = ({ buttonColor, buttonHoverColor }) => {
    return (
        <svg
            className="betterdocs-faq-iconplus"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <g
                strokeWidth={2}
                fill="none"
                stroke={buttonColor}
                strokeLinecap="square"
                strokeMiterlimit={10}
            >
                <path d="M12 7v10M17 12H7" />
                <circle cx={12} cy={12} r={11} />
            </g>
        </svg>
    );
};

export const Plus2 = ({ buttonColor, buttonHoverColor }) => {
    return (
        <svg
            className="betterdocs-faq-iconplus faq-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <path fill="#000000" d="M18 10h-4V6h-4v4H6v4h4v4h4v-4h4" />
        </svg>
    );
};

export const DownChevronIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={21}
            height={20}
            fill="none"
            className="betterdocs-faq-iconplus"
        >
            <g clipPath="url(#a)">
                <path
                    stroke="#707E95"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="m5.5 7.5 5 5 5-5"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M.5 0h20v20H.5z" />
                </clipPath>
            </defs>
        </svg>
    );
};

export const UpChevronIcon = () => {
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={21}
        height={20}
        fill="none"
        className="betterdocs-faq-iconminus"
        style={{
            display: "none",
        }}
    >
        <path
            stroke="#707E95"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m15.5 12.5-5-5-5 5"
        />
    </svg>;
};
