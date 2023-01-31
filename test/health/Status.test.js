/*
 * Copyright 2020 - 2022 PeopleWare n.v.
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
const shouldBeSeriousSchema = require('../../_util/_shouldBeSeriousSchema')
const { stuff } = require('../../_util/_stuff')
const {
  Status,
  OK,
  WARNING,
  ERROR,
  UNREACHABLE,
  statusValues,
  statusCode,
  consolidate
} = require('../../health/Status')
const should = require('should')
const x = require('cartesian')

describe(testName(module), function () {
  describe('schema', function () {
    shouldBeSeriousSchema(Status, stuff)
  })
  describe('constants', function () {
    function isAValidConstant(name, sv) {
      it(`${name} is a valid Status`, function () {
        should(Status.validate(sv).error).not.be.ok()
        statusValues.should.containEql(name)
        sv.should.equal(name)
      })
    }

    isAValidConstant('OK', OK)
    isAValidConstant('WARNING', WARNING)
    isAValidConstant('ERROR', ERROR)
    isAValidConstant('UNREACHABLE', UNREACHABLE)
  })
  describe('#statusValues', function () {
    it('is an array of values', function () {
      statusValues.should.be.an.Array()
    })
    statusValues.forEach(v => {
      it(`"${v}" is valid`, function () {
        should(Status.validate(v).error).not.be.ok()
      })
    })
  })
  describe('#statusCode', function () {
    it('is an object with numbers', function () {
      function shouldBeIntegerWithin(candidate, min, max) {
        candidate.should.be.a.Number()
        Number.isInteger(candidate).should.be.a.true()
        candidate.should.be.within(min, max)
      }

      statusCode.should.be.an.Object()
      shouldBeIntegerWithin(statusCode.OK, 200, 299)
      shouldBeIntegerWithin(statusCode.WARNING, 200, 299)
      shouldBeIntegerWithin(statusCode.ERROR, 400, 499)
    })
  })
  describe('#consolidate', function () {
    beforeEach(function () {
      consolidate.contract.verifyPostconditions = true
    })
    afterEach(function () {
      consolidate.contract.verifyPostconditions = false
    })

    const cases = x({
      acc: statusValues.filter(v => v !== UNREACHABLE),
      status: statusValues,
      required: [true, false]
    })

    cases.forEach(c => {
      const expected =
        c.status === OK
          ? c.acc
          : c.status === WARNING
          ? c.acc === OK
            ? WARNING
            : c.acc
          : c.status === ERROR || c.status === UNREACHABLE
          ? c.acc === ERROR
            ? ERROR
            : c.required
            ? ERROR
            : WARNING
          : undefined
      it(`${c.acc} <- ${c.status}, required ${c.required}, returns ${expected}`, function () {
        const result = consolidate(c.acc, c.status, c.required)
        result.should.equal(expected)
      })
    })
  })
})
