import jwt from 'jwt-simple';

import nconf from 'nconf';

const config = nconf
  .argv()
  .env({ lowerCase: true }) // Load environment variables
  .file('environment', { file: `config/${process.env.NODE_ENV}.json` })
  .file('defaults', { file: 'config/default.json' });

const generateAccessToken = (req, res)=>{
	const payload = req.user.toJSON();

	payload.issued = (new Date());
	payload.issuer = config.get('authentication_token_issuer');
	payload.audience = config.get('authentication_token_audience');

	delete payload.password;
	delete payload._id;

	console.log('THE PAYLOAD');
	console.log(payload);

	const secret = config.get('authentication_token_secret');
	console.log('ENCODING WITH SECRET:');
	console.log(secret);

	const token = jwt.encode(payload, secret);

	return token;
};

export default {
	generateAccessToken : generateAccessToken
};
