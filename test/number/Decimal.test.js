/* eslint-env mocha */

const testName = require('../../_util/_testName')
const shouldBeSeriousSchema = require('../../_util/_shouldBeSeriousSchema')
const {
  Decimal,
  decimalExamples,
  decimalToString,
  constrainedDecimal,
  decimalEqual,
  decimalValueLimits
} = require('../../number/Decimal')
const { stuff, stuffWithUndefined } = require('../../_util/_stuff')
const { notInteger } = require('../../_util/filters')

describe(testName(module), function () {
  describe('Decimal', function () {
    shouldBeSeriousSchema(
      Decimal,
      stuff
        .concat(
          stuffWithUndefined.filter(notInteger).map(decimals => ({
            ...decimalExamples[0],
            decimals
          }))
        )
        .concat(
          stuffWithUndefined.filter(notInteger).map(value => ({
            ...decimalExamples[0],
            value
          }))
        )
    )
  })

  const decimalCases = [
    { subject: { decimals: 4, value: 7475005 }, expected: '747,500 5' },
    { subject: { decimals: 2, value: -84884 }, expected: '-848,84' },
    { subject: { decimals: 4, value: 0 }, expected: '0,000 0' },
    { subject: { decimals: 0, value: 84884 }, expected: '84 884' },
    { subject: { decimals: -8, value: 884 }, expected: '88 400 000 000' },
    { subject: { decimals: 4, value: -1 }, expected: '-0,000 1' },
    { subject: { decimals: -4, value: 0 }, expected: '0' }
  ]

  describe('decimalToString', function () {
    decimalCases.forEach(c => {
      it(`works for ${JSON.stringify(c.subject)}`, function () {
        const result = decimalToString(c.subject)
        result.should.be.a.String()
        result.should.equal(c.expected)
      })
    })
  })

  describe('decimalEqual', function () {
    decimalExamples.forEach(d1 =>
      decimalExamples.forEach(d2 => {
        const expected = d1.decimals === d2.decimals && d1.value === d2.value
        it(`return ${expected} for ${decimalToString(d1)} = ${decimalToString(d2)}`, function () {
          const result = decimalEqual(d1, d2)
          result.should.equal(expected)
        })
      })
    )
  })

  const constrainedDecimalCases = [
    { decimals: 4, limits: { min: -10000, max: 10000 } },
    { decimals: 2, limits: { min: -100, max: 100 } },
    { decimals: 4, limits: { min: 0, max: 20000 } },
    { decimals: 2, limits: { min: -100, max: 0 } },
    { decimals: -2, limits: { min: -900, max: 100 } },
    { decimals: -4, limits: { min: 0, max: 20000 } },
    { decimals: -2, limits: { min: -100, max: 0 } },
    { decimals: 4, limits: { min: -3 } },
    { decimals: 2, limits: { max: 4 } },
    { decimals: 2, limits: {} },
    { decimals: 2 },
    { decimals: 2, limits: decimalValueLimits.nonPositive },
    { decimals: 2, limits: decimalValueLimits.negative },
    { decimals: 2, limits: decimalValueLimits.positive },
    { decimals: 2, limits: decimalValueLimits.nonNegative }
  ]

  describe('constrainedDecimal', function () {
    constrainedDecimalCases.forEach(c => {
      describe(`should generate a serious schema for ${JSON.stringify(c)}`, function () {
        const result = constrainedDecimal(Decimal, c.decimals, c.limits)
        shouldBeSeriousSchema(
          result,
          stuff.concat([
            { decimals: c.decimals + 1, value: c.min },
            { decimals: c.decimals, value: c.min - 1 },
            { decimals: c.decimals, value: c.max + 1 }
          ])
        )
      })
    })
  })
})
