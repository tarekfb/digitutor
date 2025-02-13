module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:svelte/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", 'square-svelte-store'],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    extraFileExtensions: [".svelte"],
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: {
          // Specify a parser for each lang.
          ts: "@typescript-eslint/parser",
          js: "espree",
          typescript: "@typescript-eslint/parser",
        },
      },
    },
    {
      "files": [
        "src/lib/components/ui/**/*.js",
        "src/lib/components/ui/**/*.ts",
        "src/lib/components/ui/**/*.svelte",
        "src/lib/components/ui/**/*.tsx"
      ], "rules": {
        "no-unused-vars": "off"
      }
    },
  ],
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    // no-undef has been turned off because of this:
    // basically, it causes issues and TS does those checks so it's redundant
    // https://typescript-eslint.io/linting/troubleshooting#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
    "no-undef": "off",
    'square-svelte-store/use-square-svelte-stores': 'error',
    "@typescript-eslint/explicit-function-return-type": "off",
    "comma-dangle": "off",
    // Allow unused variables starting with exactly one underscore.
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_[^_].*$|^_$",
        "varsIgnorePattern": "^_[^_].*$|^_$",
        "caughtErrorsIgnorePattern": "^_[^_].*$|^_$"
      }
    ]
  },
};
