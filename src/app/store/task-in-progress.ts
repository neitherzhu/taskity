import { action, makeAutoObservable, observable } from 'mobx';

import { recordMapService } from '@app/service';

import Task from './task';
import taskListStore from './task-list';

export class TaskInProgress {
  @observable id = 0
  @observable ticking = false
  @observable size = 'large'
  currentTask: Task

  constructor () {
    makeAutoObservable(this)
  }

  @action
  setSize = (size: string) => {
    this.size = size
  }

  @action
  start = async (id: number) => {
    if (this.ticking) {
      // 正在计时，并且又开始了一个计时，则应该先停止当前的计时，设置一个stop
      if (id !== this.id) {
        await this.stop()
      }
    }
    this.ticking = true
    this.id = id
    this.currentTask = taskListStore.list.find(x => x.id === id)
    await recordMapService.addRecord(id, {
      type: 'start',
      date: Date.now()
    })
  }

  @action
  stop = async () => {
    await recordMapService.addRecord(this.id, {
      type: 'stop',
      date: Date.now()
    })
    this.ticking = false
  }
}

export default new TaskInProgress()
