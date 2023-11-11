import {reqCategoryList,reqGetBannerList,reqGetFloorList} from '@/api'

// home小仓库
const state = {
    // state中数据的默认初始值不能乱写，服务器返回什么类型，起始数据就是什么类型
    categoryList:[],
    bannerList:[],
    floorList:[]
}
const mutations = {
    CATEGORYLIST(state,categoryList){
        state.categoryList = categoryList
    },
    GETBANNERLIST(state,bannerList){
        state.bannerList = bannerList
    },
    GETFLOORLIST(state,floorList)
    {
        state.floorList = floorList
    }
}
const actions = {
    // 通过api里面的接口函数调用，向服务器发送请求，获取数据
    async category({commit}){
        let result = await reqCategoryList()
        if(result.code === 200)
        {
            commit('CATEGORYLIST',result.data)
        }
    },
    // 获取首页轮播图的数据  注意是异步获取
    async getBanner({commit}){
        let result = await reqGetBannerList()
        if(result.code === 200)
        {
            commit('GETBANNERLIST',result.data)
        }
    },
    async getFloor({commit}){
        let result = await reqGetFloorList()
        if(result.code === 200)
        {
            commit('GETFLOORLIST',result.data)
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