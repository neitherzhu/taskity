export const numberify = (c: number): string => {
  return c > 9 ? String(c) : '0' + c
}

export const parseCount = (
  count: number,
  format = 'HH:mm:ss'
): string | [string, string] => {
  let s = 0
  let m = 0
  let h = 0

  if (count >= 60) {
    s = count % 60
    m = Math.floor(count / 60)
    if (m >= 60) {
      h = Math.floor(m / 60)
      m = m % 60
    }
  } else {
    s = count
  }

  if (format === 'HH:mm:ss') {
    return numberify(h) + ':' + numberify(m) + ':' + numberify(s)
  }

  if (format === 'HH小时mm分钟ss秒') {
    return numberify(h) + '小时' + numberify(m) + '分钟' + numberify(s) + '秒'
  }

  if (h > 0) {
    return [(count / 3600).toFixed(1), '小时']
  }

  if (m > 0) {
    return [(count / 60).toFixed(1), '分钟']
  }

  return [String(count), '秒']
}
