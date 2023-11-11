// 此模块对所有ApI接口统一管理
import requests from "./request";
import mockRequest from './mockAjax'

// 三级联动接口
// 发请求:axios发请求返回的结果是Promise对象
export const reqCategoryList = ()=> requests({url:'/product/getBaseCategoryList',method:'get'})

// 获取banner图（home首页轮播图接口）
export const reqGetBannerList = ()=> mockRequest.get('/banner')

// 获取FLoor图
export const reqGetFloorList = ()=>mockRequest.get('/floor')

//获取搜索模块的数据 地址/api/list 方式post 需要携带参数
/* 
{
  "category3Id": "61",
  "categoryName": "手机",
  "keyword": "小米",
  "order": "1:desc",
  "pageNo": 1,
  "pageSize": 10,
  "props": ["1:1700-2799:价格", "2:6.65-6.74英寸:屏幕尺寸"],
  "trademark": "4:小米"
}
 */
// 当前的这个接口给服务器传递的参数至少是一个空对象
export const reqGetSearchInfo = (params)=>requests.post('/list',params)

// 获取产品详情信息的接口  地址 /api/item/{ skuId } 方式 Get 需要携带产品id这一个参数 必须要带
export const reqGoodsInfo = (skuId) => requests.get(`/item/${skuId}`)

// 将产品添加到购物车中或者更新某一个产品的个数 /api/cart/addToCart/{skuId}/{skuNum}
export const reqAddOrUpdateShopCart = (skuId,skuNum)=> requests.post(`/cart/addToCart/${skuId}/${skuNum}`)

// 获取购物车列表数据的接口   /api/cart/cartList  GET  没有参数
export const reqCartList = () => requests.get('/cart/cartList')

// 删除购物车产品的接口   /api/cart/deleteCart/{skuId}
export const reqDeletCartById = (skuId) => requests.delete(`/cart/deleteCart/${skuId}`)

// 切换商品选中状态    /api/cart/checkCart/{skuID}/{isChecked}  GET
export const reqUpdateCheckedById = (skuID,isChecked) => requests.get(`/cart/checkCart/${skuID}/${isChecked}`)

// 获取验证码 /api/user/passport/sendCode/{phone} get
export const reqGetCode = (phone) => requests.get(`/user/passport/sendCode/${phone}`)

// 注册  /api/user/passport/register post  
export const reqUserRegister = (data) => requests.post('/user/passport/register',data)

// 登录  /api/user/passport/login phone password
export const reqUserLogin = (data) => requests.post('/user/passport/login',data)

// 获取用户的信息[需要携带用户的token向服务器发请求] /api/user/passport/auth/getUserInfo  get
export const reqUserInfo = () => requests.get('/user/passport/auth/getUserInfo')

// 退出登录  /api/user/passport/logout GET
export const reqLogout = ()=> requests.get('/user/passport/logout')

// 获取用户地址信息  /api/user/userAddress/auth/findUserAddressList
export const reqAddressInfo = ()=>requests.get('/user/userAddress/auth/findUserAddressList')

// 获取商品清单  /api/order/auth/trade get
export const reqOrderInfo = ()=> requests.get('/order/auth/trade')

// 提交订单  /api/order/auth/submitOrder?tradeNo={tradeNo} post
export const reqSubmitOrder = (tradeNo,data)=> requests.post(`/order/auth/submitOrder?tradeNo=${tradeNo}`,data)

// 获取支付信息  /api/payment/weixin/createNative/{orderId} GET
export const reqPayInfo = (orderId) => requests.get(`/payment/weixin/createNative/${orderId}`)

// 获取支付订单状况  /api/payment/weixin/queryPayStatus/{orderId}
export const reqPayStatus = (orderId)=> requests.get(`/payment/weixin/queryPayStatus/${orderId}`)

// 获取我的订单列表  /api/order/auth/{page}/{limit}  get 
export const reqMyorderList  = (page,limit) =>requests.get(`/order/auth/${page}/${limit}`)