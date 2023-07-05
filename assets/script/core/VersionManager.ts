/*
 * @Date: 2023-07-04 13:46:31
 * @LastEditors: Lee 497232807@qq.com
 * @LastEditTime: 2023-07-05 16:39:02
 * @FilePath: \cocos_framework_base\assets\webGame\Common\VersionManager.ts
 */
// 更新状态码
// 0 :更新成功
// 1:不用更新
// 2:获取版本配置文件失败
// 3:获取MD5配置文件失败
// 4:下载单个文件失败
// 5:移动文件失败
// 6:读取包内配置失败
// 7:不支持热更新的版本号
// 8:不支持热更新的渠道
// 9:强制更新

import { resources } from "cc"
import { JsonAsset } from "cc"
import { native } from "cc"
import { NATIVE } from "cc/env"
import { js } from "cc"


export enum StateCode {
    UPDATE_SUCCESS = 0,             //更新成功
    NO_NEED_UPDATE,                 //不用更新
    GET_VERSION_CONFIG_FAI,         //获取版本配置文件失败
    GET_MD5_CONFIG_FAIL,            //获取MD5配置文件失败
    DOWNLOAD_FILE_FAIL,             //下载单个文件失败
    MOVE_FILE_FAIL,                 //移动文件失败
    READ_CONFIG_FAIL,              //读取包内配置失败
    UNSUPPORT_HOT_UPDATE,           //不支持热更新的app版本号
    UNSUPPORT_HOT_UPDATE_CHANNEL,  //不支持热更新的渠道
    FORCE_UPDATE,                   //app强制商店更新
}
/**
 * 文件信息
 */
type fileInfo = {
    fileName: string,
    md5: string,
    size: number
}
/**
 * 热更新配置
 */
type hotConfig = {
    scriptVersion: number, //版本号
    files: Map<string, fileInfo> //文件名称:fileInfo
}
/**
 * 远程配置
 */
type remoteConfig = {
    scriptVersion: number, //版本号
    baseUrl: string, //基础地址
    configFile: string, //配置文件
    channels: string[], //支持渠道
    supportBinarys: string[], //支持的版本号
    forcedBinaryVersions: string[], //强制更新的版本号
}

type ProgressCall = (downSize: number, totalSize: number) => void

/**
 * 配置名称
 */
const fileName = "appinfoiii"
/**
 * 包内配置路径    resources目录下面的路径
 */
const LocalConfigPath: string = fileName

const ConfigDir: string = NATIVE ? native.fileUtils.getWritablePath() + `config` : ""
/**
 * 包外配置路径
 */
const PackageOutPath: string = NATIVE ? ConfigDir+ `/${fileName}.json` : ""
/**
 * 下载临时目录
 */
const DownTempDir: string = NATIVE ? native.fileUtils.getWritablePath() + "packageTemp" : "packageTemp"
/**
 * 下载完移动到热更新目录
 */
const WriteableDIr: string = NATIVE ? native.fileUtils.getWritablePath() + "package" : "package"
console.log("WriteableDIr",WriteableDIr)
/**
 * 主包热更新管理类
 */
export class VersionManager {
    /**
     * 热更新地址
     */
    protected hotUrl: string = null

    /**
     * 热更新回调
     */
    protected finishCall: Function = null

    /**
     * 进度回调
     */
    protected progressCall: ProgressCall = null

    /**
     * 本地配置文件
     */
    protected localConfig: hotConfig = null

    /**
    * 远程配置文件
    */
    protected remoteConfig: remoteConfig = null

    /**
     * 远程md5配置文件
     */
    protected remoteMD5Config: hotConfig = null


    protected totalDownSize: number = 0 //总下载大小

    protected curDownSize: number = 0 //当前下载大小
    /**
     * 开始热更新
     */
    protected startUpdate() {
        //解析本地配置
        this.parseLocalConfig(() => {
            //解析远程配置
            this.parseRemoteConfig((code: number) => {
                if (code == 1)//成功获取远程配置
                {
                    //对比版本号
                    this.compareVersion()
                }
                else //获取远程配置失败
                {
                    this.finishCall(StateCode.GET_VERSION_CONFIG_FAI)
                }
            })
        })

    }


    /**
     * 解析本地配置
     */
    protected parseLocalConfig(oncomplete: Function) {

        this.localConfig = null
        console.log("parseLocalConfig")
        if (native.fileUtils.isFileExist(PackageOutPath))//包外配置存在
        {
            this.localConfig = JSON.parse(native.fileUtils.getStringFromFile(PackageOutPath))
            oncomplete()
        }
        else//包内配置
        {
            resources.load(LocalConfigPath, (err: Error, asset: JsonAsset) => {
                if (err) {
                    this.finishCall(StateCode.READ_CONFIG_FAIL)
                    return
                }

                this.localConfig = asset.json as hotConfig
                oncomplete()
            })
        }
    }

