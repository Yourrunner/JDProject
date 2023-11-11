// 对于axios进行二次封装
import axios from "axios";

// 引入进度条
import nprogress from "nprogress";
// start:进度条开始  done：进度条结束
// 引入进度条的样式
import 'nprogress/nprogress.css'

// 在当前模块中引入srote 
import store from "@/store";



// 1.利用axios对象方法create，去创建一个axios实例
// 2.request其实就是axios，只不过可以稍微配置一下
const requests = axios.create({
    // 配置对象
    baseURL:'http://gmall-h5-api.atguigu.cn/api',  //基础路径  发请求时路径中会出现/api
    timeout:5000,  //代表请求超时时间是5s  超过这个时间请求失败
});

// 请求拦截器：再发请求之前，请求拦截器可以监测到，可以在请求发出去之前做一些事情
requests.interceptors.request.use((config)=>{
    // config：是一个配置对象，对象里面有一个属性很重要，headers请求头
    if(store.state.detail.uuid_token)
    {
        // 给请求头添加字段
        config.headers.userTempId =  store.state.detail.uuid_token
    }
    // 需要将token带给服务器
    if(store.state.user.token)
    {
        // 注意这里面之所以能用store  是在前面通过import引入过
        config.headers.token =  store.state.user.token
    }
    // 此处注意，后端服务器会自行判断，同时有uuid和token的时候以token为主

    // 进度条开始动
    nprogress.start()
    return config
})

// 响应拦截器
requests.interceptors.response.use((res)=>{
    // 成功的回调函数：服务器响应数据回来以后，响应拦截器可以监测到，可以做一些事情

    // 进度条结束
    nprogress.done()
    return res.data
},(err)=>{
    // 响应失败的回调函数
    return Promise.reject(new Error('faile'))
})

export default requests