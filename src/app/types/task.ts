import { PRIORITY, TASK_STATUS } from '@app/constant';

export type BaseTask = {
  id: number
  name: string
  duration: number // 持续时间
  status: TASK_STATUS // TASK_STATUS
  createTime: number // 创建时间
  // tagIds: [] // 关联的标签id
  priority: PRIORITY // PRIORITY
  completeTime: number // 完成时间
  deadLine: number // 到期时间
  estimatedTime: number // 预计用时
  subTaskIds: number[] // 子任务
  desc: string // 描述
  navId: number // 归属的nav id
}
