
import { _decorator, Component, Node, Prefab, instantiate, Vec2, Vec3, tween, Layout, CCInteger } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('Reel')
export class Reel extends Component {



    @property({ type: Prefab, tooltip: "Tile预制" })
    public tilePrefab = null;

    @property({ type: CCInteger })
    public _numberOfTile = 5;
    @property({ type: CCInteger, tooltip: "多少个Tile" })
    get numberOfTile() {
        return this._numberOfTile;
    }

    set numberOfTile(newNumber) {
        this._numberOfTile = newNumber;
        if (this.tilePrefab) {
            this.createTile();
            this.shuffle();
        }
    }
    @property({ type: Node, tooltip: "reel锚点" }
    )
    public reelAnchor = null

    @property({ type: [Node], visible: false })
    private tiles = [];

    private result: Array<number> = [];

    @property({ type: Node, tooltip: "btn" }
    )
    public spinBtn = null

    createTile(): void {
        let newTile: Node;
        this.reelAnchor.destroyAllChildren();
        this.tiles = []
        for (let i = 0; i < this._numberOfTile; i += 1) {
            newTile = instantiate(this.tilePrefab);
            this.reelAnchor.addChild(newTile);
            this.tiles[i] = newTile;
        }
    }

    shuffle(): void {
        for (let i = 0; i < this.tiles.length; i += 1) {
            this.tiles[i].getComponent('Tile').setRandom();
        }
    }

    start() {

    }

    onLoad() {
        // this.createTile()
        // this.shuffle();
        // this.reelAnchor.getComponent(Layout).enabled = false;
    }
    // 开始转动
    startSpin() {

        console.log("startSpin")
        this.reelAnchor.children.forEach(element => {
            const dirModifier = -1;

            let windUp = 0.1
            const delay = tween(element).delay(windUp);
            const start = tween(element).by(0.3, { position: new Vec3(0, 148 * dirModifier, 0) }, { easing: 'backIn' }); //{ easing: 'backIn' }
            const doChange = tween().call(() => this.changeCallback(element));
            const callSpinning = tween(element).call(() => this.doSpinning(element, this._numberOfTile));

            delay
                .then(start)
                .then(doChange)
                .then(callSpinning)
                .start();


            // const move = tween(element).by(0.04, { position: new Vec3(0, 148 * dirModifier, 0) });
            // const doChange = tween(element).call(() => this.changeCallback(element));
            // const repeat = tween(element).repeat(1, move.then(doChange));
            // const checkEnd = tween(element).call(() => this.checkEndCallback(element));
            // repeat.then(checkEnd).start();
        });
    }

    doSpinning(element: Node = null, times = 1): void {
        const dirModifier = -1

        const move = tween(element).by(0.04, { position: new Vec3(0, 148 * dirModifier, 0) });
        const doChange = tween(element).call(() => this.changeCallback(element));
        const repeat = tween(element).repeat(times, move.then(doChange));
        const checkEnd = tween(element).call(() => this.checkEndCallback(element));

        repeat.then(checkEnd).start();
    }

    changeCallback(element: Node = null): void {
        const el = element;
        const dirModifier = -1
        if (el.position.y * dirModifier > 296) {
            el.position = new Vec3(0, -296 * dirModifier, 0);

            let pop = null;
            if (this.result != null && this.result.length > 0) {
                pop = this.result.pop();
            }

            if (pop != null && pop >= 0) {
                el.getComponent('Tile').setTile(pop);
            } else {
                el.getComponent('Tile').setRandom();
            }
        }
    }
    checkEndCallback(element: Node = null): void {
        const el = element;
        // if (this.stopSpinning) {
        //     this.getComponent(cc.AudioSource).play();
        //     this.doStop(el);
        // } else {
        this.doSpinning(el);
        // }
    }
}

