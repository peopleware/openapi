const Joi = require('joi')
const addExamples = require('../_util/addExamples')

const CanonicalURI = Joi.string()
  .uri({ relativeOnly: true })
  .min(1).description(`A _canonical URI_ is the URI where are resource can be interacted with, without the scheme and
authority (see
[RFC 3986 Uniform Resource Identifier (URI): Generic Syntax ;3. Syntax Components](https://www.rfc-editor.org/rfc/rfc3986#section-3)),
and without the build number. By convention, the canonical URI’s first segment is the name of the service in which the
URI resides, followed by the relative URI of the resource in the API of that service.`)

const canonicalURIExamples = ['/my-service/v1/y/abc']

module.exports = { canonicalURIExamples, CanonicalURI: addExamples(CanonicalURI, canonicalURIExamples) }
