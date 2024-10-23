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

const testName = require('../../_util/_testName')
const shouldBeSeriousSchema = require('../../_util/_shouldBeSeriousSchema')
const { DateTime } = require('../../time/DateTime')
const { dayDateExamples } = require('../../time/DayDate')
const { stuff } = require('../../_util/_stuff')
const should = require('should')
const Joi = require('joi')

describe(testName(module), function () {
  const validIsoDateTimes = []

  for (const year of [1900, 1999, 2000, 2020, 2123]) {
    validIsoDateTimes.push(`${year}-01-01T00:00:00.000Z`)
  }

  for (let month = 1; month <= 12; month++) {
    validIsoDateTimes.push(`2123-${month.toString().padStart(2, '0')}-01T00:00:00.000Z`)
  }

  for (let day = 1; day <= 31; day++) {
    // We ignore the fact that a month can have fewer days than 31.
    validIsoDateTimes.push(`2123-01-${day.toString().padStart(2, '0')}T00:00:00.000Z`)
  }

  for (let hour = 0; hour <= 23; hour++) {
    validIsoDateTimes.push(`2123-01-01T${hour.toString().padStart(2, '0')}:00:00.000Z`)
  }

  for (let minute = 0; minute <= 59; minute++) {
    validIsoDateTimes.push(`2123-01-01T00:${minute.toString().padStart(2, '0')}:00.000Z`)
  }

  for (let second = 0; second <= 59; second++) {
    validIsoDateTimes.push(`2123-01-01T00:00:${second.toString().padStart(2, '0')}.000Z`)
  }

  for (let millisecond = 0; millisecond <= 999; millisecond++) {
    validIsoDateTimes.push(`2123-01-01T00:00:00.${millisecond.toString().padStart(3, '0')}Z`)
  }

  describe('valid date times', () => {
    validIsoDateTimes.forEach((validIsoDateTime, index) => {
      it(`${index}: ${validIsoDateTime} is valid`, () => {
        should(DateTime.validate(validIsoDateTime, { convert: false }).error).be.undefined()
      })
    })
  })

  shouldBeSeriousSchema(
    DateTime,
    stuff.concat(dayDateExamples).concat([
      '2020-01-23T15:22:39.212',
      '2020-01-23T25:22:39.212Z',
      '2020-01-23T15:72:39.212Z',
      '2020-01-23T15:22:89.212Z',
      '2020-01-23T15:22:39.21Z' // insufficient precision
    ])
  )

  describe('weird issues', function () {
    it('does not eat precision', function () {
      const highPrecisionString = '2022-08-30T14:17:07.630162Z'
      const result = Joi.attempt(highPrecisionString, DateTime)
      result.should.equal(highPrecisionString)
    })
  })
})
