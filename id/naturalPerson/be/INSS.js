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

const INSS = Joi.string()
  .pattern(/^\d{11}$/)
  .custom((value, { error }) => {
    const first9 = value.substring(0, 9)
    const rest = 97 - Number.parseInt(value.substring(9))

    function validBefore2000(identification) {
      const asInt = Number.parseInt(first9)
      return asInt % 97 === rest
    }

    function validAfter2000(identification) {
      const asInt = Number.parseInt(`2${first9}`)
      return asInt % 97 === rest
    }

    if (validBefore2000(value) || validAfter2000(value)) {
      return value
    }
    return error('any.invalid')
  })
  .description(`The Belgian INSS (en: Identification Number Social Security / nl: INSZ — Identificatienummer Sociale Zekerheid / fr:
NISS — Numéro d'Identification Sécurité Sociale / de: ENSS — Erkennungsnummer der Sozialen Sicherheit) of the person
since \`createdAt\`. This is either the national registration number or the BIS-number. There is no formatting in this
representation.


Due to Belgian labour law, every person who works in Belgium has an INSS.


Note that the INSS of a person can change over time, but only 1 value is applicable at any time. This is the INSS
that we assume to be applicable for this person since \`createdAt\`.`)

const examples = ['86081203314', '04031800277']

module.exports = { inssExamples: examples, INSS: addExamples(INSS, examples) }
