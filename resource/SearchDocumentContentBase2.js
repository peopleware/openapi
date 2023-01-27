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
const { StructureVersioned, structureVersionedExamples } = require('./StructureVersioned')
const addExamples = require('../_util/addExamples')
const { RelativeURI } = require('../string/RelativeURI')
const { StructureVersion } = require('./StructureVersion')
const { CanonicalURI } = require('../string/CanonicalURI')
const { CanonicalURIWithKnowledgeTime } = require('../string/CanonicalURIWithKnowledgeTime')
const { extendDescription } = require('../_util/extendDescription')

const searchDocumentContentBase2Examples = [
  {
    structureVersion: 2,
    discriminator: 'my-service/some-resource'
  }
]

const searchResultBase2Examples = [
  {
    ...searchDocumentContentBase2Examples[0],
    href: '/my-service/v6/some-resource/564845?at=2021-01-19T17:14:18.482558Z'
  }
]

const searchResultBaseTailoring = 'searchResult'

/**
 * Included in service search documents as `content`, and used in search results returned by the search service. In the
 * latter case, the property `href` is added, via the tailoring `searchResult`.
 *
 * @type {Joi.Schema<{structureVersion: number, discriminator: string}>}
 */
const SearchDocumentContentBase2 = addExamples(
  StructureVersioned.append({
    structureVersion: StructureVersion.valid(Joi.override, 2)
      .example(2, { override: true })
      .required(),
    discriminator: Joi.string()
      .trim()
      .lowercase()
      .min(1)
      .pattern(/^([-a-z0-9]+)\/([-a-z0-9\/]+)$/)
      .description(
        `Type of the indexed resource.

This enables users to search only on particular resource type. The type is qualified with the service name, to avoid
name clashes (slash-separated).`
      )
      .example('my-service/some-resource')
      .required()
  }).description(
    `The resource's search document with the most up-to-date information, i.e., up-to-date up until, but not including,
\`x-date\`.

This is a contract between this service and clients of the search service. Specific properties are added for different
\`discriminators\`. When returned by the search service, the property \`href\` is added. This is the canonical URI of
the found resource, including an \`at\` query parameter, that refers to the precise version of the found resource that
was indexed.`
  ),
  searchDocumentContentBase2Examples
).alter({
  [searchResultBaseTailoring]: schema =>
    addExamples(
      schema.append({
        href: extendDescription(
          CanonicalURIWithKnowledgeTime,
          `Canonical URI where the found resource's information is located. The \`at\` parameter _must_ be the
same as the value of the \`x-date\` response header.

Users need to be directed to the version returned by the search index, and not an earlier or more recent
version. The search engine updates, eventually, after a few seconds. If a more recent version is available in
the meantime, the user interface makes it possible for the user to navigate to that version.`
        ).required()
      }),
      searchResultBase2Examples
    )
})

module.exports = {
  searchDocumentContentBase2Examples,
  searchResultBase2Examples,
  SearchDocumentContentBase2,
  searchResultBaseTailoring,
  SearchResultBase2: SearchDocumentContentBase2.tailor(searchResultBaseTailoring)
}
