import React from 'react';

const decodeEntities = (str) => {
	if (typeof window === 'undefined') return str;
	const txt = document.createElement('textarea');
	txt.innerHTML = str;
	return txt.value;
};

const Title = ({ title, titleTag = 'h2' }) => {
	const decodedTitle = decodeEntities(title);

	return React.createElement(
		titleTag,
		{ className: 'betterdocs-category-title' },
		decodedTitle
	);
};

export default Title;
