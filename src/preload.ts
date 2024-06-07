// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

const StoreUtil = {
  get (key: string) {
    return ipcRenderer.sendSync('electron-store-get', key)
  },
  set (key: string, val: any) {
    ipcRenderer.send('electron-store-set', key, val)
  }
}

const TimerUtil = {
  start: () => {
    ipcRenderer.send('start-timer')
  },
  stop: () => {
    ipcRenderer.send('stop-timer')
    ipcRenderer.removeAllListeners('timer-counting')
  },
  counting: (callback: () => void) => ipcRenderer.on('timer-counting', callback)
}

contextBridge.exposeInMainWorld('electron', {
  store: StoreUtil,
  timers: TimerUtil,

  onBehaviorChange: (callback: () => void) =>
    ipcRenderer.on('behavior-change', callback),

  getWallpaper: (callback: (event: IpcRendererEvent, data: string) => void) => {
    ipcRenderer.send('get-wallpaper')
    ipcRenderer.once('set-wallpaper', callback)
  },

  copy: (str: string) => {
    ipcRenderer.send('do-copy', str)
  }
})
