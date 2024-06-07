import { DEFAULT_NAVS } from '@app/constant';
import { cloneDeepWithoutFunction } from '@app/util';

import Storage from './storage';

import type { BaseNav } from '@app/types'

const KEY = 'nav-list-ts'

export default {
  async getNavList (): Promise<BaseNav[]> {
    let list = await Storage.get(KEY)

    if (!list?.length) {
      list = DEFAULT_NAVS.map(cloneDeepWithoutFunction)
    }

    return list.sort((a: BaseNav, b: BaseNav) => a.id - b.id)
  },

  async setNavList (data: BaseNav[]) {
    return await Storage.set(KEY, data.map(cloneDeepWithoutFunction))
  },

  async addNav (data: BaseNav) {
    const navList = await this.getNavList()
    await this.setNavList([...navList, cloneDeepWithoutFunction(data)])

    return data
  },

  async deleteNav (id: number) {
    const navList: BaseNav[] = await this.getNavList()
    await this.setNavList(navList.filter(x => x.id !== id))
  },

  async updateNav (data: BaseNav) {
    const navList: BaseNav[] = await this.getNavList()
    const newNavList = navList.map(x => {
      if (x.id === data.id) {
        return { ...x, ...cloneDeepWithoutFunction(data) }
      }
      return x
    })
    await this.setNavList(newNavList)
  }
}
