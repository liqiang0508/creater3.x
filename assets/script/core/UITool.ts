/*
 * @Descripttion: 
 * @version: 
 * @Author: liqiang
 * @email: 497232807@qq.com
 * @Date: 2022-02-10 12:09:10
 * @LastEditTime: 2022-02-10 12:30:58
 */
import { Node } from 'cc';
export default {

    getChildNode: function (nodeObject: object, node: Node) {
        var childNode: Node[] = node.children
        for (var i = 0; i < childNode.length; i++) {
            var name = childNode[i].name
            nodeObject[name] = childNode[i]
            this.getChildNode(nodeObject, childNode[i])
        }
    },
    addBtnClick: function (node: Node, endCall: Function, startCall: Function = null, moveCall: Function = null, soundName = "audio_ui_btn_01") {
        node.on(Node.EventType.TOUCH_START, (event) => {
            if (startCall) {
                startCall(event)
            }
        })
        node.on(Node.EventType.TOUCH_MOVE, (event) => {
            if (moveCall) {
                moveCall(event)
            }
        })
        node.on(Node.EventType.TOUCH_END, (event) => {
            if (endCall) {
                // Sound.playEffect(soundName)
                endCall(event)

            }
        })
        node.on(Node.EventType.TOUCH_CANCEL, (event) => {
            if (endCall) {
                // Sound.playEffect(soundName)
                endCall(event)
            }
        })
    }
}
// globalThis.UITool = UITool



