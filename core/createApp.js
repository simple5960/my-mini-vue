import { effect } from './reactivity/index.js'
import {diff,mountElement} from './renderer/index.js'
export function createApp(rootComponent)
{
    return {
        //调用createApp方法返回一个mount对象
        mount(rootContainer)
        {
            //组件进入的时候调用组件的setup函数拿到组件的
            //一些依赖的值
            const context=rootComponent.setup();
            //使用一个flag来定义一个subTree是否被挂载过
            //也就是比较新旧节点
            let isMounted=false;
            let preSubTree;
            //然后执行effect函数进行第一次渲染和依赖的收集工作
            effect(()=>{
                
                if(!isMounted)
                {
                    //这是一个初始化的过程
                    rootContainer.innerText="";
                    isMounted=true
                    const subTree=rootComponent.render(context);
                    mountElement(subTree,rootContainer)
                    preSubTree=subTree;
                }
                else
                {
                    //这里是update的流程
                    const subTree=rootComponent.render(context);
                    diff(preSubTree,subTree);
                    preSubTree=subTree;
                }
            })
        }
    }
}