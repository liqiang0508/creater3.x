/*
 * @Date: 2023-06-07 15:07:48
 * @LastEditors: Lee 497232807@qq.com
 * @LastEditTime: 2023-06-08 15:19:07
 * @FilePath: \cocos_framework_base\assets\LitePool.ts
 */

import { instantiate } from "cc"
import { Component } from "cc"
import { Constructor } from "cc"
import { Prefab,Node} from "cc"
/**
 * 缓存池 缓存组件
 * 
 * 使用方法
 * //创建缓存池
 * var pool = new LitePool(Prefab|Node,Component)
 * //缓存池获取一个
 * var com = pool.get()
 * //缓存池里面放一个
 * pool.put(com)
 * //清空
 * pool.clear()
 * 
 */
export class LitePool<T extends Component> {

    /**
     * 缓存item
     */
    private item: Prefab | Node
    /**
     * 缓存池大小
     */
    private size: number = 0
    /**
     * 缓存组件类名
     */
    private component: Constructor<T>
    /**
     * 缓存数组
     */
    private pool:T[] = []

    /**
     * 
     * @param item 缓存的预制|节点
     * @param component 缓存的组件
     * @param maxSize  缓存最大数量
     */
    constructor(item: Prefab | Node, component: Constructor<T>,maxSize:number = 10) {
        this.item = item
        this.size = maxSize
        this.component = component
    }
    

    /**
     * 缓存池里面取一个出来
     * @returns 
     */
    get():T
    {
        var com = this.pool.pop()
        if(com == null)
        {
            var node = instantiate(this.item) as Node
            com = node.getComponent(this.component) as T
        }
        com.node.active = true
        return com
    }

    /**
     * 缓存池里面放一个进去
     * @param component 
     */
    put(component:T)
    {
        if(this.pool.length<this.size)
        {
            component.node.active = false
            this.pool.push(component)
        }
        else
        {
            component.node.destroy()
        }
    }

    /**
     * 清空缓存池
     */
    clear()
    {
        this.pool.forEach((com:Component,index:number,_)=>{
            com.node.destroy()
        })
        this.pool = []
  
    }
    
}