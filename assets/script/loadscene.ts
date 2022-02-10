/*
 * @Descripttion: 
 * @version: 
 * @Author: liqiang
 * @email: 497232807@qq.com
 * @Date: 2022-02-10 12:08:09
 * @LastEditTime: 2022-02-10 13:39:19
 */

import { _decorator, Component, Node, UITransformComponent } from 'cc';
import UITool from './core/UITool';
import Proto from "./pb/gameProto.js";
const { ccclass, property } = _decorator;


@ccclass('loadscene')
export class loadscene extends Component {
    mChild: any = {};

    start() {
        this.mChild = {}
        UITool.getChildNode(this.mChild, this.node)
        console.log(this.mChild.Button)
        UITool.addBtnClick(this.mChild.Button, () => {
            console.log('click')
        })

        //pb Test
        var peron2 = Proto.tutorial.Person.create()
        peron2.name = "hello world"
        peron2.email = "497232807@qq.com"
        peron2.id = 110
        var byteData = Proto.tutorial.Person.encode(peron2).finish()
        console.log("编码测试===========", byteData)

        var decodeData = Proto.tutorial.Person.decode(byteData)
        console.log("解码测试===========", JSON.stringify(decodeData))
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

