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

const monetaryValueExamples = [
  { currency: currencyCodes[0], decimals: 4, amount: 7475005 },
  { currency: 'EUR', decimals: 2, amount: -84884 },
  { currency: 'USD', decimals: 4, amount: 0 },
  { currency: 'KRW', decimals: 0, amount: 84884 },
  { currency: 'XAU', decimals: -8, amount: 884 }
]

const MonetaryValue = addExamples(
  Joi.object({
    currency: CurrencyCode.required(),
    decimals: Joi.number()
      .integer()
      .required()
      .example(2)
      .example(0)
      .example(-2)
      .description(
        `The number of decimal places with which \`amount\` must be interpreted. A positive number means moving
the decimal point to the left. A negative number means adding zeros at the end.`
      ),
    amount: Joi.number()
      .integer()
      .required()
      .example(456568)
      .example(0)
      .example(-456568)
      .description(
        `The represented amount of money, multiplied by 10<sup>decimals</sup>. This can be positive, negative, or
0. The interpretation of the sign is context dependent.`
      )
  }),
  monetaryValueExamples
)
  .unknown(true)
  .description(
    `Representation of an \`amount\` of money, in the given \`currency\`, with the given \`decimals\`.

The \`amount\` of money is always expressed as an integer. The monetary value it represents is
<code>amount.10<sup>&#8239;‑decimals</sup></code> of the given \`currency\`. E.g.,
\`{"currency": "EUR", "decimals": 4, "amount": 88584439}\` represents €&nbsp;8&nbsp;858,4439.

Calculation with money amounts **MUST** be exact. Only addition (which implies multiplication with integers) and
subtraction is safe, but multiplication with non-integers (which implies division) and other operations are not. With
any other arithmetic operation, the result must explicitly be converted to  definite precision before continuing,
without loosing or inventing any money. To what precision this needs to done is an explicit business decision. E.g., to
divide €&nbsp;10,00 amongst 3 people, we must decide that we will work with a factor 2 (¢), and in some way hand out
€&nbsp;3,33, €&nbsp;3,33, and _€&nbsp;3,34_, or, alternatively, hand out €&nbsp;3,33 3 times, and decide what to do with
the remaining _€&nbsp;0,01_.

Money amounts **MUST** be transported and calculated with as integers, and not as floats or doubles, because some
decimal fractions, e.g., \`0.1\`, _cannot be represented as binary 32- or 64-bit floating point numbers_. If we intend
€&nbsp;0.1 as monetary value, and we represent the amount as \`0.1\` in JSON, it will be interpreted on reception as a
number close to, but not equal to \`0.1\`. If we want to calculate 3 times the monetary value €&nbsp;0.1, and we execute
\`0.1 + 0.1 + 0.1\` or \`3 * 0.1\`, we get \`0.30000000000000004 ≠ 0.3\`. When we instead represent the monetary value
as ¢&nbsp;10, there is no issue.

The largest \`amount\` that can be represented is
\`Number.MAX_SAFE_INTEGER\` = 9&nbsp;007&nbsp;199&nbsp;254&nbsp;740&nbsp;991, and the smallest is
\`Number.MIN_SAFE_INTEGER\` = -9&nbsp;007&nbsp;199&nbsp;254&nbsp;740&nbsp;991 (~&nbsp;±9∙10<sup>15</sup>). With 4
decimals, this could represent €&nbsp;900&nbsp;719&nbsp;925&nbsp;474,0991 ~ €&nbsp;900&nbsp;billion.

Note that, for addition, all terms must be converted to a representation with the largest \`decimal\` value of all
terms:

<pre>

{"currency": "EUR", "decimals": 4, "amount": 88584439} +

    {"currency": "EUR", "decimals": 2, "amount": 89418456}

= {"currency": "EUR", "decimals": 4, "amount": 88584439} +

    {"currency": "EUR", "decimals": 4, "amount": 8941845600}

= {"currency": "EUR", "decimals": 4, "amount": 9030430039}

</pre>`
  )

module.exports = { monetaryValueExamples, MonetaryValue }
