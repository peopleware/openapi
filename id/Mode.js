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
const { uuidPattern } = require('./UUID')

const ISODateToSecondPattern =
  /\d{4}-((0[13578]|10|12)-(0[1-9]|[1-2]\d|30|31)|02-(0[1-9]|1\d|2[0-9])|(0[469]|11)-(0[1-9]|[1-2]\d|30))T([01]\d|2[0-3])(:[0-5]\d){2}Z/

const ISODateToSecond = Joi.string()
  .trim()
  .pattern(new RegExp(`^${ISODateToSecondPattern.source}$`))

const ISODateToSecondExamples = [
  '2012-01-01T18:21:06Z',
  '2012-01-10T18:21:06Z',
  '2012-01-12T18:21:06Z',
  '2012-01-20T18:21:06Z',
  '2012-01-29T18:21:06Z',
  '2012-01-30T18:21:06Z',
  '2012-01-31T18:21:06Z',
  '2012-02-01T18:21:06Z',
  '2012-02-28T18:21:06Z',
  '2012-02-29T18:21:06Z',
  '2012-03-31T18:21:06Z',
  '2012-04-01T18:21:06Z',
  '2012-04-10T18:21:06Z',
  '2012-04-19T18:21:06Z',
  '2012-04-20T18:21:06Z',
  '2012-04-29T18:21:06Z',
  '2012-04-30T18:21:06Z',
  '2012-05-31T18:21:06Z',
  '2012-06-30T18:21:06Z',
  '2012-07-31T18:21:06Z',
  '2012-08-31T18:21:06Z',
  '2012-09-30T18:21:06Z',
  '2012-10-31T18:21:06Z',
  '2012-11-30T18:21:06Z',
  '2012-12-31T18:21:06Z',
  '2012-12-31T00:00:00Z',
  '2012-12-31T04:21:06Z',
  '2012-12-31T10:21:06Z',
  '2012-12-31T14:21:06Z',
  '2012-12-31T19:21:06Z',
  '2012-12-31T20:21:06Z',
  '2012-12-31T23:21:06Z',
  '2012-12-31T19:00:06Z',
  '2012-12-31T19:01:06Z',
  '2012-12-31T19:09:06Z',
  '2012-12-31T19:20:06Z',
  '2012-12-31T19:33:06Z',
  '2012-12-31T19:49:06Z',
  '2012-12-31T19:59:06Z',
  '2012-12-31T19:01:00Z',
  '2012-12-31T19:01:01Z',
  '2012-12-31T19:01:09Z',
  '2012-12-31T19:01:10Z',
  '2012-12-31T19:01:23Z',
  '2012-12-31T19:01:39Z',
  '2012-12-31T19:01:51Z',
  '2012-12-31T19:01:59Z'
]

const automatedTestPattern = new RegExp(`automated-test-${uuidPattern.source}`)
const qaPattern = /qa-\d+/
const acceptancePattern = /acceptance-\d+/
const migrationPattern = new RegExp(`migration-${ISODateToSecondPattern.source}`)

const composeRegexes = (...regexes) => new RegExp(`^${regexes.map(regex => regex.source).join('|')}$`)

const modePattern = composeRegexes(
  /production/,
  /simulation/,
  automatedTestPattern,
  qaPattern,
  acceptancePattern,
  migrationPattern,
  /demo/,
  /dev-experiment/
)

const Mode = Joi.string().pattern(modePattern)

const modeExamples = [
  'production',
  'simulation',
  'automated-test-701927f0-171e-4199-bff8-bb54e15b8481',
  'qa-4',
  'qa-00004',
  'acceptance-6',
  'acceptance-00643',
  'migration-2012-02-29T18:21:06Z',
  'demo',
  'dev-experiment'
]

module.exports = {
  ISODateToSecondPattern,
  automatedTestPattern,
  qaPattern,
  acceptancePattern,
  migrationPattern,
  ISODateToSecondExamples,
  ISODateToSecond: addExamples(ISODateToSecond, ISODateToSecondExamples),
  modeExamples,
  Mode: addExamples(Mode, modeExamples)
}
