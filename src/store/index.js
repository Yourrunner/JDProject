import Vue from "vue";
import Vuex from 'vuex'
// 使用插件一次
Vue.use(Vuex);

/* // state：仓库中数据存储的地方
const state = {
    count:1,
}
// mutation：修改state的唯一手段
const mutations = {
    add(state){
        state.count ++
    },
    decrease(state){
        state.count --
    }
}
// action：处理action，可以书写自己的业务逻辑，也可以处理异步操作
const actions = {}
// getters：可以理解为计算属性
const getters = {} */

// 引入小仓库
import home from './Home'
import search  from './Search'
import detail from './Detail'
import shopcart from './ShopCart'
import user from './User'
import trade from './Trade'
import test from './test'

// 对外暴露store类的一个实例
export default new Vuex.Store({
   modules:{
    home,
    search,
    detail,
    shopcart,
    user,
    trade,
    test
   }
})