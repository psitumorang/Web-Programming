module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb-base',
  ],
  parserOptions: {
    emcaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'linebreak-style': 0,
    'no-await-in-loop': 0,
    'react/jsx-filename-extension': 0,
    'react/prop-types': 0,
  },
};
