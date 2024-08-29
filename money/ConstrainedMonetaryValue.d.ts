import { ObjectSchema } from 'joi'
import { TMonetaryValue2 } from './MonetaryValue2'

export interface TMonetaryValueEUR2 extends TMonetaryValue2 {}

export const MonetaryValueEUR2: ObjectSchema<TMonetaryValueEUR2>

export const monetaryValueEUR2Examples: Array<TMonetaryValueEUR2>

export interface TZeroMonetaryValueEUR2 extends TMonetaryValue2 {}

export const ZeroMonetaryValueEUR2: ObjectSchema<TZeroMonetaryValueEUR2>

export const zeroMonetaryValueEUR2Examples: Array<TZeroMonetaryValueEUR2>

export interface TPositiveMonetaryValueEUR2 extends TMonetaryValue2 {}

export const PositiveMonetaryValueEUR2: ObjectSchema<TPositiveMonetaryValueEUR2>

export const positiveMonetaryValueEUR2Examples: Array<TPositiveMonetaryValueEUR2>

export interface TPositiveMonetaryValueEUR4 extends TMonetaryValue2 {}

export const PositiveMonetaryValueEUR4: ObjectSchema<TPositiveMonetaryValueEUR4>

export const positiveMonetaryValueEUR4Examples: Array<TPositiveMonetaryValueEUR4>

export interface TNonNegativeMonetaryValueEUR2 extends TMonetaryValue2 {}
export const NonNegativeMonetaryValueEUR2: ObjectSchema<TNonNegativeMonetaryValueEUR2>

export const nonNegativeMonetaryValueEUR2Examples: Array<TNonNegativeMonetaryValueEUR2>

export interface TNegativeMonetaryValueEUR2 extends TMonetaryValue2 {}

export const NegativeMonetaryValueEUR2: ObjectSchema<TNegativeMonetaryValueEUR2>

export const negativeMonetaryValueEUR2Examples: Array<TNegativeMonetaryValueEUR2>

export function toNumberOfUnits(
  mv: TMonetaryValueEUR2,
  nav: TPositiveMonetaryValueEUR4
): { decimals: number; value: number }
