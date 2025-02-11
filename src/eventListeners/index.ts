import { enumValue, emumStorage, enumKey } from '@/constant'
import { getBinaryByKey } from '@/utils'
import storageManager from '@/storageService'
import { JsTabs } from '@/index'
type JsTabsInstance = InstanceType<typeof JsTabs>
export function eventType(this: JsTabsInstance, page: string, channel: BroadcastChannel | null) {
    const pageCode = JSON.parse(JSON.stringify(page))
    console.log('pageCode', pageCode)
    // 判断刷新操作
    window.addEventListener('unload', () => {
        this.eventType!.eventCode = enumValue.CLOSE_TAB_WINDOW
        this.eventType!.EventSource = enumValue.CLOSE_TAB_WINDOW
        this.eventType!.isInit = false
        this._entry_key = enumValue.CLOSE_TAB_WINDOW
        this._entry_value = getBinaryByKey(enumValue.CLOSE_TAB_WINDOW)
        this.triggerEvent(enumValue.CLOSE_TAB_WINDOW);
        (channel as BroadcastChannel).postMessage({ type: enumValue.CLOSE_TAB_WINDOW, content: pageCode })
        window.localStorage.setItem('STATUS', this._entry_value)
    })
    // 进入页面判断是否已经初始化
    window.addEventListener('load', () => {
        if (this._entry_key === enumValue.INIT) {
            this.eventType!.eventCode = enumValue.REFRESH
            this.eventType!.EventSource = enumValue.REFRESH
            this.eventType!.isInit = false
            this._entry_key = enumValue.REFRESH
            this._entry_value = getBinaryByKey(enumValue.REFRESH)
            this.triggerEvent(enumValue.REFRESH)
            this.setPageCode = enumValue.REFRESH
        }
        if (this._entry_key !== enumValue.REFRESH) {
            // 初始化
            this.eventType!.eventCode = enumValue.INIT
            this.eventType!.EventSource = enumValue.INIT
            this.eventType!.isInit = true
            this.triggerEvent(enumValue.INIT)
            this._entry_key = enumValue.INIT
            this._entry_value = getBinaryByKey(enumValue.INIT)
            // 更新刷新后的状态
            this.setPageCode = enumValue.INIT
        }
    })
    document.addEventListener('click', (event) => {
        this.clickTrigger!.isClick = true
        this.clickTrigger!.target = event
        this.clickTrigger!.isMouse = false
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
    window.addEventListener('storage', (event: StorageEvent) => {
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
function changeStorage(this: JsTabsInstance, event: StorageEvent) {
    if (event.key !== emumStorage.UUID_PAGE && event.key !== emumStorage.UUID_PAGE_LIST) return
    if (!storageManager.isInternalOperation && !this.eventType!.isInit) {
        if (event.key === emumStorage.UUID_PAGE_LIST) {
            // this.setPageCodeList = JSON.parse(event.oldValue);
            console.log('我让你触发')
        } else {
            console.log('进来了')
            const oldValue = event.oldValue as string | undefined
            if (oldValue && Object.values(enumValue).includes(oldValue as any)) {
                this.setPageCode = oldValue as keyof typeof enumValue
            } else {
                console.warn('Invalid value for setPageCode:', oldValue)
            }
        }
    }
}
