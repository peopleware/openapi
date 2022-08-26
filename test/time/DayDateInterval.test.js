const testName = require('../../_util/_testName')
const shouldBeSeriousSchema = require('../../_util/_shouldBeSeriousSchema')
const { DayDateInterval, dayDateIntervalExamples } = require('../../time/DayDateInterval')
const { stuff, stuffWithUndefined } = require('../../_util/_stuff')

describe(testName(module), function () {
  shouldBeSeriousSchema(
    DayDateInterval,
    stuff
      .concat(stuffWithUndefined.map(from => ({ ...dayDateIntervalExamples[0], from })))
      .concat(stuffWithUndefined.map(from => ({ ...dayDateIntervalExamples[1], from })))
      .concat(stuff.map(until => ({ ...dayDateIntervalExamples[0], until }))),
    true
  )
})
