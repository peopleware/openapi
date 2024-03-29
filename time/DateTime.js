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

const DateTime = Joi.string()
  .pattern(/^\d{4}-(0[1-9]|1[0-2])-((0[1-9]|[1-2]\d)|30|31)T(0\d|1\d|2[0-3]):([0-5]\d):([0-5]\d)\.\d{3,}Z$/)
  .description("Moment in time, as ISO-8601 expressed in UTC ('Z'), to ms precision or more precise.")

const examples = ['2020-01-23T15:22:39.212Z', '2020-01-23T15:22:39.21254888Z']

module.exports = { dateTimeExamples: examples, DateTime: addExamples(DateTime, examples) }
