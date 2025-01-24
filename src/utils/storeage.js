// 对
class StorageManager {
  constructor() {
    if (StorageManager.instance) {
      return StorageManager.instance
    }
    this._localStorage = this._createProtectedStorage(localStorage)
    this._sessionStorage = this._createProtectedStorage(sessionStorage)
    this._store_key = null
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
  // 在内部操作后触发 storage 事件
  _triggerStorageEvent(key, oldValue, newValue) {
    console.log(3333333333)
    const event = new StorageEvent('storage', {
      key: key,
      oldValue: oldValue,
      newValue: newValue,
      url: window.location.href,
      storageArea: window.localStorage // 适用于 localStorage，sessionStorage 可改为 sessionStorage
    })
    window.dispatchEvent(event)
  }
  internalSetItem(key, value) {
    console.log(222222222222222)
    this.setInternalFlag(true) // 开启内部操作
    const oldValue = this._localStorage.getItem(key)
    this._localStorage.setItem(key, value)
    this.setInternalFlag(false) // 关闭内部操作
    if (oldValue !== value) {
      this._triggerStorageEvent(key, oldValue, value)
    }
  }
  internalRemoveItem(key) {
    this.setInternalFlag(true) // 开启内部操作
    const oldValue = this._localStorage.getItem(key)
    this._localStorage.removeItem(key)
    this.setInternalFlag(false) // 关闭内部操作
    this._triggerStorageEvent(key, oldValue, null)
  }
  internalGetItem(key) {
    this.setInternalFlag(true) // 开启内部操作
    const value = this._localStorage.getItem(key)
    this.setInternalFlag(false) // 关闭内部操作
    return value
  }
  internalSetSessionItem(key, value) {
    console.log(555555555)
    this.setInternalFlag(true) // 开启内部操作
    const oldValue = this._sessionStorage.getItem(key)
    this._sessionStorage.setItem(key, value)
    this.setInternalFlag(false) // 关闭内部操作
    if (oldValue !== value) {
      this._triggerStorageEvent(key, oldValue, value)
    }
  }
  internalRemoveSessionItem(key) {
    this.setInternalFlag(true) // 开启内部操作
    const oldValue = this._sessionStorage.getItem(key)
    this._sessionStorage.removeItem(key)
    
    this.setInternalFlag(false) // 关闭内部操作
    this._triggerStorageEvent(key, oldValue, null)
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
