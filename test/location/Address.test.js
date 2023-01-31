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
const { addressExamples, Address } = require('../../location/Address')

const mandatoryProperties = ['line1', 'postalCode', 'municipality', 'country']
const trimmedStrings = ['line1', 'line2', 'postalCode', 'municipality']

const failures = stuff
  .concat(
    addressExamples
      .map(example =>
        mandatoryProperties.map(prop => {
          const failure = { ...example }
          delete failure[prop]
          return failure
        })
      )
      .flat()
  )
  .concat(
    trimmedStrings.map(ts => {
      const failure = { ...addressExamples[0] }
      failure[ts] = ' space in front'
      return failure
    })
  )
  .concat(
    trimmedStrings.map(ts => {
      const failure = { ...addressExamples[0] }
      failure[ts] = 'space at back '
      return failure
    })
  )

describe(testName(module), function () {
  shouldBeSeriousSchema(Address, failures)
})
