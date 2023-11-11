// search小仓库
import {reqGetSearchInfo} from '@/api'

const state = {
    searchList:{}
}
const mutations = {
    GETSEARCHLIST(state,searchList){
        state.searchList = searchList
    }
}
const actions = {
    // 获取search模块的数据
    async getSearchList({commit},params={}){
        // 当前这个函数在调用的时候至少传递一个参数
        // params是用户派发Action的时候第二个参数
        let result =  await reqGetSearchInfo(params)
        if(result.code === 200)
        {
            commit('GETSEARCHLIST',result.data)
        }
    }
}
// 计算属性,在项目当中为了简化数据而生
const getters = {
    // 在项目之中getters主要作用是简化仓库中的数据
    // 把我们将来在组件当中需要用的数组简化一下  组件在获取数组的时候会非常方便
    goodsList(state){
        // 这个state是当前仓库中的state并非大仓库中的state
        // 如果服务器数据回来了,没问题,是一个数组
        // 假如网络不好,没有网 则会返回的是undefined
        // 计算属性的属性值至少给一个数组,否则后续遍历会出问题
        return state.searchList.goodsList || []
    },
    trademarkList(state){
        return state.searchList.trademarkList || []
    },
    attrsList(state){
        return state.searchList.attrsList || []
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
}