#!/usr/bin/python
# -*- coding: UTF-8 -*-
print("generateLocalConfig Start==========================")

from msilib.schema import File
import os
import hashlib
import json
import shutil
import ziputils
from collections import OrderedDict
import projectConfig
# 忽略文件
IgnorFile = [
    "CT_main.strings", "EN_main.strings", "appinfoiii.json", "NO_main.strings"
]
# 忽略文件夹
IgnorDir = ["res\\config", "res\\Default"]
# exe路径
ExePath = projectConfig.CocosCreatorExePath


#复制 src目录下面所有的文件到 dst目录下面
def copyFileTree(src, dst):
    if os.path.exists(dst):
        print(dst + "  delete**** ")
        shutil.rmtree(dst)
    else:
        pass

    shutil.copytree(src, dst)
    print("copy tree %s -> %s" % (src, dst))


def moveFile(srcfile, dstfile):
    if not os.path.isfile(srcfile):
        print("%s not exist!" % (srcfile))
    else:
        fpath, fname = os.path.split(dstfile)  #分离文件名和路径
        if not os.path.exists(fpath):
            os.makedirs(fpath)  #创建路径
        shutil.move(srcfile, dstfile)


# 复制文件
def copyFile(srcfile, dstfile):
    if not os.path.isfile(srcfile):
        print("%s not exist!" % (srcfile))
    else:
        fpath, fname = os.path.split(dstfile)  #分离文件名和路径
        if not os.path.exists(fpath):
            os.makedirs(fpath)  #创建路径
        print("copyFile %s -> %s" % (srcfile, dstfile))
        shutil.copyfile(srcfile, dstfile)  #复制文件


def getFileMd5(filename):
    if not os.path.isfile(filename):
        return
    myhash = hashlib.md5()  # create a md5 object

    F = open(filename, 'rb')

    while True:
        b = F.read(8096)  # get file content.
        if not b:
            break
        myhash.update(b)  #encrypt the file
    F.close()
    return myhash.hexdigest()


def getFileSize(filePath):
    return os.path.getsize(filePath)


def walk(path):
    # print "walk======",path
    for dirpath, dirnames, filenames in os.walk(path):  #
        # print "dirpath=",dirpath
        for filename in filenames:
            if dirpath in IgnorDir:
                continue
            if filename in IgnorFile:
                print("ignore file ==========", filename)
                continue

            filename = os.path.join(dirpath, filename)
            # print "walk......",path,getFileMd5(path).upper()
            filename = filename.replace("\\", "/")
            # print filename
            filedata = OrderedDict()
            filedata["fileName"] = filename
            filedata["md5"] = getFileMd5(filename).upper()
            filedata["size"] = getFileSize(filename)

            data["files"].append(filedata)


def BuildRes():
    print("BuildRes Start**************")
    projectPath = os.path.abspath(os.path.join(os.getcwd(), "../"))
    configPath = os.path.join(projectPath, "buildConfig/buildConfig_android.json")
    buildcmd = ExePath +  " --project " + projectPath  +"  --build  configPath=" + configPath 
    print(buildcmd)
    os.system(buildcmd)
    print("BuildRes end**************")


def GetAppInfoFileName():  #获取appinfoiii的打包后的资源名 然后生成md5的时候排除
    res = '../assets/resources/appinfoiii.json.meta'
    if not os.path.exists(res):
        print("no appinfoiii.json.meta file please build")
        return
    with open(res, "r") as f:
        data = f.read()
        data = json.loads(data)
        print(data["uuid"])
        return data["uuid"] + ".json"


scriptVersion = 0
if os.path.exists("../assets/resources/appinfoiii.json"):  #判断本地有没有配置文件 获取当前版本号
    with open("../assets/resources/appinfoiii.json", "r") as f:
        filedata = f.read()
        jsondata = json.loads(filedata)
        scriptVersion = jsondata['scriptVersion']
        print(scriptVersion)
if not os.path.exists("../hotupversion"):
    os.mkdir("../hotupversion")

BuildRes()  #先生成编译出来的资源和脚本
IgnorFile.append(GetAppInfoFileName())  #把appinfoiii生成的文件在生成md5里面去掉
data = OrderedDict()
scriptVersion = scriptVersion + 1  #版本号加1
data["scriptVersion"] = scriptVersion
data["files"] = []

os.chdir("../build/android/assets")

walk("src")  #生成src的配置
walk("assets")  #生成res的配置
walk("jsb-adapter")  #生成jsb-adapter的配置
os.chdir("../../../")

with open("appinfoiii.json", "w") as f:  #保存md5配置文件
    f.write(json.dumps(data, indent=4))
    f.close()

copyFile("appinfoiii.json", "assets/resources/appinfoiii.json")  #生成最新的配置复制到项目中

#移动资源到hotupversion文件夹
copyFileTree("build/android/assets", "hotupversion/Script_" +
             str(scriptVersion))  #移动到hotupversion文件夹

moveFile("appinfoiii.json", "hotupversion/Script_" + str(scriptVersion) +
         "/appinfoiii.json")  #配置文件移动到hotupversion文件夹

print(os.getcwd())
os.chdir("HotupDateTools")
BuildRes()  #上面生成最新的配置 所以还要编译一次
os.chdir("../")
print(os.getcwd())
configrelease = "hotupversion/configrelease"
data = None
with open(configrelease, "r") as f:
    data = f.read()
    f.close()
oldscriptVersion = json.loads(data)['scriptVersion']  #老的版本号
data = data.replace('\"scriptVersion\": ' + str(oldscriptVersion),
                    '\"scriptVersion\": ' + str(scriptVersion))

with open(configrelease, "w") as f:
    f.write(data)
    f.close()


print(" End=========================="+str(scriptVersion))
os.system('pause')