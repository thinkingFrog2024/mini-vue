import { h } from "../../../../lib/vue.esm.js";
window.self = null
export default {
    render(){
        window.self = this
        // 在这个地方获取￥el得到的结果是null 因为￥el是在所有子节点完成挂载之后初始化的
        return h('div',{nae:'s'},[h('p',{class:'red'},'我是第一个p'),h('p',{class:'blue'},this.a)])
    },  
    setup(){
        return{
            a:'1'
        }
    }
}