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

const SearchDocumentBase = StructureVersioned.append({
  href: Joi.string()
    .uri({ relativeOnly: true })
    .min(1)
    .required()
    .description(
      `Relative URI where the found resource's information is located. The \`at\` parameter _must_ be the
same as the resource's \`createdAt\`.`
    )
})

const searchDocumentBaseExamples = structureVersionedExamples.map(svd => ({
  ...svd,
  href: '..?at=2021-01-19T17:14:18.482Z'
}))

module.exports = {
  searchDocumentBaseExamples,
  SearchDocumentBase: addExamples(SearchDocumentBase, searchDocumentBaseExamples)
}
