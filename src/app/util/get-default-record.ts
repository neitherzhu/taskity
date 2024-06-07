import dayjs from 'dayjs';

import { ONE_DAY_MS } from '@app/constant';
import { BaseRecord, RecordMap } from '@app/types';

export const getDefaultStartRecord = (
  stop: BaseRecord,
  startMs?: number
): BaseRecord => {
  return {
    type: 'start',
    date: startMs || +dayjs(stop.date).set('hours', 9)
  }
}

export const getDefaultStopRecord = (
  start: BaseRecord,
  endMs?: number
): BaseRecord => {
  let h
  if (!endMs) {
    const hour = dayjs(start.date).hour()
    if (hour < 12) {
      h = 12
    } else if (hour < 18) {
      h = 18
    } else {
      h = 21
    }
  }
  return {
    type: 'stop',
    date: endMs || +dayjs(start.date).set('hours', h)
  }
}

export const formatterRecordMap = (
  recordMap: RecordMap,
  startMs: number,
  endMs: number
): RecordMap => {
  const rangeRecordMap: RecordMap = {}

  Object.keys(recordMap).forEach((taskId: string) => {
    const id = Number(taskId)
    const records: BaseRecord[] = recordMap[id].filter(
      x => x.date >= startMs && x.date <= endMs
    )
    if (records.length) {
      // 优化records
      // 如果第一条是stop，则需要补上start stop当天的9点开始算
      if (records[0].type === 'stop') {
        records.unshift(getDefaultStartRecord(records[0]))
      }
      // 如果最后一条是start，并且当前时间大于endMs，则需要补上stop
      if (records[records.length - 1].type === 'start') {
        records.push(
          getDefaultStopRecord(
            records[records.length - 1],
            Math.min(Date.now(), endMs)
          )
        )
      }
      const finalRecords: BaseRecord[] = []
      // 补齐中间缺少的stop
      records.forEach((x, i) => {
        if (i === 0) {
          finalRecords.push(x)
        } else {
          // 获取最后一条记录， 如果最后一条记录跟当前的记录type一样，则需要补齐
          const lastFinalRecord = finalRecords[finalRecords.length - 1]
          if (lastFinalRecord.type === x.type) {
            const dur = x.date - lastFinalRecord.date
            // 如果缺少的是stop
            if (x.type === 'start') {
              // 如果跨天了
              if (dur >= ONE_DAY_MS) {
                finalRecords.push(getDefaultStopRecord(x))
              }
              // 如果非跨天，则直接忽略此start
            }
          } else {
            finalRecords.push(x)
          }
        }
      })

      rangeRecordMap[id] = finalRecords
    }
  })

  return rangeRecordMap
}
