import type { NAV_TYPE } from '@app/constant'
import type { BaseTask } from '.'

export type BaseNav = {
  id: number
  type: NAV_TYPE
  name: string
  icon: string
  activeIcon: string
  color: string
  taskIds: number[]
}

export type SystemNav = BaseNav & {
  formatter?: (list: BaseTask[], map: Record<number, number>) => BaseTask[]
}
