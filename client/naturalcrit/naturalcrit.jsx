const React = require('react');
const _     = require('lodash');
const cx    = require('classnames');

const CreateRouter = require('pico-router').createRouter;

//Pages
const HomePage = require('./homePage/homePage.jsx');
const SignupPage = require('./signupPage/signupPage.jsx');
const LoginPage = require('./loginPage/loginPage.jsx');
const SuccessPage = require('./successPage/successPage.jsx');
const GoogleRedirect = require('./googleRedirect/googleRedirect.jsx');

let Router;
const Naturalcrit = React.createClass({
	getDefaultProps: function() {
		return {
			user : null,
			url : '',
			domain : '',
			authToken : ''
		};
	},

	componentWillMount: function() {
		global.domain = this.props.domain;

		Router = CreateRouter({
			'/login' : (args, query) => {
				return <LoginPage
					redirect={query.redirect}
					user={this.props.user} />
			},
			'/success' : (args, query) => {
				return <SuccessPage
					user={this.props.user} />
			},
			'/auth/google/redirect' : (args, query) => {
				return <GoogleRedirect
					user={this.props.user} />
			},
			'*' : () => {
				return <HomePage 
					configTools={this.props.tools} />
			}
		});
	},

	render : function(){
		return <div className='naturalcrit'>
			<Router initialUrl={this.props.url}/>
		</div>
	}
});

module.exports = Naturalcrit;
