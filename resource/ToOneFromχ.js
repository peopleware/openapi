const addExamples = require('../_util/addExamples')
const { RelativeURI } = require('../string/RelativeURI')

const ToOneFrom = RelativeURI.description(
  'relative URI at which the associated resource can be retrieved, with `at` equal to the `createdAt` of this resource'
)

const toOneFromχExamples = ['../../../associated/1549873215?at=2022-08-18T14:57:39.732Z']

module.exports = { toOneFromχExamples, ToOneFromχ: addExamples(ToOneFrom, toOneFromχExamples) }
