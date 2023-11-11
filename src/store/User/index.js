import { reqGetCode,reqUserRegister,reqUserLogin,reqUserInfo,reqLogout} from '@/api'
import {setToken,getToken,removeToken} from '@/utils/token'

const state = {
    code:'',
    token:getToken(),
    userInfo:{}
} 
const mutations = {
    GETCODE(state,code){
        state.code = code
    },
    USERLOGIN(state,token){
        state.token = token
    },
    GETUSERINFO(state,userInfo){
        state.userInfo = userInfo
    },

    // 清除本地数据
    CLEAR(state){
        state.token = ''
        state.userInfo = ''
        removeToken()
    }
}
const actions = {
    // 获取验证码
    /* async getCode({commit},phone){
        // 获取验证码的接口，把验证码返回了，但是正常情况应该是后台把验证码发到用户手机上
        let result =  await reqGetCode(phone)
        if(result.code===200){
            commit('GETCODE',result.data)
            return 'ok'
        }else{
            return Promise.reject(new Error('faile'))
        }
    } */

    // 获取验证码
    async getCode({commit},phone){
        const result =  await reqGetCode(phone)
        if(result.code === 200)
        {
            commit('GETCODE',result.data)
            return 'ok'
        }else{
            return Promise.reject(new Error('faile'))
        }
    },

    // 用户注册
    async userRegister({commit},user){
        let result =  await reqUserRegister(user)
        if(result.code === 200){
            return Promise.resolve()
        }else{
            return Promise.reject(new Error('faile'))
        }
    },

    //用户登录
    async userLogin({commit},user){
        let result =  await reqUserLogin(user)
        console.log(result)
        if(result.code === 200){
            // 服务器下发的token是某个用户的唯一标识符
            // 将来经常通过带token找服务器要信息展示数据
            // 用户以及获取到了token
            commit('USERLOGIN',result.data.token)
            // 持久化存储token
            setToken(result.data.token)
            return  'ok'
        }else{
            return Promise.reject(new Error('登录失败'))
        }
    },

    // 获取用户信息
    async getUserInfo({commit}){
        let result = await reqUserInfo()
        if(result.code === 200){
            commit('GETUSERINFO',result.data)
            return 'ok'
        }else{
            return Promise.reject(new Error('失败'))
        }
    },

    // 退出登录
    async userLogOut({commit}){
        // 只是向服务器发请求通知服务器清除服务器的token
        let result =  await reqLogout()
        if(result.code === 200){
            commit('CLEAR')
            return 'ok'
        }else{
            return Promise.reject(new Error('faile'))
        }
    }
}
const getters = {} 

export default {
    state,
    mutations,
    actions,
    getters,
}