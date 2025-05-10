module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true, //  Permite globals como describe, it, expect etc.
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:security/recommended',
  ],
  plugins: ['prettier', 'security'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
