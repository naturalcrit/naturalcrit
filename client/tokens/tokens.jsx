import React, { useRef, useState, useEffect } from 'react';
import './tokens.css';

import NaturalCritIcon from '../assets/svg/naturalcritLogo.jsx';
import TokenCanvasRender from './tokenCanvasRender.jsx';
import TokenProvider from './tokenContext.jsx';
import TokenMenus from './tokenMenus.jsx';

const Tokens = () => {
	const tokensRef = useRef(null);

	return (
		<div className={`tokens`} ref={tokensRef}>
			<NaturalCritIcon />

			<h1>Personalized Tokens for online TTRPG play</h1>
			<p>Want to give your players a little something extra? Create a custom achievement badge just for them!</p>

			<div className='content'>
				<TokenProvider parentRef={tokensRef}>
					<TokenMenus />
					<TokenCanvasRender />
				</TokenProvider>
			</div>

			<p className='credit'>Disclaimer: No ai has been used to create any asset or code of this tool.</p>
		</div>
	);
};

export default Tokens;
