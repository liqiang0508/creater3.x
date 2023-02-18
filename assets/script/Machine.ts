
import { _decorator, Component, Node, Button, Label, CCInteger, instantiate, Layout, Widget, Prefab } from 'cc';
import { IResult } from './IResult';
const { ccclass, property } = _decorator;


@ccclass('Machine')
export class Machine extends Component {


    @property(Node)
    public button: Node = null;

    public spinning = false //是否正在spinning
    private reels = [];

    @property({ type: CCInteger })
    public _numberOfReels = 1;

    @property({ type: CCInteger, range: [1, 16], slide: true })
    get numberOfReels(): number {
        return this._numberOfReels;
    }

    set numberOfReels(newNumber: number) {
        this._numberOfReels = newNumber;

        if (this.reelPrefab !== null) {
            this.createMachine();
        }
    }

    @property(Prefab)
    public _reelPrefab = null;

    @property({ type: Prefab })
    get reelPrefab(): Prefab {
        return this._reelPrefab;
    }

    set reelPrefab(newPrefab: Prefab) {
        this._reelPrefab = newPrefab;
        this.node.removeAllChildren();

        if (newPrefab !== null) {
            this.createMachine();
        }
    }


    start() {
        // [3]
    }


    createMachine(): void {
        this.node.destroyAllChildren();
        this.reels = [];

        let newReel: Node;
        for (let i = 0; i < this.numberOfReels; i += 1) {
            newReel = instantiate(this.reelPrefab);
            this.node.addChild(newReel);
            this.reels[i] = newReel;

            const reelScript = newReel.getComponent('Reel');
            reelScript.shuffle();
            reelScript.reelAnchor.getComponent(Layout).enabled = false;
        }

        this.node.getComponent(Widget).updateAlignment();
    }

    spin() {
        this.spinning = true
        console.log(this.reels)
        for (let i = 0; i < this.numberOfReels; i += 1) {
            const theReel = this.reels[i].getComponent('Reel');
            theReel.spinDirection = -1
            theReel.doSpin(0.03 * i);
        }

    }
    lock(): void {
        this.button.getComponent(Button).interactable = false;
    }
    stop(result: IResult = null): void {
        setTimeout(() => {
            this.spinning = false;
            this.button.getComponent(Button).interactable = true;
            this.button.getChildByName('Label').getComponent(Label).string = 'SPIN';
            // this.enableGlow(result);
        }, 2500);

        const rngMod = Math.random() / 2;
        for (let i = 0; i < this.numberOfReels; i += 1) {
            const spinDelay = i < 2 + rngMod ? i / 4 : rngMod * (i - 2) + i / 4;
            const theReel = this.reels[i].getComponent('Reel');
            setTimeout(() => {
                theReel.readyStop(result.reels[i]);
            }, spinDelay * 1000);
        }
    }


}


