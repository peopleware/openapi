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
const { StructureVersioned, structureVersionedExamples } = require('./StructureVersioned')
const addExamples = require('../_util/addExamples')
const { SearchResultBase, searchResultBaseExamples } = require('./SearchResultBase')
const { SearchTerm } = require('./SearchTerm')

const SearchDocument = StructureVersioned.append({
  exact: Joi.array()
    .items(SearchTerm.example('0123456789'))
    .unique()
    .description(
      `List of strings on which the resource can be found with exact match.

The order is irrelevant. May be empty if \`fuzzy\` is not empty.`
    )
    .example(['0123456789', '9876543210'])
    .required(),
  fuzzy: Joi.array()
    .items(SearchTerm)
    .unique()
    .when('exact', { not: Joi.array().min(1), then: Joi.array().min(1) })
    .description(
      `List of strings on which the resource can be found with fuzzy match.

The order is irrelevant. May be empty if \`exact\` is not empty.`
    )
    .example(['find me', 'if you can'])
    .required(),
  content: SearchResultBase.required()
})
  .description(
    `Wrapper around the search result (which is returned to the client when the resource is found), with
information for a search index.

It contains strings for which the resource this is a search document for can be found by, and the \`content\` that is to
be sent to the client. The resource this is a search document for can be found with an exact match on the strings in
\`exact\`, and by a fuzzy search on the strings in \`fuzzy\`. Some strings might appear in both.

\`fuzzy\` or \`exact\` may be empty, but not both.

Search results can be limited to selected types with an exact match on \`content.discriminator\`. The found resource
can be retrieved in the indexed version at \`content.href\`.`)

const searchDocumentExamples = structureVersionedExamples.map(svd => ({
  ...svd,
  exact: ['0123456789', '9876543210'],
  fuzzy: ['find me', 'if you can', '9876543210'],
  content: searchResultBaseExamples[0]
}))

module.exports = {
  searchDocumentExamples,
  SearchDocument: addExamples(SearchDocument, searchDocumentExamples)
}
