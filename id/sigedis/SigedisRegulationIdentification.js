const Joi = require('joi')
const addExamples = require('../../_util/addExamples')
const { CRN } = require('../legalPerson/be/CRN')
const { SigedisRegistrantId, sigedisRegistrantIdExamples } = require('./SigedisRegistrantId')

const sigedisRegulationIdentificationExamples = [
  { registrant: '1234509876', registrantId: sigedisRegistrantIdExamples[0] }
]

const SigedisRegulationIdentification = addExamples(
  Joi.object({
    registrant: CRN.description(
      `CRN of the OFP that is responsible for this contract.

${CRN.describe().flags.description}`
    ).required(),
    registrantId: SigedisRegistrantId.required()
  })
    .description(
      `Unchangeable internal identification of a _regulation_ for communication with Sigedis.

This consists of the CRN of the OFP that governs the contract as \`registrant\`, and the \`registrantId\`,
which is an identification of the contract unqiue within the OFP.

_Regulation_ is a deliberately vague term. A sector retirement contract is a _regulation_. For a MIPS retirement
contract, the _participations in the contract of each separate employer_ are considered separate _regulations_.
Retirement contracts for a single employer each are separate _regulations_.

Sigedis regulation identifications have to be unique, and cannot change over the life of a regulation.

Regulations are attributed a _Sigedis id_ by Sigedis, but this attribution is done after creation of a regulation,
and its declaration with Sigedis. The Sigedis id therefor cannot be used as a business key. This value can, since the
organization that manages the regulation can define it freely when the regulation is created. Once the Sigedis id is
attributed, it can be used as identification in communication with Sigedis, but this value will continue to function in
that role as well.`
    )
    .unknown(true),
  sigedisRegulationIdentificationExamples
)

module.exports = { sigedisRegulationIdentificationExamples, SigedisRegulationIdentification }
