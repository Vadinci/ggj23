import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * @type {import('vite').UserConfig}
 */
const config = {
	build: {
		assetsDir: "app"
	},
	plugins: [tsconfigPaths()]
}

export default config;