/*
 * @Descripttion: 
 * @version: 
 * @Author: liqiang
 * @email: 497232807@qq.com
 * @Date: 2022-02-10 13:44:32
 * @LastEditTime: 2022-02-10 17:13:40
 */

var CMD: any = {};
var CMD2PB: any = {};
CMD.Login = 100
CMD2PB[CMD.Login] = { name: "Login", pak: "tutorial.Person", file: "addressbook.pb" }
CMD.Login1 = 101
CMD2PB[CMD.Login1] = { name: "Login1", pak: "tutorial.Person", file: "addressbook.pb" }
CMD.Login2 = 102
CMD2PB[CMD.Login2] = { name: "Login2", pak: "tutorial.Person", file: "addressbook.pb" }

// globalThis.CMD = CMD
// globalThis.CMD2PB = CMD2PB
export { CMD, CMD2PB }
