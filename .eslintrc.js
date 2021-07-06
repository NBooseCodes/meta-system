module.exports = {
  parser: "@typescript-eslint/parser",

  plugins: [
    "@typescript-eslint",
    "eslint-plugin-import"
  ],
  env: {
    es6: true,
    node: true
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    project: [
      "./tsconfig.json",
      "./test/tsconfig.json"
    ]
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript"
  ],
  rules: { //individual rule config for typescript
    "@typescript-eslint/type-annotation-spacing": ["error", {"before": true} ],
    "@typescript-eslint/indent": [ "error", 2],
    "@typescript-eslint/no-parameter-properties": ["off"],
    "@typescript-eslint/no-use-before-define": ["off"],
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/explicit-function-return-type": ["error"],
    "@typescript-eslint/no-floating-promises" : "error",
    "@typescript-eslint/no-misused-promises" : [ "error", { checkConditionals: true, checkVoidReturn: true } ],
    "no-trailing-spaces": ["warn"],
    "max-len": ["warn" , { "code" : 120}],
    "no-warning-comments": ["warn", { terms: ["TODO", "FIX"], location: "start"}],
    "max-depth": ["error", {"max" : 4 }],
    "semi": ["error", "always"],
    "space-before-blocks": ["warn", "always"],
    "space-before-function-paren": ["warn", "always"],
    "space-in-parens": ["error", "never"],
    "max-classes-per-file": ["error", 1],
    "no-param-reassign": ["error"],
    "no-return-assign": ["error"],
    "no-return-await": ["error"],
    "no-self-compare": ["error"],
    "no-shadow": ["error"],
    "comma-dangle": ["warn", "always-multiline"],
    "eol-last": ["error", "always"],
    "max-params": ["error", 3],
    "max-lines-per-function": ["warn", { max: 15, skipComments: true, skipBlankLines: true }],
    "object-curly-spacing": ["warn", "always"],
    "space-before-function-paren": ["warn", "always"],
    "quotes": ["warn", "double"],
    "lines-between-class-members": ["warn", "always", {"exceptAfterSingleLine": true}],
    "curly": ["error", "multi-line"]
  },
  "overrides": [
    {
        "files": ["*.spec.ts"],
        "rules": {
          "max-lines-per-function": "off",
        }
    }
  ]
}
