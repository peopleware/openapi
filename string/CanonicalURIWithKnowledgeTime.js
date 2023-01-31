const addExamples = require('../_util/addExamples')
const { extendDescription } = require('../_util/extendDescription')
const { CanonicalURI } = require('./CanonicalURI')
const { DateTime } = require('../time/DateTime')

function getParamsFromURI(uri) {
  // Get everything after the `?`
  const [, paramString] = uri.split('?')
  return new URLSearchParams(paramString)
}

const CanonicalURIWithKnowledgeTime = extendDescription(
  CanonicalURI,
  `The URI has an \`at\` qyuery parameter, expressing the knowledge time for which the service should return the
resource. The value must be a moment in time, expressed as ISO-8601 in UTC ('Z'), to ms precision or more precise
(should be μs precision).`,
  true
)
  .messages({
    'string.atQueryParameter': 'must have exactly 1 `at` query parameter',
    'string.atQueryParameterDateTime':
      "the value of the `at` query must be a moment in time, expressed as ISO-8601 in UTC ('Z'), to ms precision or more precise."
  })
  .custom((value, { error }) => {
    const params = getParamsFromURI(value)
    const ats = params.getAll('at')
    if (ats.length !== 1) {
      return error('string.atQueryParameter')
    }
    const { _, error: dateTimeError } = DateTime.validate(ats[0], { convert: false })
    if (dateTimeError) {
      return error('string.atQueryParameterDateTime')
    }

    return value
  })

const canonicalURIWithKnowledgeTimeExamples = [encodeURI('/my-service/v1/y/abc?at=2020-01-23T15:22:39.254888Z')]

module.exports = {
  canonicalURIWithKnowledgeTimeExamples,
  CanonicalURIWithKnowledgeTime: addExamples(CanonicalURIWithKnowledgeTime, canonicalURIWithKnowledgeTimeExamples)
}
