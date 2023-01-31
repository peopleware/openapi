/*
 * Copyright 2023 - 2023 PeopleWare n.v.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-env mocha */

const testName = require('../../_util/_testName')
const { notEmptyArray, notTrimmedString, notEmptyObject } = require('../../_util/filters')
const { stuffWithUndefined } = require('../../_util/_stuff')
const { inspect } = require('util')

describe(testName(module), function () {
  describe('notEmptyArray', function () {
    it('returns false for an empty array', function () {
      notEmptyArray([]).should.be.false()
    })
    stuffWithUndefined.forEach(s => {
      const expected = !(Array.isArray(s) && s.length === 0)
      it(`returns ${expected} for ${inspect(s)}`, function () {
        notEmptyArray(s).should.equal(expected)
      })
    })
  })
  describe('notTrimmedString', function () {
    it('returns false for a string that is trimmed', function () {
      notTrimmedString('trimmed').should.be.false()
    })
    stuffWithUndefined.forEach(s => {
      const expected = !(typeof s === 'string' && s !== '' && !s.startsWith(' ') && !s.endsWith(' '))
      it(`returns ${expected} for ${inspect(s)}`, function () {
        notTrimmedString(s).should.equal(expected)
      })
    })
  })
  describe('notEmptyObject', function () {
    it('returns false for an empty object', function () {
      notEmptyObject({}).should.be.false()
    })
    stuffWithUndefined.forEach(s => {
      const expected = !(typeof s === 'object' && s !== null && Object.keys(s).length === 0 && !Array.isArray(s))
      it(`returns ${expected} for ${inspect(s)}`, function () {
        notEmptyObject(s).should.equal(expected)
      })
    })
  })
})
