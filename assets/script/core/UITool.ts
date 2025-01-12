/*
 * @Descripttion: 
 * @version: 
 * @Author: liqiang
 * @email: 497232807@qq.com
 * @Date: 2022-02-10 12:09:10
 * @LastEditTime: 2023-07-05 16:13:54
 */
import { assetManager, director, instantiate, Label, Node, tween, Vec2, Animation, resources } from 'cc';
import Sound from './Sound';
import Alert from '../view/alert/Alert';
export default {

    showWaitState: false,
    getChildNode: function (nodeObject: object, node: Node) {
        var childNode: Node[] = node.children
        for (var i = 0; i < childNode.length; i++) {
            var name = childNode[i].name
            nodeObject[name] = childNode[i]
            this.getChildNode(nodeObject, childNode[i])
        }
    },
    showLoading: function (todoCall: Function, endcall: Function) {
        this.loadPrefabRes("prefabs/loadingNode", (node: Node) => {
            if (node) {
                this.sceneAddNode(node)
                // var LoadingLayer = node.getComponent("LoadingLayer")
                // if (LoadingLayer) {
                //     LoadingLayer.setCallFun(todoCall, endcall)
                // }
            }
        })
    },
    showFlotText: function (text: string, parent = null, pos = new Vec2(0, 0)) {
        this.loadPrefabRes("prefabs/FloatText", (node: Node) => {
            // if (node) {
            //     node.getComponent(Label).string = text
            //     if (parent) {
            //         parent.addChild(node)
            //     }
            //     else {
            //         this.sceneAddNode(node)
            //     }
            //     node.setPosition(pos)
            //     this.playAnimation(node, "floatTextShow", () => {
            //         node.destroy()
            //     })
            // }
        })
    },
    sceneAddNode: function (node: Node) {
        director.getScene().getChildByName('Canvas').addChild(node)
    },
    //加载场景
    loadScene: function (sceneName: string, onLaunchCall = null) {
        director.loadScene(sceneName, onLaunchCall)
    },
    //预加载场景
    preloadScene: function (sceneName: string, progressCall: Function, endCall: Function) {
        director.preloadScene(sceneName, (completedCount: number, totalCount: number, item: any) => {
            var progress = Math.floor(completedCount / totalCount * 100)
            if (progressCall) {
                progressCall(progress)
            }
        }, (error) => {
            if (endCall) {
                endCall(sceneName, error)
            }
        })
    },
    //加载预制体
    loadPrefabRes: function (filepath: string, call: Function) {
        resources.load(filepath, function (err, prefab) {
            if (err) {
                console.log("UITool.loadPrefabRes error====" + filepath)
                if (call) {
                    call(null)
                }
            }
            else {
                var newNode = instantiate(prefab);
                if (call) {
                    call(newNode)
                }
                // cc.loader.setAutoRelease(filepath, true)
            }
        })
    },
    //弹框
    showAlert: function (str: string, btninfo:string[] = ["yes", "no"], call?: Function) {
        this.loadPrefabRes("prefabs/alertNode", function (node: Node) {
            if (node) {
                director.getScene().getChildByName('Canvas').addChild(node)
                var Alert = node.getComponent("Alert") as Alert
                if (Alert) {
                    Alert.showAlert(str, btninfo, function (index) {
                        call?.(index)
                    })
                }
            }
        })
    },
    showTextInput: function (call: Function) {
        this.loadPrefabRes("prefabs/textinput", function (node: Node) {
            if (node) {
                director.getScene().getChildByName('Canvas').addChild(node)
                var textinput = node.getComponent("textinput")
                if (textinput) {
                    // textinput.show(call)
                }
            }
        })
    },
    showChooseUpdate: function (data, call: Function) {
        this.loadPrefabRes("prefabs/selectupdate", function (node: Node) {
            // if (node) {
            //     director.getScene().getChildByName('Canvas').addChild(node)
            //     var chooseupdate = node.getComponent("chooseupdate")
            //     if (chooseupdate) {
            //         chooseupdate.initData(data, call)
            //     }
            // }
        })
    },

    loadBundleScene: function (bundleName: string, finishCall: Function) {
        this.showLoading((layer) => {
            layer.updataProgress(30)
            //@ts-ignore
            var bunldeurl = SubGameManager.getLocalBundlePath(bundleName)
            this.loadBundle(bunldeurl, { onFileProgress: (loaded, total) => console.log("bundle progress==", loaded, total) }, (err, bundle) => {
                if (err) {
                    console.log("Global loadBundle error")
                    if (finishCall) {
                        finishCall(1)
                    }
                    return
                }

                bundle.loadScene(bundleName, function (err, scene) {
                    if (err) {
                        console.log("Global loadBundle scene error")
                        if (finishCall) {
                            finishCall(2)
                        }
                        return
                    }
                    layer.updataProgress(100)
                });
            })
        }, (layer) => {
            if (finishCall) {
                finishCall(0)
            }
            this.loadScene(bundleName)
        })
    },
    loadBundle: function (url, option, complete: Function) {
        assetManager.loadBundle(url, option, (err, bundle) => {
            if (complete) {
                complete(err, bundle)
            }
        })
    },
    //切换场景
    changeScene: function (sceneName: string, call: Function) {
        this.showLoading((layer) => {
            this.preloadScene(sceneName, (progress) => {
                layer.updataProgress(progress)
            })
        }, (layer) => {
            layer.updataProgress(100)
            this.loadScene(sceneName)
            if (call) {
                call()
            }

        })
    },
    showWaitNetWork: function (time = 30) {
        if (this.showWaitState) {
            return
        }
        this.showWaitState = true
        this.loadPrefabRes("prefabs/loadingNode", function (node: Node) {
            if (node) {
                director.getScene().getChildByName("Canvas").addChild(node)
                node.name = "loadingNode"
                tween(node).delay(time)
                    .call(() => { node.destroy() })
                    .start()
            }
        })
    },
    dismissWaitNetWork: function () {
        this.showWaitState = false
        var node = director.getScene().getChildByName("Canvas").getChildByName("loadingNode")
        if (node) {
            node.destroy()
        }
    },
    //播放动画
    playAnimation: function (node: Node, name: string, endCall: Function) {
        var anim = node.getComponent(Animation);
        if (anim) {
            anim.play(name);
            anim.on(Animation.EventType.FINISHED, () => {
                if (endCall) {
                    endCall()
                }
            }, this);
        }
    },
    addBtnClick: function (node: Node, endCall: Function, startCall: Function = null, moveCall: Function = null, soundName = "mouseclick1") {
        node.on(Node.EventType.TOUCH_START, (event) => {
            if (startCall) {
                startCall(event)
            }
        })
        node.on(Node.EventType.TOUCH_MOVE, (event) => {
            if (moveCall) {
                moveCall(event)
            }
        })
        node.on(Node.EventType.TOUCH_END, (event) => {
            if (endCall) {
                Sound.playEffect(soundName)
                endCall(event)

            }
        })
        node.on(Node.EventType.TOUCH_CANCEL, (event) => {
            if (endCall) {
                Sound.playEffect(soundName)
                endCall(event)
            }
        })
    }
}
// globalThis.UITool = UITool



