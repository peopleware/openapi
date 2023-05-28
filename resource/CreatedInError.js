/*
 * Copyright 2021 – 2023 PeopleWare
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
 */

const Joi = require('joi')
const { Audited } = require('./Audited')
const addExamples = require('../_util/addExamples')
const { StructureVersioned } = require('./StructureVersioned')

const createdInErrorExamples = [
  {
    structureVersion: 1,
    createdAt: '2022-08-18T14:57:39.732Z',
    createdBy: 'klkuij39035',
    createdInError: true
  }
]

const CreatedInError = addExamples(
  StructureVersioned.concat(Audited.tailor('read'))
    .append({
      createdInError: Joi.boolean()
        .valid(true)
        .example(true)
        .description('Marks the resource as created in error')
        .required()
    })
    .description(`The resource was created in error. There are no properties, except for the audit properties.`),
  createdInErrorExamples
)

module.exports = {
  createdInErrorExamples,
  CreatedInError
}
