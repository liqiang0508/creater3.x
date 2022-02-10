/*
 * @Descripttion: 
 * @version: 
 * @Author: liqiang
 * @email: 497232807@qq.com
 * @Date: 2022-02-10 13:46:59
 * @LastEditTime: 2022-02-10 14:44:48
 */
import { EventTarget } from 'cc';
var EventManager = {
    init() {
        this.mEventTarget = new EventTarget()
    },
    on(eventName: string, call: Function) {
        this.mEventTarget.on(eventName, (event) => {
            if (call) {
                call(event)
            }
        })
    },
    off(eventName: string, call: Function) {
        this.mEventTarget.off(eventName, (event) => {
            if (call) {
                call()
            }
        })
    },
    dispatchEvent(eventName: string, data: any) {
        this.mEventTarget.emit(eventName, data)
    }
}
EventManager.init()

export default EventManager