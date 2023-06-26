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

const { CurrencyCode, currencyCodes } = require('./CurrencyCode')
const addExamples = require('../_util/addExamples')
const { Decimal, decimalToString, decimalEqual, constrainedDecimal } = require('../number/Decimal')
const { extendDescription } = require('../_util/extendDescription')
const Joi = require('joi')

const monetaryValue2Examples = [
  { currency: currencyCodes[0], decimals: 4, value: 7475005 },
  { currency: 'EUR', decimals: 2, value: -84884 },
  { currency: 'USD', decimals: 4, value: 0 },
  { currency: 'KRW', decimals: 0, value: 84884 },
  { currency: 'XAU', decimals: -8, value: 884 }
]

const MonetaryValue2 = addExamples(
  extendDescription(
    Decimal.append({
      currency: CurrencyCode.required()
    }),
    `Representation of an amount of money, in the given \`currency\`, with the given \`decimals\`.

E.g., \`{"currency": "EUR", "decimals": 4, "value": 88584439}\` represents €&nbsp;8&nbsp;858,443&nbsp;9.`
  ),
  monetaryValue2Examples
)

function monetaryValue2ToString({ currency, decimals, value }) {
  return `${currency} ${decimalToString({ decimals, value })}`
}

function monetaryValueEqual(m1, m2) {
  return decimalEqual(m1, m2) && m1.currency === m2.currency
}

/**
 * Get examples in a way that is safe in the browser too (describe() is not supported there). In the browser, no
 * examples are returned.
 */
function getExamples(MonetaryValue2Schema) {
  try {
    return MonetaryValue2Schema.describe().examples
  } catch (_) {
    return []
  }
}

function constrainedMonetaryValue2(MonetaryValue2Schema, currency, decimals, limits) {
  const currencySchema = extendDescription(
    MonetaryValue2Schema.extract('currency'),
    `In this case, this is fixed to ${currency}.`,
    true
  )
    .valid(Joi.override, currency)
    .example(currency, { override: true })
  const constrainedSchema = constrainedDecimal(
    extendDescription(
      MonetaryValue2Schema.append({
        currency: currencySchema
      }),
      `The currency is ${currency}.`
    ),
    decimals,
    limits
  )
  const examples = getExamples(constrainedSchema).map(eg => ({ currency, ...eg }))
  return addExamples(constrainedSchema, examples)
}

module.exports = {
  monetaryValue2Examples,
  MonetaryValue2,
  monetaryValue2ToString,
  monetaryValueEqual,
  constrainedMonetaryValue2
}
