// 对
class StorageManager {
    // 静态实例
    // 静态实例
    static instance: StorageManager | null = null
    private _localStorage: Storage | null = null
    private _sessionStorage: Storage | null = null
    private _entry_value: string = ''
    public isInternalOperation: boolean = false
    constructor() {
        if (StorageManager.instance) {
            return StorageManager.instance
        }
        this._localStorage = this._createProtectedStorage(window.localStorage)
        this._sessionStorage = this._createProtectedStorage(window.sessionStorage)
        StorageManager.instance = this
    }

    // 创建受保护的代理
    _createProtectedStorage(storage: Storage) {
        return new Proxy(storage, {
            deleteProperty: (target: Storage, prop: PropertyKey) => {
                if (!this.isInternalOperation) {
                    console.warn(`Attempt to delete storage key ${String(prop)} was blocked.`)
                    return false
                }
                target.removeItem(String(prop))
                this._triggerStorageEvent(String(prop))
                return true
            },
            get: (target, prop) => {
                if (!this.isInternalOperation) {
                    console.warn(`Attempt to read storage key ${String(prop)} was blocked.`)
                    return undefined
                }
                const method = target[String(prop)]
                if (typeof method === 'function') {
                    return (...args: any[]) => {
                        const result = method.apply(target, args)
                        this._triggerStorageEvent(String(prop), result)
                        if (result === undefined) {
                            return true
                        }
                        return result
                    }
                }
                return prop in target ? target[String(prop)] : undefined
            }
        })
    }

    // 手动触发 storage 事件
    _triggerStorageEvent(key: string, newValue: any = null) {
        const event = new StorageEvent('storage', {
            key,
            oldValue: window.localStorage.getItem(key),
            newValue,
            url: window.location.href,
            storageArea: window.localStorage
        })
        // 触发 storage 事件
        window.dispatchEvent(event)
    }

    setInternalFlag(flag: boolean) {
        this.isInternalOperation = flag
    }

    internalSetItem(key: string, value: string) {
        this.setInternalFlag(true) // 开启内部操作
        this._localStorage!.setItem(key, value)
        this.setInternalFlag(false) // 关闭内部操作
    }
    internalRemoveItem(key: string) {
        this.setInternalFlag(true) // 开启内部操作
        this._localStorage!.removeItem(key)
        this.setInternalFlag(false) // 关闭内部操作
    }
    internalGetItem(key: string): string | null {
        this.setInternalFlag(true) // 开启内部操作
        const value = this._localStorage!.getItem(key)
        this.setInternalFlag(false) // 关闭内部操作
        return value
    }
    internalSetSessionItem(key: string, value: string) {
        this.setInternalFlag(true) // 开启内部操作
        this._sessionStorage!.setItem(key, value)
        this.setInternalFlag(false) // 关闭内部操作
    }
    internalRemoveSessionItem(key: string) {
        this.setInternalFlag(true) // 开启内部操作
        this._sessionStorage!.removeItem(key)
        this.setInternalFlag(false) // 关闭内部操作
    }
    internalGetSessionItem(key: string): string | null {
        this.setInternalFlag(true) // 开启内部操作
        const value = this._sessionStorage!.getItem(key)
        this.setInternalFlag(false) // 关闭内部操作
        return value
    }
}

// 使用 StorageManager 类
const storageManager = new StorageManager()
export default storageManager
