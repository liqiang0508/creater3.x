/*
 * @Descripttion: 
 * @version: 
 * @Author: liqiang
 * @email: 497232807@qq.com
 * @Date: 2023-02-15 16:10:03
 * @LastEditTime: 2023-02-18 17:59:07
 */

import { _decorator, Component, Node, SpriteFrame, Sprite } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('Tile')
export class Tile extends Component {
    @property({ type: [SpriteFrame], visible: true })
    private textures = [];

    start() {
        // [3]
        this.setRandom()
    }

    setTile(index: number): void {
        this.node.getComponent(Sprite).spriteFrame = this.textures[index];
    }

    setRandom(): void {
        const randomIndex = Math.floor(Math.random() * this.textures.length);
        this.setTile(randomIndex);
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
}



