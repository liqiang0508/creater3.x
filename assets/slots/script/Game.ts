import { _decorator, Component, Node } from 'cc';
import { Machine } from './Machine';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(Machine)
    Machine = null

    start() {

    }

    update(deltaTime: number) {

    }

    startSpin() {
        this.Machine?.startSpin()
    }
}


