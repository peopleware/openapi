/*
 * Copyright 2021 – 2022 PeopleWare
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

const Joi = require('joi')
const { uuidExamples, UUID } = require('../id/UUID')
const { DateTime, dateTimeExamples } = require('../time/DateTime')
const { Mode } = require('../id/Mode')

const commonResponseHeadersNoModeExample = {
  'x-flow-id': uuidExamples[0],
  'x-date': dateTimeExamples[0]
}

const commonResponseHeadersExample = {
  ...commonResponseHeadersNoModeExample,
  'x-mode': 'automated-test-80bc89de-10df-4aa4-ae91-4105b5e1f012',
  'x-service-build': '01234'
}

/**
 * We require an `x-flow-id`, and `x-date` header in all responses.
 *
 * An `x-mode` response header is required in all responses, except the `x-mode` in the request is missing or invalid,
 * and the service cannot return a valid `x-mode` (which can be reported in a `400`, `401`, or `403`).
 *
 * - in the nominal schema, an `x-mode` header is required
 * - with the `allowMissingMode` alteration, the `x-mode` header is optional, but has to have a valid value if there is
 *   one
 * - with the `noMode` alteration, the `x-mode` header is explicitly forbidden
 *
 * @type {Joi.ObjectSchema<any>}
 */
const CommonResponseHeaders = Joi.object({
  'x-flow-id': UUID.description('the flowId with which the request to which this is the response was made').required(),
  'x-mode': Mode.description('the mode with which the request to which this is the response was made')
    .required()
    .alter({ allowMissingMode: schema => schema.optional(), noMode: schema => schema.forbidden() }),
  'x-date': DateTime.required()
})
  .unknown(true)
  .example(commonResponseHeadersExample)
  .alter({
    allowMissingMode: schema => schema.example(commonResponseHeadersNoModeExample),
    noMode: schema => schema.example(commonResponseHeadersNoModeExample, { override: true })
  })

module.exports = {
  commonResponseHeadersExamples: [commonResponseHeadersExample],
  commonResponseHeadersNoModeExamples: [commonResponseHeadersNoModeExample],
  CommonResponseHeaders
}
