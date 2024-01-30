/*
 * Copyright 2023 - 2024 PeopleWare n.v.
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
const { stuff } = require('../../_util/_stuff')
const { assert } = require('../../_util/assert')

const falsyValues = [false, 0, '', null, undefined, Number.NaN]

describe(testName(module), function () {
  describe('falsy', function () {
    falsyValues.forEach(v => {
      it(`throws when the assertion returns ${v}`, function () {
        assert.bind(undefined, () => v).should.throw()
      })
    })
  })

  describe('thruthy', function () {
    stuff
      .filter(s => !falsyValues.includes(s))
      .forEach(v => {
        it(`ends nominally when the assertion returns ${String(v)}`, function () {
          assert.bind(undefined, () => v).should.not.throw()
        })
      })
  })

  describe('throws', function () {
    it(`throws when the assertion throws`, function () {
      const error = new Error()
      assert
        .bind(undefined, () => {
          throw error
        })
        .should.throw(error)
    })
  })
})
