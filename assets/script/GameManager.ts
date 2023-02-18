/*
 * @Descripttion: 
 * @version: 
 * @Author: liqiang
 * @email: 497232807@qq.com
 * @Date: 2023-02-17 16:25:21
 * @LastEditTime: 2023-02-18 18:05:52
 */

import { _decorator, Component, Node, AudioClip, AudioSource, Label } from 'cc';
import { IResult } from './IResult';
import { Reel } from './Reel';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(AudioSource)
    public _audioSource: AudioSource = null!;


    @property(Node)
    machine: Node = null;

    @property({ type: AudioClip })
    audioClick: AudioClip = null;

    @property({ type: Reel })
    public Reel: Reel = null

    private block = false;
    private result: IResult = null;

    start() {
        // [3]
        this._audioSource = this.node.getComponent(AudioSource)!;;
    }

    click(): void {
        this._audioSource.play()
        if (this.machine.getComponent('Machine').spinning === false) {
            this.block = false;
            this.machine.getComponent('Machine').spin();
            this.requestResult();
        } else if (!this.block) {
            this.block = true;
            this.machine.getComponent('Machine').lock();
        }
    }

    async requestResult(): Promise<void> {
        this.result = null;
        this.result = await this.getAnswer();
    }

    getAnswer(): Promise<IResult> {
        return new Promise<IResult>(resolve => {
            setTimeout(() => {
                const result: IResult = { reels: [[1, 2, 3]], equalLines: [], equalTile: 2 }
                resolve(result);
            }, 1000 + 500 * Math.random());
        });
    }

    update(): void {
        if (this.block && this.result != null) {
            this.informStop();
            this.result = null;
        }
    }

    informStop(): void {
        console.log(JSON.stringify(this.result))
        this.machine.getComponent('Machine').stop(this.result);


    }
}

