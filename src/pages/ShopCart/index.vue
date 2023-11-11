<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="cart in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="cart.isChecked===1" @change="upDateChecked(cart,$event)">
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl">
            <div class="item-msg">{{cart.skuName}}</div>
          </li>
          
          <li class="cart-list-con4">
            <span class="price">{{cart.skuPrice}}</span>
          </li>
          <li class="cart-list-con5">
            <a class="mins" @click="handler('minus',-1,cart)">-</a>
            <input autocomplete="off" type="text" :value="cart.skuNum" minnum="1" class="itxt" @change="handler('change',$event.target.value*1,cart)">
            <a class="plus" @click="handler('add',1,cart)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{cart.skuNum*cart.skuPrice}}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deletCartById(cart)">删除</a>
            <br>
            <a>移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isAllChecked&&cartInfoList.length>0" @change="updateAllCartChecked">
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deletAllCheckedCart">删除选中的商品</a>
        <a>移到我的关注</a>
        <a>清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{totalPrice}}</i>
        </div>
        <div class="sumbtn">
          <a class="sum-btn" @click="wantPay">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import throttle from 'lodash/throttle'

  export default {
    name: 'ShopCart',
    mounted() {
      this.getData()
    },
    methods: {
      // 获取个人购物车的数据
      getData(){
        this.$store.dispatch('getCartList')
      },

      // 修改某一个产品的个数  注意添加节流
      handler:throttle(async function(type,disNum,cart){
        // tpye是为了区分这三个元素  
        // 目前disNum形参：+变化量（1）  -变化量（-1）  input是最终的个数并不是变化的量
        // cart 是点击的哪个产品  它的身上有id
        // 最终的目的是向服务器发请求修改数量
        switch(type){
          //加号
          case "add":
            //带给服务器变化的量
            disNum = 1
            break
          case "minus":
            // 判断产品的个数是否大于1，大于1才可以传递给服务器-1
            disNum = cart.skuNum>1?-1:0
            // 如果出现产品的个数小于等于1  那么传递给服务器的个数为0  即原封不动
            break
          case "change":
            // 用户输入的最终量，若是非法的（带有汉字） 或者是复数  需要进行过滤 带给服务器的是0
            if(isNaN(disNum) || disNum<=0)
            {
              disNum = 0
            }else{
              // 正常情况下 用户可能会输入小数  需要进行取整 
              // 注意：带给服务器的是变化的量，需要计算出变化量才能带给服务器
              // 变化量：用户输入进来的量 - 起始的量  就是变化的量
              disNum = parseInt(disNum)-cart.skuNum
            }
            break
        }
          try {
            // 代表的是修改成功
            await this.$store.dispatch('addOrUpdateShopCart',{skuId:cart.skuId,skuNum:disNum})
            // 修改成功再一次获取服务器最新的数据进行展示
            this.getData()
          } catch (error) {}
        },1500),


      // 删除一个购物车里面的产品
      deletCartById(cart){
        /* try {
          await this.$store.dispatch('deletCartListBySkuId',cart.skuId)
          // 如果删除成功  再次发请求获取新的数据
          this.getData()
        } catch (error) {
          alert(error.message)
        } */

        this.$store.dispatch('deletCartListBySkuId',cart.skuId).then(()=>{
          this.getData()
        }).catch((error)=>{
          alert(error.message)
        })
      },

      // 修改某一个产品的勾选状况
      async upDateChecked(cart,event){
        try{
          // 注意带给服务器的checked值应该是0或者1
          await this.$store.dispatch('upDateCheckedById',{skuID:cart.skuId,isChecked:event.target.checked?'1':'0'})
          // 修改成功再次获取服务器数据展示
          this.getData()
        }catch{
          // 如果失败，提示一下
          alert(error.message)
        }
      },

      // 删除全部选中的商品
      async deletAllCheckedCart(){
        try {
          // 这个回调函数没办法收集到有用的数据
          await this.$store.dispatch('deletAllCheckedCart')
          // 再发请求获取购物车列表
          this.getData()
        } catch (error) {
          alert(error.message)
        }
      },

      // 修改全部产品选中的状态
      async updateAllCartChecked(event){
        try {
          let checked  = event.target.checked ? '1' : '0'
          // 派发action
          await this.$store.dispatch('updateAllCartIsChecked',checked)
          this.getData()
        } catch (error) {
          alert(error.message)
        }
      },

      // 结算按钮的点击事件
      wantPay(){
        const token = localStorage.getItem('TOKEN')
        if(token){
          this.$router.push('/trade')
        }else{
          this.$router.push('/login')
        }
      }

    },
    computed:{
      ...mapGetters(['cartList']), //这个数据还不是我们想要的最简化的数据
      // 我们想要的购物车数据
      cartInfoList(){
        return this.cartList.cartInfoList || []
      },
      // 计算购买产品的总价
      totalPrice(){
        let sum = 0;
        // 直接在原数组中找到被选中的算总价即可
        /* this.cartInfoList.forEach(cart => {
          if(cart.isChecked===1)
          {
            sum = sum + cart.skuNum*cart.skuPrice
          }
        }); */


        // 过滤出被选中的再计算其总价
        let newCartInfoList =  this.cartInfoList.filter(cart=>{
          return cart.isChecked === 1
        })

        newCartInfoList.forEach(items => {
          sum = sum + items.skuNum*items.skuPrice
        });
        return sum
      },
      // 判断底部的全选框是否勾选
      isAllChecked(){
        // every方法判断数组中每一项都是否满足条件  ：只要全部元素isChecked属性都是1那么就返回真否则返回假
        return this.cartInfoList.every(item=>item.isChecked===1)
      }
    }
  }
