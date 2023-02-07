/*
 * @Descripttion: 
 * @version: 
 * @Author: liqiang
 * @email: 497232807@qq.com
 * @Date: 2023-02-07 11:16:13
 * @LastEditTime: 2023-02-07 11:17:41
 */

const win = window as any;

export const languages = {
    // Data
    "1": "hello"
};

if (!win.languages) {
    win.languages = {};
}

win.languages.en = languages;
