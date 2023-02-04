module.exports = {
	root: true,
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: { 
		ecmaVersion: "2018",
		sourceType: "module"
	},
	plugins: [
		"@typescript-eslint"
	],
	rules: {
		"curly": ["error"],

		"@typescript-eslint/brace-style": ["error", "allman"],
		"object-curly-spacing": ["error", "always"],
		"@typescript-eslint/member-delimiter-style": ["error"], // defaults to semicolon delimiter
		"indent": ["error", "tab"],
		"no-multi-spaces": ["error"],
		"key-spacing": ["error"],
		"block-spacing": ["error"],
		"@typescript-eslint/type-annotation-spacing": ["error"],
		"no-console": ["error"]
	},
	ignorePatterns: ["src/**/*.test.ts", "src/frontend/generated/*"]
}