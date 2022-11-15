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
const { Country } = require('./Country')
const addExamples = require('../_util/addExamples')
const { TrimmedString } = require('../string/TrimmedString')

const Address = Joi.object({
  line1: TrimmedString.required().description('First address line. Used together with `line2`. Not empty. Trimmed.'),
  line2: TrimmedString.optional().description('Second address line. Used together with `line1`. Not empty. Trimmed.'),
  postalCode: TrimmedString.required().description(
    'For some well-known `country`s, a pattern is enforced. E.g., for `BE`, the pattern is `^[1-9]\\d{3}&`. Not empty. Trimmed.'
  ),
  municipality: TrimmedString.required().description(
    'Name of the municipality of the address. Essentially free text (it is impossible in practice to validate this). Not empty. Trimmed.'
  ),
  country: Country.required()
}).unknown(true)

const baseExample = {
  line1: 'Duwijckstraat 17',
  postalCode: '2500',
  municipality: 'Lier',
  country: 'BE'
}

const examples = [baseExample, { ...baseExample, line2: 'office 234' }]

module.exports = { addressExamples: examples, Address: addExamples(Address, examples) }
