import { DEFAULT_NAVS } from '@app/constant';
import { cloneDeepWithoutFunction, isSystemNav } from '@app/util';

import { navListService } from './';
import Storage from './storage';

import type { BaseNav, BaseTask } from '@app/types'

const KEY = 'task-list-ts'

export default {
  async getTaskList (): Promise<BaseTask[]> {
    return (await Storage.get(KEY)) || []
  },

  async getTaskListByNav (nav: BaseNav) {
    const taskList = await this.getTaskList()
    const { type, id, taskIds } = nav

    let map: Record<number, number> = {}

    if (isSystemNav(type)) {
      const systemNav = DEFAULT_NAVS.find(x => x.id === id)
      const navList = await navListService.getNavList()
      map = navList
        .filter(x => x.taskIds?.length)
        .map(x => x.taskIds)
        .flat()
        .reduce((o, x) => {
          o[x] = 1
          return o
        }, {} as Record<number, number>)
      return systemNav.formatter(taskList, map)
    } else {
      if (taskIds?.length) {
        map = taskIds.reduce((o, x) => {
          o[x] = 1
          return o
        }, {} as Record<number, number>)
        return taskList.filter((x: BaseTask) => map[x.id])
      }
      return []
    }
  },

  async setTaskList (data: BaseTask[]) {
    return await Storage.set(KEY, data.map(cloneDeepWithoutFunction))
  },

  async addTask (data: BaseTask) {
    const taskList = await this.getTaskList()

    await this.setTaskList([cloneDeepWithoutFunction(data), ...taskList])

    return data
  },

  async deleteTask (id: number) {
    const taskList = await this.getTaskList()
    await this.setTaskList(taskList.filter((x: BaseTask) => x.id !== id))
  },

  async updateTask (data: BaseTask) {
    const taskList = await this.getTaskList()
    const newTaskList = taskList.map((x: BaseTask) => {
      if (x.id === data.id) {
        return { ...x, ...cloneDeepWithoutFunction(data) }
      }
      return x
    })
    await this.setTaskList(newTaskList)
  }
}
