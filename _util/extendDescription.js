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

/**
 * Extend the description of `schema` with `extraDescription`.
 *
 * If `addAddEnd` is truthy, the `extraDescription` is added at the end. Otherwise, it is added at the front. There is
 * always blank line between the existing and `extraDescription`.
 *
 * This is not supported in browser environments. There, the description of `schema` is replaced with
 * `extraDescription`.
 *
 * @param {Joi.Schema} schema
 * @param {string} extraDescription
 * @param {boolean} [addAddEnd]
 */
function extendDescription (schema, extraDescription, addAddEnd) {
  try {
    const originalDescription = schema.describe().flags.description

    const extendedDescription = addAddEnd
      ? `${originalDescription}

${extraDescription}`
      : `${extraDescription}

${originalDescription}`

    return schema.description(extendedDescription)
  } catch (_) {
    // describe() is not supported in browser environments; only retain the `extraDescription`
    return schema.description(extraDescription)
  }
}

module.exports = { extendDescription }
