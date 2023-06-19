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
const { MonetaryValue2, monetaryValue2Examples } = require('../../money/MonetaryValue2')
const { notInteger } = require('../../_util/filters')

describe(testName(module), function () {
  shouldBeSeriousSchema(
    MonetaryValue2,
    stuff
      .concat(
        stuffWithUndefined.map(currency => ({
          ...monetaryValue2Examples[0],
          currency
        }))
      )
      .concat(
        stuffWithUndefined.filter(notInteger).map(decimals => ({
          ...monetaryValue2Examples[0],
          decimals
        }))
      )
      .concat(
        stuffWithUndefined.filter(notInteger).map(value => ({
          ...monetaryValue2Examples[0],
          value
        }))
      )
  )
})
