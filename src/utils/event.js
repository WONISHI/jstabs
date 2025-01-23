import { enumValue, emumStorage, enumOperation } from '@/utils/enum.js'
import { getenumKey } from '@/utils/index'
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
    this.resetClickTrigger()
    // 判断交互动作
    let eventStore = null
    let storageKeys = null
    switch (true) {
      case !event.oldValue && event.newValue:
        eventStore = enumOperation.ADD
        break
      case event.oldValue && event.newValue && event.newValue !== event.oldValue:
        eventStore = enumOperation.EDIT
        changeStorage.call(this, storageType(event, eventStore), eventStore, event)
        break
      case event.oldValue && !event.newValue:
        eventStore = enumOperation.DELETE
        changeStorage.call(this, storageType(event, eventStore), eventStore, event)
        break
      default:
        break
    }

    // 触发storage监听事件
    this.triggerEvent(enumValue.STORAGE_EVENT, event)
  })
}

function storageType(event) {
  if (!event.newValue) {
    return Object.keys(window.localStorage).every((key) => window.localStorage[key] !== event.oldValue) ? 'localStorage' : 'sessionStorage'
  }
  return Object.keys(window.localStorage).includes(event.key) ? 'localStorage' : 'sessionStorage'
}

function changeStorage(storageKeys, eventStore, event) {
  switch (storageKeys) {
    case 'localStorage':
      // 修改localStorage
      if (event.key === emumStorage.UUID_PAGE_LIST) {
        this.setPageCodeList = JSON.parse(event.oldValue)
      }
      break
    case 'sessionStorage':
      if (event.key === emumStorage.UUID_PAGE) {
        this.setPageCode = JSON.parse(event.oldValue)
      }
      break
    default:
      break
  }
}
