const testName = require('../../_util/_testName')
const shouldBeSeriousSchema = require('../../_util/_shouldBeSeriousSchema')
const { HREFHistory, hrefHistoryExamples } = require('../../resource/HREFHistory')
const { stuff, stuffWithUndefined } = require('../../_util/_stuff')

describe(testName(module), function () {
  shouldBeSeriousSchema(
    HREFHistory,
    stuff.concat(stuffWithUndefined.map(history => ({ ...hrefHistoryExamples[0], history })))
  )
})
