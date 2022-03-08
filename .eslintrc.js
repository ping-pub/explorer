module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/recommended", "@vue/airbnb"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    /* eslint quotes: ["off", "double"], curly: 2 */
    quotes: ["off", "single"],
    "no-useless-concat": ["off"],
    "no-unused-vars": "off",
    curly: 2,
    // "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    // "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    semi: ["warn", "never"],
    "max-len": "off",
    camelcase: "off",
    // "linebreak-style": "off",
    // camelcase: [
    //   "error",
    //   { properties: "never", ignoreDestructuring: true, ignoreImports: true },
    // ],
    // "arrow-parens": ["error", "as-needed"],
    // "vue/multiline-html-element-content-newline": "off",
  },
};
