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

const Joi = require('joi')
const addExamples = require('../../_util/addExamples')
const { RelativeURI } = require('../../string/RelativeURI')

const hrefExamples = [
  {
    first: 'search?searchTerm=find%20me&page=1&per_page=27',
    previous: 'search?searchTerm=find%20me&page=3&per_page=27',
    next: 'search?searchTerm=find%20me&page=5&per_page=27',
    last: 'search?searchTerm=find%20me&page=22&per_page=27'
  }
]

const HREF = addExamples(
  Joi.object({
    first: RelativeURI.description(
      `Relative uri of the first page, with the same \`per_page\`, of the search this is a result of.

This page can be empty. It might contain fewer items than requested by \`per_page\`, but then
this value is equal to \`last\`.`
    )
      .example('search?searchTerm=find%20me&page=1&per_page=27', { override: true })
      .required(),
    previous: RelativeURI.description(
      `Relative uri of the previous page, with the same \`per_page\`, of the search this is a result of,
if this is not the \`first\` page.

If this is the \`first\` page, this property does not appear.

This page can never be empty. It might contain fewer items than requested by \`per_page\`, but
then this value is equal to \`first\`.`
    )
      .example('search?searchTerm=find%20me&page=3&per_page=27', { override: true })
      .optional(),
    next: RelativeURI.description(
      `Relative uri of the next page, with the same \`per_page\`, of the search this is a result of,
if there is a next page.

If this is the \`last\` page, this property does not appear.

This page can never be empty. It might contain fewer items than requested by \`per_page\`, but
then this value is equal to \`last\`.`
    )
      .example('search?searchTerm=find%20me&page=5&per_page=27', { override: true })
      .optional(),
    last: RelativeURI.description(
      `Relative uri of the last page, with the same \`per_page\`, of the search this is a result of.

The page can never be empty, but it might contain fewer items than requested by \`per_page\`.`
    )
      .example('search?searchTerm=find%20me&page=22&per_page=27', { override: true })
      .required()
  })
    .unknown(true)
    .description('Links to other pages of the search result.'),
  hrefExamples
)

module.exports = {
  hrefExamples,
  HREF
}
