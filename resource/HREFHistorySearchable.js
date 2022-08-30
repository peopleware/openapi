const { HREFHistory, hrefHistoryExamples } = require('./HREFHistory')
const { RelativeURI } = require('../string/RelativeURI')
const addExamples = require('../_util/addExamples')

const HREFHistorySearchable = HREFHistory.append({
  searchDocument: RelativeURI.description(
    "relative URI at which the resource's search document can be retrieved"
  ).required()
})

const hrefHistorySearchableExamples = hrefHistoryExamples.map(eg => ({
  ...eg,
  searchDocument: '1567889875/search-document'
}))

module.exports = {
  hrefHistorySearchableExamples,
  HREFHistorySearchable: addExamples(HREFHistorySearchable, hrefHistorySearchableExamples)
}
