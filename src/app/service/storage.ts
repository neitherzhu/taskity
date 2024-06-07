export default {
  async get (key: string): Promise<any> {
    const result = await window.electron.store.get(key)
    console.log(
      `%c storage get %c ${key} `,
      'background:green;color:#fff;',
      'background:#fff;color:green;border:1px solid green;',
      result
    )

    return result
  },

  async set (key: string, value: any) {
    console.log(
      `%c storage set %c ${key} `,
      'background:purple;color:#fff;',
      'background:#fff;color:purple;border:1px solid purple;',
      value
    )
    return await window.electron.store.set(key, value)
  }
}
