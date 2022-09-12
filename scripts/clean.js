const blockQuotePattern = /^\s*> /
const listItemPattern = /^\s*[-*] /

function cleanDescription (description) {
  const lines = description.split('\n')
  const cleaned = lines.reduce(
    (cleaned, l) => {
      const previousLine = cleaned[cleaned.length - 1]
      if (l.trim() === '') {
        if (previousLine !== '') {
          // eat double new lines
          cleaned.push('')
        }

        return cleaned
      }

      if (listItemPattern.test(l)) {
        if (previousLine === '') {
          cleaned.pop()
        }
        cleaned.push(l)

        return cleaned
      }

      if (blockQuotePattern.test(l)) {
        // block quote
        if (previousLine === '') {
          cleaned.pop()
        }
        if (!blockQuotePattern.test(previousLine)) {
          cleaned.push(l)
        } else {
          const withoutBlockquoteSign = l.replace(blockQuotePattern, '').trim()
          cleaned[cleaned.length - 1] = previousLine + ' ' + withoutBlockquoteSign
        }

        return cleaned
      }

      cleaned[cleaned.length - 1] = previousLine === '' ? l : previousLine + ' ' + l.trim()

      return cleaned
    },
    ['']
  )
  while (cleaned[cleaned.length - 1] === '') {
    cleaned.pop()
  }
  // double, to account for redoc particularity
  return cleaned.join('\n\n')
}

function clean (model) {
  if (Array.isArray(model)) {
    return model.map(e => clean(e))
  }
  if (typeof model === 'object' && model !== null) {
    return Object.keys(model).reduce((acc, key) => {
      if (key === 'description') {
        acc[key] = cleanDescription(model[key])
      } else {
        acc[key] = clean(model[key])
      }
      return acc
    }, {})
  }
  return model
}

module.exports = { clean }
