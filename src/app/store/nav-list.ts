import { action, computed, makeAutoObservable, observable } from 'mobx';

import { navListService } from '@app/service';
import { BaseNav } from '@app/types';

import Nav, { UpdateNav } from './nav';

export class NavList {
  @observable.shallow list: Nav[] = []
  @observable currentNavId = 0

  constructor () {
    makeAutoObservable(this)
  }

  @computed
  get currentNav (): Nav | undefined {
    return this.list.find(x => x.id === this.currentNavId)
  }

  @action
  setCurrentNavId = (id: number) => {
    this.currentNavId = id
  }

  @action
  getNavList = async () => {
    const list: BaseNav[] = await navListService.getNavList()
    this.list = list.map(x => new Nav(x))
    this.setCurrentNavId(this.list[0].id)
    return list
  }

  @action
  addNav = async (data: UpdateNav) => {
    const nav = new Nav(data)
    await navListService.addNav(nav)
    this.list.push(nav)
  }

  @action
  deleteNav = async (id: number) => {
    await navListService.deleteNav(id)

    this.list = this.list.filter(x => x.id !== id)

    if (this.currentNavId === id) {
      this.setCurrentNavId(this.list[0]?.id || 0)
    }
  }
}

export default new NavList()
