/*
 * Copyright 2021 – 2021 PeopleWare
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/* eslint-env mocha */

const testName = require('../../_util/_testName')
const shouldBeSeriousSchema = require('../../_util/_shouldBeSeriousSchema')
const { stuff, stuffWithUndefined } = require('../../_util/_stuff')
const {
  MonetaryValue2,
  monetaryValue2Examples,
  monetaryValue2ToString,
  monetaryValueEqual,
  constrainedMonetaryValue2
} = require('../../money/MonetaryValue2')
const { decimalValueLimits } = require('../../number/Decimal')

describe(testName(module), function () {
  shouldBeSeriousSchema(
    MonetaryValue2,
    stuff.concat(
      stuffWithUndefined.map(currency => ({
        ...monetaryValue2Examples[0],
        currency
      }))
    )
  )

  const moneyCases = [
    { subject: { currency: 'EUR', decimals: 4, value: 7475005 }, expected: 'EUR 747,500 5' },
    { subject: { currency: 'EUR', decimals: 2, value: -84884 }, expected: 'EUR -848,84' },
    { subject: { currency: 'EUR', decimals: 4, value: 0 }, expected: 'EUR 0,000 0' },
    { subject: { currency: 'EUR', decimals: 0, value: 84884 }, expected: 'EUR 84 884' },
    { subject: { currency: 'EUR', decimals: -8, value: 884 }, expected: 'EUR 88 400 000 000' },
    { subject: { currency: 'EUR', decimals: 4, value: -1 }, expected: 'EUR -0,000 1' },
    { subject: { currency: 'EUR', decimals: -4, value: 0 }, expected: 'EUR 0' }
  ]

  describe('monetaryValue2ToString', function () {
    moneyCases.forEach(c => {
      it(`works for ${JSON.stringify(c.subject)}`, function () {
        const result = monetaryValue2ToString(c.subject)
        result.should.be.a.String()
        result.should.equal(c.expected)
      })
    })
  })

  describe('monetaryValueEqual', function () {
    monetaryValue2Examples.forEach(m1 =>
      monetaryValue2Examples.forEach(m2 => {
        const expected = m1.decimals === m2.decimals && m1.value === m2.value && m1.currency === m2.currency
        it(`return ${expected} for ${monetaryValue2ToString(m1)} = ${monetaryValue2ToString(m2)}`, function () {
          const result = monetaryValueEqual(m1, m2)
          result.should.equal(expected)
        })
      })
    )
  })

  const constrainedMonetaryValue2Cases = [
    { currency: 'EUR', decimals: 4, limits: { min: -10000, max: 10000 } },
    { currency: 'EUR', decimals: 2, limits: { min: -100, max: 100 } },
    { currency: 'EUR', decimals: 4, limits: { min: 0, max: 20000 } },
    { currency: 'EUR', decimals: 2, limits: { min: -100, max: 0 } },
    { currency: 'GBP', decimals: -2, limits: { min: -900, max: 100 } },
    { currency: 'USD', decimals: -4, limits: { min: 0, max: 20000 } },
    { currency: 'EUR', decimals: -2, limits: { min: -100, max: 0 } },
    { currency: 'EUR', decimals: 4, limits: { min: -3 } },
    { currency: 'EUR', decimals: 2, limits: { max: 4 } },
    { currency: 'EUR', decimals: 2, limits: {} },
    { currency: 'EUR', decimals: 2 },
    { currency: 'BEF', decimals: 2, limits: decimalValueLimits.nonPositive },
    { currency: 'EUR', decimals: 2, limits: decimalValueLimits.negative },
    { currency: 'EUR', decimals: 2, limits: decimalValueLimits.positive },
    { currency: 'EUR', decimals: 2, limits: decimalValueLimits.nonNegative }
  ]

  describe('constrainedMonetaryValue2', function () {
    constrainedMonetaryValue2Cases.forEach(c => {
      describe(`should generate a serious schema for ${JSON.stringify(c)}`, function () {
        const result = constrainedMonetaryValue2(MonetaryValue2, c.currency, c.decimals, c.limits)
        shouldBeSeriousSchema(
          result,
          stuff
            .concat([
              { currency: 'CHF', decimals: c.decimals, value: c.limits?.min ? c.limits?.min : 0 },
              { currency: c.currency, decimals: c.decimals + 1, value: c.limits?.min ? c.limits?.min : 0 }
            ])
            .concat(c.limits?.min ? [{ currency: c.currency, decimals: c.decimals, value: c.limits.min - 1 }] : [])
            .concat(c.limits?.max ? [{ currency: c.currency, decimals: c.decimals, value: c.limits.max + 1 }] : [])
        )
      })
    })
  })
})
