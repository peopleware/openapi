const testName = require('../../_util/_testName')
const shouldBeSeriousSchema = require('../../_util/_shouldBeSeriousSchema')
const { stuff } = require('../../_util/_stuff')
const { CanonicalURI } = require('../../string/CanonicalURI')

describe(testName(module), function () {
  shouldBeSeriousSchema(CanonicalURI, stuff)
})
