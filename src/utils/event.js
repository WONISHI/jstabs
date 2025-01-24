import { enumValue, emumStorage } from '@/utils/enum.js'
import { getBinaryByKey } from '@/utils/index'
import storageManager from '@/utils/storeage.js'
export function eventType(page) {
    // 判断刷新操作
    window.addEventListener('beforeunload', (event) => {
        if (getBinaryByKey(enumValue.REFRESH) !== this._entry_value) {
            this._entry_key = enumValue.CLOSE_TAB_WINDOW
            this._entry_value = getBinaryByKey(enumValue.CLOSE_TAB_WINDOW)
            this.setPageCode = enumValue.CLOSE_TAB_WINDOW
            window.localStorage.setItem('setup-page', enumValue.CLOSE_TAB_WINDOW)
        }
    })
    window.addEventListener('load', () => {
        console.log(typeof getBinaryByKey(enumValue.REFRESH), this._entry_value)
        if (getBinaryByKey(enumValue.REFRESH) === this._entry_value) {
            this.eventType.eventCode = enumValue.REFRESH
            this.eventType.EventSource = enumValue.REFRESH
            this.eventType.isInit = false
            this._entry_value = enumValue.REFRESH
            this._entry_value = getBinaryByKey(enumValue.REFRESH)
            this.triggerEvent(enumValue.REFRESH)
        } else {
            this.eventType.eventCode = enumValue.INIT
            this.eventType.EventSource = enumValue.INIT
            this.eventType.isInit = true
            this.triggerEvent(enumValue.INIT)
        }
        this.setPageCode = enumValue.REFRESH
        this._entry_value = getBinaryByKey(enumValue.REFRESH)
        this._entry_key = enumValue.REFRESH
    })
    document.addEventListener('click', (event) => {
        this.clickTrigger.isClick = true
        this.clickTrigger.target = event
        this.clickTrigger.isMouse = false
        this.triggerEvent(enumValue.CLICK_ELEMENT, event)
    })
    window.addEventListener('line', () => {
        this._resetClickTrigger()
        this.isOnline = true
        // 触发在线事件
        this.triggerEvent(enumValue.ONLINE_OFFLINE)
    })
    window.addEventListener('offline', () => {
        this._resetClickTrigger()
        this.isOnline = false
        // 触发离线事件
        this.triggerEvent(enumValue.ONLINE_OFFLINE)
    })
    window.addEventListener('visibilitychange', () => {
        this._resetClickTrigger()
        this.isVisiable = document.visibilityState === 'visible'
        this.isOver = document.visibilityState === 'hidden'
        // 触发可见监听事件
        this.triggerEvent(enumValue.PAGE_VISIBILITY)
    })
    window.addEventListener('storage', (event) => {
        this._resetClickTrigger()
        // 判断交互动作
        switch (true) {
            case event.oldValue && event.newValue && event.newValue !== event.oldValue:
            case event.oldValue && !event.newValue:
                changeStorage.call(this, event)
                break
            default:
                break
        }
        // 触发storage监听事件
        this.triggerEvent(enumValue.STORAGE_EVENT, event)
    })
}

// 监听外部修改localStorage和sessionStorage
function changeStorage(event) {
    if (event.key !== emumStorage.UUID_PAGE && event.key !== emumStorage.UUID_PAGE_LIST) return
    if (!storageManager.isInternalOperation) {
        if (event.key === emumStorage.UUID_PAGE_LIST) {
            // this.setPageCodeList = JSON.parse(event.oldValue)
        } else {
            // this.setPageCode = event.oldValue
        }
    }
}
