import React, { createContext, useState, useEffect, useMemo } from 'react';

const BadgeContext = createContext(null);

const BadgeProvider = ({ children }) => {
	const [title, setTitle] = useState('');
	const [text, setText] = useState('');
	const [color, setColor] = useState('#2c3e50');
	const [icon, setIcon] = useState(1);
	const [rawSVG, setRawSVG] = useState('');

	const handleChange = (newState) => {
		if (newState.title !== undefined) setTitle(newState.title);
		if (newState.text !== undefined) setText(newState.text);
		if (newState.color !== undefined) setColor(newState.color);
		if (newState.icon !== undefined) setIcon(newState.icon);
		if (newState.rawSVG !== undefined) setRawSVG(newState.rawSVG);
	};

	const value = useMemo(
		() => ({ title, text, color, icon, rawSVG, setTitle, setText, setColor, setIcon, setRawSVG, handleChange }),
		[title, text, color, icon, rawSVG],
	);

	return <BadgeContext.Provider value={value}>{children}</BadgeContext.Provider>;
};

export { BadgeContext };
export default BadgeProvider;
