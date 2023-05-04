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

const addExamples = require('../_util/addExamples')
const { monetaryValueExamples, MonetaryValue } = require('./MonetaryValue')

const negativeMonetaryValueExamples = monetaryValueExamples.filter(mv => mv.amount < 0)

const amount = MonetaryValue.extract('amount')
  .negative()
  .example(-456568, { override: true })
  .description(
    `The represented amount of money, multiplied by 10<sup>decimals</sup>. This must be negative, and not 0.`
  )

const NegativeMonetaryValue = addExamples(MonetaryValue.append({ amount }), negativeMonetaryValueExamples)

module.exports = { negativeMonetaryValueExamples, NegativeMonetaryValue }
