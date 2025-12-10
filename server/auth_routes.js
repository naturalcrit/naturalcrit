
import passport from 'passport';
import './passport_setup.js';
import token from './token.js';
import AccountModel from './account.model.js';

import express from 'express';
const router = express.Router();

// TODO: MERGE from ACCOUNT.API.JS then probably rename ACCOUNT.API.JS

// Helper function to generate a user token
function generateUserToken(req, res) {
	const accessToken = token.generateAccessToken(req, res);
	return accessToken;
}

router.post('/login', async (req, res)=>{
	const { user, pass } = req.body;
	const jwt = await AccountModel.login(user, pass)
		.catch((err)=>res.status(err.status || 500).json(err));
	if (jwt)
		res.json(jwt);
});

router.get('/login', (req, res)=>{
	res.render('login');
});

router.get('/logout', (req, res)=>{
	// Placeholder for logout functionality. Actual session management should be implemented here.
	res.send('Logging out');
});

// Google authentication route
router.get('/google',
	passport.authenticate('google', {
		session    : false, // No session should be maintained on the server.
		scope      : ['profile', 'https://www.googleapis.com/auth/drive.file'], // Request user profile and Google Drive file access.
		accessType : 'offline', // Ensures refresh token is provided.
		prompt     : 'consent', // Forces user to select an account.
	})
);

// Google authentication redirect route
router.get('/google/redirect',
	passport.authenticate('google', { session: false }),
	(req, res, next)=>{
		if (!req.user.username)
			return next();	// Stay on the page if we still need local sign-in

		const jwt = generateUserToken(req, res);
		res.cookie('nc_session', jwt, {
			maxAge   : 1000 * 60 * 60 * 24 * 365, // 1 year
			path     : '/',
			sameSite : 'lax',
			domain   : process.env.NODE_ENV === 'production' ? '.naturalcrit.com' : 'localhost', // Set domain for the cookie.
		});
		
		res.redirect('/success');
	}
);

const authRoutes = router;

export default authRoutes;
