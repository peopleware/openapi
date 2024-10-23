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

const testName = require('../../_util/_testName')
const shouldBeSeriousSchema = require('../../_util/_shouldBeSeriousSchema')
const { stuff, stuffWithUndefined } = require('../../_util/_stuff')
const { SearchDocument, searchDocumentExamples } = require('../../resource/SearchDocument')
const { notTrimmedString, notEmptyArray } = require('../../_util/filters')

describe(testName(module), function () {
  shouldBeSeriousSchema(
    SearchDocument,
    stuff
      .concat(stuffWithUndefined.filter(notEmptyArray).map(exact => ({ ...searchDocumentExamples[0], exact })))
      .concat(stuffWithUndefined.filter(notTrimmedString).map(eg => ({ ...searchDocumentExamples[0], exact: [eg] })))
      .concat(stuffWithUndefined.filter(notEmptyArray).map(fuzzy => ({ ...searchDocumentExamples[0], fuzzy })))
      .concat(stuffWithUndefined.filter(notTrimmedString).map(eg => ({ ...searchDocumentExamples[0], fuzzy: [eg] })))
      .concat(stuffWithUndefined.map(content => ({ ...searchDocumentExamples[0], content })))
      .concat({ ...searchDocumentExamples[0], exact: [], fuzzy: [] })
  )
})
