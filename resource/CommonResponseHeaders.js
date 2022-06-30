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
const { UUID, uuidExamples } = require('../id/UUID')
const { CacheControlNoCache, cacheControlNoCacheExamples } = require('../resource/CacheControlNoCache')
const { DateTime, dateTimeExamples } = require('../time/DateTime')
const { Mode, modeExamples } = require('../id/Mode')

const commonResponseHeadersAllowMissingModeExample = {
  'x-flow-id': uuidExamples[0],
  'x-date': dateTimeExamples[0],
  'cache-control': cacheControlNoCacheExamples[0]
}
const commonResponseHeadersExample = {
  ...commonResponseHeadersAllowMissingModeExample,
  'x-mode': modeExamples[0]
}

/**
 * This schema has 1 tailoring: `allowMissingMode`. In that tailoring, the `x-mode` is optional. It is to be used in `401`,
 * `403`, or `400` responses, when the request did not carry the required `x-mode` (and there is nothing we can return).
 */
const CommonResponseHeaders = Joi.object({
  'x-flow-id': UUID.description('the flowId with which the request to which this is the response was made').required(),
  'x-mode': Mode.description('the mode with which the request to which this is the response was made')
    .required()
    .alter({ allowMissingMode: schema => schema.optional() }),
  'x-date': DateTime.required(),
  'cache-control': CacheControlNoCache.required()
})
  .unknown(true)
  .example(commonResponseHeadersExample)
  .alter({ allowMissingMode: schema => schema.example(commonResponseHeadersAllowMissingModeExample) })

module.exports = {
  commonResponseHeadersExample,
  commonResponseHeadersAllowMissingModeExample,
  commonResponseHeadersExamples: [commonResponseHeadersExample],
  CommonResponseHeaders: CommonResponseHeaders
}
