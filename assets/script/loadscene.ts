/*
 * @Descripttion: 
 * @version: 
 * @Author: liqiang
 * @email: 497232807@qq.com
 * @Date: 2022-02-10 12:08:09
 * @LastEditTime: 2023-03-04 19:06:51
 */

import { _decorator, Component, Label, CCInteger, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import ConstEventDefine from './config/ConstEventDefine';
import EventManager from './core/EventManager';
import UITool from './core/UITool';
import { convert2NodePos } from './core/utils';
import { CMD } from './pb/cmdDef';

import Proto from "./pb/gameProto.js";
import protoTool from './pb/protoTool';


@ccclass('loadscene')
export class loadscene extends Component {
    mChild: any = {};

    // @property({
    //     type: Node,
    //     visible: true,
    // })
    // targetNode: Node | null = null;
    @property(Node)
    mask = null;

    onLoad() {
        this.mChild = {}
        UITool.getChildNode(this.mChild, this.node)
        this.showGuide(this.mChild.alert)
    }
    showGuide(target: Node) {
        var lcoal_pos = convert2NodePos(this.mask, this.mChild.alert)
        this.mask.position = lcoal_pos
        this.mask.getComponent(UITransform).contentSize = target.getComponent(UITransform).contentSize
    }
    start() {

        console.log(this.mChild.Button)
        UITool.addBtnClick(this.mChild.Button, () => {
            console.log('click')
            UITool.showWaitNetWork()
            setTimeout(() => {
                UITool.dismissWaitNetWork()
            }, 3000)
        })

        UITool.addBtnClick(this.mChild.event, () => {
            EventManager.dispatchEvent(ConstEventDefine.TEST, { "name": "Lee123" })
        })

        UITool.addBtnClick(this.mChild.alert, () => {
            UITool.showAlert("66666", ["yes", "no"], (index) => {
                console.log("index:", index)
            })
        })

        EventManager.on(ConstEventDefine.TEST, this.eventTest, this)

        this.mChild.Label.getComponent(Label).string = "23"

        //pb Test
        var peron2 = Proto.tutorial.Person.create()
        peron2.name = "hello world"
        peron2.email = "497232807@qq.com"
        peron2.id = 110
        var byteData = Proto.tutorial.Person.encode(peron2).finish()
        console.log("编码测试===========", protoTool.Uint8ArrayToString(byteData))

        var decodeData = Proto.tutorial.Person.decode(byteData)
        console.log("解码测试===========", JSON.stringify(decodeData))

        var res = protoTool.encode(CMD.Login, { name: "hello world", email: "497232807@qq.com", id: 201162 })
        console.log("ProtoTool 编码==", res)

        var res1 = protoTool.decode(CMD.Login, res)
        console.log("ProtoTool 解码==", JSON.stringify(res1))
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
    eventTest(data) {
        console.log("EventTest", data)
    }
    onDestroy() {
        EventManager.off(ConstEventDefine.TEST, this.eventTest, this)
    }

}

