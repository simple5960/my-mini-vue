function diff(n1,n2)
{
    //n1=preSubTree  n2=curSubTree
    //1.tag变化
    if(n1.tag!==n2.tag)
    {
        n1.el.replaceWith(document.createElement(n2.tag));
    }

    //2.props变化
    else
    {
        //交换新旧节点的element
        const el=(n2.el=n1.el);//el=n2.el
        const {props:newProps}=n2;
        const {props:oldProps}=n1;
        //新老节点的props数量一样的情况
        if(newProps&&oldProps)
        {
            Object.keys(newProps).forEach(key=>{
                const newValue=newProps[key];
                const oldValue=oldProps[key];
                console.log(newValue,oldValue);
                if(newValue!=oldValue)
                {
                    n1.el.setAttribute(key,newValue);
                }
            })
        }
        //新老节点的props的数量不一样
        if(oldProps)
        {
            Object.keys(oldProps).forEach(key=>{
                if(!newProps[key])
                {
                    //在老节点中删除
                    n1.el.removeAttribute(key);
                }
            })
        }
    }

    //3.children改变
    //1.newChildren-> string  (old:string   old:Array)
    //2.newChildren-> array   (old:string   old:array)
    const {children:newChildren=[]}=n2;
    const {children:oldChildren=[]}=n1;
    if(typeof newChildren=="string")
    {
        if(typeof oldChildren=="string")
        {
            if(newChildren!=oldChildren)
            {
                n2.el.textContent=newChildren
            }
        }
        else if(Array.isArray(oldChildren))
        {
            n2.el.textContent=newChildren
        }
    }
    else if(Array.isArray(newChildren))
    {
        if(typeof oldChildren=="string")
        {
            //清空老节点的内容
            n2.el.innerText=``;
            mountElement(n2,el);
        }
        else if(Array.isArray(oldChildren))
        {
            const length=Math.min(oldChildren.length,newChildren.length);
            for(let index=0;index<length;index++)
            {
                const newVnode=newChildren[index];
                const oldVnode=oldChildren[index];
                diff(oldVnode,newVnode);
            }
            if(newChildren.length>length)
            {
                //创建节点
                for(let index=length;index<newChildren.length;index++)
                {
                    const newVnode=newChildren[index];
                     mountElement(newVnode);
                }
            }
            if(oldChildren.length>length)
            {
                //删除节点
                for(let index=length;index<oldChildren.length;index++)
                {
                    const oldVnode=oldChildren[index];
                    oldVnode.el.parent.removeChild(oldVnode.el);
                }
            }
        }
    }
}
function mountElement(vnode,container)
{
    //vnode->tag,props,children

    //tag
    const {tag,props,children}=vnode;
    const element=(vnode.el=document.createElement(tag));

    //props
    if(props)
    {
        //一个element可能有很多的prop,需要遍历
        for(const key in props)
        {
            const value=props[key];
            element.setAttribute(key,value);
        }
    }

    //children->可以字符串和 数组类型的children
    if(typeof children ==="string")
    {
        const textNode=document.createTextNode(children);
        element.append(textNode);
    }
    //children是一个数组
    else if(Array.isArray(children))
    {
        children.forEach(vnode=>{
            //在当前的element容器中递归调用‘
            //并且挂载到当前的容器上去
            mountElement(vnode,element);
        })
    }
    container.append(element);
}
export {diff,mountElement}