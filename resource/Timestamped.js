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
const { readOnlyAlteration } = require('./_readOnlyAlteration')
const { dateTimeExamples, DateTime } = require('../time/DateTime')
const addExamples = require('../_util/addExamples')

const Timestamped = Joi.object({
  createdAt: DateTime.required()
    .description(
      `SoT of the resource action that \`put\`ed or \`post\`ed this item version, as ISO-8601 expressed in UTC ('Z'), to ms precision.


Sent by the server in read. Ignored in create and update.`
    )
    .alter(readOnlyAlteration)
}).unknown(true)

const examples = dateTimeExamples.map(dt => ({ createdAt: dt }))

module.exports = { timestampedExamples: examples, Timestamped: addExamples(Timestamped, examples) }
