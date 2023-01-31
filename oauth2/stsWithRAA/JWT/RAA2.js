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
const { Prefix } = require('./Prefix')
const { RAX } = require('./RAX')

const example = {
  '/openapi/common/v1': '*:/a/path/*/to/{a,multiple}/resources/**',
  '/openapi/other/v4': '{GET,PUT}:/another/path/43/without/choices',
  '/openapi/other/v4/another/path/43/without': 'POST:'
}

const RAA2 = Joi.object().pattern(Prefix.required(), RAX.required()).unknown(false).min(1).example(example)

module.exports = { raa2Examples: [example], RAA2 }
