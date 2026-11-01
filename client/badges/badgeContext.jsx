import React, { createContext, useState, useMemo } from 'react';

const BadgeContext = createContext(null);

const BadgeProvider = ({ children }) => {
	// Badge settings
	const [badgeHeight, setBadgeHeight] = useState(330);
	const [badgeWidth, setBadgeWidth] = useState(300);
	const [color, setColor] = useState('#2c3e50');
	

	// Text settings
	const [title, setTitle] = useState('');
	const [titleColor, setTitleColor] = useState('#ffffff');
	const [titleFontFamily, setTitleFontFamily] = useState('Calluna');

	console.log(titleColor);

	const [text, setText] = useState('');
	const [textColor, setTextColor] = useState('#000');
	const [textFontSize, setTextFontSize] = useState(18);
	const [textFontFamily, setTextFontFamily] = useState('Calluna');

	// Icon settings
	const [icon, setIcon] = useState(1);
	const [rawSVG, setRawSVG] = useState('');
	const [iconWidth, setIconWidth] = useState(150);
	const [iconPositionX, setIconPositionX] = useState(0);
	const [iconPositionY, setIconPositionY] = useState(0);

	// Grouped settings
	const badgeSettings = { badgeHeight, badgeWidth, color };
	const textSettings = { title, titleColor, titleFontFamily, text, textColor, textFontSize, textFontFamily };
	const iconSettings = { icon, rawSVG, iconWidth, iconPositionX, iconPositionY };

	const value = {
		badgeSettings,
		textSettings,
		iconSettings,
		setBadgeHeight,
		setBadgeWidth,
		setColor,
		setTitle,
		setTitleColor,
		setTitleFontFamily,
		setText,
		setTextColor,
		setTextFontSize,
		setTextFontFamily,
		setIcon,
		setRawSVG,
		setIconWidth,
		setIconPositionX,
		setIconPositionY,
	};

	return <BadgeContext.Provider value={value}>{children}</BadgeContext.Provider>;
};

export { BadgeContext };
export default BadgeProvider;
