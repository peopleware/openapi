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

/**
 * @typedef MonetaryValue
 * @property {CurrencyCode} currency
 */

/**
 * @type {MonetaryValue[]}
 */
const monetaryValueExamples = [{ currency: currencyCodes[0] }]

/**
 * @type ObjectSchema<MonetaryValue>
 */
const MonetaryValue = addExamples(
  Joi.object({
    currency: CurrencyCode.required(),
    factor: Joi.number().integer(),
    amount: Joi.number().integer().description(`The represented amount of money, multiplied by 10<sup>factor</sup>.`)
  }),
  monetaryValueExamples
).description(
  `Representation of an \`amount\` of money, in the given \`currency\`, with the given \`factor\`.


The \`amount\` of money is always expressed as an integer. The monetary value it represents is
<code>amount&nbsp;/&nbsp;10<sup>factor</sup></code> of the given \`currency\`.

Calculation with money amounts **MUST** be exact. This means that in essence only addition (which implies multiplication
with integeres) and subtraction is allowed, but division is forbidden. With any other arithmetic operation, the result
must explicitly be converted to  definite precision before continuing, without loosing or inventing any money. To what
precision this needs to done is an explicit business decision. E.g., to divide €&nbsp;10,00 amongst 3 people, we must
decide that we will work with a factor 2 (cents), and in some way hand out €&nbsp;3,33, €&nbsp;3,33, and _€&nbsp;3,34_,
or, alternatively, hand out €&nbsp;3,33 3 times, and decide what to do with the remaining _€&nbsp;0,01_.


Money amounts **MUST** be transported and calculated with as integers, and not as floats or doubles, because some
decimal fractions _cannot be represented as binary 32- or 64-bit floating point numbers_, e.g., \`0.1\`. If we intend
€&nbsp;0.1 as money amount, and we send the amount as \`0.1\` in JSON, it will be interpreted on reception as a number
close to, but not equal to \`0.1\`. If we want to calculate 3 times the money amount €&nbsp;0.1, and we execute
\`0.1 + 0.1 + 0.1\` or \`3 * 0.1\`, we get \`0.30000000000000004 ≠ 0.3\`.


In some programming languages, a special \`decimal\` type is offered for this reason, but still care has to be taken.
This is not supported in JSON.`
)

module.exports = { monetaryValueExamples, MonetaryValue }
