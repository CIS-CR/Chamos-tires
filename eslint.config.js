import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**', '.astro/**'],
  },
  {
    files: ['astro.config.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
      },
    },
  },
];
