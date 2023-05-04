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
const { notInteger } = require('../../_util/filters')
const { PositiveMonetaryValue, positiveMonetaryValueExamples } = require('../../money/PositiveMonetaryValue')

describe(testName(module), function () {
  shouldBeSeriousSchema(
    PositiveMonetaryValue,
    stuff
      .concat(
        stuffWithUndefined.map(currency => ({
          ...positiveMonetaryValueExamples[0],
          currency
        }))
      )
      .concat(
        stuffWithUndefined.filter(notInteger).map(decimals => ({
          ...positiveMonetaryValueExamples[0],
          decimals
        }))
      )
      .concat(
        stuffWithUndefined.filter(notInteger).map(amount => ({
          ...positiveMonetaryValueExamples[0],
          amount
        }))
      )
      .concat([
        {
          ...positiveMonetaryValueExamples[0],
          amount: 0
        },
        {
          ...positiveMonetaryValueExamples[0],
          amount: -4
        }
      ])
  )
})
