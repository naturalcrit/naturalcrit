import './badges.less';
import React, { useState, useEffect } from 'react';

import NaturalCritIcon from '../assets/svg/naturalcritLogo.jsx';
import BadgeProvider from './badgeContext.jsx';
import BadgeRender from './badgeRender/badgeRender.jsx';
import Controls from './controls/controls.jsx';

const Badges = ()=>{
	const [theme, setTheme] = useState('light');

	useEffect(()=>{
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme) setTheme(storedTheme);
	}, []);

	return (
		<div className={`badges theme-${theme}`}>
			<NaturalCritIcon />

			<h1>D&D Achievement Badges</h1>
			<p>Want to give your players a little something extra? Create a custom achievement badge just for them!</p>

			<div className='content'>
				<BadgeProvider>
					<Controls />
					<BadgeRender />
				</BadgeProvider>
			</div>

			<p className='credit'>
				Icons by <a href='https://www.instagram.com/anaislalovi/'>Anaislalovi</a> for{' '}
				<a href='https://www.elderberry-inn.com/icons'>Elderberry Inn.</a>
			</p>
		</div>
	);
};

export default Badges;
