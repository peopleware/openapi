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

const Month = Joi.string().pattern(/^\d{4}-(0[1-9]|1[0-2])$/).description(`A month in the history of the universe.

This is a fuzzy description of a time interval, given timezones. This is stored, communicated, and visualized as-is,
and interpreted locally.

Uses the ISO-8601 representation.`)

const examples = ['2020-01', '1999-01']

module.exports = { monthExamples: examples, Month: addExamples(Month, examples) }
