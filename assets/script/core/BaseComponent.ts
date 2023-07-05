/*
 * @Descripttion: 
 * @version: 
 * @Author: liqiang
 * @email: 497232807@qq.com
 * @Date: 2022-02-10 13:46:59
 * @LastEditTime: 2023-07-05 14:15:43
 */

import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;
@ccclass('BaseComponent')
export default class BaseComponent extends Component {

    mStarted: boolean = false;
    onLoad() {

    }

    start() {
        this.mStarted = true
    }
    onDestroy() {

    }

    isStarted() {
        return this.mStarted
    }

    /**
     * 是否显示
     * @param b 
     */
    show(b:boolean)
    {
        this.node.active = b
    }
}