import { BrowserWindow } from 'electron'

let _timer: NodeJS.Timeout

export const startTimer = (mainWindow: BrowserWindow) => {
  if (_timer) {
    clearInterval(_timer)
  }

  _timer = setInterval(() => {
    mainWindow.webContents.send('timer-counting')
  }, 1000)
}

export const stopTimer = () => {
  if (_timer) {
    clearInterval(_timer)
  }
}
