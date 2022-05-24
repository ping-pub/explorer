module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    '@vue/airbnb',
    'plugin:vue/recommended', 
    // "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    // "plugin:prettier/recommended",
    // "prettier/@typescript-eslint"
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    semi: ['error', 'never'],
    'max-len': 'off',
    'linebreak-style': 'off',
    // camelcase: ['error', { properties: 'never', ignoreDestructuring: true, ignoreImports: true }],
    'arrow-parens': ['error', 'as-needed'],
    'vue/multiline-html-element-content-newline': 'off',
    'vue/multi-word-component-names': 0,
    'vue/no-mutating-props': 0,
    'vue/v-slot-style': 0,
    'camelcase': 0,
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/mouse-events-have-key-events': 'off',
    'vuejs-accessibility/anchor-has-content': 'off',
    'no-unsafe-optional-chaining': 1,
    'vuejs-accessibility/label-has-for': 1,
    'import/extensions': 'off'
  },
}
