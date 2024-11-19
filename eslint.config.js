import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{ ignores: ["dist"] },
	{
		extends: [js.configs.recommended, ...tseslint.configs.strictTypeChecked],
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				project: ["./tsconfig.node.json", "./tsconfig.app.json"],
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"@typescript-eslint/no-confusing-void-expression": ["error", { ignoreArrowShorthand: true }],
			"@typescript-eslint/restrict-template-expressions": [
				"error",
				{
					allow: [
						{
							name: ["FeatureChange"],
							from: "file",
							path: "src/pheatures/FeatureChange.ts",
						},
					],
				},
			],
			"@typescript-eslint/unbound-method": ["error", { ignoreStatic: true }],
			"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
		},
	}
);
