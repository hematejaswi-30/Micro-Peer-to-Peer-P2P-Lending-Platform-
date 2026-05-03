module.exports = {
  env: { node: true, es2020: true, jest: true },
  extends: 'eslint:recommended',
  parserOptions: { ecmaVersion: 'latest' },
  rules: {
    'no-unused-vars': 'warn'
  },
}
