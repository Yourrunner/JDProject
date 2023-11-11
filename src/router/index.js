// 配置路由的地方
import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入后要使用
Vue.use(VueRouter)
import routes from './routes';
// 引入仓库，后续的路由变化过程中会涉及到发请求的操作
import store from '@/store'


// 解决路由跳转点击报错情况
// 先把VueRouter原型对象上的push方法先保存一份
let originPush=VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;
// 重写push|replace方法
VueRouter.prototype.push=function (location,resolve,reject){
  if(resolve&&reject){
    // location 告诉原来的push方法，你往哪里跳转（传递哪些参数）
    originPush.call(this,location,resolve,reject)
    // call||apply的区别
    // 相同点：都可以调用函数一次，都可以篡改函数的上下文一次
    // 不同点：call传递参数的时候要用逗号隔开，apply传递数组
  }
  else{
    originPush.call(this,location,()=>{},(error)=>{error})
  }
}
VueRouter.prototype.replace=function (location,resolve,reject){
  if(resolve&&reject){
    originReplace.call(this,location,resolve,reject)
  }else{
    originReplace.call(this,location,()=>{},(error)=>{error})
  }
}


// 配置路由
const router = new VueRouter({
    // 配置路由 路由从外部引入  k v一直省略v
    routes,
    // 滚动行为
    scrollBehavior(to, from, savedPosition) {
      // 始终滚动到顶部
      return { y: 0 }
      // 返回的y：0代表的是滚动条在最上方  100代表离最上面100像素
    },
})

// 全局守卫:前置守卫（在路由跳转之前进行判断是否能够跳转）
router.beforeEach(async(to,from,next)=>{
  // from：表示从哪个路由开始跳转
  // to:可以获取到你要跳转到哪个路由的信息
  // next：放行函数  next函数直接调用就是直接放行  next()
  // next('/login)  放行指定的路由  next(path)放行到指定的路由  next(false)
  // next()
  // 用户登录了才会有token
  let token = store.state.user.token
  // 用户信息  这个userInfo至少是个空对象，空对象在if判断的时候永远是真  所以要判断它里面的字符串有没有值
  let name = store.state.user.userInfo.name
  if(token){
    // 用户已经登录还想去login 不能放行,停留在当前页面
    if(to.path === '/login'){
      next(false)  //next(false)从哪来回哪去
    }else{
      // 用户登录了 但是去的不是login  放行
      // 在放行之前如果用户名已有
      if(name){
        next()
      }else{
        // 如果放行的时候用户信息没有，则需要再次派发action获取用户信息后在进行跳转
        /* try {
          // 获取用户信息成功
          await store.dispatch('getUserInfo')
          next()
        }catch(Error){
          // token失效了，获取不到信息，清除所有的用户信息（token）,重新登录
          await store.dispatch('userLogOut')
          next('/login')
        } */
        store.dispatch('getUserInfo').then(()=>{
          next()
        }).catch(async (error)=>{
          await store.dispatch('userLogOut')
          next('/login')
        })
      }
    }
  }else{
    // 未登录:不能去交易相关的，不能去支付相关的  pay 和 paysuccess ，还不能去个人中心
    // 未登录去上面的这些路由应该去登录页面 去的不是上面的这些路由就放行  home  search shopcart
    // to.path.indexOf('/pay') !=-1 表示的是 其中包含了pay这个关键字的都跳转到login界面
    let topath = to.path
    if(to.path == '/pay' || to.path.indexOf('/pay') !=-1 || to.path.indexOf('/center') !=-1){
      // 把未登录的时候想去 而没有去成的信息，存储与地址栏中（路由当中）
      next('/login?redirect='+topath)
    }else{
      next()
    }
  }
})

export default router