</script>

<style lang="less" scoped>
  .cart {
    width: 1200px;
    margin: 0 auto;

    h4 {
      margin: 9px 0;
      font-size: 14px;
      line-height: 21px;
    }

    .cart-main {
      .cart-th {
        background: #f5f5f5;
        border: 1px solid #ddd;
        padding: 10px;
        overflow: hidden;

        &>div {
          float: left;
        }

        .cart-th1 {
          width: 25%;

          input {
            vertical-align: middle;
          }

          span {
            vertical-align: middle;
          }
        }

        .cart-th2 {
          width: 25%;
        }

        .cart-th3,
        .cart-th4,
        .cart-th5,
        .cart-th6 {
          width: 12.5%;

        }
      }

      .cart-body {
        margin: 15px 0;
        border: 1px solid #ddd;

        .cart-list {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          overflow: hidden;

          &>li {
            float: left;
          }

          .cart-list-con1 {
            width: 15%;
          }

          .cart-list-con2 {
            width: 35%;

            img {
              width: 82px;
              height: 82px;
              float: left;
            }

            .item-msg {
              float: left;
              width: 150px;
              margin: 0 10px;
              line-height: 18px;
            }
          }

          .cart-list-con4 {
            width: 10%;

          }

          .cart-list-con5 {
            width: 17%;

            .mins {
              border: 1px solid #ddd;
              border-right: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }

            input {
              border: 1px solid #ddd;
              width: 40px;
              height: 33px;
              float: left;
              text-align: center;
              font-size: 14px;
            }

            .plus {
              border: 1px solid #ddd;
              border-left: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }
          }

          .cart-list-con6 {
            width: 10%;

            .sum {
              font-size: 16px;
            }
          }

          .cart-list-con7 {
            width: 13%;

            a {
              color: #666;
            }
          }
        }
      }
    }

    .cart-tool {
      overflow: hidden;
      border: 1px solid #ddd;

      .select-all {
        padding: 10px;
        overflow: hidden;
        float: left;

        span {
          vertical-align: middle;
        }

        input {
          vertical-align: middle;
        }
      }

      .option {
        padding: 10px;
        overflow: hidden;
        float: left;

        a {
          float: left;
          padding: 0 10px;
          color: #666;
        }
      }

      .money-box {
        float: right;

        .chosed {
          line-height: 26px;
          float: left;
          padding: 0 10px;
        }

        .sumprice {
          width: 200px;
          line-height: 22px;
          float: left;
          padding: 0 10px;

          .summoney {
            color: #c81623;
            font-size: 16px;
          }
        }

        .sumbtn {
          float: right;

          a {
            display: block;
            position: relative;
            width: 96px;
            height: 52px;
            line-height: 52px;
            color: #fff;
            text-align: center;
            font-size: 18px;
            font-family: "Microsoft YaHei";
            background: #e1251b;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>