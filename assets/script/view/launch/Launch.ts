
import { NATIVE } from 'cc/env';
import BaseComponent from '../../core/BaseComponent';
import UITool from '../../core/UITool';
import { StateCode, VersionManager } from '../../core/VersionManager';
import { _decorator, Component, director, game, Node, ProgressBar, size } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Launch')
export class Launch extends BaseComponent {

    @property(ProgressBar)
    progressBar: ProgressBar = null;

    start() {

        if(NATIVE)
        {
            this.checkUpdate()  
        }
        else
        {
            director.loadScene("main")
        }
        
    }

    /**
     * 检查更新
     */
    protected checkUpdate()
    {
        
        var url = "http://192.168.0.158/hotupversion/configrelease"
        VersionManager.Instance.checkUpdate(url,(code:StateCode)=>{
            console.log("code",code)
            if(code==StateCode.UPDATE_SUCCESS) //更新成功
            {
                game.restart()
            }
            else if(code==StateCode.NO_NEED_UPDATE) //不用更新
            {
                director.loadScene("main")
            }
            else{
                 UITool.showAlert(`error code ${code}`)
            }
        },(size:number,totalSizre:number)=>{
            this.progressBar.progress = Math.floor(size/totalSizre)
        })
    }

}

