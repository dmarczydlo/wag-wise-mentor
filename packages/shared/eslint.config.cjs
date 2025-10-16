const js = require("@eslint/js");
const typescript = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const prettier = require("eslint-config-prettier");

module.exports = [
  js.configs.recommended,
  {
    files: ["src/**/*.{js,ts}"],
    ignores: [
      "src/**/*.test.{js,ts}",
      "src/**/*.spec.{js,ts}",
      "src/__tests__/**/*",
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
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
    files: [
      "**/*.test.{js,ts}",
      "**/*.spec.{js,ts}",
      "**/__tests__/**/*",
      "vitest.config.*",
      "*.config.*",
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        // Don't use project for test and config files
      },
      globals: {
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
        // Node.js globals
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
    rules: {
      // Relax some rules for test files
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "no-unused-vars": "off", // Use TypeScript version
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "*.min.js",
      "eslint.config.js", // Ignore the config file itself
      "vitest.config.*",
      "*.config.*",
      "*.config.*.map",
    ],
  },
  prettier,
];
