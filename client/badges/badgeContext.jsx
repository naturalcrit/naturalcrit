import React, { createContext, useState, useEffect, useMemo } from 'react';

const BadgeContext = createContext(null);

const BadgeProvider = ({ children }) => {
	const [title, setTitle] = useState('');
	const [text, setText] = useState('');
	const [color, setColor] = useState('#2c3e50');

	const badgeHeight = 414;
	const badgeWidth = 408;

	const titleColor = '#fff';
	const textFontSize = 18;
	const textFontFamily = 'Calluna';
	const textColor = '#000';
	const titleFontFamily = 'Calluna';

	const [icon, setIcon] = useState(1);
	const [rawSVG, setRawSVG] = useState('');
	const iconWidth = 150;
	const iconPositionX = 0;
	const iconPositionY = 0;

	const badgeSettings = { badgeHeight, badgeWidth };
	const textSettings = { title, titleColor, titleFontFamily, text, textColor, textFontSize, textFontFamily };
	const iconSettings = { icon, rawSVG, iconWidth, iconPositionX, iconPositionY };

	const value = useMemo(
		() => ({ color, badgeSettings, textSettings, iconSettings, setTitle, setText, setColor, setIcon, setRawSVG }),
		[title, text, color, icon, rawSVG],
	);

	return <BadgeContext.Provider value={value}>{children}</BadgeContext.Provider>;
};

export { BadgeContext };
export default BadgeProvider;
