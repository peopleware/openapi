const Joi = require('joi')
const addExamples = require('../../_util/addExamples')

const sigedisRegistrantIdExamples = ['cunning-plan/covenant']

const SigedisRegistrantId = addExamples(
  Joi.string()
    .min(1)
    .max(60)
    .trim()
    .pattern(/^[-A-Za-z0-9./]{1,60}$/)
    .description(`Unchangeable identification of a retirement regulation for communication with Sigedis, unique
for an OFP.

See \`db2p_v3.11.8/Declaration/db2pBaseComponents_v3.xsd#FreeIdentificator\`.`),
  sigedisRegistrantIdExamples
)

module.exports = { sigedisRegistrantIdExamples, SigedisRegistrantId }
