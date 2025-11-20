const React = require('react');

import createReactClass from 'create-react-class';
const CreateRouter = require('pico-router').createRouter;

//Pages
const HomePage = require('./homePage/homePage.jsx');
const AccountPage = require('./accountPage/accountPage.jsx');
const LoginPage = require('./loginPage/loginPage.jsx');
const SuccessPage = require('./successPage/successPage.jsx');
const GoogleRedirect = require('./googleRedirect/googleRedirect.jsx');

let Router;
const Naturalcrit = createReactClass({
	getDefaultProps: function () {
		return {
			user: null,
			url: '',
			domain: '',
			authToken: '',
			environment: '',
		};
	},

	getInitialState: function () {
		return { theme: 'light' };
	},
	
	
	componentWillMount: function () {
		global.domain = this.props.domain;

		Router = CreateRouter({
			'/account': (args, query) => {
				if (!this.props.user || !this.props.user.username) {
					return <LoginPage redirect={this.props.url} user={this.props.user} />;
				}
				return <AccountPage user={this.props.user} />;
			},
			'/login': (args, query) => {
				return <LoginPage redirect={query.redirect} user={this.props.user} />;
			},
			'/success': (args, query) => {
				return <SuccessPage user={this.props.user} />;
			},
			'/auth/google/redirect': (args, query) => {
				return <GoogleRedirect user={this.props.user} />;
			},
			'*': () => {
				return <HomePage configTools={this.props.tools} user={this.props.user} />;
			},
		});
	},

	componentDidMount: function () {
		if (typeof localStorage !== 'undefined') {
			const storedTheme = localStorage.getItem('theme');
			if (storedTheme) {
				this.setState({ theme: storedTheme });
			}
		}
	},

	toggleTheme: function () {
		const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('theme', newTheme);
		}
		this.setState({ theme: newTheme });
	},

	renderAccount: function () {
		let accountLink = '';
		if (this.props.user && this.props.user.username) {
			accountLink = <a href="/account">{this.props.user.username}</a>;
		} else {
			accountLink = <a href="/login">Log in</a>;
		}
		return accountLink;
	},

	renderEnviroment: function () {
		const env = this.props.environment;
		if (env[0] === 'production' && !env[1]) return; // Live site
		if (env[0] === 'production' && env[1]) return <div className="environment">PR - {env[1]}</div>; // PR
		return <div className="environment">Local</div>; // Local
	},

	renderThemePicker: function () {
		return (
			<button className='theme' onClick={this.toggleTheme}>
				<i className={`fas ${this.state.theme === 'light' ? 'fa-sun' : 'fa-moon'}`}></i>
			</button>
		);
	},

	render: function () {
		return (
			<div className={`naturalcrit theme-${this.state.theme}`}>
				<Router initialUrl={this.props.url} />
				{this.renderThemePicker()}
				<div className={`accountButton ${this.props.user ? '' : 'login'}`}>{this.renderAccount()}</div>
				{this.renderEnviroment()}
			</div>
		);
	},
});

module.exports = Naturalcrit;
