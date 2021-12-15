module.exports = {
  env: {
    browser: true,
    worker: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'react-app',
    'airbnb',
  ],
  plugins: ['jsx-a11y', 'react'],
  ignorePatterns: ['components/TopAppBar/__test__/TopAppBar.test.js'],
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-filename-extension': [1, {
      extensions: ['.js', '.jsx'],
    }],
    'react/function-component-definition': [1, {
      namedComponents: 'arrow-function',
    }],
    'no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
      },
    ],
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
