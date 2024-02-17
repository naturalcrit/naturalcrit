const React = require('react');
const _     = require('lodash');
const cx    = require('classnames');

const NaturalCritIcon = require('naturalcrit/svg/naturalcrit.svg.jsx');
const AccountActions = require('../account.actions.js');

const SuccessPage = React.createClass({
	getDefaultProps: function() {
		return {
			redirect : '',
			user : null
		};
	},
	getInitialState: function() {
		return {
			view : 'login', //or 'signup'
			visible : false,

			username : '',
			password : '',

			processing : false,
			checkingUsername : false,
			redirecting : false,

			usernameExists : false,

			errors : null,
			success : false,
		};
	},
	componentDidMount: function() {
		const params = new URLSearchParams(window.location.search);
		const user = params.get('user');
		this.setState({
			username : user
		})
 	},
 	render : function(){
		return <div className='loginPage'>
		 	<div className='logo'>
			 	<NaturalCritIcon />
			 	<span className='name'>
				 	Natural
				 	<span className='crit'>Crit</span>
			 	</span>
		 	</div>

		 	<div className='content'>
		 		<p>Successfully logged in as <strong>{this.state.username}</strong>!</p>
		 		<br />
		 		<br />
		 		<div className="redirection">
					<a href="/" className="redirectLink"> To the homepage <span className="fa fa-home"></span></a>
					<a href={`https://homebrewery.naturalcrit.com/user/${this.state.username}`} className="redirectLink"> To The Homebrewery</a>
				</div>
			</div>
	 	</div>
 	}
});

module.exports = SuccessPage;
