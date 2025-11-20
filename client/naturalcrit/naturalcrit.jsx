const React = require('react');
import createReactClass from 'create-react-class';
const CreateRouter = require('pico-router').createRouter;

// Pages
const HomePage = require('./homePage/homePage.jsx');
const AccountPage = require('./accountPage/accountPage.jsx');
const LoginPage = require('./loginPage/loginPage.jsx');
const SuccessPage = require('./successPage/successPage.jsx');
const GoogleRedirect = require('./googleRedirect/googleRedirect.jsx');

const Naturalcrit = createReactClass({
	getDefaultProps: function () {
		return {
			user: null,
			url: '',
			domain: '',
			authToken: '',
			environment: '',
			tools: null,
		};
	},

	getInitialState: function () {
		// Initialize theme
		return { theme: 'light' };
	},

	// Initialize Router as an instance property so it's available for first render
	initializeRouter: function (props) {
		this.Router = CreateRouter({
			'/account': (args, query) => {
				if (!props.user || !props.user.username) {
					return <LoginPage redirect={props.url} user={props.user} />;
				}
				return <AccountPage user={props.user} />;
			},
			'/login': (args, query) => <LoginPage redirect={query.redirect} user={props.user} />,
			'/success': (args, query) => <SuccessPage user={props.user} />,
			'/auth/google/redirect': (args, query) => <GoogleRedirect user={props.user} />,
			'*': () => <HomePage configTools={props.tools} user={props.user} />,
		});
	},

	// componentDidMount only for side effects
	componentDidMount: function () {
		global.domain = this.props.domain;

		// Restore theme from localStorage
		if (typeof localStorage !== 'undefined') {
			const storedTheme = localStorage.getItem('theme');
			if (storedTheme) this.setState({ theme: storedTheme });
		}
	},

	// Ensure Router is ready in render
	render: function () {
		if (!this.Router) {
			this.initializeRouter(this.props); // initialize on first render
		}

		return (
			<div className={`naturalcrit theme-${this.state.theme}`}>
				<this.Router initialUrl={this.props.url} />
				{this.renderThemePicker()}
				<div className={`accountButton ${this.props.user ? '' : 'login'}`}>{this.renderAccount()}</div>
				{this.renderEnviroment()}
			</div>
		);
	},

	toggleTheme: function () {
		const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('theme', newTheme);
		}
		this.setState({ theme: newTheme });
	},

	renderAccount: function () {
		if (this.props.user && this.props.user.username) {
			return <a href="/account">{this.props.user.username}</a>;
		}
		return <a href="/login">Log in</a>;
	},

	renderEnviroment: function () {
		const env = this.props.environment;
		if (env[0] === 'production' && !env[1]) return null; // Live site
		if (env[0] === 'production' && env[1]) return <div className="environment">PR - {env[1]}</div>;
		return <div className="environment">Local</div>;
	},

	renderThemePicker: function () {
		return (
			<button className="theme" onClick={this.toggleTheme}>
				<i className={`fas ${this.state.theme === 'light' ? 'fa-sun' : 'fa-moon'}`}></i>
			</button>
		);
	},
});

module.exports = Naturalcrit;
