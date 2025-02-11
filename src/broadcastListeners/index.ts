import { emumStorage } from '@/constant'
import { JsTabs } from '@/index'
type JsTabsInstance = InstanceType<typeof JsTabs>
export default function openBroadcast(this: JsTabsInstance) {
    const channel = new BroadcastChannel(emumStorage.BROADCAST_MSG)
    channel.addEventListener('message', (event) => {
        if (event.data.type === 'CLOSE_TAB_WINDOW') {
            const newValue = this.getPageCodeList.filter((item: TabsPage) => item.uuid !== event.data.content)
            this.setPageCodeList = newValue
        }
    })
    return channel
}
