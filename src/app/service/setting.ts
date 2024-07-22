import Storage from './storage'
import { cloneDeepWithoutFunction } from '@app/util'
import type { Setting } from '@app/types'

const KEY = 'setting-ts'

export default {
  async getSetting (): Promise<Setting> {
    return (await Storage.get(KEY)) || {}
  },

  async setSetting (setting: Setting) {
    return await Storage.set(KEY, cloneDeepWithoutFunction(setting))
  }
}
