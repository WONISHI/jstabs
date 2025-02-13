import { JsTabs } from '@/index'
type JsTabsInstance = InstanceType<typeof JsTabs>
export default function collapseManager(this: JsTabsInstance) {
    navigator.serviceWorker?.register?.('./sw.js').then(() => {
        console.log('ServiceWorker registration success!')
    })
    if (navigator.serviceWorker?.controller !== null) {
        let HEARTBEAT_INTERVAL = 5 * 1000 // 每五秒发一次心跳
        let sessionId = Math.random()
        let that = this
        let heartbeat = function () {
            navigator.serviceWorker.controller!.postMessage({
                type: 'heartbeat',
                id: sessionId,
                data: {
                    target: that
                } // 附加信息，如果页面 crash，上报的附加数据
            })
        }
        window.addEventListener('beforeunload', function () {
            navigator.serviceWorker.controller!.postMessage({
                type: 'unload',
                id: sessionId,
                data: {
                    target: this
                } // 附加信息，如果页面 crash，上报的附加数据
            })
        })
        setInterval(heartbeat, HEARTBEAT_INTERVAL)
        heartbeat()
    }
}
