import { BrowserWindow, screen } from 'electron'

let stopMins = 0
let behaviorTrackerTimer: NodeJS.Timeout
const MAX_STOP = 60 * 10 // 10分钟无动作则暂停

export const behaviorTracker = (mainWindow: BrowserWindow) => {
  const { x, y } = screen.getCursorScreenPoint()
  const lastMousePosition = `${x}-${y}`

  behaviorTrackerTimer = setTimeout(() => {
    const { x, y } = screen.getCursorScreenPoint()
    const currentMousePosition = `${x}-${y}`
    if (lastMousePosition === currentMousePosition) {
      stopMins++
      if (stopMins === MAX_STOP) {
        mainWindow.webContents.send('behavior-change', true)
      }
    } else {
      stopMins = 0
    }

    behaviorTracker(mainWindow)
  }, 1000)
}

export const stopBehaviorTracker = () => {
  stopMins = 0
  clearTimeout(behaviorTrackerTimer)
}
