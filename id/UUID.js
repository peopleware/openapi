/*
 * Copyright 2021 – 2022 PeopleWare
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
const addExamples = require('../_util/addExamples')

const uuidPattern = /[\da-fA-F]{8}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{12}/

const UUID = Joi.string().uuid({
  version: ['uuidv4']
})

const uuidExamples = ['611e148e-734d-4fe6-ae9b-b3b61d66cd27']

module.exports = { uuidPattern, uuidExamples, UUID: addExamples(UUID, uuidExamples) }
