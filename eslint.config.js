'use strict'

const neostandard = require('neostandard')
const { mocha } = require('globals')
const stylistic = neostandard.plugins['@stylistic']
const depend = require('eslint-plugin-depend')
const json = require('eslint-plugin-json')
const noSecrets = require('eslint-plugin-no-secrets')
const sonarjs = require('eslint-plugin-sonarjs')

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
    files: ['test/{*,**/*}.test.js', '_util/_shouldBeSeriousCRUSchema.js', '_util/_shouldBeSeriousSchema.js'],
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
  },
  {
    files: ['**/*.js'],
    plugins: {
      'no-secrets': noSecrets
    },
    rules: {
      'no-secrets/no-secrets': 'error'
    }
  },
  sonarjs.configs.recommended
])
