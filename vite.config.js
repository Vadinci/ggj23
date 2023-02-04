import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * @type {import('vite').UserConfig}
 */
const config = {
	build: {
		assetsDir: "app",
		rollupOptions: {
			output: {
				manualChunks: (id) => 
				{
					if (id.includes('pixi')) 
					{
						return 'pixi';
					}
					return 'vendors';
				}
			}
		}
	},
	plugins: [tsconfigPaths()]
}

export default config;
