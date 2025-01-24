import { generateUUID, getBinaryByKey } from '@/utils/index'
import { emumStorage } from '@/utils/enum.js'
import storageManager from '@/utils/storeage.js'
const defaultStatus = 'INIT'
//合并字段
export function combineField(status = defaultStatus) {
  return `${generateUUID()}-${getBinaryByKey(status)}`
}

// 拆解字段
export function decomposeField(pageCode = storageManager.internalGetSessionItem(emumStorage.UUID_PAGE)) {
  const defaultStatus = getBinaryByKey(defaultStatus)
  if (!pageCode) {
    return {
      uuid: null,
      status: defaultStatus
    }
  }
  const regex = /^(.*?-\w{4}[-\w]*?)-(\d{4})$/
  const result = pageCode.match(regex)
  if (result) {
    const status = result[2] || defaultStatus
    return {
      uuid: result[1],
      status
    }
  }
  return {
    uuid: null,
    status: defaultStatus
  }
}
