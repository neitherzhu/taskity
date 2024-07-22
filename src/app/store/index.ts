import navListStore, { NavList } from './nav-list'
import taskInProgressStore, { TaskInProgress } from './task-in-progress'
import taskListStore, { TaskList } from './task-list'
import settingStore, { SettingStore } from './setting'

export type Stores = {
  navListStore: NavList
  taskListStore: TaskList
  taskInProgressStore: TaskInProgress
  settingStore: SettingStore
}

export default {
  navListStore,
  taskListStore,
  taskInProgressStore,
  settingStore
} as Stores
