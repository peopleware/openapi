/*
 * Copyright 2020 - 2023 PeopleWare n.v.
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
const { CurrencyCode, currencyCodes } = require('./CurrencyCode')
const addExamples = require('../_util/addExamples')
const {Decimal} = require("../number/Decimal");

const monetaryValue2Examples = [
  { currency: currencyCodes[0], decimals: 4, value: 7475005 },
  { currency: 'EUR', decimals: 2, value: -84884 },
  { currency: 'USD', decimals: 4, value: 0 },
  { currency: 'KRW', decimals: 0, value: 84884 },
  { currency: 'XAU', decimals: -8, value: 884 }
]

const MonetaryValue2 = addExamples(
  Decimal.append({
    currency: CurrencyCode.required()
  }),
  monetaryValue2Examples
)
  .unknown(true)
  .description(
    `Representation of an \`amount\` of money, in the given \`currency\`, with the given \`decimals\`.

The \`amount\` of money is always expressed as an integer. The monetary value it represents is
<code>value.10<sup>&#8239;‑decimals</sup></code> of the given \`currency\`. E.g.,
\`{"currency": "EUR", "decimals": 4, "value": 88584439}\` represents €&nbsp;8&nbsp;858,4439.

Note that, for addition, all terms must be converted to a representation with the smallest \`decimal\` value of all
terms:

<pre>

{"currency": "EUR", "decimals": 4, "value": 88584439} +

    {"currency": "EUR", "decimals": 2, "value": 89418456}

= {"currency": "EUR", "decimals": 2, "value": 885844} +

    {"currency": "EUR", "decimals": 2, "value": 89418456}

= {"currency": "EUR", "decimals": 2, "value": 90304300}

</pre>`
  )

module.exports = { monetaryValue2Examples, MonetaryValue2 }
