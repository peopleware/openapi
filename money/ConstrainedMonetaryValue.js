const { constrainedMonetaryValue2, MonetaryValue2 } = require('./MonetaryValue2')
const addExamples = require('../_util/addExamples')

const monetaryValueEUR2Examples = [
  { currency: 'EUR', decimals: 2, value: 344445 },
  { currency: 'EUR', decimals: 2, value: 0 },
  { currency: 'EUR', decimals: 2, value: -344445 }
]

const MonetaryValueEUR2 = constrainedMonetaryValue2(MonetaryValue2, 'EUR', 2)

const zeroMonetaryValueEUR2Examples = [{ currency: 'EUR', decimals: 2, value: 0 }]

const ZeroMonetaryValueEUR2 = addExamples(MonetaryValueEUR2, zeroMonetaryValueEUR2Examples).valid(zeroMonetaryValueEUR2Examples[0])

const nonNegativeMonetaryValueEUR2Examples = [{ currency: 'EUR', decimals: 2, value: 0 }]

const negativeMonetaryValueEUR2Examples = [{ currency: 'EUR', decimals: 2, value: -20 }]

const NegativeMonetaryValueEUR2 = constrainedMonetaryValue2(MonetaryValue2, 'EUR', 2, {
  max: -1,
  min: undefined
})

const NonNegativeMonetaryValueEUR2 = constrainedMonetaryValue2(MonetaryValue2, 'EUR', 2, {
  min: 0,
  max: undefined
})

const positiveMonetaryValueEUR2Examples = [{ currency: 'EUR', decimals: 2, value: 344445 }]

const PositiveMonetaryValueEUR2 = constrainedMonetaryValue2(MonetaryValue2, 'EUR', 2, {
  min: 1,
  max: undefined
})

const positiveMonetaryValueEUR4Examples = [{ currency: 'EUR', decimals: 4, value: 344445 }]

const PositiveMonetaryValueEUR4 = constrainedMonetaryValue2(MonetaryValue2, 'EUR', 4, {
  min: 1,
  max: undefined
})

module.exports = {
  monetaryValueEUR2Examples,
  MonetaryValueEUR2,
  zeroMonetaryValueEUR2Examples,
  ZeroMonetaryValueEUR2,
  nonNegativeMonetaryValueEUR2Examples,
  NonNegativeMonetaryValueEUR2,
  positiveMonetaryValueEUR2Examples,
  PositiveMonetaryValueEUR2,
  positiveMonetaryValueEUR4Examples,
  PositiveMonetaryValueEUR4,
  negativeMonetaryValueEUR2Examples,
  NegativeMonetaryValueEUR2
}
