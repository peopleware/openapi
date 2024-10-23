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
const { extendDescription } = require('../../_util/extendDescription')

const description = 'original description'
const extraDescription = 'extra description'
const aSchema = Joi.number().description(description)

describe(testName(module), function () {
  it('extends at start', function () {
    const result = extendDescription(aSchema, extraDescription)
    const resultingDescription = result.describe().flags.description
    resultingDescription.should.startWith(extraDescription)
    resultingDescription.should.endWith(description)
  })
  it('extends at end', function () {
    const result = extendDescription(aSchema, extraDescription, true)
    const resultingDescription = result.describe().flags.description
    resultingDescription.should.endWith(extraDescription)
    resultingDescription.should.startWith(description)
  })
  it('does not fail in browser environments', function () {
    const aBrowserSchema = Joi.number().description(description)
    const describe = aBrowserSchema.describe
    aBrowserSchema.describe = undefined
    const result = extendDescription(aBrowserSchema, extraDescription, true)
    const resultingDescription = describe.call(result).flags.description
    resultingDescription.should.be.equal(extraDescription)
    resultingDescription.should.not.containEql(description)
  })
})
