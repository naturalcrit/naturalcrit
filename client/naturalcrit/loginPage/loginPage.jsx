import React, { useState, useEffect } from 'react';
import AccountActions from '../account.actions.js';
import AuthForm from './authForm.jsx';
import NaturalCritIcon from '../../assets/svg/naturalcritLogo.jsx';

import './loginPage.less';

const RedirectLocation = 'NC-REDIRECT-URL';

const LoginPage = ({ redirect = '', user = null })=>{
	const [view, setView] = useState('login'); // 'login' or 'signup'
	const [redirecting, setRedirecting] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [errors, setErrors] = useState(null);

	useEffect(()=>{
		if (!redirect) {
			window.sessionStorage.removeItem(RedirectLocation);
		} else {
			window.sessionStorage.setItem(RedirectLocation, redirect);
		}
	}, [redirect]);

	const redirectTo = ()=>{
		if (!redirect) return (window.location = '/');
		setRedirecting(true);
		window.location = redirect;
	};

	const handleLoginSignup = (username, password, action)=>{
		if (action === 'login') {
			return AccountActions.login(username, password)
				.then(()=>{
					setRedirecting(true);
					redirectTo();
				})
				.catch((err)=>{
					console.log(err);
					setErrors(err);
					return Promise.reject(err);
				});
		} else if (action === 'signup') {
			return AccountActions.signup(username, password)
				.then(()=>{
					setRedirecting(true);
					redirectTo();
				})
				.catch((err)=>{
					console.log(err);
					setErrors(err);
					return Promise.reject(err);
				});
		}
	};

	const linkGoogle = ()=>{
		if (user) {
			if (
				!confirm(
					`You are currently logged in as ${user.username}. ` +
						`Do you want to link this user to a Google account? ` +
						`This will allow you to access the Homebrewery with your ` +
						`Google account and back up your files to Google Drive.`
				)
			)
				return;
		}

		setProcessing(true);
		setErrors(null);
		window.location.href = '/auth/google';
	};

	const renderLoggedIn = ()=>{
		if (!user) return null;

		if (!user.googleId) {
			return (
				<small>
					You are logged in as {user.username}.{' '}
					<a href='#' onClick={()=>(window.location = '/logout')}>
						logout.
					</a>
				</small>
			);
		} else {
			return (
				<small>
					You are logged in via Google as {user.username}.{' '}
					<a href='#' onClick={()=>(window.location = '/logout')}>
						logout.
					</a>
				</small>
			);
		}
	};

	return (
		<div className='loginPage'>
			<NaturalCritIcon />
			<div className='content'>
				<div className='switchView'>
					<div className={`login${view === 'login' ? ' selected': ''}`} onClick={()=>setView('login')}>
						<i className='fa fa-sign-in' /> Login
					</div>
					<div className={`signup${view === 'signup' ? ' selected': ''}`} onClick={()=>setView('signup')}>
						<i className='fa fa-user-plus' /> Signup
					</div>
				</div>
				<AuthForm actionType={view} onSubmit={handleLoginSignup} />
				<div className='divider'>⎯⎯ OR ⎯⎯</div>
				<button className='google' onClick={linkGoogle}></button>
			</div>

			<br />
			<br />
			<br />
			<br />
			{renderLoggedIn()}
		</div>
	);
};

export default LoginPage;
