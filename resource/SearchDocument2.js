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

const Joi = require('joi')
const { StructureVersioned } = require('./StructureVersioned')
const addExamples = require('../_util/addExamples')
const { StructureVersion } = require('./StructureVersion')
const { SearchTerm } = require('./SearchTerm')
const { CanonicalURI } = require('../string/CanonicalURI')
const { SearchDocumentContentBase2, searchDocumentContentBase2Examples } = require('./SearchDocumentContentBase2')

const SearchDocument2 = StructureVersioned.append({
  structureVersion: StructureVersion.valid(Joi.override, 2)
    .example(2, { override: true })
    .required(),
  toOneAssociations: Joi.array()
    .items(CanonicalURI)
    .unique()
    .description(
      `Array of canonical URIs of the resources the represented resource has a to-one association to. Used to find the
represented resource as element of the to-many association of the referenced resource.

The order is irrelevant. May be empty if \`fuzzy\` or \`exact\` is not empty.`
    )
    .example(['/some-service/v1/x/123', '/my-service/v1/y/abc'])
    .required(),
  exact: Joi.array()
    .items(SearchTerm.example('0123456789'))
    .unique()
    .description(
      `List of strings on which the resource can be found with exact match.

The order is irrelevant. May be empty if \`fuzzy\` or \`toOneAssociations\` is not empty.`
    )
    .example(['0123456789', '9876543210'])
    .required(),
  fuzzy: Joi.array()
    .items(SearchTerm.example('find me'))
    .unique()
    .description(
      `List of strings on which the resource can be found with fuzzy match.

The order is irrelevant. May be empty if \`exact\` or \`toOneAssociations\` is not empty.`
    )
    .example(['find me', 'if you can'])
    .required(),
  embedded: Joi.object()
    .pattern(Joi.string(), CanonicalURI)
    // MUDO check
    .unknown()
    .required()
    .description(
      `Array of canonical URIs of the resources this search index document embeds information of. When the search index
document for the referenced resources is updated, the search index document for the represented resource needs to be
updated too.`
    )
    .example({ x: '/your-service/v1/x/123', y: '/my-service/v1/y/abc' }),
  content: SearchDocumentContentBase2.required()
})
  .messages({
    'searchDocument.notAllEmpty': '`toOneAssociations`, `exact`, and `fuzzy` may be empty, but not all of them'
  })
  .custom((value, { error }) => {
    if (value.toOneAssociations.length === 0 && value.exact.length === 0 && value.fuzzy.length === 0) {
      return error('searchDocument.notAllEmpty')
    }

    return value
  })
  .description(`Returned as \`search-document\` by a service for a parent resource. A _search index document_ is created
in the search index based on this information. The search service retrieves the information from the search index.

It contains strings for which the resource this is a search document for can be found by, and the \`content\` that is to
be sent to the client (more or less). The resource this is a search document for can be found with an exact match on the
strings in \`exact\` or \`toOneAssociations\`, and by a fuzzy search on the strings in \`fuzzy\`. Some strings might
appear in both.

\`toOneAssociations\`, \`exact\`, and \`fuzzy\` may be empty, but not all of them.

Search results can be limited to selected types with an exact match on \`content.discriminator\`. The found resource
can be retrieved in the indexed version at \`href\`.`)

const searchDocument2Examples = [
  {
    structureVersion: 2,
    toOneAssociations: ['/some-service/v1/x/123', '/my-service/v1/y/abc'],
    exact: ['0123456789', '9876543210'],
    fuzzy: ['find me', 'if you can', '9876543210'],
    content: {
      ...searchDocumentContentBase2Examples[0],
      extraData: 'extra',
      moreInfo: { aDetail: 2, anotherDetail: true },
      aReference: '/my-service/a/canonical/uri'
    },
    embedded: { x: '/your-service/v1/x/123' }
  },
  // only toOneAssociations
  {
    structureVersion: 2,
    toOneAssociations: ['/some-service/v1/x/123'],
    exact: [],
    fuzzy: [],
    content: {
      ...searchDocumentContentBase2Examples[0],
      extraData: 'extra',
      moreInfo: { aDetail: 2, anotherDetail: true },
      aReference: '/my-service/a/canonical/uri'
    },
    embedded: { x: '/your-service/v1/x/123' }
  },
  // only exact
  {
    structureVersion: 2,
    toOneAssociations: [],
    exact: ['0123456789'],
    fuzzy: [],
    content: {
      ...searchDocumentContentBase2Examples[0],
      extraData: 'extra',
      moreInfo: { aDetail: 2, anotherDetail: true },
      aReference: '/my-service/a/canonical/uri'
    },
    embedded: { x: '/your-service/v1/x/123' }
  },
  // only fuzzy
  {
    structureVersion: 2,
    toOneAssociations: [],
    exact: [],
    fuzzy: ['find me'],
    content: {
      ...searchDocumentContentBase2Examples[0],
      extraData: 'extra',
      moreInfo: { aDetail: 2, anotherDetail: true },
      aReference: '/my-service/a/canonical/uri'
    },
    embedded: { x: '/your-service/v1/x/123' }
  }
]

module.exports = {
  searchDocument2Examples,
  SearchDocument2: addExamples(SearchDocument2, searchDocument2Examples)
}
