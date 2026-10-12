const FolderIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={21}
            height={20}
            fill="none"
        >
            <mask
                id="a"
                width={21}
                height={20}
                x={0}
                y={0}
                maskUnits="userSpaceOnUse"
                style={{
                    maskType: "alpha",
                }}
            >
                <path fill="#C4C4C4" d="M.5 0h20v20H.5z" />
            </mask>
            <g mask="url(#a)">
                <path
                    fill="#C4C4C4"
                    d="M3.833 16.667c-.458 0-.85-.163-1.177-.49a1.605 1.605 0 0 1-.49-1.176V5c0-.459.164-.851.49-1.177.327-.327.72-.49 1.177-.49h4.313a1.646 1.646 0 0 1 1.167.48L10.5 5h6.667c.458 0 .85.163 1.177.49.326.326.49.718.49 1.176v8.334c0 .458-.164.85-.49 1.177-.327.326-.719.49-1.177.49H3.833Z"
                />
            </g>
        </svg>
    );
};

export default FolderIcon;
