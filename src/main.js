import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from './router'

// 引入仓库
import store from '@/store'

// 三级联动的组件  注册为全局组件
import Pagination from '@/components/Pagination'
import TypeNav from '@/components/TypeNav'
import Carousel from '@/components/Carousel'
// 第一个参数：全局组件的名字，第二个参数：哪一个组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name, Pagination)

// 引入mockserve.js的
import '@/mock/mockServe';
// 引入swiper样式
import 'swiper/css/swiper.css'

// 引入懒加载插件
import VueLazyload from 'vue-lazyload'
import gif from '@/assets/1.gif'
// 注册插件
Vue.use(VueLazyload,{
  // 懒加载默认的图片
  loading: gif
})

Vue.config.productionTip = false

// 统一接收api文件夹里面全部请求函数
// 统一引入
import * as API from '@/api'

// 按需引入elementui  elementui注册组件可以挂载在原型上
import { Button, MessageBox, Message } from 'element-ui';
Vue.component(Button.name, Button)
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

new Vue({
  render: h => h(App),
  // 注册路由 ： 当这里书写router 的时候 组件身上都拥有$route，$router属性
  router,
  // 注册仓库：组件实例的身上会多一个属性$store属性
  store,

  // 配置全局事件总线$bus
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$API = API
  }
}).$mount('#app')
