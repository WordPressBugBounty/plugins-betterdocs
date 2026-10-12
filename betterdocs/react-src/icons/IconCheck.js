import React from "react";

const IconCheckbox = ({
    width = 16,
    height = 16,
    fill = "#F5FFF5",
    stroke = "#00B884",
    strokeWidth = 2,
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill={fill} />
        <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke={stroke} />
        <path
            d="M11.7323 5.19922L6.59896 10.3326L4.26562 7.99922"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default IconCheckbox;
