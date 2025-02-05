import { enumValue, emumStorage } from '@/constant'
import { getBinaryByKey } from '@/utils'
import storageManager from '@/storageService'
export function eventType(page) {
    // 判断刷新操作
    window.addEventListener('unload', () => {
        this.eventType.eventCode = enumValue.CLOSE_TAB_WINDOW
        this.eventType.EventSource = enumValue.CLOSE_TAB_WINDOW
        this.eventType.isInit = false
        this._entry_value = enumValue.CLOSE_TAB_WINDOW
        this._entry_value = getBinaryByKey(enumValue.CLOSE_TAB_WINDOW)
        this.triggerEvent(enumValue.CLOSE_TAB_WINDOW)
        window.localStorage.setItem('STATUS', this._entry_value)
    })
    window.addEventListener('load', () => {
        // 刷新
        if (getBinaryByKey(enumValue.REFRESH) === this._entry_value) {
            this.eventType.eventCode = enumValue.REFRESH
            this.eventType.EventSource = enumValue.REFRESH
            this.eventType.isInit = false
            this._entry_value = enumValue.REFRESH
            this._entry_value = getBinaryByKey(enumValue.REFRESH)
            console.log('刷新',this)
            this.triggerEvent(enumValue.REFRESH)
        } else {
            // 初始化
            this.eventType.eventCode = enumValue.INIT
            this.eventType.EventSource = enumValue.INIT
            this.eventType.isInit = true
            this.triggerEvent(enumValue.INIT)
            this._entry_value = enumValue.INIT
            this._entry_value = getBinaryByKey(enumValue.INIT)
            console.log(this,9999999)
        }
        // 更新刷新后的状态
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
        // console.log('触发监听')
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
    // console.log(storageManager.isInternalOperation,this)
    // debugger;
    if (!storageManager.isInternalOperation && !this.eventType.isInit) {
        if (event.key === emumStorage.UUID_PAGE_LIST) {
            // this.setPageCodeList = JSON.parse(event.oldValue)
            // console.log('我让你触发')
        } else {
            this.setPageCode = event.oldValue
        }
    }
}
