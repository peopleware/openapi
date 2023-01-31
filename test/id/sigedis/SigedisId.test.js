const testName = require('../../../_util/_testName')
const shouldBeSeriousSchema = require('../../../_util/_shouldBeSeriousSchema')
const { SigedisId } = require('../../../id/sigedis/SigedisId')
const { stuff } = require('../../../_util/_stuff')

/* eslint-env mocha */

describe(testName(module), function () {
  shouldBeSeriousSchema(
    SigedisId,
    stuff.concat([
      '1234-5678-9012-3456-7890-1234',
      123456789012345678901234,
      '12345678901234567890123',
      '1234567890123456789012345'
    ])
  )
})
