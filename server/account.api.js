
import jwt from 'jwt-simple';

import AccountModel from './account.model.js';

import express from 'express';
const router = express.Router();
import nconf from 'nconf';

const config = nconf
  .argv()
  .env({ lowerCase: true }) // Load environment variables
  .file('environment', { file: `config/${process.env.NODE_ENV}.json` })
  .file('defaults', { file: 'config/default.json' });

const Model = AccountModel.model;

router.post('/login', async (req, res) => {
	try {
		const { user, pass } = req.body;
		const token = await Model.login(user, pass);
		res.json(token);
	} catch (err) {
		res.status(err.status || 500).json(err);
	}
});

router.post('/signup', async (req, res) => {
	try {
		const { user, pass } = req.body;
		const token = await Model.signup(user, pass);
		res.json(token);
	} catch (err) {
		res.status(err.status || 500).json(err);
	}
});

router.post('/link', async (req, res) => {
	try {
		const { username, user } = req.body;
		const localUser = await Model.findOne({ username });
		if (!localUser) throw { status: 404, msg: 'User not found' };

		// Add Google details to the user
		localUser.googleId = user.googleId;
		localUser.googleRefreshToken = user.googleRefreshToken;
		localUser.googleAccessToken = user.googleAccessToken;

		await localUser.save();

		console.log('Local user updated with Google Id:', localUser);
		res.json(localUser.getJWT());
	} catch (err) {
		res.status(err.status || 500).json(err);
	}
});

router.get('/user_exists/:username', async (req, res) => {
	try {
		const { username } = req.params;
		if (!username) return res.json(false);

		const user = await Model.getUser(username);
		res.json(!!user);
	} catch (err) {
		console.error('Error:', err);
		res.status(err.status || 500).json(err);
	}
});

router.put('/rename', async (req, res) => {
    try {
        const { username, newUsername } = req.body;

        const user = await Model.getUser(username);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.username = newUsername;
        await user.save();

        res.json(true);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;
