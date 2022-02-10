/*
 * @Descripttion: 
 * @version: 
 * @Author: liqiang
 * @email: 497232807@qq.com
 * @Date: 2022-02-10 13:46:59
 * @LastEditTime: 2022-02-10 16:49:27
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
}