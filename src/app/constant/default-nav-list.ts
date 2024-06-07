import dayjs from 'dayjs';

import { isCompleted } from '@app/util';

import { NAV_TYPE } from './';

import type { BaseNav, SystemNav } from '@app/types'
export const DEFAULT_NAV: BaseNav = {
  id: 0,
  type: NAV_TYPE.CUSTOM, // NAV_TYPE
  name: '',
  icon: '', // 图标
  activeIcon: '', // 选中状态图标
  color: '',
  taskIds: [] // 关联的任务id
}

export const DEFAULT_NAVS: SystemNav[] = [
  {
    type: NAV_TYPE.SYSYTEM,
    id: 1,
    name: '今天',
    icon: 'circle_money_line',
    activeIcon: 'circle_money_fill',
    color: '#f67058',
    taskIds: [],
    formatter: (list, map) => {
      return list
        .filter(x => !map[x.id] && (!x.deadLine || dayjs(x.deadLine).isToday()))
        .sort((a, b) =>
          isCompleted(a.status) ? 1 : b.createTime - a.createTime
        )
    }
  },
  {
    type: NAV_TYPE.SYSYTEM,
    id: 2,
    name: '明天',
    icon: 'car_line',
    activeIcon: 'car_fill',
    color: '#a487ff',
    taskIds: [],
    formatter: (list, map) => {
      return list
        .filter(x => !map[x.id] && dayjs(x.deadLine).isTomorrow())
        .sort((a, b) =>
          isCompleted(a.status) ? 1 : b.createTime - a.createTime
        )
    }
  },
  {
    type: NAV_TYPE.SYSYTEM,
    id: 3,
    name: '本周',
    icon: 'house_line',
    activeIcon: 'house_fill',
    color: '#378df7',
    taskIds: [],
    formatter: (list, map) => {
      return list
        .filter(x => !map[x.id] && dayjs().isSame(x.deadLine, 'week'))
        .sort((a, b) =>
          isCompleted(a.status) ? 1 : b.createTime - a.createTime
        )
    }
  },
  {
    type: NAV_TYPE.SYSYTEM,
    id: 4,
    name: '已完成',
    icon: 'checkthenumber_line',
    activeIcon: 'circle_checkmark_fill',
    color: '#50be5a',
    taskIds: [],
    formatter: list => {
      return list.filter(x => isCompleted(x.status))
    }
  },
  {
    type: NAV_TYPE.SYSYTEM,
    id: 5,
    name: '全部',
    icon: 'diamond_line',
    activeIcon: 'diamond_fill',
    color: '#378df7',
    taskIds: [],
    formatter: list => {
      return list.sort((a, b) =>
        isCompleted(a.status) ? 1 : b.createTime - a.createTime
      )
    }
  }
]
