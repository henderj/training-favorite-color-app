module.exports = {
  extends: 'standard-with-typescript',
  rules: {
    'no-console': 'warn'
  },
  parserOptions: {
    project: './tsconfig.eslint.json'
  },
  ignorePatterns: ['jest.config.ts', 'dist', 'node_modules']
}
