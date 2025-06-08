module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/consistent-type-imports': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-undef': 'off',
  },
  settings: {
    react: { version: 'detect' },
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/'],
};