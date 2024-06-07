import { cloneDeep, isFunction } from 'lodash-es';

export const cloneDeepWithoutFunction = (obj: any) => {
  const data: any = {}

  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      !isFunction(obj[key])
    ) {
      data[key] = cloneDeep(obj[key])
    }
  }
  return data
}
