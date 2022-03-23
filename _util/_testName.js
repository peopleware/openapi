const path = require('path')
const assert = require('assert')

const namePattern = /^(.*)\.test$/

/**
 * Return the name of a test from the module name.
 * Only use when this makes sense.
 *
 * @param {object} testModule
 * @returns {string}
 */
function testName (testModule) {
  let parts = path.parse(testModule.filename)
  const nameSplit = namePattern.exec(parts.name)
  assert(nameSplit.length === 2)
  let name = nameSplit[1]
  while (path.basename(parts.dir) !== 'test') {
    parts = path.parse(parts.dir)
    name = `${parts.base}/${name}`
  }
  return name
}

module.exports = testName
