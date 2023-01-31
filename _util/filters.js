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

function notEmptyArray(s) {
  return !Array.isArray(s) || s.length > 0
}

function notTrimmedString(s) {
  return typeof s !== 'string' || s.length <= 0 || s.trim() !== s
}

function notEmptyObject(s) {
  return (typeof s !== 'object' || s === null || Array.isArray(s) || Object.keys(s).length > 0) && !(s instanceof Date)
}

module.exports = { notEmptyArray, notTrimmedString, notEmptyObject }
