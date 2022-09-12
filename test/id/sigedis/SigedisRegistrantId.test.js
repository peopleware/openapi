const testName = require('../../../_util/_testName')
const shouldBeSeriousSchema = require('../../../_util/_shouldBeSeriousSchema')
const { SigedisRegistrantId } = require('../../../id/sigedis/SigedisRegistrantId')
const { stuff } = require('../../../_util/_stuff')

const invalidASCII = [...Array(127 - 32).keys()]
  .map(cc => String.fromCharCode(cc + 32))
  .filter(
    c =>
      !['.', '-', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(c) &&
      c.toLowerCase() === c &&
      c.toUpperCase() === c
  )

describe(testName(module), function () {
  shouldBeSeriousSchema(
    SigedisRegistrantId,
    stuff.concat(invalidASCII).concat(['ABCDEFGHIJKLMNOPQRSTUVWXYZ/0123456789-abcdefghijklmnopqrstuv.']) // 61 characters
  )
})
