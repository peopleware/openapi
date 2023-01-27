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

const searchDocumentContentBase2Examples = [
  {
    structureVersion: 2,
    discriminator: 'my-service/some-resource'
  }
]

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
    `The resource's search document with the most up-to-date information, i.e., up-to-date up until, but not including, \`x-date\`.

This is a contract between this service and clients of the search service. Specific properties are added for different \`discriminators\`.`
  ),
  searchDocumentContentBase2Examples
)

module.exports = {
  searchDocumentContentBase2Examples,
  SearchDocumentContentBase2
}
