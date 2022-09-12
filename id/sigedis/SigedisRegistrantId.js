const Joi = require('joi')
const addExamples = require('../../_util/addExamples')

const sigedisRegistrantIdExamples = ['cunning-plan/interestedin2things']

const SigedisRegistrantId = addExamples(
  Joi.string()
    .min(1)
    .max(60)
    .trim()
    .pattern(/^[-A-Za-z0-9./]{1,60}$/)
    .description(`Unchangeable identification of a retirement regulation for communication with Sigedis, unique
for an OFP.

This consists of the plan label, and the contract label, separated with a \`/\`, and is limited to 60 characters (see
\`db2p_v3.11.8/Declaration/db2pBaseComponents_v3.xsd#FreeIdentificator\`).`),
  sigedisRegistrantIdExamples
)

module.exports = { sigedisRegistrantIdExamples, SigedisRegistrantId }
