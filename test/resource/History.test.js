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

/* eslint-env mocha */

const testName = require('../../_util/_testName')
const shouldBeSeriousSchema = require('../../_util/_shouldBeSeriousSchema')
const { stuff, stuffWithUndefined } = require('../../_util/_stuff')
const { History, HistoryVersion, historyVersionExamples, historyExamples } = require('../../resource/History')

describe(testName(module), function () {
  describe('HistoryVersion', function () {
    shouldBeSeriousSchema(
      HistoryVersion,
      stuff.concat(stuffWithUndefined.map(href => ({ ...historyVersionExamples[0], href })))
    )
  })
  describe('History', function () {
    shouldBeSeriousSchema(
      History,
      stuff.concat(stuffWithUndefined.map(versions => ({ ...historyExamples[0], versions }))).concat([
        [
          { createdAt: '2020-01-23T15:22:39.212Z', href: '..?at=2020-01-23T15:22:39.212Z' },
          { createdAt: '2022-08-04T18:48:44.003Z', href: '..?at=2022-08-04T18:48:44.003Z' }
        ]
      ])
    )
  })
})