    /**
     * 解析远程配置
     */
    protected parseRemoteConfig(onFinish: Function) {
        console.log("parseRemoteConfig",this.hotUrl)
        this.sendHttpRequest(this.hotUrl, (response: string) => {
            this.remoteConfig = JSON.parse(response) as remoteConfig
            onFinish(1)

        }, () => {
            onFinish(0)
        })
    }
    /**
     * 对比版本号
     */
    protected compareVersion() {
        var localVersion = this.getLocalVersion()
        var remoteVersion = this.getRemoteVersion()
        if (localVersion != remoteVersion)//版本号不一致
        {
            var supportBinarys = this.remoteConfig.supportBinarys //支持热更新app版本号
            var forcedBinaryVersions = this.remoteConfig.forcedBinaryVersions //强制更新版本号
            var supportChannel = this.remoteConfig.channels //支持渠道
            var binaryVersion = "1.0.0" //当前app版本号 TODO
            var channel = "0" //当前渠道 TODO
            if (!supportBinarys.includes(binaryVersion)) //不支持热更新 app版本号
            {
                this.finishCall(StateCode.UNSUPPORT_HOT_UPDATE)
                return
            }
            if (!supportChannel.includes(channel)) //不支持热更新渠道
            {
                this.finishCall(StateCode.UNSUPPORT_HOT_UPDATE_CHANNEL)
                return
            }

            if (forcedBinaryVersions.includes(binaryVersion)) //app强制商店更新
            {
                this.finishCall(StateCode.FORCE_UPDATE)
                return
            }
    
            //获取远程md5配置
            this.getRemoteMD5Config((code: number) => {
                if (code == 1) //对比差异文件
                {
                    this.compareChangeList()
                }
                else {
                    this.finishCall(StateCode.GET_MD5_CONFIG_FAIL) //获取MD5配置文件失败
                }
            })
        }
        else //版本号一致 不需要更新
        {
            this.finishCall(StateCode.NO_NEED_UPDATE)
        }
    }
    /**
     * 对比差异文件
     */
    protected compareChangeList() {
        console.log("compareChangeList")
        this.curDownSize = 0
        this.totalDownSize = 0

        var remoteFiles = this.remoteMD5Config.files //远程文件列表
        var localFiles = this.localConfig.files //本地文件列表
        var changeList: fileInfo[] = [] //差异文件列表
        for (var key in remoteFiles) {
            var remoteFile = remoteFiles[key]
            var localFile = localFiles[key]
            if (!localFile || localFile.md5 != remoteFile.md5) //本地文件不存在 或者md5不一致
            {
                this.totalDownSize = this.totalDownSize + remoteFile.size
                changeList.push(remoteFile)
            }
        }

        this.downChangeFiles(changeList)
    }

