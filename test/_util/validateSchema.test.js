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

const testName = require('../../_util/_testName')
const Joi = require('joi')
const { validateSchema } = require('../../_util/validateSchema')

const aSchema = Joi.number().label('should be a number')

describe(testName(module), function () {
  it('returns true when the schema validates', function () {
    const result = validateSchema(aSchema, 554)
    result.should.be.true()
  })
  it('returns false when the schema fails (and there is output in the console)', function () {
    const result = validateSchema(aSchema, 'this is not a number')
    result.should.be.false()
  })
  it('returns false when the schema fails and the error fails to annotate', function () {
    const result = validateSchema(aSchema, 'this is not a number')
    result.should.be.false()
  })
})
