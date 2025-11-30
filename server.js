'use strict';

import path from 'path';
import fs from 'fs';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import jwt from 'jwt-simple';
import mongoose from 'mongoose';
import config from 'nconf';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';

import './server/passport_setup.js';

import authRoutes from './server/auth_routes.js';
import accountApiRouter from './server/account.api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config
	.argv()
	.env({ lowerCase: true })
	.file('environment', { file: `config/${process.env.NODE_ENV}.json` })
	.file('defaults', { file: 'config/default.json' });

mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/naturalcrit');
mongoose.connection.on('error', ()=>{ console.log('>>>ERROR: Run Mongodb.exe ya goof!'); });

async function start() {
	const app = express();
	const isProd = process.env.NODE_ENV === 'production';

	app.use(bodyParser.json());
	app.use(cookieParser());

	app.use((req, res, next)=>{
		if (req.cookies && req.cookies.nc_session) {
			try {
				req.user = jwt.decode(req.cookies.nc_session, config.get('authentication_token_secret'));
			} catch (e) {
				console.log('Couldn\'t decode user from cookie.');
				console.error(e);
			}
		}
		next();
	});

	app.use(accountApiRouter);

	app.use('/auth', authRoutes);

	app.all('/homebrew/*homebrewPath', (req, res) => {
		return res.redirect(302, `https://homebrewery.naturalcrit.com${req.url.replace('/homebrew', '')}`);
	});

	//========-- In Dev environment, use Vite's dev server for speed --========//
	if (!isProd) {
		const vite = await createServer({
			root    : path.join(__dirname, 'client'),
			server  : { middlewareMode: true },
			appType : 'custom',	// This disables Vite's default HTML serving so our `*` handler works
		});

		app.use(vite.middlewares);	// Let Vite handle static assets + dev transforms
		app.get('/*allRoutes', async (req, res, next) => {
			const url = req.originalUrl;
			try {
				const props = {
					user        : req.user || null,
					domain      : config.get('domain'),
					environment : [process.env.NODE_ENV, process.env.HEROKU_PR_NUMBER],
				};

				let template = fs.readFileSync(path.join(__dirname, 'client/index.html'), 'utf-8');
				template = await vite.transformIndexHtml(url, template);
				template = template.replace(
					'</body>',
					`<script>window.__INITIAL_PROPS__=${JSON.stringify(props)};</script></body>`
				);

				res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
			} catch (e) {
				vite.ssrFixStacktrace(e);
				next(e);
			}
		});

	}
	//========-- In Production environment, use Express to serve from build path --========//
	else {
		const buildPath = path.join(__dirname, 'build');
		const indexHtml = fs.readFileSync(path.join(buildPath, 'index.html'), 'utf-8');

		app.use(express.static(buildPath));
		app.get('/*anyPath', (req, res) => {
			const props = {
				user        : req.user || null,
				domain      : config.get('domain'),
				environment : [process.env.NODE_ENV, process.env.HEROKU_PR_NUMBER],
			};

			const prodHtml = indexHtml.replace(
				'</body>',
				`<script>window.__INITIAL_PROPS__ = ${JSON.stringify(props)};</script></body>`
			);

			res.status(200).set({ 'Content-Type': 'text/html' }).send(prodHtml);
		});
	}

	const port = process.env.PORT || config.get('web_port') || 8010;
	app.listen(port, ()=>{
		console.log(`Server started at http://localhost:${port}`);
	});
}

start();
