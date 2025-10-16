const js = require("@eslint/js");
const typescript = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const reactHooks = require("eslint-plugin-react-hooks");
const reactRefresh = require("eslint-plugin-react-refresh");
const prettier = require("eslint-config-prettier");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        React: "readonly",
        global: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        // Test globals
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        vi: "readonly",
        act: "readonly",
        renderHook: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // Core ESLint rules
      "no-console": "warn",
      "no-debugger": "error",
      "no-unused-vars": "off", // Use TypeScript version instead
      "prefer-const": "error",
      "no-var": "error",

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "off", // Disable until strictNullChecks is enabled
      "@typescript-eslint/prefer-optional-chain": "off", // Disable until strictNullChecks is enabled
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/consistent-type-imports": "off", // Disable until strictNullChecks is enabled
      "@typescript-eslint/consistent-type-exports": "off", // Disable until strictNullChecks is enabled
      "@typescript-eslint/no-import-type-side-effects": "off", // Disable until strictNullChecks is enabled

      // React rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Code quality rules
      "no-duplicate-imports": "error",
      "no-useless-return": "error",
      "prefer-template": "error",
      "object-shorthand": "error",
      "prefer-destructuring": [
        "error",
        {
          array: true,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
    },
  },
  {
    files: ["**/*.test.{js,ts,tsx}", "**/*.spec.{js,ts,tsx}", "**/test/**/*"],
    rules: {
      // Relax some rules for test files
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  },
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "*.min.js",
      "eslint.config.js", // Ignore the config file itself
    ],
  },
  prettier,
];
