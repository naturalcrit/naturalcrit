
const AccountActions = {
	async login(user, pass) {
		try {
			const res = await fetch('/login', {
				method  : 'POST',
				headers : { 'Content-Type': 'application/json' },
				body    : JSON.stringify({ user, pass })
			});

			if (!res.ok) {
				const body = await res.json();
				throw body;
			}

			const body = await res.json();
			AccountActions.createSession(body);
			return body;
		} catch (err) {
			throw err;
		}
	},


	async signup(user, pass) {
		try {
			const res = await fetch('/signup', {
				method  : 'POST',
				headers : { 'Content-Type': 'application/json' },
				body    : JSON.stringify({ user, pass })
			});

			if (!res.ok) {
				const body = await res.json();
				throw body;
			}

			const body = await res.json();
			AccountActions.createSession(body);
			return body;
		} catch (err) {
			throw err;
		}
	},

	async linkGoogle(username, pass, user) {
		try {
			const res = await fetch('/link', {
				method  : 'POST',
				headers : { 'Content-Type': 'application/json' },
				body    : JSON.stringify({ username, pass, user })
			});

			if (!res.ok) {
				const body = await res.json();
				throw body;
			}

			const body = await res.json();
			AccountActions.createSession(body);
			return body;
		} catch (err) {
			throw err;
		}
	},
	validateUsername(username) {
		const regex = /^(?!.*@).{3,}$/;
		return regex.test(username);
	},

 	async checkUsername(username) {
		try {
			const res = await fetch(`/user_exists/${username}`);

			if (!res.ok) {
				const body = await res.json();
				throw body;
			}

			return res.json();
		} catch (err) {
			throw err;
		}
	},

	async rename(username, newUsername, password) {
		console.log('attempting rename');

		try {
			await AccountActions.login(username, password);

			const res = await fetch('/rename', {
				method  : 'PUT',
				headers : { 'Content-Type': 'application/json' },
				body    : JSON.stringify({ username, newUsername })
			});

			if (!res.ok) throw await res.text();

			console.log('correctly renamed, now relogging');

			AccountActions.removeSession();

			await AccountActions.login(newUsername, password);

			setTimeout(()=>{
				window.location.reload();
			}, 500);

			const remoteRes = await fetch(
				'https://homebrewery.naturalcrit.com/api/user/rename',
				{
					method      : 'PUT',
					credentials : 'include',
					headers     : { 'Content-Type': 'application/json' },
					body        : JSON.stringify({ username, newUsername })
				}
			);

			if (!remoteRes.ok) throw await remoteRes.text();

			return remoteRes.json();
		} catch (err) {
			return Promise.reject(err);
		}
	},

	createSession(token) {
		const domain = window.domain === '.local.naturalcrit.com' ? 'localhost' : window.domain;
		document.cookie = `nc_session=${token}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax;domain=${domain}`;
	},

	removeSession() {
		const domain = window.domain === '.local.naturalcrit.com' ? 'localhost' : window.domain;
		document.cookie = `nc_session=; expires=Thu, 01 Jan 1970 00:00:01 GMT; samesite=lax; domain=${domain}`;
	},
};

export default AccountActions;
