/*
 * Copyright 2020 - 2022 PeopleWare n.v.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const Joi = require('joi')
const { StructureVersion } = require('../resource/StructureVersion')
const { Timestamped } = require('./Timestamped')
const { dateTimeExamples } = require('../time/DateTime')
const { StructureVersioned, structureVersionedExamples } = require('./StructureVersioned')
const addExamples = require('../_util/addExamples')

const HistoryVersion = Timestamped.append({
  href: Joi.string()
    .uri({ relativeOnly: true })
    .min(1)
    .required()
    .description(
      `relative URI at which this version of the person's personal information can be retrieved (includes a
query parameter \`at\`, which is the same as this object's \`createdAt\`)`
    )
}).unknown(true)

const historyVersionExamples = [
  { createdAt: '2022-08-04T18:48:44.003Z', href: '.?at=2022-08-04T18:48:44.003Z' },
  { createdAt: '2020-01-23T15:22:39.212Z', href: '.?at=2020-01-23T15:22:39.212Z' }
]

const History = StructureVersioned.append({
  versions: Joi.array()
    .items(HistoryVersion.required())
    .sort({ order: 'descending', by: 'createdAt' })
    .required()
    .description('list of history versions, ordered from most recent to oldest')
}).unknown(true)
  .description(`A list of the different times at which the person's information was changed, ordered from most to least
recent, with links to retrieve that version of the personal information. Changes \`< x-date\` are included.


This call does not use paging, because we expect less than 50 changes to the personal information of a person
over the person's lifetime.`)

const historyExamples = structureVersionedExamples.map(svd => ({ ...svd, versions: historyVersionExamples }))

module.exports = {
  historyVersionExamples,
  HistoryVersion: addExamples(HistoryVersion, historyVersionExamples),
  historyExamples,
  History: addExamples(History, historyExamples)
}
