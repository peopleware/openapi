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

const Joi = require('joi')
const addExamples = require('../../_util/addExamples')
const { SearchResultBase2 } = require('../SearchDocumentContentBase2')

const resultsExamples = [
  [
    {
      structureVersion: 1,
      discriminator: 'companies/company',
      href: '/companies/v1/company/5646897945?at=2021-01-19T17:14:18.482Z',
      crn: '5646897945',
      name: {
        nl: 'Het Bedrijf',
        fr: 'La Compagnie'
      }
    },
    {
      structureVersion: 2,
      discriminator: 'persons/person',
      href: '/persons/v1/person/6908390?at=2021-01-19T17:14:18.482Z',
      inss: '96110505648',
      firstName: 'Anna',
      lastName: 'Van Deuren'
    }
  ],
  []
]

/**
 * Allow both the deprecated `SearchResultBase`, and `SearchResultBase2`, and possible later backward compatible
 * versions. `SearchResultBase` and `SearchResultBase2` are the same, except for the `structureVersion`.
 */
const MixedSearchResults = SearchResultBase2.append({
  structureVersion: SearchResultBase2.extract('structureVersion').valid(Joi.override) // allow all numbers
})

const Results = addExamples(
  Joi.array()
    .items(MixedSearchResults)
    .max(100)
    .unique('href')
    .description(
      `List of items that match the search, ordered by relevance. The list has \`per_page\` or fewer items.

Items identify the type of resource they represent (\`discriminator\`), a link to the indexed version of the found
resource (\`href\`), and information for humans to recognize the found resource. The entries can have different
\`structureVersions\`, even for the same \`discriminator\`. The precise structure of each entry, beyond the base
properties, is a contract between the service in which the resource resides and clients of the search service. This is
opaque to the search service, which acts as intermediate.

The list has the requested number of items, except for the first and last page. The \`href.first\` page can be empty,
or have fewer elements than \`per_page\`. The \`href.last\` page can have fewer reference in the response than
\`per_page\`, but cannot be empty. Other pages have exactly the \`per_page\` as number of items.`
    ),
  resultsExamples
)

module.exports = {
  resultsExamples,
  MixedSearchResults,
  Results
}
