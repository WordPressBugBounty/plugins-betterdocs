const CloseIcon = ({onClick}) => {
	return (
		 <svg
			xmlns="http://www.w3.org/2000/svg"
			width={15}
			height={14}
			fill="none"
			onClick={onClick}
		>
			<path
			fill="#475467"
			d="m1.697 14-1.4-1.4 5.6-5.6-5.6-5.6 1.4-1.4 5.6 5.6 5.6-5.6 1.4 1.4-5.6 5.6 5.6 5.6-1.4 1.4-5.6-5.6-5.6 5.6Z"
			/>
		</svg>
	);
};

export default CloseIcon;
