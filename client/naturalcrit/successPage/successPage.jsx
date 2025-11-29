import React from 'react';

import createReactClass from 'create-react-class';

import NaturalCritIcon from '../../assets/svg/naturalcritLogo';

const RedirectLocation = 'NC-REDIRECT-URL';

const SuccessPage = createReactClass({
	getDefaultProps : function () {
		return {
			redirect : '',
			user     : null,
		};
	},
	getInitialState : function () {
		return {
			view    : 'login', //or 'signup'
			visible : false,

			username : '',
			password : '',

			processing       : false,
			checkingUsername : false,
			redirecting      : false,

			usernameExists : false,

			errors  : null,
			success : false,
		};
	},
	componentDidMount : function () {
		const redirectURL = window.sessionStorage.getItem(RedirectLocation) || '/';
		window.sessionStorage.removeItem(RedirectLocation);
		setTimeout(function () {
			window.location = redirectURL;
		}, 1500);
	},
	render : function () {
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
	},
});

export default SuccessPage;
