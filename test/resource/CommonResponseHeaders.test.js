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

const testName = require('../../_util/_testName')
const shouldBeSeriousSchema = require('../../_util/_shouldBeSeriousSchema')
const { stuff, stuffWithUndefined } = require('../../_util/_stuff')
const { CommonResponseHeaders, commonResponseHeadersExamples } = require('../../resource/CommonResponseHeaders')

describe(testName(module), function () {
  describe('nominal', function () {
    shouldBeSeriousSchema(
      CommonResponseHeaders,
      stuff
        .concat(stuffWithUndefined.map(flowId => ({ ...commonResponseHeadersExamples[0], 'x-flow-id': flowId })))
        .concat(stuffWithUndefined.map(mode => ({ ...commonResponseHeadersExamples[0], 'x-mode': mode })))
        .concat(
          stuffWithUndefined.map(date => ({
            ...commonResponseHeadersExamples[0],
            'x-date': date
          }))
        )
        .concat(
          stuffWithUndefined.map(cc => ({
            ...commonResponseHeadersExamples[0],
            'cache-control': cc
          }))
        )
    )
  })
  describe('allowMissingMode', function () {
    const AllowMissingModeCommonResponseHeaders = CommonResponseHeaders.tailor('allowMissingMode')
    shouldBeSeriousSchema(
      AllowMissingModeCommonResponseHeaders,
      stuff
        .concat(stuffWithUndefined.map(flowId => ({ ...commonResponseHeadersExamples[0], 'x-flow-id': flowId })))
        .concat(stuff.map(mode => ({ ...commonResponseHeadersExamples[0], 'x-mode': mode })))
        .concat(
          stuffWithUndefined.map(date => ({
            ...commonResponseHeadersExamples[0],
            'x-date': date
          }))
        )
        .concat(
          stuffWithUndefined.map(cc => ({
            ...commonResponseHeadersExamples[0],
            'cache-control': cc
          }))
        )
    )
  })
})
