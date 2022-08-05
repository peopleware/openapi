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

const statusValues = ['OK', 'WARNING', 'ERROR', 'UNREACHABLE']

const Status = addExamples(Joi.valid(...statusValues), statusValues).description(`
- OK: 200 - the service is running within specifications;
- WARNING: 270 - the service is running, but some requirements are not fulfilled;
- ERROR: 470 - the service is running, but some crucial specifications are not fulfilled, and operation is not guaranteed;
- UNREACHABLE: 500 - the service is not running or not available`)

module.exports = { statusValues, Status: addExamples(Status, statusValues) }
