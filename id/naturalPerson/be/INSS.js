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
const addExamples = require('../../../_util/addExamples')

const INSS = Joi.string().pattern(/\d{11}/)
  .description(`The Belgian INSS (en: Identification Number Social Security / nl: INSZ — Identificatienummer Sociale Zekerheid / fr:
NISS — Numéro d'Identification Sécurité Sociale / de: ENSS — Erkennungsnummer der Sozialen Sicherheit) of the person
since \`createdAt\`. This is either the national registration number or the BIS-number. There is no formatting in this
representation.


Due to Belgian labour law, every person who works in Belgium has an INSS.


Note that the INSS of a person can change over time, but only 1 value is applicable at any time. This is the INSS
that we assume to be applicable for this person since \`createdAt\`.`)

const examples = ['86111201234']

module.exports = { inssExamples: examples, INSS: addExamples(INSS, examples) }
