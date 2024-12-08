const request = require('superagent');

const AccountActions = {
	login: (user, pass) => {
		return new Promise((resolve, reject) => {
			request
				.post('/login')
				.send({ user, pass })
				.end((err, res) => {
					if (err) return reject(res.body);
					AccountActions.createSession(res.body);
					return resolve(res.body);
				});
		});
	},

	signup: (user, pass) => {
		return new Promise((resolve, reject) => {
			request
				.post('/signup')
				.send({ user, pass })
				.end((err, res) => {
					if (err) return reject(res.body);
					AccountActions.createSession(res.body);
					return resolve(res.body);
				});
		});
	},

	linkGoogle: (username, pass, user) => {
		return new Promise((resolve, reject) => {
			request
				.post('/link')
				.send({ username, pass, user })
				.end((err, res) => {
					if (err) return reject(res.body);
					AccountActions.createSession(res.body);
					return resolve(res.body);
				});
		});
	},

	checkUsername: (username) => {
		return new Promise((resolve, reject) => {
			request
				.get(`/user_exists/${username}`)
				.send()
				.end((err, res) => {
					if (err) return reject(res.body);
					return resolve(res.body);
				});
		});
	},

	rename: (username, newUsername) => {
		//.put(`http://localhost:8000/api/user/rename`) for local purposes

		return new Promise((resolve, reject) => {
			request
				.put('/rename')
				.send({ username, newUsername })
				.end((err, res) => {
					if (err) return reject(err);
					request
						.put(`https://homebrewery.naturalcrit.com/api/user/rename`)
						.set('Homebrewery-Version', '3.16.1')
						.send({ username, newUsername })
						.end((err, res) => {
							if (err) return reject(err);
							return resolve(res.body);
						});
				});
		});
	},

	createSession: (token) => {
		//if working on local or a deployment, remove the domain attribute
		document.cookie = `nc_session=${token}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax;`;
	},

	removeSession: () => {
		//if working on local or a deployment, remove the domain attribute
		document.cookie = `nc_session=; expires=Thu; 01 Jan 1970 00:00:01 GMT; samesite=lax;`;
	},
};

module.exports = AccountActions;
