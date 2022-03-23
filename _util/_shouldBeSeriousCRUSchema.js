const shouldBeSeriousSchema = require('./_shouldBeSeriousSchema')
const should = require('should')

/**
 * @param {Joi.ObjectSchema} schema
 * @param {Array<string>} readOnlyProperties
 * @param {Array<any>} failures
 * @param {object} [context]
 * @return {void}
 */
function shouldBeSeriousCRUSchema (schema, readOnlyProperties, failures, context) {
  /**
   * @param {Joi.ObjectSchema} tailored
   */
  function shouldBeOptional (tailored) {
    describe('read-only properties', function () {
      readOnlyProperties.forEach(prop => {
        it(`${prop} should be optional`, function () {
          const description = tailored.describe()
          should(description.keys[prop].flags.presence).equal('optional')
        })
        it(`should pass when ${prop} is not present`, function () {
          const failure = { ...tailored.describe().examples[0] }
          delete failure[prop]
          const validation = tailored.validate(failure, { convert: false, context })
          should(validation.error).be.undefined()
        })
      })
    })
  }

  describe('untailored', () => {
    shouldBeSeriousSchema(schema, failures, context)
  })
  describe('read', () => {
    const tailored = schema.tailor('read')
    shouldBeSeriousSchema(tailored, failures, context)
    describe('read-only properties', function () {
      readOnlyProperties.forEach(prop => {
        it(`${prop} should be required`, function () {
          const description = tailored.describe()
          should(description.keys[prop].flags.presence).equal('required')
        })
        it(`should fail when ${prop} is not present`, function () {
          const failure = { ...tailored.describe().examples[0] }
          delete failure[prop]
          const validation = tailored.validate(failure, { convert: false, context })
          should(validation.error).be.ok()
        })
      })
    })
  })
  describe('create', () => {
    const tailored = schema.tailor('create')
    shouldBeSeriousSchema(tailored, failures, context)
    shouldBeOptional(tailored)
  })
  describe('update', () => {
    const tailored = schema.tailor('update')
    shouldBeSeriousSchema(tailored, failures, context)
    shouldBeOptional(tailored)
  })
}

module.exports = shouldBeSeriousCRUSchema
