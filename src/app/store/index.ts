import navListStore, { NavList } from './nav-list';
import taskInProgressStore, { TaskInProgress } from './task-in-progress';
import taskListStore, { TaskList } from './task-list';

export type Stores = {
  navListStore: NavList
  taskListStore: TaskList
  taskInProgressStore: TaskInProgress
}

export default {
  navListStore,
  taskListStore,
  taskInProgressStore
} as Stores
