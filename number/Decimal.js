/*
 * Copyright 2023 - 2023 PeopleWare n.v.
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
const assert = require('assert')
const addExamples = require('../_util/addExamples')
const { extendDescription } = require('../_util/extendDescription')

const decimalExamples = [
  { decimals: 4, value: 7475005 },
  { decimals: 2, value: -84884 },
  { decimals: 4, value: 0 },
  { decimals: 0, value: 84884 },
  { decimals: -8, value: 884 }
]

const Decimal = addExamples(
  Joi.object({
    decimals: Joi.number()
      .integer()
      .required()
      .example(2)
      .example(0)
      .example(-2)
      .description(
        `The number of decimal places with which \`value\` must be interpreted. A positive number means moving
the decimal point to the left. A negative number means adding zeros at the end.`
      ),
    value: Joi.number()
      .integer()
      .required()
      .example(456568)
      .example(0)
      .example(-456568)
      .description(
        `The represented decimal number, multiplied by 10<sup>decimals</sup>. This can be positive, negative, or
0. The interpretation of the sign is context dependent.`
      )
  }),
  decimalExamples
)
  .unknown(true)
  .description(
    `The \`value\` is always expressed as an integer. The decimal it represents is
<code>value.10<sup>&#8239;‑decimals</sup></code>. E.g., \`{"decimals": 4, "value": 88584439}\` represents 858,4439.

Calculation with decimals **MUST** be exact. Only addition (which implies multiplication with integers) and
subtraction is safe, but multiplication with non-integers (which implies division) and other operations are not. With
any other arithmetic operation, the result must explicitly be converted to  definite precision before continuing. To
what precision this needs to done is an explicit business decision. E.g., to divide 10,00 in 3 parts, we must decide
that we will work with a factor 2, and in some way get 3,33, 3,33, and _3,34_, or, alternatively, get 3,33 3 times, and
decide what to do with the remaining _0,01_.

Decimals **MUST** be transported and calculated with as integers, and not as floats or doubles, because some decimal
fractions, e.g., \`0.1\`, _cannot be represented as binary 32- or 64-bit floating point numbers_. If we intend 0.1, and
we represent the value as \`0.1\` in JSON, it will be interpreted on reception as a number close to, but not equal to
\`0.1\`. If we want to calculate 3 times decimal 0.1, and we execute \`0.1 + 0.1 + 0.1\` or \`3 * 0.1\`, we get
\`0.30000000000000004 ≠ 0.3\`. When we instead represent the decimal as 10.10<sup>-2</sup>, there is no issue:
<code>10.10<sup>-2</sup> + 10.10<sup>-2</sup> + 10.10<sup>-2</sup> = (10 + 10 + 10).10<sup>-2</sup> =
30.10<sup>-2</sup></code>.

The largest \`value\` that can be represented is
\`Number.MAX_SAFE_INTEGER\` = 9&nbsp;007&nbsp;199&nbsp;254&nbsp;740&nbsp;991, and the smallest is
\`Number.MIN_SAFE_INTEGER\` = -9&nbsp;007&nbsp;199&nbsp;254&nbsp;740&nbsp;991 (~&nbsp;±9∙10<sup>15</sup>). With 4
decimals, this could represent 900&nbsp;719&nbsp;925&nbsp;474,0991 ~ 900&nbsp;billion.

Note that, for addition, all terms must be converted to a representation with the smallest \`decimal\` value of all
terms:

<pre>

{"decimals": 4, "value": 88584439} +

    {"decimals": 2, "value": 89418456}

= {"decimals": 2, "value": 885844} +

    {"decimals": 2, "value": 89418456}

= {"decimals": 2, "value": 90304300}

</pre>`
  )

function decimalToString({ decimals, value }) {
  function trios(s) {
    if (s.length <= 3) {
      return s
    }

    return `${trios(s.slice(0, -3))} ${s.slice(-3)}`
  }

  function soirt(s) {
    if (s.length <= 3) {
      return s
    }

    return `${s.slice(0, 3)} ${soirt(s.slice(3))}`
  }

  const isNegative = value < 0
  const absValueString = isNegative ? value.toFixed().slice(1) : value.toFixed()
  let absResult
  if (decimals <= 0) {
    absResult = trios(value === 0 ? '0' : absValueString + '0'.repeat(-decimals))
  } else {
    const beforeComma = trios(absValueString.slice(0, -decimals))
    const afterComma = soirt(absValueString.slice(-decimals).padStart(decimals, '0'))
    absResult = `${beforeComma === '' ? '0' : beforeComma},${afterComma}`
  }

  return isNegative ? `-${absResult}` : absResult
}

/**
 * Fix the `decimals` property to the given value, and `value` between the given `min` and `max`.
 *
 * ## Preconditions
 *
 * * `min < max`
 */
function constrainedDecimal(DecimalSchema, decimals, min, max) {
  assert(min < max)
  const decimalsSchema = Decimal.extract('decimals')
    .valid(decimals)
    .example(decimals, { override: true })
    .description(`The number of decimal places with which \`value\` must be interpreted. Must equal ${decimals}.`)
  const valueExamples = [Math.round((max + min) / 3), Math.round((max + min) / 2), min, max]
  const valueSchema = addExamples(
    Decimal.extract('value')
      .min(min)
      .max(max)
      .description(
        `The represented decimal number, multiplied by 10<sup>decimals</sup>. Must be in the interval [${min}; ${max}],`
      ),
    valueExamples
  )
  const adaptedExamples = valueExamples.map(value => ({ decimals, value }))
  return addExamples(
    extendDescription(
      DecimalSchema.append({ decimals: decimalsSchema, value: valueSchema }),
      `The value has ${decimals} decimals, and must be in the interval
    [${decimalToString({ value: min, decimals })}; ${decimalToString({ value: max, decimals })}]`
    ),
    adaptedExamples
  )
}

module.exports = { decimalExamples, Decimal, decimalToString, constrainedDecimal }
