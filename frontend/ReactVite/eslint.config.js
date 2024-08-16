export default [
  {
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:prettier/recommended',
    ],
    plugins: ['react'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      indent: 'off',
      'linebreak-style': 'off',
    },
  },
];
