/*
 * Copyright 2020 - 2022 PeopleWare n.v.
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
const Joi = require('joi')
/** @type {Contract} */ const { Contract } = require('@toryt/contracts-v')
const { validateSchema } = require('../_util/validateSchema')

const constants = {
  OK: 'OK',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  UNREACHABLE: 'UNREACHABLE'
}

const statusValues = Object.values(constants)

const statusCode = {
  OK: 200,
  WARNING: 270,
  ERROR: 470
  // we can never answer UNREACHABLE, since we are reachable to answer
}

const Status = addExamples(Joi.valid(...statusValues), statusValues).description(`
- OK: 200 — the service is running within specifications;
- WARNING: 270 — the service is running, but some requirements are not fulfilled;
- ERROR: 470 — the service is running, but some crucial specifications are not fulfilled, and operation is not guaranteed;
- UNREACHABLE: 500 — the service is not running or not available`)

const RequiredStatus = Status.required()

/**
 * @param {string} acc - the consolidated {@link Status} so far
 * @param {string} status - the {@link Status} to consolidate into `acc`
 * @param {boolean} required - whether `status` is to be considered required in the result
 */
const consolidate = new Contract({
  pre: [
    acc => validateSchema(RequiredStatus, acc),
    acc => acc !== constants.UNREACHABLE,
    (acc, status) => validateSchema(RequiredStatus, status)
    // required is truthy or falsy
  ],
  post: [
    function (acc, status, required) {
      return Contract.outcome(arguments) !== constants.OK || (acc === constants.OK && status === constants.OK)
    },
    function (acc, status, required) {
      return (
        Contract.outcome(arguments) !== constants.WARNING ||
        (acc === constants.OK &&
          (status === constants.WARNING ||
            ((status === constants.ERROR || status === constants.UNREACHABLE) && !required))) ||
        (acc === constants.WARNING && (!required || (status !== constants.ERROR && status !== constants.UNREACHABLE)))
      )
    },
    function (acc, status, required) {
      return (
        Contract.outcome(arguments) !== constants.ERROR ||
        acc === constants.ERROR ||
        ((status === constants.ERROR || status === constants.UNREACHABLE) && required)
      )
    },
    function () {
      return Contract.outcome(arguments) !== constants.UNREACHABLE
    }
  ]
}).implementation(function consolidate (acc, status, required) {
  // we can never answer UNREACHABLE, since we are reachable to answer
  switch (acc) {
    case constants.OK:
      switch (status) {
        case constants.OK:
          return acc
        case constants.WARNING:
          return status
        default:
          // ERROR, UNREACHABLE
          return required ? constants.ERROR : constants.WARNING
      }
    case constants.WARNING:
      switch (status) {
        case constants.OK:
        case constants.WARNING:
          return acc
        default:
          // ERROR, UNREACHABLE
          return required ? constants.ERROR : constants.WARNING
      }
    default:
      // ERROR, UNREACHABLE
      return constants.ERROR
  }
})

module.exports = { ...constants, statusValues, Status: addExamples(Status, statusValues), statusCode, consolidate }
