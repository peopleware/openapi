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
const addExamples = require('../_util/addExamples')

const AccountId = Joi.string().pattern(/^[\w-.~%!$&'()*+,;=]+$/).description(`Opaque id of an account.


For manual interactions, the account refers to one specific natural person. The above implies that we have to be able
to know from the value of this field as precise as possible to which organisation that natural person belongs. When we
automatically proces data input files, we need to make sure that we use a different account per data source, and not
one general account representing the overal import process.`)

const examples = ['y7_56b.953WP9']

module.exports = { accountIdExamples: examples, AccountId: addExamples(AccountId, examples) }
