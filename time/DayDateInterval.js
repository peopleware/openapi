const Joi = require('joi')
const { DayDate } = require('./DayDate')
const addExamples = require('../_util/addExamples')

const DayDateInterval = Joi.object({ from: DayDate.required(), until: DayDate.optional() })
  .description(`Half-right-open time interval \`[from, until[\` of day dates. \`from ≤ until\`. If there is no
\`until\`, this means the interval stretches until the heath death of the universe. Usually this means that interval is
believed to be still ongoing with the knowledge represented.

Please use [Allen's Interval Algebra](https://en.wikipedia.org/wiki/Allen%27s_interval_algebra) ("[Maintaining
Knowledge about Temporal Intervals](http://cse.unl.edu/~choueiry/Documents/Allen-CACM1983.pdf)") to reason about time
intervals.

This is a fuzzy description of a time interval, given timezones. This is stored, communicated, and visualized as-is,
and interpreted locally.`)

const dayDateIntervalExamples = [{ from: '1996-12-21', until: '2011-08-23' }, { from: '2022-08-26' }]

module.exports = { dayDateIntervalExamples, DayDateInterval: addExamples(DayDateInterval, dayDateIntervalExamples) }
