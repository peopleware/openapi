function getDescription(schema) {
  try {
    return schema.describe().flags.description
  } catch (_) {}
}

module.exports = { getDescription }
