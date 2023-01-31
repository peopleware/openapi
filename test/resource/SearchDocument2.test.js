/*
 * Copyright 2023 – 2023 PeopleWare
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
const { stuff, stuffWithUndefined } = require('../../_util/_stuff')
const { SearchDocument2, searchDocument2Examples } = require('../../resource/SearchDocument2')
const { notEmptyArray, notTrimmedString, notEmptyObject } = require('../../_util/filters')

describe(testName(module), function () {
  shouldBeSeriousSchema(
    SearchDocument2,
    stuff
      .concat(
        stuffWithUndefined
          .filter(notEmptyArray)
          .map(structureVersion => ({ ...searchDocument2Examples[0], structureVersion }))
      )
      .concat(stuffWithUndefined.filter(notEmptyArray).map(exact => ({ ...searchDocument2Examples[0], exact })))
      .concat(stuffWithUndefined.filter(notTrimmedString).map(eg => ({ ...searchDocument2Examples[0], exact: [eg] })))
      .concat(
        stuffWithUndefined
          .filter(notEmptyArray)
          .map(toOneAssociations => ({ ...searchDocument2Examples[0], toOneAssociations }))
      )
      .concat(
        stuffWithUndefined
          .filter(notTrimmedString)
          .map(eg => ({ ...searchDocument2Examples[0], toOneAssociations: [eg] }))
      )
      .concat(stuffWithUndefined.filter(notEmptyArray).map(fuzzy => ({ ...searchDocument2Examples[0], fuzzy })))
      .concat(stuffWithUndefined.filter(notTrimmedString).map(eg => ({ ...searchDocument2Examples[0], fuzzy: [eg] })))
      .concat(stuffWithUndefined.filter(notEmptyObject).map(embedded => ({ ...searchDocument2Examples[0], embedded })))
      .concat(stuff.map(wrong => ({ ...searchDocument2Examples[0], embedded: { wrong } })))
      .concat(stuffWithUndefined.map(content => ({ ...searchDocument2Examples[0], content })))
      .concat({ ...searchDocument2Examples[0], exact: [], toOneAssociations: [], fuzzy: [] })
  )
})
