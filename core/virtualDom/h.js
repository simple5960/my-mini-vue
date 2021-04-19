//创建一个virtualDOM
//因为是用js创建的,最好叫一个虚拟的节点
//一个虚拟节点接收 tag、props、children
export function createVNode(tag,props,children)
{
    return { tag,props,children }
}