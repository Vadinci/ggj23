import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * @type {import('vite').UserConfig}
 */
const config = {
	publicPath: "./",
	base: "./",
	build: {
		minify: true,
		assetsDir: "./app",
	},
	plugins: [tsconfigPaths()]
}

export default config;
