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
const { RelativeURI } = require('../string/RelativeURI')

const SearchDocumentBase = StructureVersioned.append({
  href: RelativeURI.description(
    `Relative URI where the found resource's information is located. The \`at\` parameter _must_ be the
same as the value of the \`x-date\` response header.

Users need to be directed to the version returned by the search index, and not an earlier or more recent
version. The search engine updates, eventually, after a few seconds. If a more recent version is available in
the meantime, the user interface makes it possible for the user to navigate to that version.`
  ).required(),
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
    .example('service-name/type-name')
    .required()
}).description(
  `The resource's search document with the most up-to-date information, i.e., up-to-date up until, but not including, \`x-date\`.`
)

const searchDocumentBaseExamples = structureVersionedExamples.map(svd => ({
  ...svd,
  discriminator: 'service-name/type-name',
  href: '/service-name/service_version/type-name/type_unique_identifier?at=2021-01-19T17:14:18.482Z'
}))

module.exports = {
  searchDocumentBaseExamples,
  SearchDocumentBase: addExamples(SearchDocumentBase, searchDocumentBaseExamples)
}
