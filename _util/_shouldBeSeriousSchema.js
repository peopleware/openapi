/*
 * Copyright 2020 - 2023 PeopleWare n.v.
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

const { isSchema } = require('joi')
const should = require('should')
const { mochaInIntelliJ } = require('./mochaInIntelliJ')

/**
 * @param {Joi.Schema} schema
 * @param {Array<any>} failures
 * @param {boolean} [unknownNotAllowed]
 * @param {object} [context]
 * @return {void}
 */
function shouldBeSeriousSchema(schema, failures, unknownNotAllowed = false, context) {
  it('is a Joi schema', function () {
    schema.should.be.ok()
    isSchema(schema).should.be.true()
  })
  if (schema.type === 'object') {
    if (!unknownNotAllowed) {
      it('allows unknown keys (allow for server evolution)', function () {
        schema._flags.should.be.an.Object()
        should(schema._flags.unknown).be.true()
      })
    } else {
      it('does not allow unknown keys', function () {
        schema._flags.should.be.an.Object()
        should(schema._flags.unknown).not.be.ok()
      })
    }
    if (schema.describe().keys) {
      describe('properties', function () {
        const description = schema.describe()
        Object.keys(description.keys).forEach(property => {
          it(`${property} has a description`, function () {
            should(description.keys[property].flags.description).be.a.String()
          })
        })
      })
    }
  }
  describe('examples', function () {
    it('should have examples', function () {
      // MUDO for alternatives -> oneOf, there should be (but are allowed to be) no examples for the composite, but the examples of the parts should pass
      const description = schema.describe()
      should(description.examples).be.an.Array()
      description.examples.length.should.be.greaterThanOrEqual(1)
    })
    if (schema.describe().examples) {
      schema.describe().examples.forEach((ex, index) => {
        it(`${index}: example ${JSON.stringify(ex)} passes the schema`, function () {
          should(schema.validate(ex, { convert: false, context }).error).be.undefined()
        })
      })
      it('`undefined` passes the schema', function () {
        should(schema.validate(undefined, { convert: false, context }).error).be.undefined()
      })
    }
  })
  describe('failures', function () {
    failures.forEach((f, i) => {
      it(`${i}: fails for ${JSON.stringify(f)}`, function () {
        const { error } = schema.validate(f, { convert: false, context })
        should(error).be.ok()
        if (mochaInIntelliJ()) {
          console.log(`😀⚡️ ${error.message}`)
        }
      })
    })
  })
}

module.exports = shouldBeSeriousSchema
