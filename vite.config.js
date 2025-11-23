import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	root: path.resolve(__dirname, 'client'),
	plugins: [react()],
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true, // if your LESS uses JS expressions
			},
		},
	},
	resolve: {
		alias: {
			naturalcrit: path.resolve(__dirname, 'client/naturalcrit'),
		},
	},
	build: {
		outDir: path.resolve(__dirname, 'build'),
		emptyOutDir: true,
	},
});

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
