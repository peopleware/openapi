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
const { Mode, modeExamples } = require('../id/Mode')
const { UUID, uuidExamples } = require('../id/UUID')

const SearchDocumentBase = StructureVersioned.append({
  id: Joi.string()
    .trim()
    .lowercase()
    .min(1)
    .pattern(/^([a-z0-9])([-=_a-z0-9]+)$/)
    .description(
      `Unique identifier of the search result. Can only contain alphanumeric chars and dashes (-), underscores (_) and equals signs (=).
       Can also not start with dash, underscore or equals sign.

       By convention this is the href value, without any parameters, converted to lowercase, with all invalid characters replaced with underscore (_),
       and the first character stripped if it was a dash, underscore or equals sign.`
    )
    .required(),
  flowId: UUID.description('The flowId with which the request was made').required(),
  mode: Mode.description('Value that describes the mode of the search document.').required(),
  href: RelativeURI.description(`Relative URI where the found resource's information is located.`).required(),
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
    .required()
})

const searchDocumentBaseExamples = structureVersionedExamples.map(svd => ({
  ...svd,
  id: 'service_name_service_version_type_name_type_unique_identifier',
  discriminator: 'service-name/type-name',
  flowId: uuidExamples[0],
  mode: modeExamples[0],
  href: '/service-name/service_version/type-name/type_unique_identifier'
}))

module.exports = {
  searchDocumentBaseExamples,
  SearchDocumentBase: addExamples(SearchDocumentBase, searchDocumentBaseExamples)
}
