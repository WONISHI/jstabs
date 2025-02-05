import { emumStorage } from '@/constant'
export default function openBroadcast() {
    const channel = new BroadcastChannel(emumStorage.BROADCAST_MSG)
    channel.addEventListener('message', (event) => {
        if (event.data.type === 'CLOSE_TAB_WINDOW') {
            const newValue = this.getPageCodeList.filter((item) => item.uuid !== event.data.content)
            this.setPageCodeList = newValue
        }
    })
    return channel
}
