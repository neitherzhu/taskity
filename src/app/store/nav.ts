import { action, makeAutoObservable, observable } from 'mobx';

import { NAV_TYPE } from '@app/constant';
import { navListService } from '@app/service';
import { BaseNav } from '@app/types';

export type UpdateNav = Partial<Omit<BaseNav, 'id' | 'update'>>

class Nav {
  id: number = Date.now()
  type: NAV_TYPE = NAV_TYPE.CUSTOM
  @observable icon = ''
  @observable activeIcon = ''
  @observable taskIds: number[] = []
  @observable name: string
  @observable color: string

  constructor (data: UpdateNav) {
    makeAutoObservable(this)

    this.update(data, true)
  }

  @action
  update = async (nav: UpdateNav, ignoreRemote?: boolean) => {
    Object.keys(nav).forEach((x: keyof UpdateNav) => {
      // @ts-ignore
      this[x] = nav[x]
    })

    if (!ignoreRemote) {
      await navListService.updateNav(this)
    }
  }
}

export default Nav
