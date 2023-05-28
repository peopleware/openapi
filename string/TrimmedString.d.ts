/*
 * Copyright 2022 – 2023 PeopleWare
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

import { StringSchema } from 'joi'

export type TTrimmedString = string

/**
 * @deprecated Use TTrimmedString as type. This type definition conflicts with the Joi schema in WebStorm.
 */
export type TrimmedString = TTrimmedString

export const TrimmedString: StringSchema<TTrimmedString>

export const trimmedStringExamples: Array<TTrimmedString>
