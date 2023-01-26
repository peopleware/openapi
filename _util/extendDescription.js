/**
 * Extend the description of `schema` with `extraDescription`.
 *
 * If `addAddEnd` is truthy, the `extraDescription` is added at the end. Otherwise, it is added at the front. There is
 * always blank line between the existing and `extraDescription`.
 *
 * This is not supported in browser environments. There, the description of `schema` is replaced with
 * `extraDescription`.
 *
 * @param {Joi.Schema} schema
 * @param {string} extraDescription
 * @param {boolean} [addAddEnd]
 */
function extendDescription (schema, extraDescription, addAddEnd) {
  try {
    const originalDescription = schema.describe().flags.description

    const extendedDescription = addAddEnd
      ? `${originalDescription}

${extraDescription}`
      : `${extraDescription}

${originalDescription}`

    return schema.description(extendedDescription)
  } catch (_) {
    // describe() is not supported in browser environments; only retain the `extraDescription`
    return schema.description(extraDescription)
  }
}

module.exports = { extendDescription }
