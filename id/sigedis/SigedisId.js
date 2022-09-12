const Joi = require('joi')
const addExamples = require('../../_util/addExamples')

const sigedisIdExamples = ['123456789012345678901234']

const SigedisId = Joi.string()
  .trim()
  .length(24)
  .pattern(/^\d{24}$/)
  .description(`Belgian identification number of retirement _regulations_, attributed by Sigedis ([nl](https://sigedis.be/nl),
[fr](https://sigedis.be/fr)).

There is no formatting in this representation. In human communication, the Sigedis id is represented as 6 groups of 4
digits (total 24), separated by \`'-'\` (/^(\\d{4}-){5}\\d{4}$/, e.g. \`'1234-5678-9012-3456-7890-1234'\`).

_Regulation_ is a deliberately vague term. A sector retirement contract is a _regulation_, and is attributed a Sigedis
id. For a MIPS retirement contract, the _participations in the contract of each separate employer_ are considered
separate _regulations_ that are attributed each their own Sigedis id. Retirement contracts for a single employer each
are separate _regulations_, and have a separate unique Sigdis id.

Sigedis ids are not known yet when a regulation is created, and thus cannot function as business key. After creation of
a _regulation_ it is _declared_ with Sigedis, and we receive a Sigedis id in response.

Sigedis ids are unique. Sigedis ids do not change over the life of a regulation.`)

module.exports = { sigedisIdExamples, SigedisId: addExamples(SigedisId, sigedisIdExamples) }
