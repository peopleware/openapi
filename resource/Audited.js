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

const { Timestamped, timestampedExamples } = require('./Timestamped')
const { readOnlyAlteration } = require('./_readOnlyAlteration')
const { accountIdExamples, AccountId } = require('../id/AccountId')
const addExamples = require('../_util/addExamples')

const Audited = Timestamped.keys({
  createdBy: AccountId.description(
    `Opaque id of the account that executed the resource action that \`put\`ed or \`post\`ed this item version.


For manual interactions, the account refers to one specific natural person. The above implies that we have
to be able to know from the value of this field as precise as possible to which organisation that natural
person belongs. When we automatically proces data input files, we need to make sure that we use a
different account per data source, and not one general account representing the overal import process.`
  )
    .meta({ readOnly: true })
    .alter(readOnlyAlteration)
})

const examples = timestampedExamples.reduce(
  (acc1, timestamped) =>
    accountIdExamples.reduce((acc2, accountId) => {
      acc2.push({ ...timestamped, createdBy: accountId })
      return acc2
    }, acc1),
  []
)

module.exports = { auditedExamples: examples, Audited: addExamples(Audited, examples) }
