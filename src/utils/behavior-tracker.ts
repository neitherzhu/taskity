import { BrowserWindow, powerMonitor } from 'electron'

let behaviorTrackerTimer: NodeJS.Timeout
const MAX_STOP = 60 // 10分钟无动作则暂停
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

export const behaviorTracker = (mainWindow: BrowserWindow) => {
  idleTime = powerMonitor.getSystemIdleTime()

  behaviorTrackerTimer = setTimeout(() => {
    behaviorTracker(mainWindow)
    if (idleTime > MAX_STOP) {
      mainWindow.webContents.send('behavior-change', true)
    } else {
      behaviorTracker(mainWindow)
    }
  }, 10000)
}

export const stopBehaviorTracker = () => {
  clearTimeout(behaviorTrackerTimer)
}
