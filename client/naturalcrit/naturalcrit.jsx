const React = require('react');
const { useState, useEffect } = require('react');

const { Routes, Route, Navigate, BrowserRouter } = require('react-router-dom');
const { StaticRouter } = require('react-router-dom/server');

// Pages
const HomePage = require('./homePage/homePage.jsx');
const AccountPage = require('./accountPage/accountPage.jsx');
const LoginPage = require('./loginPage/loginPage.jsx');
const SuccessPage = require('./successPage/successPage.jsx');
const GoogleRedirect = require('./googleRedirect/googleRedirect.jsx');

const Naturalcrit = ({ user, url, tools, environment, domain }) => {
	const [theme, setTheme] = useState('light');

	useEffect(() => {
		global.domain = domain;
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme) setTheme(storedTheme);
	}, [domain]);

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', newTheme);
		setTheme(newTheme);
	};

	// Choose Router: StaticRouter for SSR, BrowserRouter for client
	const Router = typeof window === 'undefined' ? StaticRouter : BrowserRouter;
	const routerProps = typeof window === 'undefined' ? { location: url, context: {} } : {};

	return (
		<div className={`naturalcrit theme-${theme}`}>
			<Router {...routerProps}>
				<Routes>
					<Route
						path="/account"
						element={user?.username ? <AccountPage user={user} /> : <Navigate to="/login" replace />}
					/>
					<Route path="/login" element={<LoginPage user={user} />} />
					<Route path="/success" element={<SuccessPage user={user} />} />
					<Route path="/auth/google/redirect" element={<GoogleRedirect user={user} />} />
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

module.exports = Naturalcrit;
