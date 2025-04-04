export const emumStorage = {
    UUID_PAGE: 'uuid-page',
    UUID_PAGE_LIST: 'uuid-page-list',
    BROADCAST_MSG: 'channel-page'
} as const

export const enumValue = {
    DEFAULTS: 'DEFAULTS', //刚进入状态
    CLOSE_TAB_WINDOW: 'CLOSE_TAB_WINDOW', // 用户关闭标签页、浏览器窗口 1 (二进制: 00000001)
    NAVIGATION: 'NAVIGATION', // 导航到其他页面 2 (二进制: 00000010)
    REFRESH: 'REFRESH', // 刷新页面 4 (二进制: 00000100)
    CLICK_ELEMENT: 'CLICK_ELEMENT', // 点击页面元素 8 (二进制: 00001000)
    MOUSE_HOVER: 'MOUSE_HOVER', // 鼠标移入、移出 16 (二进制: 00010000)
    USER_LEAVE: 'USER_LEAVE', // 用户即将离开 32 (二进制: 00100000)
    PAGE_VISIBILITY: 'PAGE_VISIBILITY', // 页面是否可见 64 (二进制: 01000000)
    URL_TRIGGER: 'URL_TRIGGER', // url触发事件 128 (二进制: 10000000)
    STORAGE_EVENT: 'STORAGE_EVENT', // storage事件 256 (二进制: 100000000)
    ONLINE_OFFLINE: 'ONLINE_OFFLINE', // online 和 offline 事件 512 (二进制: 1000000000)
    INIT: 'INIT' // 初始化事件 1024 (二进制: 10000000000)
} as const

export const enumKey = {
    [enumValue.DEFAULTS]: 0 << 0,
    [enumValue.CLOSE_TAB_WINDOW]: 1 << 0, // 用户关闭标签页、浏览器窗口 1 (二进制: 00000001)
    [enumValue.NAVIGATION]: 1 << 1, // 导航到其他页面 2 (二进制: 00000010)
    [enumValue.REFRESH]: 1 << 2, // 刷新页面 4 (二进制: 00000100)
    [enumValue.CLICK_ELEMENT]: 1 << 3, // 点击页面元素 8 (二进制: 00001000)
    [enumValue.MOUSE_HOVER]: 1 << 4, // 鼠标移入、移出 16 (二进制: 00010000)
    [enumValue.USER_LEAVE]: 1 << 5, // 用户即将离开 32 (二进制: 00100000)
    [enumValue.PAGE_VISIBILITY]: 1 << 6, // 页面是否可见 64 (二进制: 01000000)
    [enumValue.URL_TRIGGER]: 1 << 7, // url触发事件 128 (二进制: 10000000)
    [enumValue.STORAGE_EVENT]: 1 << 8, // storage事件 256 (二进制: 100000000)
    [enumValue.ONLINE_OFFLINE]: 1 << 9, // online 和 offline 事件 512 (二进制: 1000000000)
    [enumValue.INIT]: 1 << 10 // 初始化事件 1024 (二进制: 10000000000)
} as const

export const entryKey = {
    INIT: 1 << 0,
    CLOSE_TAB_WINDOW: 1 << 1, // 用户关闭标签页、浏览器窗口 1 (二进制: 00000001)
    REFRESH: 1 << 2,
    NAVIGATION: 1 << 3,
    RECOVER: 1 << 4,
    DEFAULTS: 0 << 0
} as const

// 定义 `emumStorage` 的类型
export type EmumStorage = (typeof emumStorage)[keyof typeof emumStorage]

// 定义 `enumValue` 的类型
export type EnumValue = keyof typeof enumValue

// 定义 `enumKey` 的类型
export type EnumKey = (typeof enumKey)[keyof typeof enumKey]

// 定义 `entryKey` 的类型
export type EntryKey = (typeof entryKey)[keyof typeof entryKey]
