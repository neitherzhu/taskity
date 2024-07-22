import { action, makeAutoObservable, observable } from 'mobx'
import { settingService } from '@app/service'
import { Setting } from '@app/types'

export class SettingStore {
  @observable stopWhenLockScreen = true
  @observable startWhenUnlockScreen = false
  @observable stopWhenNoBehaviorInMiniutes = 5

  constructor () {
    makeAutoObservable(this)
  }

  @action
  getSetting = async () => {
    const setting = await settingService.getSetting()
    this.update(setting, true)
    return setting
  }

  @action
  update = async (setting: Setting, ignoreRemote?: boolean) => {
    Object.keys(setting).forEach((x: keyof Setting) => {
      // @ts-ignore
      this[x] = setting[x]
    })

    if (ignoreRemote) {
      return
    }

    await settingService.setSetting(this)
  }
}

export default new SettingStore()
