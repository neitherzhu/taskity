import { action, computed, makeAutoObservable, observable } from 'mobx';

import { TASK_STATUS } from '@app/constant';
import { recordMapService, taskListService } from '@app/service';
import { BaseNav } from '@app/types';
import { isCustomNav } from '@app/util';

import store from './';
import Task, { UpdateTask } from './task';
import taskInProgress from './task-in-progress';

export class TaskList {
  @observable.shallow list: Task[] = []
  @observable currentTaskId = 0

  constructor () {
    makeAutoObservable(this)
  }

  @computed
  get currentTask (): Task | undefined {
    return this.list.find(x => x.id === this.currentTaskId)
  }

  @action
  setCurrentTaskId = (id: number) => {
    this.currentTaskId = id
  }

  @action
  getTaskListByNav = async (nav: BaseNav) => {
    const taskList: BaseNav[] = await taskListService.getTaskListByNav(nav)
    this.list = taskList.map(x => new Task(x))

    return taskList
  }

  @action
  addTask = async (data: UpdateTask) => {
    const task = new Task(data)

    await taskListService.addTask(task)
    this.list = [task, ...this.list]

    const currentNav = store.navListStore.list.find(
      x => x.id === store.navListStore.currentNavId
    )

    if (isCustomNav(currentNav.type)) {
      await currentNav.update({
        taskIds: [...currentNav.taskIds, task.id]
      })
    }

    return task
  }

  @action
  deleteTask = async (id: number) => {
    await taskListService.deleteTask(id)
    await recordMapService.deleteRecord(id)

    this.list = this.list.filter(x => x.id !== id)
    // 如果是正在计时的任务，则需要停止任务
    if (taskInProgress.id === id) {
      taskInProgress.stop()
    }
  }

  @action
  completeTask = async (id: number, isCompleted: boolean) => {
    const task = this.list.find(x => x.id === id)
    task.update({
      status: isCompleted ? TASK_STATUS.DONE : TASK_STATUS.DOING,
      createTime: isCompleted ? Date.now() : 0
    })

    this.list = [...this.list]

    if (
      id === store.taskInProgressStore.id &&
      store.taskInProgressStore.ticking
    ) {
      store.taskInProgressStore.stop()
    }
  }

  @action
  moveTask = async (data: {
    fromNavId: number
    toNavId: number
    id: number
  }) => {
    const { fromNavId, toNavId, id } = data

    store.navListStore.list.forEach(x => {
      const taskIds = x.taskIds
      if (x.id === fromNavId) {
        x.update({ taskIds: taskIds.filter(y => y !== id) })
      } else if (x.id === toNavId) {
        x.update({ taskIds: [...taskIds, id] })
      }
    })

    const task = this.list.find(x => x.id === id)
    task.update({ navId: toNavId })

    if (store.navListStore.currentNavId === fromNavId) {
      this.list = this.list.filter(x => x.id !== id)
    }
  }
}

export default new TaskList()
