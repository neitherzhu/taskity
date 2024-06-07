import { RangePickerProps } from 'antd/es/date-picker';

import { ONE_DAY_MS } from '@app/constant';

export const getDayMsList = (dates: RangePickerProps['value']): number[] => {
  const startMs = +dates[0]
  const endMs = +dates[1]
  let ms = startMs
  const list = []

  while (ms + ONE_DAY_MS <= endMs + 1) {
    list.push(ms)

    ms += ONE_DAY_MS
  }

  return list
}
