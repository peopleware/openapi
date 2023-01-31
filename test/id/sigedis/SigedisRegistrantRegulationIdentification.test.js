/* eslint-env mocha */

const testName = require('../../../_util/_testName')
const shouldBeSeriousSchema = require('../../../_util/_shouldBeSeriousSchema')
const {
  SigedisRegistrantRegulationIdentification,
  sigedisRegistrantRegulationIdentificationExamples
} = require('../../../id/sigedis/SigedisRegistrantRegulationIdentification')
const { stuff, stuffWithUndefined } = require('../../../_util/_stuff')

describe(testName(module), function () {
  shouldBeSeriousSchema(
    SigedisRegistrantRegulationIdentification,
    stuff
      .concat(
        stuffWithUndefined.map(registrant => ({ ...sigedisRegistrantRegulationIdentificationExamples[0], registrant }))
      )
      .concat(
        stuffWithUndefined.map(registrantId => ({
          ...sigedisRegistrantRegulationIdentificationExamples[0],
          registrantId
        }))
      )
  )
})
