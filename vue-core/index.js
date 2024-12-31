import {ref,watchEffect,reactive} from './ref_reactive.js'
let a = new ref(1000)
let ob = {
    a:1
}
let obj = reactive(ob)

watchEffect(function dele(){
    console.log(obj.a)
})
watchEffect(function add(){
    // console.log(a.value+10);
})
a.value = 1
obj.a = 2
obj.a=5


// 把响应式数据应用在视图上面
// 响应式数据应该是