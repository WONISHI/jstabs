import type { EnumValue } from '@/constant'

declare global {
    interface TabsEventType {
        eventCode: EnumValue //触发事件的code
        EventSource: EnumValue //触发事件的字段名
        isInit: boolean // 是否已经初始化了
        triggerRefresh: boolean // 是否触发刷新了
        triggerClose: boolean // 是否触发页签关闭
        triggerUrl: boolean // 是否触发了url变化
        process: any[]
    }

    interface TabsEvent {
        isClick: boolean
        isMouse: boolean
        target: MouseEvent | null
    }
    interface TabsPage {
        uuid: string
    }
    interface TabsdecomposeField extends TabsPage {
        status: string
    }
}
