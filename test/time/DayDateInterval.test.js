/* eslint-env mocha */

const testName = require('../../_util/_testName')
const shouldBeSeriousSchema = require('../../_util/_shouldBeSeriousSchema')
const { DayDateInterval, dayDateIntervalExamples } = require('../../time/DayDateInterval')
const { stuff, stuffWithUndefined } = require('../../_util/_stuff')

describe(testName(module), function () {
  shouldBeSeriousSchema(
    DayDateInterval,
    stuff
      .concat(stuffWithUndefined.map(start => ({ ...dayDateIntervalExamples[0], start })))
      .concat(stuffWithUndefined.map(start => ({ ...dayDateIntervalExamples[1], start })))
      .concat(stuff.map(end => ({ ...dayDateIntervalExamples[0], end }))),
    true
  )
})
