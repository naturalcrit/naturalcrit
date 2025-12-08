import React, { useEffect, useState, useCallback, useRef } from 'react';
import AccountActions from '../account.actions';

import './authForm.less';

const AuthForm = ({
	onSubmit = () => Promise.resolve(),
	user = null,
	actionType = 'login',
}) => {

	const [visible, setVisible] = useState(false);
	const [username, setUsername] = useState(user?.username || '');
	const [password, setPassword] = useState('');
	const [processing, setProcessing] = useState(false);
	const [checkingUsername, setCheckingUsername] = useState(false);
	const [usernameExists, setUsernameExists] = useState(false);
	const [errors, setErrors] = useState(null);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.code === 'Enter') handleSubmit();
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	});

	const debounceRef = useRef(null);

	const checkUsername = useCallback(() => {
		if (!username) return;

		setCheckingUsername(true);

		clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			AccountActions.checkUsername(username)
				.then((doesExist) => {
					setUsernameExists(!!doesExist);
					setCheckingUsername(false);
				});
		}, 1000);
	}, [username]);

	useEffect(() => {
		if (actionType !== 'login') checkUsername();
	}, [username, actionType, checkUsername]);

	const isValid = () => {
		if (processing) return false;
		if (actionType === 'login') return username && password;
		if (actionType === 'signup' || actionType === 'rename')
			return username && password && !usernameExists;

		return false;
	};

	const handleSubmit = () => {
		if (!isValid()) return;

		setProcessing(true);
		setErrors(null);

		onSubmit(username, password, actionType)
			.then(() => {
				setProcessing(false);
				setErrors(null);
			})
			.catch((err) => {
				console.error(err);
				setProcessing(false);
				setErrors(err);
			});
	};

	const renderErrors = () =>
		errors ? <div className='errors'>{errors.msg || 'Something went wrong'}</div> : null;

	const renderUsernameValidation = () => {
		if (actionType === 'login') return null;
		if (!username) return null;

		let icon;
		if (checkingUsername) icon = <i className='fa fa-spinner fa-spin' />;
		else if (usernameExists) icon = <i className='fa fa-times red' />;
		else icon = <i className='fa fa-check green' />;

		return <div className='control'>{icon}</div>;
	};

	const renderButton = () => {
		let className = '';
		let text = '';
		let icon = '';

		if (processing) {
			className = 'processing';
			text = 'processing';
			icon = 'fa-spinner fa-spin';
		} else if (actionType === 'login') {
			className = 'login';
			text = 'login';
			icon = 'fa-sign-in';
		} else if (actionType === 'signup') {
			className = 'signup';
			text = 'signup';
			icon = 'fa-user-plus';
		} else if (actionType === 'rename') {
			className = 'rename';
			text = 'rename';
			icon = 'fa-user-plus';
		}

		return (
			<button className={`action ${className}`} disabled={!isValid()} onClick={handleSubmit}>
				<i className={`fa ${icon}`} />
				{text}
			</button>
		);
	};

	return (
		<div className={`authForm ${actionType}`}>

			<label className='field user'>
				Username
				<input
					type='text'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				{renderUsernameValidation()}
			</label>

			<label className='field password'>
				Password
				<input
					type={visible ? 'text' : 'password'}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<div className='control' onClick={() => setVisible(!visible)}>
					<i className={`fa${visible ? ' fa-eye-slash' : ' fa-eye'}`} />
				</div>
			</label>

			{renderErrors()}
			{renderButton()}
		</div>
	);
};

export default AuthForm;
