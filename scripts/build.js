const label = 'build';
console.time(label);

const _     = require('lodash');
const steps = require('./steps');
const Proj  = require('./project.json');

function logStep(name) {
	console.log(`==> Starting: ${name}`);
}

function logDone(name) {
	console.log(`✔ Done: ${name}`);
}

Promise.resolve()

	// CLEAN
	.then(() => {
		logStep('clean()');
		return steps.clean()
			.then(() => logDone('clean()'));
	})

	// LIBS
	.then(() => {
		logStep('libs()');
		return steps.libs(Proj.libs)
			.then(() => logDone('libs()'));
	})

	// APPS (jsx + less)
	.then(() => {
		logStep('apps (jsx + less)');
		return Promise.all(
			_.map(Proj.apps, (path, name) => {
				console.log(`→ Processing app: ${name}`);

				return steps.jsx(name, path, { libs: Proj.libs, shared: Proj.shared })
					.then((deps) => {
						console.log(`   JSX complete: ${name}`);
						return steps.less(name, { shared: Proj.shared }, deps);
					})
					.then(() => {
						console.log(`   LESS complete: ${name}`);
					});
			})
		).then(() => logDone('apps (jsx + less)'));
	})

	// ASSETS
	.then(() => {
		logStep('assets()');
		return steps.assets(Proj.assets, ['./client', './shared'])
			.then(() => logDone('assets()'));
	})

	// END
	.then(() => {
		console.timeEnd(label);
		console.log('✔ BUILD COMPLETE');
	})

	.catch((err) => {
		console.error('❌ BUILD FAILED');
		console.error(err);
	});
