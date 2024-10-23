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

import * as Joi from 'joi'
import { TrimmedString } from '../string/TrimmedString'
import { Country } from './Country'

export declare type Address = {
  line1: TrimmedString
  line2?: TrimmedString
  postalCode: TrimmedString
  municipality: TrimmedString
  country: Country
}

export declare const Address: Joi.ObjectSchema<Address>

export declare const addressExamples: Array<Address>
