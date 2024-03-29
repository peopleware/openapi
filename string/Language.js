/*
 * Copyright 2022 - 2023 PeopleWare n.v.
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
const addExamples = require('../_util/addExamples')

const Language = Joi.string()
  .pattern(/^[a-z]{2}(-[A-Z]{2})?$/)
  .description(
    `Language to be used in communication with the subject. The value is expressed according to
[BCP 47](https://tools.ietf.org/html/bcp47), using an [ISO 639-1 alpha-2](https://en.wikipedia.org/wiki/ISO_639-1)
language code, optionally localised with the [ISO 3166 1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
2-letter country code. See [Language localisation](https://en.wikipedia.org/wiki/Language_localisation).`
  )

const examples = ['fr-BE', 'nl']

module.exports = { languageExamples: examples, Language: addExamples(Language, examples) }
