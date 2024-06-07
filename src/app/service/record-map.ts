import type { BaseRecord, RecordMap } from '@app/types'
import Storage from './storage';

const KEY = 'record-map-ts'

export default {
  async getRecordMap (): Promise<RecordMap> {
    return (await Storage.get(KEY)) || {}
  },

  async setRecordMap (recordMap: RecordMap) {
    return await Storage.set(KEY, recordMap)
  },

  async addRecord (id: number, record: BaseRecord) {
    const recordMap = await this.getRecordMap()

    if (!recordMap[id]) {
      recordMap[id] = []
    }
    recordMap[id].push(record)

    return await Storage.set(KEY, recordMap)
  },

  async deleteRecord (id: number) {
    const recordMap = await this.getRecordMap()
    delete recordMap[id]
    await this.setRecordMap(recordMap)
  }
}
