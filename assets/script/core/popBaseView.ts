/*
 * @Description: 弹框基类
 * @Author: li qiang
 * @Date: 2021-12-31 09:53:56
 * @LastEditTime: 2022-02-10 16:49:10
 */

import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

import BaseComponent from "./BaseComponent";
import keypadManager from './keypadManager';
import UITool from './UITool';

@ccclass('popBaseView')
export default class popBaseView extends BaseComponent {
    mChild: any = {}
    onLoad() {
        keypadManager.add(this)
    }

    onDestroy() {
        keypadManager.remove(this)
    }
    start() {

    }

    dismisssAnimation(anniName: string = "view_dismiss") {
        UITool.playAnimation(this.mChild.view, anniName, () => {
            this.close();
        })
    }
    close() {
        this.node.destroy()
    }
    //返回键点击弹起
    onbackpress() {
        this.dismisssAnimation()
    }
    // 其他按键点击弹起操作
    onKeyEvent(keyCode) {
        console.log("popBaseView onKeyEvent code:", keyCode)
    }
}
