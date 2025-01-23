// 实现目标
/* 通过使用 sessionStorage 存储页面的 uuid保证页面完成初始化，然后在存储localStorage,不同的tab对应不同的sessionStorage，sessionStorage中有uuid对应集合
 * 中的localStorage的，当页面关闭的时候，清除sessionStorage中的uuid，同时清除localStorage中对应的uuid
 * 如果控制台清理sessionStorage，那么需要监听sessionStorage，然后内部执行初始化再存储一遍，然后塞值，其他页面监听到localStorage变会向新增的页面发送消息监听到
 * 的消息然后更新localStorage
 */
import { generateUUID, getenumKey } from './utils'
import { eventType } from '@/utils/event.js'
import { enumValue, emumStorage } from '@/utils/enum.js'
import '@/utils/rewrite.js'

class JsTabs {
  static _eventCallbacks = new Map()
  constructor() {
    if (JsTabs.instance) {
      return JsTabs.instance
    }
    this.init()
    this.changePage = false
    eventType.call(this, this.getPageCode)
    this.resetStatus()

    JsTabs.instance = this
  }

  init() {
    if (!this.getPageCode) this.setPageCode = generateUUID()
    if (this.getPageCodeIndex === -1) this.setPageCodeList = { uuid: this.getPageCode }
  }

  // 触发事件并调用所有注册的回调
  triggerEvent(eventType, ...args) {
    // 获取与事件类型相关的所有回调
    const eventTypeKey = this.setFunName(eventType)
    const callbacks = JsTabs._eventCallbacks.get(eventTypeKey) || []
    callbacks.forEach((callback) => callback(...args)) // 执行回调并传递事件对象
  }

  // 注册回调
  watch(eventType, callback) {
    const eventTypeKey = this.setFunName(eventType)
    if (!JsTabs._eventCallbacks.has(eventTypeKey)) {
      JsTabs._eventCallbacks.set(eventTypeKey, [])
    }
    const eventCallbacks = JsTabs._eventCallbacks.get(eventTypeKey)
    eventCallbacks.push(callback) // 将回调添加到事件类型的回调数组中
  }

  setFunName(eventType) {
    return eventType.toLowerCase()
  }

  // 设置页面初始化uuid
  get getPageCode() {
    return window.sessionStorage.getItem(emumStorage.UUID_PAGE_LIST)
  }
  set setPageCode(pageCode) {
    window.sessionStorage.setItem(emumStorage.UUID_PAGE_LIST, pageCode)
  }

  // 获取项目初始化uuid列表
  get getPageCodeList() {
    return window.localStorage.getItem(emumStorage.UUID_PAGE_LIST) ? JSON.parse(window.localStorage.getItem(emumStorage.UUID_PAGE_LIST)) : []
  }

  set setPageCodeList(pageCodeList) {
    // 判断是对象还是数组
    if (Object.prototype.toString.call(pageCodeList) === '[object Object]') {
      window.localStorage.setItem(emumStorage.UUID_PAGE_LIST, JSON.stringify([...this.getPageCodeList, pageCodeList]))
    } else if (Object.prototype.toString.call(pageCodeList) === '[object Array]') {
      window.localStorage.setItem(emumStorage.UUID_PAGE_LIST, JSON.stringify(pageCodeList))
    }
  }

  // 获取对应页面在项目列表的uuid的哪项
  get getPageCodeIndex() {
    return this.getPageCodeList.findIndex((item) => item.uuid === this.getPageCode)
  }

  // 重置状态
  resetStatus() {
    this.eventType = {
      eventCode: getenumKey(enumValue.INIT), //触发事件的code
      EventSource: enumValue.INIT, //触发事件的字段名
      isInit: true, // 是否已经初始化了
      triggerRefresh: false, // 是否触发刷新了
      triggerClose: false, // 是否触发页签关闭
      triggerUrl: false, // 是否触发了url变化
      process: []
    }
    this.isOnline = true // 是否在线
    this.isVisiable = true // 是否可见
    this.isOver = false // 是否离开
    this.resetClickTrigger()
  }

  resetClickTrigger() {
    this.clickTrigger = {
      isClick: false,
      isMouse: false,
      target: null
    }
  }
}

// 单例模式导出
const jstabs = new JsTabs()
export default jstabs
