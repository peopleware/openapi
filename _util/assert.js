/*
 * Copyright 2023 - 2024 PeopleWare n.v.
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
 * Evaluates the assertion, and throws if it returns a falsy value, or throws itself.
 *
 * If the assertion returns nominally with a truthy value, the function returns nominally.
 *
 * Introduced because `node:assert` cannot be used in a browser without a polyfill.
 */
function assert(assertion) {
  const assertionType = typeof assertion
  if (assertionType !== 'function') {
    const err = new Error(`assertion must be a function, but is of type '${assertionType}'`)
    err.assertion = assertion
    throw err
  }

  const outcome = assertion()
  if (!outcome) {
    const assertionStr = assertion.toString()
    const err = new Error(`assertion failed: ${assertionStr}`)
    err.assertion = assertion
    throw err
  }
}

module.exports = { assert }
