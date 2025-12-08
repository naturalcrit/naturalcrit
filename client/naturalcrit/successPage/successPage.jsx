import React, { useEffect } from 'react';

import NaturalCritIcon from '../../assets/svg/naturalcritLogo';

const RedirectLocation = 'NC-REDIRECT-URL';

const SuccessPage = () => {

	useEffect(() => {
		const redirectURL = window.sessionStorage.getItem(RedirectLocation) || '/';
		window.sessionStorage.removeItem(RedirectLocation);

		const timer = setTimeout(() => {
			window.location = redirectURL;
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className='loginPage'>
			<NaturalCritIcon />

			<div className='content'>
				<p>Successfully logged in!</p>
				<br />
				<br />
				<p>Redirecting...</p>
			</div>
		</div>
	);
};

export default SuccessPage;
