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
const { MonetaryValueEUR2, monetaryValueEUR2Examples,
        zeroMonetaryValueEUR2Examples, ZeroMonetaryValueEUR2, NonNegativeMonetaryValueEUR2,
        nonNegativeMonetaryValueEUR2Examples, positiveMonetaryValueEUR2Examples, PositiveMonetaryValueEUR2,
        PositiveMonetaryValueEUR4, positiveMonetaryValueEUR4Examples, NegativeMonetaryValueEUR2,
        negativeMonetaryValueEUR2Examples
      } = require('../../money/ConstrainedMonetaryValue')

describe(testName(module), function () {
  describe('MonetaryValueEUR2', function () {
    shouldBeSeriousSchema(
      MonetaryValueEUR2,
      [
       {
         ...monetaryValueEUR2Examples[0],
          currency: 'USD'
       },
       {
         ...monetaryValueEUR2Examples[0],
         decimals: 4
       }
     ]
    )
  })

  describe('ZeroMonetaryValueEUR2', function () {
    shouldBeSeriousSchema(
      ZeroMonetaryValueEUR2,
      [
        {
          ...zeroMonetaryValueEUR2Examples[0],
          currency: 'USD'
        },
        {
          ...zeroMonetaryValueEUR2Examples[0],
          decimals: 4
        },
        {
          ...zeroMonetaryValueEUR2Examples[0],
          value: -1
        },
        {
          ...zeroMonetaryValueEUR2Examples[0],
          value: 1
        }
      ]
    )
  })

  describe('NonNegativeMonetaryValueEUR2', function () {
    shouldBeSeriousSchema(
      NonNegativeMonetaryValueEUR2,
      [
        {
          ...nonNegativeMonetaryValueEUR2Examples[0],
          currency: 'USD'
        },
        {
          ...nonNegativeMonetaryValueEUR2Examples[0],
          decimals: 4
        },
        {
          ...nonNegativeMonetaryValueEUR2Examples[0],
          value: -1
        }
      ]
    )
  })

  describe('PositiveMonetaryValueEUR2', function () {
    shouldBeSeriousSchema(
      PositiveMonetaryValueEUR2,
      [
        {
          ...positiveMonetaryValueEUR2Examples[0],
          currency: 'USD'
        },
        {
          ...positiveMonetaryValueEUR2Examples[0],
          decimals: 4
        },
        {
          ...positiveMonetaryValueEUR2Examples[0],
          value: -1
        },
        {
          ...positiveMonetaryValueEUR2Examples[0],
          value: 0
        }
      ]
    )
  })

  describe('PositiveMonetaryValueEUR4', function () {
    shouldBeSeriousSchema(
      PositiveMonetaryValueEUR4,
      [
        {
          ...positiveMonetaryValueEUR4Examples[0],
          currency: 'USD'
        },
        {
          ...positiveMonetaryValueEUR4Examples[0],
          decimals: 2
        },
        {
          ...positiveMonetaryValueEUR4Examples[0],
          value: -1
        },
        {
          ...positiveMonetaryValueEUR4Examples[0],
          value: 0
        }
      ]
    )
  })

  describe('NegativeMonetaryValueEUR2', function () {
    shouldBeSeriousSchema(
      NegativeMonetaryValueEUR2,
      [
        {
          ...negativeMonetaryValueEUR2Examples[0],
          currency: 'USD'
        },
        {
          ...negativeMonetaryValueEUR2Examples[0],
          decimals: 4
        },
        {
          ...negativeMonetaryValueEUR2Examples[0],
          value: 0
        },
        {
          ...negativeMonetaryValueEUR2Examples[0],
          value: 1
        }
      ]
    )
  })
})
