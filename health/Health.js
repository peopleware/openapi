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

const addExamples = require('../_util/addExamples')
const Joi = require('joi')
const { Status, statusValues } = require('./Status')

const Health = Joi.object({
  status: Status.required()
}).unknown(true)

const healthExamples = statusValues.map(status => ({
  status
}))

module.exports = { healthExamples, Health: addExamples(Health, healthExamples) }
