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
const { MonetaryValue2, monetaryValue2Examples, monetaryValue2ToString } = require('../../money/MonetaryValue2')
const { notInteger } = require('../../_util/filters')

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
})
