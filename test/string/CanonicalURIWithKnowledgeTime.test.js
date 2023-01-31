/* eslint-env mocha */

const testName = require('../../_util/_testName')
const shouldBeSeriousSchema = require('../../_util/_shouldBeSeriousSchema')
const { stuff } = require('../../_util/_stuff')
const { CanonicalURIWithKnowledgeTime } = require('../../string/CanonicalURIWithKnowledgeTime')

describe(testName(module), function () {
  shouldBeSeriousSchema(
    CanonicalURIWithKnowledgeTime,
    stuff.concat([
      '/a/relative/uri/without/at',
      '/a/relative/uri/with/2/ats?at=2020-01-23T15:22:39.254888Z&at=2020-01-24T15:22:39.254888Z',
      '/insufficient/precision?at=2020-01-23T15:22:39.25Z', // insufficient precision
      '/not/a?at=iso-date'
    ])
  )
})
