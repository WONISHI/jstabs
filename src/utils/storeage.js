// 对
class StorageManager {
  constructor() {
    if (StorageManager.instance) {
      return StorageManager.instance
    }
    this._localStorage = this._createProtectedStorage(window.localStorage)
    this._sessionStorage = this._createProtectedStorage(window.sessionStorage)
    StorageManager.instance = this
  }

  // 创建受保护的代理
  _createProtectedStorage(storage) {
    return new Proxy(storage, {
      deleteProperty: (target, prop) => {
        if (!this.isInternalOperation) {
          console.warn(`Attempt to delete storage key ${prop} was blocked.`)
          return false
        }
        delete target[prop]
        return true
      },
      get: (target, prop) => {
        if (!this.isInternalOperation) {
          console.warn(`Attempt to read storage key ${prop} was blocked.`)
          return undefined
        }
        const method = target[prop]
        if (typeof method === 'function') {
          return (...args) => {
            const result = method.apply(target, args)
            if (result === undefined) {
              return true
            }
            return result
          }
        }
        return prop in target ? target[prop] : undefined
      }
    })
  }

  setInternalFlag(flag) {
    this.isInternalOperation = flag
  }

  internalSetItem(key, value) {
    this.setInternalFlag(true) // 开启内部操作
    this._localStorage.setItem(key, value)
    this.setInternalFlag(false) // 关闭内部操作
  }
  internalRemoveItem(key) {
    this.setInternalFlag(true) // 开启内部操作
    this._localStorage.removeItem(key)
    this.setInternalFlag(false) // 关闭内部操作
  }
  internalGetItem(key) {
    this.setInternalFlag(true) // 开启内部操作
    const value = this._localStorage.getItem(key)
    this.setInternalFlag(false) // 关闭内部操作
    return value
  }
  internalSetSessionItem(key, value) {
    this.setInternalFlag(true) // 开启内部操作
    this._sessionStorage.setItem(key, value)
    this.setInternalFlag(false) // 关闭内部操作
  }
  internalRemoveSessionItem(key) {
    this.setInternalFlag(true) // 开启内部操作
    this._sessionStorage.removeItem(key)
    this.setInternalFlag(false) // 关闭内部操作
  }
  internalGetSessionItem(key) {
    this.setInternalFlag(true) // 开启内部操作
    const value = this._sessionStorage.getItem(key)
    this.setInternalFlag(false) // 关闭内部操作
    return value
  }
}

// 使用 StorageManager 类
const storageManager = new StorageManager()
export default storageManager
