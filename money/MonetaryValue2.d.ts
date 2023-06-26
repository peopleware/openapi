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

import { TCurrencyCode } from './CurrencyCode'
import { ObjectSchema } from 'joi'
import { TDecimal } from '../number/Decimal'

export interface TMonetaryValue2 extends TDecimal {
  currency: TCurrencyCode
}

export const monetaryValue2Examples: Array<TMonetaryValue2>

export const MonetaryValue2: ObjectSchema<TMonetaryValue2>

export function monetaryValue2ToString(m: TMonetaryValue2): string

export function monetaryValueEqual(m1: TMonetaryValue2, m2: TMonetaryValue2): boolean
