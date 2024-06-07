import { action, computed, makeAutoObservable, observable } from 'mobx';

import { recordMapService } from '@app/service';

import Task from './task';
import taskListStore from './task-list';

let thickingId = 0
export class TaskInProgress {
  @observable id = 0
  @observable ticking = false
  @observable size = 'large'

  constructor () {
    makeAutoObservable(this)
  }

  @computed
  get currentTask (): Task | undefined {
    return taskListStore.list.find(x => x.id === this.id)
  }

  @action
  setSize = (size: string) => {
    this.size = size
  }

  @action
  setId = (id: number) => {
    this.id = id
  }

  @action
  setTicking = async (ticking: boolean) => {
    if (!this.id) {
      this.ticking = false
    } else {
      // 正在计时，并且又开始了一个计时，则应该先停止当前的计时，设置一个stop
      if (this.ticking && ticking) {
        if (this.id !== thickingId) {
          await recordMapService.addRecord(thickingId, {
            type: 'stop',
            date: Date.now()
          })
        }
      }
      if (ticking) {
        thickingId = this.id
      }

      this.ticking = ticking

      await recordMapService.addRecord(this.id, {
        type: ticking ? 'start' : 'stop',
        date: Date.now()
      })
    }
  }
}

export default new TaskInProgress()
