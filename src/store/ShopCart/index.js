import {reqCartList,reqDeletCartById,reqUpdateCheckedById} from '@/api'

const state = {
    cartList:[]
}
const mutations = {
    GETCARTLIST(state,cartList){
        state.cartList =cartList
    }
}
const actions = {
    // 获取购物车列表的数据
    async getCartList({commit}){
        let result =  await reqCartList()
        if(result.code)
        {
            commit('GETCARTLIST',result.data)
        }
    },
    // 删除购物车某一个产品 
    async deletCartListBySkuId({commit},skuId){
        let result =  await reqDeletCartById(skuId)
        if(result.code === 200)
        {
            return 'ok'
        }else{
            return Promise.reject(new Error('faile'))
        }
    },
    // 修改购物车某个产品选中状态
    async upDateCheckedById({commit},{skuID,isChecked}){
        let result =  await reqUpdateCheckedById(skuID,isChecked)
        if(result.code === 200)
        {
            return 'ok'
        }else{
            return Promise.reject(new Error('faile'))
        }
    },

    // 删除全部勾选的产品
    deletAllCheckedCart({dispatch,getters,state,commit}){
        // console.log(context)
        // context :小仓库，里面有commit  dispatch state getters
        // 获取购物车当中全部的产品  是一个数组
        let promiseAll = []
        getters.cartList.cartInfoList.forEach(item => {
            let promise = item.isChecked===1?dispatch('deletCartListBySkuId',item.skuId):''
            // 将每一次产生的promise放入数组
            promiseAll.push(promise)
        });
        // 只要全部的p1|p2|...都成功，返回结果成功，如果有一个失败，返回的即为失败结果
        return Promise.all(promiseAll)
    },

    // 修改全部产品的选中状态
    updateAllCartIsChecked({dispatch,state},isChecked){
        let PromiseAll = []
        state.cartList[0].cartInfoList.forEach(item => {
            let promise =  dispatch('upDateCheckedById',{skuID:item.skuId,isChecked})
            PromiseAll.push(promise)
        });
        return Promise.all(PromiseAll)
    }
}
const getters = {
    cartList(state){
        return state.cartList[0] || {}
    },
    // 我们想要的计算出来的购物车的数据
    cartInfoList(state){
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}