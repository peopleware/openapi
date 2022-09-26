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

const { StructureVersioned, structureVersionedExamples } = require('./StructureVersioned')
const addExamples = require('../_util/addExamples')
const { resultsExamples, Results } = require('./searchResults/Results')
const { hrefExamples, HREF } = require('./searchResults/HREF')

const searchResultsExamples = structureVersionedExamples
  .map(svd => ({
    ...svd,
    results: resultsExamples[0],
    href: hrefExamples[0]
  }))
  .concat([
    {
      ...structureVersionedExamples[0],
      results: [],
      href: {
        first: 'search?searchTerm=find%20me&page=1&per_page=27',
        last: 'search?searchTerm=find%20me&page=1&per_page=27'
      }
    }
  ])

const SearchResults = addExamples(
  StructureVersioned.append({
    results: Results.required(),
    href: HREF.required()
  }),
  searchResultsExamples
)

module.exports = {
  searchResultsExamples,
  SearchResults
}
