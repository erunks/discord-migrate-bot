import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,ts}"], 
    plugins: { js },
    extends: ["js/recommended"],
    ignores: [
      '.husky',
      'build',
      'configs',
      'coverage',
      'node_modules',
      '*.config.js',
    ],
    languageOptions: { 
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-case-declarations': 'off',
      "no-console": "warn",
      'consistent-return': 'error',
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      }, 
    }
  },
  tseslint.configs.recommended,
]);
