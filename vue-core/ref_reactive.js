//ref逻辑
//接收一个简单值 对value进行修改的1时候会触发依赖收集  依赖触发
class ref{
    //接收value
    constructor(val){
        this._val = val
        this.deplist = new Set()
        //依赖列表
    }
    //读取value时 如果是一个函数在读取 那么把这个函数添加到响应式依赖列表
    get value(){
        //存在活跃函数吗
        // if(activefn){
        //     this.deplist.add(activefn)
        // }
        // for(let item of this.deplist){
        //     console.log(item)
        // }
        this.depend()
        // 此处记得返回的是内部属性 如果返回包装属性value 那么会造成栈溢出
        return Reflect.get(this,'_val')
    }
    // 设置value的时候 修改val 触发所有依赖函数 先修改 再触发
    set value(val){
        this._val = val
        // for(let item of this.deplist){
        //     // console.log(item)
        //     item()
        // }
        this.notice()
    }
    // 讲添加依赖 触发依赖 封装成函数
    depend(){
        if(activefn){
            this.deplist.add(activefn)
        }
    }
    notice(){
        for(let item of this.deplist){
            // console.log(item)
            item()
        }
    }
}

//当前的活跃函数
let activefn = null

//经过编译器编译的函数 都会被一个包装函数：watchEffect包装
function watchEffect(fn){
    //活跃函数标记成这个函数
    activefn = fn
    //调用函数 如果这个函数内部使用了ref 那么会触发ref的get操作 在get操作内部就会把这个函数添加到依赖列表
    fn()
    activefn = null
}

// 键为对象 值为对象属性和依赖函数的映射关系
let objectMap = new Map()




function find(raw,key){
    let depMap = objectMap.get(raw)
    // 不存在则创建
    if(!depMap){
        depMap = new Map()
    }
    objectMap.set(raw,depMap)
    // 找到这个属性对应的依赖集合
    let effectsSet = depMap.get(key)
    if(!effectsSet){
        effectsSet = new Set()
        depMap.set(key,effectsSet)
    }
    return effectsSet
}
// 代理对象
function reactive(raw){
    return new Proxy(raw,{
        get(target,key){
            // 找到这个对象的映射关系
            let effectsSet = find(raw,key)
            if(activefn){
                effectsSet.add(activefn)
            }
            return Reflect.get(target,key)
        },
        set(target,key,val){
            // 修改对应属性
            Reflect.set(target,key,val)
            // console.log(val);
            // 找到这个对象的映射关系
            let effectsSet = find(raw,key)
            for(let item of effectsSet){
                item()
            }
            return true
        }
    })
}



export {ref,watchEffect,reactive}