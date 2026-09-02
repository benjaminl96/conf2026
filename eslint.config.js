import js from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';
import { viteConfigObj } from './vite.config.js';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'app/appserver/static/dist/**'],
  },
  {
    files: ['src/**/*.{js,jsx}', 'vite.config.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': { vite: { viteConfig: viteConfigObj } },
    },
    plugins: {
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...importPlugin.flatConfigs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      'react/prop-types': 'off',
    },
  },
  {
    files: ['src/**/*.test.{js,jsx}', 'src/test/**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.vitest,
    },
  },
  prettierConfig,
];
