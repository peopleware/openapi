/* eslint-env mocha */

const testName = require('../../_util/_testName')
const shouldBeSeriousSchema = require('../../_util/_shouldBeSeriousSchema')
const { stuff } = require('../../_util/_stuff')
const { RelativeURI } = require('../../string/RelativeURI')

describe(testName(module), function () {
  shouldBeSeriousSchema(RelativeURI, stuff)
})
