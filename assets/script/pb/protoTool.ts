/*
 * @Description: 
 * @Author: li qiang
 * @Date: 2021-12-24 15:02:42
 * @LastEditTime: 2023-03-17 13:25:55
 */
// var gameProto = require("gameProto")
export const ProtoTool = {
    //找到pb对象里面的消息体结构
    findObj(obj:Object,key:string){
        if(obj == null || key == null || key.length == 0)
        return null
        
        let arry = key.split(".")
        let message = null
        for (var i = 0; i < arry.length; i++) {
            var key = arry[i]
            if (message) {
                message = message[key]
            } else {
                message = obj[key]
            }
        }
        return message
    },
    /**
     * @description: 
     * @param {string} pak  编解码协议
     * @param {any} data    编码数据
     * @param {any} protojs 编码pbjs对象 
     * @return {Uint8Array}
     */
    encode: function (data:any,protojs:any):Uint8Array {
        if(data == null || protojs ==null)
        {
            return null
        }
        else
        {
            var bytesData:Uint8Array
            bytesData = protojs.create(data)
            bytesData = protojs.encode(bytesData).finish()
            return bytesData
        }
    },
    
    /**
     * @description: 
     * @param {string} pak 编解码协议
     * @param {any} bytes  解码数据
     * @param {any} protojs 解码pbjs对象 
     * @return {any}
     */
    decode: function (bytes:any,protojs:any):any {
        if(bytes == null || protojs ==null)
        {
            return null
        }
        else
        {
            var  res = protojs.decode(new Uint8Array(bytes))
            return res
        }
    },

    Uint8ArrayToString: function (fileData:Uint8Array):string {
        var dataString = "";
        for (var i = 0; i < fileData.length; i++) {
            dataString += String.fromCharCode(fileData[i]);
        }
        return dataString
    },

    stringToUint8Array: function (str:string):Uint8Array {
        var arr = [];
        for (var i = 0, j = str.length; i < j; ++i) {
            arr.push(str.charCodeAt(i));
        }
        var tmpUint8Array = new Uint8Array(arr);
        return tmpUint8Array
    },

}

