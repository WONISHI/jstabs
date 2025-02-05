export default function openBroadcast() {
    console.log('开启广播')
    bc = new BroadcastChannel('cctv')

    // 接收广播
    bc.onmessage = function (e) {
        alert(e.data)
    }

    // 异常处理
    bc.onmessageerror = function (e) {
        console.warn('onmessageerror')
    }
}
