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

import { ObjectSchema } from 'joi'

export interface TDecimal {
  decimals: number
  value: number
}

export const decimalExamples: Array<TDecimal>

export const Decimal: ObjectSchema<TDecimal>

export function decimalToString(decimal: TDecimal): string

export function decimalEqual(d1: TDecimal, d2: TDecimal): boolean

export function constrainedDecimal(
  DecimalSchema: ObjectSchema<TDecimal>,
  decimals: number,
  min: number | undefined,
  max: number | undefined
): ObjectSchema<TDecimal>
