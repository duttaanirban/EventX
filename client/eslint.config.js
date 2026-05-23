import js from '@eslint/js';
import hooks from 'eslint-plugin-react-hooks';
import refresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettier,
  {
    ignores: ['dist'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        document: 'readonly',
        localStorage: 'readonly',
        window: 'readonly',
        HTMLCanvasElement: 'readonly',
        describe: 'readonly',
        expect: 'readonly',
        it: 'readonly'
      }
    },
    plugins: {
      'react-hooks': hooks,
      'react-refresh': refresh
    },
    rules: {
      ...hooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }]
    }
  }
];
