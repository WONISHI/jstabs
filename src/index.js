// 实现目标
/* 通过使用 sessionStorage 存储页面的 uuid保证页面完成初始化，然后在存储localStorage,不同的tab对应不同的sessionStorage，sessionStorage中有uuid对应集合
 * 中的localStorage的，当页面关闭的时候，清除sessionStorage中的uuid，同时清除localStorage中对应的uuid
 * 如果控制台清理sessionStorage，那么需要监听sessionStorage，然后内部执行初始化再存储一遍，然后塞值，其他页面监听到localStorage变会向新增的页面发送消息监听到
 * 的消息然后更新localStorage
 */
import { typeOf, getBinaryByKey, getKeyByBinary } from './utils'
import { eventType } from '@/eventListeners'
import { enumValue, emumStorage } from '@/constant'
import storageManager from '@/storageService'
import { combineField, decomposeField } from '@/dataStructures'
import openBroadcast from '@/broadcastListeners'
// import '@/utils/rewrite.js'

class JsTabs {
    static _eventCallbacks = new Map()
    constructor() {
        if (JsTabs.instance) {
            return JsTabs.instance
        }
        // 绑定this
        this._entry_key = getKeyByBinary(decomposeField(storageManager.internalGetSessionItem(emumStorage.UUID_PAGE)).status || enumValue.DEFAULTS)
        this._entry_value = getBinaryByKey(this._entry_key)
        // // 初始化监听
        eventType.call(this, this.getPageCode)
        // // 初始化方法
        this.init()
        // // 重置状态
        this._resetStatus()

        JsTabs.instance = this
    }

    init() {
        console.log(this.getPageCode)
        if (!this.getPageCode) this.setPageCode = this._entry_key
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
        return decomposeField(storageManager.internalGetSessionItem(emumStorage.UUID_PAGE)).uuid
    }
    set setPageCode(EntryKey) {
        if (this.getPageCode) {
            storageManager.internalSetSessionItem(emumStorage.UUID_PAGE, this.getPageCode + '-' + getBinaryByKey(EntryKey))
        } else {
            storageManager.internalSetSessionItem(emumStorage.UUID_PAGE, combineField(EntryKey))
        }
    }

    // 获取项目初始化uuid列表
    get getPageCodeList() {
        return storageManager.internalGetItem(emumStorage.UUID_PAGE_LIST) ? JSON.parse(storageManager.internalGetItem(emumStorage.UUID_PAGE_LIST)) : []
    }

    set setPageCodeList(pageCodeList) {
        // 判断是对象还是数组
        if (typeOf(pageCodeList) === 'object') {
            storageManager.internalSetItem(emumStorage.UUID_PAGE_LIST, JSON.stringify([...this.getPageCodeList, pageCodeList]))
        } else if (typeOf(pageCodeList) === 'array') {
            storageManager.internalSetItem(emumStorage.UUID_PAGE_LIST, JSON.stringify(pageCodeList))
        }
    }

    // 获取对应页面在项目列表的uuid的哪项
    get getPageCodeIndex() {
        return this.getPageCodeList.length ? this.getPageCodeList.findIndex((item) => item.uuid === this.getPageCode) : -1
    }

    // 重置状态
    _resetStatus() {
        this.eventType = {
            eventCode: enumValue.DEFAULTS, //触发事件的code
            EventSource: enumValue.DEFAULTS, //触发事件的字段名
            isInit: false, // 是否已经初始化了
            triggerRefresh: false, // 是否触发刷新了
            triggerClose: false, // 是否触发页签关闭
            triggerUrl: false, // 是否触发了url变化
            process: []
        }
        this.isOnline = true // 是否在线
        this.isVisiable = true // 是否可见
        this.isOver = false // 是否离开
        this._resetClickTrigger()
    }

    _resetClickTrigger() {
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
