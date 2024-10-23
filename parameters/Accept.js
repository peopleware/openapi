const Joi = require('joi')
const addExamples = require('../_util/addExamples')

const acceptExamples = ['text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8', 'application/json']

/**
 * See [Regex to match accept-language header](https://javascript.tutorialink.com/regex-to-match-accept-language-header/)
 *
 * @type {Joi.StringSchema}
 */
const Accept = Joi.string()
  .pattern(/([^-;]*)(?:-([^;]*))?(?:;q=(\d.\d))?/)
  .allow('')
  .description(
    'request header that says what mime-types the client wants to be returned, where `q` expresses the preferences'
  )
  .label('accept')

module.exports = { acceptExamples, Accept: addExamples(Accept, acceptExamples) }
