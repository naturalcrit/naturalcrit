import React from 'react';

import NaturalCritIcon from '../../assets/svg/naturalcritLogo.jsx';
import HomebrewIcon from '../../assets/svg/homebrew_svg.jsx';
import TPKIcon from '../../assets/svg/tpk_svg.jsx';
import BadgeIcon from '../../assets/svg/badge_svg.jsx';
import TownGenIcon from '../../assets/svg/townGeneratorLogo.jsx';

import './homePage.less';

const defaultTools = [
	{
		id   : 'homebrew',
		path : 'https://homebrewery.naturalcrit.com',
		name : 'The Homebrewery',
		icon : <HomebrewIcon />,
		desc : 'Make authentic-looking D&D homebrews using Markdown',
		show : true,
		beta : false,
	},
	{
		id   : 'badges',
		path : '/badges',
		name : 'Achievement Badges',
		icon : <BadgeIcon />,
		desc : 'Create simple badges to award your players',
		show : true,
		beta : false,
	},
	{
		id   : 'tpk',
		path : 'http://tpk.naturalcrit.com',
		name : 'Total Player Knoller',
		icon : <TPKIcon />,
		desc : 'Effortless custom character sheets',
		show : false,
		beta : true,
	},
	{
		id : 'APItoHB',
		path : 'https://g-ambatte.github.io/APItoHB/',
		name: 'API to HB',
		icon : <TPKIcon />,
		desc : "Get D&D's SRD in homebrewery format!",
		show : false,
		beta : true,
	},
	{
		id   : 'townGenerator',
		path : 'https://5e-cleric.github.io/townGenerator/?',
		name : 'Town Generator',
		icon : <TownGenIcon />,
		desc : 'Generate town maps!',
		show : false,
		beta : true,
	}
];

const HomePage = ({ tools = defaultTools })=>{
	const renderTool = (tool)=>{
		if (!tool.show) return null;

		return (
			<a href={tool.path} className={`tool ${tool.id}${tool.beta ? ' beta' : ''}`} key={tool.id}>
				<div className='content'>
					{tool.icon}
					<h2>{tool.name}</h2>
					<p>{tool.desc}</p>
				</div>
			</a>
		);
	};

	return (
		<div className='homePage'>
			<div className='top'>
				<NaturalCritIcon />
				<p>Top-tier tools for the discerning DM</p>
			</div>
			<div className='tools'>{tools.map(renderTool)}</div>
		</div>
	);
};

export default HomePage;
