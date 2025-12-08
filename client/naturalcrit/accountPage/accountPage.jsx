import React, { useState } from 'react';

import AccountActions from '../account.actions.js';
import NaturalCritIcon from '../../assets/svg/naturalcritLogo.jsx';
import AuthForm from '../loginPage/authForm.jsx';

import './accountPage.less';

const AccountPage = (props)=>{

	const [showRenameForm, setShowRenameForm] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [errors, setErrors] = useState(null);

	const  handleRename = async (newUsername, password)=>{
		const regex = /^(?!.*@).{3,}$/;

		if (!regex.test(newUsername)) {
			setProcessing(false);
			setErrors({ msg: 'Username must be at least 3 characters long and not include @!?.' });
			throw new Error('Invalid username');
		}
		if (!confirm('Are you sure you want to rename your account?')) throw new Error('User canceled rename');

		setProcessing(true);
		setErrors(null);
		try {
			await AccountActions.rename(props.user.username, newUsername, password);
			setProcessing(false);
			setErrors(null);
			setShowRenameForm(false);
		} catch (err) {
			console.log(err);
			localStorage.setItem('errors', JSON.stringify(err));
			setProcessing(false);
			setErrors(err);
			throw err; // rethrow so AuthForm knows it failed
		}
	};

	return <div className='accountPage'>
		<NaturalCritIcon />
		<div className='details'>
			<h1>Account Page</h1>
			<br />
			<p>
				<b>Username:</b> {props.user.username}
				<br />
			</p>
			<br />
			<button
				className='logout'
				onClick={()=>{
					if (confirm('Are you sure you want to log out?')) {
						AccountActions.removeSession();
						window.location = '/';
					}
				}}>
						Log Out
			</button>
			<button className='rename' onClick={()=>setShowRenameForm(!showRenameForm)}>
				{showRenameForm ? 'Cancel rename' : 'Change my username' }
			</button>
			<br />
			<br />
			{showRenameForm && <AuthForm actionType='rename' onSubmit={handleRename} />}
			<small>Upcoming features will include account deletion.</small>
		</div>
	</div>;

};


export default AccountPage;
