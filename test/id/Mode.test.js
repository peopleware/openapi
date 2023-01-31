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
const { stuff } = require('../../_util/_stuff')
const { Mode, ISODateToSecond, ISODateToSecondPattern } = require('../../id/Mode')

describe(testName(module), function () {
  describe('ISODateToSecond', function () {
    it('can build a pattern', function () {
      console.log(ISODateToSecondPattern.source)
    })
    shouldBeSeriousSchema(
      ISODateToSecond,
      stuff.concat([
        '2012-00-01T18:21:06Z',
        '2012-01-00T18:21:06Z',
        '2012-01-32T18:21:06Z',
        '2012-01-40T18:21:06Z',
        '2012-02-30T18:21:06Z',
        '2012-02-42T18:21:06Z',
        '2012-03-32T18:21:06Z',
        '2012-04-31T18:21:06Z',
        '2012-05-32T18:21:06Z',
        '2012-06-31T18:21:06Z',
        '2012-07-32T18:21:06Z',
        '2012-08-32T18:21:06Z',
        '2012-09-31T18:21:06Z',
        '2012-10-32T18:21:06Z',
        '2012-11-31T18:21:06Z',
        '2012-12-32T18:21:06Z',
        '2012-13-01T18:21:06Z',
        '2012-17-01T18:21:06Z',
        '2012-20-01T18:21:06Z',
        '2012-42-01T24:21:06Z',
        '2012-42-01T24:21:06Z',
        '2012-42-01T33:21:06Z',
        '2012-42-01T18:60:06Z',
        '2012-42-01T18:73:06Z',
        '2012-42-01T18:60:06Z',
        '2012-42-01T18:21:93Z',
        '2012-12-31T19:49:06',
        '2012-12-31T19:49:06T',
        '2012-12-31T19:49:06.345Z',
        '2A12-12-31T19:49:06Z',
        '2012-B2-31T19:01:06Z',
        '2012-12-C1T19:01:06Z',
        '2012-12-31T1D:01:06Z',
        '2012-12-31T19:e1:06Z',
        '2012-12-31T19:01:0fZ'
      ])
    )
  })
  describe('Mode', function () {
    shouldBeSeriousSchema(Mode, stuff)
  })
})
