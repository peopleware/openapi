const Joi = require('joi')
const { RelativeURI } = require('../string/RelativeURI')
const addExamples = require('../_util/addExamples')
const { readOnlyAlteration } = require('./_readOnlyAlteration')

const HREFHistory = Joi.object({
  history: RelativeURI.description(
    "relative URI at which the list of times at which a change in the resource's information was recorded can be retrieved"
  ).required()
})
  .description('HATEOAS links. These are relative URIs.')
  .alter(readOnlyAlteration)
  .unknown(true)

const hrefHistoryExamples = [{ history: '1567889875/history' }]

module.exports = { hrefHistoryExamples, HREFHistory: addExamples(HREFHistory, hrefHistoryExamples) }
