/*
 * Copyright 2022 – 2022 PeopleWare
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

const CRN = Joi.string()
  .trim()
  .pattern(/^[01]\d{9}$/)
  .custom((value, { error }) => {
    const first8 = value.slice(0, -2)
    const asInt = Number.parseInt(first8)
    const rest = 97 - (asInt % 97)
    if (value !== first8 + rest.toString(10).padStart(2, '0')) {
      return error('any.invalid')
    }

    return value
  }).description(`Company Registration Number: Belgian identification of organizations.

The [_company registration
number_](https://economie.fgov.be/en/themes/enterprises/crossroads-bank-enterprises/registration-crossroads-bank) (nl:
[_ondernemingsnummer_](https://economie.fgov.be/nl/themas/ondernemingen/kruispuntbank-van/inschrijving-de-kruispuntbank),
fr: [_numéro
d’entreprise_](https://economie.fgov.be/fr/themes/entreprises/banque-carrefour-des/inscription-la-banque), de:
[_Unternehmensnummer_](https://economie.fgov.be/de/themen/unternehmen/zentrale-datenbank-der/eintragung-die-zdu)) of
an organization is handed out by the Belgian government, and uniquely identifies an organization. It is impossible,
e.g., to legally do business in Belgium, or employ people, if the organization does not have a company registration
number. The company registration number is also used as Belgian VAT identifier (“VAT Number”).

The company registration number of an organization never changes. If you encounter an organization with a different
company registration number, it legally is a different organization. If you encounter an organization with the same
company registration number, it legally is the same organization, although its name, address, etcetera, might have
changed.

Because this identifier is in practice handed out by the Belgian [_Crossroads Bank for
Enterprises_](https://economie.fgov.be/en/themes/enterprises/crossroads-bank-enterprises) (CBE) (nl: [_Kruispuntbank
van Ondernemingen_](https://economie.fgov.be/nl/themas/ondernemingen/kruispuntbank-van) (KBO), fr: [_Banque-Carrefour
des Entreprises_](https://economie.fgov.be/fr/themes/entreprises/banque-carrefour-des) (BCE),
 de: [Zentrale Datenbank der Unternehmen](https://economie.fgov.be/de/themen/unternehmen/zentrale-datenbank-der)
(ZDU)), it is often referred to as “CBE number” / “KBO nummer” / “numéro BCE” / “ZDU nummer”.

There is no formatting in this representation.

A company registration number starts with \`0\` or \`1\` and consists of 8 numbers, followed by a modulo 97 checksum
(10 numbers in total).`)

const crnExamples = ['0453834195', '1453834119', '1234567401']

module.exports = { crnExamples, CRN: addExamples(CRN, crnExamples) }