    /**
     * 获取文件目录
     * @param url 
     * @returns 
     */
    protected getDirByUrl(url: string): string {
        var arr = url.split("/")
        var path = ""
        if (arr.length > 1) {
            for (var i = 0; i < arr.length - 1; i++) {
                var tempdir = arr[i]
                if (i == 0) {
                    path = tempdir

                }
                else {
                    path = path + "/" + tempdir
                }
            }
        }
        else {
            path = arr[0]
        }
        path = path + "/"
        return path
    }
    /**
     * 下载差异文件
     * @param changeList 
     */
    protected downChangeFiles(changeList: fileInfo[]) {
        console.log("downChangeFiles",changeList.length)
        let moveList: fileInfo[] = [] //需要移动的文件列表
        let downChangeFiles = () => {
            var file: fileInfo = changeList.pop()
            if (file) {
                moveList.push(file)
                console.log(file)
                var baseUrl = js.formatStr(this.remoteConfig.baseUrl, this.remoteConfig.scriptVersion)
                var downFileUrl = baseUrl + file.fileName
                console.log("down",downFileUrl)
                this.sendHttpRequest(downFileUrl, (response:ArrayBuffer) => {
                    console.log("downFileUrl success",downFileUrl, response)
                    var path = DownTempDir + "/" + file.fileName //临时目录
                    var pathDir = this.getDirByUrl(path)
                    if (!native.fileUtils.isDirectoryExist(pathDir))//临时目录不存在
                    {
                        native.fileUtils.createDirectory(pathDir)
                    }
                    native.fileUtils.writeDataToFile(new Uint8Array(response), path) //写入临时目录
                    this.curDownSize = this.curDownSize + file.size
                    this.progressCall(this.curDownSize, this.totalDownSize)
                    downChangeFiles()
                }, () => {
                    console.log("downFileUrl eror",downFileUrl)
                    this.finishCall(StateCode.DOWNLOAD_FILE_FAIL, file.fileName) //下载单个文件失败
                }, "arraybuffer")
            }
            else //下载完成
            {
                this.moveFiles(moveList)
            }
        }

        downChangeFiles()
    }
    /**
     * 移动下载的文件到热更新目录
     * @param moveList 
     */
    protected moveFiles(moveList: fileInfo[]) {
        console.log("moveFiles")
        for (var i = 0; i < moveList.length; i++) {
            var file = moveList[i]
            var path = DownTempDir + "/" + file.fileName //临时目录
            var targetPath = WriteableDIr + "/" + file.fileName //热更新目录
            var targetPathDir = this.getDirByUrl(targetPath)
            if (!native.fileUtils.isDirectoryExist(targetPathDir))//热更新目录不存在
            {
                native.fileUtils.createDirectory(targetPathDir)
            }

            var fileData: ArrayBuffer = native.fileUtils.getDataFromFile(path)
            var b = native.fileUtils.writeDataToFile(fileData, targetPath)
            if (!b) //移动失败
            {
                this.finishCall(StateCode.MOVE_FILE_FAIL, file.fileName) //移动文件失败
                break
            }
        }

        //移动完成
        this.updateSuccess()

    }
    /**
     * 热更新成功
     */
    protected updateSuccess() {
        console.log("updateSuccess")

        native.fileUtils.writeStringToFile(JSON.stringify(this.remoteMD5Config), PackageOutPath)
        //保存最新的配置到本地
        this.finishCall(StateCode.UPDATE_SUCCESS)
    }
    /**
     * 获取远程md5配置
     */
    protected getRemoteMD5Config(onFinish: Function) {
        var baseUrl = js.formatStr(this.remoteConfig.baseUrl, this.remoteConfig.scriptVersion)
        
        var url = baseUrl + this.remoteConfig.configFile
        console.log("getRemoteMD5Config",url)
        this.sendHttpRequest(url, (response: string) => {
            this.remoteMD5Config = JSON.parse(response)
            onFinish(1)
        }, () => {
            onFinish(0)
        })
    }

    /**
     * get请求
     * @param url 
     * @param responce 
     * @param errorCall 
     */
    protected sendHttpRequest(url: string, responce: Function, errorCall: Function, responseType: XMLHttpRequestResponseType = "") {
        var xhr = new XMLHttpRequest()
        xhr.responseType = responseType
        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 300)) {
                responce(xhr.response);
            }
        }
        xhr.onerror = function (err) {
            errorCall(null)
        };
        xhr.ontimeout = function () {
            errorCall(null)
        };
        xhr.onabort = function () {
            errorCall(null)
        }
        xhr.open("GET", url, true);

        // if (NATIVE) {
        //     xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
        // }
        xhr.timeout = 1000;

        xhr.send();
    }


    //===========================外部调用===========================
    /**
     * 检查更新
     * @param url 
     * @param finishCall 
     * @param progressCall 
     */
    checkUpdate(url: string, finishCall: Function, progressCall: ProgressCall) {
        this.hotUrl = url
        this.finishCall = finishCall
        this.progressCall = progressCall

        this.startUpdate()
    }
    /**
     * 获取本地版本号
     */
    getLocalVersion(): number {
        return this.localConfig.scriptVersion
    }
    /**
     * 获取远程版本号
     * @returns 
     */
    getRemoteVersion(): number {
        return this.remoteConfig.scriptVersion
    }

    private static _instance: VersionManager;

    public static get Instance(): VersionManager {
        if (!this._instance) {
            if (NATIVE) {
                if (!native.fileUtils.isDirectoryExist(DownTempDir)) {
                    native.fileUtils.createDirectory(DownTempDir)
                }
                if (!native.fileUtils.isDirectoryExist(WriteableDIr)) {
                    native.fileUtils.createDirectory(WriteableDIr)
                }
                if (!native.fileUtils.isDirectoryExist(ConfigDir)) {
                    native.fileUtils.createDirectory(ConfigDir)
                }
   
            }
            this._instance = new VersionManager()
        }
        return this._instance;
    }
}