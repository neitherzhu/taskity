import { BrowserWindow } from 'electron'

import { behaviorTracker, stopBehaviorTracker } from './'

let _timer: NodeJS.Timeout

export const startTimer = (mainWindow: BrowserWindow) => {
  if (_timer) {
    clearInterval(_timer)
  }

  _timer = setInterval(() => {
    mainWindow.webContents.send('timer-counting')
  }, 1000)
  behaviorTracker(mainWindow)
}

export const stopTimer = () => {
  if (_timer) {
    clearInterval(_timer)
  }
  stopBehaviorTracker()
}
