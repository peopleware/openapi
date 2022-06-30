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
const addExamples = require('../_util/addExamples')
const { UUID, uuidExamples } = require('../id/UUID')
const { CacheControlNoCache, cacheControlNoCacheExamples } = require('../resource/CacheControlNoCache')
const { DateTime, dateTimeExamples } = require('../time/DateTime')
const { Mode, modeExamples } = require('../id/Mode')

const CommonResponseHeaders = Joi.object({
  'x-flow-id': UUID.description('the flowId with which the request to which this is the response was made').required(),
  'x-mode': Mode.description('the mode with which the request to which this is the response was made').required(),
  'x-date': DateTime.required(),
  'cache-control': CacheControlNoCache.required()
}).unknown(true)

const aDate = new Date(2022, 5, 29, 13, 3, 34, 233)
const commonResponseHeadersExamples = [
  {
    'x-flow-id': uuidExamples[0],
    'x-mode': modeExamples[0],
    'x-date': dateTimeExamples[0],
    'cache-control': cacheControlNoCacheExamples[0]
  }
]

module.exports = {
  commonResponseHeadersExamples,
  CommonResponseHeaders: addExamples(CommonResponseHeaders, commonResponseHeadersExamples)
}
