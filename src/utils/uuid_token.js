import { v4 as uuidv4 } from 'uuid'
// 要生成一个随机的字符串  且每次执行不能发生变化  而且游客身份要能够持久储存
export const getUUID = ()=>{
    // 先从本地存储中看看是否又UUID
    let uuid_token = localStorage.getItem('UUIDTOKEN')
    // 如果没有那就生成
    if(!uuid_token){
        // 生成游客临时身份
        uuid_token = uuidv4()
        // 本地存存储一次
        localStorage.setItem('UUIDTOKEN',uuid_token)
        // 此次存储过后 后续就不会再次执行这个操作 因为后续从本地存储中获取uuid_token永远不可能为空了
        // 即再也不会进入if中  此后的uuid_token就永远不会改变
    }
    // 没有返回值是undefined
    return uuid_token
}