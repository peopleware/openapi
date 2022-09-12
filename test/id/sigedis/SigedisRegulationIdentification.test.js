const testName = require('../../../_util/_testName')
const shouldBeSeriousSchema = require('../../../_util/_shouldBeSeriousSchema')
const {
  SigedisRegulationIdentification,
  sigedisRegulationIdentificationExamples
} = require('../../../id/sigedis/SigedisRegulationIdentification')
const { stuff, stuffWithUndefined } = require('../../../_util/_stuff')

describe(testName(module), function () {
  shouldBeSeriousSchema(
    SigedisRegulationIdentification,
    stuff
      .concat(stuffWithUndefined.map(registrant => ({ ...sigedisRegulationIdentificationExamples[0], registrant })))
      .concat(stuffWithUndefined.map(registrantId => ({ ...sigedisRegulationIdentificationExamples[0], registrantId })))
  )
})
