import { chunk } from 'lodash-es';

import { BaseRecord } from '@app/types';

import { getDefaultStopRecord } from './';

export const getDuration = (
  records: BaseRecord[],
  startMs: number,
  endMs: number
): number => {
  const chunkedRecords = chunk(records, 2)
  return chunkedRecords.reduce((duration, r) => {
    const [start, stop] = r
    const s = start.date
    let e = stop.date

    if (s > startMs && s < endMs) {
      if (e >= endMs) {
        e = e = getDefaultStopRecord({
          type: 'start',
          date: endMs - 1
        }).date
      }
      return duration + Math.round((e - s) / 1000)
    } else {
      return duration
    }
  }, 0)
}
