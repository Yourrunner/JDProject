// 路由配置信息
// 引入一级路由组件
// import Home from '@/pages/Home'
// import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import Paysuccess from '@/pages/PaySuccess'
import Center from '@/pages/Center'
// 二级路由组件
import MyOrder from '@/pages/Center/myOrder'
import GroupOrder from '@/pages/Center/groupOrder'



// 当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。
// 即当访问某个组件的时候，再去加载这个组件  非常高效
// 在常规写法中 引入组件的时候，组件就已经加载，即使组件当时还没有显示，但是实际上它已经加载

/* const foo = ()=>{
    console.log(1111111111)
    return import('@/pages/Home')
} */

// 简化版（组件懒加载技术）
const Home = ()=>import('@/pages/Home')
const Search = ()=>import('@/pages/Search')

export default [
    {
        path: '/center',
        component: Center,
        meta: { show: true },
        // 二级路由组件
        children:
            [
                {
                    // 注意二级路由的写法
                    path: '/center/myorder',
                    // 或者 path:'myorder'
                    component: MyOrder,
                },
                {
                    // 注意二级路由的写法
                    path: 'groupOrder',
                    // 或者 path:'myorder'
                    component: GroupOrder,
                },
                // 重定向
                {
                    path: '/center',
                    redirect: 'myorder'
                }
            ]
    },
    {
        path: '/paysuccess',
        component: Paysuccess,
        meta: { show: true },
        /*  beforeEnter: (to, from, next) => {
            if(from.path == '/pay'){
                next()
            }else{
                next(false)
            }
        } */
        // 在paysuccess中写了组件内守卫
    },
    {
        path: '/pay',
        component: Pay,
        meta: { show: true },
        beforeEnter: (to, from, next) => {
            // 想去支付页面必须从交易页面跳转
            if(from.path == '/trade'){
                next()
            }else{
                next(false)
            }
        }        
    },
    {
        path: '/trade',
        component: Trade,
        meta: { show: true },
        // 想去交易页面  必须得是从购物车而来
        beforeEnter: (to, from, next) => {
            // 路由独享守卫
            if(from.path == '/shopcart'){
                next()
            }else{
                // next(false) 
                // 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
                // 即从哪来回哪去
                next(false)
            }
        }
    },
    {
        path: '/home',
        component: Home,
        meta: { show: true }
    },
    {
        path: '/addcartsuccess',
        name: 'addcartsuccess',
        component: AddCartSuccess,
        meta: { show: true }
    },
    {
        path: '/shopcart',
        component: ShopCart,
        meta: { show: true }
    },
    {
        path: '/detail/:skuid',
        component: Detail,
        meta: { show: true }
    },
    {
        path: '/search/:keyword?',
        component: Search,
        name: 'search',
        meta: { show: true },
        // 路由组件可以传递props数据
        // 布尔值写法，只要params参数
        // props:true
        // 对象写法
        // props:{a:1,b:2}
        // 函数写法：可以把params参数，query参数，通过props传递给路由组件
        // props:($route)=>{
        //     return {keyword:$route.params.keyword,k:$route.query.k}
        // }
    },
    {
        path: '/login',
        component: Login,
        meta: { show: false }
    },
    {
        path: '/register',
        component: Register,
        meta: { show: false }
    },
    // 重定向，在项目跑起来的时候，访问/ 立马让他定向到首页(home)
    {
        path: '/',
        redirect: '/home',
    },
]