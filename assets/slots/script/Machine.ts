import { _decorator, Component, Node, Prefab, CCInteger, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Machine')
export class Machine extends Component {
    @property(Prefab)
    reelPrefab: null

    // @property({ type: CCInteger, tooltip: "Reel数量" })
    private _reelNum = 1

    @property({ type: CCInteger, range: [1, 16], slide: true })
    // set reelNum(num) {
    //     this._reelNum = num
    // }
    // get reelNum() {
    //     return this._reelNum
    // }

    private _reels = []

    start() {
        this.createReel()
    }

    createReel() {
        this._reelNum = this.node.children.length
        for (let i = 0; i < this._reelNum; i++) {
            var node = this.node.children[i]
            this.node.addChild(node)
            this._reels[i] = node
        }
    }
    update(deltaTime: number) {

    }

    startSpin() {
        for (let i = 0; i < this._reelNum; i += 1) {
            const theReel = this._reels[i].getComponent('Reel');

            // if (i % 2) {
            //     theReel.spinDirection = Aux.Direction.Down;
            // } else {
            //     theReel.spinDirection = Aux.Direction.Up;
            // }

            theReel.doSpin(0.03 * i);
        }
    }

    stop() {

    }
}


