/*
 * Copyright 2021 – 2023 PeopleWare
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
 */

/* eslint-env mocha */

const shouldBeSeriousSchema = require('../../_util/_shouldBeSeriousSchema')
const testName = require('../../_util/_testName')
const { CreatedInError, createdInErrorExamples } = require('../../resource/CreatedInError')
const { stuff, stuffWithUndefined } = require('../../_util/_stuff')
describe(testName(module), function () {
  shouldBeSeriousSchema(
    CreatedInError,
    stuff.concat(
      stuffWithUndefined
        .filter(s => s !== true)
        .map(createdInError => ({ ...createdInErrorExamples[0], createdInError }))
    )
  )
})
