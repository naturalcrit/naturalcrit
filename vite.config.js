import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	root: path.resolve(__dirname, 'client'),
	plugins: [react()],
	server: {
		port: 8010,
	},
	preview: {
		host: '0.0.0.0',
		port: process.env.PORT || 4173,
		allowedHosts: true,
	},
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
				additionalData: `@import "./client/styles/core.less";`,
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
