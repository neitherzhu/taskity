export type BaseRecord = {
  type: 'start' | 'stop'
  date: number
}

export type RecordMap = {
  [id: number]: BaseRecord[]
}
