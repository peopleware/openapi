import { TDayDate } from './DayDate'
import { ObjectSchema } from 'joi'

export interface TDayDateInterval {
  start: TDayDate
  end?: TDayDate
  [other: string]: unknown
}

export const dayDateIntervalExamples: Array<TDayDateInterval>

export const DayDateInterval: ObjectSchema<TDayDateInterval>
