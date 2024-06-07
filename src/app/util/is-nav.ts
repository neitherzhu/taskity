import { NAV_TYPE, TASK_STATUS } from '@app/constant';
import { SystemNav } from '@app/types';

export const isCompleted = (status: TASK_STATUS) => TASK_STATUS.DONE === status
export const isTodayNav = (id: SystemNav['id']) => id === 1
export const isTomorrowNav = (id: SystemNav['id']) => id === 2
export const isThisWeekNav = (id: SystemNav['id']) => id === 3
export const isDoneNav = (id: SystemNav['id']) => id === 4
export const isAllNav = (id: SystemNav['id']) => id === 5
export const isSystemNav = (type: NAV_TYPE) => type === NAV_TYPE.SYSYTEM
export const isCustomNav = (type: NAV_TYPE) => type === NAV_TYPE.CUSTOM
