const Joi = require('joi')
const addExamples = require('../_util/addExamples')

const RelativeURI = Joi.string().uri({ relativeOnly: true }).min(1).description('relative URI')

const relativeURIExamples = ['../some/path', 'some/other/path', './meaningless/dot']

module.exports = { relativeURIExamples, RelativeURI: addExamples(RelativeURI, relativeURIExamples) }
