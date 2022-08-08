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

const CacheControlPrivateImmutable = Joi.valid('private, max-age=31536000, immutable').description(
  `Cache the resource infinitely, only in the end-user's browser.

See [RFC 7234 Section 5.2.2](https://tools.ietf.org/html/rfc7234#section-5.2.2).

The \`private\` directive ensures the response is only cached by the browser's cache ([RFC 7234 Section
5.2.2.6](https://tools.ietf.org/html/rfc7234#section-5.2.2.6)).

The \`max-age\` (1 year) directive when the resource is immutable is a fall-back for clients that do not understand the
\`immutable\` directive (see [RFC 8246](https://tools.ietf.org/html/rfc8246), ["Bits Up!", "Cache-Control:
immutable"](https://bitsup.blogspot.com/2016/05/cache-control-immutable.html)). With most modern browsers, this is
superfluous.`
)

const cacheControlPrivateImmutable = 'private, max-age=31536000, immutable'
const cacheControlPrivateImmutableExamples = [cacheControlPrivateImmutable]

module.exports = {
  cacheControlPrivateImmutable,
  cacheControlPrivateImmutableExamples,
  CacheControlPrivateImmutable: addExamples(CacheControlPrivateImmutable, cacheControlPrivateImmutableExamples)
}
