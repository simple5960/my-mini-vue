import { reactive} from './core/reactivity/index.js'
import { createVNode } from './core/virtualDom/h.js'
export default {
    render(context)
    {
      
            //每次渲染之后清空上一次渲染的内容
            return createVNode("div",{
                id:"app-id"+context.state.count,
                class:"show"
            },[createVNode('p',null,String(context.state.count)),createVNode("p",null,"hh")])
            //document.body.append(div);
    },
    setup()
    {
        const state=reactive({
            count:0
        })
        window.state=state;
        return {state};
    }
}
