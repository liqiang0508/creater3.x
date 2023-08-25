/*
 * @Descripttion: 
 * @version: 
 * @Author: liqiang
 * @email: 497232807@qq.com
 * @Date: 2023-03-21 19:51:31
 * @LastEditTime: 2023-03-21 21:09:04
 */
import { _decorator, Component, Node, Prefab, CCInteger, instantiate, Layout, UITransform, Size, CurveRange, RealCurve } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Reel')
export class Reel extends Component {

    @property(Node)
    public reelAnchor = null;

    @property(CurveRange)
    startCurve: CurveRange = new CurveRange();

    @property(CurveRange)
    stopCurve: CurveRange = new CurveRange();

    @property({ type: CCInteger, tooltip: "最大速度" })
    maxSpeed = 100

    @property(Prefab)
    gridPrefab: null

    @property({ type: CCInteger, tooltip: "显示grid数量" })
    _gridNum = 3

    @property({ type: CCInteger, range: [3, 16], slide: true })
    set gridNum(num) {
        this._gridNum = num


    }
    get gridNum() {
        return this._gridNum
    }

    //所有grid数量
    private allGridNum = 0
    private _grids = []
    private _space = 0
    private _gridSize: Size = null
    private updateSpeed: Function = null
    private spinSpeed: number = 0

    start() {
        this._space = this.reelAnchor.getComponent(Layout).spacingY
        this.allGridNum = this._gridNum + 2
        this.createGrid()
    }

    createGrid() {
        this.reelAnchor.destroyAllChildren()
        for (let i = 0; i < this.allGridNum; i++) {
            var node = instantiate(this.gridPrefab)
            this.reelAnchor.addChild(node)
            this._gridSize = node.getComponent(UITransform).contentSize
            this._grids[i] = node
        }
        this.updateMaskSize()
    }

    updateMaskSize() {
        var maskSize = this.node.getComponent(UITransform).contentSize
        var height = this._gridNum * this._gridSize.height + (this._gridNum - 1) * this._space
        console.log("height", height)
        this.node.getComponent(UITransform).contentSize = new Size(maskSize.width, height)

    }
    update(deltaTime: number) {
        if (this.updateSpeed) {
            this.updateSpeed(deltaTime)
        }

    }

    doSpin() {
        this.updateSpeed = (deltaTime: number) => {

            var startTime = this.startCurve
            console.log(startTime)
        }
    }


}


