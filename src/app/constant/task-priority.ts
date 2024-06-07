export enum PRIORITY {
  NULL = 0,
  HIGH = 1,
  NORMAL = 2,
  LOW = 3
}

export const PRIORITY_LIST = [
  { label: '无', value: PRIORITY.NULL, color: '' },
  { label: '高', value: PRIORITY.HIGH, color: 'c-red' },
  { label: '中', value: PRIORITY.NORMAL, color: 'c-yellow' },
  { label: '低', value: PRIORITY.LOW, color: 'c-green' }
]
