import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginVue from 'eslint-plugin-vue';
import eslintPrettierConfig from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  { files: ['**/*.{js,mjs,cjs,ts,vue,html}'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  { languageOptions: { globals: globals.browser } },
  {
    files: ['**/*.vue', '*.vue'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.vue'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        parser: tseslint.parser,
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    rules: {
      'prettier/prettier': [
        'error',
        {},
        { usePrettierrc: true, fileInfoOptions: { withNodeModules: true } },
      ],
      /**
       * the following rules are all temporarily disabled
       */
      'no-empty': ['off'],
      'no-debugger': ['off'],
      'no-unsafe-optional-chaining': ['off'],

      '@typescript-eslint/ban-ts-comment': ['off'],
      '@typescript-eslint/no-unused-vars': ['off'],
      '@typescript-eslint/no-explicit-any': ['off'],
      '@typescript-eslint/no-empty-object-type': ['off'],
      '@typescript-eslint/no-unused-expressions': ['off'],
      '@typescript-eslint/no-unsafe-function-type': ['off'],

      'vue/valid-v-for': ['off'],
      'vue/valid-v-else': ['off'],
      'vue/no-dupe-keys': ['off'],
      'vue/no-unused-vars': ['off'],
      'vue/no-explicit-any': ['off'],
      'vue/no-parsing-error': ['off'],
      'vue/require-v-for-key': ['off'],
      'vue/require-prop-types': ['off'],
      'vue/no-use-v-if-with-v-for': ['off'],
      'vue/no-empty-component-block': ['off'],
      'vue/multi-word-component-names': ['off'],
      'vue/return-in-computed-property': ['off'],
      'vue/no-unsafe-optional-chaining': ['off'],
      'vue/no-async-in-computed-properties': ['off'],
    },
  },
  eslintPrettierConfig,
  eslintPluginPrettier,
);
