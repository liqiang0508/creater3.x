import { Vec3, Node, UITransform } from "cc"

/**
 * @name: 获取一个节点的世界坐标
 * @msg: 
 * @param {Node} targetNode 目标节点
 * @return {Vec3}
 */
export function getWorldPos(targetNode: Node): Vec3 {
    var parent_transform = targetNode.parent.getComponent(UITransform)
    var world_pos = parent_transform.convertToWorldSpaceAR(targetNode.getPosition())
    return world_pos
}


/**
 * @name: 将targetNode节点移动到convertNode节点
 * @msg: 
 * @param {Node} targetNode 目标节点
 * @param {Node} convertNode 转换节点
 * @return {Vec3}
 */
export function convert2NodePos(targetNode: Node, convertNode: Node): Vec3 {
    var world_pos = getWorldPos(convertNode)
    var parent_transform = targetNode.parent.getComponent(UITransform)
    var local_pos = parent_transform.convertToNodeSpaceAR(world_pos)
    return local_pos
}