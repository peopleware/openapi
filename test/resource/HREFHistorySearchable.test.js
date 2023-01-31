/* eslint-env mocha */

const testName = require('../../_util/_testName')
const shouldBeSeriousSchema = require('../../_util/_shouldBeSeriousSchema')
const { stuff, stuffWithUndefined } = require('../../_util/_stuff')
const { HREFHistorySearchable, hrefHistorySearchableExamples } = require('../../resource/HREFHistorySearchable')

describe(testName(module), function () {
  shouldBeSeriousSchema(
    HREFHistorySearchable,
    stuff.concat(stuffWithUndefined.map(searchDocument => ({ ...hrefHistorySearchableExamples[0], searchDocument })))
  )
})
