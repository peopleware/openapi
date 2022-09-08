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
const addExamples = require('../../../_util/addExamples')

const methodGlobPattern = /^[A-Z*{},]+$/
const pathGlobPattern = /^[-\w.~%!$&'()+;=*{},/]+$/ // URI segment characters, plus '*', '{', ',', '}', and the '/' separator

const raxExamples = [
  '*:/a/path/*/to/{a,multiple}/resources/**',
  '{GET,PUT}:/another/path/43/without/choices',
  'POST:',
  '{GET:/v1/health,POST:/v1/res,PUT:/v1/affiliate/,GET:/v1/res/*}'
]

// MUDO this pattern and custom validation are not correct: too limiting

const RAX = Joi.string()
  .trim()
  .custom((value, { error }) => {
    const [methodGlob, pathGlob] = value.split(':')
    if (!methodGlobPattern.test(methodGlob) || (pathGlob !== '' && !pathGlobPattern.test(pathGlob))) {
      return error('any.invalid')
    }
    /* TODO
       - no more than 2 '*' in a row
       - no '**' in method glob
       - no consecutive ','
       - balanced '{…}'
       - no ',' outside '{…}'
       - empty option must be the first `{,…} */

    return value
  }, 'RAX')

module.exports = { methodGlobPattern, pathGlobPattern, raxExamples, RAX: addExamples(RAX, raxExamples) }
