'use strict'

const neostandard = require('neostandard')
const { mocha } = require('globals')
const stylistic = neostandard.plugins['@stylistic']
const depend = require('eslint-plugin-depend')
const json = require('eslint-plugin-json')

module.exports = neostandard({}).concat([
  {
    name: 'prettier-overrides',
    plugins: { '@stylistic': stylistic },
    rules: {
      '@stylistic/space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }
      ]
    }
  },
  {
    name: 'mocha-globals',
    files: ['test/{*,**/*}.test.js'],
    languageOptions: {
      globals: {
        ...mocha
      }
    }
  },
  depend.configs['flat/recommended'],
  {
    files: ['**/*.json'],
    ...json.configs['recommended']
  }
])
