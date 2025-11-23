import React from 'react';
import { useState, useEffect } from 'react';

import { Routes, Route, Navigate, BrowserRouter, useSearchParams } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import HomePage from './homePage/homePage.jsx';

import LoginPage from './loginPage/loginPage.jsx';

import SuccessPage from './successPage/successPage.jsx';

import GoogleRedirect from './googleRedirect/googleRedirect.jsx';

import Badges from '../badges/badges.jsx';

import './naturalcrit.less';

const Naturalcrit = ({ user, url, tools, environment, domain }) => {
	const [theme, setTheme] = useState('light');

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.domain = domain;
			const storedTheme = localStorage.getItem('theme');
			if (storedTheme) setTheme(storedTheme);
		}
	}, [domain]);

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', newTheme);
		setTheme(newTheme);
	};

	const Router = typeof window === 'undefined' ? StaticRouter : BrowserRouter;
	const routerProps = typeof window === 'undefined' ? { location: url, context: {} } : {};

	const LoginWrapper = ({ user }) => {
		const [searchParams] = useSearchParams();
		const redirect = searchParams.get('redirect') || '/';
		return <LoginPage redirect={redirect} user={user} />;
	};
	console.log(environment);
	return (
		<div className={`naturalcrit theme-${theme}`}>
			<Router {...routerProps}>
				<Routes>
					<Route
						path="/account"
						element={
							user?.username ? (
								<AccountPage user={user} />
							) : (
								<Navigate to="/login?redirect=/account" replace />
							)
						}
					/>
					<Route path="/login" element={<LoginWrapper user={user} />} />
					<Route path="/success" element={<SuccessPage user={user} />} />
					<Route path="/auth/google/redirect" element={<GoogleRedirect user={user} />} />
					<Route path="/badges" element={<Badges />} />
					<Route path="*" element={<HomePage configTools={tools} user={user} />} />
				</Routes>
			</Router>

			<button className="theme" onClick={toggleTheme}>
				<i className={`fas ${theme === 'light' ? 'fa-sun' : 'fa-moon'}`}></i>
			</button>

			<div className={`accountButton ${user ? '' : 'login'}`}>
				{user?.username ? <a href="/account">{user.username}</a> : <a href="/login">Log in</a>}
			</div>

			{environment[0] === 'production' && environment[1] ? (
				<div className="environment">PR - {environment[1]}</div>
			) : environment[0] === 'production' ? null : (
				<div className="environment">Local</div>
			)}
		</div>
	);
};

export default Naturalcrit;
