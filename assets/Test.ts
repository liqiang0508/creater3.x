/*
 * @Descripttion: 
 * @version: 
 * @Author: liqiang
 * @email: 497232807@qq.com
 * @Date: 2023-08-25 19:07:29
 * @LastEditTime: 2023-08-25 19:40:15
 */
import { _decorator, Component, Node, Enum, Animation, assetManager } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

enum PopType {

    NONE = 0,
    SCALE,
}

const AnimatonConfig = {
    [PopType.SCALE]: { show: "view_show", hide: "view_dismiss" }
}


@ccclass('Test')
@executeInEditMode(true)
export class Test extends Component {

    protected animation: Animation = null


    @property({ type: Enum(PopType), visible: false })
    popType: PopType = PopType.NONE;

    @property({ type: Enum(PopType), displayName: 'popType', visible: true, tooltip: "弹框类型" })
    get _popType() {
        return this.popType;
    }
    set _popType(type: number) {
        this.popType = type;
        console.log("type", type)
        this.animation = this.node.getComponentInChildren(Animation)
        this.loadData()

    }

    protected async loadData() {

        if (this.popType != PopType.NONE) {
            var popData = AnimatonConfig[this.popType]
            var show_ani = `db://assets/resources/prefabs/${popData.show}.anim`
            var hide_ani = `db://assets/resources/prefabs/${popData.hide}.anim`
            const uuid_show = await Editor.Message.request("asset-db", "query-uuid", show_ani);
            const uuid_hide = await Editor.Message.request("asset-db", "query-uuid", hide_ani);
            assetManager.loadAny([{ uuid: uuid_show }, { uuid: uuid_hide }], (err, data) => {
                if (err) {
                    console.log(err)
                    return
                }
                console.log("assets", data)
                this.animation.clips = data

            })
        }
    }

}

