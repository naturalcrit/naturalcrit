import './badges.less';
import React, { useState, useEffect } from 'react';

import BadgeRender from './badgeRender/badgeRender.jsx';
import Controls from './controls/controls.jsx';
import NaturalCritIcon from '../assets/svg/naturalcritLogo.jsx';

const Badges = () => {
	const [title, setTitle] = useState('');
	const [text, setText] = useState('');
	const [color, setColor] = useState('#2c3e50');
	const [icon, setIcon] = useState(42);
	const [rawSVG, setRawSVG] = useState('');
	const [theme, setTheme] = useState('light');

	const state = { title, text, color, icon, theme };

	useEffect(() => {
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme) setTheme(storedTheme);
	}, []);

	const handleChange = (newState) => {
		if (newState.title !== undefined) setTitle(newState.title);
		if (newState.text !== undefined) setText(newState.text);
		if (newState.color !== undefined) setColor(newState.color);
		if (newState.icon !== undefined) setIcon(newState.icon);
		if (newState.rawSVG !== undefined) setRawSVG(newState.rawSVG);
	};

	return (
		<div className={`badges theme-${theme}`}>
			<NaturalCritIcon />

			<h1>D&D Achievement Badges</h1>

			<p>Want to give your players a little something extra? Create a custom achievement badge just for them!</p>

			<div className='content'>
				<Controls data={state} onChange={handleChange} />

				<BadgeRender title={title} text={text} icon={icon} color={color} rawSVG={rawSVG} />
			</div>

			<p className='credit'>
				Inspired by <br />
				Howlett Studios's D&D badges
			</p>
		</div>
	);
};

export default Badges;
