import { reqGoodsInfo,reqAddOrUpdateShopCart} from "@/api"
// 封装临时游客身份的模块 uuid------>生成一个随机的字符串（不能再变化了）
import {getUUID} from '@/utils/uuid_token'
const state = {
    goodInfo:{},
    // 游客的临时身份
    uuid_token:getUUID()
} 
const mutations = {
    GETGOODINFO(state,goodInfo){
        state.goodInfo = goodInfo
    }
}
const actions = {
    // 获取产品信息的action
    async getGoodInfo({commit},skuId){
        let result = await reqGoodsInfo(skuId)
        if(result.code === 200)
        {
            // 提交mutation 修改state
            commit('GETGOODINFO',result.data)
        }
    },
    async addOrUpdateShopCart({commit},{skuId,skuNum}){
        // 加入购物车返回的结果
        // 加入购物车之后，前台将数据带给服务器
        // 服务器写入书记成功，并没有返回其他的数据 只要Code=200，就是添加成功  不需要三连环存储数据
        let result =  await reqAddOrUpdateShopCart(skuId,skuNum)
        // 注意函数加了async返回的一定是一个promise 要么成功，要么失败
        if(result.code === 200){
            // 代表服务器加入购物车成功，要返回一个成功的promise
            return 'Success'
        }else{
            // 代表加入购物车失败
            return Promise.reject(new Error('faile'))
        }
    }
}

// 为简化数据而生
const getters = {
    // 路径导航简化的数据
    categoryView(state){
        // 比如state.goodInfo初识状态是一个空对象，空对象没有categoryView这个属性，所以是undefined
        return  state.goodInfo.categoryView || {}
        // 这样写可以让当前计算出来的属性的属性值至少是一个空对象，就不会有假的报错
    },
    // 简化产品信息的数据
    skuInfo(state){
        return state.goodInfo.skuInfo || {}
    },
    // 产品售卖属性的简化
    spuSaleAttrList(state){
        return state.goodInfo.spuSaleAttrList || []
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}