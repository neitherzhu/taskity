import { BrowserWindow, powerMonitor } from 'electron'
import { storage } from './storage'
import { DEFAULT_SETTING } from '../constant'

let behaviorTrackerTimer: NodeJS.Timeout
let idleTime: number

// export const behaviorTracker = (mainWindow: BrowserWindow) => {
//   const { x, y } = screen.getCursorScreenPoint()
//   const lastMousePosition = `${x}-${y}`

//   behaviorTrackerTimer = setTimeout(() => {
//     const { x, y } = screen.getCursorScreenPoint()
//     const currentMousePosition = `${x}-${y}`
//     if (lastMousePosition === currentMousePosition) {
//       stopMins++
//       if (stopMins === MAX_STOP) {
//         mainWindow.webContents.send('behavior-change', true)
//       }
//     } else {
//       stopMins = 0
//     }

//     behaviorTracker(mainWindow)
//   }, 1000)
// }

// export const stopBehaviorTracker = () => {
//   stopMins = 0
//   clearTimeout(behaviorTrackerTimer)
// }
const store = storage()
export const behaviorTracker = async (mainWindow: BrowserWindow) => {
  idleTime = powerMonitor.getSystemIdleTime()
  const setting = await store.get('setting-ts')
  const mins =
    setting.stopWhenNoBehaviorInMiniutes ??
    DEFAULT_SETTING.stopWhenNoBehaviorInMiniutes
  if (idleTime > mins * 60) {
    mainWindow.webContents.send('behavior-change', true)
    return
  }

  behaviorTrackerTimer = setTimeout(() => {
    behaviorTracker(mainWindow)
  }, 5000)
}

export const stopBehaviorTracker = () => {
  clearTimeout(behaviorTrackerTimer)
}
