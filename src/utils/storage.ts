import Store from 'electron-store'

export const storage = () => {
  const store = new Store({ key: 'taskity-ts' })

  return {
    get: (key: string) => {
      // @ts-ignore
      return store.get(key)
    },

    set: (key: string, val: any) => {
      // @ts-ignore
      store.set(key, val)
    }
  }
}
