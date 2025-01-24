import { enumValue, emumStorage, enumOperation } from '@/utils/enum.js'
import { getenumKey } from '@/utils/index'
import storageManager from '@/utils/storeage.js'
export function eventType(page) {
  // 判断刷新操作
  window.addEventListener('beforeunload', (event) => {
    console.log(this)
    const isRefreshed = sessionStorage.getItem('isRefreshed')
    if (isRefreshed) {
      // 判断是否为标签页关闭
      console.log('页面被刷新或导航离开')
      window.localStorage.setItem('isClose', false)
    } else {
      // 这里可以判断标签页是否关闭，依据存储的值
      console.log('标签页即将关闭')
      window.localStorage.setItem('isClose', true)
    }
  })
  window.addEventListener('unload', () => {
    // window.localStorage.setItem('setup-page', JSON.stringify([...getProcedure(), 'unload']))
  })
  window.addEventListener('load', () => {
    if (sessionStorage.getItem('isRefreshed')) {
      this.eventType.eventCode = getenumKey(enumValue.REFRESH)
      this.eventType.EventSource = enumValue.REFRESH
      this.eventType.isInit = false
      this.triggerEvent(enumValue.REFRESH)
    } else {
      this.eventType.eventCode = getenumKey(enumValue.INIT)
      this.eventType.EventSource = enumValue.INIT
      this.eventType.isInit = true
      this.triggerEvent(enumValue.INIT)
    }
    sessionStorage.setItem('isRefreshed', true)
  })
  document.addEventListener('click', (event) => {
    this.clickTrigger.isClick = true
    this.clickTrigger.target = event
    this.clickTrigger.isMouse = false
    this.triggerEvent(enumValue.CLICK_ELEMENT, event)
  })
  window.addEventListener('line', () => {
    this.resetClickTrigger()
    this.isOnline = true
    // 触发在线事件
    this.triggerEvent(enumValue.ONLINE_OFFLINE)
  })
  window.addEventListener('offline', () => {
    this.resetClickTrigger()
    this.isOnline = false
    // 触发离线事件
    this.triggerEvent(enumValue.ONLINE_OFFLINE)
  })
  window.addEventListener('visibilitychange', () => {
    this.resetClickTrigger()
    this.isVisiable = document.visibilityState === 'visible'
    this.isOver = document.visibilityState === 'hidden'
    // 触发可见监听事件
    this.triggerEvent(enumValue.PAGE_VISIBILITY)
  })
  window.addEventListener('storage', (event) => {
    console.log(event)
    this.resetClickTrigger()
    console.log(event)
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
  console.log(storageManager)
  if (!storageManager.isInternalOperation) {
    if (event.key === emumStorage.UUID_PAGE_LIST) {
      // this.setPageCodeList = JSON.parse(event.oldValue)
    } else {
      this.setPageCode = event.oldValue
    }
  }
}
