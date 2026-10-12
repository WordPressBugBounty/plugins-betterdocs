import React from 'react';

const ClearIcon = (props) => (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <mask
      id="mask0_8026_2609"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="25"
      height="24"
    >
      <rect x="0.5" width="24" height="24" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_8026_2609)">
      <path
        d="M6.9 19L5.5 17.6L11.1 12L5.5 6.4L6.9 5L12.5 10.6L18.1 5L19.5 6.4L13.9 12L19.5 17.6L18.1 19L12.5 13.4L6.9 19Z"
        fill="#667085"
      />
    </g>
  </svg>
);

export default ClearIcon;
