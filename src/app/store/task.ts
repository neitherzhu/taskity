import { action, makeAutoObservable, observable } from 'mobx';

import { PRIORITY, TASK_STATUS } from '@app/constant';
import { taskListService } from '@app/service';
import { BaseTask } from '@app/types';

export type UpdateTask = Partial<Omit<BaseTask, 'id' | 'update'>>

class Task {
  id: number = Date.now()
  @observable duration = 0 // 持续时间
  @observable status = TASK_STATUS.DOING
  @observable createTime = Date.now() // 创建时间
  @observable deadLine = 0 // 到期时间
  @observable estimatedTime = 0 // 预计用时
  @observable completeTime = 0 // 完成时间
  @observable priority = PRIORITY.NULL // 优先级
  // @observable tagIds = [] // 关联的标签id
  @observable subTaskIds: number[] = [] // 子任务
  @observable desc = '' // 描述
  @observable navId: number // 归属的nav id
  @observable name = '' // 任务名称

  constructor (data: UpdateTask) {
    makeAutoObservable(this)

    this.update(data, true)
  }

  @action
  update = async (nav: UpdateTask, ignoreRemote?: boolean) => {
    Object.keys(nav).forEach((x: keyof UpdateTask) => {
      // @ts-ignore
      this[x] = nav[x]
    })

    if (!ignoreRemote) {
      await taskListService.updateTask(this)
    }
  }
}

export default Task
